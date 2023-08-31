
    // 初始化 ECharts 实例
    var myChart = echarts.init(document.getElementById('priceChart'));


    // 使用Binance API获取历史Kline数据
  function fetchAndDisplayData() {
            fetch('https://api.binance.com/api/v3/klines?symbol=ETHUSDT&interval=1m&limit=60')
                .then(response => response.json())
                .then(data => {
                    const historicalData = data.map(kline => ({
                        time: kline[0]/1000,
                        open: parseFloat(kline[1]),
                        high: parseFloat(kline[2]),
                        low: parseFloat(kline[3]),
                        close: parseFloat(kline[4]),
                    }));

                    console.log(historicalData)
                    // 创建烛台图


              const option = {
                        title: {
          text: 'ETH Realtime Price',
          left: 'center'
        },
                xAxis: {
                    type: 'category',
                    data: historicalData.map(entry => new Date(entry.time * 1000).toLocaleTimeString()),
                },

                yAxis: {
                    type: 'value',
                    max: Math.max(...historicalData.map(entry => entry.high)), // 计算最大值
                    min: Math.min(...historicalData.map(entry => entry.low)),   // 计算最小值
                },

                series: [{
                  type: 'candlestick',
                  data: historicalData.map(entry => [entry.open, entry.close, entry.low, entry.high]),
                  itemStyle: {
                    color: '#FF4500', // 自定义烛台颜色
                    color0: '#006400', // 自定义跌烛颜色
                  },
                }],

                tooltip: {
                    trigger: 'axis', // 触发类型：鼠标悬浮时显示
                    formatter: function (params) {
                        const dataIndex = params[0].dataIndex; // 获取数据点的索引
                        const time = historicalData[dataIndex].time; // 获取时间戳
                        const close = historicalData[dataIndex].close; // 获取收盘价

                        return `Time: ${new Date(time * 1000).toLocaleTimeString()}<br>` +
                               `Price: ${close}<br>`;
        }
    },

              };
              // 设置烛台图配置和数据
              myChart.setOption(option);
                })
                .catch(error => console.error('Error fetching data:', error));
        }


        setInterval(fetchAndDisplayData, 60000); // Update data every minute
        fetchAndDisplayData(); // Initial data fetch


