from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User as DjangoUser
from .models import UserProfile, Gym, GymImage, Trainer, Record, Review, GymReview


class UserProfileInline(admin.StackedInline):
    """Inline для профиля пользователя"""
    model = UserProfile
    can_delete = False
    verbose_name = 'Профиль'
    verbose_name_plural = 'Профиль'
    fields = ('full_name', 'age', 'gender', 'phone', 'created_at')
    readonly_fields = ('created_at',)


class CustomUserAdmin(BaseUserAdmin):
    """Расширенная админка для пользователей"""
    inlines = (UserProfileInline,)
    list_display = ('username', 'email', 'get_full_name', 'is_staff', 'date_joined')
    search_fields = ('username', 'email', 'first_name', 'last_name', 'profile__full_name')
    
    def get_full_name(self, obj):
        if hasattr(obj, 'profile'):
            return obj.profile.full_name
        return obj.get_full_name()
    get_full_name.short_description = 'Полное имя'


# Перерегистрируем встроенную модель User
admin.site.unregister(DjangoUser)
admin.site.register(DjangoUser, CustomUserAdmin)


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    """Админка для профилей пользователей"""
    list_display = ('id', 'full_name', 'get_email', 'age', 'gender', 'phone', 'created_at')
    list_display_links = ('id', 'full_name')
    search_fields = ('full_name', 'user__email', 'user__username', 'phone')
    list_filter = ('created_at', 'gender', 'age')
    readonly_fields = ('created_at',)
    autocomplete_fields = []
    fieldsets = (
        ('Связь с пользователем', {
            'fields': ('user',)
        }),
        ('Основная информация', {
            'fields': ('full_name', 'age', 'gender', 'phone')
        }),
        ('Системная информация', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    ordering = ('-created_at',)
    date_hierarchy = 'created_at'
    
    def get_email(self, obj):
        return obj.user.email
    get_email.short_description = 'Email'


class GymImageInline(admin.TabularInline):
    """Inline для изображений зала"""
    model = GymImage
    extra = 1
    min_num = 4
    max_num = 8
    fields = ('image', 'order', 'preview')
    readonly_fields = ('preview',)
    
    def preview(self, obj):
        if obj.image:
            return f'<img src="{obj.image.url}" style="max-width: 100px; max-height: 100px;" />'
        return "Нет изображения"
    preview.short_description = 'Предпросмотр'
    preview.allow_tags = True


@admin.register(Gym)
class GymAdmin(admin.ModelAdmin):
    """Админка для спортивных залов"""
    list_display = ('id', 'name', 'address', 'rating', 'images_count', 'created_at')
    list_display_links = ('id', 'name')
    search_fields = ('name', 'address', 'description')
    list_filter = ('created_at', 'rating')
    readonly_fields = ('created_at', 'rating')
    inlines = [GymImageInline]
    fieldsets = (
        ('Основная информация', {
            'fields': ('name', 'address')
        }),
        ('Дополнительная информация', {
            'fields': ('description', 'amenities', 'rating')
        }),
        ('Системная информация', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    ordering = ('name',)
    date_hierarchy = 'created_at'
    
    def images_count(self, obj):
        return obj.images.count()
    images_count.short_description = 'Количество фото'


@admin.register(Trainer)
class TrainerAdmin(admin.ModelAdmin):
    """Админка для тренеров"""
    list_display = ('id', 'full_name', 'specialization', 'get_gyms', 'created_at')
    list_display_links = ('id', 'full_name')
    search_fields = ('full_name', 'specialization', 'description')
    autocomplete_fields = []
    list_filter = ('specialization', 'gyms', 'created_at')
    readonly_fields = ('created_at', 'preview_image')
    filter_horizontal = ('gyms',)  # Удобный виджет для выбора нескольких залов
    fieldsets = (
        ('Основная информация', {
            'fields': ('full_name', 'specialization', 'image', 'preview_image')
        }),
        ('Спортивные залы', {
            'fields': ('gyms',)
        }),
        ('Дополнительная информация', {
            'fields': ('description',)
        }),
        ('Системная информация', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    ordering = ('full_name',)
    date_hierarchy = 'created_at'
    
    def get_gyms(self, obj):
        return ", ".join([gym.name for gym in obj.gyms.all()[:3]]) + ("..." if obj.gyms.count() > 3 else "")
    get_gyms.short_description = 'Залы'
    
    def preview_image(self, obj):
        if obj.image:
            return f'<img src="{obj.image.url}" style="max-width: 200px; max-height: 200px;" />'
        return "Нет изображения"
    preview_image.short_description = 'Предпросмотр фото'
    preview_image.allow_tags = True


@admin.register(Record)
class RecordAdmin(admin.ModelAdmin):
    """Админка для записей на тренировки"""
    list_display = ('id', 'user', 'trainer', 'datetime', 'status', 'created_at')
    list_display_links = ('id',)
    search_fields = ('user__full_name', 'user__email', 'trainer__full_name')
    list_filter = ('status', 'datetime', 'created_at')
    readonly_fields = ('created_at',)
    autocomplete_fields = ('user', 'trainer')
    fieldsets = (
        ('Информация о записи', {
            'fields': ('user', 'trainer', 'datetime', 'status')
        }),
        ('Системная информация', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    ordering = ('-datetime',)
    date_hierarchy = 'datetime'
    list_per_page = 25
    
    actions = ['mark_as_confirmed', 'mark_as_cancelled', 'mark_as_completed']
    
    @admin.action(description='Подтвердить выбранные записи')
    def mark_as_confirmed(self, request, queryset):
        updated = queryset.update(status='confirmed')
        self.message_user(request, f'Подтверждено записей: {updated}')
    
    @admin.action(description='Отменить выбранные записи')
    def mark_as_cancelled(self, request, queryset):
        updated = queryset.update(status='cancelled')
        self.message_user(request, f'Отменено записей: {updated}')
    
    @admin.action(description='Отметить как завершенные')
    def mark_as_completed(self, request, queryset):
        updated = queryset.update(status='completed')
        self.message_user(request, f'Завершено записей: {updated}')


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    """Админка для отзывов на тренеров"""
    list_display = ('id', 'user', 'trainer', 'rating', 'created_at', 'updated_at')
    list_display_links = ('id',)
    search_fields = ('user__full_name', 'trainer__full_name', 'text')
    list_filter = ('rating', 'created_at', 'updated_at')
    readonly_fields = ('created_at', 'updated_at')
    autocomplete_fields = ('user', 'trainer')
    fieldsets = (
        ('Информация об отзыве', {
            'fields': ('user', 'trainer', 'rating', 'text')
        }),
        ('Системная информация', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    ordering = ('-created_at',)
    date_hierarchy = 'created_at'
    list_per_page = 25


@admin.register(GymReview)
class GymReviewAdmin(admin.ModelAdmin):
    """Админка для отзывов на залы"""
    list_display = ('id', 'user', 'gym', 'rating', 'created_at', 'updated_at')
    list_display_links = ('id',)
    search_fields = ('user__full_name', 'gym__name', 'text')
    list_filter = ('rating', 'created_at', 'updated_at')
    readonly_fields = ('created_at', 'updated_at')
    autocomplete_fields = ('user',)
    fieldsets = (
        ('Информация об отзыве', {
            'fields': ('user', 'gym', 'rating', 'text')
        }),
        ('Системная информация', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    ordering = ('-created_at',)
    date_hierarchy = 'created_at'
    list_per_page = 25


# Настройка заголовков админки
admin.site.site_header = "Fitness - Панель администратора"
admin.site.site_title = "Fitness Admin"
admin.site.index_title = "Управление системой"
