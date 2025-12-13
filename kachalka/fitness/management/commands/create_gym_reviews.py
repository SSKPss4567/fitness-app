from django.core.management.base import BaseCommand
from fitness.models import Gym, GymReview, UserProfile
import random


class Command(BaseCommand):
    help = 'Создать тестовые отзывы на залы'

    def handle(self, *args, **options):
        # Получаем все залы
        gyms = Gym.objects.all()
        
        if not gyms.exists():
            self.stdout.write(self.style.ERROR('Нет залов в базе данных'))
            return
        
        # Получаем всех пользователей
        users = UserProfile.objects.all()
        
        if not users.exists():
            self.stdout.write(self.style.ERROR('Нет пользователей в базе данных'))
            return
        
        reviews_data = [
            {
                'text': 'Отличный зал! Современное оборудование, чистота и порядок. Персонал вежливый и профессиональный.',
                'rating': 5
            },
            {
                'text': 'Хороший зал, но иногда бывает многолюдно. В целом доволен.',
                'rating': 4
            },
            {
                'text': 'Прекрасное место для тренировок! Удобное расположение и отличная атмосфера.',
                'rating': 5
            },
            {
                'text': 'Неплохой зал, но хотелось бы больше разнообразия в оборудовании.',
                'rating': 3
            },
            {
                'text': 'Замечательный фитнес-центр! Тренируюсь здесь уже год и очень доволен.',
                'rating': 5
            },
            {
                'text': 'Хороший зал с приятными ценами. Рекомендую!',
                'rating': 4
            },
        ]
        
        created_count = 0
        
        for gym in gyms:
            # Создаем 2-3 отзыва для каждого зала
            num_reviews = random.randint(2, 3)
            available_users = list(users)
            
            for _ in range(min(num_reviews, len(available_users))):
                user = random.choice(available_users)
                available_users.remove(user)  # Один пользователь - один отзыв на зал
                
                review_data = random.choice(reviews_data)
                
                # Проверяем, нет ли уже отзыва от этого пользователя на этот зал
                if not GymReview.objects.filter(user=user, gym=gym).exists():
                    GymReview.objects.create(
                        user=user,
                        gym=gym,
                        text=review_data['text'],
                        rating=review_data['rating']
                    )
                    created_count += 1
                    self.stdout.write(
                        self.style.SUCCESS(
                            f'Создан отзыв от {user.full_name} на {gym.name}'
                        )
                    )
            
            # Обновляем рейтинг зала
            gym.update_rating()
            self.stdout.write(
                self.style.SUCCESS(
                    f'Обновлен рейтинг зала {gym.name}: {gym.rating}'
                )
            )
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Успешно создано {created_count} отзывов на залы'
            )
        )

