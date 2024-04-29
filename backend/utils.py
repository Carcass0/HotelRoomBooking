from os import environ
import datetime

from dotenv import load_dotenv

AMENITY_TYPES: list[str] = [
    "Wake-up сервис",
    "Диван/кресло/угловое кресло/письменный стол/стулья",
    "Мини-кухня с микроволновой печью",
    "Сейф с встроенным электропитанием",
    "Шумоизоляция",
    "Кондиционер",
    "Минибар, кофеварка",
    "Просторная ванна с душем и ванной",
    "Отдельные гостиная и спальня",
    "Душ и ванна",
    "Подходит для встреч до 4 человек",
    "С балконом",
    "Телевизор",
    "Wi-Fi",
    "Косметическое зеркало",
    "Фен",
    "Бесплатные туалетные принадлежности/средства по уходу за телом",
    "Косметическое зеркало и фен",
    "Кресло-качалка",
    "Вид: Kranzler Eck",
    "Вид: Ku'damm"
]

BED_TYPES = ["Полуторная",
             "Двуспальная",
             "King Size",
             "Диван"]

def get_envs() -> tuple[str, str, str, str, str]:
    load_dotenv()
    HOST = environ['HOST']
    PORT = environ['PORT']
    DBNAME = environ['DBNAME']
    USER = environ['USER']
    PASSWORD = environ['PASSWORD']
    return (HOST, PORT, DBNAME, USER, PASSWORD)


def binarify_amenities(amenity_list: list[str]) -> str:
    amenity_indexes = []
    amenities_string = ''
    for amenity in amenity_list:
        amenity_indexes.append(AMENITY_TYPES.index(amenity))
    for i in range(len(AMENITY_TYPES)):
        if i in amenity_indexes:
            amenities_string += '1'
        else:
            amenities_string += '_'
    return amenities_string

def debinarify_amenities(amenities_string: str) -> list[str]:
        amenities_list: list[str] = []
        for i, amenity in enumerate(AMENITY_TYPES):
             if amenities_string[i] == '1':
                  amenities_list.append(amenity)
        return amenities_list
             
def numerify_beds(bed_list: list[str]) -> int:
    num = 0
    num += len(bed_list) * pow(10, len(bed_list))
    for i, bed in enumerate(reversed(bed_list)):
         num += BED_TYPES.index(bed) * pow(10, i)
    return num

def denumerify_beds(bed_string: str) -> list[str]:
    bed_string = bed_string.strip()
    beds = []
    for i in bed_string[1:]:
        beds.append(BED_TYPES[int(i)])
    return beds

def current_date() -> str:
    out = ''
    today = datetime.datetime.now()
    out = today.strftime('%Y-%m-%d')
    return out

def get_end_of_stay_date(length: int) -> str:
    out = ''
    today = datetime.datetime.now()
    end = today + datetime.timedelta(length)
    out = end.strftime('%Y-%m-%d')
    return out

if __name__=='__main__':
#     print(get_envs())
#     print(binarify_amenities(["Wake-up сервис",
# "Диван/кресло/угловое кресло/письменный стол/стулья",
# "Сейф с встроенным электропитанием",
# "Шумоизоляция",
# "Кондиционер",
# "Минибар, кофеварка",
# "Душ и ванна",
# "Подходит для встреч до 4 человек",
# "С балконом",
# "Телевизор",
# "Wi-Fi"]))
    # print(numerify_beds(['King Size', 'Диван']))
    print(get_end_of_stay_date(5))
