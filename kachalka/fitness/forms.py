"""
Django формы для валидации и обработки бизнес-логики
Используем ModelForm для работы с моделями
"""
from django import forms
from django.core.exceptions import ValidationError
from django.utils import timezone
from datetime import datetime, timedelta
from django.contrib.auth.models import User as DjangoUser
from .models import Gym, Trainer, UserProfile, Record, Review, GymReview
import re


# ==================== Формы для фильтрации (обычные Form) ====================

class GymFilterForm(forms.Form):
    """Форма для фильтрации залов"""
    search = forms.CharField(
        required=False,
        max_length=255,
        widget=forms.TextInput(attrs={'placeholder': 'Поиск по названию или адресу'})
    )
    city = forms.CharField(
        required=False,
        max_length=100,
        widget=forms.TextInput(attrs={'placeholder': 'Город'})
    )
    amenities = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={'placeholder': 'Удобства через запятую'})
    )

    def filter_queryset(self, queryset):
        """Применяет фильтры к queryset залов"""
        if not self.is_valid():
            return queryset

        data = self.cleaned_data

        # Поиск по названию или адресу
        if data.get('search'):
            from django.db.models import Q
            search = data['search'].strip()
            queryset = queryset.filter(
                Q(name__icontains=search) | Q(address__icontains=search)
            )

        # Фильтр по городу
        if data.get('city'):
            city = data['city'].strip()
            queryset = queryset.filter(address__icontains=city)

        # Фильтр по удобствам
        if data.get('amenities'):
            amenities_list = [a.strip() for a in data['amenities'].split(',') if a.strip()]
            for amenity in amenities_list:
                queryset = queryset.filter(amenities__icontains=amenity)

        return queryset


class TrainerFilterForm(forms.Form):
    """Форма для фильтрации тренеров"""
    search = forms.CharField(
        required=False,
        max_length=255,
        widget=forms.TextInput(attrs={'placeholder': 'Поиск по имени'})
    )
    gym = forms.IntegerField(
        required=False,
        widget=forms.NumberInput(attrs={'placeholder': 'ID зала'})
    )
    specialization = forms.CharField(
        required=False,
        max_length=255,
        widget=forms.TextInput(attrs={'placeholder': 'Специализация'})
    )

    def clean_gym(self):
        """Валидация ID зала"""
        gym_id = self.cleaned_data.get('gym')
        if gym_id:
            if not Gym.objects.filter(id=gym_id).exists():
                raise ValidationError(f'Зал с ID {gym_id} не найден')
        return gym_id

    def filter_queryset(self, queryset):
        """Применяет фильтры к queryset тренеров"""
        if not self.is_valid():
            return queryset

        data = self.cleaned_data

        # Поиск по имени
        if data.get('search'):
            search = data['search'].strip()
            queryset = queryset.filter(full_name__icontains=search)

        # Фильтр по залу
        if data.get('gym'):
            queryset = queryset.filter(gyms__id=data['gym'])

        # Фильтр по специализации
        if data.get('specialization'):
            specialization = data['specialization'].strip()
            queryset = queryset.filter(specialization__icontains=specialization)

        return queryset.distinct()


class ReviewFilterForm(forms.Form):
    """Форма для фильтрации отзывов"""
    trainer = forms.IntegerField(
        required=False,
        widget=forms.NumberInput(attrs={'placeholder': 'ID тренера'})
    )
    min_rating = forms.IntegerField(
        required=False,
        min_value=1,
        max_value=5,
        widget=forms.NumberInput(attrs={'placeholder': 'Минимальный рейтинг'})
    )

    def clean_trainer(self):
        """Валидация ID тренера"""
        trainer_id = self.cleaned_data.get('trainer')
        if trainer_id:
            if not Trainer.objects.filter(id=trainer_id).exists():
                raise ValidationError(f'Тренер с ID {trainer_id} не найден')
        return trainer_id

    def filter_queryset(self, queryset):
        """Применяет фильтры к queryset отзывов"""
        if not self.is_valid():
            return queryset

        data = self.cleaned_data

        # Фильтр по тренеру
        if data.get('trainer'):
            queryset = queryset.filter(trainer_id=data['trainer'])

        # Фильтр по минимальному рейтингу
        if data.get('min_rating'):
            queryset = queryset.filter(rating__gte=data['min_rating'])

        return queryset


