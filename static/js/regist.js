// 密码显示/隐藏切换
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');
const togglePassword2 = document.getElementById('togglePassword2');
const password2Input = document.getElementById('password2');

togglePassword.addEventListener('click', function() {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);

    // 切换图标
    this.querySelector('i').classList.toggle('fa-eye');
    this.querySelector('i').classList.toggle('fa-eye-slash');
});

togglePassword2.addEventListener('click', function() {
    const type = password2Input.getAttribute('type') === 'password' ? 'text' : 'password';
    password2Input.setAttribute('type', type);

    // 切换图标
    this.querySelector('i').classList.toggle('fa-eye');
    this.querySelector('i').classList.toggle('fa-eye-slash');
});

// 添加页面加载动画
document.addEventListener('DOMContentLoaded', function() {
    document.body.classList.add('opacity-100');
    document.body.classList.remove('opacity-0');
});