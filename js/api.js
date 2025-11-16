/**
 * API 통신 모듈
 *
 * 백엔드 API와의 통신을 담당합니다.
 */

const API = {
    baseURL: window.location.hostname === 'localhost'
        ? 'http://localhost:8080/api'
        : 'https://gameinfobackend-production.up.railway.app/api',

    /**
     * HTTP 요청 헬퍼
     *
     * @param {string} endpoint - API 엔드포인트
     * @param {object} options - fetch 옵션
     * @returns {Promise}
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;

        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        // 토큰이 있으면 헤더에 추가
        const token = localStorage.getItem('authToken');
        if (token) {
            defaultOptions.headers['Authorization'] = `Bearer ${token}`;
        }

        const config = { ...defaultOptions, ...options };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || 'API request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    /**
     * 게임 관련 API
     */
    games: {
        /**
         * 게임 목록 조회
         *
         * @param {object} params - 쿼리 파라미터
         * @returns {Promise}
         */
        async getAll(params = {}) {
            const queryString = new URLSearchParams(params).toString();
            const endpoint = `/games${queryString ? '?' + queryString : ''}`;
            return API.request(endpoint);
        },

        /**
         * 게임 상세 조회
         *
         * @param {number} gameId - 게임 ID
         * @returns {Promise}
         */
        async getById(gameId) {
            return API.request(`/games/${gameId}`);
        },

        /**
         * 게임 추가
         *
         * @param {object} gameData - 게임 데이터
         * @returns {Promise}
         */
        async create(gameData) {
            return API.request('/games', {
                method: 'POST',
                body: JSON.stringify(gameData),
            });
        },

        /**
         * 게임 수정
         *
         * @param {number} gameId - 게임 ID
         * @param {object} gameData - 게임 데이터
         * @returns {Promise}
         */
        async update(gameId, gameData) {
            return API.request(`/games/${gameId}`, {
                method: 'PUT',
                body: JSON.stringify(gameData),
            });
        },

        /**
         * 게임 삭제
         *
         * @param {number} gameId - 게임 ID
         * @returns {Promise}
         */
        async delete(gameId) {
            return API.request(`/games/${gameId}`, {
                method: 'DELETE',
            });
        },
    },

    /**
     * 업데이트 관련 API
     */
    updates: {
        /**
         * 업데이트 목록 조회
         *
         * @param {object} params - 쿼리 파라미터
         * @returns {Promise}
         */
        async getAll(params = {}) {
            const queryString = new URLSearchParams(params).toString();
            const endpoint = `/updates${queryString ? '?' + queryString : ''}`;
            return API.request(endpoint);
        },

        /**
         * 업데이트 상세 조회
         *
         * @param {number} updateId - 업데이트 ID
         * @returns {Promise}
         */
        async getById(updateId) {
            return API.request(`/updates/${updateId}`);
        },

        /**
         * 업데이트 추가
         *
         * @param {object} updateData - 업데이트 데이터
         * @returns {Promise}
         */
        async create(updateData) {
            return API.request('/updates', {
                method: 'POST',
                body: JSON.stringify(updateData),
            });
        },
    },

    /**
     * 버전 관련 API
     */
    versions: {
        /**
         * 게임별 버전 목록 조회
         *
         * @param {number} gameId - 게임 ID
         * @returns {Promise}
         */
        async getByGame(gameId) {
            return API.request(`/versions?game_id=${gameId}`);
        },

        /**
         * 특정 버전 상세 조회
         *
         * @param {number} versionId - 버전 ID
         * @returns {Promise}
         */
        async getById(versionId) {
            return API.request(`/versions/${versionId}`);
        },

        /**
         * 버전별 업데이트 항목 조회
         *
         * @param {number} versionId - 버전 ID
         * @param {string} category - 카테고리 필터 (선택)
         * @returns {Promise}
         */
        async getItems(versionId, category = null) {
            const url = category
                ? `/versions/${versionId}/items?category=${category}`
                : `/versions/${versionId}/items`;
            return API.request(url);
        },

        /**
         * 버전 생성 (관리자)
         */
        async create(versionData) {
            return API.request('/versions', {
                method: 'POST',
                body: JSON.stringify(versionData),
            });
        },

        /**
         * 버전 수정 (관리자)
         */
        async update(versionId, versionData) {
            return API.request(`/versions/${versionId}`, {
                method: 'PUT',
                body: JSON.stringify(versionData),
            });
        },

        /**
         * 버전 삭제 (관리자)
         */
        async delete(versionId) {
            return API.request(`/versions/${versionId}`, {
                method: 'DELETE',
            });
        },

        /**
         * 업데이트 항목 추가 (관리자)
         */
        async addItem(versionId, itemData) {
            return API.request(`/versions/${versionId}/items`, {
                method: 'POST',
                body: JSON.stringify(itemData),
            });
        },

        /**
         * 업데이트 항목 수정 (관리자)
         */
        async updateItem(versionId, itemId, itemData) {
            return API.request(`/versions/${versionId}/items?item_id=${itemId}`, {
                method: 'PUT',
                body: JSON.stringify(itemData),
            });
        },

        /**
         * 업데이트 항목 삭제 (관리자)
         */
        async deleteItem(versionId, itemId) {
            return API.request(`/versions/${versionId}/items?item_id=${itemId}`, {
                method: 'DELETE',
            });
        },
    },

    /**
     * 캘린더 관련 API
     */
    calendar: {
        /**
         * 월별 일정 조회
         *
         * @param {number} year - 연도
         * @param {number} month - 월
         * @returns {Promise}
         */
        async getMonthEvents(year, month) {
            return API.request(`/calendar?year=${year}&month=${month}`);
        },

        /**
         * 개인 일정 추가
         *
         * @param {object} eventData - 일정 데이터
         * @returns {Promise}
         */
        async createEvent(eventData) {
            return API.request('/calendar/events', {
                method: 'POST',
                body: JSON.stringify(eventData),
            });
        },
    },

    /**
     * 사용자 관련 API
     */
    user: {
        /**
         * 로그인
         *
         * @param {string} username - 사용자명
         * @param {string} password - 비밀번호
         * @returns {Promise}
         */
        async login(username, password) {
            const response = await API.request('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ username, password }),
            });

            // 토큰 저장
            if (response.success && response.data.token) {
                localStorage.setItem('authToken', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }

            return response;
        },

        /**
         * 회원가입
         *
         * @param {object} userData - 사용자 정보
         * @returns {Promise}
         */
        async register(userData) {
            const response = await API.request('/auth/register', {
                method: 'POST',
                body: JSON.stringify(userData),
            });

            // 토큰 저장
            if (response.success && response.data.token) {
                localStorage.setItem('authToken', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }

            return response;
        },

        /**
         * 현재 사용자 정보
         */
        async getCurrentUser() {
            return API.request('/auth/me');
        },

        /**
         * 로그아웃
         */
        async logout() {
            try {
                await API.request('/auth/logout', { method: 'POST' });
            } finally {
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
                window.location.href = 'login.html';
            }
        },

        /**
         * 즐겨찾기 게임 조회
         *
         * @returns {Promise}
         */
        async getFavorites() {
            return API.request('/user/favorites');
        },

        /**
         * 즐겨찾기 추가
         *
         * @param {number} gameId - 게임 ID
         * @returns {Promise}
         */
        async addFavorite(gameId) {
            return API.request('/user/favorites', {
                method: 'POST',
                body: JSON.stringify({ game_id: gameId }),
            });
        },

        /**
         * 즐겨찾기 제거
         *
         * @param {number} gameId - 게임 ID
         * @returns {Promise}
         */
        async removeFavorite(gameId) {
            return API.request(`/user/favorites/${gameId}`, {
                method: 'DELETE',
            });
        },
    },
};

// 전역에서 사용 가능하도록 export
window.API = API;
