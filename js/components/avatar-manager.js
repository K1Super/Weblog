// 头像管理器
class AvatarManager {
    constructor() {
        this.cloudinaryConfig = {
            cloudName: 'dpvu9repz',
            apiKey: '898791631761337',
            apiSecret: 'njQ_jJWMJWuYdzktlxtv1RWVuO8'
        };
        this.currentAvatar = this.getCurrentAvatar();
    }

    // 获取当前头像URL（从aboutEditor获取）
    getCurrentAvatar() {
        // 优先从aboutEditor的当前内容获取
        if (window.aboutEditor && window.aboutEditor.currentContent && window.aboutEditor.currentContent.avatar) {
            return window.aboutEditor.currentContent.avatar;
        }

        // 降级到环境变量
        return window.DEFAULT_AVATAR ||
               'https://ui-avatars.com/api/?name=KLord&size=160&background=4A90E2&color=fff&format=png';
    }

    // 设置头像URL（通过aboutEditor保存到GitHub）
    async setAvatar(url) {
        this.currentAvatar = url;
        this.updateAllAvatars();

        // 通过aboutEditor保存到GitHub（不使用localStorage）
        if (window.aboutEditor) {
            try {
                // 更新aboutEditor的当前内容
                if (!window.aboutEditor.currentContent) {
                    window.aboutEditor.currentContent = {};
                }
                window.aboutEditor.currentContent.avatar = url;

                // 保存到GitHub（这会触发GitHub同步）
                await window.aboutEditor.saveContentToFile(window.aboutEditor.currentContent);
                console.log('头像已保存到GitHub，所有访问者都能看到新的头像');
            } catch (error) {
                console.error('保存头像失败:', error);
                // 如果GitHub保存失败，至少保证UI显示正确
            }
        } else {
            console.warn('aboutEditor未初始化，无法保存头像');
        }
    }

    // 更新所有页面上的头像
    updateAllAvatars() {
        console.log('更新头像:', this.currentAvatar);

        // 更新登录页头像
        const loginAvatar = document.querySelector('.login-avatar');
        if (loginAvatar) {
            loginAvatar.src = this.currentAvatar;
            console.log('已更新登录页头像');
        }

        // 更新导航栏头像 - 修正选择器
        let navAvatar = document.querySelector('#navAvatar');
        if (!navAvatar) {
            navAvatar = document.querySelector('.profile-section .avatar');
        }
        if (!navAvatar) {
            navAvatar = document.querySelector('.profile-section img');
        }
        if (navAvatar) {
            navAvatar.src = this.currentAvatar;
            console.log('已更新导航栏头像');
        }

        // 更新关于我页面头像
        const aboutAvatar = document.querySelector('.about-content .profile-image img');
        if (aboutAvatar) {
            aboutAvatar.src = this.currentAvatar;
            console.log('已更新关于页面头像');
        }

        // 如果导航栏还没有渲染，延迟再次尝试更新
        if (!navAvatar) {
            console.log('导航栏头像未找到，延迟重试');
            setTimeout(() => {
                this.updateAllAvatars();
            }, 500);
        }
    }

