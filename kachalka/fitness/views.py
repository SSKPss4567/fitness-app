from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q, Avg
from django.contrib.auth.models import User as DjangoUser
from django.contrib.auth import authenticate, login, logout
from django.core.exceptions import ValidationError
from django.utils import timezone
from datetime import datetime
import json
from .models import Gym, Trainer, UserProfile, Record, Review, GymReview
from .serializers import (
    serialize_gym, serialize_trainer, serialize_user_profile,
    serialize_record, serialize_review, serialize_gym_review
)
from .forms import (
    GymFilterForm, TrainerFilterForm, ReviewFilterForm, RecordFilterForm,
    ReviewCreateForm, RecordCreateForm, UserProfileForm, UserRegistrationForm,
    UserLoginForm
)


def index(request):
    """
    Отдаёт базовый HTML шаблон React.
    """
    return render(request, "index.html")


# ==================== API для залов ====================

@require_http_methods(["GET"])
def gyms_list(request):
    """
    Получить список всех залов с фильтрацией
    GET /api/gyms/
    Параметры:
        - search: поиск по названию или адресу
        - city: фильтр по городу
        - amenities: фильтр по удобствам (через запятую)
        - top: количество топ залов по рейтингу (например, top=5)
        - order_by: сортировка (rating_desc, rating_asc, name)
    """
    gyms = Gym.objects.all().prefetch_related('images', 'trainers')
    
    # Используем форму для фильтрации (сначала фильтруем)
    filter_form = GymFilterForm(request.GET)
    if filter_form.is_valid():
        gyms = filter_form.filter_queryset(gyms)
    # Если форма не валидна, просто пропускаем фильтрацию (не возвращаем ошибку)
    
    # Проверяем параметр top и order_by для сортировки
    top = request.GET.get('top')
    order_by = request.GET.get('order_by', '')
    
    # Сортировка
    if order_by == 'rating_desc':
        gyms = gyms.order_by('-rating', 'name')
    elif order_by == 'rating_asc':
        gyms = gyms.order_by('rating', 'name')
    elif order_by == 'name':
        gyms = gyms.order_by('name')
    elif top:
        # Если указан top, сортируем по рейтингу
        gyms = gyms.order_by('-rating', 'name')
    else:
        # По умолчанию сортируем по имени
        gyms = gyms.order_by('name')
    
    # Ограничиваем количество после фильтрации и сортировки
    if top:
        try:
            top_count = int(top)
            gyms = gyms[:top_count]
        except ValueError:
            pass
    
    data = [serialize_gym(gym) for gym in gyms]
    return JsonResponse({'gyms': data, 'count': len(data)})


@require_http_methods(["GET"])
def gym_detail(request, gym_id):
    """
    Получить детальную информацию о зале
    GET /api/gyms/<id>/
    """
    gym = get_object_or_404(Gym.objects.prefetch_related('images', 'trainers', 'gym_reviews__user'), id=gym_id)
    
    # Получаем тренеров этого зала
    trainers = gym.trainers.all().prefetch_related('reviews', 'gyms')
    trainers_data = [serialize_trainer(trainer) for trainer in trainers]
    
    # Получаем отзывы на зал
    reviews = gym.gym_reviews.all().select_related('user')
    reviews_data = [serialize_gym_review(review) for review in reviews]
    
    gym_data = serialize_gym(gym)
    gym_data['trainers'] = trainers_data
    gym_data['reviews'] = reviews_data
    
    return JsonResponse(gym_data)


# ==================== API для тренеров ====================

