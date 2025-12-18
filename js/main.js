// 渲染关于我
function renderAbout() {
    // 设置个人资料信息
    const profileInfo = document.querySelector('.about-content .profile-info');
    if (profileInfo && CONFIG.about) {
        profileInfo.innerHTML = `
            <h2>${CONFIG.about.name}</h2>
            <p class="subtitle">${CONFIG.about.title}</p>
            <p class="bio">${CONFIG.about.bio}</p>
        `;
    }

    // 设置兴趣爱好
    const hobbyList = document.querySelector('.hobby-list');
    if (hobbyList && CONFIG.about && CONFIG.about.hobbies) {
        hobbyList.innerHTML = '';
        CONFIG.about.hobbies.forEach(hobby => {
            const li = document.createElement('li');
            li.innerHTML = `<span class="hobby-icon">${hobby.icon}</span> ${hobby.name}`;
            hobbyList.appendChild(li);
        });
    }

    // 设置最爱的句子
    const favoriteQuotes = document.querySelector('.favorite-quotes');
    if (favoriteQuotes && CONFIG.about && CONFIG.about.quotes) {
        favoriteQuotes.innerHTML = '';
        CONFIG.about.quotes.forEach(quote => {
            const quoteDiv = document.createElement('div');
            quoteDiv.className = 'quote';
            quoteDiv.innerHTML = `
                <p>${quote.text}</p>
                <cite>—— ${quote.author}</cite>
            `;
            favoriteQuotes.appendChild(quoteDiv);
        });
    }

    // 设置联系方式
    const contactInfo = document.querySelector('.contact-info');
    if (contactInfo && CONFIG.about && CONFIG.about.contact) {
        contactInfo.innerHTML = '';
        Object.entries(CONFIG.about.contact).forEach(([key, value]) => {
            let icon = '';
            switch (key) {
                case 'email': icon = 'fas fa-envelope'; break;
                case 'phone': icon = 'fas fa-phone'; break;
                case 'github': icon = 'fab fa-github'; break;
                case 'wechat': icon = 'fab fa-weixin'; break;
                default: icon = 'fas fa-link';
            }

            const contactDiv = document.createElement('div');
            contactDiv.className = 'contact-item';
            contactDiv.innerHTML = `
                <i class="${icon}"></i>
                <span>${value}</span>
            `;
            contactInfo.appendChild(contactDiv);
        });
    }
}

// 添加错误处理函数
function handleRenderError(section, error) {
    console.error(`Error rendering ${section}:`, error);
    return `<div class="error-message">加载失败，请刷新页面重试</div>`;
}

// 文字动画效果
function createTextAnimation(text, container) {
    // 清空容器
    container.innerHTML = '';
    container.style.opacity = '1';
    
    // 设置容器样式
    container.style.cssText = `
        font-size: 3.2rem;  // 增大字体
        font-weight: 600;   // 加粗字体
        background: linear-gradient(45deg, 
            #1565C0,    // 深蓝色
            #1976D2,    // 蓝色
            #2E7D32,    // 深绿色
            #F57F17     // 深金色
        );
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        background-size: 200% 200%;
        text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.3);
        position: relative;
    `;
    
    // 分割文字
    const chars = text.split('');
    let delay = 0;
    
    chars.forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.cssText = `
            display: inline-block;
            opacity: 0;
            transform: translateY(20px) scale(0.8);
            transition: all 0.3s ease;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
        `;
        
        container.appendChild(span);
        
        // 添加动画
        setTimeout(() => {
            span.style.opacity = '1';
            span.style.transform = 'translateY(0) scale(1)';
            
            // 添加弹跳效果
            setTimeout(() => {
                span.style.transform = 'translateY(-10px) scale(1.1)';
                setTimeout(() => {
                    span.style.transform = 'translateY(0) scale(1)';
                }, 100);
            }, 200);
        }, delay);
        
        delay += 100;
    });
    
    // 添加背景动画
    setTimeout(() => {
        container.style.animation = 'gradientMove 6s ease infinite';
    }, delay);

    // 添加光晕效果
    const style = document.createElement('style');
    style.textContent = `
        @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        
        .welcome-title::after {
            content: '';
            position: absolute;
            top: -10px;
            left: -10px;
            right: -10px;
            bottom: -10px;
            background: linear-gradient(45deg, 
                rgba(21, 101, 192, 0.3),    // 深蓝色
                rgba(46, 125, 50, 0.3)      // 深绿色
            );
            filter: blur(20px);
            z-index: -1;
            opacity: 0;
            animation: glowEffect 3s ease-in-out infinite alternate;
        }
        
        @keyframes glowEffect {
            from {
                opacity: 0.4;
                transform: scale(0.95);
            }
            to {
                opacity: 0.7;
                transform: scale(1.05);
            }
        }
    `;
    document.head.appendChild(style);
}

