import json
import random
import string

from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from psycopg import Connection, connect

from utils import get_envs, debinarify_amenities, binarify_amenities, denumerify_beds, current_date, get_end_of_stay_date
from dbutils import update_availability


class ClientMovingIn(BaseModel):
    customer_name: str
    room_number: int
    stay_duration: int

class ClientMovingOut(BaseModel):
    room_number: int

class ClientChangingRooms(BaseModel):
    old_number: int
    new_number: int
    remaining_stay_duration: int
    customer_name: str

class FilterRequest(BaseModel):
    name: str
    capacity: int
    amenities: list[str]
    beds: str
    stars: int
    stay_duration: int

class AccidentData(BaseModel):
    room_number: int
    description: str

class DirectDBRequest(BaseModel):
    request: str

class DBUtils:

    @classmethod
    def get_availabile_rooms(cls, connection: Connection) -> list[list]:
        cursor = connection.cursor()
        cursor.execute("""SELECT room_number, MIN(GREATEST(check_in_date - CURRENT_DATE, 0)) AS days_until_reserved FROM reservations WHERE check_in_date > CURRENT_DATE GROUP BY room_number ORDER BY days_until_reserved;""")
        available_rooms: list[list[str]] = []
        for row in cursor:
            available_rooms.append([row[0], row[1]])
        return available_rooms

class KeycardHandler:
    
    @classmethod
    def generate_code(cls) -> str:
        return ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(30))

