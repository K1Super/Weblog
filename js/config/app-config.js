// 冻结配置对象防止运行时修改
const CONFIG = Object.freeze({
    // 导航栏配置
    nav: {
        profile: {
            avatar: 'https://via.placeholder.com/200x200/4A90E2/FFFFFF?text=KLord',
            name: 'KLord',
            description: '热爱生活，记录美好'
        },
        links: [
            { id: 'home', icon: 'fas fa-home', text: '首页' },
            { id: 'projects', icon: 'fas fa-folder', text: '项目集' },
            { id: 'resources', icon: 'fas fa-database', text: '资源库' },
            { id: 'about', icon: 'fas fa-user', text: '关于我' }
        ]
    },
    
    // 个人资料及导航配置
    profile: {
        avatar: 'https://via.placeholder.com/200x200/4A90E2/FFFFFF?text=KLord',
        name: 'KLord',
        title: '热爱生活，记录美好'
    },
    
    // 导航配置 - 保持与nav.links一致
    navigation: [
        { id: 'home', label: '首页', icon: 'fas fa-home' },
        { id: 'projects', label: '项目集', icon: 'fas fa-folder' },
        { id: 'resources', label: '资源库', icon: 'fas fa-database' },
        { id: 'about', label: '关于我', icon: 'fas fa-user' }
    ],
    
    // 登录凭证
    login: {
        username: 'KLord',
        password: '20041002'
    },

    // GitHub配置用于内容持久化
    github: {
        // GitHub Personal Access Token (需要gist权限)
        // 注意：不要在代码中硬编码token！请使用环境变量或在运行时设置
        token: process.env.GITHUB_TOKEN,
        // Gist ID 用于存储关于我页面的内容
        gistId: process.env.GIST_ID,
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
