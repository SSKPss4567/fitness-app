
@csrf_exempt
@require_http_methods(["POST"])
def logout_view(request):
    """Выход из системы"""
    try:
        logout(request)
        return JsonResponse({'success': True, 'message': 'Вы успешно вышли из системы'})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

