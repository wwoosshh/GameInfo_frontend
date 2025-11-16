/**
 * 메인 애플리케이션 로직
 */

document.addEventListener('DOMContentLoaded', function() {
    // 현재 페이지 확인
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // 페이지별 초기화
    switch (currentPage) {
        case 'index.html':
        case '':
            initHomePage();
            break;
        case 'games.html':
            initGamesPage();
            break;
        case 'calendar.html':
            initCalendarPage();
            break;
        case 'login.html':
            initLoginPage();
            break;
    }

    // 네비게이션 활성화 상태 업데이트
    updateNavigation(currentPage);
});

/**
 * 홈페이지 초기화
 */
function initHomePage() {
    loadUpcomingUpdates();
    loadPopularGames();
}

/**
 * 다가오는 업데이트 로드 (버전 기반)
 */
async function loadUpcomingUpdates() {
    const updatesContainer = document.getElementById('updates-list');

    try {
        // N+1 쿼리 방지: with_versions=true로 한 번에 게임과 최신 버전 정보를 가져옴
        const gamesResponse = await API.games.getAll({ limit: 10, with_versions: 'true' });

        if (!gamesResponse || !gamesResponse.data || !gamesResponse.data.games) {
            updatesContainer.innerHTML = '<div class="empty-state"><h3>업데이트 정보가 없습니다.</h3></div>';
            return;
        }

        const updates = [];

        // 이미 버전 정보가 포함되어 있으므로 추가 API 호출 불필요
        for (const game of gamesResponse.data.games) {
            // 버전 정보가 있는 경우에만 처리
            if (game.version_id) {
                updates.push({
                    version_id: game.version_id,
                    game_id: game.game_id,
                    game_name: game.game_name,
                    update_title: `버전 ${game.version_number}: ${game.version_name || ''}`,
                    update_type: game.is_current == 1 ? 'current' : 'upcoming',
                    scheduled_date: game.release_date,
                    new_characters: game.new_characters || 0,
                    new_events: game.new_events || 0
                });
            }
        }

        displayUpdates(updates, updatesContainer);
    } catch (error) {
        console.error('Failed to load updates:', error);
        updatesContainer.innerHTML = '<div class="error-message">업데이트 정보를 불러오는데 실패했습니다.</div>';
    }
}

/**
 * 인기 게임 로드
 */
async function loadPopularGames() {
    const gamesContainer = document.getElementById('games-list');

    try {
        // 실제 API 호출
        const response = await API.games.getAll({ limit: 20 });

        if (response && response.data && response.data.games) {
            displayGames(response.data.games, gamesContainer);
        } else {
            gamesContainer.innerHTML = '<div class="empty-state"><h3>등록된 게임이 없습니다.</h3></div>';
        }
    } catch (error) {
        console.error('Failed to load games:', error);
        gamesContainer.innerHTML = '<div class="error-message">게임 정보를 불러오는데 실패했습니다.</div>';
    }
}

/**
 * 업데이트 표시
 */
function displayUpdates(updates, container) {
    if (!updates || updates.length === 0) {
        container.innerHTML = '<div class="empty-state"><h3>예정된 업데이트가 없습니다.</h3></div>';
        return;
    }

    const html = updates.map(update => `
        <div class="update-card" onclick="goToVersionDetail(${update.version_id})" style="cursor: pointer;">
            <div class="update-header">
                <div class="game-name">${escapeHtml(update.game_name)}</div>
                <h4 class="update-title">${escapeHtml(update.update_title)}</h4>
            </div>
            <div class="update-meta">
                <span class="update-date">📅 ${formatDate(update.scheduled_date)}</span>
                <span class="update-type">${getUpdateTypeLabel(update.update_type)}</span>
            </div>
            ${update.new_characters || update.new_events ? `
                <div class="update-stats" style="margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid #ecf0f1; display: flex; gap: 1rem; font-size: 0.9rem; color: #7f8c8d;">
                    ${update.new_characters ? `<span>🆕 ${update.new_characters}개 신규 캐릭터</span>` : ''}
                    ${update.new_events ? `<span>🎉 ${update.new_events}개 이벤트</span>` : ''}
                </div>
            ` : ''}
        </div>
    `).join('');

    container.innerHTML = html;
}

/**
 * 버전 상세 페이지로 이동
 */
function goToVersionDetail(versionId) {
    window.location.href = `version_detail.html?version_id=${versionId}`;
}

/**
 * 게임 표시
 */
function displayGames(games, container) {
    if (!games || games.length === 0) {
        container.innerHTML = '<div class="empty-state"><h3>등록된 게임이 없습니다.</h3></div>';
        return;
    }

    const html = games.map(game => `
        <div class="game-card" onclick="goToGameVersions(${game.game_id})" style="cursor: pointer;">
            <div class="game-thumbnail">
                ${game.thumbnail_url
                    ? `<img src="${escapeHtml(game.thumbnail_url)}" alt="${escapeHtml(game.game_name)}">`
                    : game.game_name.substring(0, 2)
                }
            </div>
            <div class="game-info">
                <h4 class="game-name-display">${escapeHtml(game.game_name)}</h4>
                <span class="game-platform">${escapeHtml(game.platform)}</span>
            </div>
        </div>
    `).join('');

    container.innerHTML = html;
}

/**
 * 게임 목록 페이지 초기화
 */
function initGamesPage() {
    console.log('Games page initialized');
    // 게임 목록 페이지 로직 구현
}

/**
 * 캘린더 페이지 초기화
 */
function initCalendarPage() {
    console.log('Calendar page initialized');
    // 캘린더 페이지 로직 구현
}

/**
 * 로그인 페이지 초기화
 */
function initLoginPage() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}

/**
 * 로그인 처리
 */
async function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await API.user.login(username, password);

        if (response.success) {
            alert('로그인 성공!');
            window.location.href = 'index.html';
        }
    } catch (error) {
        alert('로그인 실패: ' + error.message);
    }
}

/**
 * 네비게이션 활성화 상태 업데이트
 */
function updateNavigation(currentPage) {
    const navLinks = document.querySelectorAll('.main-nav a');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * 날짜 포맷팅
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
}

/**
 * 업데이트 타입 레이블
 */
function getUpdateTypeLabel(type) {
    const labels = {
        'major': '메이저 업데이트',
        'minor': '마이너 업데이트',
        'hotfix': '핫픽스',
        'maintenance': '점검',
        'event': '이벤트',
        'current': '현재 버전',
        'upcoming': '다가오는 버전'
    };
    return labels[type] || type;
}

/**
 * HTML 이스케이프 (XSS 방지)
 */
function escapeHtml(text) {
    if (!text) return '';

    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };

    return text.toString().replace(/[&<>"']/g, m => map[m]);
}

/**
 * 로그인 상태 확인
 */
function isLoggedIn() {
    return !!localStorage.getItem('authToken');
}

/**
 * 현재 사용자 정보 가져오기
 */
function getCurrentUser() {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
}

/**
 * 게임의 버전 페이지로 이동
 */
function goToGameVersions(gameId) {
    window.location.href = `game_versions.html?game_id=${gameId}`;
}