    // 上传头像到Cloudinary
    async uploadAvatar(file) {
        // 生成时间戳
        const timestamp = Math.round(new Date().getTime() / 1000);

        // 准备所有上传参数（用于签名）
        const uploadParams = {
            folder: 'weblog_avatars',
            timestamp: timestamp
        };

        // 生成签名
        const signature = this.generateSignature(uploadParams);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('api_key', this.cloudinaryConfig.apiKey);
        formData.append('timestamp', timestamp.toString());
        formData.append('signature', signature);
        formData.append('folder', 'weblog_avatars');

        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/${this.cloudinaryConfig.cloudName}/image/upload`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error('Response status:', response.status);
                console.error('Response data:', errorData);
                throw new Error(`Upload failed: ${response.status} - ${errorData}`);
            }

            const data = await response.json();
            return data.secure_url;
        } catch (error) {
            console.error('Avatar upload failed:', error);
            throw error;
        }
    }

    // 生成Cloudinary签名
    generateSignature(params) {
        if (!window.CryptoJS) {
            throw new Error('CryptoJS not available for signature generation');
        }

        // 构建签名字符串 - Cloudinary规则：参数按key排序，最后直接加API secret
        let signatureString = '';
        const sortedKeys = Object.keys(params).sort();

        sortedKeys.forEach(key => {
            if (params[key] !== null && params[key] !== undefined) {
                signatureString += `${key}=${params[key]}&`;
            }
        });

        // 移除最后一个&并直接加API secret
        if (signatureString.endsWith('&')) {
            signatureString = signatureString.slice(0, -1);
        }
        signatureString += this.cloudinaryConfig.apiSecret;

        // 使用SHA-1生成签名
        const hash = window.CryptoJS.SHA1(signatureString).toString();
        return hash;
    }

    // 初始化头像编辑功能
    initAvatarEditor() {
        const aboutSection = document.getElementById('about');
        if (!aboutSection) return;

        // 创建头像编辑容器
        const profileImageContainer = aboutSection.querySelector('.profile-image');
        if (!profileImageContainer) return;

        // 添加编辑覆盖层
        const editOverlay = document.createElement('div');
        editOverlay.className = 'avatar-edit-overlay';
        editOverlay.innerHTML = `
            <div class="edit-text">修改</div>
            <input type="file" id="avatarInput" accept="image/*" style="display: none;">
        `;

        profileImageContainer.style.position = 'relative';
        profileImageContainer.appendChild(editOverlay);

        // 添加悬停效果
        profileImageContainer.addEventListener('mouseenter', () => {
            editOverlay.style.opacity = '1';
        });

        profileImageContainer.addEventListener('mouseleave', () => {
            editOverlay.style.opacity = '0';
        });

        // 确保悬浮效果在上传完成后能正常工作
        const resetHoverEffect = () => {
            profileImageContainer.addEventListener('mouseenter', () => {
                editOverlay.style.opacity = '1';
            });

            profileImageContainer.addEventListener('mouseleave', () => {
                editOverlay.style.opacity = '0';
            });
        };

        // 点击编辑头像
        editOverlay.addEventListener('click', () => {
            document.getElementById('avatarInput').click();
        });

        // 文件选择处理
        document.getElementById('avatarInput').addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    // 显示加载状态
                    editOverlay.innerHTML = '<div class="edit-text">上传中...</div>';

                    // 上传到Cloudinary
                    const avatarUrl = await this.uploadAvatar(file);

                    // 更新头像
                    this.setAvatar(avatarUrl);

                    // 恢复编辑状态
                    editOverlay.innerHTML = `
                        <div class="edit-text">修改</div>
                        <input type="file" id="avatarInput" accept="image/*" style="display: none;">
                    `;
                } catch (error) {
                    console.error('Upload error details:', error);

                    let errorMessage = '头像上传失败';
                    if (error.message.includes('Invalid cloud_name')) {
                        errorMessage += '\n\n错误原因：Cloudinary Cloud Name无效\n\n请检查：\n1. 登录Cloudinary控制台 (https://cloudinary.com/console)\n2. 获取正确的Cloud Name\n3. 更新代码中的cloudName配置';
                    } else if (error.message.includes('401')) {
                        errorMessage += '\n\n错误原因：认证失败\n请检查API密钥和密钥是否正确';
                    }

                    alert(`${errorMessage}\n\n详细错误：${error.message}\n\n请查看控制台获取更多信息`);
                    console.error(error);

                    // 恢复编辑状态
                    editOverlay.innerHTML = `
                        <div class="edit-text">修改</div>
                        <input type="file" id="avatarInput" accept="image/*" style="display: none;">
                    `;
                }
            }
        });
    }

    // 初始化
    init() {
        // 延迟执行，确保环境变量已加载
        setTimeout(() => {
            // 更新所有现有头像
            this.updateAllAvatars();

            // 初始化编辑功能（只在登录状态下）
            if (sessionStorage.getItem('loginStatus') === 'true') {
                this.initAvatarEditor();
            }
        }, 100);
    }
}

// 创建全局头像管理器实例
const avatarManager = new AvatarManager();

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    avatarManager.init();
});

// 登录状态变化时重新初始化
window.addEventListener('loginStateChanged', () => {
    if (sessionStorage.getItem('loginStatus') === 'true') {
        avatarManager.initAvatarEditor();
        // 确保导航栏头像也更新
        setTimeout(() => {
            avatarManager.updateAllAvatars();
        }, 100);
    }
});

// 监听导航栏渲染事件
window.addEventListener('navigationRendered', () => {
    avatarManager.updateAllAvatars();
});
