
    // 初始化 ECharts 实例
    var klineChart = echarts.init(document.getElementById('klineChart'));

    // 获取Kline数据
    async function fetchKlineData(symbol, interval, startTime, endTime) {
        try {
            const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&startTime=${startTime}&endTime=${endTime}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching Kline data:', error);
            return null;
        }
    }

    // 更新烛台图
    async function updateKlineChart() {
        const symbol = 'ETHUSDT'; // 要查询的交易对
        const interval = '1d'; // 时间间隔，这里设置为1天
        const endTime = new Date().getTime(); // 当前时间
        const startTime = endTime - (180 * 24 * 60 * 60 * 1000); // 前180天的时间

        const klineData = await fetchKlineData(symbol, interval, startTime, endTime);

        if (klineData) {
            const candlestickData = klineData.map(kline => ({
                time: kline[0],
                open: parseFloat(kline[1]),
                close: parseFloat(kline[4]),
                low: parseFloat(kline[3]),
                high: parseFloat(kline[2]),
            }));
            console.log(candlestickData)
            const option = {
                title: {
          text: 'ETH Historical Chart',
          left: 'center'
        },
                xAxis: {
                    type: 'category',
                    data: candlestickData.map(data => new Date(data.time).toLocaleDateString()),
                },
                yAxis: {
                    type: 'value',
                    max: Math.max(...candlestickData.map(data => data.high)), // 计算最大值
                    min: Math.min(...candlestickData.map(data => data.low)),   // 计算最小值
                },
                series: [{
                    type: 'candlestick',
                    data: candlestickData.map(data => [data.open, data.close, data.low, data.high]),
                }],

                tooltip: {
                    trigger: 'axis', // 触发类型：鼠标悬浮时显示
                    formatter: function (params) {
                        const dataIndex = params[0].dataIndex; // get data index
                        const time = candlestickData[dataIndex].time;
                        const close = candlestickData[dataIndex].close;
                        const open = candlestickData[dataIndex].open;
                        const high = candlestickData[dataIndex].high;
                        const low = candlestickData[dataIndex].low;

                        return `Time: ${new Date(time).toLocaleDateString()}<br>` +
                                `Open: ${open}<br>`+
                                `High: ${high}<br>`+
                                `Low: ${low}<br>`+
                               `Close: ${close}<br>`;
                    }},
            };

            // 设置烛台图配置和数据
            klineChart.setOption(option);
        }
    }

    // 初始加载烛台图
    updateKlineChart();
