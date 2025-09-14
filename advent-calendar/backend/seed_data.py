# backend/seed_data.py
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
import models.user
import models.door
from models.door import Door

def seed_doors(db: Session):
    """Заполняем базу тестовыми дверями"""
    
    # Проверяем, есть ли уже двери
    existing_doors = db.query(Door).count()
    if existing_doors > 0:
        print(f"В базе уже есть {existing_doors} дверей")
        return

    sample_doors = [
        {
            "day": 1,
            "content_type": "text",
            "content": "С Днем Святого Николая! 🎅 Ты получил первый подарок! Скидка 10% на все товары в нашем магазине.",
            "points": 10
        },
        {
            "day": 2,
            "content_type": "text",
            "content": "Поздравляем! 🎁 Ты выиграл бесплатную доставку до конца года!",
            "points": 15
        },
        {
            "day": 3,
            "content_type": "link",
            "content": "https://example.com/special-offer",
            "points": 20
        },
        {
            "day": 4,
            "content_type": "text",
            "content": "Сюрприз! 🎉 Дополнительные 100 бонусных баллов на ваш счет!",
            "points": 25
        },
        {
            "day": 5,
            "content_type": "text",
            "content": "Пятая дверь! 🎄 Специальное предложение: второй товар в подарок при покупке!",
            "points": 30
        },
        {
            "day": 6,
            "content_type": "text",
            "content": "Шестое декабря - день святого Николая! 🎅 Получите эксклюзивный купон на 25% скидку!",
            "points": 35
        },
        {
            "day": 7,
            "content_type": "text",
            "content": "Седьмой день удачи! 🍀 Бесплатный подарок при следующей покупке!",
            "points": 40
        },
        {
            "day": 8,
            "content_type": "text",
            "content": "Восьмое декабря! 🎉 Секретный код: XMAS2024 - используйте при оформлении заказа!",
            "points": 45
        },
        {
            "day": 9,
            "content_type": "text",
            "content": "Девятый день подарков! 🎄 15% скидка на всю коллекцию новогодних товаров!",
            "points": 50
        },
        {
            "day": 10,
            "content_type": "text",
            "content": "Десятое декабря! 🎉 Бесплатная упаковка подарка для всех заказов!",
            "points": 55
        },
        {
            "day": 11,
            "content_type": "text",
            "content": "Одиннадцатый день сюрпризов! 🎁 Эксклюзивный доступ к распродаже до полуночи!",
            "points": 60
        },
        {
            "day": 12,
            "content_type": "text",
            "content": "Двенадцатый день! 🎅 Специальный подарок: персональная консультация от нашего эксперта!",
            "points": 65
        },
        {
            "day": 13,
            "content_type": "text",
            "content": "Тринадцатый день удачи! 🍀 Двойные баллы лояльности на все покупки сегодня!",
            "points": 70
        },
        {
            "day": 14,
            "content_type": "text",
            "content": "Четырнадцатое декабря! 🎄 Скидка 30% на новогодние украшения!",
            "points": 75
        },
        {
            "day": 15,
            "content_type": "text",
            "content": "Пятнадцатый день подарков! 🎁 Бесплатный подарок на выбор при заказе от 1000 рублей!",
            "points": 80
        },
        {
            "day": 16,
            "content_type": "text",
            "content": "Шестнадцатое декабря! 🎉 Секретный код: WINTER2024 - скидка 20% на все товары!",
            "points": 85
        },
        {
            "day": 17,
            "content_type": "text",
            "content": "Семнадцатый день сюрпризов! 🎅 Эксклюзивный доступ к предзаказу новинок!",
            "points": 90
        },
        {
            "day": 18,
            "content_type": "text",
            "content": "Восемнадцатое декабря! 🎄 Специальное предложение: бесплатная доставка в подарок!",
            "points": 95
        },
        {
            "day": 19,
            "content_type": "text",
            "content": "Девятнадцатый день удачи! 🍀 Персональная скидка 15% на следующую покупку!",
            "points": 100
        },
        {
            "day": 20,
            "content_type": "text",
            "content": "Двадцатое декабря! 🎁 Сюрприз: эксклюзивный мерч с логотипом нашего магазина!",
            "points": 110
        },
        {
            "day": 21,
            "content_type": "text",
            "content": "Двадцать первый день! 🎅 Бесплатная доставка и упаковка до Нового Года!",
            "points": 120
        },
        {
            "day": 22,
            "content_type": "text",
            "content": "Двадцать второй день подарков! 🎄 Скидка 25% на всю коллекцию!",
            "points": 130
        },
        {
            "day": 23,
            "content_type": "text",
            "content": "Предпоследний день! 🎉 Секретный код: MERRY2024 - максимальная скидка 40%!",
            "points": 140
        },
        {
            "day": 24,
            "content_type": "text",
            "content": "🎄 Сочельник! 🎅 Главный подарок: VIP-статус и бесплатная доставка на целый год! С Новым Годом!",
            "points": 200
        }
    ]

    doors_added = 0
    for door_data in sample_doors:
        # Проверяем, существует ли уже дверь с таким днем
        existing_door = db.query(Door).filter(Door.day == door_data["day"]).first()
        if not existing_door:
            door = Door(**door_data)
            db.add(door)
            doors_added += 1
    
    db.commit()
    print(f"Добавлено {doors_added} новых дверей")

def main():
    # Создаем таблицы перед заполнением
    print("Создаем таблицы...")
    Base.metadata.create_all(bind=engine)
    print("Таблицы созданы")
    
    db = SessionLocal()
    try:
        seed_doors(db)
    except Exception as e:
        print(f"Ошибка при заполнении базы: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    main()