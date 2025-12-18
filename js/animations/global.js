// 首页动画效果
function initHomeAnimations() {
    // 3D卡片悬停效果
    const cards = document.querySelectorAll('.site-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // 鼠标在卡片内的X坐标
            const y = e.clientY - rect.top;  // 鼠标在卡片内的Y坐标
            
            // 计算旋转角度
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            // 设置卡片的3D变换
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
            
            // 设置光影效果
            const shine = card.querySelector('.card-shine') || document.createElement('div');
            if (!card.querySelector('.card-shine')) {
                shine.classList.add('card-shine');
                card.appendChild(shine);
            }
            
            shine.style.backgroundImage = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 80%)`;
        });
        
        // 重置卡片状态
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            const shine = card.querySelector('.card-shine');
            if (shine) shine.remove();
        });
    });
    
    // 文字动画效果
    const titleElement = document.querySelector('.intro-title');
    if (titleElement) {
        titleElement.innerHTML = titleElement.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
        
        const letters = document.querySelectorAll('.intro-title .letter');
        letters.forEach((letter, index) => {
            letter.style.animationDelay = `${index * 0.1}s`;
            letter.classList.add('animated-letter');
        });
    }
    
    // 添加滚动动画
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    
    // 观察需要动画的元素
    document.querySelectorAll('.site-section, .particle-game, .intro-section').forEach(el => {
        observer.observe(el);
    });
    
    // 粒子游戏初始化
    initParticleGame();
}

// 粒子游戏初始化
function initParticleGame() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const particles = [];
    let score = 0;
    let playerX = 0, playerY = 0;
    let animationId;
    const scoreElement = document.getElementById('score');
    
    // 设置画布尺寸
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    
    // 初始化事件监听
    function initEvents() {
        // 鼠标移动事件
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            playerX = e.clientX - rect.left;
            playerY = e.clientY - rect.top;
        });
        
        // 触摸事件支持
        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const rect = canvas.getBoundingClientRect();
            playerX = e.touches[0].clientX - rect.left;
            playerY = e.touches[0].clientY - rect.top;
        });
        
        // 窗口大小变化事件
        window.addEventListener('resize', resizeCanvas);
    }
    
    // 创建粒子
    function createParticles() {
        for (let i = 0; i < 25; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 3 + 1,
                color: getRandomColor(),
                speed: Math.random() * 2 + 0.5,
                directionX: Math.random() * 4 - 2,
                directionY: Math.random() * 4 - 2,
                caught: false
            });
        }
    }
    
    // 获取随机颜色
    function getRandomColor() {
        const colors = [
            '#4C87EA', // 蓝色
            '#05D2DD', // 青色
            '#F6C90E', // 黄色
            '#FF6B6B', // 红色
            '#9376E0'  // 紫色
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    // 绘制玩家
    function drawPlayer() {
        if (playerX && playerY) {
            ctx.beginPath();
            ctx.arc(playerX, playerY, 15, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(playerX, playerY, 8, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.fill();
        }
    }
    
    // 绘制所有粒子
    function drawParticles() {
        particles.forEach(particle => {
            if (!particle.caught) {
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fillStyle = particle.color;
                ctx.fill();
                
                // 粒子移动
                particle.x += particle.directionX;
                particle.y += particle.directionY;
                
                // 边界检测
                if (particle.x < 0 || particle.x > canvas.width) {
                    particle.directionX *= -1;
                }
                if (particle.y < 0 || particle.y > canvas.height) {
                    particle.directionY *= -1;
                }
                
                // 检测捕获
                if (playerX && playerY) {
                    const dx = playerX - particle.x;
                    const dy = playerY - particle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 20) {
                        particle.caught = true;
                        score++;
                        if (scoreElement) {
                            scoreElement.textContent = score;
                        }
                        
                        // 创建新粒子
                        particles.push({
                            x: Math.random() * canvas.width,
                            y: Math.random() * canvas.height,
                            radius: Math.random() * 3 + 1,
                            color: getRandomColor(),
                            speed: Math.random() * 2 + 0.5,
                            directionX: Math.random() * 4 - 2,
                            directionY: Math.random() * 4 - 2,
                            caught: false
                        });
                    }
                }
            }
        });
        
        // 移除被捕获的粒子
        for (let i = particles.length - 1; i >= 0; i--) {
            if (particles[i].caught) {
                particles.splice(i, 1);
            }
        }
    }
    
    // 绘制连接线
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 - distance / 500})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    // 动画循环
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        drawConnections();
        drawParticles();
        drawPlayer();
        
        animationId = requestAnimationFrame(animate);
    }
    
    // 初始化游戏
    function init() {
        cancelAnimationFrame(animationId);
        resizeCanvas();
        initEvents();
        createParticles();
        animate();
        
        // 重置分数
        score = 0;
        if (scoreElement) {
            scoreElement.textContent = score;
        }
    }
    
    // 启动游戏
    init();
}

// 模拟音频条动画
function animateAudioBars() {
    const bars = document.querySelectorAll('.audio-bar');
    if (!bars.length) return;
    
    bars.forEach(bar => {
        const height = 5 + Math.random() * 30;
        bar.style.height = `${height}px`;
    });
    
    setTimeout(animateAudioBars, 120);
}

// 初始化页面背景动画
function initBackgroundEffects() {
    const container = document.querySelector('.background-effects');
    if (!container) return;
    
    // 添加动态背景元素
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.classList.add('bg-particle');
        
        // 随机位置、大小和延迟
        const size = Math.random() * 6 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
        
        container.appendChild(particle);
    }
}

// 鼠标跟随效果
function initCursorFollower() {
    const follower = document.querySelector('.cursor-follower');
    if (!follower) return;
    
    document.addEventListener('mousemove', (e) => {
        follower.style.left = `${e.clientX}px`;
        follower.style.top = `${e.clientY}px`;
    });
    
    // 添加悬停效果
    const hoverElements = document.querySelectorAll('a, button, .site-card');
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            follower.classList.add('hover');
        });
        element.addEventListener('mouseleave', () => {
            follower.classList.remove('hover');
        });
    });
}

// 在页面加载完成后初始化所有动画
document.addEventListener('DOMContentLoaded', () => {
    initHomeAnimations();
    initBackgroundEffects();
    initCursorFollower();
}); 