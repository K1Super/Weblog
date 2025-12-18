// 登录安全配置
const AUTH_CONFIG = Object.freeze({
    // 加密密钥 (定期更换)
    secretKey: 'kL0rd#2024@S3cur3',
    
    // 安全策略
    security: {
        maxAttempts: 5,                    // 最大尝试次数
        lockoutDuration: 30 * 60 * 1000,   // 锁定时间 (30分钟)
        sessionTimeout: 24 * 60 * 60 * 1000,// 会话超时时间 (24小时)
        tokenLength: 64,                    // 令牌长度
        passwordMinLength: 8,               // 密码最小长度
        requireSpecialChar: true,           // 要求特殊字符
        requireNumbers: true                // 要求数字
    }
}); 