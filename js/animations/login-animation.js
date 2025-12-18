// 鼠标跟随效果
document.addEventListener('DOMContentLoaded', function() {
    const cursor = document.querySelector('.cursor-follower');
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // 平滑跟随效果
    function animate() {
        let dx = mouseX - cursorX;
        let dy = mouseY - cursorY;
        
        cursorX += dx * 0.1;
        cursorY += dy * 0.1;
        
        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
        
        requestAnimationFrame(animate);
    }
    animate();

    // 交互效果
    const interactiveElements = document.querySelectorAll('a, button, input');
    interactiveElements.forEach(el => {
        // 隐藏默认光标，显示自定义效果
        el.style.cursor = 'none';

        el.addEventListener('mouseenter', () => {
            cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) scale(1.5)`;
            cursor.style.background = 'rgba(255, 107, 107, 0.4)';
        });

        el.addEventListener('mouseleave', () => {
            cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) scale(1)`;
            cursor.style.background = 'rgba(255, 255, 255, 0.3)';
        });
    });

    // 点击波纹效果
    document.addEventListener('click', function(e) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple';

        ripple.style.left = (e.clientX - 20) + 'px';
        ripple.style.top = (e.clientY - 20) + 'px';
        ripple.style.position = 'fixed';
        ripple.style.pointerEvents = 'none';
        ripple.style.zIndex = '9999';

        const colors = [
            'rgba(255, 107, 107, 0.8)',
            'rgba(78, 205, 196, 0.8)',
            'rgba(69, 183, 209, 0.8)',
            'rgba(150, 206, 180, 0.8)'
        ];
        ripple.style.background = colors[Math.floor(Math.random() * colors.length)];

        document.body.appendChild(ripple);

        ripple.addEventListener('animationend', function() {
            ripple.remove();
        });
    });
    
    // 确保登录页面的效果只在登录页面可见时生效
    function updateLoginEffects() {
        const loginSection = document.getElementById('loginSection');
        const cursorFollower = document.querySelector('.cursor-follower');
        const rippleContainer = document.querySelector('.ripple-container');
        const floatingElements = document.querySelector('.floating-elements');

        if (loginSection && loginSection.style.display === 'none') {
            // 如果登录部分隐藏，则隐藏登录特效（浮动装饰元素），但保持光标跟随效果
            if (floatingElements) floatingElements.style.display = 'none';
            // 光标跟随效果在主页面也保持可见
            if (cursorFollower) cursorFollower.style.display = 'block';
        } else {
            // 如果登录部分显示，则显示所有登录特效
            if (cursorFollower) cursorFollower.style.display = 'block';
            if (floatingElements) floatingElements.style.display = 'block';
        }
    }
    
    // 初始检查并设置观察器
    updateLoginEffects();
    
    // 观察登录状态变化
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'style') {
                updateLoginEffects();
            }
        });
    });
    
    const loginSection = document.getElementById('loginSection');
    if (loginSection) {
        observer.observe(loginSection, { attributes: true });
    }
});

// 提示框功能
function showHint(event) {
    event.preventDefault();
    const modal = document.getElementById('hintModal');
    modal.style.display = 'flex';
    
    modal.onclick = function() {
        modal.style.display = 'none';
    };
}
