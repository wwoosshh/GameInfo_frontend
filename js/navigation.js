/**
 * 공통 네비게이션 관리
 * 모든 페이지에서 일관된 네비게이션을 제공합니다.
 */

// 현재 페이지 경로 가져오기
function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';
    return page;
}

// 네비게이션 상태 업데이트
function updateNavigation() {
    const token = localStorage.getItem('authToken');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const navLogin = document.getElementById('nav-login');
    const navLogout = document.getElementById('nav-logout');
    const navCommunity = document.getElementById('nav-community');
    const navProfile = document.getElementById('nav-profile');
    const navAdmin = document.getElementById('nav-admin');
    const navUser = document.getElementById('nav-user');

    // 요소가 없으면 종료 (로그인 페이지 등)
    if (!navLogin) return;

    if (token) {
        // 로그인 상태
        if (navLogin) navLogin.style.display = 'none';
        if (navLogout) navLogout.style.display = 'block';
        if (navCommunity) navCommunity.style.display = 'block';
        if (navProfile) navProfile.style.display = 'block';

        // 관리자인 경우 관리자 메뉴 표시
        if (navAdmin) {
            navAdmin.style.display = user.is_admin ? 'block' : 'none';
        }

        // 사용자 정보 표시 (선택적)
        if (navUser) {
            navUser.style.display = 'block';
            const userSpan = navUser.querySelector('span');
            if (userSpan) {
                userSpan.textContent = user.display_name || user.username;
            }
        }
    } else {
        // 로그아웃 상태
        if (navLogin) navLogin.style.display = 'block';
        if (navLogout) navLogout.style.display = 'none';
        if (navCommunity) navCommunity.style.display = 'none';
        if (navProfile) navProfile.style.display = 'none';
        if (navAdmin) navAdmin.style.display = 'none';
        if (navUser) navUser.style.display = 'none';
    }

    // 현재 페이지 활성화 표시
    setActiveNavItem();
}

// 현재 페이지 활성화
function setActiveNavItem() {
    const currentPage = getCurrentPage();
    const navLinks = document.querySelectorAll('.main-nav a');

    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');

        if (href === currentPage ||
            (currentPage === 'index.html' && href === 'index.html') ||
            (currentPage.startsWith('game') && href === 'games.html') ||
            (currentPage.startsWith('version') && href === 'games.html') ||
            (currentPage.startsWith('community') && href === 'community.html') ||
            (currentPage === 'profile.html' && href === 'profile.html') ||
            (currentPage.startsWith('admin') && href === 'admin.html')) {
            link.classList.add('active');
        }
    });
}

// 로그아웃 처리
async function handleLogout(event) {
    if (event) event.preventDefault();

    if (confirm('로그아웃하시겠습니까?')) {
        try {
            await API.user.logout();
        } catch (error) {
            console.error('Logout error:', error);
            // 에러가 발생해도 로컬 스토리지는 삭제
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            window.location.href = 'index.html';
        }
    }
}

// 로그인 필요 확인
function requireLogin(redirectUrl = null) {
    const token = localStorage.getItem('authToken');
    if (!token) {
        const returnUrl = redirectUrl || window.location.href;
        localStorage.setItem('returnUrl', returnUrl);
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// 관리자 권한 확인
function isAdmin() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.is_admin === true;
}

// DOM 로드 후 네비게이션 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateNavigation);
} else {
    updateNavigation();
}

// 전역으로 export
window.updateNavigation = updateNavigation;
window.handleLogout = handleLogout;
window.requireLogin = requireLogin;
window.isAdmin = isAdmin;