// 修改渲染函数 - 简化版，不依赖不存在的配置
function renderHome() {
    try {
        // 检查必要的DOM元素是否存在
        const introTitle = document.querySelector('.intro-title');
        if (!introTitle) {
            console.log('Intro title element not found, skipping home rendering');
            return;
        }

        // 首页渲染完成，这里可以添加一些简单的动画或效果
        console.log('Home section rendered successfully');

        // 可以在这里添加一些简单的动画效果
        // 例如音频条动画
        if (typeof animateAudioBars === 'function') {
            animateAudioBars();
        }

    } catch (error) {
        handleRenderError('home', error);
    }
}

// 渲染导航栏
function renderNav() {
    console.log('renderNav called, CONFIG:', typeof CONFIG, CONFIG);
    if (!CONFIG || !CONFIG.nav) {
        console.error('CONFIG.nav is not available');
        return;
    }

    // 渲染个人资料部分
    const profileSection = document.querySelector('.profile-section');
    if (profileSection) {
        profileSection.innerHTML = `
            <img src="${CONFIG.nav.profile.avatar}" alt="头像" class="avatar" onerror="handleImageError(this)">
            <h2>${CONFIG.nav.profile.name}</h2>
            <p>${CONFIG.nav.profile.description}</p>
        `;
    }

    // 渲染导航链接
    const navLinks = document.querySelector('.nav-links');
    if (navLinks && CONFIG.nav.links) {
        navLinks.innerHTML = CONFIG.nav.links.map(link => `
            <li>
                <a href="#${link.id}" data-section="${link.id}">
                    <i class="${link.icon}"></i>
                    <span>${link.text}</span>
                </a>
            </li>
        `).join('');
    }
}

// 优化初始化函数
function initContent() {
    try {
        renderNav();
        renderHome();
        // 注释掉renderAbout()调用，保持HTML静态内容
        // renderAbout();

        const cards = document.querySelectorAll('.feature-card');
        cards.forEach((card, index) => {
            requestAnimationFrame(() => {
                card.style.animationDelay = `${index * 0.2}s`;
                card.classList.add('fade-in');
            });
        });
    } catch (error) {
        console.error('Initialization error:', error);
    }
}

// 在页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 首先检查登录状态
    checkAuth();
    
    // 后渲染所有内容
    initContent();
    
    // 最后初始化导航和动画
    initNav();
    initHomeAnimations();
});

// 初始化主页函数
function initMainPage() {
    console.log('初始化主页...');
    
    // 初始化导航
    initializeNavigation();
    
    // 初始化其他主页功能
    initializeMainContent();
    
    // 初始化粒子游戏 - 将此移至最后，确保DOM元素已经渲染
    setTimeout(() => {
        if (typeof initParticleGame === 'function') {
            // 确保canvas可见后再初始化
            const particleCanvas = document.getElementById('particleCanvas');
            if (particleCanvas && particleCanvas.offsetParent !== null) {
                console.log('Canvas已可见，初始化粒子游戏');
                initParticleGame();
            } else {
                console.log('Canvas不可见，延迟初始化粒子游戏');
                // 再次延迟尝试初始化
                setTimeout(initParticleGame, 500);
            }
        }
    }, 100);
}

