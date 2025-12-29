// 主题切换和移动端菜单代码已在base.html中，此处仅添加题库页面特有的脚本
const problemModal = document.getElementById('problem-modal');
const closeModal = document.getElementById('close-modal');
const startSolving = document.getElementById('start-solving');
const modalTitle = document.getElementById('modal-title');
const problemDescription = document.getElementById('problem-description');
const inputFormat = document.getElementById('input-format');
const outputFormat = document.getElementById('output-format');
const problemHint = document.getElementById('problem-hint');

// 题目数据
const problems = [
    {
        id: 1,
        title: "输出问候语",
        description: "编写一个Python程序，输出\"hello, suilli!\"。要求严格按照格式输出，包括大小写和标点符号。",
        inputFormat: "无输入",
        outputFormat: "输出字符串\"hello, suilli!\"",
        hint: "使用print函数输出指定字符串。注意大小写和标点符号。",
        difficulty: "easy"
    },
    {
        id: 2,
        title: "斐波那契数列",
        description: "斐波那契数列是一个经典的数学序列，其中每个数都是前两个数的和。数列定义如下：<br><br>F(0) = 0<br>F(1) = 1<br>F(n) = F(n-1) + F(n-2) (n ≥ 2)<br><br>编写一个Python程序，计算斐波那契数列的第n项。",
        inputFormat: "输入一个非负整数n (0 ≤ n ≤ 30)",
        outputFormat: "输出斐波那契数列的第n项",
        hint: "可以使用递归或迭代方法实现。注意处理边界条件。",
        difficulty: "medium"
    },
    {
        id: 3,
        title: "质数判断",
        description: "质数是大于1的自然数，除了1和它本身外，不能被其他自然数整除的数。编写一个Python程序，判断一个给定的数是否为质数。",
        inputFormat: "输入一个整数n (2 ≤ n ≤ 10^6)",
        outputFormat: "如果n是质数，输出\"Yes\"，否则输出\"No\"",
        hint: "质数判断的基本方法是检查n是否能被2到√n之间的任何整数整除。注意优化算法效率。",
        difficulty: "hard"
    }
];

// 为每个题目添加点击事件
document.querySelectorAll('.card-hover').forEach((card, index) => {
    card.addEventListener('click', () => {
        // 填充模态框内容
        modalTitle.textContent = problems[index].title;
        problemDescription.innerHTML = problems[index].description;
        inputFormat.textContent = problems[index].inputFormat;
        outputFormat.textContent = problems[index].outputFormat;
        problemHint.textContent = problems[index].hint;

        // 显示模态框
        problemModal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // 防止背景滚动
    });
});

// 关闭模态框
closeModal.addEventListener('click', () => {
    problemModal.style.display = 'none';
    document.body.style.overflow = ''; // 恢复背景滚动
});

// 点击模态框外部关闭
problemModal.addEventListener('click', (e) => {
    if (e.target === problemModal) {
        problemModal.style.display = 'none';
        document.body.style.overflow = '';
    }
});

// 开始解答按钮
startSolving.addEventListener('click', () => {
    problemModal.style.display = 'none';
    document.body.style.overflow = '';
    showNotification('即将跳转到代码编辑器');
});

// 筛选功能
const difficultyFilter = document.getElementById('difficulty-filter');
const idFilter = document.getElementById('id-filter');
const searchInput = document.getElementById('search-input');
const problemsContainer = document.getElementById('problems-container');
const noResults = document.getElementById('no-results');
const resetFiltersBtn = document.getElementById('reset-filters');
const problemCount = document.getElementById('problem-count');
const originalProblems = document.querySelectorAll('.problem-card');

function filterProblems() {
    const selectedDifficulty = difficultyFilter.value;
    const selectedId = idFilter.value;
    const searchTerm = searchInput.value.toLowerCase().trim();
    let visibleCount = 0;

    originalProblems.forEach(problem => {
        const problemId = problem.getAttribute('data-id');
        const problemDifficulty = problem.getAttribute('data-difficulty');
        const problemTitle = problem.querySelector('h3').textContent.toLowerCase();
        const problemDescription = problem.querySelector('p').textContent.toLowerCase();

        const matchesDifficulty = !selectedDifficulty || problemDifficulty === selectedDifficulty;
        const matchesId = !selectedId || problemId === selectedId;
        const matchesSearch = !searchTerm || problemId.includes(searchTerm) || problemTitle.includes(searchTerm) || problemDescription.includes(searchTerm);

        problem.style.display = matchesDifficulty && matchesId && matchesSearch ? 'block' : 'none';
        visibleCount += matchesDifficulty && matchesId && matchesSearch ? 1 : 0;
    });

    problemCount.textContent = visibleCount;
    noResults.style.display = visibleCount === 0 ? 'flex' : 'none';
    problemsContainer.style.display = visibleCount > 0 ? 'grid' : 'none';
}

function resetFilters() {
    difficultyFilter.value = '';
    idFilter.value = '';
    searchInput.value = '';
    filterProblems();
}

difficultyFilter.addEventListener('change', filterProblems);
idFilter.addEventListener('change', filterProblems);
searchInput.addEventListener('input', filterProblems);
resetFiltersBtn.addEventListener('click', resetFilters);

// 高亮搜索词
function highlightSearchTerm() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    if (!searchTerm) return;

    originalProblems.forEach(problem => {
        if (problem.style.display === 'none') return;

        const titleElement = problem.querySelector('h3');
        const descElement = problem.querySelector('p');
        const regex = new RegExp(`(${searchTerm})`, 'gi');

        titleElement.innerHTML = titleElement.textContent.replace(regex, '<span class="search-highlight">$1</span>');
        descElement.innerHTML = descElement.textContent.replace(regex, '<span class="search-highlight">$1</span>');
    });
}

searchInput.addEventListener('input', () => {
    filterProblems();
    setTimeout(highlightSearchTerm, 100);
});

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300 transform translate-y-0 ${type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// 初始化
filterProblems();