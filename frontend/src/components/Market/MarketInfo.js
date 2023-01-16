import axios from "axios";
import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import FullPageLoader from "../FullPageLoader/fullPageLoader";
import socketIOClient from "socket.io-client";

const ENDPOINT = process.env.SOCKET_URL

const MarketInfo = () => {

  const [currencies, setCurrencies] = useState(null);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.on("MarketDataSocket", data => {
      setCurrencies(data);
    });
    getCurrencies();
  }, [])
  console.log("MarketInfo: ", currencies)

  const getCurrencies = async () => {
    let prices = [];
    let symbols = ['ETHUSDT', 'LINKUSDT', 'AVAXUSDT', 'DOGEUSDT', 'BCHUSDT', 'LTCUSDT', 'TRXUSDT', 'BNBUSDT', 'ADAUSDT', 'BTCUSDT'];
    for (let i = 0; i < symbols.length; i++) {
      await axios.get(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbols[i]}`).then((res) => {
        prices.push(res.data)
      })
    }
    setCurrencies(prices);
    setLoader(false)
  }

  return (
    <section className="market-starbitrex header-padding">
      <Container fluid className="padding50">
        <h3 className="text-white mb-4">Market Futures</h3>
        {loader ? <FullPageLoader /> :

          <div className="table-responsive market-starbitrex-table">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Price</th>
                  <th scope="col">24h Change</th>
                  <th scope="col">24h High / 24h Low</th>
                  <th scope="col">24h Volume</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {currencies?.length > 0 && currencies.map((item, index) => {
                  return (
                    <tr key={index}>
                      <th className="d-flex align-items-center" scope="row">{item.symbol}</th>
                      <td>$ {item.askPrice}</td>
                      <td className={item.priceChangePercent < 0 ? "dark-red" : "dark-green"}>{item.priceChangePercent}%</td>
                      <td>{item.highPrice} / {item.lowPrice}</td>
                      <td>{item.volume}</td>
                      <td>
                        <Link to={'/trade/' + item.symbol}><button type="button" className="btn graph-table-btns">Trade</button></Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

        }
      </Container>
    </section>
  );
};

export default MarketInfo;
