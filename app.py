from flask import Flask,render_template
import pandas as pd
import pymysql
from flask_sqlalchemy import SQLAlchemy
import requests
from flask_cors import *

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:123456@localhost/cryptodata'  # 根据你的数据库连接信息进行配置
db = SQLAlchemy(app)

def get_binance_price():
    url = 'https://api.binance.com/api/v3/ticker/price'
    response = requests.get(url, params={'symbol': 'BTCUSDT'})
    data = response.json()
    return float(data['price'])

def get_poloniex_price():
    url = 'https://poloniex.com/public?command=returnTicker'
    response = requests.get(url)
    data = response.json()
    return float(data['USDT_BTC']['last'])


@app.route('/btc')
def btc():
    return render_template('BTCdashboard.html')

@app.route('/eth')
def eth():
    return render_template('ETHdashboard.html')

@app.route('/arbitrage')
def arbitrage():
    return render_template('Arbitrage.html')

@app.route('/')
def index():
    return render_template('index.html')


if __name__ == '__main__':
    app.run()
