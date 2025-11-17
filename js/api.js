/**
 * API 통신 모듈
 *
 * 백엔드 API와의 통신을 담당합니다.
 */

// 캐시 유틸리티
const Cache = {
    /**
     * 캐시에서 데이터 가져오기
     * @param {string} key - 캐시 키
     * @param {number} maxAge - 최대 유효 시간 (밀리초)
     * @returns {any|null} 캐시된 데이터 또는 null
     */
    get(key, maxAge = 5 * 60 * 1000) { // 기본 5분
        try {
            const cached = localStorage.getItem(key);
            if (!cached) return null;

            const { data, timestamp } = JSON.parse(cached);
            const age = Date.now() - timestamp;

            if (age > maxAge) {
                localStorage.removeItem(key);
                return null;
            }

            return data;
        } catch (error) {
            console.error('Cache get error:', error);
            return null;
        }
    },

    /**
     * 캐시에 데이터 저장
     * @param {string} key - 캐시 키
     * @param {any} data - 저장할 데이터
     */
    set(key, data) {
        try {
            const cacheData = {
                data,
                timestamp: Date.now()
            };
            localStorage.setItem(key, JSON.stringify(cacheData));
        } catch (error) {
            console.error('Cache set error:', error);
        }
    },

    /**
     * 캐시 삭제
     * @param {string} key - 캐시 키
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Cache remove error:', error);
        }
    },

    /**
     * 패턴과 일치하는 모든 캐시 삭제
     * @param {string} pattern - 삭제할 키 패턴
     */
    removeByPattern(pattern) {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.includes(pattern)) {
                    localStorage.removeItem(key);
                }
            });
        } catch (error) {
            console.error('Cache removeByPattern error:', error);
        }
    }
};

