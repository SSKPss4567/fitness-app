"""
Django management команда для загрузки placeholder изображений для залов и тренеров.

Использование:
    python manage.py download_images
"""

import os
import random
import requests
from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from django.conf import settings
from fitness.models import Gym, GymImage


class Command(BaseCommand):
    help = 'Загружает placeholder изображения для залов и тренеров'

    def handle(self, *args, **options):
        self.stdout.write(
            self.style.WARNING(
                '\nЗагрузка placeholder изображений...\n'
                'Используется сервис https://picsum.photos/\n'
            )
        )

        try:
            # Создаем директории для медиа файлов
            media_root = settings.MEDIA_ROOT
            gyms_dir = os.path.join(media_root, 'gyms')
            users_dir = os.path.join(media_root, 'users')
            
            os.makedirs(gyms_dir, exist_ok=True)
            os.makedirs(users_dir, exist_ok=True)

            # Загружаем изображения для залов
            self.stdout.write('Загрузка изображений залов...')
            gyms_count = self._download_gym_images()
            self.stdout.write(self.style.SUCCESS(f'✓ Загружено изображений для {gyms_count} залов'))

            # Можно добавить загрузку для тренеров, если нужно
            # self.stdout.write('Загрузка изображений тренеров...')
            # trainers_count = self._download_trainer_images()
            # self.stdout.write(self.style.SUCCESS(f'✓ Загружено изображений для {trainers_count} тренеров'))

            self.stdout.write(
                self.style.SUCCESS(
                    f'\n{"="*50}\n'
                    f'Изображения успешно загружены!\n'
                    f'{"="*50}\n'
                )
            )

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Ошибка при загрузке изображений: {str(e)}')
            )

    def _download_image(self, url, timeout=10):
        """Загружает изображение по URL"""
        try:
            response = requests.get(url, timeout=timeout)
            response.raise_for_status()
            return ContentFile(response.content)
        except Exception as e:
            self.stdout.write(
                self.style.WARNING(f'Не удалось загрузить {url}: {str(e)}')
            )
            return None

    def _download_gym_images(self):
        """Загружает изображения для всех залов"""
        gyms = Gym.objects.all()
        gyms_with_images = 0

        for gym in gyms:
            # Удаляем старые изображения
            gym.images.all().delete()

            # Загружаем 4-6 изображений для каждого зала
            num_images = random.randint(4, 6)
            images_downloaded = 0

            for i in range(num_images):
                # Генерируем URL для placeholder изображения
                # Размер: 1200x800 для залов
                seed = f"gym{gym.id}img{i}"
                url = f"https://picsum.photos/seed/{seed}/1200/800"

                # Загружаем изображение
                image_content = self._download_image(url)
                
                if image_content:
                    # Создаем запись GymImage
                    gym_image = GymImage(gym=gym, order=i)
                    gym_image.image.save(
                        f'gym_{gym.id}_image_{i}.jpg',
                        image_content,
                        save=True
                    )
                    images_downloaded += 1

            if images_downloaded > 0:
                gyms_with_images += 1
                self.stdout.write(f'  Зал "{gym.name}": {images_downloaded} изображений')

        return gyms_with_images

