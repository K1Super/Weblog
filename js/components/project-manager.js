// 自定义确认对话框函数
function showCustomConfirm(message, title = '确认操作', confirmText = '确定', cancelText = '取消') {
    return new Promise((resolve) => {
        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.className = 'custom-confirm-overlay';

        // 创建对话框
        const dialog = document.createElement('div');
        dialog.className = 'custom-confirm-dialog';

        // 标题
        const titleElement = document.createElement('div');
        titleElement.className = 'custom-confirm-title';
        titleElement.textContent = title;

        // 消息
        const messageElement = document.createElement('div');
        messageElement.className = 'custom-confirm-message';
        messageElement.textContent = message;

        // 按钮容器
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'custom-confirm-buttons';

        // 取消按钮
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'custom-confirm-btn cancel';
        cancelBtn.textContent = cancelText;
        cancelBtn.addEventListener('click', () => {
            overlay.remove();
            resolve(false);
        });

        // 确定按钮
        const confirmBtn = document.createElement('button');
        confirmBtn.className = 'custom-confirm-btn confirm';
        confirmBtn.textContent = confirmText;
        confirmBtn.addEventListener('click', () => {
            overlay.remove();
            resolve(true);
        });

        // ESC键关闭
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                overlay.remove();
                resolve(false);
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);

        // 点击遮罩层关闭
        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                overlay.remove();
                resolve(false);
                document.removeEventListener('keydown', handleEscape);
            }
        });

        // 组装DOM
        buttonsContainer.appendChild(cancelBtn);
        buttonsContainer.appendChild(confirmBtn);

        dialog.appendChild(titleElement);
        dialog.appendChild(messageElement);
        dialog.appendChild(buttonsContainer);

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        // 聚焦到确认按钮
        setTimeout(() => confirmBtn.focus(), 100);
    });
}

// GitHub API 服务
class GitHubService {
    constructor(filename = 'data.json') {
        this.token = window.GITHUB_TOKEN;
        this.gistId = window.GIST_ID;
        this.filename = filename;
        this.baseUrl = 'https://api.github.com';
    }

    // 检查配置是否完整
    isConfigured() {
        return this.token && this.gistId;
    }

