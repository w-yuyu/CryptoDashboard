// Initialize ECharts instance
    var myBTCChart = echarts.init(document.getElementById('lineChart'));

    // 使用Binance API获取历史Kline数据
  async function fetchBinanceHistoricalData() {
      const symbol = 'BTCUSDT';
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


    async function fetchKrakenHistoricalData() {
        const since = new Date().getTime()-3600;
        const interval = 1;
        const count = 60;
        const response = await fetch(`https://api.kraken.com/0/public/OHLC?pair=XBTUSD&interval=${interval}&since=${since}`);
        const responsedata = await response.json();
        // Extract timestamps and close prices
        const data = responsedata.result['XXBTZUSD'].slice(-60);
        const timestamps = data.map(entry => new Date(entry[0]));
       const prices = data.map(entry => parseFloat(entry[4]));
        return {timestamps, prices};

    }


  // 创建图表
  async function createChart() {
    const BinancehistoricalData = await fetchBinanceHistoricalData();
    const KrakenhistoricalData = await fetchKrakenHistoricalData();
    console.log(KrakenhistoricalData,BinancehistoricalData)
    const BTCoption = {
        title: {
          text: 'BTC Arbitrage',
          left: 'center'
        },
        xAxis: {
            type: 'category',
            data: BinancehistoricalData.timestamps,
        },
        yAxis: {
            type: 'value',
            max: Math.max(...KrakenhistoricalData.prices, ...BinancehistoricalData.prices),
            min: Math.min(...KrakenhistoricalData.prices, ...BinancehistoricalData.prices),
        },
        legend: {
            orient: 'vertical',
            data: ['Kraken', 'Binance'],
            x:'right'

        },
        series: [
            {
                name: 'Kraken',
                data: KrakenhistoricalData.prices,
                type: 'line',
                color: 'red',
            },
            {
                name:'Binance',
                data: BinancehistoricalData.prices,
                type: 'line',
                color: 'blue'
            },
        ],
        tooltip: {
        trigger: 'axis',
        formatter: function (params) {
            const dataIndex = params[0].dataIndex; // get data index
            const KrakenPrice = KrakenhistoricalData.prices[dataIndex]; // get price from Kraken
            const BinancePrice = BinancehistoricalData.prices[dataIndex]; // get price from Binance
            return `Time: ${params[0].name}<br>Kraken Price: ${KrakenPrice}<br>Binance Price: ${BinancePrice}`;
        }
    },

    };

    // Set chart options and data
    myBTCChart.setOption(BTCoption);}

    setInterval(createChart, 60000);
    createChart();

