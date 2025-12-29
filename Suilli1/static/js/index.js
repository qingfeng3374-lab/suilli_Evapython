// 示例代码集合
const examples = {
    factorial: `def factorial(n):
    if n == 0:
        return 1
    else:
        return n * factorial(n-1)

# 计算5的阶乘
result = factorial(5)
print(f"5的阶乘是: {result}")`
};

// 错误类型及其对应的错误消息
const errorTypes = {
    ZeroDivisionError: '除以零错误：不能将数字除以零',
    SyntaxError: '语法错误：代码格式不正确',
    IndentationError: '缩进错误：Python代码需要正确的缩进',
    NameError: '名称错误：使用了未定义的变量或函数',
    TypeError: '类型错误：操作或函数应用于不适当类型的对象',
    IndexError: '索引错误：尝试访问列表、元组等不存在的索引',
    KeyError: '键错误：尝试访问字典中不存在的键',
    ValueError: '值错误：函数接收到正确类型但不合适的值',
    AttributeError: '属性错误：尝试访问对象不存在的属性或方法',
    MissingColon: '语法错误：缺少冒号',
    UnmatchedBracket: '语法错误：括号不匹配',
    InvalidIndentation: '缩进错误：缩进不一致',
    UndefinedVariable: '名称错误：使用未定义的变量',
    MissingParenthesis: '语法错误：缺少括号',
    InvalidSyntax: '语法错误：无效的语法'
};

// 模拟Python语法检查
function checkPythonSyntax(code) {
    const diagnostics = [];
    const lines = code.split('\n');

    // 检查常见语法错误
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // 检查缺少冒号
        if (/^\s*(if|else|elif|for|while|def|class)\b.*[^:]$/.test(line)) {
            diagnostics.push({
                severity: monaco.MarkerSeverity.Error,
                startLineNumber: i + 1,
                startColumn: line.length + 1,
                endLineNumber: i + 1,
                endColumn: line.length + 1,
                message: "SyntaxError: invalid syntax (missing colon)"
            });
        }

        // 检查未定义的变量
        if (/^\s*print\s*\(\s*undefined_variable\s*\)/.test(line)) {
            diagnostics.push({
                severity: monaco.MarkerSeverity.Error,
                startLineNumber: i + 1,
                startColumn: line.indexOf('undefined_variable') + 1,
                endLineNumber: i + 1,
                endColumn: line.indexOf('undefined_variable') + 'undefined_variable'.length + 1,
                message: "NameError: name 'undefined_variable' is not defined"
            });
        }

        // 检查除以零错误
        if (/^\s*return\s*\d+\s*\/\s*0/.test(line)) {
            diagnostics.push({
                severity: monaco.MarkerSeverity.Error,
                startLineNumber: i + 1,
                startColumn: line.indexOf('/ 0') + 1,
                endLineNumber: i + 1,
                endColumn: line.indexOf('/ 0') + 3,
                message: "ZeroDivisionError: division by zero"
            });
        }

        // 检查括号不匹配
        const openBrackets = (line.match(/\(/g) || []).length;
        const closeBrackets = (line.match(/\)/g) || []).length;
        if (openBrackets !== closeBrackets) {
            diagnostics.push({
                severity: monaco.MarkerSeverity.Error,
                startLineNumber: i + 1,
                startColumn: 1,
                endLineNumber: i + 1,
                endColumn: line.length + 1,
                message: "SyntaxError: unmatched parentheses"
            });
        }
    }

    return diagnostics;
}

// 加载 Monaco Editor
require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs' } });

let editor;
require(['vs/editor/editor.main'], function() {
    // 根据主题设置编辑器主题
    const isDark = document.documentElement.classList.contains('dark');
    const editorTheme = isDark ? 'vs-dark' : 'vs';

    editor = monaco.editor.create(document.getElementById('editor-container'), {
        value: examples.factorial,
        language: 'python',
        theme: editorTheme,
        fontSize: 14,
        lineNumbers: 'on',
        automaticLayout: true,
        scrollBeyondLastLine: false
    });

    // 监听代码变化，实时检查语法
    editor.onDidChangeModelContent(() => {
        const code = editor.getValue();
        const diagnostics = checkPythonSyntax(code);

        // 更新错误信息显示
        monaco.editor.setModelMarkers(editor.getModel(), 'python', diagnostics);
    });

    // 主题切换时更新编辑器主题
    document.getElementById('theme-toggle').addEventListener('click', () => {
        const isDark = document.documentElement.classList.contains('dark');

        // 添加过渡效果
        document.getElementById('editor-container').style.transition = 'background-color 0.3s ease';
        setTimeout(() => {
            editor.updateOptions({
                theme: isDark ? 'vs-dark' : 'vs'
            });
            document.getElementById('editor-container').style.transition = '';
        }, 100);
    });
});

// DOM元素引用
const runBtn = document.getElementById('run-btn');
const saveBtn = document.getElementById('save-btn');
const resetBtn = document.getElementById('reset-btn');
const examplesBtn = document.getElementById('examples-btn');
const examplesDropdown = document.getElementById('examples-dropdown');
const exampleItems = document.querySelectorAll('.example-item');
const copyCodeBtn = document.getElementById('copy-code-btn');
const copyOutputBtn = document.getElementById('copy-output-btn');
const clearOutputBtn = document.getElementById('clear-output-btn');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const outputContent = document.getElementById('output-content');

// 示例代码下拉菜单切换
examplesBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    examplesDropdown.classList.toggle('hidden');
});

// 点击页面其他地方关闭下拉菜单
document.addEventListener('click', () => {
    examplesDropdown.classList.add('hidden');
});

