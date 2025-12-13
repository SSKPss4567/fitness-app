"""
Django management команда для автоматического обновления статусов тренировок
"""
from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from fitness.models import Record


class Command(BaseCommand):
    help = 'Обновить статусы тренировок (завершить тренировки, которые прошли более 1.5 часов назад)'

    def handle(self, *args, **options):
        self.stdout.write('Обновление статусов тренировок...')
        
        # Находим все назначенные тренировки
        scheduled_records = Record.objects.filter(status='scheduled')
        
        updated_count = 0
        for record in scheduled_records:
            if record.update_status():
                updated_count += 1
        
        self.stdout.write(self.style.SUCCESS(
            f'✓ Обновлено {updated_count} записей (завершено тренировок)'
        ))
        
        # Показываем статистику
        total_scheduled = Record.objects.filter(status='scheduled').count()
        total_completed = Record.objects.filter(status='completed').count()
        total_cancelled = Record.objects.filter(status='cancelled').count()
        
        self.stdout.write(f'\nТекущая статистика:')
        self.stdout.write(f'  Назначено: {total_scheduled}')
        self.stdout.write(f'  Завершено: {total_completed}')
        self.stdout.write(f'  Отменено: {total_cancelled}')