@require_http_methods(["GET"])
def trainers_list(request):
    """
    Получить список всех тренеров с фильтрацией
    GET /api/trainers/
    Параметры:
        - search: поиск по имени
        - gym: фильтр по залу (ID)
        - specialization: фильтр по специализации
        - top: количество топ тренеров по рейтингу (например, top=5)
        - order_by: сортировка (rating_desc, rating_asc, name)
    """
    trainers = Trainer.objects.all().prefetch_related('gyms', 'reviews')
    
    # Используем форму для фильтрации (сначала фильтруем)
    filter_form = TrainerFilterForm(request.GET)
    if filter_form.is_valid():
        trainers = filter_form.filter_queryset(trainers)
    # Если форма не валидна, просто пропускаем фильтрацию (не возвращаем ошибку)
    
    # Проверяем параметр top и order_by для сортировки
    top = request.GET.get('top')
    order_by = request.GET.get('order_by', '')
    
    # Сортировка
    if order_by == 'rating_desc':
        trainers = trainers.order_by('-rating', 'full_name')
    elif order_by == 'rating_asc':
        trainers = trainers.order_by('rating', 'full_name')
    elif order_by == 'name':
        trainers = trainers.order_by('full_name')
    elif top:
        # Если указан top, сортируем по рейтингу
        trainers = trainers.order_by('-rating', 'full_name')
    else:
        # По умолчанию сортируем по имени
        trainers = trainers.order_by('full_name')
    
    # Ограничиваем количество после фильтрации и сортировки
    if top:
        try:
            top_count = int(top)
            trainers = trainers[:top_count]
        except ValueError:
            pass
    
    data = [serialize_trainer(trainer) for trainer in trainers]
    return JsonResponse({'trainers': data, 'count': len(data)})


@require_http_methods(["GET"])
def trainer_detail(request, trainer_id):
    """
    Получить детальную информацию о тренере
    GET /api/trainers/<id>/
    """
    trainer = get_object_or_404(
        Trainer.objects.prefetch_related('gyms', 'reviews__user'),
        id=trainer_id
    )
    
    trainer_data = serialize_trainer(trainer)
    
    # Добавляем отзывы
    reviews = trainer.reviews.all().select_related('user__user')
    trainer_data['reviews'] = [serialize_review(review) for review in reviews]
    
    # Добавляем забронированные слоты
    from datetime import datetime, timedelta
    from django.utils import timezone
    
    # Получаем записи на ближайшие 30 дней
    start_date = timezone.now()
    end_date = start_date + timedelta(days=30)
    
    booked_slots = Record.objects.filter(
        trainer=trainer,
        datetime__gte=start_date,
        datetime__lte=end_date,
        status='scheduled'
    ).values_list('datetime', flat=True)
    
    # Сериализуем время в локальном часовом поясе для правильного сравнения на фронтенде
    # Формат: "2025-12-14T16:30:00" (без часового пояса, так как фронтенд работает в локальном времени)
    trainer_data['booked_slots'] = [
        timezone.localtime(dt).strftime('%Y-%m-%dT%H:%M:%S') 
        for dt in booked_slots
    ]
    
    return JsonResponse(trainer_data)


# ==================== API для отзывов ====================

@require_http_methods(["GET", "POST"])
@csrf_exempt  # Временно для тестирования, потом нужно настроить CSRF
def reviews_list(request):
    """
    Получить список отзывов или создать новый
    GET /api/reviews/?trainer=<id>
    POST /api/reviews/
    """
    if request.method == 'GET':
        reviews = Review.objects.all().select_related('user__user', 'trainer')
        
        # Используем форму для фильтрации
        filter_form = ReviewFilterForm(request.GET)
        if filter_form.is_valid():
            reviews = filter_form.filter_queryset(reviews)
        else:
            return JsonResponse({
                'error': 'Ошибка валидации',
                'errors': filter_form.errors
            }, status=400)
        
        data = [serialize_review(review) for review in reviews]
        return JsonResponse({'reviews': data, 'count': len(data)})
    
    # POST - создание отзыва
    try:
        data = json.loads(request.body)
        
        # Преобразуем user_id и trainer_id в объекты
        form_data = data.copy()
        if 'user_id' in form_data:
            form_data['user'] = form_data.pop('user_id')
        if 'trainer_id' in form_data:
            form_data['trainer'] = form_data.pop('trainer_id')
        
        form = ReviewCreateForm(form_data)
        
        if form.is_valid():
            review = form.save()
            return JsonResponse({
                'success': True,
                'message': 'Отзыв успешно создан',
                'review': serialize_review(review)
            }, status=201)
        else:
            return JsonResponse({
                'success': False,
                'error': 'Ошибка валидации',
                'errors': form.errors
            }, status=400)
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'error': 'Неверный формат JSON'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)


# ==================== API для записей ====================

