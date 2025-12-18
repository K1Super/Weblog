// 检查登录状态
function checkAuth() {
    const loginStatus = sessionStorage.getItem('loginStatus');
    if (loginStatus !== 'true') {
        // 未登录，跳转到登录页
        window.location.replace('login.html');
        return false;
    }
    return true;
}

// 退出登录
function logout() {
    sessionStorage.clear();
    window.location.replace('login.html');
}

// 防止直接访问
if (window.location.pathname.endsWith('index.html')) {
    checkAuth();
} 