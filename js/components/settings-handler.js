// 全局变量存储管理按钮引用
let manageProjectBtnElement = null;

// 更新管理项目按钮状态的全局方法
function updateManageProjectButton(isManageMode) {
    if (manageProjectBtnElement) {
        const btnText = manageProjectBtnElement.querySelector('span');
        if (btnText) {
            btnText.textContent = isManageMode ? '退出管理' : '管理项目';
        }
    }
}

// 设置功能处理器
function initSettingsHandler() {
    // 确保项目管理器已初始化
    if (typeof initProjectManager === 'function' && !projectManager) {
        initProjectManager();
    }

    const settingsGear = document.getElementById('settingsGear');
    const settingsMenu = document.getElementById('settingsMenu');
    const addProjectBtn = document.getElementById('addProjectBtn');
    const manageProjectBtn = document.getElementById('manageProjectBtn');

    // 保存管理按钮引用到全局变量
    manageProjectBtnElement = manageProjectBtn;

    if (!settingsGear || !settingsMenu) {
        console.warn('设置按钮或菜单元素未找到');
        return;
    }

    // 点击螺丝按钮切换菜单显示
    settingsGear.addEventListener('click', function(e) {
        e.stopPropagation();
        settingsMenu.classList.toggle('active');
    });

    // 点击页面其他地方关闭菜单
    document.addEventListener('click', function(e) {
        if (!settingsGear.contains(e.target) && !settingsMenu.contains(e.target)) {
            settingsMenu.classList.remove('active');
        }
    });

    // 增加项目按钮点击事件
    if (addProjectBtn) {
        addProjectBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            if (typeof addProjectDirectly === 'function') {
                addProjectDirectly();
            }
            settingsMenu.classList.remove('active');
        });
    }

    // 管理项目按钮点击事件
    if (manageProjectBtn) {
        manageProjectBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            if (typeof toggleManageMode === 'function') {
                const isManageMode = toggleManageMode();
                // 更新按钮文本
                updateManageProjectButton(isManageMode);
            }
            settingsMenu.classList.remove('active');
        });
    }
}

// 在DOM加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSettingsHandler);
} else {
    initSettingsHandler();
}