class RecordFilterForm(forms.Form):
    """Форма для фильтрации записей на тренировки"""
    user = forms.IntegerField(
        required=False,
        widget=forms.NumberInput(attrs={'placeholder': 'ID пользователя'})
    )
    trainer = forms.IntegerField(
        required=False,
        widget=forms.NumberInput(attrs={'placeholder': 'ID тренера'})
    )
    status = forms.ChoiceField(
        required=False,
        choices=[('', 'Все')] + Record.STATUS_CHOICES
    )
    date_from = forms.DateTimeField(
        required=False,
        widget=forms.DateTimeInput(attrs={'type': 'datetime-local'})
    )
    date_to = forms.DateTimeField(
        required=False,
        widget=forms.DateTimeInput(attrs={'type': 'datetime-local'})
    )

    def clean_user(self):
        """Валидация ID пользователя"""
        user_id = self.cleaned_data.get('user')
        if user_id:
            if not UserProfile.objects.filter(id=user_id).exists():
                raise ValidationError(f'Пользователь с ID {user_id} не найден')
        return user_id

    def clean_trainer(self):
        """Валидация ID тренера"""
        trainer_id = self.cleaned_data.get('trainer')
        if trainer_id:
            if not Trainer.objects.filter(id=trainer_id).exists():
                raise ValidationError(f'Тренер с ID {trainer_id} не найден')
        return trainer_id

    def clean(self):
        """Валидация диапазона дат"""
        cleaned_data = super().clean()
        date_from = cleaned_data.get('date_from')
        date_to = cleaned_data.get('date_to')

        if date_from and date_to and date_from > date_to:
            raise ValidationError('Дата начала не может быть позже даты окончания')

        return cleaned_data

    def filter_queryset(self, queryset):
        """Применяет фильтры к queryset записей"""
        if not self.is_valid():
            return queryset

        data = self.cleaned_data

        # Фильтр по пользователю
        if data.get('user'):
            queryset = queryset.filter(user_id=data['user'])

        # Фильтр по тренеру
        if data.get('trainer'):
            queryset = queryset.filter(trainer_id=data['trainer'])

        # Фильтр по статусу
        if data.get('status'):
            queryset = queryset.filter(status=data['status'])

        # Фильтр по диапазону дат
        if data.get('date_from'):
            queryset = queryset.filter(datetime__gte=data['date_from'])
        if data.get('date_to'):
            queryset = queryset.filter(datetime__lte=data['date_to'])

        return queryset


# ==================== ModelForm для создания/редактирования ====================

class GymForm(forms.ModelForm):
    """Форма для создания и редактирования зала"""
    
    class Meta:
        model = Gym
        fields = ['name', 'address', 'description', 'amenities']
        widgets = {
            'name': forms.TextInput(attrs={
                'placeholder': 'Название зала',
                'class': 'form-control'
            }),
            'address': forms.TextInput(attrs={
                'placeholder': 'Полный адрес',
                'class': 'form-control'
            }),
            'description': forms.Textarea(attrs={
                'rows': 4,
                'placeholder': 'Описание зала...',
                'class': 'form-control'
            }),
            'amenities': forms.Textarea(attrs={
                'rows': 3,
                'placeholder': 'Удобства (через запятую или с новой строки)',
                'class': 'form-control'
            })
        }
        labels = {
            'name': 'Название',
            'address': 'Адрес',
            'description': 'Описание',
            'amenities': 'Удобства'
        }

    def clean_name(self):
        """Валидация названия зала"""
        name = self.cleaned_data.get('name')
        if len(name) < 3:
            raise ValidationError('Название зала должно содержать минимум 3 символа')
        return name

    def clean_address(self):
        """Валидация адреса"""
        address = self.cleaned_data.get('address')
        if len(address) < 10:
            raise ValidationError('Адрес должен быть более подробным (минимум 10 символов)')
        return address


