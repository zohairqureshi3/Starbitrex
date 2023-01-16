import React, { useState, useEffect } from "react";
import "rc-slider/assets/index.css";
import Graph from "../shared/Graph";
import Market from "./Market";
import Order from "../shared/Order";
import BuySell from "./BuySell";
import TradePriceWidget from "./TradePriceWidget";
import { useDispatch, useSelector } from "react-redux";
import { getCurrency } from "../../redux/currencies/currencyActions";
import { getUserLeverageOrders } from "../../redux/leverageOrder/leverageOrderActions";
import { io } from "socket.io-client";
import SpotTradeOrdersData from "../shared/SpotTradePageData";
import { getUserSpotOrders } from "../../redux/spotOrder/spotOrderActions";

let localOrderBook = []
let market = []
let futures = []
let futuresCounter = 0
let orderBookCounter = 0

const Index = () => {

  const token = localStorage.getItem("uToken");
  const coins = ['BTCUSDT', 'ETHUSDT', 'LINKUSDT', 'AVAXUSDT', 'DOGEUSDT', 'BCHUSDT', 'LTCUSDT', 'TRXUSDT', 'BNBUSDT', 'ADAUSDT'];
  const [primaryCoin, setPrimaryCoin] = useState("ETH");
  const [secondaryCoin, setSecondaryCoin] = useState("USDT");
  const [updateRate, setupdateRate] = useState(0);
  const [selectedRow, setSelectedRow] = useState("");
  const userSpotOrders = useSelector((state) => state.spotOrder?.userSpotOrders?.userOrders);
  const dispatch = useDispatch();

  const userId = useSelector((state) => state.user?.user?._id);
  const currencyData = useSelector((state) => state.currency?.currencies?.allCurrencies);
  const amounts = useSelector((state) => state.accounts?.account?.amounts);
  const userOrders = useSelector((state) =>
    state.LeverageOrders?.userOrders?.userOrders?.filter(
      (row) =>
        row.fromCurrency._id == primaryCoin?._id &&
        row.toCurrency._id == secondaryCoin?._id
    )
  );

  const [orderBookAPI, setOrderBookAPI] = useState([]);
  const [futureTradesAPI, setFutureTradesAPI] = useState([]);
  const [marketChangeAPI, setMarketChangeAPI] = useState([]);
  const [pairName, setPairName] = useState('ETHUSDT');
  const [socket, setSocket] = useState(null);
  const [currentMarketPrice, setCurrentMarketPrice] = useState(0);
  const [marketPrices, setMarketPrices] = useState([]);
  const [ticketData, setTickerPrice] = useState(0);
  const [startSocket, setStartSocket] = useState(true)

  let socketURL = process.env.REACT_APP_SOCKET_URL; 

  useEffect(() => {
    console.log("restarting");
    if (pairName) {
      if (socket != null) {
        setStartSocket(false)
        socket.disconnect()
        setSocket(io(socketURL, { transports: ['websocket'] }))
        setStartSocket(true)
        localOrderBook = []
        futures = []
        futuresCounter = 0
        orderBookCounter = 0
        setCurrentMarketPrice(0)
        setTickerPrice(0)
        setFutureTradesAPI([])
        setOrderBookAPI([])
      }
    }
  }, [pairName])

  useEffect(() => {
    if (pairName && startSocket) {
      if (socket == null) {
        setSocket(io(socketURL, { transports: ['websocket'] }))
      }

      if (socket) {
        socket.on("connect", () => {
          console.log("Socket id is -->: ", socket.id);
          console.log("pairr", pairName)
        });

        socket.emit("getTickerDataRequest", pairName)
        socket.on("getTickerDataResponse" + pairName, (ticketData) => {
          setTickerPrice(ticketData)
        });


        socket.emit("getCurrentMarketPriceRequest", pairName)
        socket.on("getCurrentMarketPriceResponse" + pairName, (currentMarketPrice) => {
          setMarketPrices(currentMarketPrice)
          setCurrentMarketPrice(parseFloat(currentMarketPrice.find(row => row.symbol == pairName).markPrice))
        });

        socket.emit("getBinanceFutureTradesRequest", pairName);
        socket.on("getBinanceFutureTradesRequestError", (response) => {
          console.log(response)
        });

        socket.on("getBinanceFutureTradesRequestResponse" + pairName, (response) => {
          // console.log("futures trade", response)
          futuresCounter++;
          if (futuresCounter % 20 == 0) {
            futures.unshift(response)
            if (futures.length > 20)
              futures = futures.splice(0, 20)
            setFutureTradesAPI(futures)
            futuresCounter = 0
          }
        });

        socket.emit("getBinanceMarketChangeRequest", coins);
        socket.on("getBinanceMarketChangeRequestError", (response) => {
          console.log(response)
        });
        socket.on("getBinanceMarketChangeRequestResponse", (response) => {
          market.push(response)
          market = [...new Map(market.map((item) => [item['symbol'], item])).values()];
          setMarketChangeAPI(market) // change only single row Response => { TRXUSDT, 703311925.20000000 , 3.071 }
        });

        socket.emit("getBinanceMarketDepthRequest", pairName)
        socket.on("getBinanceMarketDepthRequestError", (response) => {
          console.log(response)
        });
        socket.on("getBinanceMarketDepthRequest" + pairName, (response) => {
          // if (orderBookCounter % 20 == 0) {
          if (localOrderBook !== [] && localOrderBook.a?.length && localOrderBook.b?.length) {
            let data = {
              a: (response.a?.filter(row => (parseFloat(row['1']) > 0)).concat(localOrderBook?.a)).splice(0, 20),
              b: (response.b?.filter(row => (parseFloat(row['1']) > 0)).concat(localOrderBook?.b)).splice(0, 20)
            }
            localOrderBook = data
            setOrderBookAPI(data)
          } else {
            let data = {
              a: [...(response.a.filter(row => (parseFloat(row['1']) > 0)))],
              b: [...(response.b.filter(row => (parseFloat(row['1']) > 0)))]
            }
            localOrderBook = data
            setOrderBookAPI(data)
          }
          orderBookCounter = 0
          // }
          // orderBookCounter++;
        });
      }
    }
  }, [socket]);

  useEffect(() => {
    if (primaryCoin.symbol && secondaryCoin.symbol) {
      setPairName(primaryCoin.symbol + secondaryCoin.symbol)
    }
  }, [primaryCoin]);

  useEffect(() => {
    if (userId) {
      dispatch(getUserSpotOrders(userId));
    }
  }, [userId]);

  useEffect(() => {
    dispatch(getCurrency());
    if (userId) dispatch(getUserLeverageOrders(userId));
  }, [userId]);

  const defaultAssignment = () => {
    let prim = currencyData?.find((row) => row.symbol == "ETH");
    setPrimaryCoin(prim);
    let sec = currencyData?.find((row) => row.symbol == "USDT");
    setSecondaryCoin(sec);
  }

  useEffect(() => {
    if (currencyData) {
      let parseUriSegment = window.location.pathname.split("/");
      if (parseUriSegment[2] && coins.includes(parseUriSegment[2])) {
        let a = parseUriSegment[2].substring(0, parseUriSegment[2].length - 4);
        let prim = currencyData?.find((row) => row.symbol == a);
        if (!prim) {
          defaultAssignment()
          return
        }
        setPrimaryCoin(prim);
        let b = parseUriSegment[2].substring(parseUriSegment[2].length - 4, parseUriSegment[2].length);
        let sec = currencyData.find((row) => row.symbol == b);
        if (!sec) {
          defaultAssignment()
          return
        }
        setSecondaryCoin(sec);
      } else {
        defaultAssignment()
      }
    }
  }, [currencyData]);

  const calculateAverage = (array) => {
    var total = 0;
    var count = 0;
    array.forEach(function (item, index) {
      total += parseFloat(item);
      count++;
    });
    return total / count;
  }

  return (
    <>
      <section className="trade-page starbitrex header-padding trade-spot">
        <TradePriceWidget ticketData={ticketData} primaryCoin={primaryCoin} secondaryCoin={secondaryCoin} setPrimaryCoin={(d) => setPrimaryCoin(d)} setSecondaryCoin={(d) => setSecondaryCoin(d)} pairs={coins} currencyData={currencyData} />
        <div className="container-fluid">
          <div className="trade-main-order">
            <div className="one">

              <Order futureTradesAPI={futureTradesAPI} orderBookAPI={orderBookAPI} selectRate={(rate) => setupdateRate(rate)} primaryCoin={primaryCoin} secondaryCoin={secondaryCoin} />
            </div>
            <div className="two">
              <div className="graph-and-trade-transfer">
                <div className="graph-and-table-wrapper mb-2">
                  <Graph />
                </div>

                <BuySell updateRate={updateRate} selectedRow={selectedRow} primaryCoin={primaryCoin} secondaryCoin={secondaryCoin} setPrimaryCoin={(d) => setPrimaryCoin(d)} setSecondaryCoin={(d) => setSecondaryCoin(d)} marketRate={currentMarketPrice ? currentMarketPrice : 0} />
              </div>
            </div>
            <div className="three">
              <Market marketChangeAPI={marketChangeAPI} />
            </div>
          </div>

          <div className="graph-table trade-spot-graph-table">
            <SpotTradeOrdersData
              userSpotOrders={userSpotOrders}
              rates={marketPrices}
              token={token}
              userOrders={userOrders}
              setSelectedRow={(d) => setSelectedRow(d)}
              setTP={(d) => { }}
              setSL={(d) => { }}
              setTrailingPrice={(d) => { }}
              trailingPrice={0}
              TP={1}
              SL={1}
              primaryCoin={primaryCoin}
              secondaryCoin={secondaryCoin}
            />
          </div>
        </div>
        <div className="batton"></div>
      </section>
    </>
  );
};

export default Index;
