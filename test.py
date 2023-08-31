import websocket
import json
import mplfinance as mpf

def on_message(ws, message):
    data = json.loads(message)
    kline = data['k']
    kline_data.append([int(kline['t']), float(kline['o']), float(kline['h']), float(kline['l']), float(kline['c'])])

    # 只保留最近的K线数据，这里设置为100根
    if len(kline_data) > 100:
        kline_data.pop(0)

    draw_kline_chart()

def draw_kline_chart():
    # 解析数据
    timestamps, opens, highs, lows, closes = zip(*kline_data)

    # 绘制K线图
    df = mpf.DataFrame({'Open': opens, 'High': highs, 'Low': lows, 'Close': closes}, index=timestamps)
    mpf.plot(df, type='candle', title='BTC/USDT Kline Chart', ylabel='Price', style='binance')

if __name__ == "__main__":
    # 初始化K线数据
    kline_data = []

    # 订阅BTC/USDT的K线数据，时间间隔为1分钟
    symbol = "btcusdt"
    interval = "1s"
    ws_url = f"wss://stream.binance.com:9443/ws/{symbol}@kline_{interval}"

    # 建立WebSocket连接
    ws = websocket.WebSocketApp(ws_url, on_message=on_message)
    ws.run_forever()