class TrainerForm(forms.ModelForm):
    """Форма для создания и редактирования тренера"""
    
    class Meta:
        model = Trainer
        fields = ['full_name', 'specialization', 'image', 'description', 'gyms']
        widgets = {
            'full_name': forms.TextInput(attrs={
                'placeholder': 'ФИО тренера',
                'class': 'form-control'
            }),
            'specialization': forms.TextInput(attrs={
                'placeholder': 'Специализация',
                'class': 'form-control'
            }),
            'description': forms.Textarea(attrs={
                'rows': 4,
                'placeholder': 'Описание, опыт работы...',
                'class': 'form-control'
            }),
            'gyms': forms.CheckboxSelectMultiple()
        }
        labels = {
            'full_name': 'Полное имя',
            'specialization': 'Специализация',
            'image': 'Фото тренера',
            'description': 'Описание',
            'gyms': 'Залы'
        }

    def clean_full_name(self):
        """Валидация ФИО"""
        full_name = self.cleaned_data.get('full_name')
        if len(full_name.split()) < 2:
            raise ValidationError('Укажите минимум имя и фамилию')
        return full_name

    def clean_gyms(self):
        """Валидация залов"""
        gyms = self.cleaned_data.get('gyms')
        if not gyms or gyms.count() == 0:
            raise ValidationError('Тренер должен быть привязан хотя бы к одному залу')
        if gyms.count() > 5:
            raise ValidationError('Тренер не может работать более чем в 5 залах')
        return gyms


class UserProfileForm(forms.ModelForm):
    """Форма для редактирования профиля пользователя"""
    
    class Meta:
        model = UserProfile
        fields = ['full_name', 'age', 'gender', 'phone']
        widgets = {
            'full_name': forms.TextInput(attrs={
                'placeholder': 'Полное имя',
                'class': 'form-control'
            }),
            'age': forms.NumberInput(attrs={
                'placeholder': 'Возраст',
                'class': 'form-control',
                'min': 14,
                'max': 120
            }),
            'gender': forms.Select(attrs={
                'class': 'form-control'
            }),
            'phone': forms.TextInput(attrs={
                'placeholder': '+7 (999) 123-45-67',
                'class': 'form-control'
            })
        }
        labels = {
            'full_name': 'Полное имя',
            'age': 'Возраст',
            'gender': 'Пол',
            'phone': 'Телефон'
        }

    def clean_full_name(self):
        """Валидация полного имени"""
        full_name = self.cleaned_data.get('full_name')
        if len(full_name) < 2:
            raise ValidationError('Имя должно содержать минимум 2 символа')
        
        # Проверка уникальности (исключая текущий профиль при редактировании)
        queryset = UserProfile.objects.filter(full_name=full_name)
        if self.instance and self.instance.pk:
            queryset = queryset.exclude(pk=self.instance.pk)
        
        if queryset.exists():
            raise ValidationError('Пользователь с таким полным именем уже существует')
        
        return full_name

    def clean_age(self):
        """Валидация возраста"""
        age = self.cleaned_data.get('age')
        if age and (age < 14 or age > 120):
            raise ValidationError('Возраст должен быть от 14 до 120 лет')
        return age

    def clean_phone(self):
        """Валидация телефона"""
        phone = self.cleaned_data.get('phone')
        if phone:
            # Удаляем все символы кроме цифр и +
            import re
            cleaned_phone = re.sub(r'[^\d+]', '', phone)
            if len(cleaned_phone) < 10:
                raise ValidationError('Номер телефона должен содержать минимум 10 цифр')
            
            # Проверка уникальности (исключая текущий профиль при редактировании)
            queryset = UserProfile.objects.filter(phone=phone)
            if self.instance and self.instance.pk:
                queryset = queryset.exclude(pk=self.instance.pk)
            
            if queryset.exists():
                raise ValidationError('Пользователь с таким номером телефона уже существует')
        
        return phone


