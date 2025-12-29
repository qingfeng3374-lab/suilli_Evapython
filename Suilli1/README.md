# Suilli - Python代码评测平台

<div align="center">

![Suilli Logo](https://img.shields.io/badge/Suilli-Python%20Learning%20Platform-blue?style=for-the-badge&logo=python)
![Flask](https://img.shields.io/badge/Flask-2.3.3-green?style=flat-square&logo=flask)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange?style=flat-square&logo=mysql)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

一个功能完整的在线Python编程学习平台，提供实时代码评测和交互式学习体验。

[English](README.md) | 简体中文

</div>

## ✨ 项目特色

- 🚀 **实时代码评测**: 集成Monaco Editor，支持Python代码实时编译和测试
- 📚 **丰富题库**: 提供多种难度级别的编程题目，从入门到进阶
- 👥 **社区论坛**: 内置论坛系统，促进学习交流和经验分享
- 🎨 **现代化UI**: 支持明暗主题切换，响应式设计，适配各种设备
- 🔐 **安全可靠**: 用户认证、会话管理、代码执行沙箱保护

## 📋 目录

- [项目特色](#-项目特色)
- [技术栈](#-技术栈)
- [功能特性](#-功能特性)
- [快速开始](#-快速开始)
- [项目结构](#-项目结构)
- [界面预览](#-界面预览)
- [API文档](#-api文档)
- [部署指南](#-部署指南)
- [贡献指南](#-贡献指南)
- [许可证](#-许可证)
- [致谢](#-致谢)

## 🛠️ 技术栈

### 后端
- **框架**: Flask 2.3+
- **数据库**: MySQL 8.0 + SQLAlchemy
- **认证**: Flask-Session
- **迁移**: Flask-Migrate

### 前端
- **UI框架**: Tailwind CSS
- **编辑器**: Monaco Editor (VS Code编辑器)
- **图标**: Font Awesome 6
- **图表**: Chart.js
- **交互**: 原生JavaScript

### 开发工具
- **版本控制**: Git
- **包管理**: pip
- **代码质量**: ESLint, Prettier

## 📋 功能特性

### 🎯 核心功能
- ✅ 用户注册/登录/登出系统
- ✅ 个人信息管理
- ✅ 在线代码编辑器 (Monaco Editor)
- ✅ 实时代码评测 (15秒超时保护)
- ✅ 编程题目系统 (3道题目)
- ✅ 论坛发帖和回复功能
- ✅ 明暗主题切换
- ✅ 响应式设计 (移动端适配)

### 📖 编程题目
- **简单**: 输出问候语 "hello, suilli!"
- **中等**: 斐波那契数列计算
- **困难**: 质数判断算法

## 🚀 快速开始

### 环境要求
- Python 3.8+
- MySQL 8.0+
- pip (Python包管理器)
- Git

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/your-username/suilli.git
cd suilli
```

2. **创建虚拟环境 (推荐)**
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate
```

3. **安装Python依赖**
```bash
pip install -r requirements.txt
```

4. **配置数据库**
```sql
-- 创建数据库
CREATE DATABASE `mysql-2try` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 创建用户 (可选，推荐使用专用用户)
CREATE USER 'suilli'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON `mysql-2try`.* TO 'suilli'@'localhost';
FLUSH PRIVILEGES;
```

5. **修改数据库配置**

编辑 `app.py` 中的数据库连接信息：

```python
# 数据库配置
HOSTNAME = "127.0.0.1"
PORT = 3306
USERNAME = "root"  # 或你创建的专用用户
PASSWORD = 'your_password'  # 你的数据库密码
DATABASE = 'mysql-2try'
```

6. **初始化数据库**
```bash
# 运行应用，Flask-Migrate会自动创建表结构
python app.py
```

7. **访问应用**

打开浏览器访问: `http://localhost:2026`

## 📁 项目结构

```
suilli/
├── app.py                 # 主应用文件 (Flask应用核心)
├── requirements.txt       # Python依赖包列表
├── static/                # 静态资源目录
│   ├── css/              # CSS样式文件
│   │   ├── base.css      # 基础样式
│   │   ├── base1.css     # 备用基础样式
│   │   ├── login.css     # 登录页面样式
│   │   └── regist.css    # 注册页面样式
│   └── js/               # JavaScript文件
│       ├── base.js       # 基础交互脚本
│       ├── base1.js      # 备用基础脚本
│       ├── index.js      # 首页编辑器脚本
│       ├── login.js      # 登录页面脚本
│       ├── problem_index.js  # 题库页面脚本
│       ├── regist.js     # 注册页面脚本
│       └── suilli_j.js   # 其他脚本
├── templates/            # HTML模板目录
│   ├── base.html         # 基础模板 (登录后页面)
│   ├── base1.html        # 备用基础模板 (游客页面)
│   ├── index.html        # 用户首页
│   ├── login.html        # 登录页面
│   ├── regist.html       # 注册页面
│   ├── problem_index.html    # 题库页面
│   ├── problem_editor.html   # 代码编辑器页面
│   ├── forum.html        # 论坛页面
│   ├── new_post.html     # 发帖页面
│   ├── post.html         # 帖子详情页面
│   ├── dashboard.html    # 个人信息页面
│   ├── first.html        # 游客首页
│   └── suilli_j.html     # 其他页面
└── README.md            # 项目说明文档
```

## 🎨 界面预览

### 主要页面
- **首页**: 平台介绍和功能展示，包含代码示例
- **题库**: 编程题目列表，支持难度和关键词筛选
- **编辑器**: Monaco代码编辑器，实时评测结果显示
- **论坛**: 社区讨论，帖子列表和回复功能
- **个人中心**: 用户信息展示和管理

### 设计特色
- 现代化Material Design风格
- 流畅的动画和过渡效果
- 明暗主题无缝切换
- 完全响应式，完美适配各种屏幕尺寸

## 🔌 API文档

### 用户相关API
- `GET /` - 游客首页
- `GET /login` - 登录页面
- `POST /login` - 用户登录
- `GET /regist` - 注册页面
- `GET /registuser` - 用户注册
- `GET /logout` - 用户登出

### 题库相关API
- `GET /problem_index/<username>/<user_id>` - 题库首页
- `GET /problem_editor/<username>/<user_id>/<problem_id>` - 题目编辑器
- `POST /evaluate` - 代码评测接口

### 论坛相关API
- `GET /forum` - 论坛首页
- `GET /post/<post_id>` - 查看帖子详情
- `GET/POST /new_post` - 发布新帖子

## 🚀 部署指南

### 开发环境部署
按照"快速开始"部分的步骤即可。

### 生产环境部署

1. **使用生产WSGI服务器**
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:2026 app:app
```

2. **使用Nginx反向代理** (推荐)
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:2026;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

3. **使用Docker部署**
```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 2026

CMD ["python", "app.py"]
```

## 🤝 贡献指南

欢迎提交Issue和Pull Request来改进这个项目！

### 开发流程

1. **Fork本项目**
2. **创建特性分支**
```bash
git checkout -b feature/AmazingFeature
```
3. **提交更改**
```bash
git commit -m 'Add some AmazingFeature'
```
4. **推送到分支**
```bash
git push origin feature/AmazingFeature
```
5. **创建Pull Request**

### 代码规范

- 遵循PEP 8 Python编码规范
- 使用有意义的变量和函数名
- 添加适当的注释和文档字符串
- 确保代码经过测试

### 提交规范

提交信息格式: `type(scope): description`

- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建工具或辅助工具的变动

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

### 核心依赖
- [Flask](https://flask.palletsprojects.com/) - 轻量级WSGI Web应用框架
- [SQLAlchemy](https://www.sqlalchemy.org/) - Python SQL工具包和ORM
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - VS Code的代码编辑器
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的CSS框架

### UI资源
- [Font Awesome](https://fontawesome.com/) - 矢量图标库
- [Chart.js](https://www.chartjs.org/) - 简单而灵活的图表库

### 开发工具
- [PyMySQL](https://pymysql.readthedocs.io/) - MySQL数据库连接器
- [Flask-Migrate](https://flask-migrate.readthedocs.io/) - SQLAlchemy数据库迁移

## 📞 联系方式

- **项目维护者**: [Your Name]
- **邮箱**: your-email@example.com
- **GitHub**: [your-username](https://github.com/your-username)
- **项目地址**: [https://github.com/your-username/suilli](https://github.com/your-username/suilli)

## 📊 项目统计

![GitHub stars](https://img.shields.io/github/stars/your-username/suilli?style=social)
![GitHub forks](https://img.shields.io/github/forks/your-username/suilli?style=social)
![GitHub issues](https://img.shields.io/github/issues/your-username/suilli?style=social)

---

<div align="center">

**如果这个项目对你有帮助，请给它一个 ⭐ Star！**

Made with ❤️ by [Your Name]

</div>
