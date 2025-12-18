// 导航栏控制
function initNav() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('.section');
    
    // 初始化导航背景
    navLinks.forEach(link => {
        const bg = document.createElement('div');
        bg.className = 'nav-bg';
        link.appendChild(bg);
    });

    // 设置首页默认激活
    const homeLink = document.querySelector('.nav-links a[href="#home"]');
    if (homeLink) {
        homeLink.classList.add('active');
        const bg = homeLink.querySelector('.nav-bg');
        if (bg) {
            bg.style.transform = 'translateX(0)';
        }
        homeLink.style.color = '#ffffff';
    }

    // 处理导航点击
    document.querySelector('.nav-links').addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;
        
        e.preventDefault();
        const targetId = link.getAttribute('data-section');
        
        // 更新导航状态
        navLinks.forEach(l => {
            const bg = l.querySelector('.nav-bg');
            l.classList.remove('active');
            l.style.color = 'var(--text-color)';
            if (bg) {
                bg.style.transform = 'translateX(-100%)';
            }
        });

        // 激活当前导航
        link.classList.add('active');
        link.style.color = '#ffffff';
        const activeBg = link.querySelector('.nav-bg');
        if (activeBg) {
            activeBg.style.transform = 'translateX(0)';
        }
        
        // 更新内容区域
        sections.forEach(s => s.classList.remove('active'));
        document.getElementById(targetId)?.classList.add('active');
    });

    // 处理悬停效果
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            if (!link.classList.contains('active')) {
                const bg = link.querySelector('.nav-bg');
                if (bg) {
                    bg.style.transform = 'translateX(0)';
                    link.style.color = '#ffffff';
                }
            }
        });

        link.addEventListener('mouseleave', () => {
            if (!link.classList.contains('active')) {
                const bg = link.querySelector('.nav-bg');
                if (bg) {
                    bg.style.transform = 'translateX(-100%)';
                    link.style.color = 'var(--text-color)';
                }
            }
        });
    });
}

// 初始化导航栏
function initNavigation() {
    const profileSection = document.querySelector('.profile-section');
    const navLinks = document.querySelector('.nav-links');
    
    // 设置个人资料部分 - 获取最新的头像URL
    const currentAvatar = localStorage.getItem('userAvatar') || 'https://picsum.photos/100/100?random=1';
    profileSection.innerHTML = `
        <img src="${currentAvatar}" alt="个人头像" class="avatar" id="navAvatar">
        <h2>KLord</h2>
        <p>全栈开发工程师</p>
    `;
    
    // 设置导航链接
    const pages = [
        { id: 'home', icon: 'fas fa-home', name: '首页' },
        { id: 'projects', icon: 'fas fa-folder', name: '项目集' },
        { id: 'resources', icon: 'fas fa-database', name: '资源库' },
        { id: 'about', icon: 'fas fa-user', name: '关于我' }
    ];
    
    navLinks.innerHTML = pages.map(page => `
        <a href="#${page.id}" data-section="${page.id}">
            <i class="${page.icon}"></i>
            <span>${page.name}</span>
            <div class="nav-bg"></div>
        </a>
    `).join('');
    
    // 初始化导航背景和事件
    initNav();

    // 触发导航栏渲染完成事件
    window.dispatchEvent(new Event('navigationRendered'));
}

// 处理图片加载错误
function handleImageError(img) {
    console.log('头像加载失败，使用默认头像');
    img.src = 'https://picsum.photos/200/200?random=999';
    img.onerror = null; // 防止无限循环
}
