import React, { useEffect, useState } from 'react'
import { Tabs, Tab, Table, Modal, InputGroup, FormControl, NavItem } from "react-bootstrap";
import { Link } from "react-router-dom";
import DataTable, { createTheme } from "react-data-table-component";
import { stopLeverageOrder, updateLeverageOrder, startLeverageOrder, getPnL } from '../../redux/leverageOrder/leverageOrderActions';
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import Slider from 'rc-slider';
import ETH from '../../assets/images/ETH.svg';
import XRP from '../../assets/images/XRP.png';
import USDT from '../../assets/images/USDT.png';
import BTC from '../../assets/images/BTC.svg';
import LTC from '../../assets/images/LTC.svg';
import ADA from '../../assets/images/ADA.svg';
import TRX from '../../assets/images/TRX.svg';
import BCH from '../../assets/images/BCH.svg';
import DOGE from '../../assets/images/DOGE.svg';
import BNB from '../../assets/images/BNB.svg';
import AVAX from '../../assets/images/AVAX.svg';
import USDC from '../../assets/images/USDC.svg';
import LINK from '../../assets/images/LINK.svg';
import EUR from '../../assets/images/EUR.png';
import CAD from '../../assets/images/CAD.png';
import NZD from '../../assets/images/NZD.png';
import AUD from '../../assets/images/AUD.png';
import USD from '../../assets/images/USD.png';
import CNF from '../../assets/images/CoinNotFound.png';


let stopped = []
let started = []

