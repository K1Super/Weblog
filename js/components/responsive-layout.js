// 移动端导航控制
function toggleMenu() {
    const nav = document.querySelector('.side-nav');
    nav.classList.toggle('active');
}

// 点击内容区域关闭导航
document.querySelector('.main-content').addEventListener('click', function() {
    const nav = document.querySelector('.side-nav');
    if (nav.classList.contains('active')) {
        nav.classList.remove('active');
    }
});

// 触摸滑动支持
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const nav = document.querySelector('.side-nav');
    const swipeDistance = touchEndX - touchStartX;
    
    if (swipeDistance > 50) {
        nav.classList.add('active');
    } else if (swipeDistance < -50) {
        nav.classList.remove('active');
    }
}

// 滚动性能优化
let ticking = false;
window.addEventListener('scroll', function() {
    if (!ticking) {
        window.requestAnimationFrame(function() {
            ticking = false;
        });
        ticking = true;
    }
}); 