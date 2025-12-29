// 移动端菜单切换
document.getElementById('mobile-menu-btn').addEventListener('click', () => {
    document.getElementById('mobile-menu').classList.toggle('hidden');
});

// 主题切换功能
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // 检查本地存储或系统偏好设置
    const isDarkMode = localStorage.getItem('darkMode') === 'true' ||
                      (localStorage.getItem('darkMode') === null &&
                       window.matchMedia('(prefers-color-scheme: dark)').matches);

    // 应用初始主题
    if (isDarkMode) {
        htmlElement.classList.add('dark');
    } else {
        htmlElement.classList.remove('dark');
    }

    // 主题切换按钮事件
    themeToggle.addEventListener('click', function() {
        const isDark = htmlElement.classList.toggle('dark');
        localStorage.setItem('darkMode', isDark);

        // 为过渡效果添加临时类
        htmlElement.classList.add('theme-transition');
        setTimeout(() => {
            htmlElement.classList.remove('theme-transition');
        }, 300);

        // 更新编辑器主题（在子页面初始化后生效）
    });
});