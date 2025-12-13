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

