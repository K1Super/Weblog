// 检查登录状态
function checkAuth() {
    const loginStatus = sessionStorage.getItem('loginStatus');
    if (loginStatus !== 'true') {
        // 未登录，显示登录界面（已在index.html中）
        return false;
    }
    return true;
}

// 退出登录
function logout() {
    sessionStorage.clear();
    // 刷新页面显示登录界面
    window.location.reload();
}

// 防止直接访问
if (window.location.pathname.endsWith('index.html')) {
    checkAuth();
}
