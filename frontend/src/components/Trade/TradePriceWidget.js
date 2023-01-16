import React from "react";
const currencyFormatter = require('currency-formatter');

const TradePriceWidget = ({ primaryCoin, secondaryCoin, setPrimaryCoin, setSecondaryCoin, pairs, currencyData, ticketData = { ticketData } }) => {
  const tradingValues = [
    { id: 1, title: "24H Change%", value: ticketData?.percentChange ? ticketData?.percentChange : "0.00", hoverValue: ticketData?.priceChange },
    { id: 2, title: "24H High", value: ticketData?.high ? ticketData?.high : "0.00" },
    { id: 2, title: "24H Low", value: ticketData?.low ? ticketData?.low : "0.00" },
    { id: 3, title: "24H Turnover(USDT)", value: ticketData?.quoteVolume ? currencyFormatter.format(ticketData?.quoteVolume, { code: 'USD' }) : "0.00" }
  ]

  return (
    <>
      <div className="trade-header-info">
        <div className="d-flex align-items-center justify-content-start flex-wrap custom-trade-header">
          <div className="dropdown">
            <button className="btn dropdown-toggle text-white" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
              {primaryCoin?.symbol}/{secondaryCoin?.symbol}
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
              {
                typeof currencyData !== 'undefined' && pairs.map(pair =>
                  <li key={pair} onClick={() => {
                    let a = pair.substring(0, pair.length - 4);
                    let b = pair.substring(pair.length - 4, pair.length);
                    let prim = currencyData?.find((row) => row.symbol == a);
                    let sec = currencyData?.find((row) => row.symbol == b);
                    setPrimaryCoin(prim);
                    setSecondaryCoin(sec);
                    window.history.pushState("", "", '/trade/' + pair);
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
      </div>
    </>
  );
};

export default TradePriceWidget;