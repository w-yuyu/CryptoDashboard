document.addEventListener('DOMContentLoaded', function () {
    // 创建一个存储价格数据的数组，用于绘制折线图
    var binancePrices = [];
    var poloniexPrices = [];
    var timeLabels = [];

    // 获取价格数据并更新图表
    function updateChart() {
        // 获取当前时间
        var currentTime = new Date().toLocaleTimeString();

        // 从Binance和Poloniex API获取实时BTC价格数据
        axios.get('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT')
            .then(function (response) {
                var binancePrice = parseFloat(response.data.price);
                binancePrices.push(binancePrice);
            })
            .catch(function (error) {
                console.error('Failed to fetch Binance data:', error);
            });

        axios.get('https://poloniex.com/public?command=returnTicker')
            .then(function (response) {
                var poloniexPrice = parseFloat(response.data.USDT_BTC.last);
                poloniexPrices.push(poloniexPrice);
            })
            .catch(function (error) {
                console.error('Failed to fetch Poloniex data:', error);
            });

        // 将时间标签添加到数组中
        timeLabels.push(currentTime);

        // 限制数组长度为最近一小时的数据（假设一小时有60分钟）
        var maxLength = 60;
        if (binancePrices.length > maxLength) {
            binancePrices.shift();
            poloniexPrices.shift();
            timeLabels.shift();
        }

        // 更新图表
        updateLineChart();
    }

    // 使用Chart.js绘制折线图
    function updateLineChart() {
        var ctx = document.getElementById('btcChart').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: timeLabels,
                datasets: [
                    {
                        label: 'Binance',
                        data: binancePrices,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                        fill: false
                    },
                    {
                        label: 'Poloniex',
                        data: poloniexPrices,
                        borderColor: 'rgba(192, 75, 192, 1)',
                        borderWidth: 1,
                        fill: false
                    }
                ]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // 每分钟更新一次图表
    setInterval(updateChart, 60000); // 60秒 = 1分钟
});
