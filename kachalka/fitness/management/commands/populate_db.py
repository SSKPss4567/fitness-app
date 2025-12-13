"""
Django management команда для заполнения базы данных тестовыми данными.

Использование:
    python manage.py populate_db --gyms 5 --trainers 10 --users 30
    python manage.py populate_db -g 3 -t 6 -u 9
"""

import random
from datetime import datetime, timedelta
from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth.models import User as DjangoUser
from django.db import transaction
from django.utils import timezone
from faker import Faker
from fitness.models import UserProfile, Trainer, Gym, GymImage, Record, Review, GymReview


class Command(BaseCommand):
    help = 'Заполняет базу данных тестовыми данными. База данных очищается перед заполнением.'

    def add_arguments(self, parser):
        parser.add_argument(
            '-g', '--gyms',
            type=int,
            default=5,
            help='Количество создаваемых залов (по умолчанию: 5)'
        )
        parser.add_argument(
            '-t', '--trainers',
            type=int,
            default=10,
            help='Количество создаваемых тренеров (по умолчанию: 10)'
        )
        parser.add_argument(
            '-u', '--users',
            type=int,
            default=30,
            help='Количество создаваемых пользователей (должно быть в 3 раза больше тренеров, по умолчанию: 30)'
        )

    def handle(self, *args, **options):
        num_gyms = options['gyms']
        num_trainers = options['trainers']
        num_users = options['users']

        # Проверка соотношения пользователей к тренерам
        if num_users < num_trainers * 3:
            self.stdout.write(
                self.style.WARNING(
                    f'Предупреждение: количество пользователей ({num_users}) меньше чем '
                    f'тренеров * 3 ({num_trainers * 3}). Рекомендуется увеличить количество пользователей.'
                )
            )

        # Подтверждение очистки базы данных
        self.stdout.write(
            self.style.WARNING(
                '\nВНИМАНИЕ: Все данные в базе будут удалены!\n'
                f'Будет создано:\n'
                f'  - Залов: {num_gyms}\n'
                f'  - Тренеров: {num_trainers}\n'
                f'  - Пользователей: {num_users}\n'
                f'  - Отзывов на тренеров: ~{num_trainers * 3} (по 2-4 на тренера)\n'
                f'  - Отзывов на залы: ~{num_gyms * 2} (по 2-3 на зал)\n'
                f'  - Записей: ~{num_users * 2} (по 1-3 на пользователя)\n'
            )
        )

        try:
            with transaction.atomic():
                # Очистка базы данных
                self.stdout.write('Очистка базы данных...')
                self._clear_database()
                self.stdout.write(self.style.SUCCESS('✓ База данных очищена'))

                # Создание данных
                fake = Faker('ru_RU')
                
                self.stdout.write('\nСоздание залов...')
                gyms = self._create_gyms(num_gyms, fake)
                self.stdout.write(self.style.SUCCESS(f'✓ Создано {len(gyms)} залов'))

                self.stdout.write('Создание тренеров...')
                trainers = self._create_trainers(num_trainers, gyms, fake)
                self.stdout.write(self.style.SUCCESS(f'✓ Создано {len(trainers)} тренеров'))

                self.stdout.write('Создание пользователей...')
                users = self._create_users(num_users, fake)
                self.stdout.write(self.style.SUCCESS(f'✓ Создано {len(users)} пользователей'))

                self.stdout.write('Создание отзывов на тренеров...')
                reviews_count = self._create_reviews(users, trainers, fake)
                self.stdout.write(self.style.SUCCESS(f'✓ Создано {reviews_count} отзывов на тренеров'))

                # Обновление рейтингов тренеров
                self.stdout.write('Обновление рейтингов тренеров...')
                for trainer in trainers:
                    trainer.update_rating()
                self.stdout.write(self.style.SUCCESS('✓ Рейтинги тренеров обновлены'))

                self.stdout.write('Создание отзывов на залы...')
                gym_reviews_count = self._create_gym_reviews(users, gyms, fake)
                self.stdout.write(self.style.SUCCESS(f'✓ Создано {gym_reviews_count} отзывов на залы'))

                # Обновление рейтингов залов
                self.stdout.write('Обновление рейтингов залов...')
                for gym in gyms:
                    gym.update_rating()
                self.stdout.write(self.style.SUCCESS('✓ Рейтинги залов обновлены'))

                self.stdout.write('Создание записей на тренировки...')
                records_count = self._create_records(users, trainers, fake)
                self.stdout.write(self.style.SUCCESS(f'✓ Создано {records_count} записей'))

            self.stdout.write(
                self.style.SUCCESS(
                    f'\n{"="*50}\n'
                    f'База данных успешно заполнена!\n'
                    f'{"="*50}\n'
                )
            )

        except Exception as e:
            raise CommandError(f'Ошибка при заполнении базы данных: {str(e)}')

    def _clear_database(self):
        """Очищает все записи в таблицах базы данных (сами таблицы остаются)."""
        # Удаляем в правильном порядке с учетом внешних ключей
        GymReview.objects.all().delete()
        Review.objects.all().delete()
        Record.objects.all().delete()
        GymImage.objects.all().delete()
        # Очищаем Many-to-Many связи перед удалением тренеров
        for trainer in Trainer.objects.all():
            trainer.gyms.clear()
        Trainer.objects.all().delete()
        Gym.objects.all().delete()
        UserProfile.objects.all().delete()
        # Удаляем пользователей Django (кроме суперпользователей, если нужно их сохранить)
        DjangoUser.objects.filter(is_superuser=False).delete()

    def _create_gyms(self, count, fake):
        """
        Создает залы с реалистичными названиями и описаниями.
        """
        gyms = []
        
        gym_names = [
            'World Class', 'Gold\'s Gym', 'Fitness House', 'Orange Fitness',
            'FitnessPark', 'Alex Fitness', 'Pride Club', 'Dr.Loder',
            'Fitness Formula', 'Территория Фитнеса', 'X-Fit', 'Encore Fitness',
            'Fitness First', 'Fitness People', 'Fitness Studio', 'Iron Gym',
            'PowerHouse', 'Flex Gym', 'Body Lab', 'Sport Life'
        ]
        
        cities = ['Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань']
        
        amenities_list = [
            'Бассейн, Сауна, Кардио-зона, Силовые тренажеры',
            'Групповые занятия, Йога-студия, Бокс, Кроссфит',
            'Spa-зона, Массаж, Солярий, Бар',
            'Детская комната, Парковка, Wi-Fi, Раздевалки',
            'Персональные тренировки, Диетолог, Физиотерапия'
        ]
        
        gym_descriptions = [
            'Современный фитнес-клуб с новейшим оборудованием от ведущих мировых производителей. Просторные залы, профессиональные тренеры и дружелюбная атмосфера помогут вам достичь ваших целей.',
            'Премиальный спортивный клуб для тех, кто ценит качество и комфорт. Индивидуальный подход к каждому клиенту, разнообразие групповых программ и spa-зона для полного восстановления.',
            'Уютный фитнес-центр в самом сердце города. Отличное место для начинающих и опытных спортсменов. Регулярно проводим мастер-классы и тематические тренировки.',
            'Клуб для настоящих профессионалов! Тяжелая атлетика, кроссфит, функциональный тренинг. Здесь тренируются чемпионы и те, кто стремится ими стать.',
            'Семейный фитнес-клуб с детской комнатой и разнообразными программами для всех возрастов. Создаем здоровые привычки для всей семьи!',
            'Бутик-студия с авторскими программами тренировок. Небольшие группы, персональное внимание тренера, уютная атмосфера. Идеально для тех, кто ценит качество.',
            'Круглосуточный фитнес-клуб для тех, кто живет в своем ритме. Тренируйтесь в любое удобное время! Современное оборудование и всегда чистые залы.',
            'Спортивный комплекс с бассейном олимпийского стандарта. Плавание, аквааэробика, водное поло. Отличное место для любителей водных видов спорта.',
        ]

        used_names = set()
        for i in range(count):
            city = random.choice(cities)
            
            # Выбираем уникальное название
            gym_name = random.choice(gym_names)
            while gym_name in used_names:
                gym_name = random.choice(gym_names)
            used_names.add(gym_name)
            
            gym = Gym.objects.create(
                name=gym_name,
                address=f"{fake.street_address()}, {city}",
                description=random.choice(gym_descriptions),
                amenities=random.choice(amenities_list)
            )
            
            gyms.append(gym)
        
        return gyms

    def _create_trainers(self, count, gyms, fake):
        """Создает тренеров с реалистичными описаниями."""
        trainers = []
        
        specializations = [
            'Персональный тренер',
            'Фитнес-инструктор',
            'Специалист по силовым тренировкам',
            'Кардиотренер',
            'Тренер по реабилитации',
            'Тренер по функциональному фитнесу',
            'Йога-инструктор',
            'Пилатес-инструктор',
            'Тренер по кроссфиту',
            'Тренер по боксу',
            'Диетолог',
            'Тренер по растяжке'
        ]
        
        trainer_descriptions = [
            'Работаю в фитнес-индустрии более 7 лет. Помогаю людям достигать их целей, будь то похудение, набор мышечной массы или улучшение общей физической формы. Индивидуальный подход к каждому клиенту!',
            'Сертифицированный тренер с опытом работы 5+ лет. Специализируюсь на функциональных тренировках и реабилитации после травм. Люблю работать с начинающими - помогу вам полюбить спорт!',
            'Мастер спорта по тяжелой атлетике. Тренирую как начинающих, так и опытных спортсменов. Научу правильной технике выполнения упражнений и составлю эффективную программу тренировок.',
            'Профессиональный тренер с медицинским образованием. Работаю с людьми разного уровня подготовки. Особое внимание уделяю безопасности тренировок и профилактике травм.',
            'Люблю свою работу и заряжаю энергией каждого клиента! Провожу как персональные, так и групповые тренировки. Вместе мы достигнем ваших целей!',
            'Опыт работы в фитнесе 10+ лет. Участник соревнований по бодибилдингу. Помогу вам построить тело вашей мечты! Работаю на результат.',
            'Сертифицированный йога-инструктор. Практикую йогу более 8 лет. Помогу вам обрести гармонию тела и разума, улучшить гибкость и снять стресс.',
            'Тренер по кроссфиту и функциональному тренингу. Люблю интенсивные тренировки и мотивирую своих подопечных выходить за пределы возможного!',
            'Специалист по реабилитации и ЛФК. Работаю с людьми после травм и операций. Помогу вернуться к активной жизни безопасно и эффективно.',
            'Персональный тренер и нутрициолог. Комплексный подход - тренировки + питание = ваш результат! Работаю с клиентами онлайн и офлайн.',
        ]

        for _ in range(count):
            trainer = Trainer.objects.create(
                full_name=fake.name(),
                specialization=random.choice(specializations),
                description=random.choice(trainer_descriptions),
                image='trainers/trainer_base.jpg'  # Дефолтное изображение
            )
            
            # Привязываем тренера к 1-3 залам
            num_gyms = random.randint(1, min(3, len(gyms)))
            trainer.gyms.set(random.sample(gyms, num_gyms))
            
            trainers.append(trainer)
        
        return trainers

    def _create_users(self, count, fake):
        """Создает пользователей с профилями."""
        users = []
        
        for i in range(count):
            # Создаем Django User
            username = fake.user_name() + str(i)
            email = f"user{i}_{fake.email()}"
            
            django_user = DjangoUser.objects.create_user(
                username=username,
                email=email,
                password='testpass123',
                first_name=fake.first_name(),
                last_name=fake.last_name()
            )
            
            # Профиль создается автоматически через сигнал
            # Обновляем данные профиля
            profile = django_user.profile
            profile.full_name = f"{django_user.first_name} {django_user.last_name}"
            profile.age = random.randint(18, 65)
            profile.gender = random.choice(['M', 'F'])
            profile.phone = fake.phone_number()
            profile.save()
            
            users.append(profile)
        
        return users

    def _create_reviews(self, users, trainers, fake):
        """Создает реалистичные отзывы от пользователей на тренеров."""
        reviews_count = 0
        
        positive_reviews = [
            'Отличный тренер! Очень доволен результатами. Все объясняет понятно, следит за техникой выполнения упражнений.',
            'Супер! Занимаюсь уже 3 месяца, результаты превзошли все ожидания. Рекомендую!',
            'Профессионал своего дела. Индивидуальный подход, мотивация на каждой тренировке. Спасибо!',
            'Лучший тренер! Помог мне сбросить 15 кг за полгода. Тренировки проходят интересно и эффективно.',
            'Очень грамотный специалист. Учитывает все мои пожелания и особенности здоровья. Результат есть!',
            'Занимаюсь с удовольствием! Тренер всегда поддерживает и мотивирует. Рекомендую всем!',
            'Отличные тренировки! Наконец-то нашел своего тренера. Все четко, по делу, без воды.',
            'Профессионал высокого уровня. Помог поставить правильную технику и избежать травм. Благодарен!',
            'Замечательный тренер! Всегда на позитиве, заряжает энергией. Тренировки проходят на одном дыхании.',
            'Очень доволен! Составил отличную программу, учел все мои цели. Результаты видны уже через месяц.',
        ]
        
        good_reviews = [
            'Хороший тренер, знает свое дело. Единственный минус - иногда опаздывает на пару минут.',
            'В целом доволен. Тренировки эффективные, но хотелось бы больше разнообразия в упражнениях.',
            'Неплохо, но ожидал большего. Результаты есть, но не такие быстрые, как хотелось бы.',
            'Хороший специалист, но немного строгий. Для меня это даже плюс - держит в тонусе!',
            'Занимаюсь месяц, пока все нравится. Посмотрим, что будет дальше. Надеюсь на результат!',
        ]
        
        # Каждый тренер получает от 2 до 4 отзывов
        for trainer in trainers:
            num_reviews = random.randint(2, 4)
            selected_users = random.sample(users, min(num_reviews, len(users)))
            
            for user in selected_users:
                try:
                    # 80% положительных отзывов (5 звезд), 15% хороших (4 звезды), 5% средних (3 звезды)
                    rand = random.random()
                    if rand < 0.80:
                        rating = 5
                        review_text = random.choice(positive_reviews)
                    elif rand < 0.95:
                        rating = 4
                        review_text = random.choice(good_reviews)
                    else:
                        rating = 3
                        review_text = random.choice(good_reviews)
                    
                    Review.objects.create(
                        user=user,
                        trainer=trainer,
                        text=review_text,
                        rating=rating
                    )
                    reviews_count += 1
                except Exception:
                    # Пропускаем, если отзыв уже существует (unique_together)
                    pass
        
        return reviews_count

    def _create_records(self, users, trainers, fake):
        """Создает записи на тренировки."""
        records_count = 0
        
        # Временные слоты по 1.5 часа с 9:00 до 21:00
        time_slots = [
            '09:00', '10:30', '12:00', '13:30', 
            '15:00', '16:30', '18:00', '19:30'
        ]
        
        # Каждый пользователь создает от 1 до 3 записей
        for user in users:
            num_records = random.randint(1, 3)
            
            for _ in range(num_records):
                trainer = random.choice(trainers)
                
                # Генерируем случайную дату в диапазоне от -30 до +60 дней
                days_offset = random.randint(-30, 60)
                record_datetime = timezone.now() + timedelta(days=days_offset)
                
                # Выбираем случайный слот времени
                time_slot = random.choice(time_slots)
                hour, minute = map(int, time_slot.split(':'))
                record_datetime = record_datetime.replace(
                    hour=hour,
                    minute=minute,
                    second=0,
                    microsecond=0
                )
                
                # Определяем статус в зависимости от даты
                if record_datetime < timezone.now():
                    # Прошедшие тренировки
                    status = random.choices(
                        ['completed', 'cancelled'],
                        weights=[0.8, 0.2]
                    )[0]
                else:
                    # Будущие тренировки
                    status = random.choices(
                        ['scheduled', 'cancelled'],
                        weights=[0.9, 0.1]
                    )[0]
                
                Record.objects.create(
                    user=user,
                    trainer=trainer,
                    datetime=record_datetime,
                    status=status
                )
                records_count += 1
        
        return records_count

    def _create_gym_reviews(self, users, gyms, fake):
        """Создает реалистичные отзывы от пользователей на залы."""
        reviews_count = 0
        
        positive_reviews = [
            'Отличный зал! Современное оборудование, чистота и порядок. Персонал вежливый и профессиональный.',
            'Прекрасное место для тренировок! Удобное расположение и отличная атмосфера.',
            'Замечательный фитнес-центр! Тренируюсь здесь уже год и очень доволен.',
            'Лучший зал в городе! Всегда чисто, много тренажеров, никогда не бывает очередей.',
            'Отличное место! Просторные залы, новое оборудование, приятная атмосфера. Рекомендую!',
            'Супер зал! Все на высшем уровне - и оборудование, и сервис, и цены.',
            'Очень доволен! Тренируюсь здесь регулярно, всегда получаю заряд энергии и хорошего настроения.',
            'Премиальный уровень! Всё продумано до мелочей, чувствуется забота о клиентах.',
        ]
        
        good_reviews = [
            'Хороший зал, но иногда бывает многолюдно. В целом доволен.',
            'Неплохой зал, но хотелось бы больше разнообразия в оборудовании.',
            'Хороший зал с приятными ценами. Рекомендую!',
            'В целом неплохо, но есть куда расти. Оборудование хорошее, но могло бы быть больше.',
            'Нормальный зал. Цены приемлемые, персонал вежливый. Подходит для регулярных тренировок.',
        ]
        
        # Каждый зал получает от 2 до 3 отзывов
        for gym in gyms:
            num_reviews = random.randint(2, 3)
            selected_users = random.sample(users, min(num_reviews, len(users)))
            
            for user in selected_users:
                try:
                    # 75% положительных отзывов (5 звезд), 20% хороших (4 звезды), 5% средних (3 звезды)
                    rand = random.random()
                    if rand < 0.75:
                        rating = 5
                        review_text = random.choice(positive_reviews)
                    elif rand < 0.95:
                        rating = 4
                        review_text = random.choice(good_reviews)
                    else:
                        rating = 3
                        review_text = random.choice(good_reviews)
                    
                    GymReview.objects.create(
                        user=user,
                        gym=gym,
                        text=review_text,
                        rating=rating
                    )
                    reviews_count += 1
                except Exception:
                    # Пропускаем, если отзыв уже существует (unique_together)
                    pass
        
        return reviews_count

