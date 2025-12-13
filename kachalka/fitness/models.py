from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth.models import User as DjangoUser
from django.db.models.signals import post_save
from django.dispatch import receiver


class UserProfile(models.Model):
    """Профиль пользователя (расширение базового User)"""
    GENDER_CHOICES = [
        ('M', 'Мужской'),
        ('F', 'Женский'),
    ]
    
    user = models.OneToOneField(
        DjangoUser,
        on_delete=models.CASCADE,
        related_name='profile',
        verbose_name="Пользователь"
    )
    full_name = models.CharField(
        max_length=255, 
        verbose_name="Полное имя",
        unique=True,
        db_index=True
    )
    age = models.PositiveIntegerField(
        validators=[MinValueValidator(14), MaxValueValidator(120)],
        verbose_name="Возраст",
        null=True,
        blank=True
    )
    gender = models.CharField(
        max_length=1,
        choices=GENDER_CHOICES,
        verbose_name="Пол",
        null=True,
        blank=True
    )
    phone = models.CharField(
        max_length=20, 
        verbose_name="Телефон", 
        blank=True, 
        null=True,
        unique=True,
        db_index=True
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")

    class Meta:
        db_table = 'users'
        verbose_name = "Профиль пользователя"
        verbose_name_plural = "Профили пользователей"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['full_name']),
            models.Index(fields=['phone']),
        ]

    def __str__(self):
        return f"{self.full_name} ({self.user.email})"


@receiver(post_save, sender=DjangoUser)
def create_user_profile(sender, instance, created, **kwargs):
    """Автоматически создавать профиль при создании пользователя"""
    if created:
        UserProfile.objects.create(user=instance, full_name=instance.get_full_name() or instance.username)


@receiver(post_save, sender=DjangoUser)
def save_user_profile(sender, instance, **kwargs):
    """Автоматически сохранять профиль при сохранении пользователя"""
    if hasattr(instance, 'profile'):
        instance.profile.save()


class Gym(models.Model):
    """Модель спортивного зала"""
    name = models.CharField(max_length=255, verbose_name="Название")
    address = models.CharField(max_length=500, verbose_name="Адрес")
    description = models.TextField(blank=True, null=True, verbose_name="Описание")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    amenities = models.TextField(blank=True, null=True, verbose_name="Удобства")
    rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        default=0.00,
        verbose_name="Средний рейтинг",
        help_text="Среднее арифметическое всех оценок"
    )
    
    class Meta:
        db_table = 'gyms'
        verbose_name = "Спортивный зал"
        verbose_name_plural = "Спортивные залы"
        ordering = ['name']

    def __str__(self):
        return self.name
    
    def update_rating(self):
        """Обновить средний рейтинг на основе отзывов"""
        from django.db.models import Avg
        avg_rating = self.gym_reviews.aggregate(Avg('rating'))['rating__avg']
        self.rating = round(avg_rating, 2) if avg_rating else 0.00
        self.save(update_fields=['rating'])


class GymImage(models.Model):
    """Модель изображения спортивного зала"""
    gym = models.ForeignKey(
        Gym,
        on_delete=models.CASCADE,
        related_name='images',
        verbose_name="Спортивный зал"
    )
    image = models.ImageField(upload_to='gyms/', verbose_name="Изображение")
    order = models.PositiveIntegerField(default=0, verbose_name="Порядок отображения")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")

    class Meta:
        db_table = 'gym_images'
        verbose_name = "Изображение зала"
        verbose_name_plural = "Изображения залов"
        ordering = ['gym', 'order']

    def __str__(self):
        return f"Изображение {self.order} для {self.gym.name}"


