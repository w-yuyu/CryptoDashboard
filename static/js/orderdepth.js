    // 初始化 ECharts 实例
    var orderDepthChart = echarts.init(document.getElementById('orderDepthChart'));

    // 获取订单簿数据
    const symbol = 'BTCUSDT'; // 要查询的交易对
    const limit = 100; // 要查询的订单簿条目数量

    async function fetchOrderBookData() {
        try {
            const response = await fetch(`https://api.binance.com/api/v3/depth?symbol=${symbol}&limit=${limit}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching order book data:', error);
            return null;
        }
    }

    // 更新订单深度图
    async function updateOrderDepthChart() {
        const orderBookData = await fetchOrderBookData();
        console.log(orderBookData)
        if (orderBookData) {
            const bids = orderBookData.bids;
            const asks = orderBookData.asks;

            const BidsdepthData = calculate(bids);
            const AsksdepthData = calculate(asks);
            console.log(BidsdepthData)
            console.log(AsksdepthData)
            const option = {
                title: {
          text: 'ETH Order Depth',
          left: 'center'
        },
                xAxis: {
                    type: 'value',
                    min:BidsdepthData[99][0],
                    max: AsksdepthData[99][0],
                },
                yAxis: {
                    type: 'value',
                },
                series: [{
                    type: 'line',
                    areaStyle: {},
                    data: BidsdepthData,
                    color:'green',
                },
                {
                    type: 'line',
                    areaStyle: {},
                    data: AsksdepthData,
                    color:'red',
                }
                ]};

            // 设置订单深度图配置和数据
            orderDepthChart.setOption(option);
        }
    }

    // 计算订单深度数据
    function calculate(data) {
        const depthData = [];
        let volumeTotal = 0;

        data.forEach(([price, volume]) => {
            volumeTotal += parseFloat(volume);
            depthData.push([parseFloat(price), volumeTotal]);
        });
        return depthData;
    }

    // 初始加载订单深度图
    setInterval(updateOrderDepthChart, 60000); // Update data every minute
    updateOrderDepthChart(); // Initial data fetch
