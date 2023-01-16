import React from "react";
import BlockChain from "../../assets/images/blockchain_ps1.png";
import { TickerTape } from "react-tradingview-embed";

const Banner = () => {
  return (
    <>
      <section className="banner banner-bg header-padding">
        <div className="container">
          <div className="row align-items-center padding50">
            <div className="col-md-6">
              <div className="banner-img">
                <img src={BlockChain} alt="" className="img-fluid" />
              </div>
            </div>
            <div className="col-md-6">
              <div className="wrap-text">
                <h1 className="text-capitalize">buy &amp; sell crypto</h1>
                <strong className="banner-strong text-capitalize">
                  in minutes<span className="dot">.</span>
                </strong>
                <p className="dot">Join the world's largest crypto exchange.</p>
              </div>
            </div>
          </div>
          <div className="price-chart-img">
            <TickerTape className="mt-3" widgetProps={{
              "symbols": [
                {
                  "description": "ETH",
                  "proName": "BINANCE:ETHUSDT"
                },
                {
                  "description": "BTC",
                  "proName": "BINANCE:BTCUSDT"
                },
                {
                  "description": "LINK",
                  "proName": "BINANCE:LINKUSDT"
                },
                {
                  "description": "AVAX",
                  "proName": "BINANCE:AVAXUSDT"
                },
                {
                  "description": "DOGE",
                  "proName": "BINANCE:DOGEUSDT"
                },
                {
                  "description": "BCH",
                  "proName": "BINANCE:BCHUSDT"
                },
                {
                  "description": "LTC",
                  "proName": "BINANCE:LTCUSDT"
                },
                {
                  "description": "TRX",
                  "proName": "BINANCE:TRXUSDT"
                },
                {
                  "description": "BNB",
                  "proName": "BINANCE:BNBUSDT"
                },
                {
                  "description": "ADA",
                  "proName": "BINANCE:ADAUSDT"
                }
              ],
              "colorTheme": "dark",
              "showSymbolLogo": true,
              "locale": "en",
              "isTransparent": true
            }} />

          </div>
        </div>
        <div className="batton"></div>
      </section>
    </>
  );
};

export default Banner;
