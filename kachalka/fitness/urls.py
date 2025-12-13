from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, re_path
from django.views.static import serve

from . import views

urlpatterns = [
    # ==================== API endpoints ====================
    # Залы
    path("api/gyms/", views.gyms_list, name="gyms_list"),
    path("api/gyms/<int:gym_id>/", views.gym_detail, name="gym_detail"),
    
    # Тренеры
    path("api/trainers/", views.trainers_list, name="trainers_list"),
    path("api/trainers/<int:trainer_id>/", views.trainer_detail, name="trainer_detail"),
    
    # Отзывы
    path("api/reviews/", views.reviews_list, name="reviews_list"),
    path("api/gym-reviews/", views.create_gym_review, name="create_gym_review"),
    
    # Записи
    path("api/records/", views.records_list, name="records_list"),
    path("api/records/create/", views.create_records, name="create_records"),
    path("api/records/<int:record_id>/cancel/", views.cancel_record, name="cancel_record"),
    
    # Пользователи
    path("api/users/<int:user_id>/", views.user_profile, name="user_profile"),
    
    # Вспомогательные
    path("api/specializations/", views.specializations_list, name="specializations_list"),
    path("api/cities/", views.cities_list, name="cities_list"),
    
    # Аутентификация
    path("api/auth/current-user/", views.current_user, name="current_user"),
    path("api/auth/login/", views.login_view, name="login"),
    path("api/auth/logout/", views.logout_view, name="logout"),
    path("api/register/", views.register, name="register"),
    
    # ==================== Статические файлы ====================
    # Отдаём собранные ассеты по пути /assets/...
    re_path(
        r"^assets/(?P<path>.*)$",
        serve,
        {"document_root": settings.BASE_DIR / "fitness" / "static" / "assets"},
    ),
    # Отдаём изображения напрямую из корня static (для совместимости с Vite)
    re_path(
        r"^(?P<path>gym\.png|vite\.svg|back\.jpg)$",
        serve,
        {"document_root": settings.BASE_DIR / "fitness" / "static"},
    ),
] + static(settings.STATIC_URL, document_root=settings.BASE_DIR / "fitness" / "static") + [
    # ==================== React SPA ====================
    # Главная страница
    path("", views.index, name="index"),
    # Любой другой путь отдаём фронту, кроме API и статики
    re_path(r"^(?!api/|static/|assets/|media/|gym\.png|vite\.svg|back\.jpg).*$", views.index, name="spa"),
]