class ReviewCreateForm(forms.ModelForm):
    """Форма для создания отзыва"""
    
    class Meta:
        model = Review
        fields = ['user', 'trainer', 'text', 'rating']
        widgets = {
            'text': forms.Textarea(attrs={
                'rows': 4,
                'placeholder': 'Напишите ваш отзыв...'
            }),
            'rating': forms.NumberInput(attrs={
                'min': 1,
                'max': 5,
                'placeholder': 'Оценка от 1 до 5'
            })
        }

    def clean_rating(self):
        """Валидация рейтинга"""
        rating = self.cleaned_data.get('rating')
        if rating < 1 or rating > 5:
            raise ValidationError('Рейтинг должен быть от 1 до 5')
        return rating

    def clean(self):
        """Проверка на дублирование отзыва"""
        cleaned_data = super().clean()
        user = cleaned_data.get('user')
        trainer = cleaned_data.get('trainer')

        if user and trainer:
            # Проверяем, нет ли уже отзыва от этого пользователя на этого тренера
            existing_review = Review.objects.filter(user=user, trainer=trainer)
            
            # Если это редактирование, исключаем текущий отзыв
            if self.instance and self.instance.pk:
                existing_review = existing_review.exclude(pk=self.instance.pk)
            
            if existing_review.exists():
                raise ValidationError(
                    'Вы уже оставили отзыв на этого тренера.'
                )

        return cleaned_data
    
    def clean_text(self):
        """Валидация текста отзыва"""
        text = self.cleaned_data.get('text', '').strip()
        
        if not text:
            raise ValidationError('Текст отзыва не может быть пустым')
        
        if len(text) < 10:
            raise ValidationError('Отзыв должен содержать минимум 10 символов')
        
        if len(text) > 1000:
            raise ValidationError('Отзыв не должен превышать 1000 символов')
        
        return text
    
    def save(self, commit=True):
        """Сохранение отзыва с обновлением рейтинга тренера"""
        review = super().save(commit=False)
        
        if commit:
            review.save()
            # Обновляем средний рейтинг тренера
            review.trainer.update_rating()
        
        return review


class RecordCreateForm(forms.ModelForm):
    """Форма для создания записи на тренировку"""
    
    class Meta:
        model = Record
        fields = ['user', 'trainer', 'datetime']
        widgets = {
            'datetime': forms.DateTimeInput(attrs={
                'type': 'datetime-local',
                'placeholder': 'Выберите дату и время'
            })
        }

    def clean_datetime(self):
        """Валидация даты и времени тренировки"""
        datetime_value = self.cleaned_data.get('datetime')
        
        if not datetime_value:
            raise ValidationError('Необходимо указать дату и время тренировки')

        # Проверка, что дата не в прошлом
        if datetime_value < timezone.now():
            raise ValidationError('Нельзя записаться на тренировку в прошлом')

        # Проверка, что дата не слишком далеко в будущем (например, не более 3 месяцев)
        max_future_date = timezone.now() + timedelta(days=90)
        if datetime_value > max_future_date:
            raise ValidationError('Нельзя записаться на тренировку более чем на 3 месяца вперед')

        # Проверка рабочих часов (с 8:00 до 21:00)
        hour = datetime_value.hour
        if hour < 8 or hour >= 21:
            raise ValidationError('Тренировки доступны только с 8:00 до 21:00')

        return datetime_value

    def clean(self):
        """Проверка доступности тренера в указанное время"""
        cleaned_data = super().clean()
        trainer = cleaned_data.get('trainer')
        datetime_value = cleaned_data.get('datetime')
        user = cleaned_data.get('user')

        if trainer and datetime_value:
            # Проверяем, нет ли уже записи у этого тренера в это время
            # Считаем, что одна тренировка длится 1 час
            time_start = datetime_value
            time_end = datetime_value + timedelta(hours=1)

            conflicting_records = Record.objects.filter(
                trainer=trainer,
                datetime__gte=time_start - timedelta(hours=1),
                datetime__lt=time_end,
                status__in=['pending', 'confirmed']  # Учитываем только активные записи
            )

            if conflicting_records.exists():
                raise ValidationError(
                    f'Тренер {trainer.full_name} уже занят в это время. '
                    'Пожалуйста, выберите другое время.'
                )

        if user and datetime_value:
            # Проверяем, нет ли у пользователя уже записи в это время
            user_conflicting_records = Record.objects.filter(
                user=user,
                datetime__gte=datetime_value - timedelta(hours=1),
                datetime__lt=datetime_value + timedelta(hours=1),
                status__in=['pending', 'confirmed']
            )

            if user_conflicting_records.exists():
                raise ValidationError(
                    'У вас уже есть запись на тренировку в это время. '
                    'Пожалуйста, выберите другое время.'
                )

        return cleaned_data

    def save(self, commit=True):
        """Сохранение записи со статусом 'pending'"""
        record = super().save(commit=False)
        record.status = 'pending'  # По умолчанию новая запись ожидает подтверждения
        
        if commit:
            record.save()
        
        return record


# ==================== Форма для входа ====================