class Trainer(models.Model):
    """Модель тренера"""
    full_name = models.CharField(max_length=255, verbose_name="Полное имя")
    specialization = models.CharField(max_length=255, verbose_name="Специализация", db_index=True)
    image = models.ImageField(upload_to='trainers/', blank=True, null=True, verbose_name="Фото тренера")
    description = models.TextField(blank=True, null=True, verbose_name="Описание")
    rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        default=0.00,
        verbose_name="Средний рейтинг",
        help_text="Среднее арифметическое всех оценок"
    )
    gyms = models.ManyToManyField(
        Gym,
        related_name='trainers',
        verbose_name="Спортивные залы",
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")

    class Meta:
        db_table = 'trainers'
        verbose_name = "Тренер"
        verbose_name_plural = "Тренеры"
        ordering = ['full_name']
        indexes = [
            models.Index(fields=['specialization']),
        ]

    def __str__(self):
        return f"{self.full_name} - {self.specialization}"
    
    def update_rating(self):
        """Обновить средний рейтинг на основе отзывов"""
        from django.db.models import Avg
        avg_rating = self.reviews.aggregate(Avg('rating'))['rating__avg']
        self.rating = round(avg_rating, 2) if avg_rating else 0.00
        self.save(update_fields=['rating'])


class Record(models.Model):
    """Модель записи на тренировку"""
    STATUS_CHOICES = [
        ('scheduled', 'Назначена'),
        ('cancelled', 'Отменена'),
        ('completed', 'Завершена'),
    ]

    user = models.ForeignKey(
        UserProfile,
        on_delete=models.CASCADE,
        related_name='records',
        verbose_name="Пользователь",
        db_index=True
    )
    trainer = models.ForeignKey(
        Trainer,
        on_delete=models.CASCADE,
        related_name='records',
        verbose_name="Тренер",
        db_index=True
    )
    datetime = models.DateTimeField(verbose_name="Дата и время тренировки")
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='scheduled',
        verbose_name="Статус"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")

    class Meta:
        db_table = 'records'
        verbose_name = "Запись на тренировку"
        verbose_name_plural = "Записи на тренировки"
        ordering = ['-datetime']
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['trainer']),
            models.Index(fields=['datetime']),
            models.Index(fields=['status']),
        ]

    def __str__(self):
        return f"{self.user.full_name} -> {self.trainer.full_name} ({self.datetime.strftime('%d.%m.%Y %H:%M')})"
    
    def can_cancel(self):
        """Проверить, можно ли отменить тренировку"""
        from django.utils import timezone
        return self.status == 'scheduled' and self.datetime > timezone.now()
    
    def cancel(self):
        """Отменить тренировку"""
        if self.can_cancel():
            self.status = 'cancelled'
            self.save(update_fields=['status'])
            return True
        return False
    
    def update_status(self):
        """Автоматически обновить статус тренировки"""
        from django.utils import timezone
        from datetime import timedelta
        
        if self.status == 'scheduled':
            # Если прошло 1.5 часа после начала тренировки, она завершена
            training_end_time = self.datetime + timedelta(hours=1, minutes=30)
            if timezone.now() >= training_end_time:
                self.status = 'completed'
                self.save(update_fields=['status'])
                return True
        return False


class Review(models.Model):
    """Модель отзыва на тренера"""
    user = models.ForeignKey(
        UserProfile,
        on_delete=models.CASCADE,
        related_name='reviews',
        verbose_name="Пользователь"
    )
    trainer = models.ForeignKey(
        Trainer,
        on_delete=models.CASCADE,
        related_name='reviews',
        verbose_name="Тренер",
        db_index=True
    )
    text = models.TextField(verbose_name="Текст отзыва")
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        verbose_name="Рейтинг"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")

    class Meta:
        db_table = 'reviews'
        verbose_name = "Отзыв на тренера"
        verbose_name_plural = "Отзывы на тренеров"
        ordering = ['-created_at']
        unique_together = [['user', 'trainer']]
        indexes = [
            models.Index(fields=['trainer']),
            models.Index(fields=['rating']),
        ]

    def __str__(self):
        return f"Отзыв от {self.user.full_name} на {self.trainer.full_name} ({self.rating}/5)"


class GymReview(models.Model):
    """Модель отзыва на зал"""
    user = models.ForeignKey(
        UserProfile,
        on_delete=models.CASCADE,
        related_name='gym_reviews',
        verbose_name="Пользователь"
    )
    gym = models.ForeignKey(
        Gym,
        on_delete=models.CASCADE,
        related_name='gym_reviews',
        verbose_name="Спортивный зал",
        db_index=True
    )
    text = models.TextField(verbose_name="Текст отзыва")
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        verbose_name="Рейтинг"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")

    class Meta:
        db_table = 'gym_reviews'
        verbose_name = "Отзыв на зал"
        verbose_name_plural = "Отзывы на залы"
        ordering = ['-created_at']
        unique_together = [['user', 'gym']]
        indexes = [
            models.Index(fields=['gym']),
            models.Index(fields=['rating']),
        ]

    def __str__(self):
        return f"Отзыв от {self.user.full_name} на {self.gym.name} ({self.rating}/5)"
