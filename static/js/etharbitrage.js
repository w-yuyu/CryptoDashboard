// Initialize ECharts instance
    var myChart = echarts.init(document.getElementById('ETHlineChart'));

    // 使用Binance API获取历史Kline数据
  async function fetchETHBinanceHistoricalData() {
      const symbol = 'ETHUSDT';
      const interval = '1m';

      // 获取当前时间和前一小时的时间戳
      const currentTime = new Date().getTime();
      const oneHourAgo = currentTime - 3600000;

      const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&startTime=${oneHourAgo}&endTime=${currentTime}&limit=60`);
      const data = await response.json();
      // obtain the timestamp and price
     // const timestamps = data.map(entry => new Date(entry[0]));
      //const timestamps = data.map(entry => new Date(entry[0]));
      const timestamps = data.map(entry => {
          const timestamp = new Date(entry[0]);
          const hours = timestamp.getHours();
          const minutes = timestamp.getMinutes();
          return `${hours}:${minutes}`;
        });

      const prices = data.map(entry => parseFloat(entry[4]));
      return {timestamps, prices};
  }


    async function fetchETHKrakenHistoricalData() {
        const since = new Date().getTime()-3600;
        const interval = 1;
        const count = 60;
        const response = await fetch(`https://api.kraken.com/0/public/OHLC?pair=ETHUSDT&interval=${interval}&since=${since}`);
        const responsedata = await response.json();
        // Extract timestamps and close prices
        const data = responsedata.result['ETHUSDT'].slice(-60);
        const timestamps = data.map(entry => new Date(entry[0]));
       const prices = data.map(entry => parseFloat(entry[4]));
        return {timestamps, prices};

    }


  // 创建图表
  async function createChart() {
    const ETHBinancehistoricalData = await fetchETHBinanceHistoricalData();
    const ETHKrakenhistoricalData = await fetchETHKrakenHistoricalData();
    console.log(ETHKrakenhistoricalData,ETHBinancehistoricalData)
    const option = {
        title: {
          text: 'ETH Arbitrage',
          left: 'center'
        },
        xAxis: {
            type: 'category',
            data: ETHBinancehistoricalData.timestamps,
        },
        yAxis: {
            type: 'value',
            max: Math.max(...ETHKrakenhistoricalData.prices, ...ETHBinancehistoricalData.prices),
            min: Math.min(...ETHKrakenhistoricalData.prices, ...ETHBinancehistoricalData.prices),
    },
        legend: {
            orient: 'vertical',
            data: ['Kraken', 'Binance'],
            x:'right'

        },
        series: [
            {
                name:'Kraken',
                data: ETHKrakenhistoricalData.prices,
                type: 'line',
                color: 'red'
            },
            {
                name:'Binance',
                data: ETHBinancehistoricalData.prices,
                type: 'line',
                color: 'blue'
            },
        ],
        tooltip: {
        trigger: 'axis',
        formatter: function (params) {
            const dataIndex = params[0].dataIndex; // 获取数据点的索引
            const ETHKrakenPrice = ETHKrakenhistoricalData.prices[dataIndex]; // 获取 Kraken 的价格
            const ETHBinancePrice = ETHBinancehistoricalData.prices[dataIndex]; // 获取 Binance 的价格

            return `Time: ${params[0].name}<br>Kraken Price: ${ETHKrakenPrice}<br>Binance Price: ${ETHBinancePrice}`;
        }
    },

    };

    // Set chart options and data
    myChart.setOption(option);}

    setInterval(createChart, 60000);
    createChart();