@require_http_methods(["GET", "POST"])
@csrf_exempt  # Временно для тестирования, потом нужно настроить CSRF
def records_list(request):
    """
    Получить список записей или создать новую
    GET /api/records/?user=<id>&status=<status>
    POST /api/records/
    """
    if request.method == 'GET':
        records = Record.objects.all().select_related('user__user', 'trainer')
        
        # Используем форму для фильтрации
        filter_form = RecordFilterForm(request.GET)
        if filter_form.is_valid():
            records = filter_form.filter_queryset(records)
        else:
            return JsonResponse({
                'error': 'Ошибка валидации',
                'errors': filter_form.errors
            }, status=400)
        
        data = [serialize_record(record) for record in records]
        return JsonResponse({'records': data, 'count': len(data)})
    
    # POST - создание записи
    try:
        data = json.loads(request.body)
        form = RecordCreateForm(data)
        
        if form.is_valid():
            record = form.save()
            return JsonResponse({
                'success': True,
                'message': 'Запись успешно создана',
                'record': serialize_record(record)
            }, status=201)
        else:
            return JsonResponse({
                'success': False,
                'error': 'Ошибка валидации',
                'errors': form.errors
            }, status=400)
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'error': 'Неверный формат JSON'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)


# ==================== API для пользователей ====================

@require_http_methods(["GET"])
def user_profile(request, user_id):
    """
    Получить профиль пользователя
    GET /api/users/<id>/
    """
    profile = get_object_or_404(UserProfile.objects.select_related('user'), id=user_id)
    
    profile_data = serialize_user_profile(profile)
    
    # Добавляем записи пользователя
    records = Record.objects.filter(user=profile).select_related('trainer')
    profile_data['records'] = [serialize_record(record) for record in records]
    
    return JsonResponse(profile_data)


# ==================== Вспомогательные API ====================

@require_http_methods(["GET"])
def specializations_list(request):
    """
    Получить список всех специализаций тренеров
    GET /api/specializations/
    """
    specializations = Trainer.objects.values_list('specialization', flat=True).distinct()
    return JsonResponse({'specializations': list(specializations)})


@require_http_methods(["GET"])
def cities_list(request):
    """
    Получить список всех городов (извлекаются из адресов залов)
    GET /api/cities/
    """
    # Извлекаем города из адресов (предполагается формат "улица, город")
    addresses = Gym.objects.values_list('address', flat=True)
    cities = set()
    for address in addresses:
        parts = address.split(',')
        if len(parts) >= 2:
            city = parts[-1].strip()
            cities.add(city)
    
    return JsonResponse({'cities': sorted(list(cities))})


# ==================== API для аутентификации ====================

@require_http_methods(["GET"])
def current_user(request):
    """
    Получить информацию о текущем авторизованном пользователе
    GET /api/auth/current-user/
    """
    if request.user.is_authenticated:
        try:
            profile = request.user.profile
            return JsonResponse({
                'authenticated': True,
                'user': serialize_user_profile(profile)
            })
        except UserProfile.DoesNotExist:
            return JsonResponse({
                'authenticated': False,
                'error': 'Профиль пользователя не найден'
            }, status=404)
    else:
        return JsonResponse({
            'authenticated': False
        })


@csrf_exempt
@require_http_methods(["POST"])
def login_view(request):
    """
    Вход пользователя в систему с использованием формы
    POST /api/auth/login/
    Body (JSON):
        - email: email пользователя
        - password: пароль
    """
    try:
        data = json.loads(request.body)
        
        # Используем форму для валидации
        form = UserLoginForm(data)
        
        if form.is_valid():
            try:
                # Аутентификация пользователя через форму
                user = form.authenticate_user(request)
                
                # Вход пользователя
                login(request, user)
                
                # Получаем профиль
                profile = user.profile
                
                return JsonResponse({
                    'message': 'Вход выполнен успешно',
                    'user': serialize_user_profile(profile)
                })
                
            except UserProfile.DoesNotExist:
                return JsonResponse({
                    'error': 'Профиль пользователя не найден'
                }, status=404)
            except ValidationError as e:
                return JsonResponse({
                    'error': str(e.message) if hasattr(e, 'message') else str(e)
                }, status=401)
        else:
            # Возвращаем ошибки валидации
            return JsonResponse({
                'error': 'Ошибка валидации',
                'errors': form.errors
            }, status=400)
        
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Неверный формат JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def register(request):
    """
    Регистрация нового пользователя с использованием формы
    POST /api/register/
    Body (JSON):
        - email: email пользователя
        - password: пароль
        - full_name: полное имя
        - age: возраст (опционально)
        - gender: пол (M/F, опционально)
        - phone: телефон (опционально)
    """
    try:
        data = json.loads(request.body)
        
        # Используем форму для валидации
        form = UserRegistrationForm(data)
        
        if form.is_valid():
            # Сохраняем профиль (форма создает пользователя и профиль)
            profile = form.save()
            
            # Автоматический вход после регистрации
            user = profile.user
            login(request, user)
            
            return JsonResponse({
                'message': 'Регистрация успешна',
                'user': serialize_user_profile(profile)
            }, status=201)
        else:
            # Возвращаем ошибки валидации
            return JsonResponse({
                'error': 'Ошибка валидации',
                'errors': form.errors
            }, status=400)
        
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Неверный формат JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
# Временный файл для добавления функции cancel_record

