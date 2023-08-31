// Function to calculate moving average
    function calculateMovingAverage(data, period) {
      const result = [];
      for (let i = period; i < data.length; i++) {
        const sum = data.slice(i - period, i).reduce((acc, val) => acc + val, 0);
        result.push(sum / period);
      }
      return result;
    }

    // Function to calculate RSI
    function calculateRSI(data, period) {
      // Implementation of RSI calculation goes here
      // Return an array containing RSI values for each data point

        const gain_history = []; // 回溯期内的收益历史（无收益为0，有收益则为收益的幅度）
        const loss_history = []; // 回溯期内的损失历史（无损失为0，有损失则为损失的幅度）
        const avg_gain_values = []; // 存储平均收益值以便图形绘制
        const avg_loss_values = []; // 存储平均损失值以便图形绘制
        const rsi_values = []; // 存储算得的RSI值
        let last_price = 0;

        // 遍历收盘价以计算RSI指标
        data.forEach(close => {
          if (last_price === 0) {
            last_price = close;
          }

          const gain = Math.max(0, close - last_price);
          const loss = Math.max(0, last_price - close);
          gain_history.push(gain);
          loss_history.push(loss);
          last_price = close;

          if (gain_history.length > period) { // 最大观测值等于回溯周期
            gain_history.shift();
            loss_history.shift();
          }

          const avg_gain = gain_history.reduce((acc, val) => acc + val, 0) / gain_history.length; // 回溯期的平均收益
          const avg_loss = loss_history.reduce((acc, val) => acc + val, 0) / loss_history.length; // 回溯期的平均损失

          avg_gain_values.push(avg_gain);
          avg_loss_values.push(avg_loss);

          // 初始化rs值
          let rs = 0;
          if (avg_loss > 0) { // 避免除数为 0，出现错误
            rs = avg_gain / avg_loss;
          }

          const rsi = 100 - (100 / (1 + rs));
          rsi_values.push(rsi);
        });
        return rsi_values;
    }

    // Function to fetch historical Kline data
    async function fetchHistoricalData() {
      const symbol = 'BTCUSDT';
      const interval = '1d';
      const endTime = Date.now();
      const startTime = endTime - 30 * 24 * 60 * 60 * 1000; // 180 days in milliseconds

      const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&startTime=${startTime}&endTime=${endTime}`;

      try {
        const response = await axios.get(url);
        const data = response.data.map(item => ({
          time: item[0],
          open: parseFloat(item[1]),
          high: parseFloat(item[2]),
          low: parseFloat(item[3]),
          close: parseFloat(item[4])
        }));

        // Calculate moving averages
        const movingAveragePeriod = 1;
        const movingAverageData = calculateMovingAverage(data.map(item => item.close), movingAveragePeriod);

        // Calculate RSI
        const rsiPeriod = 14;
        const rsiData = calculateRSI(data.map(item => item.close), rsiPeriod);

        renderChart(data, movingAverageData, rsiData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    // Function to render chart
    function renderChart(data, movingAverageData, rsiData) {
      const myChart = echarts.init(document.getElementById('btcChart'));

      const option = {
        title: {
          text: 'BTC Historical Chart with Moving Average and RSI',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        // legend: {
        //   data: ['Kline', 'Moving Average', 'RSI'],
        //   top: 10,
        //   right: 10
        // },
        xAxis: {
          type: 'category',
          // data: data.map(item => item.time),
          date: data.map(item => new Date(item.time).toLocaleTimeString()),
          axisLabel: {
            rotate: 45
          }
        },
        yAxis: [
          {
            type: 'value',
            scale: true,
            name: 'Price',
            position: 'left',
            axisLabel: {
              formatter: '{value}'
            }
          },
          {
            type: 'value',
            scale: true,
            name: 'RSI',
            position: 'right',
            axisLabel: {
              formatter: '{value}'
            }
          }
        ],
        series: [
          {
            name: 'Kline',
            type: 'candlestick',
            data: data.map(item => [item.open, item.close, item.low, item.high]),
            itemStyle: {
              color: '#ef232a',
              color0: '#14b143',
              borderColor: '#ef232a',
              borderColor0: '#14b143'
            }},

          {
            name: `Moving Average (${movingAverageData.length} periods)`,
            type: 'line',
            data: movingAverageData
          },
          {
            name: `RSI (${rsiData.length} periods)`,
            type: 'line',
            data: rsiData,
            yAxisIndex: 1
          }
        ]
      };

      myChart.setOption(option);
    }

    // Fetch historical Kline data and render chart
    fetchHistoricalData();
