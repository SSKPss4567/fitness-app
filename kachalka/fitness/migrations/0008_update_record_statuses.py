# Generated manually to update existing record statuses

from django.db import migrations


def update_statuses(apps, schema_editor):
    """Обновить старые статусы на новые"""
    Record = apps.get_model('fitness', 'Record')
    
    # pending и confirmed -> scheduled
    Record.objects.filter(status__in=['pending', 'confirmed']).update(status='scheduled')


def reverse_update_statuses(apps, schema_editor):
    """Откатить изменения статусов"""
    Record = apps.get_model('fitness', 'Record')
    
    # scheduled -> confirmed (выбираем confirmed как наиболее близкий)
    Record.objects.filter(status='scheduled').update(status='confirmed')


class Migration(migrations.Migration):

    dependencies = [
        ("fitness", "0007_alter_record_status"),
    ]

    operations = [
        migrations.RunPython(update_statuses, reverse_update_statuses),
    ]