class UserLoginForm(forms.Form):
    """Форма для входа пользователя в систему"""
    
    email = forms.EmailField(
        required=True,
        max_length=255,
        widget=forms.EmailInput(attrs={
            'placeholder': 'example@mail.com',
            'class': 'form-control'
        }),
        label='Email',
        error_messages={
            'required': 'Email обязателен для заполнения',
            'invalid': 'Введите корректный email адрес'
        }
    )
    
    password = forms.CharField(
        required=True,
        min_length=8,
        max_length=24,
        widget=forms.PasswordInput(attrs={
            'placeholder': 'Пароль',
            'class': 'form-control'
        }),
        label='Пароль',
        error_messages={
            'required': 'Пароль обязателен для заполнения',
            'min_length': 'Пароль должен содержать минимум 8 символов',
            'max_length': 'Пароль не должен превышать 24 символа'
        }
    )
    
    def clean_email(self):
        """Валидация email"""
        email = self.cleaned_data.get('email', '').strip().lower()
        
        if not email:
            raise ValidationError('Email обязателен для заполнения')
        
        return email
    
    def clean_password(self):
        """Валидация пароля"""
        password = self.cleaned_data.get('password', '')
        
        if len(password) < 8:
            raise ValidationError('Пароль должен содержать минимум 8 символов')
        
        if len(password) > 24:
            raise ValidationError('Пароль не должен превышать 24 символа')
        
        return password
    
    def authenticate_user(self, request):
        """
        Аутентификация пользователя
        Возвращает пользователя если учетные данные верны, иначе None
        """
        from django.contrib.auth import authenticate
        
        email = self.cleaned_data.get('email')
        password = self.cleaned_data.get('password')
        
        # Аутентификация (username = email)
        user = authenticate(request, username=email, password=password)
        
        if user is None:
            raise ValidationError('Неверный email или пароль')
        
        return user


# ==================== Форма для регистрации ====================

