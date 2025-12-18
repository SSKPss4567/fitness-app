/**
 * API для работы с данными фитнес-приложения
 * Все запросы идут к Django backend
 */

const API_BASE_URL = '';  // Пустая строка, т.к. фронт и бэк на одном домене

/**
 * Базовая функция для выполнения fetch запросов
 */
async function fetchAPI(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });

        const data = await response.json();

        if (!response.ok) {
            // Если есть ошибки валидации, пробрасываем их
            const error = new Error(data.error || `HTTP error! status: ${response.status}`);
            error.errors = data.errors || null;
            error.status = response.status;
            throw error;
        }

        return data;
    } catch (error) {
        console.error(`API Error (${endpoint}):`, error);
        throw error;
    }
}

// ==================== Залы ====================

/**
 * Получить список всех залов
 * @param {Object} filters - Фильтры (search, city, amenities)
 * @returns {Promise<{gyms: Array, count: number}>}
 */
export async function fetchGyms(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.city) params.append('city', filters.city);
    if (filters.amenities) params.append('amenities', filters.amenities);
    if (filters.top) params.append('top', filters.top);
    if (filters.order_by) params.append('order_by', filters.order_by);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return await fetchAPI(`/api/gyms/${query}`);
}

/**
 * Получить детальную информацию о зале
 * @param {number} gymId - ID зала
 * @returns {Promise<Object>}
 */
export async function fetchGymDetail(gymId) {
    return await fetchAPI(`/api/gyms/${gymId}/`);
}

// ==================== Тренеры ====================

/**
 * Получить список всех тренеров
 * @param {Object} filters - Фильтры (search, gym, specialization)
 * @returns {Promise<{trainers: Array, count: number}>}
 */
export async function fetchTrainers(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.gym) params.append('gym', filters.gym);
    if (filters.specialization) params.append('specialization', filters.specialization);
    if (filters.top) params.append('top', filters.top);
    if (filters.order_by) params.append('order_by', filters.order_by);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return await fetchAPI(`/api/trainers/${query}`);
}

/**
 * Получить детальную информацию о тренере
 * @param {number} trainerId - ID тренера
 * @returns {Promise<Object>}
 */
export async function fetchTrainerDetail(trainerId) {
    return await fetchAPI(`/api/trainers/${trainerId}/`);
}

// ==================== Отзывы ====================

/**
 * Получить список отзывов
 * @param {Object} filters - Фильтры (trainer)
 * @returns {Promise<{reviews: Array, count: number}>}
 */
export async function fetchReviews(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.trainer) params.append('trainer', filters.trainer);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return await fetchAPI(`/api/reviews/${query}`);
}

/**
 * Создать новый отзыв
 * @param {Object} reviewData - Данные отзыва
 * @returns {Promise<Object>}
 */
export async function createReview(reviewData) {
    return await fetchAPI('/api/reviews/', {
        method: 'POST',
        body: JSON.stringify(reviewData),
    });
}

// ==================== Записи ====================

/**
 * Получить список записей
 * @param {Object} filters - Фильтры (user, trainer, status)
 * @returns {Promise<{records: Array, count: number}>}
 */
export async function fetchRecords(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.user) params.append('user', filters.user);
    if (filters.trainer) params.append('trainer', filters.trainer);
    if (filters.status) params.append('status', filters.status);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return await fetchAPI(`/api/records/${query}`);
}

/**
 * Создать новую запись на тренировку
 * @param {Object} recordData - Данные записи
 * @returns {Promise<Object>}
 */
export async function createRecord(recordData) {
    return await fetchAPI('/api/records/', {
        method: 'POST',
        body: JSON.stringify(recordData),
    });
}

/**
 * Отменить запись на тренировку
 * @param {number} recordId - ID записи
 * @returns {Promise<Object>}
 */
export async function cancelRecord(recordId) {
    return await fetchAPI(`/api/records/${recordId}/cancel/`, {
        method: 'POST',
    });
}

/**
 * Создать записи на тренировки
 * @param {number} trainerId - ID тренера
 * @param {Array<string>} timeSlots - Массив временных слотов в формате ISO
 * @returns {Promise<Object>}
 */
export async function createRecords(trainerId, timeSlots) {
    return await fetchAPI('/api/records/create/', {
        method: 'POST',
        body: JSON.stringify({
            trainer_id: trainerId,
            time_slots: timeSlots
        }),
    });
}

// ==================== Пользователи ====================

/**
 * Получить профиль пользователя
 * @param {number} userId - ID пользователя
 * @returns {Promise<Object>}
 */
export async function fetchUserProfile(userId) {
    return await fetchAPI(`/api/users/${userId}/`);
}

// ==================== Вспомогательные ====================

/**
 * Получить список всех специализаций
 * @returns {Promise<{specializations: Array}>}
 */
export async function fetchSpecializations() {
    return await fetchAPI('/api/specializations/');
}

/**
 * Получить список всех городов
 * @returns {Promise<{cities: Array}>}
 */
export async function fetchCities() {
    return await fetchAPI('/api/cities/');
}

// ==================== Аутентификация ====================

/**
 * Получить информацию о текущем авторизованном пользователе
 * @returns {Promise<Object>}
 */
export async function fetchCurrentUser() {
    return await fetchAPI('/api/auth/current-user/');
}

/**
 * Войти в систему
 * @param {string} email - Email пользователя
 * @param {string} password - Пароль
 * @returns {Promise<Object>}
 */
export async function loginUser(email, password) {
    return await fetchAPI('/api/auth/login/', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
}

/**
 * Зарегистрировать нового пользователя
 * @param {Object} userData - Данные пользователя (email, password, full_name, age, gender, phone)
 * @returns {Promise<Object>}
 */
export async function registerUser(userData) {
    return await fetchAPI('/api/register/', {
        method: 'POST',
        body: JSON.stringify(userData),
    });
}

/**
 * Выйти из системы
 * @returns {Promise<Object>}
 */
export async function logoutUser() {
    return await fetchAPI('/api/auth/logout/', {
        method: 'POST',
    });
}

// ==================== Для совместимости со старым кодом ====================

/**
 * Получить тренеров зала (для совместимости)
 * @param {number} gymId - ID зала
 * @param {number} page - Номер страницы
 * @returns {Promise<Object>}
 */
export async function fetchGymTrainersPage(gymId, page = 1) {
    const gymData = await fetchGymDetail(gymId);
    return {
        trainers: gymData.trainers || [],
        totalPages: 1,
        currentPage: page,
    };
}
