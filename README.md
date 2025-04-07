# CloudPass - 基于 Cloudflare 的密码管理系统

CloudPass 是一个基于 Cloudflare 平台的密码管理系统，参考 Bitwarden 的界面设计，提供安全的密码存储和管理功能。

## 功能特点

- 密码安全存储和管理
- 支持筛选和搜索功能
- 一键复制账户名或密码
- 自定义图标和标签
- 使用 Cloudflare R2 存储图片和元数据
- 安全的加密方式保护密码数据
- 支持从 GitHub 自动部署

## 项目结构

项目分为前端和后端两部分：

- 前端：使用 React 框架，部署在 Cloudflare Pages
- 后端：使用 Cloudflare Workers，结合 R2 存储桶和 KV 存储

## 开发环境设置

### 前提条件

- Node.js 16+
- npm 或 yarn
- Cloudflare 账户
- Wrangler CLI

### 安装依赖

```bash
# 安装 Wrangler CLI
npm install -g wrangler

# 克隆仓库
git clone https://github.com/yourusername/cloudpass.git
cd cloudpass

# 安装后端依赖
cd cloudpass-api
npm install

# 安装前端依赖
cd ../cloudpass-frontend
npm install