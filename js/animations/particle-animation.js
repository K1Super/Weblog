class ParticleGame {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        if (!this.canvas) {
            console.error('Particle canvas not found');
            return;
        }
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.score = 0;
        this.scoreElement = document.getElementById('score');
        
        this.init();
        this.createParticles();
        this.animate();
        this.addEventListeners();
        
        // 添加窗口大小改变事件监听
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });
    }

    init() {
        this.resizeCanvas();
    }

    resizeCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        
        // 重新创建粒子以适应新尺寸
        this.particles = [];
        this.createParticles();
    }

    createParticles() {
        // 根据容器大小调整粒子数量
        const area = this.canvas.width * this.canvas.height;
        const particleCount = Math.floor(area / 10000) * 2; // 每10000平方像素2个粒子
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 2 + 1,
                color: this.getRandomColor(),
                velocity: {
                    x: (Math.random() - 0.5) * 2,
                    y: (Math.random() - 0.5) * 2
                },
                alpha: Math.random() * 0.5 + 0.5,
                originalRadius: Math.random() * 2 + 1
            });
        }
    }

    getRandomColor() {
        const colors = [
            '#60A5FA', // 蓝色
            '#34D399', // 绿色
            '#F472B6', // 粉色
            '#A78BFA'  // 紫色
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    addEventListeners() {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.mouse.x = undefined;
            this.mouse.y = undefined;
        });
    }

    animate() {
        // 使用半透明背景实现拖尾效果
        this.ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(particle => {
            // 更新粒子位置
            particle.x += particle.velocity.x;
            particle.y += particle.velocity.y;

            // 边界检查 - 使用环绕效果
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;

            // 鼠标交互
            if (this.mouse.x && this.mouse.y) {
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    const angle = Math.atan2(dy, dx);
                    const force = (100 - distance) / 100;
                    
                    particle.velocity.x += Math.cos(angle) * force * 0.2;
                    particle.velocity.y += Math.sin(angle) * force * 0.2;
                    
                    particle.radius = particle.originalRadius * (1 + force);
                    
                    if (distance < 20) {
                        this.score += 1;
                        if (this.scoreElement) {
                            this.scoreElement.textContent = this.score;
                        }
                        particle.color = this.getRandomColor();
                    }
                } else {
                    particle.radius = particle.originalRadius;
                }
            }

            // 限制速度
            const maxSpeed = 3;
            const speed = Math.sqrt(
                particle.velocity.x * particle.velocity.x + 
                particle.velocity.y * particle.velocity.y
            );
            if (speed > maxSpeed) {
                particle.velocity.x = (particle.velocity.x / speed) * maxSpeed;
                particle.velocity.y = (particle.velocity.y / speed) * maxSpeed;
            }

            // 绘制粒子
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.alpha;
            this.ctx.fill();
            this.ctx.globalAlpha = 1;
        });

        requestAnimationFrame(() => this.animate());
    }
}

// 游戏实例
let gameInstance = null;

// 初始化粒子游戏函数 - 供main.js调用
function initParticleGame() {
    console.log('初始化粒子游戏...');
    
    // 确保canvas元素已经加载
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) {
        console.error('粒子画布元素不存在，可能尚未加载');
        // 尝试延迟初始化
        setTimeout(initParticleGame, 500);
        return;
    }
    
    // 确保只创建一个游戏实例
    if (!gameInstance) {
        gameInstance = new ParticleGame();
        console.log('粒子游戏已初始化');
    } else {
        // 如果已有实例但需要重新调整大小
        gameInstance.resizeCanvas();
        console.log('粒子游戏已重新调整大小');
    }
}

// 兼容性处理：保留原有的DOMContentLoaded事件，作为备用初始化方式
document.addEventListener('DOMContentLoaded', () => {
    // 只有在登录状态下才会通过main.js中的initMainPage调用初始化函数
    // 但在这里保留，以便于单独测试粒子游戏
    // 如果通过main.js已经初始化，则这里不会重复创建实例
    if (!gameInstance && document.getElementById('particleCanvas')) {
        // 检查是否在主页面显示状态
        const mainContent = document.getElementById('mainContent');
        if (mainContent && mainContent.style.display !== 'none') {
            initParticleGame();
        }
    }
}); 