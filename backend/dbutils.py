import psycopg

from utils import get_envs


def update_availability(connection_data: tuple[str, str, str, str, str]) -> None:
    connstring = "host=" + connection_data[0] + " port=" + connection_data[1] + " dbname=" + connection_data[2] + " connect_timeout=10 user=" + connection_data[3] + " password=" + connection_data[4]
    connection = psycopg.connect(conninfo=connstring)
    cursor = connection.cursor()
    cursor.execute("""SELECT r.room_number, CASE WHEN CURRENT_DATE BETWEEN r.check_in_date AND r.check_out_date THEN 'Reserved' ELSE 'Available' END AS availability_status FROM reservations r WHERE r.check_in_date <= CURRENT_DATE AND r.check_out_date >= CURRENT_DATE GROUP BY r.room_number, r.check_in_date, r.check_out_date;""")
    room_numbers=[]
    for row in cursor:
        room_numbers.append(row[0])
    for room_number in room_numbers:
        cursor.execute(f"""UPDATE rooms SET is_taken = 't' WHERE number = {room_number};""")
        connection.commit()


def dump_reservations(connection_data: tuple[str, str, str, str, str]) -> None:
    connection = psycopg.connect(conninfo=f"host={connection_data[0]} port={connection_data[1]} dbname={connection_data[2]} connect_timeout=10 user={connection_data[3]} password={connection_data[4]}")
    cursor = connection.cursor()
    with open('table_dump.csv', 'w') as file:
        with cursor.copy('COPY reservations TO STDOUT') as copy:
            for row in copy.rows():
                file.write(str(row))
    cursor.execute('DELETE FROM reservations;')
    connection.commit()
    cursor.close()
    connection.close()


if __name__=='__main__':
    update_availability(get_envs())
