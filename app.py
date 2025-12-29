# 导入数据库模块
import pymysql
# 导入Flask框架，这个框架可以快捷地实现了一个WSGI应用
from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import traceback
import re
import subprocess
import os
import uuid
import tempfile
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

# 传递根目录
app = Flask(__name__)
# 设置执行超时为15秒
TIMEOUT = 15
HOSTNAME = "127.0.0.1"
PORT = 3306
USERNAME = "root"
PASSWORD = 'sss3.1415926535'
DATABASE = 'mysql-2try'
app.config[
    'SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://{USERNAME}:{PASSWORD}@{HOSTNAME}:{PORT}/{DATABASE}?charset=utf8mb4"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # 关闭追踪修改，减少内存消耗
# 设置会话密钥，用于加密会话数据
app.secret_key = 'your-secret-key-here'

db = SQLAlchemy(app)
migrate = Migrate(app, db)


# 定义用户模型
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)

    def __repr__(self):
        return '<User %r>' % self.username


class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # 外键关联user表
    created_at = db.Column(db.DateTime, server_default=db.func.now())  # 使用数据库默认时间

    user = db.relationship('User', backref=db.backref('posts', lazy=True))  # 关联用户
    replies = db.relationship('Reply', backref='post', lazy=True)  # 关联回复