class MainRouter:

    def __init__(self, connection: Connection):
        self.router = APIRouter()
        self.connection = connection
        self.router.add_api_route("/", self.get_all_rooms, methods=["GET"])
        self.router.add_api_route("/", self.get_filtered_rooms, methods=["POST"])
        self.router.add_api_route("/move-in", self.move_in, methods=["POST"])
        self.router.add_api_route("/payment", self.process_payment, methods=["GET"])
        self.router.add_api_route("/move-out", self.move_out, methods=["POST"])
        self.router.add_api_route("/move", self.move, methods=["POST"])
        self.router.add_api_route("/accident", self.accident, methods=["POST"])
        self.router.add_api_route("/db-request", self.dbrequest, methods=["POST"])

    def get_all_rooms(self):
        cursor = self.connection.cursor()
        cursor.execute("""SELECT number, name, capacity, amenities, beds, stars FROM rooms AS R JOIN room_types AS rt ON r.type=rt.id WHERE is_taken='f' ORDER BY name;""")
        response = []
        current_room = ''
        current_count = 0
        room_numbers = []
        for row in cursor:
            if current_room == row[1]:
                current_count += 1
                room_numbers.append(row[0])
            else:
                if current_room != '':
                    res_dict = {'room_numbers': room_numbers,
                        'name': current_room,
                        'capacity': capacity,
                        'amenities': amenities,
                        'beds': beds,
                        'stars': stars,
                        'count': current_count}
                    response.append(res_dict)
                room_numbers = []
                current_room = row[1]
                current_count = 1
                room_numbers.append(row[0])
                capacity = row[2]
                amenities = debinarify_amenities(row[3])
                beds = denumerify_beds(row[4])
                stars = row[5]
        cursor.close()
        return response

    def get_filtered_rooms(self, filter: FilterRequest):
        room_filters: list[str] = []

        room_availability = DBUtils.get_availabile_rooms(self.connection)
        available_rooms: list[int] = []
        for room in room_availability:
            if room[1] >= filter.stay_duration:
                available_rooms.append(room[0])

        if filter.amenities != []:
            amenity_string = binarify_amenities(filter.amenities)
            room_filters.append(f"""amenities LIKE '{amenity_string}'""")

        if filter.name != '':
            room_filters.append(f"""name LIKE E'%{filter.name}%'""")
        
        if filter.capacity != 0:
            room_filters.append(f"""capacity>={filter.capacity}""")
        
        if filter.beds != '':
            room_filters.append(f"""beds LIKE '%{filter.beds}%'""")
        
        if filter.stars != 0:
            room_filters.append(f"""stars = {filter.stars}""")

        query = f"""SELECT number, name, capacity, amenities, beds, stars FROM rooms AS R JOIN room_types AS rt ON r.type=rt.id WHERE number IN {tuple(available_rooms)}"""
        for room_filter in room_filters:
            query = query + " AND " + room_filter
        query += ' ORDER BY name;'
        cursor = self.connection.cursor()
        cursor.execute(query)
        response = []
        current_room = ''
        current_count = 0
        room_numbers = []
        for row in cursor:
            if current_room == row[1]:
                current_count += 1
                room_numbers.append(row[0])
            else:
                if current_room != '':
                    res_dict = {'room_numbers': room_numbers,
                        'name': current_room,
                        'capacity': capacity,
                        'amenities': amenities,
                        'beds': beds,
                        'stars': stars,
                        'count': current_count}
                    response.append(res_dict)
                room_numbers = []
                current_room = row[1]
                current_count = 1
                room_numbers.append(row[0])
                capacity = row[2]
                amenities = debinarify_amenities(row[3])
                beds = denumerify_beds(row[4])
                stars = row[5]
        cursor.close()
        return response
    
    def move_in(self, data: ClientMovingIn):
        cursor = self.connection.cursor()
        try:
            cursor.execute(f"""INSERT INTO customers VALUES (DEFAULT, '{data.customer_name}');""")
        finally:
            pass
        cursor.execute(f"""SELECT id  FROM customers WHERE name = '{data.customer_name}';""")
        customer_id = cursor.fetchone()[0]
        cursor.execute(f"""INSERT INTO reservations VALUES (DEFAULT, {data.room_number}, '{current_date()}', '{get_end_of_stay_date(data.stay_duration)}', {customer_id});""")
        cursor.execute(f"""UPDATE rooms SET is_taken='t' WHERE number={data.room_number};""")
        connection.commit()
        cursor.close()
        print(KeycardHandler.generate_code())
        return {'status': 0}
    
    def process_payment(self):
        return {"status": 0}
    
    def move_out(self, room: ClientMovingOut):
        cursor = connection.cursor()
        cursor.execute(f"""UPDATE reservations SET check_out_date='{current_date()}' WHERE room_number={room.room_number}""")
        cursor.execute(f"""UPDATE rooms SET is_taken='f' WHERE number={room.room_number};""")
        connection.commit()
        cursor.close()
        return {"status": 0}
    
    def move(self, data: ClientChangingRooms):
        cursor = self.connection.cursor()
        cursor.execute(f"""UPDATE reservations SET check_out_date='{current_date()}' WHERE room_number={data.old_number}""")
        cursor.execute(f"""UPDATE rooms SET is_taken='f' WHERE number={data.old_number};""")
        cursor.execute(f"""SELECT id  FROM customers WHERE name = '{data.customer_name}'""")
        customer_id = cursor.fetchone()[0]
        cursor.execute(f"""INSERT INTO reservations VALUES (DEFAULT, {data.new_number}, '{current_date()}', '{get_end_of_stay_date(data.remaining_stay_duration)}', {customer_id});""")
        cursor.execute(f"""UPDATE rooms SET is_taken='t' WHERE number={data.new_number};""")
        connection.commit()
        cursor.close()
        return {"status": 0}

    def accident(self, data:AccidentData):
        with open('accidents.txt', 'a') as file:
            file.write(f"""{data.room_number}#{data.description}""")
        return {'status': 0}
    
    def dbrequest(self, data:DirectDBRequest):
        cursor = connection.cursor()
        match data.request:
            case '0':
                cursor.execute(f"""SELECT * FROM rooms;""")
                res = cursor.fetchall()
            case '1':
                cursor.execute(f"""SELECT * FROM room_types;""")
                res = cursor.fetchall()
            case '2':
                cursor.execute(f"""SELECT * FROM customers;""")
                res = cursor.fetchall()
            case '3':
                cursor.execute(f"""SELECT * FROM reservations;""")
                res = cursor.fetchall()
            case _:
                try:
                    cursor.execute(data.request)
                    res = cursor.fetchall()
                finally:
                    cursor.close()
        return res




app = FastAPI()
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
connection_data = get_envs()
update_availability(connection_data)
connstring = "host=" + connection_data[0] + " port=" + connection_data[1] + " dbname=" + connection_data[2] + " connect_timeout=10 user=" + connection_data[3] + " password=" + connection_data[4]
connection = connect(conninfo=connstring)
myRouter = MainRouter(connection)
app.include_router(myRouter.router)