class UserRegistrationForm(forms.ModelForm):
    """Форма для регистрации нового пользователя на основе UserProfile"""
    
    email = forms.EmailField(
        required=True,
        max_length=255,
        widget=forms.EmailInput(attrs={
            'placeholder': 'example@mail.com',
            'class': 'form-control'
        }),
        label='Email',
        error_messages={
            'required': 'Email обязателен для заполнения',
            'invalid': 'Введите корректный email адрес'
        }
    )
    
    password = forms.CharField(
        required=True,
        min_length=8,
        max_length=24,
        widget=forms.PasswordInput(attrs={
            'placeholder': 'Пароль',
            'class': 'form-control'
        }),
        label='Пароль',
        error_messages={
            'required': 'Пароль обязателен для заполнения',
            'min_length': 'Пароль должен содержать минимум 8 символов',
            'max_length': 'Пароль не должен превышать 24 символа'
        }
    )
    
    class Meta:
        model = UserProfile
        fields = ['full_name', 'age', 'gender', 'phone']
        widgets = {
            'full_name': forms.TextInput(attrs={
                'placeholder': 'Иван Иванов',
                'class': 'form-control'
            }),
            'age': forms.NumberInput(attrs={
                'placeholder': 'Возраст',
                'class': 'form-control',
                'min': 14,
                'max': 120
            }),
            'gender': forms.Select(attrs={
                'class': 'form-control'
            }),
            'phone': forms.TextInput(attrs={
                'placeholder': '+7 (999) 123-45-67',
                'class': 'form-control'
            })
        }
        labels = {
            'full_name': 'Полное имя',
            'age': 'Возраст',
            'gender': 'Пол',
            'phone': 'Телефон'
        }
        error_messages = {
            'full_name': {
                'required': 'Полное имя обязательно для заполнения',
            }
        }
    
    def clean_email(self):
        """Валидация email - проверка уникальности"""
        email = self.cleaned_data.get('email', '').strip().lower()
        
        if not email:
            raise ValidationError('Email обязателен для заполнения')
        
        # Проверка существования пользователя с таким email
        if DjangoUser.objects.filter(email=email).exists():
            raise ValidationError('Пользователь с таким email уже существует')
        
        if DjangoUser.objects.filter(username=email).exists():
            raise ValidationError('Пользователь с таким email уже существует')
        
        return email
    
    def clean_password(self):
        """Валидация пароля"""
        password = self.cleaned_data.get('password', '')
        
        if len(password) < 8:
            raise ValidationError('Пароль должен содержать минимум 8 символов')
        
        if len(password) > 24:
            raise ValidationError('Пароль не должен превышать 24 символа')
        
        # Проверка на пробелы в начале
        if password.startswith((' ', '\t', '\n')):
            raise ValidationError('Пароль не должен начинаться с пробела')
        
        return password
    
    def clean_full_name(self):
        """Валидация полного имени"""
        full_name = self.cleaned_data.get('full_name', '').strip()
        
        if len(full_name) < 2:
            raise ValidationError('Имя должно содержать минимум 2 символа')
        
        # Проверка на наличие минимум двух слов (имя и фамилия)
        if len(full_name.split()) < 2:
            raise ValidationError('Укажите минимум имя и фамилию')
        
        # Проверка уникальности полного имени
        if UserProfile.objects.filter(full_name=full_name).exists():
            raise ValidationError('Пользователь с таким полным именем уже существует')
        
        return full_name
    
    def clean_phone(self):
        """Валидация телефона"""
        phone = self.cleaned_data.get('phone', '').strip()
        
        if phone:
            # Удаляем все символы кроме цифр и +
            cleaned_phone = re.sub(r'[^\d+]', '', phone)
            
            if len(cleaned_phone) < 10:
                raise ValidationError('Номер телефона должен содержать минимум 10 цифр')
            
            if len(cleaned_phone) > 20:
                raise ValidationError('Номер телефона слишком длинный')
            
            # Проверка уникальности телефона
            if UserProfile.objects.filter(phone=phone).exists():
                raise ValidationError('Пользователь с таким номером телефона уже существует')
        
        return phone
    
    def save(self, commit=True):
        """Создание пользователя и профиля"""
        # Получаем данные из формы
        email = self.cleaned_data['email']
        password = self.cleaned_data['password']
        
        # Создаем Django User
        user = DjangoUser.objects.create_user(
            username=email,
            email=email,
            password=password
        )
        
        # Получаем автоматически созданный профиль (через сигнал)
        profile = user.profile
        
        # Обновляем данные профиля из формы
        profile.full_name = self.cleaned_data['full_name']
        profile.age = self.cleaned_data.get('age')
        profile.gender = self.cleaned_data.get('gender')
        profile.phone = self.cleaned_data.get('phone')
        
        if commit:
            profile.save()
        
        return profile


class GymReviewCreateForm(forms.ModelForm):
    """Форма для создания отзыва на зал"""
    
    class Meta:
        model = GymReview
        fields = ['user', 'gym', 'text', 'rating']
        widgets = {
            'text': forms.Textarea(attrs={
                'rows': 4,
                'placeholder': 'Напишите ваш отзыв о зале...'
            }),
            'rating': forms.NumberInput(attrs={
                'min': 1,
                'max': 5,
                'placeholder': 'Оценка от 1 до 5'
            })
        }

    def clean_rating(self):
        """Валидация рейтинга"""
        rating = self.cleaned_data.get('rating')
        if rating < 1 or rating > 5:
            raise ValidationError('Рейтинг должен быть от 1 до 5')
        return rating

    def clean(self):
        """Проверка на дублирование отзыва"""
        cleaned_data = super().clean()
        user = cleaned_data.get('user')
        gym = cleaned_data.get('gym')

        if user and gym:
            # Проверяем, нет ли уже отзыва от этого пользователя на этот зал
            existing_review = GymReview.objects.filter(user=user, gym=gym)
            
            # Если это редактирование, исключаем текущий отзыв
            if self.instance and self.instance.pk:
                existing_review = existing_review.exclude(pk=self.instance.pk)
            
            if existing_review.exists():
                raise ValidationError(
                    'Вы уже оставили отзыв на этот зал.'
                )

        return cleaned_data
    
    def clean_text(self):
        """Валидация текста отзыва"""
        text = self.cleaned_data.get('text', '').strip()
        
        if not text:
            raise ValidationError('Текст отзыва не может быть пустым')
        
        if len(text) < 10:
            raise ValidationError('Отзыв должен содержать минимум 10 символов')
        
        if len(text) > 1000:
            raise ValidationError('Отзыв не может быть длиннее 1000 символов')
        
        return text