function TradeOrdersDatatables({ setLoader, selectedRow, avbl, updateAvbl, amounts, token, currencyData, userOrders, setSelectedRow, setTP, setSL, TP, SL, rates, setTrailingPrice, trailingPrice }) {
      const [coinAmount, setCoinAmount] = useState(0);
      const [orderRate, setOrderRate] = useState(0);
      const [rate, setRate] = useState(0);
      const [socketResult, setSocketResult] = useState();
      const [pnL, setPnL] = useState(0);
      
      const [showLimit, setShowLimit] = useState(false);
      const [showMarket, setShowMarket] = useState(false);
      const [showTPSL, setShowTPSL] = useState(false);
      const [showTrailing, setShowTrailing] = useState(false);
      const handleShowTrailing = () => setShowTrailing(true);
      const handleCloseTrailing = () => setShowTrailing(false);
      const handleShowTPSL = () => setShowTPSL(true);
      const handleCloseTPSL = () => setShowTPSL(false);
      const handleCloseLimit = () => setShowLimit(false);
      const handleShowLimit = () => setShowLimit(true);
      const handleCloseMarket = () => setShowMarket(false);
      const handleShowMarket = () => setShowMarket(true);
      const [orderId, setOrderId] = useState("");
      const [stopRate, setStopRate] = useState(0);
      const [show, setShow] = useState(false);
      const handleClose = () => setShow(false);
      const handleShow = (id) => setShow(true);
      const handleStop = () => {
            dispatch(stopLeverageOrder(orderId, parseFloat(stopRate), false));
            wait(5000); setLoader(true);
            setShow(false);
            setOrderId("");
            setStopRate(0);
      };
      const [percentage, setPercentage] = useState(0 + "%");

      const dispatch = useDispatch();
      const getCoinImg = (name) => {
            if (name == 'ETH')
                  return ETH;
            else if (name == 'BTC')
                  return BTC;
            else if (name == 'XRP')
                  return XRP;
            else if (name == 'USDT')
                  return USDT;
            else if (name == 'LTC')
                  return LTC;
            else if (name == 'DOGE')
                  return DOGE;
            else if (name == 'ADA')
                  return ADA;
            else if (name == 'TRX')
                  return TRX;
            else if (name == 'BCH')
                  return BCH;
            else if (name == 'BNB')
                  return BNB;
            else if (name == 'TBNB')
                  return BNB;
            else if (name == 'AVAX')
                  return AVAX;
            else if (name == 'USDC')
                  return USDC;
            else if (name == 'LINK')
                  return LINK;
            else if (name == 'EUR')
                  return EUR;
            else if (name == 'CAD')
                  return CAD;
            else if (name == 'NZD')
                  return NZD;
            else if (name == 'AUD')
                  return AUD;
            else if (name == 'USD')
                  return USD;

            return CNF;
      };

      createTheme(
            "solarizedd",
            {
                  text: {
                        primary: "#fff",
                        secondary: "#fff",
                  },
                  background: {
                        // default: "rgba(33, 34, 46, 1)",
                        default: "#13141c",
                  },
                  context: {
                        // background: "rgba(33, 34, 46, 1)",
                        background: "#13141c",
                        text: "#FFFFFF",
                  },
                  divider: {
                        default: "#fff",
                  },
                  action: {
                        button: "rgba(0,0,0,.54)",
                        hover: "rgba(0,0,0,.08)",
                        disabled: "rgba(0,0,0,.12)",
                  },
            },
            "dark"
      );

      function wait(ms) {
            var start = new Date().getTime();
            var end = start;
            while (end < start + ms) {
                  end = new Date().getTime();
            }
      }

      const marks = {
            0: "0%",
            25: "25%",
            50: "50%",
            75: "75%",
            100: "100%",
      };

      function rangeValue(value) {
            let val = value;
            setPercentage(val + "%");
            if (avbl) {
                  setCoinAmount(avbl * (val / 100));
            }
      }

      useEffect(() => {
            rates && userOrders && userOrders?.length && userOrders.filter((row) => row.status == 1).map(async (row) => {
                  let marketRate = parseFloat(rates ? rates?.find(line => line.symbol == row.pairName).markPrice : 0)
                  if (marketRate) {
                        let stop = 0;
                        if (
                              (row.tradeType == 1 && marketRate !== 0 && (parseFloat(marketRate) <= parseFloat(row.tradeEndPrice))) ||
                              (row.tradeType == 0 && marketRate !== 0 && (parseFloat(marketRate) >= parseFloat(row.tradeEndPrice)))
                        ) {
                              stop = parseFloat(row.tradeEndPrice);
                        }
                        if (
                              (row.tradeType == 1 && marketRate !== 0 && (row.tpsl && parseFloat(marketRate) >= parseFloat(row.takeProfitPrice))) ||
                              (row.tradeType == 0 && marketRate !== 0 && (row.tpsl && parseFloat(marketRate) <= parseFloat(row.takeProfitPrice)))
                        ) {

                              stop = parseFloat(row.takeProfitPrice);
                        }
                        if (
                              (row.tradeType == 1 && marketRate !== 0 && (row.tpsl && parseFloat(marketRate) <= parseFloat(row.stopLossPrice))) ||
                              (row.tradeType == 0 && marketRate !== 0 && (row.tpsl && parseFloat(marketRate) >= parseFloat(row.stopLossPrice)))
                        ) {
                              stop = parseFloat(row.stopLossPrice);
                        }
                        if (
                              (row.tradeType == 1 && marketRate !== 0 && (row.tradeTrailingPrice && parseFloat(parseFloat(marketRate).toFixed(2)) >= parseFloat(row.tradeTrailingPrice))) ||
                              (row.tradeType == 0 && marketRate !== 0 && (row.tradeTrailingPrice && parseFloat(parseFloat(marketRate).toFixed(2)) <= parseFloat(row.tradeTrailingPrice)))
                        ) {
                              stop = parseFloat(row.tradeTrailingPrice);
                        }
                        if (stop !== 0 && !stopped.includes(row._id)) {
                              stopped.push(row._id)
                              dispatch(stopLeverageOrder(row._id, stop, true));
                              await wait(5000);
                        }
                  }
            })

            userOrders && userOrders?.length && userOrders?.filter(row => row.futuresOrder == 1).filter((row) => row.status == 0).map(async row => {
                  let rate = parseFloat(rates ? rates?.find(line => line.symbol == row.pairName).markPrice : 0)
                  if (
                        (row.tradeType == 1 && rate !== 0 && (parseFloat(parseFloat(rate).toFixed(2)) >= parseFloat(parseFloat(row.tradeStartPrice).toFixed(2)))) ||
                        (row.tradeType == 0 && rate !== 0 && (parseFloat(parseFloat(rate).toFixed(2)) <= parseFloat(parseFloat(row.tradeStartPrice).toFixed(2))))
                  ) {
                        console.log("in start");
                        if (!started.includes(row._id)) {
                              console.log("starting", row._id)
                              started.push(row._id)
                              let startdata = { ...row };
                              startdata.fromCurrency = row.fromCurrency._id
                              startdata.toCurrency = row.toCurrency._id
                              dispatch(startLeverageOrder(startdata));
                              await wait(5000);
                        }
                  }
            })

            let PnL = 0
            userOrders && userOrders?.length && userOrders?.filter(row => (row.futuresOrder == 1 && row.marginType == 0 && row.status == 1)).forEach(ordr => {
                  // PnL
                  PnL = PnL + parseFloat(document.getElementById(ordr?._id + "pnl")?.innerText)
            })

            if (PnL) {
                  let vall = avbl + PnL
                  updateAvbl(vall > 0 ? vall : 0)
            }

      }, [rates])

      const getInnitialMargin = (row) => {
            let val = ((parseFloat(row.qty) * parseFloat(row.tradeStartPrice)) / parseFloat(row.leverage))  //Initial margin
            return (val && !isNaN(val) ? val : 0);
      }

      const getPositionMargin = (row) => {
            //Qty / (entry price x leverage) /  ( Bankruptcy Price = Entry Price * (Leverage / Leverage + 1) )
            let val =
                  parseFloat(
                        getInnitialMargin(row)  //Initial margin
                        +
                        (getInnitialMargin(row) * 0.03) // 3%  of  Initial margin 
                  ).toFixed(4)

            return (val && !isNaN(val) ? val : 0) + " " + row?.fromCurrency?.symbol;
      }

      const getUnrealizedPnL = (row) => {
            let rate = parseFloat(rates ? rates?.find(line => line.symbol == row.pairName).markPrice : 0)
            let val = row?.tradeType == 1 ? //buy
                  parseFloat(row?.qty) * (parseFloat(rate) - parseFloat(row?.tradeStartPrice))
                  : //sell
                  parseFloat(row?.qty) * (parseFloat(row?.tradeStartPrice) - parseFloat(rate))
                  
            return val && !isNaN(val) ? val : 0;
      }

      const getLiquidationPrice = (data) => {
            let side = 0
            if (data.tradeType == 0) { side = -1 } else { side = 1 }
            let wb = 0
            let tmm = 0
            let UNPL = 0
            if (data.marginType == 0) { // cross
                  wb = (parseFloat(avbl) + parseFloat(data.userInvestedAmount))
                  // const otherOrders = await LeverageOrder.find({ userId: data.userId, status: "1" });
                  userOrders.filter(row => (row.futuresOrder == 1 && row._id != data._id)).filter((row) => row.status == 1).forEach(ordr => {
                        // tmm
                        if (ordr.maintenanceMargin)
                              tmm = tmm + ((parseFloat(ordr.qty) * parseFloat(rates ? rates?.find(line => line.symbol == ordr.pairName).markPrice : 0)) * (parseFloat(ordr.maintenanceMargin) / 100) - parseFloat(ordr.maintenanceAmount))
                        // UNPL
                        UNPL = UNPL + parseFloat(document.getElementById(ordr?._id + "pnl")?.innerText)
                  })
            } else { // isolated
                  wb = parseFloat(data.userInvestedAmount)
            }
            let liqPrice =
                  (
                        wb - tmm + UNPL + data.maintenanceAmount
                        -
                        side
                        *
                        data.qty
                        *
                        data.tradeStartPrice
                  )
                  /
                  (
                        data.qty
                        *
                        (data.maintenanceMargin / 100)
                        -
                        side
                        *
                        data.qty
                  )
            return liqPrice ? liqPrice : 0;
      }

      const openOrdersColumns = [
            {
                  name: 'Contracts',
                  selector: row => <>
                        <b> {row.pairName} </b>
                        <div> {row.marginType == 0 ? "Cross" : "Isolated"} <span className={row.tradeType == 1 ? "text-green" : "text-red"}>{row.leverage}x</span> </div>
                  </>,
                  sortable: true,
            },
            {
                  name: 'Qty',
                  selector: row => parseFloat(row.qty).toFixed(2) + " " + row?.toCurrency?.symbol,
                  sortable: true,
            },
            {
                  name: 'Value',
                  selector: row => parseFloat(parseFloat(row.qty) * parseFloat(row.tradeStartPrice)).toFixed(2) + " " + row?.fromCurrency?.symbol,
                  sortable: true,
            },
            {
                  name: 'Entry Price',
                  selector: row => parseFloat(row.tradeStartPrice).toFixed(2) + " " + row?.fromCurrency?.symbol,
                  sortable: true,
            },
            {
                  name: 'Mark Price',
                  selector: row => (rates ? parseFloat(rates?.find(line => line.symbol == row?.pairName).markPrice).toFixed(2) : 0) + " " + row?.fromCurrency?.symbol,
                  sortable: true,
            },
            {
                  name: 'Liq. Price',
                  // selector: row => parseFloat(row.tradeEndPrice).toFixed(2) + " " + row?.fromCurrency?.symbol,
                  selector: row =>
                        <>
                              <span id={row?._id + "liq"}> {parseFloat(getLiquidationPrice(row)).toFixed(2)} </span>
                              <span>  {" " + row?.fromCurrency?.symbol} </span>
                        </>,
                  sortable: true,
            },
            {
                  name: 'Position Margin',
                  selector: row => getPositionMargin(row),
                  sortable: true,
            },
            {
                  name: 'Unrealized P&L (%)',
                  selector: row => {
                        setRate(parseFloat(getUnrealizedPnL(row) / (row.tradeType == 1 ? parseFloat(row.userInvestedAmount) : (parseFloat(row.userInvestedAmount) * parseFloat(row.tradeStartPrice)))).toFixed(4))
                        setPnL(parseFloat(getUnrealizedPnL(row)).toFixed(2));
                        setSocketResult(pnL);
                        dispatch(getPnL(pnL));
                        
                      return rates ? <span className={(getUnrealizedPnL(row) >= 0 ? 'text-green' : 'text-red') + ' d-flex flex-column'}>
                        <>
                              <span id={row?._id + "pnl"}> {parseFloat(getUnrealizedPnL(row)).toFixed(4)} </span>
                              <span> {+ " " + row?.fromCurrency?.symbol}</span>
                        </> 
                        <span> {rate}  % </span>
                        <span> { pnL + " USD"} </span>
                  </span> : "" },
                  sortable: true,
            },
            {
                  name: 'Daily Realized P&L',
                  selector: row => <span className='text-green'>0</span>,
                  sortable: true,
            },
            {
                  name: 'TP/SL',
                  selector: row =>
                        <span>
                              {row.tpsl ?
                                    <>
                                          {row.takeProfitPrice ? row.takeProfitPrice + " " + row?.fromCurrency?.symbol : "-"} / {row.stopLossPrice ? row.stopLossPrice + " " + row?.fromCurrency?.symbol : "-"}
                                          <button type="button" onClick={() => { setSelectedRow(row); handleShowTPSL(); setTP(row.takeProfitPrice); setSL(row.stopLossPrice) }} className="btn graph-table-btns ms-2"> <FontAwesomeIcon icon={faPencil} className="header-icon" /> </button>

                                    </>
                                    :
                                    <button type="button" onClick={() => {
                                          setSelectedRow(row); handleShowTPSL()
                                    }} className="btn graph-table-btns">+ Add</button>
                              }
                        </span>,
                  sortable: true,
            },
            {
                  name: 'Trailing Stop',
                  selector: row => <span>
                        {row.tradeTrailingPrice ?
                              <>
                                    {row.tradeTrailingPrice ? row.tradeTrailingPrice + " " + row?.fromCurrency?.symbol : "-"}
                                    <button type="button" onClick={() => { setSelectedRow(row); handleShowTrailing(); setTrailingPrice(row.tradeTrailingPrice) }} className="btn graph-table-btns ms-2"> <FontAwesomeIcon icon={faPencil} className="header-icon" /> </button>

                              </>
                              :
                              <button type="button" onClick={() => {
                                    setSelectedRow(row); handleShowTrailing()
                              }} className="btn graph-table-btns">+ Add</button>

                        }
                  </span>,
                  sortable: true,
            },
            {
                  name: 'ADL',
                  selector: row => "-",
                  sortable: true,
            },
            {
                  name: 'Close By',
                  selector: row => <>
                        <div className="d-flex">
                              <button type="button" onClick={() => { setStopRate(rates ? rates?.find(line => line.symbol == row.pairName).markPrice : 0); setOrderId(row?._id); handleShow() }} className="btn graph-table-btns me-2">Stop</button>
                        </div>
                  </>,
                  sortable: true,
            },
      ]
      const pendingOrdersColumns = [
            {
                  name: 'Contracts',
                  selector: row => <>
                        <b> {row.pairName} </b>
                        <div> {row.marginType == 0 ? "Cross" : "Isolated"} <span className={row.tradeType == 1 ? "text-green" : "text-red"}>{row.leverage}x</span> </div>
                  </>,
                  sortable: true,
            },
            {
                  name: 'Qty',
                  selector: row => parseFloat(row.qty).toFixed(2) + " " + row?.toCurrency?.symbol,
                  sortable: true,
            },
            {
                  name: 'Value',
                  selector: row => parseFloat(parseFloat(row.qty) * parseFloat(row.tradeStartPrice)).toFixed(2) + " " + row?.fromCurrency?.symbol,
                  sortable: true,
            },
            {
                  name: 'Entry Price',
                  selector: row => parseFloat(row.tradeStartPrice).toFixed(2) + " " + row?.fromCurrency?.symbol,
                  sortable: true,
            },
            {
                  name: 'Mark Price',
                  selector: row => (rates ? parseFloat(rates?.find(line => line.symbol == row?.pairName).markPrice).toFixed(2) : 0) + " " + row?.fromCurrency?.symbol,
                  sortable: true,
            },
            {
                  name: 'Liq. Price',
                  selector: row =>
                        <>
                              <span id={row?._id + "liq"}> {parseFloat(getLiquidationPrice(row)).toFixed(2)} </span>
                              <span>  {" " + row?.fromCurrency?.symbol} </span>
                        </>,
                  sortable: true,
            },

            {
                  name: 'Close By',
                  selector: row => <>
                        <div className="d-flex">
                              <button type="button" onClick={() => { setCoinAmount(parseFloat(row.qty) / parseFloat(row.leverage)); setSelectedRow(row); setOrderRate(row.tradeStartPrice); handleShowLimit() }} className="btn graph-table-btns me-2">Limit</button>
                              <button type="button" onClick={() => { setCoinAmount(parseFloat(row.qty) / parseFloat(row.leverage)); setSelectedRow(row); setOrderRate(row.tradeStartPrice); handleShowMarket() }} className="btn graph-table-btns me-2">Market</button>
                              <button type="button" onClick={() => { setStopRate(0); setOrderId(row?._id); handleShow() }} className="btn graph-table-btns">Stop</button>
                        </div>
                  </>,
                  sortable: true,
            },
      ]

      const orderHistoryColumns = [
            {
                  name: 'Contracts',
                  selector: row => <>
                        <b> {row.pairName} </b>
                        <div> {row.marginType == 0 ? "Cross" : "Isolated"} <span className={row.tradeType == 1 ? "text-green" : "text-red"}>{row.leverage}x</span> </div>
                  </>,
                  sortable: true,
            },
            {
                  name: 'Filled/Total',
                  selector: row =>
                        ((row.marketOrder !== '1' && row.triggered == true) ? parseFloat(row.qty).toFixed(2) : "0.00")
                        + "/" +
                        parseFloat(row.qty).toFixed(2) + " " + row?.toCurrency?.symbol,
                  sortable: true,
            },
            {
                  name: 'Order Price',
                  selector: row => parseFloat(row.tradeStartPrice).toFixed(2) + " " + row?.fromCurrency?.symbol,
                  sortable: true,
            },
            {
                  name: 'Trigger Price',
                  selector: row => (row.marketOrder !== '1' && row.triggered == true) ? parseFloat(row.tradeStartPrice).toFixed(2) + " " + row?.fromCurrency?.symbol : "-",
                  sortable: true,
            },
            {
                  name: 'Liq. Price',
                  selector: row =>
                        <>
                              <span id={row?._id + "liq"}> {parseFloat(getLiquidationPrice(row)).toFixed(2)} </span>
                              <span>  {" " + row?.fromCurrency?.symbol} </span>
                        </>,
                  sortable: true,
            },
            {
                  name: 'Exit Price',
                  selector: row => row.exitPrice ? parseFloat(row.exitPrice).toFixed(2) + " " + row?.fromCurrency?.symbol : "-",
                  sortable: true,
            },


            {
                  name: 'Realized P&L',
                  selector: row => <span className={row.tradeProfitOrLoss >= 0 ? 'text-green' : 'text-red'}> {parseFloat(row.tradeProfitOrLoss).toFixed(2)} </span>,
                  sortable: true,
            },

            {
                  name: 'Trade Type',
                  selector: row => row.tradeType == 1 ? "Buy" : "Sell",
                  sortable: true,
            },
            {
                  name: 'Order Type',
                  selector: row => row.marketOrder == 1 ? "Market" : "Limit",
                  sortable: true,
            },

            {
                  name: 'Status',
                  selector: row => row.status == 1 ? "Processing"
                        : row.status == 2 ? "Completed"
                              : row.status == 3 ? "Stopped"
                                    : "Created",
                  sortable: true,
            },
      ]

      const accountColumns = [
            {
                  name: "Symbol",
                  selector: (coin) => currencyData?.find(
                        (row) => row._id == coin.currencyId
                  )?.symbol,
                  cell: (coin) => {
                        let coinSymbol = currencyData?.find(
                              (row) => row._id == coin.currencyId
                        )?.symbol;
                        return (
                              <Link className="portfilio-link" to={'/activity/' + coinSymbol}>
                                    <div className="portfolio-coin d-flex align-items-center">
                                          <img src={getCoinImg(coinSymbol)} alt="btc" className="img-fluid me-2 coin-img p-2" />
                                          <div>
                                                <p className="name m-0">{currencyData?.find(
                                                      (row) => row._id == coin.currencyId
                                                )?.name}</p>
                                                <p className="symbol m-0">{coinSymbol}</p>
                                          </div>
                                    </div>
                              </Link>
                        );
                  },
                  sortable: true,
            },
            {
                  name: 'Spot Wallet Amount',
                  selector: coin => parseFloat(coin.amount).toFixed(2),
                  sortable: true,
            },
            {
                  name: 'Future Wallet Amount',
                  selector: coin => parseFloat(coin.futures_amount).toFixed(2),
                  sortable: true,
            },
      ]

      const handleLimit = (val, update = 0) => {
            if (avbl) {
                  var validNumber = new RegExp(/^\d*\.?\d*$/);
                  // console.log(parseFloat(val), avbl, update, parseFloat(avbl) + update);
                  if (
                        !val.toString().match(validNumber) ||
                        parseFloat(val) > (parseFloat(avbl) + update)
                  ) {
                        Swal.fire({
                              text: "Invalid number entered. Please enter a valid number",
                              icon: "info",
                              showCancelButton: false,
                              confirmButtonText: "OK",
                        });
                        setCoinAmount(0);
                        // setPercentage(0 + "%");
                  }
            }
      };

      const updateMarket = () => {
            let data = { ...selectedRow };
            data.tpsl = true;
            data.tradeStartPrice = parseFloat(orderRate);
            data.userInvestedAmount = data.tradeType == 1 ? parseFloat(coinAmount) * parseFloat(orderRate) : parseFloat(coinAmount);
            data.qty = parseFloat(coinAmount) * parseFloat(data.leverage);
            data.fromCurrency = data.fromCurrency._id
            data.toCurrency = data.toCurrency._id
            dispatch(updateLeverageOrder(data));
            handleCloseMarket()
            handleCloseLimit()
            setLoader(true);
      }


      const updateTPSL = () => {
            let data = { ...selectedRow };
            data.tpsl = true;
            data.takeProfitPrice = parseFloat(TP);
            data.stopLossPrice = parseFloat(SL);
            data.fromCurrency = data.fromCurrency._id
            data.toCurrency = data.toCurrency._id
            dispatch(updateLeverageOrder(data));
            handleCloseTPSL()
            setLoader(true);
      }

      const updateTrailing = () => {
            let data = { ...selectedRow };
            data.tradeTrailingPrice = parseFloat(trailingPrice);
            data.tradeTrailingDifference = parseFloat(trailingPrice) > parseFloat(data.tradeStartPrice) ? parseFloat(trailingPrice) - parseFloat(data.tradeStartPrice) : parseFloat(data.tradeStartPrice) - parseFloat(trailingPrice);
            data.fromCurrency = data.fromCurrency._id
            data.toCurrency = data.toCurrency._id
            dispatch(updateLeverageOrder(data));
            handleCloseTrailing()
            setLoader(true);
      }

      return (
            <>
                 <Tabs defaultActiveKey="open" className="">
                        <Tab eventKey="open" title="Open Orders">
                              {userOrders && userOrders.length ? (
                                    <DataTable
                                          columns={openOrdersColumns}
                                          data={userOrders.filter(row => row.futuresOrder == 1).filter((row) => row.status == 1)}
                                          pagination
                                          fixedHeader
                                          persistTableHead
                                          theme='solarizedd'
                                    />
                              ) : (
                                    <Table responsive className="">
                                          <thead>
                                                <tr>
                                                      <th scope="col">Contracts</th>
                                                      <th scope="col">Qty</th>
                                                      <th scope="col">Value</th>
                                                      <th scope="col">Entry Price</th>
                                                      <th scope="col">Mark Price</th>
                                                      <th scope="col">Liq. Price</th>
                                                      <th scope="col">Position Margin</th>
                                                      <th scope="col">Unrealized P&L (%)</th>
                                                      <th scope="col">Daily Realized P&L</th>
                                                      <th scope="col">TP/SL</th>
                                                      {/* <th scope="col">Status</th> */}
                                                      <th scope="col">Trailing Stop</th>
                                                      <th scope="col">ADL</th>
                                                      <th scope="col">Close By</th>
                                                </tr>
                                          </thead>
                                          <tbody>
                                                <td colSpan="13">
                                                      {token ? (
                                                            "Empty"
                                                      ) : (
                                                            <div className="graph-table-btns buy-tabs">
                                                                  <Link to="/register">
                                                                        <button
                                                                              type="button"
                                                                              className="mb-2 register-now"
                                                                        >
                                                                              Register Now
                                                                        </button>
                                                                  </Link>
                                                                  <Link to="/login">
                                                                        <button type="button" className="login-now">
                                                                              Log In
                                                                        </button>
                                                                  </Link>
                                                            </div>
                                                      )}
                                                </td>
                                          </tbody>
                                    </Table>
                              )}
                        </Tab>
                        <Tab eventKey="pending" title="Pending Orders">
                              {userOrders && userOrders.length ? (
                                    <DataTable
                                          columns={pendingOrdersColumns}
                                          data={userOrders.filter(row => row.futuresOrder == 1).filter((row) => row.status == 0)}
                                          pagination
                                          fixedHeader
                                          persistTableHead
                                          theme='solarizedd'
                                    />
                              ) : (
                                    <Table responsive className="">
                                          <thead>
                                                <tr>
                                                      <th scope="col">Contracts</th>
                                                      <th scope="col">Qty</th>
                                                      <th scope="col">Value</th>
                                                      <th scope="col">Entry Price</th>
                                                      <th scope="col">Mark Price</th>
                                                      <th scope="col">Liq. Price</th>
                                                      {/* <th scope="col">Position Margin</th>
                                                      <th scope="col">Unrealized P&L (%)</th>
                                                      <th scope="col">Daily Realized P&L</th>
                                                      <th scope="col">TP/SL</th>
                                                      <th scope="col">Status</th>
                                                      <th scope="col">Trailing Stop</th>
                                                      <th scope="col">ADL</th> */}
                                                      <th scope="col">Close By</th>
                                                </tr>
                                          </thead>
                                          <tbody>
                                                <td colSpan="7">
                                                      {token ? (
                                                            "Empty"
                                                      ) : (
                                                            <div className="graph-table-btns buy-tabs">
                                                                  <Link to="/register">
                                                                        <button
                                                                              type="button"
                                                                              className="mb-2 register-now"
                                                                        >
                                                                              Register Now
                                                                        </button>
                                                                  </Link>
                                                                  <Link to="/login">
                                                                        <button type="button" className="login-now">
                                                                              Log In
                                                                        </button>
                                                                  </Link>
                                                            </div>
                                                      )}
                                                </td>
                                          </tbody>
                                    </Table>
                              )}
                        </Tab>
                        <Tab eventKey="history" title="Order History">
                              {userOrders && userOrders.length ? (
                                    <DataTable
                                          columns={orderHistoryColumns}
                                          data={userOrders.filter(row => row.futuresOrder == 1).filter((row) => row.status == 2 || row.status == 3)}
                                          pagination
                                          fixedHeader
                                          persistTableHead
                                          theme='solarizedd'
                                    />
                              ) : (
                                    <Table responsive className="">
                                          <thead>
                                                <tr>
                                                      <th scope="col">Contracts</th>
                                                      <th scope="col">Filled/Total</th>
                                                      <th scope="col">Order Price</th>
                                                      <th scope="col">Trigger Price</th>
                                                      <th scope="col">Liq. Price</th>
                                                      <th scope="col">Exit Price</th>
                                                      <th scope="col">Realized P&L</th>
                                                      <th scope="col">Trade Type</th>
                                                      <th scope="col">Order Type</th>
                                                      <th scope="col">Status</th>
                                                </tr>
                                          </thead>
                                          <tbody>
                                                <td colSpan="10">
                                                      {token ? (
                                                            "Empty"
                                                      ) : (
                                                            <div className="graph-table-btns buy-tabs">
                                                                  <Link to="/register">
                                                                        <button
                                                                              type="button"
                                                                              className="mb-2 register-now"
                                                                        >
                                                                              Register Now
                                                                        </button>
                                                                  </Link>
                                                                  <Link to="/login">
                                                                        <button type="button" className="login-now">
                                                                              Log In
                                                                        </button>
                                                                  </Link>
                                                            </div>
                                                      )}
                                                </td>
                                          </tbody>
                                    </Table>
                              )}
                        </Tab>
                        <Tab eventKey="assets" title="Assets">
                              {amounts && amounts.length ? (
                                    <DataTable
                                          columns={accountColumns}
                                          data={amounts?.sort((a, b) => b.amount - a.amount).filter((coin) => {
                                                return currencyData?.find((cur) => {
                                                      return cur._id == coin.currencyId;
                                                })
                                          })}
                                          pagination
                                          fixedHeader
                                          persistTableHead
                                          theme='solarizedd'
                                    />
                              ) : (
                                    <Table responsive className="">
                                          <thead>
                                                <tr>
                                                      <th scope="col">Symbol</th>
                                                      <th scope="col">Coin</th>
                                                      <th scope="col">Spot Wallet Amount</th>
                                                      <th scope="col">Future Wallet Amount</th>
                                                </tr>
                                          </thead>
                                          <tbody>
                                                <td colSpan="4">
                                                      {token ? (
                                                            "Empty"
                                                      ) : (
                                                            <div className="graph-table-btns buy-tabs">
                                                                  <Link to="/register">
                                                                        <button
                                                                              type="button"
                                                                              className="mb-2 register-now"
                                                                        >
                                                                              Register Now
                                                                        </button>
                                                                  </Link>
                                                                  <Link to="/login">
                                                                        <button type="button" className="login-now">
                                                                              Log In
                                                                        </button>
                                                                  </Link>
                                                            </div>
                                                      )}
                                                </td>
                                          </tbody>
                                    </Table>
                              )}
                        </Tab>
                  </Tabs>
                 
                  

                  <Modal className="withdrawal-modal limit-modal tp-sl-modal" show={showTPSL} centered onHide={handleCloseTPSL}>
                        <Modal.Header closeButton>
                        </Modal.Header>
                        <Modal.Body>
                              <div className="buy-tabs">
                                    <div className="mb-4"><span className="text-white">TP/SL</span></div>

                                    <div className="d-flex justify-content-between mb-2">
                                          <span className="text-white">Entry Price</span>
                                          <span className="text-white">{selectedRow.tradeStartPrice}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-4">
                                          <span className="text-white">Liq. Price</span>
                                          <span className="text-green">{selectedRow.tradeEndPrice}</span>
                                    </div>

                                    <div className="take-profit-usdt">
                                          <div className="d-flex justify-content-between mb-1">
                                                <span className="text-white">Take Profit USDT</span>
                                                <span className="text-white">Last Traded Price</span>
                                          </div>
                                          <InputGroup className="mb-3">
                                                <FormControl
                                                      type="number"
                                                      placeholder="Take Profit"
                                                      min="0"
                                                      value={TP}
                                                      onChange={(e) => setTP(e.target.value)}
                                                />
                                                <InputGroup.Text id="basic-addon2">
                                                      {selectedRow?.fromCurrency?.symbol}
                                                </InputGroup.Text>
                                          </InputGroup>
                                    </div>

                                    <div className="stop-loss-usdt">
                                          <div className="d-flex justify-content-between mb-1">
                                                <span className="text-white">Stop Loss {selectedRow?.fromCurrency?.symbol}</span>
                                                <span className="text-white">Last Traded Price</span>
                                          </div>
                                          <InputGroup className="mb-3">
                                                <FormControl
                                                      type="number"
                                                      placeholder="Stop Loss"
                                                      min="0"
                                                      value={SL}
                                                      onChange={(e) => setSL(e.target.value)}
                                                />
                                                <InputGroup.Text id="basic-addon2">
                                                      {selectedRow?.fromCurrency?.symbol}
                                                </InputGroup.Text>
                                          </InputGroup>
                                    </div>
                              </div>

                              <div className="limit-modal-btns">
                                    <button type="button" onClick={() => updateTPSL()} className="btn confirm">Confirm</button>
                                    <button type="button" onClick={handleCloseTPSL} className="btn cancel">Cancel</button>
                              </div>

                        </Modal.Body>
                  </Modal>

                  <Modal className="withdrawal-modal limit-modal tp-sl-modal" show={showTrailing} centered onHide={handleCloseTrailing}>
                        <Modal.Header closeButton>
                        </Modal.Header>
                        <Modal.Body>
                              <div className="buy-tabs">
                                    <div className="mb-4"><span className="text-white">Trailing Stop</span></div>

                                    <div className="d-flex justify-content-between mb-2">
                                          <span className="text-white">Entry Price</span>
                                          <span className="text-white">{selectedRow.tradeStartPrice}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-4">
                                          <span className="text-white">Liq. Price</span>
                                          <span className="text-green">{selectedRow.tradeEndPrice}</span>
                                    </div>

                                    <div className="stop-loss-usdt">
                                          <div className="d-flex justify-content-between mb-1">
                                                <span className="text-white">Trailing Stop {selectedRow?.fromCurrency?.symbol}</span>
                                                {/* <span className="text-white">Last Traded Price</span> */}
                                          </div>
                                          <InputGroup className="mb-3">
                                                <FormControl
                                                      type="number"
                                                      placeholder="Trailing Stop"
                                                      min="0"
                                                      value={trailingPrice}
                                                      onChange={(e) => setTrailingPrice(e.target.value)}
                                                />
                                                <InputGroup.Text id="basic-addon2">
                                                      {selectedRow?.fromCurrency?.symbol}
                                                </InputGroup.Text>
                                          </InputGroup>
                                    </div>
                              </div>

                              <div className="limit-modal-btns">
                                    <button type="button" onClick={() => updateTrailing()} className="btn confirm">Confirm</button>
                                    <button type="button" onClick={handleCloseTrailing} className="btn cancel">Cancel</button>
                              </div>

                        </Modal.Body>
                  </Modal>

                  <Modal className="withdrawal-modal limit-modal" show={showLimit} centered onHide={handleCloseLimit} backdrop="static">
                        <Modal.Header closeButton>
                        </Modal.Header>
                        <Modal.Body>
                              <div className="buy-tabs">
                                    <div className="mb-4"><span className="text-white">Limit Close</span></div>
                                    <span className="text-white">Entry Price {selectedRow?.toCurrency?.symbol}</span>
                                    <InputGroup className="mb-4">
                                          <FormControl
                                                placeholder="Rate"
                                                aria-label=""
                                                aria-describedby=""
                                                value={orderRate}
                                                onChange={(e) => { setOrderRate(e.target.value) }}
                                          />
                                          <InputGroup.Text
                                                className="point"
                                                onClick={() => {
                                                      setRate(!rate);
                                                }}
                                          >
                                                +/-
                                          </InputGroup.Text>
                                    </InputGroup>
                                    <span className="text-white">Order by Qty {selectedRow?.toCurrency?.symbol}</span>
                                    <InputGroup className="mb-3">
                                          <FormControl
                                                type="number"
                                                step="0.1"
                                                placeholder="Price"
                                                min="0.0"
                                                max={avbl ? avbl + selectedRow.userInvestedAmount : 10000000}
                                                value={coinAmount}
                                                onChange={(e) => {
                                                      let val = e.target.value;
                                                      setCoinAmount(val);
                                                }}
                                                onBlur={(e) => handleLimit(e.target.value, parseFloat(selectedRow.userInvestedAmount))}
                                          />
                                          <InputGroup.Text id="basic-addon2">
                                                {selectedRow?.toCurrency?.symbol}
                                          </InputGroup.Text>
                                    </InputGroup>

                                    <Slider
                                          min={0}
                                          step={0.1}
                                          marks={marks}
                                          defaultValue={[0, 25, 50, 75, 100]}
                                          value={percentage.replace('%', '')}
                                          onChange={rangeValue}
                                          className="mb-4 range-slider"
                                    />
                                    <p style={{ fontSize: "12px", padding: "0 12px" }} className="">4.70 contract(s) will be closed at 1,216.65 price, and your expected points will be 9.7290USDT (includng of EST, closing tees 3.4309USDT)</p>

                              </div>
                              <div className="limit-modal-btns">
                                    <button type="button" onClick={() => updateMarket()} className="btn confirm">Confirm</button>
                                    <button type="button" onClick={handleCloseLimit} className="btn cancel">Cancel</button>
                              </div>
                        </Modal.Body>
                  </Modal>

                  <Modal className="withdrawal-modal limit-modal market-modal" show={showMarket} centered onHide={handleCloseMarket}>
                        <Modal.Header closeButton>
                        </Modal.Header>
                        <Modal.Body>
                              <div className="buy-tabs">
                                    <div className="mb-4"><span className="text-white">Market Close</span></div>

                                    <span className="text-white">Order by Qty {selectedRow?.toCurrency?.symbol}</span>
                                    <InputGroup className="mb-3">

                                          <FormControl
                                                type="number"
                                                step="0.1"
                                                placeholder="Price"
                                                min="0.0"
                                                max={avbl ? avbl + selectedRow.userInvestedAmount : 10000000}
                                                value={coinAmount}
                                                onChange={(e) => {
                                                      let val = e.target.value;
                                                      setCoinAmount(val);
                                                }}
                                                onBlur={(e) => handleLimit(e.target.value, parseFloat(selectedRow.userInvestedAmount))}
                                          />
                                          <InputGroup.Text id="basic-addon2">
                                                {selectedRow?.toCurrency?.symbol}
                                          </InputGroup.Text>
                                    </InputGroup>

                                    <p style={{ fontSize: "12px", padding: "0 12px" }} className="mb-4 mt-2">4.70 contract(s) will be closed at 1,216.65 price, and your expected points will be 9.7290USDT (includng of EST, closing tees 3.4309USDT)</p>
                              </div>
                              <div className="limit-modal-btns">
                                    <button type="button" onClick={() => updateMarket()} className="btn confirm">Confirm</button>
                                    <button type="button" onClick={handleCloseMarket} className="btn cancel">Cancel</button>
                              </div>
                        </Modal.Body>
                  </Modal>

                  <Modal className="withdraw-details two-factor-auth text-center" centered backdrop="static" show={show} onHide={handleClose} >
                        <Modal.Header className='modal-main-heading' closeButton>
                        </Modal.Header>
                        <Modal.Body className='text-white'>
                              <h5 className='mb-5'>Are you sure want to stop it at {stopRate} rate?</h5>
                              <div className="limit-modal-btns">
                                    <button type="button" onClick={handleClose} className="btn cancel">No</button>
                                    <button type="button" onClick={() => { handleStop() }} className="btn confirm">Yes</button>
                              </div>
                        </Modal.Body>
                  </Modal>
            </>
      )
}

export default TradeOrdersDatatables