// 密码显示/隐藏切换
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

togglePassword.addEventListener('click', function() {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);

    // 切换图标
    this.querySelector('i').classList.toggle('fa-eye');
    this.querySelector('i').classList.toggle('fa-eye-slash');
});

// 添加页面加载动画
document.addEventListener('DOMContentLoaded', function() {
    document.body.classList.add('opacity-100');
    document.body.classList.remove('opacity-0');
});