@csrf_exempt
@require_http_methods(["POST"])
def cancel_record(request, record_id):
    """Отменить запись на тренировку"""
    try:
        record = get_object_or_404(Record, id=record_id)
        
        # Проверяем, что пользователь владелец записи
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'Необходима авторизация'}, status=401)
        
        if record.user.user != request.user:
            return JsonResponse({'error': 'Нет прав на отмену этой записи'}, status=403)
        
        # Пытаемся отменить
        if record.cancel():
            return JsonResponse({
                'success': True,
                'message': 'Тренировка успешно отменена',
                'record': serialize_record(record)
            })
        else:
            return JsonResponse({
                'success': False,
                'error': 'Невозможно отменить тренировку. Она уже началась или была отменена ранее.'
            }, status=400)
            
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def create_records(request):
    """Создать записи на тренировки"""
    try:
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'Необходима авторизация'}, status=401)
        
        data = json.loads(request.body)
        trainer_id = data.get('trainer_id')
        time_slots = data.get('time_slots', [])
        
        print(f"DEBUG: trainer_id={trainer_id}, time_slots={time_slots}")
        
        if not trainer_id or not time_slots:
            return JsonResponse({'error': 'Не указан тренер или временные слоты'}, status=400)
        
        # Получаем профиль пользователя и тренера
        try:
            user_profile = request.user.profile
            trainer = Trainer.objects.get(id=trainer_id)
        except (UserProfile.DoesNotExist, Trainer.DoesNotExist):
            return JsonResponse({'error': 'Пользователь или тренер не найден'}, status=404)
        
        created_records = []
        errors = []
        
        for slot_datetime_str in time_slots:
            try:
                # Парсим дату и время (формат: "2025-12-14T16:30:00")
                # Время приходит в локальном часовом поясе (Europe/Moscow) без указания часового пояса
                # Удаляем 'Z' или часовой пояс, если есть
                if '+' in slot_datetime_str:
                    # Удаляем часовой пояс (например, "+03:00")
                    clean_datetime_str = slot_datetime_str.split('+')[0]
                elif 'Z' in slot_datetime_str:
                    # Удаляем 'Z' (UTC маркер)
                    clean_datetime_str = slot_datetime_str.replace('Z', '')
                else:
                    clean_datetime_str = slot_datetime_str
                
                # Парсим как naive datetime (без часового пояса)
                slot_datetime = datetime.fromisoformat(clean_datetime_str)
                
                # Интерпретируем как локальное время (Europe/Moscow) и делаем aware
                if timezone.is_naive(slot_datetime):
                    # Используем локальный часовой пояс сервера (Europe/Moscow)
                    slot_datetime = timezone.make_aware(slot_datetime)
                
                # Проверяем, что дата в будущем
                if slot_datetime <= timezone.now():
                    errors.append(f'Нельзя записаться на прошедшее время: {slot_datetime_str}')
                    continue
                
                # Проверяем ограничение на месяц вперед
                from datetime import timedelta
                max_date = timezone.now() + timedelta(days=30)
                if slot_datetime > max_date:
                    # Форматируем дату для более понятного сообщения
                    local_max_date = timezone.localtime(max_date)
                    local_slot_date = timezone.localtime(slot_datetime)
                    # Используем русские названия месяцев
                    months_ru = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
                                'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
                    max_date_str = f"{local_max_date.day} {months_ru[local_max_date.month - 1]} {local_max_date.year}"
                    slot_date_str = f"{local_slot_date.day} {months_ru[local_slot_date.month - 1]} {local_slot_date.year}"
                    errors.append(
                        f'Нельзя записаться более чем на месяц вперед. '
                        f'Максимальная дата записи: {max_date_str}. '
                        f'Выбранная дата: {slot_date_str}'
                    )
                    continue
                
                # Проверяем уникальность: один пользователь не может записаться на одно время к одному тренеру дважды
                existing_user_record = Record.objects.filter(
                    user=user_profile,
                    trainer=trainer,
                    datetime=slot_datetime,
                    status='scheduled'
                ).exists()
                
                if existing_user_record:
                    errors.append(f'Вы уже записаны на это время: {slot_datetime_str}')
                    continue
                
                # Проверяем, что слот не занят другим пользователем
                existing_record = Record.objects.filter(
                    trainer=trainer,
                    datetime=slot_datetime,
                    status='scheduled'
                ).exists()
                
                if existing_record:
                    errors.append(f'Слот уже занят: {slot_datetime_str}')
                    continue
                
                # Создаем запись
                record = Record.objects.create(
                    user=user_profile,
                    trainer=trainer,
                    datetime=slot_datetime,
                    status='scheduled'
                )
                created_records.append(serialize_record(record))
                
            except Exception as e:
                error_msg = f'Ошибка создания записи {slot_datetime_str}: {str(e)}'
                print(f"DEBUG: {error_msg}")
                errors.append(error_msg)
        
        if created_records:
            return JsonResponse({
                'success': True,
                'message': f'Создано записей: {len(created_records)}',
                'records': created_records,
                'errors': errors if errors else None
            }, status=201)
        else:
            return JsonResponse({
                'success': False,
                'error': 'Не удалось создать ни одной записи',
                'errors': errors
            }, status=400)
            
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Неверный формат JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def logout_view(request):
    """Выход из системы"""
    try:
        logout(request)
        return JsonResponse({'success': True, 'message': 'Вы успешно вышли из системы'})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def create_gym_review(request):
    """
    Создать отзыв на зал
    POST /api/gym-reviews/
    Body: {gym_id, text, rating}
    """
    try:
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'Необходима авторизация'}, status=401)
        
        data = json.loads(request.body)
        gym_id = data.get('gym_id')
        text = data.get('text', '').strip()
        rating = data.get('rating')
        
        # Валидация
        if not gym_id:
            return JsonResponse({'error': 'Не указан зал'}, status=400)
        
        if not text:
            return JsonResponse({'error': 'Текст отзыва не может быть пустым'}, status=400)
        
        if len(text) < 10:
            return JsonResponse({'error': 'Отзыв должен содержать минимум 10 символов'}, status=400)
        
        if len(text) > 1000:
            return JsonResponse({'error': 'Отзыв не может быть длиннее 1000 символов'}, status=400)
        
        if not rating or not isinstance(rating, int) or rating < 1 or rating > 5:
            return JsonResponse({'error': 'Рейтинг должен быть от 1 до 5'}, status=400)
        
        # Получаем профиль пользователя и зал
        try:
            user_profile = request.user.profile
            gym = Gym.objects.get(id=gym_id)
        except (UserProfile.DoesNotExist, Gym.DoesNotExist):
            return JsonResponse({'error': 'Пользователь или зал не найден'}, status=404)
        
        # Проверяем, нет ли уже отзыва от этого пользователя на этот зал
        existing_review = GymReview.objects.filter(user=user_profile, gym=gym).first()
        
        if existing_review:
            # Обновляем существующий отзыв
            existing_review.text = text
            existing_review.rating = rating
            existing_review.save()
            message = 'Отзыв успешно обновлен'
        else:
            # Создаем новый отзыв
            existing_review = GymReview.objects.create(
                user=user_profile,
                gym=gym,
                text=text,
                rating=rating
            )
            message = 'Отзыв успешно создан'
        
        # Обновляем рейтинг зала
        gym.update_rating()
        
        return JsonResponse({
            'success': True,
            'message': message,
            'review': serialize_gym_review(existing_review)
        }, status=201)
        
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Неверный формат JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