class Reply(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # 外键关联user表
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'), nullable=False)  # 外键关联post表
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    user = db.relationship('User', backref=db.backref('replies', lazy=True))  # 关联用户


# 定义评测问题（更新为包含模板代码）
PROBLEMS = {
    "hello_suilli": {
        "title": "输出问候语",
        "description": "编写一个Python程序，输出\"hello, suilli!\"。要求严格按照格式输出，包括大小写和标点符号。",
        # 统一接受两个参数（即使第二个参数不使用）
        "evaluate": lambda output, input_val: output.strip() == "hello, suilli!",
        "template": "print('hello, suilli!')",
        "input_data": "",  # 空输入
        "expected_output": "hello, suilli!"  # 期望输出
    },
    "fibonacci_nth": {
        "title": "斐波那契数列",
        "description": "斐波那契数列是一个经典的数学序列，其中每个数都是前两个数的和。数列定义如下：F(0) = 0; F(1) = 1; F(n) = F(n - 1) + F(n - 2) (n ≥ 2)。编写一个Python程序，计算斐波那契数列的第n项。",
        "evaluate": lambda output, input_val: output.strip() == str(fibonacci(int(input_val))),
        "template": "def fibonacci(n):\n    if n == 0:\n        return 0\n    elif n == 1:\n        return 1\n    else:\n        a, b = 0, 1\n        for _ in range(2, n + 1):\n            a, b = b, a + b\n        return b\n\nn = int(input())\nprint(fibonacci(n))",
        "input_data": "10",  # 测试输入
        "expected_output": "55"  # 斐波那契第10项是55
    },
    "prime_check": {
        "title": "质数判断",
        "description": "质数是大于1的自然数，除了1和它本身外，不能被其他自然数整除的数。编写一个Python程序，判断一个给定的数是否为质数。",
        "evaluate": lambda output, input_val: output.strip() == ("Yes" if is_prime(int(input_val)) else "No"),
        "template": "def is_prime(n):\n    if n < 2:\n        return False\n    for i in range(2, int(n**0.5) + 1):\n        if n % i == 0:\n            return False\n    return True\n\nn = int(input())\nprint('Yes' if is_prime(n) else 'No')",
        "input_data": "17",  # 测试输入（质数）
        "expected_output": "Yes"  # 期望输出
    }
}

# 添加辅助函数用于评测
def fibonacci(n):
    """计算斐波那契数列第n项"""
    if n == 0:
        return 0
    elif n == 1:
        return 1
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b

def is_prime(n):
    """判断是否为质数"""
    if n < 2:
        return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            return False
    return True


def get_problems_without_evaluate():
    new_problems = {}
    for problem_id, problem in PROBLEMS.items():
        new_problem = {
            "title": problem["title"],
            "description": problem["description"],
            "template": problem["template"]
        }
        new_problems[problem_id] = new_problem
    return new_problems


@app.route('/')
def first():
    return render_template('first.html')


@app.route('/suilli_j')
def suilli_j():
    return render_template('suilli_j.html')


@app.route('/index/<username>/<int:user_id>')
def index(username, user_id):
    # 验证会话中的用户ID与URL参数是否一致，防止篡改
    if 'user_id' not in session or session['user_id'] != user_id:
        return redirect(url_for('login'))

    # 从数据库获取用户信息（可选）
    user = User.query.get(user_id)
    if not user or user.username != username:
        return redirect(url_for('logout'))

    return render_template('index.html', user=user)


@app.route('/problem_index/<username>/<int:user_id>')
def problem_index(username, user_id):
    # 验证会话中的用户ID与URL参数是否一致，防止篡改
    if 'user_id' not in session or session['user_id'] != user_id:
        return redirect(url_for('login'))

    # 从数据库获取用户信息（可选）
    user = User.query.get(user_id)
    if not user or user.username != username:
        return redirect(url_for('logout'))

    return render_template('problem_index.html', user=user)


# 访问注册页面
@app.route('/regist')
def regist():
    return render_template('regist.html')


# 获取注册请求及处理
@app.route('/registuser', methods=['GET', 'POST'])
def get_regist_request():
    # 获取输入框内容
    username = request.args.get('user')
    password = request.args.get('password')
    password2 = request.args.get('password2')

    print(f"Password: {password}, Confirm Password: {password2}")

    if password == password2:
        try:
            # 检查用户名是否已存在
            existing_user = User.query.filter_by(username=username).first()
            if existing_user:
                return '用户名已存在'

            # 创建新用户
            new_user = User(username=username, password=password)
            db.session.add(new_user)
            db.session.commit()
            return redirect(url_for('login'))
        except Exception as e:
            traceback.print_exc()
            db.session.rollback()
            return f'注册失败: {str(e)}'
    else:
        return '两次输入密码不一致，请重新输入！'


# 用户登录
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('user')
        password = request.form.get('password')

        # 验证输入是否为空
        if not username or not password:
            return '用户名和密码不能为空！'

        try:
            # 查询用户
            user = User.query.filter_by(username=username, password=password).first()
            if user:
                # 登录成功，设置会话
                session['user_id'] = user.id
                session['username'] = user.username
                # 重定向到首页
                return redirect(url_for('index', username=user.username, user_id=user.id))
            else:
                return '用户名或密码不正确'
        except Exception as e:
            traceback.print_exc()
            return f'登录失败: {str(e)}'

    # 处理GET请求，显示登录页面
    return render_template('login.html')


# 添加首页路由
@app.route('/home')
def home():
    # 检查用户是否已登录
    if 'user_id' not in session:
        return redirect(url_for('index'))

    return render_template('index.html')


# 用户登出
@app.route('/logout')
def logout():
    # 清除会话
    session.pop('user_id', None)
    session.pop('username', None)
    return redirect(url_for('index'))


# 个人信息页面
@app.route('/dashboard')
def dashboard():
    # 检查用户是否已登录
    if 'user_id' not in session:
        return redirect(url_for('index'))

    # 从数据库获取用户信息
    user_id = session['user_id']
    user = User.query.get(user_id)

    if user:
        return render_template('dashboard.html', user=user)
    else:
        # 用户不存在，可能已被删除，强制登出
        return redirect(url_for('logout'))


# 论坛帖子列表
@app.route('/forum')
def forum():
    # 检查用户是否已登录
    if 'user_id' not in session:
        return redirect(url_for('login'))

    # 获取所有帖子并按创建时间降序排列
    posts = Post.query.order_by(Post.created_at.desc()).all()

    return render_template('forum.html', posts=posts)


# 查看帖子详情及回复
@app.route('/post/<int:post_id>', methods=['GET', 'POST'])
def view_post(post_id):
    # 检查用户是否已登录
    if 'user_id' not in session:
        return redirect(url_for('login'))

    # 获取帖子信息
    post = Post.query.get_or_404(post_id)

    # 处理回复提交
    if request.method == 'POST':
        content = request.form.get('content')
        if content:
            new_reply = Reply(
                content=content,
                user_id=session['user_id'],
                post_id=post_id
            )
            db.session.add(new_reply)
            db.session.commit()
            return redirect(url_for('view_post', post_id=post_id))

    return render_template('post.html', post=post)


# 发布新帖子页面
@app.route('/new_post', methods=['GET', 'POST'])
def new_post():
    # 检查用户是否已登录
    if 'user_id' not in session:
        return redirect(url_for('login'))

    if request.method == 'POST':
        title = request.form.get('title')
        content = request.form.get('content')

        if title and content:
            new_post = Post(
                title=title,
                content=content,
                user_id=session['user_id']
            )
            db.session.add(new_post)
            db.session.commit()
            return redirect(url_for('forum'))

    return render_template('new_post.html')



@app.route('/problem_editor/<username>/<int:user_id>/<problem_id>')
def problem_editor(username, user_id, problem_id):
    # 验证会话中的用户ID与URL参数是否一致
    if 'user_id' not in session or session['user_id'] != user_id:
        return redirect(url_for('login'))

    # 从数据库获取用户信息
    user = User.query.get(user_id)
    if not user or user.username != username:
        return redirect(url_for('logout'))

    # 获取具体的题目信息
    problem = get_problems_without_evaluate().get(problem_id)

    return render_template('problem_editor.html', user=user, problem=problem,problem_id=problem_id)


@app.route('/evaluate', methods=['POST'])
def evaluate():
    """评测用户提交的Python代码"""
    try:
        data = request.get_json()
        if data is None:
            return jsonify({
                'passed': False,
                'output': '',
                'error': '请求数据格式错误，不是有效的JSON',
                'problem': 'unknown',
                'title': '未知题目'
            }), 400

        code = data.get('code', '')
        problem_id = data.get('problem', 'hello_suilli')

        # 获取当前问题
        problem = PROBLEMS.get(problem_id)
        if not problem:
            return jsonify({
                'passed': False,
                'output': '',
                'error': f'未找到题目配置: {problem_id}',
                'problem': problem_id,
                'title': '未知题目'
            }), 404

        # 获取输入数据和期望输出
        input_data = problem.get('input_data', '')
        expected_output = problem.get('expected_output', '')

        # 创建临时文件保存代码
        file_path = None
        try:
            # 生成唯一的文件名
            file_name = f"code_{uuid.uuid4().hex}.py"
            file_path = os.path.join(tempfile.gettempdir(), file_name)

            # 写入用户代码
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(code)

            # 执行代码并捕获输出
            result = subprocess.run(
                ['python', file_path],
                input=input_data,  # 提供输入数据
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                timeout=TIMEOUT
            )

            # 清理输出（移除首尾空白）
            output = result.stdout.strip()
            error = result.stderr.strip()

            # 检查输出是否符合要求
            passed = problem['evaluate'](output, input_data) if 'input_data' in problem else problem['evaluate'](output)

            # 构建响应
            response = {
                'passed': passed,
                'output': output,
                'error': error,
                'problem': problem_id,
                'title': problem['title'],
                'input': input_data,
                'expected': expected_output
            }

        except subprocess.TimeoutExpired:
            response = {
                'passed': False,
                'output': '',
                'error': f'代码执行超时（{TIMEOUT}秒）',
                'problem': problem_id,
                'title': problem['title'],
                'input': input_data,
                'expected': expected_output
            }
        except Exception as e:
            response = {
                'passed': False,
                'output': '',
                'error': f'系统错误: {str(e)}',
                'problem': problem_id,
                'title': problem['title'],
                'input': input_data,
                'expected': expected_output
            }
        finally:
            # 清理临时文件
            if file_path and os.path.exists(file_path):
                os.remove(file_path)

        return jsonify(response)
    except Exception as e:
        return jsonify({
            'passed': False,
            'output': '',
            'error': f'服务器内部错误: {str(e)}',
            'problem': 'unknown',
            'title': '未知题目'
        }), 500

# 使用__name__ == '__main__'是 Python 的惯用法，确保直接执行此脚本时才
# 启动服务器，若其他程序调用该脚本可能父级程序会启动不同的服务器
if __name__ == '__main__':
    # Railway会自动设置PORT环境变量
    port = int(os.environ.get('PORT', 2026))
    app.run(debug=False, host='0.0.0.0', port=port)