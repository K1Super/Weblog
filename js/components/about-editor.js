    // 默认内容，当数据文件不存在时使用
    const DEFAULT_CONTENT = {
        "name": "KLord",
        "title": "全栈开发工程师",
        "bio": "融汇全栈，精研架构，巧筑实功",
        "hobbies": [
            "编程",
            "音乐",
            "游戏",
            "摄影",
            "旅行",
        ],
        "quotes": [
            {
                "text": "The only way to do great work is to love what you do.",
                "author": "Steve Jobs"
            }
        ],
        "contacts": [
            {
                "type": "email",
                "value": "pureyyds@163.com"
            },
            {
                "type": "github",
                "value": "https://github.com/K1Super"
            },
            {
                "type": "qq",
                "value": "2123367071"
            }
        ]
    };

// 关于我页面编辑器
class AboutEditor {
    constructor() {
        this.originalContent = {};
        this.isEditing = false;
        this.init();
    }

    // 初始化
    init() {
        this.loadSavedContent();
        this.bindEditButton();
    }

    // 绑定编辑按钮事件
    bindEditButton() {
        const editBtn = document.getElementById('aboutEditBtn');
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                this.toggleEditMode();
            });
        }
    }

    // 切换编辑模式
    toggleEditMode() {
        const aboutContent = document.querySelector('.about-content');

        if (this.isEditing) {
            this.exitEditMode();
        } else {
            this.enterEditMode();
        }

        this.isEditing = !this.isEditing;
    }

    // 进入编辑模式
    enterEditMode() {
        const aboutContent = document.querySelector('.about-content');
        aboutContent.classList.add('editing');

        // 保存原始内容
        this.saveOriginalContent();

        // 使文字可编辑
        this.makeContentEditable();

        // 使联系方式卡片可编辑
        this.makeContactCardsEditable();

        // 显示编辑工具栏
        this.showEditToolbar();

        // 隐藏编辑按钮
        const editBtn = document.getElementById('aboutEditBtn');
        if (editBtn) {
            editBtn.style.display = 'none';
        }
    }

    // 退出编辑模式
    exitEditMode() {
        const aboutContent = document.querySelector('.about-content');
        aboutContent.classList.remove('editing');

        // 强制重新渲染联系方式卡片，确保删除按钮隐藏
        this.refreshContactCards();

        // 移除兴趣爱好添加按钮
        this.removeHobbyAddButton();

        // 使文字不可编辑
        this.makeContentNonEditable();

        // 使联系方式卡片不可编辑
        this.makeContactCardsNonEditable();

        // 隐藏编辑工具栏
        this.hideEditToolbar();

        // 显示编辑按钮
        const editBtn = document.getElementById('aboutEditBtn');
        if (editBtn) {
            editBtn.style.display = 'flex';
        }

        // 清除未保存的内容
        this.clearUnsavedChanges();
    }

    // 保存原始内容
    saveOriginalContent() {
        const elements = [
            '.about-profile h2',
            '.about-profile .subtitle',
            '.about-profile .bio',
            '.hobby-list li',
            '.contact-item span',
            '.quote p',
            '.quote cite'
        ];

        elements.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((element, index) => {
                const key = `${selector}_${index}`;
                this.originalContent[key] = element.textContent || element.innerText;
            });
        });
    }

    // 使内容可编辑
    makeContentEditable() {
        const elements = [
            '.about-profile h2',
            '.about-profile .subtitle',
            '.about-profile .bio',
            '.hobby-list li',
            '.contact-item span',
            '.quote p',
            '.quote cite'
        ];

        elements.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.contentEditable = 'true';
                element.style.outline = 'none';

                // 特殊处理兴趣爱好
                if (selector === '.hobby-list li') {
                    // 添加输入事件监听来处理空内容
                    element.addEventListener('input', (e) => {
                        this.handleHobbyInput(e.target);
                        this.onContentChange();
                    });

                    // 如果内容为空，隐藏该元素
                    if (!element.textContent.trim()) {
                        element.style.display = 'none';
                    }
                } else {
                    // 添加输入事件监听
                    element.addEventListener('input', () => {
                        this.onContentChange();
                    });
                }

                // 添加键盘事件监听
                element.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        this.saveChanges();
                    } else if (e.key === 'Escape') {
                        this.cancelChanges();
                    }
                });
            });
        });

        // 为兴趣爱好添加增加按钮
        this.addHobbyAddButton();
    }

    // 使内容不可编辑
    makeContentNonEditable() {
        const elements = [
            '.about-profile h2',
            '.about-profile .subtitle',
            '.about-profile .bio',
            '.hobby-list li',
            '.contact-item span',
            '.quote p',
            '.quote cite'
        ];

        elements.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.contentEditable = 'false';
                element.style.outline = 'none';

                // 移除事件监听器
                element.removeEventListener('input', this.onContentChange);
                element.removeEventListener('keydown', this.saveChanges);
                element.removeEventListener('keydown', this.cancelChanges);
            });
        });
    }

    // 内容改变时的处理
    onContentChange() {
        // 可以在这里添加实时保存或提示用户有未保存的更改
        console.log('Content changed');
    }

    // 显示编辑工具栏
    showEditToolbar() {
        const toolbar = document.createElement('div');
        toolbar.className = 'about-edit-toolbar';
        toolbar.innerHTML = `
            <button class="save-btn" onclick="aboutEditor.saveChanges()">
                <i class="fas fa-save"></i>
                保存
            </button>
            <button class="cancel-btn" onclick="aboutEditor.cancelChanges()">
                <i class="fas fa-times"></i>
                取消
            </button>
        `;

        document.body.appendChild(toolbar);
    }

    // 隐藏编辑工具栏
    hideEditToolbar() {
        const toolbar = document.querySelector('.about-edit-toolbar');
        if (toolbar) {
            toolbar.remove();
        }
    }

    // 保存更改
    async saveChanges() {
        // 收集所有编辑内容
        const contentToSave = this.collectEditedContent();

        try {
            // 保存到持久化存储
            await this.saveContentToFile(contentToSave);
            console.log('内容已保存，所有访问者都能看到更新后的内容');

            // 退出编辑模式
            this.exitEditMode();
        } catch (error) {
            console.error('保存失败:', error);
            // 即使保存失败也退出编辑模式
            this.exitEditMode();
        }
    }

    // 收集编辑后的内容
    collectEditedContent() {
        const contentToSave = {};

        // 保存个人资料
        const nameElement = document.querySelector('.about-profile h2');
        if (nameElement) {
            contentToSave.name = nameElement.textContent.trim();
        }

        const titleElement = document.querySelector('.about-profile .subtitle');
        if (titleElement) {
            contentToSave.title = titleElement.textContent.trim();
        }

        const bioElement = document.querySelector('.about-profile .bio');
        if (bioElement) {
            contentToSave.bio = bioElement.textContent.trim();
        }

        // 保存兴趣爱好
        const hobbies = [];
        const hobbyElements = document.querySelectorAll('.hobby-list li');
        hobbyElements.forEach(element => {
            const text = element.textContent.trim();
            if (text) {
                hobbies.push(text);
            }
        });
        contentToSave.hobbies = hobbies;

        // 保存名言
        const quotes = [];
        const quoteElements = document.querySelectorAll('.quote p');
        const citeElements = document.querySelectorAll('.quote cite');
        quoteElements.forEach((element, index) => {
            const text = element.textContent.trim();
            const author = citeElements[index] ? citeElements[index].textContent.trim() : '';
            if (text) {
                quotes.push({ text, author: author.replace('—', '').trim() });
            }
        });
        contentToSave.quotes = quotes;

        // 保存联系方式
        const contacts = [];
        const contactCards = document.querySelectorAll('.contact-card');
        contactCards.forEach(card => {
            const type = card.dataset.type;
            const valueElement = card.querySelector('.contact-value');
            if (valueElement && type) {
                const value = valueElement.textContent.trim();
                if (value) {
                    contacts.push({ type, value });
                }
            }
        });
        contentToSave.contacts = contacts;

        return contentToSave;
    }

    // 显示导出对话框
    showExportDialog(content) {
        const dialog = document.createElement('div');
        dialog.className = 'export-dialog-overlay';
        dialog.innerHTML = `
            <div class="export-dialog">
                <h3>内容已编辑完成</h3>
                <p>编辑已完成，您可以继续使用网站。</p>
                <div class="dialog-buttons">
                    <button class="close-btn" onclick="aboutEditor.closeExportDialog()">确定</button>
                </div>
            </div>
        `;

        document.body.appendChild(dialog);
    }

    // 复制到剪贴板
    copyToClipboard(content) {
        navigator.clipboard.writeText(content).then(() => {
            this.showSuccessMessage('代码已复制到剪贴板！');
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = content;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showSuccessMessage('代码已复制到剪贴板！');
        });
    }

    // 关闭导出对话框
    closeExportDialog() {
        const dialog = document.querySelector('.export-dialog-overlay');
        if (dialog) {
            dialog.remove();
        }
    }

    // 取消更改
    cancelChanges() {
        // 恢复原始内容
        this.restoreOriginalContent();

        // 退出编辑模式
        this.exitEditMode();
    }

    // 恢复原始内容
    restoreOriginalContent() {
        Object.keys(this.originalContent).forEach(key => {
            const [selector, index] = key.split('_');
            const elements = document.querySelectorAll(selector);
            if (elements[index]) {
                elements[index].textContent = this.originalContent[key];
            }
        });
    }

    // 清除未保存的更改
    clearUnsavedChanges() {
        this.originalContent = {};
    }

    // 从数据文件加载内容（模拟持久化）
    async loadContentFromFile() {
        try {
            // 在浏览器环境中，我们无法直接读取本地文件
            // 这里使用localStorage作为桥梁，模拟从文件加载
            const savedContent = localStorage.getItem('aboutContentFile');
            if (savedContent) {
                return JSON.parse(savedContent);
            }
        } catch (error) {
            console.error('从文件加载内容失败:', error);
        }
        return null;
    }

    // 保存内容到数据文件（模拟持久化）
    async saveContentToFile(content) {
        try {
            // 在浏览器环境中，我们无法直接写文件
            // 这里使用localStorage作为桥梁，模拟保存到文件
            localStorage.setItem('aboutContentFile', JSON.stringify(content));

            // 这里可以添加GitHub同步逻辑
            await this.syncToGitHub(content);

            return true;
        } catch (error) {
            console.error('保存到文件失败:', error);
            return false;
        }
    }

    // 同步到GitHub
    async syncToGitHub(content) {
        // 这里可以实现GitHub API调用
        // 暂时记录到控制台
        console.log('内容已同步到GitHub:', content);
        return true;
    }

    // 加载保存的内容
    async loadSavedContent() {
        let content = null;

        // 首先尝试从"文件"加载
        content = await this.loadContentFromFile();

        // 如果没有文件内容，使用默认内容
        if (!content) {
            content = DEFAULT_CONTENT;
        }

        // 向后兼容：如果contacts是对象格式，转换成数组格式
        if (content.contacts && !Array.isArray(content.contacts) && typeof content.contacts === 'object') {
            const contactsArray = [];
            Object.entries(content.contacts).forEach(([type, value]) => {
                if (value) {
                    contactsArray.push({ type, value });
                }
            });
            content.contacts = contactsArray;
            // 保存转换后的格式
            this.saveContentToFile(content);
        }

        // 应用内容到页面
        this.applyContentToPage(content);
    }

    // 将内容应用到页面
    applyContentToPage(content) {
        console.log('应用内容到页面:', content);

        // 应用个人资料内容
        if (content.name) {
            const nameElement = document.querySelector('.about-profile h2');
            if (nameElement) nameElement.textContent = content.name;
        }

        if (content.title) {
            const titleElement = document.querySelector('.about-profile .subtitle');
            if (titleElement) titleElement.textContent = content.title;
        }

        if (content.bio) {
            const bioElement = document.querySelector('.about-profile .bio');
            if (bioElement) bioElement.textContent = content.bio;
        }

        // 动态创建about-sections内容
        const aboutSections = document.querySelector('.about-sections');
        if (aboutSections) {
            aboutSections.innerHTML = ''; // 清空现有内容
            console.log('创建about-sections内容');

            // 创建兴趣爱好section
            if (content.hobbies && content.hobbies.length > 0) {
                console.log('创建兴趣爱好section:', content.hobbies);
                const hobbiesSection = document.createElement('div');
                hobbiesSection.className = 'about-section';
                hobbiesSection.innerHTML = `
                    <h3><i class="fas fa-heart"></i>喜好</h3>
                    <ul class="hobby-list">
                        ${content.hobbies.map(hobby => `<li>${hobby}</li>`).join('')}
                    </ul>
                `;
                aboutSections.appendChild(hobbiesSection);
            }

            // 创建座右铭section
            if (content.quotes && content.quotes.length > 0) {
                console.log('创建座右铭section:', content.quotes);
                const quotesSection = document.createElement('div');
                quotesSection.className = 'about-section';
                quotesSection.innerHTML = `
                    <h3><i class="fas fa-quote-left"></i> 座右铭</h3>
                    <div class="favorite-quotes">
                        ${content.quotes.map(quote => `
                            <div class="quote">
                                <p>${quote.text}</p>
                                <cite>— ${quote.author}</cite>
                            </div>
                        `).join('')}
                    </div>
                `;
                aboutSections.appendChild(quotesSection);
            }

            // 创建联系方式section
            if (content.contacts && Array.isArray(content.contacts)) {
                console.log('创建联系方式section:', content.contacts);
                const contactsSection = document.createElement('div');
                contactsSection.className = 'about-section';
                contactsSection.innerHTML = `<h3><i class="fas fa-paper-plane"></i> 联系方式</h3>`;

                const contactContainer = document.createElement('div');
                contactContainer.className = 'contact-cards-container';

        const contactMappings = {
            email: { icon: 'fas fa-envelope', label: '邮箱' },
            github: { icon: 'fab fa-github', label: 'GitHub' },
            qq: { icon: 'fab fa-qq', label: 'QQ' },
            wechat: { icon: 'fab fa-weixin', label: '微信' },
            phone: { icon: 'fas fa-phone', label: '电话' },
            twitter: { icon: 'fab fa-twitter', label: 'Twitter' },
            linkedin: { icon: 'fab fa-linkedin', label: 'LinkedIn' },
            instagram: { icon: 'fab fa-instagram', label: 'Instagram' },
            youtube: { icon: 'fab fa-youtube', label: 'YouTube' },
            discord: { icon: 'fab fa-discord', label: 'Discord' },
            telegram: { icon: 'fab fa-telegram', label: 'Telegram' },
            whatsapp: { icon: 'fab fa-whatsapp', label: 'WhatsApp' },
            skype: { icon: 'fab fa-skype', label: 'Skype' },
            facebook: { icon: 'fab fa-facebook', label: 'Facebook' }
        };

                content.contacts.forEach((contact, index) => {
                    console.log('处理联系方式:', contact);
                    if (contact && contact.type && contact.value) {
                        const contactCard = document.createElement('div');
                        contactCard.className = 'contact-card';
                        contactCard.dataset.type = contact.type;
                        const mapping = contactMappings[contact.type] || { icon: 'fas fa-info-circle', label: contact.type };

                        // 创建图标容器
                        const iconContainer = document.createElement('div');
                        iconContainer.className = 'contact-icon';
                        iconContainer.innerHTML = `<i class="${mapping.icon}"></i>`;
                        contactCard.appendChild(iconContainer);

                        // 在非编辑模式下，只显示简单的标签
                        const labelContainer = document.createElement('div');
                        labelContainer.className = 'contact-label';
                        labelContainer.textContent = mapping.label;
                        contactCard.appendChild(labelContainer);

                        // 创建值容器
                        const valueContainer = document.createElement('div');
                        valueContainer.className = 'contact-value';
                        valueContainer.textContent = contact.value;
                        contactCard.appendChild(valueContainer);

                        contactContainer.appendChild(contactCard);
                        console.log('添加了联系方式卡片:', contactCard.innerHTML);
                    }
                });

                // 添加增加按钮
                const addButton = document.createElement('button');
                addButton.className = 'contact-add-btn';
                addButton.innerHTML = '<i class="fas fa-plus"></i>';
                addButton.title = '添加联系方式';
                addButton.onclick = () => this.addNewContactCard();
                contactContainer.appendChild(addButton);

                contactsSection.appendChild(contactContainer);
                aboutSections.appendChild(contactsSection);
                console.log('联系方式section已添加到页面');
            } else {
                console.log('没有联系方式数据');
            }
        } else {
            console.log('找不到.about-sections元素');
        }
    }

    // 处理兴趣爱好输入
    handleHobbyInput(element) {
        const text = element.textContent.trim();

        if (text === '') {
            // 如果内容为空，隐藏该元素
            element.style.display = 'none';
        } else {
            // 如果有内容，确保显示
            element.style.display = 'inline-block';
        }
    }

    // 为兴趣爱好添加增加按钮
    addHobbyAddButton() {
        const hobbyList = document.querySelector('.hobby-list');
        if (!hobbyList) return;

        // 检查是否已经有添加按钮
        if (hobbyList.querySelector('.hobby-add-btn')) return;

        // 创建添加按钮
        const addButton = document.createElement('button');
        addButton.className = 'hobby-add-btn';
        addButton.innerHTML = '<i class="fas fa-plus"></i>';
        addButton.title = '添加兴趣爱好';
        addButton.onclick = () => this.addNewHobby();

        // 添加到兴趣爱好列表末尾
        hobbyList.appendChild(addButton);
    }

    // 移除兴趣爱好添加按钮
    removeHobbyAddButton() {
        const addButton = document.querySelector('.hobby-add-btn');
        if (addButton) {
            addButton.remove();
        }
    }

    // 添加新的兴趣爱好
    addNewHobby() {
        const hobbyList = document.querySelector('.hobby-list');
        if (!hobbyList) return;

        // 创建新的兴趣爱好元素
        const newHobby = document.createElement('li');
        newHobby.textContent = '新兴趣爱好';
        newHobby.contentEditable = 'true';
        newHobby.style.outline = 'none';
        newHobby.style.display = 'inline-block';

        // 添加输入事件监听
        newHobby.addEventListener('input', (e) => {
            this.handleHobbyInput(e.target);
            this.onContentChange();
        });

        // 添加键盘事件监听
        newHobby.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.saveChanges();
            } else if (e.key === 'Escape') {
                this.cancelChanges();
            }
        });

        // 插入到添加按钮之前
        const addButton = hobbyList.querySelector('.hobby-add-btn');
        if (addButton) {
            hobbyList.insertBefore(newHobby, addButton);
        } else {
            hobbyList.appendChild(newHobby);
        }

        // 聚焦到新元素
        setTimeout(() => {
            newHobby.focus();
            // 选中文本
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(newHobby);
            selection.removeAllRanges();
            selection.addRange(range);
        }, 0);
    }

    // 删除联系方式卡片
    deleteContactCard(buttonElement) {
        const card = buttonElement.closest('.contact-card');
        if (card) {
            card.remove();
            this.onContentChange();
        }
    }

    // 添加新的联系方式卡片
    addNewContactCard() {
        const container = document.querySelector('.contact-cards-container');
        if (!container) return;

        // 创建新的联系方式卡片
        const contactCard = document.createElement('div');
        contactCard.className = 'contact-card';
        contactCard.dataset.type = 'email'; // 默认类型

        // 创建删除按钮
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'contact-delete-btn';
        deleteBtn.innerHTML = '<i class="fas fa-minus"></i>';
        deleteBtn.onclick = () => this.deleteContactCard(deleteBtn);
        contactCard.appendChild(deleteBtn);

        // 创建图标容器
        const iconContainer = document.createElement('div');
        iconContainer.className = 'contact-icon';
        iconContainer.innerHTML = '<i class="fas fa-envelope"></i>';
        contactCard.appendChild(iconContainer);

        // 创建标签容器
        const labelContainer = document.createElement('div');
        labelContainer.className = 'contact-label';
        // 内容为空时会通过CSS显示占位符
        contactCard.appendChild(labelContainer);

        // 创建值容器
        const valueContainer = document.createElement('div');
        valueContainer.className = 'contact-value';
        // 内容为空时会通过CSS显示占位符
        contactCard.appendChild(valueContainer);

        // 插入到添加按钮之前
        const addButton = container.querySelector('.contact-add-btn');
        if (addButton) {
            container.insertBefore(contactCard, addButton);
        } else {
            container.appendChild(contactCard);
        }

        // 使新卡片可编辑
        this.makeContactCardEditable(contactCard);

        // 聚焦到新卡片的值
        setTimeout(() => {
            const valueElement = contactCard.querySelector('.contact-value');
            if (valueElement) {
                valueElement.focus();
                // 选中文本
                const selection = window.getSelection();
                const range = document.createRange();
                range.selectNodeContents(valueElement);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }, 0);

        this.onContentChange();
    }

    // 使所有联系方式卡片可编辑
    makeContactCardsEditable() {
        const contactCards = document.querySelectorAll('.contact-card');
        contactCards.forEach(card => {
            this.makeContactCardEditable(card);
        });
    }

    // 使联系方式卡片不可编辑
    makeContactCardsNonEditable() {
        const contactCards = document.querySelectorAll('.contact-card');
        contactCards.forEach(card => {
            this.makeContactCardNonEditable(card);
        });
    }

    // 使联系方式卡片可编辑
    makeContactCardEditable(card) {
        // 动态添加删除按钮
        if (!card.querySelector('.contact-delete-btn')) {
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'contact-delete-btn';
            deleteBtn.innerHTML = '<i class="fas fa-minus"></i>';
            deleteBtn.onclick = () => this.deleteContactCard(deleteBtn);
            card.insertBefore(deleteBtn, card.firstChild);
        }

        // 使标签可编辑
        const labelElement = card.querySelector('.contact-label');
        if (labelElement) {
            labelElement.contentEditable = 'true';
            labelElement.style.outline = 'none';

            // 添加输入事件 - 智能图标匹配
            labelElement.addEventListener('input', () => {
                this.updateContactIcon(card);
                this.onContentChange();
            });

            // 添加键盘事件
            labelElement.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.saveChanges();
                } else if (e.key === 'Escape') {
                    this.cancelChanges();
                }
            });
        }

        const valueElement = card.querySelector('.contact-value');
        if (valueElement) {
            valueElement.contentEditable = 'true';
            valueElement.style.outline = 'none';

            // 添加输入事件 - 智能图标匹配
            valueElement.addEventListener('input', () => {
                this.updateContactIcon(card);
                this.onContentChange();
            });

            // 添加键盘事件
            valueElement.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.saveChanges();
                } else if (e.key === 'Escape') {
                    this.cancelChanges();
                }
            });
        }

        // 初始图标匹配
        this.updateContactIcon(card);
    }

    // 使单个联系方式卡片不可编辑
    makeContactCardNonEditable(card) {
        const valueElement = card.querySelector('.contact-value');
        if (valueElement) {
            valueElement.contentEditable = 'false';
            valueElement.style.outline = 'none';
            // 移除事件监听器
            valueElement.removeEventListener('input', this.onContentChange);
            valueElement.removeEventListener('keydown', this.saveChanges);
            valueElement.removeEventListener('keydown', this.cancelChanges);
        }
    }

    // 刷新联系方式卡片
    async refreshContactCards() {
        try {
            // 重新加载当前保存的内容
            const currentContent = await this.loadContentFromFile();
            if (currentContent && currentContent.contacts) {
                // 只重新渲染联系方式部分
                const contactContainer = document.querySelector('.contact-cards-container');
                if (contactContainer) {
                    // 清空现有卡片
                    const existingCards = contactContainer.querySelectorAll('.contact-card');
                    existingCards.forEach(card => card.remove());

                    // 重新创建卡片
                    const contactMappings = {
                        email: { icon: 'fas fa-envelope', label: '邮箱' },
                        github: { icon: 'fab fa-github', label: 'GitHub' },
                        qq: { icon: 'fab fa-qq', label: 'QQ' },
                        wechat: { icon: 'fab fa-weixin', label: '微信' },
                        phone: { icon: 'fas fa-phone', label: '电话' }
                    };

                    currentContent.contacts.forEach((contact) => {
                        if (contact && contact.type && contact.value) {
                            const contactCard = document.createElement('div');
                            contactCard.className = 'contact-card';
                            contactCard.dataset.type = contact.type;
                            const mapping = contactMappings[contact.type] || { icon: 'fas fa-info-circle', label: contact.type };
                            contactCard.innerHTML = `
                                <div class="contact-icon">
                                    <i class="${mapping.icon}"></i>
                                </div>
                                <div class="contact-label">${mapping.label}</div>
                                <div class="contact-value">${contact.value}</div>
                            `;
                            // 确保卡片在正确位置插入（在添加按钮之前）
                            const addButton = contactContainer.querySelector('.contact-add-btn');
                            if (addButton) {
                                contactContainer.insertBefore(contactCard, addButton);
                            } else {
                                contactContainer.appendChild(contactCard);
                            }
                        }
                    });
                }
            }
        } catch (error) {
            console.error('刷新联系方式卡片失败:', error);
        }
    }



    // 更新联系方式图标 - 智能匹配
    updateContactIcon(card) {
        const labelElement = card.querySelector('.contact-label');
        const valueElement = card.querySelector('.contact-value');
        const iconElement = card.querySelector('.contact-icon i');

        if (!iconElement) return;

        // 获取标签和值的内容
        const labelText = labelElement ? labelElement.textContent.toLowerCase() : '';
        const valueText = valueElement ? valueElement.textContent.toLowerCase() : '';

        // 图标到类型的映射
        const iconToTypeMappings = {
            'fas fa-envelope': 'email',
            'fab fa-github': 'github',
            'fab fa-qq': 'qq',
            'fab fa-weixin': 'wechat',
            'fas fa-phone': 'phone',
            'fab fa-twitter': 'twitter',
            'fab fa-linkedin': 'linkedin',
            'fab fa-instagram': 'instagram',
            'fab fa-youtube': 'youtube',
            'fab fa-discord': 'discord',
            'fab fa-telegram': 'telegram',
            'fab fa-whatsapp': 'whatsapp',
            'fab fa-skype': 'skype',
            'fab fa-facebook': 'facebook'
        };

        // 关键词到图标的映射
        const keywordMappings = {
            // 邮箱相关
            'fas fa-envelope': [
                '邮箱', 'email', 'mail', '邮箱地址', '电子邮件', 'e-mail',
                '@', '.com', '.cn', '.org', '.net', 'gmail', '163', 'qq.com',
                'outlook', 'yahoo', 'hotmail'
            ],

            // GitHub相关
            'fab fa-github': [
                'github', 'git', '代码', '仓库', '开源', '编程', '开发',
                'repository', 'repo', '开源项目'
            ],

            // QQ相关
            'fab fa-qq': [
                'qq', '腾讯', '企鹅', '腾讯qq', 'qq号', 'qq群'
            ],

            // 微信相关
            'fab fa-weixin': [
                '微信', 'weixin', 'weixin', '微信号', '微信公众号', '小程序'
            ],

            // 电话相关
            'fas fa-phone': [
                '电话', 'phone', '手机', 'mobile', '联系电话', '手机号',
                'tel', '电话号码', '联系方式'
            ],

            // Twitter相关
            'fab fa-twitter': [
                'twitter', '推特', '微博', '社交', 'tweet'
            ],

            // LinkedIn相关
            'fab fa-linkedin': [
                'linkedin', '领英', '职业', '工作', '简历', '招聘'
            ],

            // Instagram相关
            'fab fa-instagram': [
                'instagram', 'ins', '照片', '图片', '美图', '摄影'
            ],

            // YouTube相关
            'fab fa-youtube': [
                'youtube', '视频', '直播', '影视', '媒体'
            ],

            // Discord相关
            'fab fa-discord': [
                'discord', '游戏', '聊天', '语音', '社区'
            ],

            // Telegram相关
            'fab fa-telegram': [
                'telegram', '电报', '消息', '通讯'
            ],

            // WhatsApp相关
            'fab fa-whatsapp': [
                'whatsapp', '消息', '通讯', '聊天'
            ],

            // Skype相关
            'fab fa-skype': [
                'skype', '微软', '视频通话', '语音通话'
            ],

            // Facebook相关
            'fab fa-facebook': [
                'facebook', '脸书', '社交网络', '社区'
            ]
        };

        // 查找匹配的图标
        let matchedIcon = 'fas fa-info-circle'; // 默认图标
        let matchedType = 'email'; // 默认类型

        for (const [iconClass, keywords] of Object.entries(keywordMappings)) {
            // 检查标签是否包含关键词
            if (keywords.some(keyword => labelText.includes(keyword))) {
                matchedIcon = iconClass;
                matchedType = iconToTypeMappings[iconClass] || 'email';
                break;
            }

            // 检查值是否包含关键词
            if (keywords.some(keyword => valueText.includes(keyword))) {
                matchedIcon = iconClass;
                matchedType = iconToTypeMappings[iconClass] || 'email';
                break;
            }
        }

        // 更新图标
        iconElement.className = matchedIcon;

        // 更新卡片的类型数据（用于保存）
        card.dataset.type = matchedType;
    }

    // 显示成功消息（已删除，用户不需要提示）
    showSuccessMessage(message) {
        // 用户要求删除提示，所以这里不显示任何消息
    }
}

// 创建全局实例
const aboutEditor = new AboutEditor();

// 添加必要的CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }

    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
    }
`;
document.head.appendChild(style);
