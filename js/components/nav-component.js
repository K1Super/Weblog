// 导航栏控制
function initNav() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('.section');

    // 设置首页默认激活
    const homeLink = document.querySelector('.nav-links a[href="#home"]');
    if (homeLink) {
        homeLink.classList.add('active');
    }

    // 处理导航点击
    document.querySelector('.nav-links').addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;

        e.preventDefault();
        const targetId = link.getAttribute('data-section');

        // 更新导航状态
        navLinks.forEach(l => {
            l.classList.remove('active');
        });

        // 激活当前导航
        link.classList.add('active');

        // 更新内容区域
        sections.forEach(s => s.classList.remove('active'));
        document.getElementById(targetId)?.classList.add('active');
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
        { id: 'home', name: 'Home' },
        { id: 'projects', name: 'Projects' },
        { id: 'resources', name: 'Resources' },
        { id: 'about', name: 'About' }
    ];
    
    navLinks.innerHTML = pages.map(page => `
        <li>
            <a href="#${page.id}" data-section="${page.id}">
                <span>${page.name}</span>
                <div class="star-1">
                    <svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" version="1.1" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd" viewBox="0 0 784.11 815.53" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <defs></defs>
                        <g id="Layer_x0020_1">
                            <metadata id="CorelCorpID_0Corel-Layer"></metadata>
                            <path fill="#fffdef" d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"></path>
                        </g>
                    </svg>
                </div>
                <div class="star-2">
                    <svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" version="1.1" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd" viewBox="0 0 784.11 815.53" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <defs></defs>
                        <g id="Layer_x0020_1">
                            <metadata id="CorelCorpID_0Corel-Layer"></metadata>
                            <path fill="#fffdef" d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"></path>
                        </g>
                    </svg>
                </div>
                <div class="star-3">
                    <svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" version="1.1" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd" viewBox="0 0 784.11 815.53" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <defs></defs>
                        <g id="Layer_x0020_1">
                            <metadata id="CorelCorpID_0Corel-Layer"></metadata>
                            <path fill="#fffdef" d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"></path>
                        </g>
                    </svg>
                </div>
                <div class="star-4">
                    <svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" version="1.1" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd" viewBox="0 0 784.11 815.53" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <defs></defs>
                        <g id="Layer_x0020_1">
                            <metadata id="CorelCorpID_0Corel-Layer"></metadata>
                            <path fill="#fffdef" d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"></path>
                        </g>
                    </svg>
                </div>
                <div class="star-5">
                    <svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" version="1.1" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd" viewBox="0 0 784.11 815.53" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <defs></defs>
                        <g id="Layer_x0020_1">
                            <metadata id="CorelCorpID_0Corel-Layer"></metadata>
                            <path fill="#fffdef" d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"></path>
                        </g>
                    </svg>
                </div>
                <div class="star-6">
                    <svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" version="1.1" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd" viewBox="0 0 784.11 815.53" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <defs></defs>
                        <g id="Layer_x0020_1">
                            <metadata id="CorelCorpID_0Corel-Layer"></metadata>
                            <path fill="#fffdef" d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"></path>
                        </g>
                    </svg>
                </div>
            </a>
        </li>
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
