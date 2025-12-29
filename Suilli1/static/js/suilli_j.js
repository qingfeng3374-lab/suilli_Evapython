// 初始化图表
function initCharts() {
    // 获取当前主题
    const isDark = document.documentElement.classList.contains('dark');
    const textColor = isDark ? '#F1F5F9' : '#1E293B';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

    // 题目类型分布图表
    const problemTypeCtx = document.getElementById('problemTypeChart').getContext('2d');
    new Chart(problemTypeCtx, {
        type: 'pie',
        data: {
            labels: ['基础语法', '数据结构', '算法', '应用开发', '项目实践'],
            datasets: [{
                data: [30, 25, 20, 15, 10],
                backgroundColor: [
                    '#165DFF', // primary
                    '#36D399', // secondary
                    '#FBBD23', // warning
                    '#F87272', // danger
                    '#9333EA', // purple
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: textColor,
                        font: {
                            family: 'Inter',
                            size: 12
                        }
                    }
                }
            }
        }
    });

    // 用户进步趋势图表
    const progressCtx = document.getElementById('progressChart').getContext('2d');
    new Chart(progressCtx, {
        type: 'line',
        data: {
            labels: ['第1周', '第2周', '第3周', '第4周', '第5周', '第6周', '第7周', '第8周'],
            datasets: [{
                label: '已完成题目',
                data: [5, 12, 18, 25, 32, 40, 48, 55],
                borderColor: '#165DFF',
                backgroundColor: 'rgba(22, 93, 255, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: '正确率',
                data: [60, 65, 70, 72, 78, 80, 85, 88],
                borderColor: '#36D399',
                backgroundColor: 'transparent',
                tension: 0.4,
                yAxisID: 'y1'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor
                    }
                },
                y1: {
                    beginAtZero: true,
                    position: 'right',
                    max: 100,
                    grid: {
                        drawOnChartArea: false
                    },
                    ticks: {
                        color: textColor,
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                },
                x: {
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                        font: {
                            family: 'Inter',
                            size: 12
                        }
                    }
                }
            }
        }
    });
}
// 初始化图表
initCharts();