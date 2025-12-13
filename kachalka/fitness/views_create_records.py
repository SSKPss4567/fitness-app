
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
        
        print(f"DEBUG: Получены time_slots: {time_slots}")
        print(f"DEBUG: Текущее время: {timezone.now()}")
        
        for slot_datetime_str in time_slots:
            try:
                # Парсим дату и время
                slot_datetime = timezone.datetime.fromisoformat(slot_datetime_str.replace('Z', '+00:00'))
                print(f"DEBUG: Парсинг слота {slot_datetime_str} -> {slot_datetime}")
                
                # Проверяем, что дата в будущем
                if slot_datetime <= timezone.now():
                    error_msg = f'Нельзя записаться на прошедшее время: {slot_datetime_str} (parsed: {slot_datetime}, now: {timezone.now()})'
                    print(f"DEBUG: {error_msg}")
                    errors.append(error_msg)
                    continue
                
                # Проверяем, что слот не занят
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
                errors.append(f'Ошибка создания записи {slot_datetime_str}: {str(e)}')
        
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

