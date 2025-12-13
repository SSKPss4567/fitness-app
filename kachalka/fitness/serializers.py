"""
Сериализаторы для преобразования моделей Django в JSON
"""
from django.core.serializers import serialize
from django.db.models import Avg, Count
import json


def serialize_gym(gym):
    """Сериализация зала"""
    # Безопасное получение изображений
    images_list = []
    for img in gym.images.all().order_by('order'):
        try:
            image_url = img.image.url if img.image else None
        except (ValueError, AttributeError):
            image_url = None
        
        images_list.append({
            'id': img.id,
            'image': image_url,
            'order': img.order
        })
    
    # Безопасное получение главного изображения
    main_image = None
    if gym.images.exists():
        first_img = gym.images.first()
        try:
            main_image = first_img.image.url if first_img.image else None
        except (ValueError, AttributeError):
            main_image = None
    
    # Если нет изображений, используем дефолтное для главной страницы
    if not main_image:
        main_image = '/media/gyms/gym_base.jpeg'
    
    # Преобразуем amenities в список, если это строка
    amenities = gym.amenities
    if amenities and isinstance(amenities, str):
        # Разделяем по запятым и очищаем от пробелов
        amenities = [a.strip() for a in amenities.split(',') if a.strip()]
    elif not amenities:
        amenities = []
    
    # Используем сохраненный рейтинг из модели
    gym_rating = float(gym.rating) if gym.rating else 0.0
    
    return {
        'id': gym.id,
        'name': gym.name,
        'address': gym.address,
        'description': gym.description or '',
        'amenities': amenities,
        'images': images_list,
        'main_image': main_image,
        'rating': round(gym_rating, 1),
        'reviews_count': gym.gym_reviews.count(),
        'trainers_count': gym.trainers.count(),
    }


def serialize_trainer(trainer):
    """Сериализация тренера"""
    # Используем сохраненный рейтинг из модели
    rating = float(trainer.rating) if trainer.rating else 0.0
    
    # Безопасное получение залов
    gyms_list = []
    for gym in trainer.gyms.all():
        gyms_list.append({
            'id': gym.id,
            'name': gym.name,
            'address': gym.address or ''
        })
    
    # Безопасное получение изображения
    image_url = None
    if trainer.image:
        try:
            image_url = trainer.image.url
        except (ValueError, AttributeError):
            image_url = None
    
    return {
        'id': trainer.id,
        'full_name': trainer.full_name,
        'name': trainer.full_name,  # Для совместимости с фронтом
        'specialization': trainer.specialization or '',
        'description': trainer.description or '',
        'gyms': gyms_list,
        'rating': round(rating, 1),
        'reviews_count': trainer.reviews.count(),
        'image': image_url,
    }


def serialize_user_profile(profile):
    """Сериализация профиля пользователя"""
    return {
        'id': profile.id,
        'full_name': profile.full_name,
        'email': profile.user.email,
        'age': profile.age,
        'gender': profile.get_gender_display() if profile.gender else None,
        'phone': profile.phone,
        'created_at': profile.created_at.isoformat(),
    }


def serialize_record(record):
    """Сериализация записи на тренировку"""
    from django.utils import timezone
    
    # Получаем название зала (первый зал тренера)
    gym_name = None
    if record.trainer.gyms.exists():
        gym_name = record.trainer.gyms.first().name
    
    # Конвертируем datetime в локальный часовой пояс (Москва)
    # Добавляем часовой пояс +03:00 для правильного парсинга на фронтенде
    local_datetime = timezone.localtime(record.datetime)
    # Форматируем как "2025-12-14T18:00:00+03:00" (московское время с часовым поясом)
    datetime_str = local_datetime.strftime('%Y-%m-%dT%H:%M:%S%z')
    # strftime возвращает +0300, нужно преобразовать в +03:00
    if datetime_str and len(datetime_str) > 10:
        datetime_str = datetime_str[:-2] + ':' + datetime_str[-2:]
    
    return {
        'id': record.id,
        'user_id': record.user.id,
        'user_name': record.user.full_name,
        'user_email': record.user.user.email,
        'trainer_id': record.trainer.id,
        'trainer_name': record.trainer.full_name,
        'trainer_specialization': record.trainer.specialization,
        'gym_name': gym_name,
        'datetime': datetime_str,
        'status': record.status,
        'status_display': record.get_status_display(),
        'created_at': record.created_at.isoformat(),
    }


def serialize_review(review):
    """Сериализация отзыва на тренера"""
    return {
        'id': review.id,
        'user': {
            'id': review.user.id,
            'full_name': review.user.full_name,
        },
        'trainer': {
            'id': review.trainer.id,
            'full_name': review.trainer.full_name,
        },
        'text': review.text,
        'rating': review.rating,
        'created_at': review.created_at.isoformat(),
        'updated_at': review.updated_at.isoformat(),
    }


def serialize_gym_review(review):
    """Сериализация отзыва на зал"""
    return {
        'id': review.id,
        'user': {
            'id': review.user.id,
            'full_name': review.user.full_name,
        },
        'gym': {
            'id': review.gym.id,
            'name': review.gym.name,
        },
        'text': review.text,
        'rating': review.rating,
        'created_at': review.created_at.isoformat(),
        'updated_at': review.updated_at.isoformat(),
    }

