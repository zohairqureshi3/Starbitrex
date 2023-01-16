import React from "react";
import Market from "./Market";
const currencyFormatter = require('currency-formatter');

const TradePriceWidget = ({ primaryCoin, secondaryCoin, setPrimaryCoin, setSecondaryCoin, pairs, currencyData, marketChangeAPI, ticketData = { ticketData } }) => {

  const tradingValues = [
    { id: 1, title: "24H Change%", value: ticketData?.percentChange ? ticketData?.percentChange : "0.00", hoverValue: ticketData?.priceChange },
    { id: 2, title: "24H High", value: ticketData?.high ? ticketData?.high : "0.00" },
    { id: 2, title: "24H Low", value: ticketData?.low ? ticketData?.low : "0.00" },
    { id: 3, title: "24H Turnover(USDT)", value: ticketData?.quoteVolume ? currencyFormatter.format(ticketData?.quoteVolume, { code: 'USD' }) : "0.00" }
  ]

  return (
    <>
      <div className="trade-header-info d-flex align-items-center mt-2">
        <div className="d-flex align-items-center justify-content-start flex-wrap custom-trade-header">
          <div className="dropdown">
            <button className="btn dropdown-toggle text-white" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
              {primaryCoin.symbol}/{secondaryCoin.symbol}
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
              {pairs.map(pair =>
                <li key={pair} onClick={() => {
                  let a = pair.substring(0, pair.length - 4);
                  let b = pair.substring(pair.length - 4, pair.length);
                  let prim = currencyData?.find((row) => row.symbol == a);
                  let sec = currencyData?.find((row) => row.symbol == b);
                  setPrimaryCoin(prim);
                  setSecondaryCoin(sec);
                  window.history.pushState("", "", '/trade-spot/' + pair);
                }}>
                  <a className="dropdown-item">{pair}</a>
                </li>
              )}
            </ul>
          </div>

          <h5 className="text-light mx-5">{ticketData?.averagePrice ? ticketData?.averagePrice : '0.00'}</h5>
          {tradingValues.map((e) =>
            <div className="generated-values">
              <h6>{e.title}</h6>
              <p>{e.value}</p>
              {/* { e?.hoverValue ? <p>{e.hoverValue}</p> :  null } */}
            </div>
          )}
        </div>

        {/* <td >{Market.symbol}</td>
        <td>{parseFloat(Market.price).toPrecision()}</td>
          <td>{parseFloat(Market.price?.change) < 0 ? <span className="text-red">{parseFloat(Market.price?.change).toFixed(2)}%</span> : <><span className="text-green">{parseFloat(Market.price?.change).toFixed(2)}%</span></>}</td>
          <td>{parseFloat(Market.change) < 0 ? <span className="text-red">{parseFloat(Market.change).toFixed(2)}$</span> : <><span className="text-green">{parseFloat(Market.change).toFixed(2)}$</span></>}</td> */}
      </div>
    </>
  );
};

export default TradePriceWidget;