// 初始化导航栏
function initializeNavigation() {
    const profileSection = document.querySelector('.profile-section');
    const navLinks = document.querySelector('.nav-links');
    
    // 设置个人资料部分 - 使用最新的头像URL
    const currentAvatar = localStorage.getItem('userAvatar') || CONFIG.profile.avatar || './images/avatar/avatar.jpg';
    if (profileSection) {
        profileSection.innerHTML = `
            <div class="profile-image">
                <img src="${currentAvatar}" alt="头像" id="navAvatar">
            </div>
            <div class="profile-info">
                <h3>${CONFIG.profile.name}</h3>
                <p>${CONFIG.profile.title}</p>
            </div>
        `;
    }
    
    // 设置导航链接
    if (navLinks) {
        navLinks.innerHTML = '';
        CONFIG.navigation.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                <a href="#${item.id}" class="nav-link" data-section="${item.id}">
                    <i class="${item.icon}"></i>
                    <span>${item.label}</span>
                </a>
            `;
            navLinks.appendChild(li);
        });
        
        // 添加导航点击事件
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const sectionId = this.getAttribute('data-section');
                showSection(sectionId);
                
                // 在移动设备上自动关闭导航
                if (window.innerWidth < 768) {
                    document.querySelector('.side-nav').classList.remove('active');
                }
            });
        });
    }
}

// 显示特定部分
function showSection(sectionId) {
    // 隐藏所有部分
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // 显示选中的部分
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // 更新活动导航链接
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('active');
        }
    });
}

// 初始化主要内容
function initializeMainContent() {
    // 注释掉initializeAbout()调用，保持HTML静态内容
    // initializeAbout();

    // 音频可视化效果改为纯 CSS 动画控制，不再使用 JS 频繁修改，避免覆盖样式导致不生效
}

// 初始化关于页面
function initializeAbout() {
    const profileInfo = document.querySelector('.about-content .profile-info');
    const hobbyList = document.querySelector('.hobby-list');
    const favoriteQuotes = document.querySelector('.favorite-quotes');
    const contactInfo = document.querySelector('.contact-info');

    // 设置个人资料信息
    if (profileInfo && CONFIG.about) {
        profileInfo.innerHTML = `
            <h2>${CONFIG.about.name}</h2>
            <p class="subtitle">${CONFIG.about.title}</p>
            <p class="bio">${CONFIG.about.bio}</p>
        `;
    }

    // 设置兴趣爱好
    if (hobbyList && CONFIG.about && CONFIG.about.hobbies) {
        hobbyList.innerHTML = '';
        CONFIG.about.hobbies.forEach(hobby => {
            const li = document.createElement('li');
            li.innerHTML = `<span class="hobby-icon">${hobby.icon}</span> ${hobby.name}`;
            hobbyList.appendChild(li);
        });
    }

    // 设置最爱的句子
    if (favoriteQuotes && CONFIG.about && CONFIG.about.quotes) {
        favoriteQuotes.innerHTML = '';
        CONFIG.about.quotes.forEach(quote => {
            const quoteDiv = document.createElement('div');
            quoteDiv.className = 'quote';
            quoteDiv.innerHTML = `
                <p>${quote.text}</p>
                <cite>—— ${quote.author}</cite>
            `;
            favoriteQuotes.appendChild(quoteDiv);
        });
    }

    // 设置联系方式
    if (contactInfo && CONFIG.about && CONFIG.about.contact) {
        contactInfo.innerHTML = '';
        Object.entries(CONFIG.about.contact).forEach(([key, value]) => {
            let icon = '';
            switch (key) {
                case 'email': icon = 'fas fa-envelope'; break;
                case 'phone': icon = 'fas fa-phone'; break;
                case 'github': icon = 'fab fa-github'; break;
                case 'wechat': icon = 'fab fa-weixin'; break;
                default: icon = 'fas fa-link';
            }

            const contactDiv = document.createElement('div');
            contactDiv.className = 'contact-item';
            contactDiv.innerHTML = `
                <i class="${icon}"></i>
                <span>${value}</span>
            `;
            contactInfo.appendChild(contactDiv);
        });
    }
}

// 动画效果：音频条
function animateAudioBars() {
    const bars = document.querySelectorAll('.audio-bar');
    
    bars.forEach(bar => {
        const height = Math.random() * 100;
        const duration = 0.5 + Math.random() * 0.5;
        
        bar.style.height = `${height}%`;
        bar.style.animationDuration = `${duration}s`;
    });
    
    setTimeout(animateAudioBars, 500);
}

// 切换菜单
function toggleMenu() {
    const nav = document.querySelector('.side-nav');
    nav.classList.toggle('active');
}

// 在文档加载完成后检查登录状态
document.addEventListener('DOMContentLoaded', function() {
    // 检查登录状态
    if (sessionStorage.getItem('loginStatus') === 'true') {
        // 已登录，初始化主页
        initMainPage();
    }

    // 添加窗口大小变化事件处理
    window.addEventListener('resize', function() {
        // 响应式调整
        if (window.innerWidth > 768) {
            document.querySelector('.side-nav').classList.remove('active');
        }
    });
});
