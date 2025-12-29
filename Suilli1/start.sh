#!/bin/bash
# Railway启动脚本

# 安装Python依赖
pip install -r requirements.txt

# 设置环境变量
export FLASK_APP=app.py
export FLASK_ENV=production
export FLASK_DEBUG=False

# 启动Flask应用
python app.py