const API = {
    baseURL: window.location.hostname === 'localhost'
        ? 'http://localhost:8080/api'
        : 'https://gameinfobackend-production.up.railway.app/api',

    /**
     * 공통 헤더 생성
     *
     * @returns {object} HTTP 헤더
     */
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json',
        };

        const token = localStorage.getItem('authToken');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    },

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
                console.error('API Error Response:', data);
                throw new Error(data.error?.message || data.message || 'API request failed');
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
         * 게임 목록 조회 (캐싱 적용)
         *
         * @param {object} params - 쿼리 파라미터
         * @param {boolean} useCache - 캐시 사용 여부 (기본값: true)
         * @returns {Promise}
         */
        async getAll(params = {}, useCache = true) {
            const cacheKey = `games_${JSON.stringify(params)}`;

            // 캐시 확인
            if (useCache) {
                const cached = Cache.get(cacheKey);
                if (cached) {
                    console.log('Using cached games data');
                    return cached;
                }
            }

            const queryString = new URLSearchParams(params).toString();
            const endpoint = `/games${queryString ? '?' + queryString : ''}`;
            const response = await API.request(endpoint);

            // 응답 캐싱
            if (response.success) {
                Cache.set(cacheKey, response);
            }

            return response;
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
            const response = await API.request('/games', {
                method: 'POST',
                body: JSON.stringify(gameData),
            });
            // 게임 목록 캐시 무효화
            Cache.removeByPattern('games_');
            return response;
        },

        /**
         * 게임 수정
         *
         * @param {number} gameId - 게임 ID
         * @param {object} gameData - 게임 데이터
         * @returns {Promise}
         */
        async update(gameId, gameData) {
            const response = await API.request(`/games/${gameId}`, {
                method: 'PUT',
                body: JSON.stringify(gameData),
            });
            // 게임 목록 캐시 무효화
            Cache.removeByPattern('games_');
            return response;
        },

        /**
         * 게임 삭제
         *
         * @param {number} gameId - 게임 ID
         * @returns {Promise}
         */
        async delete(gameId) {
            const response = await API.request(`/games/${gameId}`, {
                method: 'DELETE',
            });
            // 게임 목록 캐시 무효화
            Cache.removeByPattern('games_');
            return response;
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
     * 사용자 캘린더 일정 관련 API
     */
    calendarEvents: {
        /**
         * 사용자 일정 목록 조회
         *
         * @param {object} params - 쿼리 파라미터 (start_date, end_date)
         * @returns {Promise}
         */
        async getAll(params = {}) {
            const queryString = new URLSearchParams(params).toString();
            const endpoint = `/calendar-events${queryString ? '?' + queryString : ''}`;
            return API.request(endpoint);
        },

        /**
         * 특정 일정 조회
         *
         * @param {number} eventId - 일정 ID
         * @returns {Promise}
         */
        async getById(eventId) {
            return API.request(`/calendar-events/${eventId}`);
        },

        /**
         * 일정 생성
         *
         * @param {object} eventData - 일정 데이터
         * @returns {Promise}
         */
        async create(eventData) {
            return API.request('/calendar-events', {
                method: 'POST',
                body: JSON.stringify(eventData),
            });
        },

        /**
         * 일정 수정
         *
         * @param {number} eventId - 일정 ID
         * @param {object} eventData - 일정 데이터
         * @returns {Promise}
         */
        async update(eventId, eventData) {
            return API.request(`/calendar-events/${eventId}`, {
                method: 'PUT',
                body: JSON.stringify(eventData),
            });
        },

        /**
         * 일정 삭제
         *
         * @param {number} eventId - 일정 ID
         * @returns {Promise}
         */
        async delete(eventId) {
            return API.request(`/calendar-events/${eventId}`, {
                method: 'DELETE',
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

    /**
     * 관리자 API
     */
    admin: {
        /**
         * 유저 관리
         */
        users: {
            async getAll(params = {}) {
                const queryString = new URLSearchParams(params).toString();
                const endpoint = `/admin/users${queryString ? '?' + queryString : ''}`;
                return API.request(endpoint);
            },

            async getById(userId) {
                return API.request(`/admin/users/${userId}`);
            },

            async update(userId, data) {
                return API.request(`/admin/users/${userId}`, {
                    method: 'PUT',
                    body: JSON.stringify(data),
                });
            },

            async delete(userId) {
                return API.request(`/admin/users/${userId}`, {
                    method: 'DELETE',
                });
            },
        },

        /**
         * 게시글 관리
         */
        posts: {
            async getAll(params = {}) {
                const queryString = new URLSearchParams(params).toString();
                const endpoint = `/admin/posts${queryString ? '?' + queryString : ''}`;
                return API.request(endpoint);
            },

            async getById(postId) {
                return API.request(`/admin/posts/${postId}`);
            },

            async update(postId, data) {
                return API.request(`/admin/posts/${postId}`, {
                    method: 'PUT',
                    body: JSON.stringify(data),
                });
            },

            async delete(postId) {
                return API.request(`/admin/posts/${postId}`, {
                    method: 'DELETE',
                });
            },
        },

        /**
         * 댓글 관리
         */
        comments: {
            async getAll(params = {}) {
                const queryString = new URLSearchParams(params).toString();
                const endpoint = `/admin/comments${queryString ? '?' + queryString : ''}`;
                return API.request(endpoint);
            },

            async getById(commentId) {
                return API.request(`/admin/comments/${commentId}`);
            },

            async delete(commentId) {
                return API.request(`/admin/comments/${commentId}`, {
                    method: 'DELETE',
                });
            },
        },

        /**
         * 신고 관리
         */
        reports: {
            async getAll(params = {}) {
                const queryString = new URLSearchParams(params).toString();
                const endpoint = `/admin/reports${queryString ? '?' + queryString : ''}`;
                return API.request(endpoint);
            },

            async getById(reportId) {
                return API.request(`/admin/reports/${reportId}`);
            },

            async update(reportId, data) {
                return API.request(`/admin/reports/${reportId}`, {
                    method: 'PUT',
                    body: JSON.stringify(data),
                });
            },

            async delete(reportId) {
                return API.request(`/admin/reports/${reportId}`, {
                    method: 'DELETE',
                });
            },
        },
    },
};

// 전역에서 사용 가능하도록 export
window.API = API;
window.Cache = Cache;

// API 버전 확인 (디버깅용)
console.log('API loaded with calendarEvents:', typeof API.calendarEvents !== 'undefined');
console.log('API loaded with admin:', typeof API.admin !== 'undefined');