    // 从GitHub Gist加载数据
    async loadData() {
        if (!this.isConfigured()) {
            throw new Error('GitHub配置不完整');
        }

        try {
            const response = await fetch(`${this.baseUrl}/gists/${this.gistId}`, {
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const gist = await response.json();
            const file = gist.files[this.filename];

            if (!file) {
                // 如果文件不存在，返回空数组
                return [];
            }

            const data = JSON.parse(file.content);
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('从GitHub加载数据失败:', error);
            // 发生错误时返回空数组，让系统降级到localStorage
            return [];
        }
    }

    // 保存数据到GitHub Gist
    async saveData(data) {
        if (!this.isConfigured()) {
            throw new Error('GitHub配置不完整');
        }

        try {
            const content = JSON.stringify(data, null, 2);

            const response = await fetch(`${this.baseUrl}/gists/${this.gistId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    files: {
                        [this.filename]: {
                            content: content
                        }
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('数据已保存到GitHub:', result.updated_at);
            return true;
        } catch (error) {
            console.error('保存数据到GitHub失败:', error);
            throw error;
        }
    }
}

// 项目管理器
class ProjectManager {
    constructor() {
        this.storageKey = 'userProjects';
        this.githubService = new GitHubService('projects-data.json');
        this.projects = [];
        this.isManageMode = false; // 管理模式状态
        this.clickOutsideHandler = null; // 点击外部区域的处理函数
        this.isOnline = false; // 是否在线模式
        this.init();
    }

    // 初始化
    async init() {
        await this.loadProjects();
        this.renderProjects();
    }

    // 切换管理模式
    toggleManageMode() {
        const wasManageMode = this.isManageMode;
        this.isManageMode = !this.isManageMode;

        if (this.isManageMode && !wasManageMode) {
            // 进入管理模式 - 添加点击外部区域的监听器
            this.addClickOutsideListener();
        } else if (!this.isManageMode && wasManageMode) {
            // 退出管理模式 - 移除监听器
            this.removeClickOutsideListener();
        }

        // 更新设置按钮的状态
        if (typeof updateManageProjectButton === 'function') {
            updateManageProjectButton(this.isManageMode);
        }

        this.renderProjects();
        return this.isManageMode;
    }

    // 添加点击外部区域的监听器
    addClickOutsideListener() {
        if (this.clickOutsideHandler) {
            this.removeClickOutsideListener();
        }

        this.clickOutsideHandler = (event) => {
            // 检查点击的目标是否在项目卡片内部
            const clickedElement = event.target;
            const projectCard = clickedElement.closest('.project-card-new');

            // 如果点击的不是项目卡片内部，则退出管理模式
            if (!projectCard) {
                this.toggleManageMode();
            }
        };

        // 使用事件捕获阶段，确保在其他事件之前执行
        document.addEventListener('click', this.clickOutsideHandler, true);
    }

    // 移除点击外部区域的监听器
    removeClickOutsideListener() {
        if (this.clickOutsideHandler) {
            document.removeEventListener('click', this.clickOutsideHandler, true);
            this.clickOutsideHandler = null;
        }
    }

    // 更新项目
    updateProject(projectId, updates) {
        const project = this.projects.find(p => p.id === projectId);
        if (project) {
            Object.assign(project, updates);
            this.saveProjects();
            this.renderProjects();
            return true;
        }
        return false;
    }

    // 加载项目数据（优先GitHub，其次localStorage）
    async loadProjects() {
        // 首先尝试从GitHub加载
        if (this.githubService.isConfigured()) {
            try {
                const githubData = await this.githubService.loadData();
                if (githubData && githubData.length > 0) {
                    this.projects = githubData;
                    this.isOnline = true;
                    console.log('已从GitHub加载项目数据');
                    // 同步到localStorage
                    this.saveToLocalStorage();
                    return;
                }
            } catch (error) {
                console.warn('从GitHub加载数据失败，将使用本地数据:', error);
            }
        }

        // 如果GitHub失败或未配置，从localStorage加载
        this.projects = this.loadFromLocalStorage();
        this.isOnline = false;
        console.log('已从本地存储加载项目数据');
    }

    // 保存项目数据（同时保存到GitHub和localStorage）
    async saveProjects() {
        // 总是保存到localStorage
        this.saveToLocalStorage();

        // 如果配置了GitHub，尝试保存到GitHub
        if (this.githubService.isConfigured() && this.isOnline) {
            try {
                await this.githubService.saveData(this.projects);
                console.log('项目数据已同步到GitHub');
            } catch (error) {
                console.error('保存到GitHub失败:', error);
                // 即使GitHub保存失败，本地保存仍然有效
            }
        }
    }

    // 从localStorage加载项目
    loadFromLocalStorage() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('从localStorage加载项目失败:', error);
            return [];
        }
    }

    // 保存项目到localStorage
    saveToLocalStorage() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.projects));
            return true;
        } catch (error) {
            console.error('保存到localStorage失败:', error);
            return false;
        }
    }

    // 添加项目
    addProject(projectData) {
        const newProject = {
            id: Date.now().toString(),
            name: projectData.name || '未命名项目',
            description: projectData.description || '',
            link: projectData.link || '',
            createdAt: new Date().toISOString()
        };
        this.projects.push(newProject);
        this.saveProjects();
        this.renderProjects();
        return newProject;
    }

    // 删除项目
    deleteProject(projectId) {
        this.projects = this.projects.filter(p => p.id !== projectId);
        this.saveProjects();
        this.renderProjects();
    }

    // 渲染项目卡片
    renderProjects() {
        const contentArea = document.querySelector('#projects .content-area');
        if (!contentArea) return;

        if (this.projects.length === 0) {
            contentArea.innerHTML = '<div class="projects-empty">暂无项目，点击右上角设置按钮添加项目</div>';
            return;
        }

        const projectsGrid = document.createElement('div');
        projectsGrid.className = 'projects-grid-new';
        
        this.projects.forEach(project => {
            const card = this.createProjectCard(project);
            projectsGrid.appendChild(card);
        });

        contentArea.innerHTML = '';
        contentArea.appendChild(projectsGrid);
    }

    // 创建项目卡片
    createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'project-card-new';
        if (this.isManageMode) {
            card.classList.add('manage-mode');
        }
        card.dataset.projectId = project.id;

        // 删除按钮（只在管理模式下显示）
        if (this.isManageMode) {
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'project-delete-btn';
            deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
            deleteBtn.title = '删除项目';
            deleteBtn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const confirmed = await showCustomConfirm(
                    '删除后将无法恢复，确定要删除这个项目吗？',
                    '删除项目',
                    '删除',
                    '取消'
                );
                if (confirmed) {
                    this.deleteProject(project.id);
                }
            });
            card.appendChild(deleteBtn);
        }

        // 项目名称（管理模式下可编辑）
        const name = document.createElement(this.isManageMode ? 'input' : 'div');
        name.className = 'project-name';
        if (this.isManageMode) {
            name.type = 'text';
            name.value = project.name;
            name.placeholder = '项目名称';
            name.addEventListener('blur', () => {
                this.updateProject(project.id, { name: name.value || '未命名项目' });
            });
            name.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    name.blur();
                }
            });
        } else {
            name.textContent = project.name;
        }

        // 项目简介（管理模式下可编辑）
        const description = document.createElement(this.isManageMode ? 'textarea' : 'div');
        description.className = 'project-description';
        if (this.isManageMode) {
            description.value = project.description || '';
            description.placeholder = '项目简介';
            description.rows = 3;
            description.addEventListener('blur', () => {
                this.updateProject(project.id, { description: description.value });
            });
        } else {
            description.textContent = project.description || '暂无简介';
        }

        // 项目链接（管理模式下可编辑）
        const linkContainer = document.createElement('div');
        linkContainer.className = 'project-link-container';
        
        if (this.isManageMode) {
            const linkIcon = document.createElement('i');
            linkIcon.className = 'fas fa-link';
            
            const linkInput = document.createElement('input');
            linkInput.type = 'url';
            linkInput.className = 'project-link-input';
            linkInput.value = project.link || '';
            linkInput.placeholder = 'https://example.com';
            linkInput.addEventListener('blur', () => {
                this.updateProject(project.id, { link: linkInput.value });
            });
            linkInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    linkInput.blur();
                }
            });
            
            linkContainer.appendChild(linkIcon);
            linkContainer.appendChild(linkInput);
        } else {
            if (project.link) {
                const linkIcon = document.createElement('i');
                linkIcon.className = 'fas fa-link';
                
                const link = document.createElement('a');
                link.href = project.link;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                link.textContent = project.link;
                link.className = 'project-link-text';
                
                linkContainer.appendChild(linkIcon);
                linkContainer.appendChild(link);
            } else {
                linkContainer.textContent = '暂无链接';
                linkContainer.style.color = 'rgba(255, 255, 255, 0.5)';
            }
        }

        card.appendChild(name);
        card.appendChild(description);
        card.appendChild(linkContainer);

        return card;
    }

    // 直接添加项目（默认项目）
    addDefaultProject() {
        const defaultProject = {
            name: '新项目',
            description: '',
            link: ''
        };
        return this.addProject(defaultProject);
    }
}

// 初始化项目管理器
let projectManager;

function initProjectManager() {
    if (!projectManager) {
        projectManager = new ProjectManager();
    }
    return projectManager;
}

// 资源管理器
class ResourceManager {
    constructor() {
        this.storageKey = 'userResources';
        this.resources = [];
        this.isOnline = false;
        this.githubService = new GitHubService('resources-data.json');
        this.init();
    }

    async init() {
        await this.loadResources();
        this.renderResources();
        this.bindEvents();
    }

    bindEvents() {
        // 绑定加号按钮点击事件
        const addBtn = document.querySelector('.add-resource-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                this.addResource();
            });
        }
    }

    async loadResources() {
        // 优先从GitHub加载，否则从localStorage加载
        if (this.githubService.isConfigured()) {
            try {
                const githubData = await this.githubService.loadData();
                if (githubData && githubData.length > 0) {
                    this.resources = githubData;
                    this.isOnline = true;
                    this.saveToLocalStorage();
                    return;
                }
            } catch (error) {
                console.warn('从GitHub加载资源失败:', error);
            }
        }

        this.resources = this.loadFromLocalStorage();
        this.isOnline = false;
    }

    async saveResources() {
        this.saveToLocalStorage();

        if (this.githubService.isConfigured() && this.isOnline) {
            try {
                await this.githubService.saveData(this.resources);
                console.log('资源数据已同步到GitHub');
            } catch (error) {
                console.error('保存到GitHub失败:', error);
            }
        }
    }

    loadFromLocalStorage() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('从localStorage加载资源失败:', error);
            return [];
        }
    }

    saveToLocalStorage() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.resources));
        } catch (error) {
            console.error('保存到localStorage失败:', error);
        }
    }

    addResource() {
        const newResource = {
            id: Date.now().toString(),
            title: '',
            link: '',
            createdAt: new Date().toISOString()
        };

        this.resources.unshift(newResource); // 添加到开头
        this.saveResources();
        this.renderResources();

        // 聚焦到新添加的标题输入框
        setTimeout(() => {
            const titleInputs = document.querySelectorAll('.resource-title-input');
            if (titleInputs.length > 0) {
                titleInputs[0].focus();
            }
        }, 100);
    }

    updateResource(id, updates) {
        const resource = this.resources.find(r => r.id === id);
        if (resource) {
            Object.assign(resource, updates);
            this.saveResources();
            this.renderResources();
        }
    }

    deleteResource(id) {
        console.log('Deleting resource:', id);
        // 找到要删除的资源项
        const resourceItem = document.querySelector(`.resource-item[data-resource-id="${id}"]`);
        console.log('Found resource item:', resourceItem);

        if (resourceItem) {
            // 添加删除动画
            resourceItem.style.transition = 'all 0.3s ease';
            resourceItem.style.opacity = '0';
            resourceItem.style.transform = 'translateX(-20px)';

            // 立即更新数据
            this.resources = this.resources.filter(r => r.id !== id);
            this.saveResources();

            // 等待动画完成后重新渲染
            setTimeout(() => {
                this.renderResources();
            }, 300);
        } else {
            console.error('Resource item not found in DOM');
            // 如果DOM元素不存在，直接更新数据并重新渲染
            this.resources = this.resources.filter(r => r.id !== id);
            this.saveResources();
            this.renderResources();
        }
    }

    renderResources() {
        const contentArea = document.querySelector('#resources .content-area');
        if (!contentArea) return;

        // 移除现有的资源列表
        const existingList = contentArea.querySelector('.resources-list');
        if (existingList) {
            existingList.remove();
        }

        // 如果没有资源，显示空状态
        if (this.resources.length === 0) {
            const emptyState = document.querySelector('.resources-empty');
            if (emptyState) {
                emptyState.style.display = 'block';
            }
            return;
        }

        // 隐藏空状态
        const emptyState = document.querySelector('.resources-empty');
        if (emptyState) {
            emptyState.style.display = 'none';
        }

        // 创建资源列表
        const resourcesList = document.createElement('div');
        resourcesList.className = 'resources-list';

        this.resources.forEach((resource, index) => {
            const resourceItem = this.createResourceItem(resource, index);
            resourcesList.appendChild(resourceItem);
        });

        // 在空状态之前插入
        const emptyStateEl = contentArea.querySelector('.resources-empty');
        if (emptyStateEl) {
            contentArea.insertBefore(resourcesList, emptyStateEl);
        } else {
            contentArea.appendChild(resourcesList);
        }
    }

    createResourceItem(resource, index) {
        const item = document.createElement('div');
        item.className = 'resource-item';
        item.dataset.resourceId = resource.id;

        // 标题输入框容器
        const titleContainer = document.createElement('div');
        titleContainer.className = 'resource-input-container';

        const titleIcon = document.createElement('i');
        titleIcon.className = 'fas fa-file-alt resource-input-icon';

        const titleInput = document.createElement('input');
        titleInput.type = 'text';
        titleInput.className = 'resource-title-input';
        titleInput.placeholder = '请输入资源标题';
        titleInput.value = resource.title || '';
        titleInput.addEventListener('blur', () => {
            this.updateResource(resource.id, { title: titleInput.value });
        });
        titleInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                titleInput.blur();
            }
        });

        titleContainer.appendChild(titleIcon);
        titleContainer.appendChild(titleInput);

        // 链接输入框容器
        const linkContainer = document.createElement('div');
        linkContainer.className = 'resource-input-container';

        const linkIcon = document.createElement('i');
        linkIcon.className = 'fas fa-link resource-input-icon';

        const linkInput = document.createElement('input');
        linkInput.type = 'url';
        linkInput.className = 'resource-link-input';
        linkInput.placeholder = '请输入资源链接 (可选)';
        linkInput.value = resource.link || '';
        linkInput.addEventListener('blur', () => {
            this.updateResource(resource.id, { link: linkInput.value });
        });
        linkInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                linkInput.blur();
            }
        });

        linkContainer.appendChild(linkIcon);
        linkContainer.appendChild(linkInput);

        // 删除按钮
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'resource-delete-btn';
        deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
        deleteBtn.title = '删除资源';
        deleteBtn.addEventListener('click', async () => {
            const confirmed = await showCustomConfirm(
                '确定要删除这个资源吗？',
                '删除资源',
                '删除',
                '取消'
            );
            if (confirmed) {
                this.deleteResource(resource.id);
            }
        });

        // 组装元素
        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'resource-content';
        contentWrapper.appendChild(titleContainer);
        contentWrapper.appendChild(linkContainer);

        item.appendChild(contentWrapper);
        item.appendChild(deleteBtn);

        return item;
    }
}

// 创建全局资源管理器实例
let resourceManager;

// 初始化资源管理器
function initResourceManager() {
    if (!resourceManager) {
        resourceManager = new ResourceManager();
    }
    return resourceManager;
}

// 直接添加项目的方法供settings-handler使用
function addProjectDirectly() {
    // 确保项目管理器已初始化
    if (!projectManager) {
        initProjectManager();
    }
    if (projectManager && projectManager.addDefaultProject) {
        projectManager.addDefaultProject();
    }
}

// 切换管理模式的方法供settings-handler使用
function toggleManageMode() {
    // 确保项目管理器已初始化
    if (!projectManager) {
        initProjectManager();
    }
    if (projectManager && projectManager.toggleManageMode) {
        return projectManager.toggleManageMode();
    }
    return false;
}
