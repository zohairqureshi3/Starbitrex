import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import DataTable from "react-data-table-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faClone, faTrash, faPencil, faUndo } from "@fortawesome/free-solid-svg-icons";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from 'react-toastify';
import { getPermission } from "../../../config/helpers";
import Swal from 'sweetalert2';
import { io } from "socket.io-client";
import { Form, Modal, InputGroup, FormControl, Button } from 'react-bootstrap';
import Slider from 'rc-slider';
import "rc-slider/assets/index.css";
import { getUserLeverageOrders, updateLeverageOrder, stopLeverageOrder, startLeverageOrder } from '../../../redux/leverageOrder/leverageOrderActions';
import { getUserSpotOrders, stopSpotOrder } from "../../../redux/spotOrder/spotOrderActions";

const currencyFormatter = require('currency-formatter');

let localOrderBook = []
let futures = []
let futuresCounter = 0
let orderBookCounter = 0

let stopped = []
let started = []

const ActiveOrder = () => {

    let { id } = useParams();
    const dispatch = useDispatch();

    const [selectedRow, setSelectedRow] = useState("");
    const [futureStartPrice, setFutureStartPrice] = useState(0);
    const [showFutureStartPrice, setShowFutureStartPrice] = useState(false);
    const [coinAmount, setCoinAmount] = useState(0);
    const [orderRate, setOrderRate] = useState(0);
    const [stopRate, setStopRate] = useState(0);
    const [orderId, setOrderId] = useState("");
    const [futureOrderId, setFutureOrderId] = useState("");
    const [avbl, setAvbl] = useState(0);
    const [TP, setTP] = useState(0);
    const [SL, setSL] = useState(0);
    const [trailingPrice, setTrailingPrice] = useState(0);
    const [rate, setRate] = useState(0);
    const [spotOrderId, setSpotOrderId] = useState("");


    /**
    * socket states
    */
    const [orderBookAPI, setOrderBookAPI] = useState([]);
    const [futureTradesAPI, setFutureTradesAPI] = useState([]);
    const [pairName, setPairName] = useState('ETHUSDT');
    const [socket, setSocket] = useState(null);
    const [currentMarketPrice, setcurrentMarketPrice] = useState(0);
    const [startSocket, setStartSocket] = useState(true)
    const [rates, setRates] = useState("");
    const [showTPSL, setShowTPSL] = useState(false);
    const [showTrailing, setShowTrailing] = useState(false);
    const [showMarket, setShowMarket] = useState(false);
    const [showFuture, setShowFuture] = useState(false);
    const [showLimit, setShowLimit] = useState(false);
    const [percentage, setPercentage] = useState(0 + "%");
    const [loader, setLoader] = useState(false);


    const handleShowFutureStartPrice = () => setShowFutureStartPrice(true);
    const handleShowTPSL = () => setShowTPSL(true);
    const handleCloseTPSL = () => setShowTPSL(false);
    const handleShowTrailing = () => setShowTrailing(true);
    const handleCloseTrailing = () => setShowTrailing(false);
    const handleShowMarket = () => setShowMarket(true);
    const handleShowFuture = (id) => setShowFuture(true);
    const handleShowLimit = () => setShowLimit(true);
    const handleCloseLimit = () => setShowLimit(false);
    const handleCloseFutureStartPrice = () => setShowFutureStartPrice(false);
    const handleCloseMarket = () => setShowMarket(false);
    const handleCloseFuture = () => setShowFuture(false);

    const userOrders = useSelector((state) => state.LeverageOrders?.userOrders?.userOrders);
    const userSpotOrders = useSelector((state) => state.spotOrder?.userSpotOrders?.userOrders);

    let socketURL = process.env.REACT_APP_SOCKET_URL;

    useEffect(() => {
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
                setcurrentMarketPrice(0)
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
            let letCurrentMarketPrice;
            if (socket) {
                socket.on("connect", () => {
                    console.log("Socket id is -->: ", socket.id);
                });

                socket.emit("getBinanceFutureTradesRequest", pairName);
                socket.on("getBinanceFutureTradesRequestError", (response) => {
                    // console.log(response)
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

                socket.emit("getCurrentMarketPriceRequest", pairName)
                socket.on("getCurrentMarketPriceResponse" + pairName, (currentMarketPrice) => {
                    letCurrentMarketPrice = currentMarketPrice;
                    setcurrentMarketPrice(currentMarketPrice)
                });

                socket.emit("getBinanceMarketDepthRequest", pairName)
                socket.on("getBinanceMarketDepthRequestError", (response) => {
                    // console.log(response)
                });

                socket.on("getBinanceMarketDepthRequest" + pairName, (response) => {
                    // if (orderBookCounter % 20 == 0) {
                    let data;
                    if (localOrderBook !== [] && localOrderBook.a?.length && localOrderBook.b?.length) {
                        data = {
                            a: (response.a?.filter(row => (parseFloat(row['1']) > 0)).concat(localOrderBook?.a)).splice(0, 15),
                            b: (response.b?.filter(row => (parseFloat(row['1']) > 0)).concat(localOrderBook?.b)).splice(0, 15)
                        }
                        localOrderBook = data
                        setOrderBookAPI(data)
                    } else {
                        data = {
                            a: [...(response.a.filter(row => (parseFloat(row['1']) > 0)))],
                            b: [...(response.b.filter(row => (parseFloat(row['1']) > 0)))]
                        }
                        localOrderBook = data
                        setOrderBookAPI(data)
                    }

                    //orderBookAPI && orderBookAPI.b && orderBookAPI.b.length ? currentMarketPrice : 0
                    setRates(data && data.b && data.b.length ? letCurrentMarketPrice : 0)
                    orderBookCounter = 0
                    // }
                    // orderBookCounter++;
                });
            }
        }
    }, [socket, pairName]);

    useEffect(() => {

        currentMarketPrice && userOrders && userOrders?.length && userOrders.filter((row) => row.status == 1).map(async (row) => {
            let marketRate = parseFloat(currentMarketPrice ? currentMarketPrice?.find(line => line.symbol == row.pairName).markPrice : 0)
            // console.log("marketRate: ", marketRate);
            if (marketRate) {
                let stop = 0;
                if (
                    (row.tradeType == 1 && marketRate !== 0 && (parseFloat(marketRate) <= parseFloat(row.tradeEndPrice))) ||
                    (row.tradeType == 0 && marketRate !== 0 && (parseFloat(marketRate) >= parseFloat(row.tradeEndPrice)))
                ) {
                    stop = parseFloat(row.tradeEndPrice);
                }
                // console.log("TPSL: ", row.tradeType == 1, marketRate !== 0, (row.tpsl))
                // console.log("TPSL: ", row.tradeType == 1, marketRate !== 0, (parseFloat(marketRate) >= parseFloat(row.takeProfitPrice)))
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
            let rate = parseFloat(currentMarketPrice ? currentMarketPrice?.find(line => line.symbol == row.pairName).markPrice : 0)
            if (
                (row.tradeType == 1 && rate !== 0 && (parseFloat(parseFloat(rate).toFixed(2)) >= parseFloat(parseFloat(row.tradeStartPrice).toFixed(2)))) ||
                (row.tradeType == 0 && rate !== 0 && (parseFloat(parseFloat(rate).toFixed(2)) <= parseFloat(parseFloat(row.tradeStartPrice).toFixed(2))))
            ) {
                // console.log("in start");
                if (!started.includes(row._id)) {
                    // console.log("starting", row._id)
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
            // updateAvbl(vall > 0 ? vall : 0)
        }

    }, [currentMarketPrice])


    useEffect(async () => {
        await dispatch(getUserLeverageOrders(id));
        await dispatch(getUserSpotOrders(id));
    }, []);


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
                    tmm = tmm + ((parseFloat(ordr.qty) * parseFloat(currentMarketPrice ? currentMarketPrice?.find(line => line.symbol == ordr.pairName).markPrice : 0)) * (parseFloat(ordr.maintenanceMargin) / 100) - parseFloat(ordr.maintenanceAmount))
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


    // Future Active Orders
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
        let rate = parseFloat(currentMarketPrice ? currentMarketPrice?.find(line => line.symbol == row.pairName).markPrice : 0)
        let val = row?.tradeType == 1 ? //buy
            parseFloat(row?.qty) * (parseFloat(rate) - parseFloat(row?.tradeStartPrice))
            : //sell
            parseFloat(row?.qty) * (parseFloat(row?.tradeStartPrice) - parseFloat(rate))
        return val && !isNaN(val) ? val : 0;
    }

    const updateFutureTradeStartprice = () => {
        let data = { ...selectedRow };

        if (parseFloat(data.tradeStartPrice) != parseFloat(futureStartPrice)) {
            data.tradeStartPrice = parseFloat(futureStartPrice);
            data.fromCurrency = data.fromCurrency._id
            data.toCurrency = data.toCurrency._id
            dispatch(updateLeverageOrder(data, id));
            // setLoader(true);
        }

        handleCloseFutureStartPrice();
    }

    const updateTPSL = () => {
        let data = { ...selectedRow };

        if (parseFloat(data.takeProfitPrice) != parseFloat(TP) || parseFloat(data.stopLossPrice) != parseFloat(SL)) {
            data.tpsl = true;
            data.takeProfitPrice = parseFloat(TP);
            data.stopLossPrice = parseFloat(SL);
            data.fromCurrency = data.fromCurrency._id
            data.toCurrency = data.toCurrency._id
            dispatch(updateLeverageOrder(data, id));
            // setLoader(true);
        }
        handleCloseTPSL();
    }

    const updateTrailing = () => {
        let data = { ...selectedRow };

        if (parseFloat(data.tradeTrailingPrice) != parseFloat(trailingPrice)) {
            data.tradeTrailingPrice = parseFloat(trailingPrice);
            data.tradeTrailingDifference = parseFloat(trailingPrice) > parseFloat(data.tradeStartPrice) ? parseFloat(trailingPrice) - parseFloat(data.tradeStartPrice) : parseFloat(data.tradeStartPrice) - parseFloat(trailingPrice);
            data.fromCurrency = data.fromCurrency._id
            data.toCurrency = data.toCurrency._id
            dispatch(updateLeverageOrder(data, id));
            // setLoader(true);
        }

        handleCloseTrailing();
    }

    const handleLimit = (val, update = 0) => {
        if (avbl) {
            var validNumber = new RegExp(/^\d*\.?\d*$/);
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
        dispatch(updateLeverageOrder(data, id));
        handleCloseMarket()
        handleCloseLimit()
        // setLoader(true);
    }

    function rangeValue(value) {
        let val = value;
        setPercentage(val + "%");
        if (avbl) {
            setCoinAmount(avbl * (val / 100));
        }
    }

    const handleFutureStop = () => {
        dispatch(stopLeverageOrder(futureOrderId, parseFloat(stopRate), false));
        wait(5000); setLoader(true);
        setShowFuture(false);
        setFutureOrderId("");
        setStopRate(0);
    };

    const marks = {
        0: "0%",
        25: "25%",
        50: "50%",
        75: "75%",
        100: "100%",
    };

    function wait(ms) {
        var start = new Date().getTime();
        var end = start;
        while (end < start + ms) {
            end = new Date().getTime();
        }
    }

    const handleCancelOrder = async (orderId) => {
        // e.preventDefault();
        Swal.fire({
            title: `Are you sure you want to Cancel the Order?`,
            html: '',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: "Yes"
        }).then(async (result) => {
            if (result.isConfirmed === true) {
                await dispatch(stopSpotOrder(orderId, id));
                setSpotOrderId("")
            }
        })

    }

    const futureOrders = [
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
            minWidth: '200px',
            selector: row => <span>
                {row?.tradeStartPrice ?
                    <>
                        {parseFloat(row.tradeStartPrice).toFixed(2) + " " + row?.fromCurrency?.symbol}
                        <button type="button" onClick={() => { setSelectedRow(row); setFutureStartPrice(row.tradeStartPrice); handleShowFutureStartPrice(); }} className="btn graph-table-btns ms-2"> <FontAwesomeIcon icon={faPencil} className="header-icon text-white" /> </button>

                    </>
                    :
                    '-'
                }
            </span>,
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
            name: 'Position Margin',
            selector: row => getPositionMargin(row),
            sortable: true,
        },
        {
            name: 'Unrealized P&L (%)',
            selector: row => <span className={(getUnrealizedPnL(row) >= 0 ? 'text-green' : 'text-red') + ' d-flex flex-column'}>
                <>
                    <span id={row?._id + "pnl"}> {parseFloat(getUnrealizedPnL(row)).toFixed(4)} </span>
                    <span> {+ " " + row?.fromCurrency?.symbol}</span>
                </>
                <span> {parseFloat(getUnrealizedPnL(row) / (row.tradeType == 1 ? parseFloat(row.userInvestedAmount) : (parseFloat(row.userInvestedAmount) * parseFloat(row.tradeStartPrice)))).toFixed(4)} % </span>
                <span> {parseFloat(getUnrealizedPnL(row)).toFixed(2) + " USD"} </span>
            </span>,
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
                        }} className="btn graph-table-btns text-white">+ Add</button>
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
                        <button type="button" onClick={() => { setSelectedRow(row); handleShowTrailing(); setTrailingPrice(row.tradeTrailingPrice) }} className="btn graph-table-btns ms-2"> <FontAwesomeIcon icon={faPencil} className="header-icon text-white" /> </button>

                    </>
                    :
                    <button type="button" onClick={() => {
                        setSelectedRow(row); handleShowTrailing()
                    }} className="btn btn-success btn-sm me-1 p-1">+ Add</button>

                }
            </span>,
            sortable: true,
        },
        {
            name: 'Close By',
            minWidth: '200px',
            selector: row => <>
                {
                    row?.status === 0 ?
                        <>
                            <button type="button" onClick={() => { setCoinAmount(parseFloat(row.qty) / parseFloat(row.leverage)); setSelectedRow(row); setOrderRate(row.tradeStartPrice); handleShowLimit() }} className="btn btn-success btn-sm me-1 p-1">Limit</button>
                            <button type="button" onClick={() => { setCoinAmount(parseFloat(row.qty) / parseFloat(row.leverage)); setSelectedRow(row); setOrderRate(row.tradeStartPrice); handleShowMarket() }} className="btn btn-success btn-sm me-1 p-1">Market</button>
                        </>
                        : null
                }
                <button type="button" onClick={() => { setStopRate(rates ? rates?.find(line => line.symbol == row.pairName).markPrice : 0); setOrderId(row?._id); setFutureOrderId(row?._id); handleShowFuture() }} className="btn btn-danger btn-sm me-1 p-1">Stop</button>
            </>,
            sortable: true,
        },
    ]

    const spotOrders = [
        {
            name: 'Spot Pairs',
            selector: row => row?.spotPair,
            sortable: true,
        },
        {
            name: 'Order Type',
            selector: row => row?.marketOrder == "1" ? "Market" : "Limit",
            sortable: true,
        },
        {
            name: 'Direction',
            selector: row => row?.tradeType ? "Buy" : "Sell",
            sortable: true,
        },
        {
            name: 'Order Value',
            selector: row => (parseFloat(parseFloat(row?.investedQty) * parseFloat(row?.tradeStartPrice)).toFixed(3)) + " " + 'USDT',
            sortable: true,
        },
        {
            name: 'Order Qty',
            selector: row => parseFloat(row?.investedQty).toFixed(3) + ' ' + row?.spotPair?.replace('USDT', ''),
            sortable: true,
        },
        {
            name: 'Order Price',
            selector: row => row?.tradeStartPrice + " " + 'USDT',
            sortable: true,
        },
        {
            name: 'Unfilled Qty',
            selector: row => parseFloat(row?.investedQty).toFixed(3) + ' ' + row?.spotPair?.replace('USDT', ''),
            sortable: true,
        },
        {
            name: 'Order Time',
            selector: row => row?.createdAt.replace('T', ' ').replace('Z', ' '),
            sortable: true,
        },
        {
            name: 'Order ID',
            selector: row => row?._id,
            sortable: true,
        },
        {
            name: 'Action',
            selector: row => <span>
                <button className="btn btn-danger btn-sm me-1 p-1" onClick={() => { setSpotOrderId(row?._id); handleCancelOrder(row?._id) }}>Cancel</button>
            </span >
        }
    ]

    return (
        <>
            <div className="tab-pane fade" id="activeOrder">
                {/* <h5> Spot Orders </h5> */}
                <div className='table-responsive'>
                    {userSpotOrders && userSpotOrders.filter(row => row.status == 1).length > 0 ?
                        <DataTable
                            title="Spot Orders"
                            columns={spotOrders}
                            data={userSpotOrders?.filter(row => row.status == 1)}
                            pagination
                            fixedHeader
                            persistTableHead
                            theme='solarizedd'
                        />
                        :
                        null
                    }
                </div>
                <br />
                <h5>  </h5>
                <div className='table-responsive'>
                    {userOrders && userOrders?.length > 0 ? <DataTable
                        title="Future Orders"
                        columns={futureOrders}
                        data={userOrders.filter(row => row.futuresOrder == 1).filter((row) => row.status == 1)}
                        pagination
                        fixedHeader
                        persistTableHead
                        theme='solarizedd'
                    /> : null}
                </div>
            </div>


            {/* entry price model */}
            <Modal className="withdrawal-modal limit-modal tp-sl-modal" show={showFutureStartPrice} centered onHide={handleCloseFutureStartPrice}>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <div className="buy-tabs">
                        <div className="mb-4"><span >Start Trading Price  {selectedRow?.fromCurrency?.symbol}</span></div>
                        <div className="stop-loss-usdt">
                            <InputGroup className="mb-3">
                                <FormControl
                                    type="number"
                                    placeholder="Start Trading Price"
                                    min="0"
                                    value={futureStartPrice}
                                    onChange={(e) => setFutureStartPrice(e.target.value)}
                                />
                                <InputGroup.Text id="basic-addon2">
                                    {selectedRow?.fromCurrency?.symbol}
                                </InputGroup.Text>
                            </InputGroup>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={() => updateFutureTradeStartprice()}>
                        Confirm
                    </Button>
                    <Button variant="danger" onClick={handleCloseFutureStartPrice}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* entry price model close */}

            {/* TP/SL model */}
            <Modal className="withdrawal-modal limit-modal tp-sl-modal" show={showTPSL} centered onHide={handleCloseTPSL}>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <div className="buy-tabs">
                        <div className="mb-4"><span >TP/SL</span></div>

                        <div className="d-flex justify-content-between mb-2">
                            <span >Entry Price</span>
                            <span >{selectedRow.tradeStartPrice}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-4">
                            <span >Liq. Price</span>
                            <span className="text-green">{selectedRow.tradeEndPrice}</span>
                        </div>

                        <div className="take-profit-usdt">
                            <div className="d-flex justify-content-between mb-1">
                                <span >Take Profit USDT</span>
                                <span >Last Traded Price</span>
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
                                <span>Stop Loss {selectedRow?.fromCurrency?.symbol}</span>
                                <span>Last Traded Price</span>
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
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={() => updateTPSL()}>
                        Confirm
                    </Button>
                    <Button variant="danger" onClick={handleCloseTPSL}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* TP/SL model close */}

            {/* Trailing Stop model  */}
            <Modal className="withdrawal-modal limit-modal tp-sl-modal" show={showTrailing} centered onHide={handleCloseTrailing}>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <div className="buy-tabs">
                        <div className="mb-4"><span >Trailing Stop</span></div>
                        <div className="d-flex justify-content-between mb-2">
                            <span >Entry Price</span>
                            <span >{selectedRow.tradeStartPrice}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-4">
                            <span >Liq. Price</span>
                            <span className="text-green">{selectedRow.tradeEndPrice}</span>
                        </div>

                        <div className="stop-loss-usdt">
                            <div className="d-flex justify-content-between mb-1">
                                <span >Trailing Stop {selectedRow?.fromCurrency?.symbol}</span>
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
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={() => updateTrailing()}>
                        Confirm
                    </Button>
                    <Button variant="danger" onClick={handleCloseTrailing}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
            {/*  Trailing Stop model close */}


            {/* Limit Close model */}
            <Modal className="withdrawal-modal limit-modal" show={showLimit} centered onHide={handleCloseLimit} backdrop="static">
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <div className="buy-tabs">
                        <div className="mb-4"><span>Limit Close</span></div>
                        <span>Entry Price {selectedRow?.toCurrency?.symbol}</span>
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
                        <span>Order by Qty {selectedRow?.toCurrency?.symbol}</span>
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
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={() => updateMarket()}>
                        Confirm
                    </Button>
                    <Button variant="danger" onClick={handleCloseLimit}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* Limit Close model close */}


            {/* Market model */}
            <Modal className="withdrawal-modal limit-modal market-modal" show={showMarket} centered onHide={handleCloseMarket}>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <div className="buy-tabs">
                        <div className="mb-4"><span>Market Close</span></div>

                        <span>Order by Qty {selectedRow?.toCurrency?.symbol}</span>
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
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={() => updateMarket()}>
                        Confirm
                    </Button>
                    <Button variant="danger" onClick={handleCloseMarket}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* Market model close */}

            {/* Stop trade model */}
            <Modal className="withdraw-details two-factor-auth text-center" centered backdrop="static" show={showFuture} onHide={handleCloseFuture} >
                <Modal.Header className='modal-main-heading' closeButton> </Modal.Header>
                <Modal.Body>
                    <div className="mb-5"><span>Are you sure want to stop it at {stopRate} rate?</span></div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={handleCloseFuture}>No</Button>
                    <Button variant="danger" onClick={() => { handleFutureStop() }}>Yes</Button>
                </Modal.Footer>
            </Modal>
            {/* Stop trade model close */}

        </>
    )
}

export default ActiveOrder