// 登录尝试记录
let loginAttempts = {
    count: 0,
    lastAttempt: 0,
    locked: false
};

// 生成安全令牌
function generateToken() {
    const timestamp = new Date().getTime().toString();
    const random = Math.random().toString();
    return CryptoJS.SHA256(timestamp + random + AUTH_CONFIG.secretKey).toString();
}

// 加密密码
function encryptPassword(password, salt = AUTH_CONFIG.secretKey) {
    return CryptoJS.SHA256(password + salt).toString();
}

// 验证密码强度
function validatePassword(password) {
    if (password.length < AUTH_CONFIG.security.passwordMinLength) {
        return '密码长度不足';
    }
    if (AUTH_CONFIG.security.requireSpecialChar && !/[!@#$%^&*]/.test(password)) {
        return '密码需要包含特殊字符';
    }
    if (AUTH_CONFIG.security.requireNumbers && !/\d/.test(password)) {
        return '密码需要包含数字';
    }
    return true;
}

// 处理登录
async function handleLogin(event) {
    event.preventDefault();

    // 检查锁定状态
    if (loginAttempts.locked) {
        const timeLeft = AUTH_CONFIG.security.lockoutDuration - (Date.now() - loginAttempts.lastAttempt);
        if (timeLeft > 0) {
            showError(`账户已锁定，请在 ${Math.ceil(timeLeft / 60000)} 分钟后重试`);
            return;
        }
        loginAttempts = { count: 0, lastAttempt: 0, locked: false };
    }

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // 检查用户名和密码是否为空
    if (!username.trim()) {
        showError('请输入用户名');
        return;
    }
    if (!password.trim()) {
        showError('请输入密码');
        return;
    }

    try {
        // 验证用户名
        if (!username || username !== CONFIG.login.username) {
            loginAttempts.count++;
            showError('用户名或密码错误');
            return;
        }

        // 对用户输入的密码进行加密，与存储的哈希值比较
        const hashedPassword = encryptPassword(password);

        if (hashedPassword === CONFIG.login.password) {
            // 登录成功 - 清除错误提示
            clearError();
            const token = generateToken();
            sessionStorage.setItem('loginStatus', 'true');
            sessionStorage.setItem('token', token);
            sessionStorage.setItem('loginTime', Date.now().toString());

            // 显示加载动画
            const loginLoading = document.getElementById('loginLoading');
            loginLoading.style.display = 'flex';

            // 2秒后隐藏加载动画并进入主页
            setTimeout(() => {
                loginLoading.style.display = 'none';
                checkLoginStatus();
            }, 2000);
        } else {
            // 登录失败
            loginAttempts.count++;
            loginAttempts.lastAttempt = Date.now();

            if (loginAttempts.count >= AUTH_CONFIG.security.maxAttempts) {
                loginAttempts.locked = true;
                showError('登录失败次数过多，账户已锁定');
            } else {
                showError('用户名或密码错误');
            }
        }
    } catch (error) {
        console.error('Login error:', error);
        showError('登录时发生错误，请稍后重试');
    }
}

// 显示错误信息
function showError(message) {
    // 移除现有的错误消息
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // 创建新的错误消息
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = '#dc3545';
    errorDiv.style.fontSize = '0.9rem';
    errorDiv.style.textAlign = 'center';
    errorDiv.style.marginBottom = '10px';
    errorDiv.style.fontWeight = '500';
    errorDiv.style.animation = 'fadeInError 0.3s ease-out';

    // 将错误消息插入到登录框内
    const loginBox = document.querySelector('.login-box');
    const form = document.getElementById('loginForm');
    loginBox.insertBefore(errorDiv, form);
}

// 清除错误信息
function clearError() {
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
}

// 定期检查会话状态
function checkSession() {
    const loginTime = parseInt(sessionStorage.getItem('loginTime'));
    if (loginTime && (Date.now() - loginTime > AUTH_CONFIG.security.sessionTimeout)) {
        sessionStorage.clear();
        checkLoginStatus(); // 更改为调用checkLoginStatus而不是重定向
    }
}

// 定期检查会话
setInterval(checkSession, 60000);

// 添加回车键登录功能
function addEnterKeyLogin() {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    if (usernameInput && passwordInput) {
        const handleEnterKey = (event) => {
            if (event.key === 'Enter') {
                handleLogin(event);
            }
        };

        usernameInput.addEventListener('keydown', handleEnterKey);
        passwordInput.addEventListener('keydown', handleEnterKey);
    }
}

// 初始化登录功能
function initLoginFeatures() {
    addEnterKeyLogin();
}

function validateLogin(username, password) {
    return username === CONFIG.login.username &&
           password === CONFIG.login.password;
}