// 选择示例代码
exampleItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const exampleKey = item.getAttribute('data-example');
        if (editor && examples[exampleKey]) {
            editor.setValue(examples[exampleKey]);
        }
        examplesDropdown.classList.add('hidden');
    });
});


// 运行代码按钮
runBtn.addEventListener('click', () => {
    if (!editor) return;

    // 清空输出
    outputContent.innerHTML = '';

    // 显示运行中
    appendOutput('正在运行代码...', 'warning');

    // 获取代码
    const code = editor.getValue();

    // 检查是否有语法错误
    const diagnostics = checkPythonSyntax(code);
    if (diagnostics.some(d => d.severity === monaco.MarkerSeverity.Error)) {
        // 移除"正在运行代码..."消息
        outputContent.removeChild(outputContent.lastChild);

        appendOutput('错误: 代码包含语法错误，无法运行', 'error');
        appendOutput('请先修复左侧编辑器中显示的错误', 'error');

        // 显示详细的错误信息
        appendOutput('', 'normal');
        appendOutput('错误详情:', 'warning');
        diagnostics.forEach(diagnostic => {
            if (diagnostic.severity === monaco.MarkerSeverity.Error) {
                appendOutput(`- 第 ${diagnostic.startLineNumber} 行: ${diagnostic.message}`, 'error');
            }
        });

        return;
    }

    // 记录开始时间
    const startTime = performance.now();

    // 模拟代码运行
    setTimeout(() => {
        try {
            // 移除"正在运行代码..."消息
            if (outputContent.lastChild && outputContent.lastChild.textContent === '正在运行代码...') {
                outputContent.removeChild(outputContent.lastChild);
            }

            // 记录结束时间
            const endTime = performance.now();
            // 计算运行时间（毫秒转秒）
            const runTime = (endTime - startTime) / 1000;

            // 显示阶乘计算结果（这里应替换为实际代码执行，此处为演示用）
            appendOutput('代码运行结果: 5的阶乘是: 120 ', 'normal');
            appendOutput('-----------------------', 'normal');

            // 显示成功信息和运行时间
            appendOutput('', 'normal');
            appendOutput('代码运行成功!', 'success');
            appendOutput(`代码运行时间: ${runTime.toFixed(3)} 秒`, 'normal');

        } catch (error) {
            // 移除"正在运行代码..."消息
            if (outputContent.lastChild && outputContent.lastChild.textContent === '正在运行代码...') {
                outputContent.removeChild(outputContent.lastChild);
            }

            // 记录结束时间（即使出错也计算时间）
            const endTime = performance.now();
            const runTime = (endTime - startTime) / 1000;

            appendOutput(`运行时错误: ${error.message}`, 'error');
            appendOutput(`代码运行时间: ${runTime.toFixed(3)} 秒`, 'normal');
        }
    }, 1000); // 模拟网络延迟
});

// 保存按钮
saveBtn.addEventListener('click', () => {
    if (!editor) return;

    // 模拟保存
    showNotification('代码已保存');
});

// 重置按钮
resetBtn.addEventListener('click', () => {
    if (!editor) return;

    // 恢复初始代码（阶乘示例）
    editor.setValue(examples.factorial);

    // 清空输出
    outputContent.innerHTML = '';
    appendOutput('代码已重置');
});

// 复制代码按钮
copyCodeBtn.addEventListener('click', () => {
    if (!editor) return;

    const code = editor.getValue();
    navigator.clipboard.writeText(code).then(() => {
        showNotification('代码已复制到剪贴板');
    });
});

// 复制输出按钮
copyOutputBtn.addEventListener('click', () => {
    const text = Array.from(outputContent.querySelectorAll('.output-line'))
       .map(line => line.textContent)
       .join('\n');

    navigator.clipboard.writeText(text).then(() => {
        showNotification('输出已复制到剪贴板');
    });
});

// 清空输出按钮
clearOutputBtn.addEventListener('click', () => {
    outputContent.innerHTML = '';
    appendOutput('输出已清空');
});

// 全屏按钮
fullscreenBtn.addEventListener('click', () => {
    const editorContainer = document.getElementById('editor-container');

    if (!document.fullscreenElement) {
        editorContainer.requestFullscreen().catch(err => {
            showNotification(`全屏模式错误: ${err.message}`, 'error');
        });
        fullscreenBtn.innerHTML = '<i class="fa-solid fa-compress"></i>';
    } else {
        document.exitFullscreen();
        fullscreenBtn.innerHTML = '<i class="fa-solid fa-expand"></i>';
    }
});

// 辅助函数: 添加输出行
function appendOutput(text, type = 'normal') {
    const line = document.createElement('div');
    line.className = `output-line ${getColorClass(type)}`;
    line.textContent = text;
    outputContent.appendChild(line);

    // 自动滚动到底部
    outputContent.scrollTop = outputContent.scrollHeight;
}

// 根据主题和消息类型获取适当的颜色类
function getColorClass(type) {
    const isDark = document.documentElement.classList.contains('dark');

    const colorMap = {
        normal: isDark ? 'text-light-200' : 'text-dark-300',
        success: isDark ? 'text-green-300' : 'text-green-500',
        error: isDark ? 'text-red-300' : 'text-red-500',
        warning: isDark ? 'text-yellow-300' : 'text-yellow-400'
    };

    return colorMap[type] || colorMap.normal;
}

// 辅助函数: 显示通知
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300 transform translate-y-0 ${
        type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // 3秒后隐藏通知
    setTimeout(() => {
        notification.classList.add('translate-y-16', 'opacity-0');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// 窗口大小变化时调整编辑器
window.addEventListener('resize', () => {
    if (editor) {
        editor.layout();
    }
});