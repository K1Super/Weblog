# GitHub存储设置指南

## 概述
为了实现真正的持久化存储（让其他访问者也能看到编辑后的内容），需要设置GitHub API集成。

## 步骤1: 创建GitHub Personal Access Token
1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token (classic)"
3. 选择权限：
   - `repo` - 完全访问私有仓库
   - `gist` - 创建和修改Gist
4. 生成并复制token

## 步骤2: 创建GitHub Gist

### 方法1: 手动创建
1. 访问 https://gist.github.com
2. 创建新Gist，文件名设为 `about-content.json`
3. 复制 `gist-data.json` 文件中的content内容
4. 保存Gist并复制Gist ID（URL中的ID部分）

### 方法2: 使用命令行（推荐）
1. 首先获取你的GitHub Personal Access Token
2. 运行以下命令（将 `YOUR_TOKEN_HERE` 替换为你的实际token）：

```bash
curl -X POST -H "Authorization: token YOUR_TOKEN_HERE" -H "Content-Type: application/json" -d @gist-data.json https://api.github.com/gists
```

3. 从响应中复制Gist ID

## 步骤3: 配置应用

### 方法1: 使用环境变量（推荐，安全）
1. 复制 `.env.example` 为 `.env`：
```bash
cp .env.example .env
```

2. 编辑 `.env` 文件，填入你的实际配置：
```
GITHUB_TOKEN=ghp_your_actual_token_here
GIST_ID=your_actual_gist_id_here
```

3. 确保 `.env` 文件在 `.gitignore` 中（已自动包含）

### 方法2: 直接在代码中配置（不推荐，仅用于测试）
编辑 `js/config/app-config.js` 文件：

```javascript
github: {
    token: '你的GitHub_token_这里', // ⚠️ 注意：生产环境不要提交真实token
    gistId: '你的Gist_ID_这里', // 替换为你的实际Gist ID
    filename: 'about-content.json'
}
```

## 步骤4: 部署到服务器
由于GitHub API有CORS限制，需要将网站部署到服务器上才能正常工作。

推荐部署方式：
- GitHub Pages
- Vercel
- Netlify

## 替代方案：使用服务器端存储
如果不想使用GitHub，可以设置一个简单的后端服务：

1. 创建一个简单的Express.js服务器
2. 提供API端点来保存和加载数据
3. 修改前端代码调用这些API

## 重要提醒
- 永远不要将GitHub token提交到代码仓库
- 定期轮换token以确保安全
- 考虑token的权限范围

## 当前状态
目前应用使用localStorage作为临时存储。设置GitHub集成后，所有编辑的内容将被保存到GitHub，所有访问者都能看到最新的内容。
