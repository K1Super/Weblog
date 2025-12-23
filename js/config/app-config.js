// 冻结配置对象防止运行时修改
const CONFIG = Object.freeze({
    // 导航栏配置
    nav: {
        profile: {
            avatar: 'https://picsum.photos/100/100?random=4',
            name: 'KLord',
            description: '半溪明月，一枕清风'
        },
        links: [
            { id: 'home', icon: 'fas fa-home', text: 'Home' },
            { id: 'projects', icon: 'fas fa-folder', text: 'Projects' },
            { id: 'resources', icon: 'fas fa-database', text: 'Resources' },
            { id: 'about', icon: 'fas fa-user', text: 'About' }
        ]
    },
    
    // 个人资料及导航配置
    profile: {
        avatar: (typeof window !== 'undefined' && window.DEFAULT_AVATAR) || 'https://picsum.photos/200/200?random=3',
        name: 'KLord',
        title: '半溪明月，一枕清风'
    },
    
    // 导航配置 - 保持与nav.links一致
    navigation: [
        { id: 'home', label: 'Home', icon: 'fas fa-home' },
        { id: 'projects', label: 'Projects', icon: 'fas fa-folder' },
        { id: 'resources', label: 'Resources', icon: 'fas fa-database' },
        { id: 'about', label: 'About', icon: 'fas fa-user' }
    ],
    
    // 登录凭证 (密码已加密存储)
    login: {
        username: 'KLord',
        password: 'ab2f193ad3e0fcc5632f7e5234e05695d6022ca7793382f2e1b5198a673208fe' // SHA256(20041002 + salt)
    },

    // GitHub配置用于内容持久化
    github: {
        // GitHub Personal Access Token (需要gist权限)
        // 注意：浏览器环境中无法直接访问环境变量，请在运行时设置
        token: (typeof window !== 'undefined' && window.GITHUB_TOKEN) || null,
        // Gist ID 用于存储关于我页面的内容
        gistId: (typeof window !== 'undefined' && window.GIST_ID) || null,
        // Gist文件名
        filename: 'about-content.json'
    }

});

// 添加配置验证
function validateConfig() {
    const required = ['login', 'nav'];
    required.forEach(key => {
        if (!CONFIG[key]) {
            throw new Error(`Missing required config: ${key}`);
        }
    });
}

// 在使用配置前验证
try {
    validateConfig();
} catch (error) {
    console.error('Configuration error:', error);
}
