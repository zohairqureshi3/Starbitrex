import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Tabs,
  Tab,
  InputGroup,
  FormControl,
  Modal,
  Col,
  Nav,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Graph from "../shared/Graph";
import { useDispatch, useSelector } from "react-redux";
import { getCurrency } from "../../redux/currencies/currencyActions";
import {
  addLeverageOrder,
  clearLeverageOrder,
  getUserLeverageOrders,
} from "../../redux/leverageOrder/leverageOrderActions";
import Swal from "sweetalert2";
import GetAccountData from "../shared/GetAccountData";
import FullPageLoader from "../FullPageLoader/fullPageLoader";
import { getAccount } from "../../redux/account/accountActions";
import TradePriceWidget from "./TradePriceWidget";
import Order from "../shared/Order"
import WalletTransfer from "./WalletTransfer";
import TradeOrdersDatatables from "../shared/TradePagesData"
import { getLeverageByCurrency } from "../../redux/leverage/leverageActions";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TradeInfo = ({ orderBookAPI, sendPairtoParent, futureTradesAPI, currentMarketPrice, ticketData }) => {

  const token = localStorage.getItem("uToken");
  const coins = ['ETHUSDT', 'BTCUSDT', 'BNBUSDT', 'LINKUSDT', 'AVAXUSDT', 'DOGEUSDT', 'BCHUSDT', 'LTCUSDT', 'TRXUSDT', 'ADAUSDT'];
  const [crSymbol, setCrSymbol] = useState("ETHUSDT");
  const [percentage, setPercentage] = useState(0 + "%");
  const [coinAmountQty, setCoinAmountQty] = useState("");
  const [coinAmountCost, setCoinAmountCost] = useState("");
  const [buyingRate, setBuyingRate] = useState(0);
  const [sellingRate, setSellingRate] = useState(0);
  const [rate, setRate] = useState(true);
  const [error, setError] = useState('');
  const [primAvbl, setPrimAvbl] = useState(0);
  const [secAvbl, setSecAvbl] = useState(0);
  const [initAvbl, setInitAvbl] = useState(0);
  const [primaryCoin, setPrimaryCoin] = useState("ETH");
  const [secondaryCoin, setSecondaryCoin] = useState("USDT");
  const [toggle, setToggle] = useState(1); // 1=buy, 0=sell
  const [market, setMarket] = useState(0); // 2=conditional 1=market 0=limit
  const [conditional_market, setConditionalMarket] = useState(1); // 2=conditional 1=market 0=limit
  const [TPSL, setTPSL] = useState(false);
  const [TP, setTP] = useState(0);
  const [SL, setSL] = useState(0);
  const [leverage, setLeverage] = useState(5);
  const [margin, setMargin] = useState(1); // 0=cross, 1=isolated
  const [byQty, setByQty] = useState(1); // 0=By Cost, 1=By Qty
  const [showLeverage, setShowLeverage] = useState(false);
  const [showMargin, setShowMargin] = useState(false);
  const [loader, setLoader] = useState(false);
  const [selectedRow, setSelectedRow] = useState("");
  const [trailingPrice, setTrailingPrice] = useState(0);
  const [maintenanceMargin, setMaintenanceMargin] = useState(0);
  const [maintenanceAmount, setMaintenanceAmount] = useState(0);

  const history = useNavigate();
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user?.user?._id);
  const currencyData = useSelector((state) => state.currency?.currencies?.allCurrencies);
  const amounts = useSelector((state) => state.accounts?.account?.amounts);
  const success = useSelector((state) => state.LeverageOrders?.success);
  const creationError = useSelector((state) => state.LeverageOrders?.error);
  const stopped = useSelector((state) => state.LeverageOrders?.stopped);
  const started = useSelector((state) => state.LeverageOrders?.started);
  const leverageLimits = useSelector((state) => state.leverages?.leverage?.leverages);
  const userOrders = useSelector((state) =>
    state.LeverageOrders?.userOrders?.userOrders
  );

  const [showConfirmation, setShowConfirmation] = useState(false);
  const handleCloseConfirmation = () => setShowConfirmation(false);
  const handleShowConfirmation = () => {
    let span = leverageLimits.find(row => (row.fromAmount <= coinAmountCost && row.toAmount >= coinAmountCost))
    if (span?.leverage < leverage) {
      Swal.fire({
        text: "Leverage cannot be greater than " + span.leverage + "x For this investment Amount",
        icon: "info",
        showCancelButton: false,
        confirmButtonText: "OK",
      });
    }
    else if (leverage <= 0 || coinAmountQty == "" || coinAmountQty < 0.02 || parseFloat(buyingRate) <= 0 || parseFloat(sellingRate) <= 0 || (secAvbl <= 0)) {
      Swal.fire({
        text: "Cannot Trade on 0 Rate or on Amount less than 0.02" + primaryCoin?.symbol,
        icon: "info",
        showCancelButton: false,
        confirmButtonText: "OK",
      });
    } else {
      setMaintenanceMargin(span.maintenanceMR);
      setMaintenanceAmount(span.maintenanceAmount);
      setShowConfirmation(true);
    }
  };



  const handleCloseLeverage = () => setShowLeverage(false);
  const handleShowLeverage = () => setShowLeverage(true);
  const handleCloseMargin = () => setShowMargin(false);
  const handleShowMargin = () => setShowMargin(true);

  useEffect(() => {
    if (userId) dispatch(getUserLeverageOrders(userId));
    dispatch(getCurrency());
  }, [userId]);

  useEffect(() => {
    // Get laterst User Leverage Orders once editted on admin panel
    window.addEventListener("storage", e => {
      if (e.key == "userLeaverageOrderUpdate") {
        if (e.newValue && (e.oldValue != e.newValue)) {
          const newLeverageValue = JSON.parse(localStorage.getItem('userLeaverageOrderUpdate'));
          localStorage.removeItem('userLeaverageOrderUpdate');
          if (userId && newLeverageValue?.userId == userId) {
            dispatch(getUserLeverageOrders(userId));
          }
        }
      }
    });
  }, [])

  useEffect(() => {
    if (success) {
      if (userId) {
        dispatch(getUserLeverageOrders(userId));
        dispatch(getAccount(userId));
      }
      dispatch(clearLeverageOrder());
      setLoader(false);
      setTPSL(false);
      setTP("");
      setSL("");
      setCoinAmountQty(0);
      setCoinAmountCost(0);
      setPercentage(0 + "%");
      setLeverage(5);
      setMargin(1);
    }
  }, [success]);


  useEffect(() => {
    if (creationError) {
      if (userId) {
        dispatch(getUserLeverageOrders(userId));
        dispatch(getAccount(userId));
      }
      dispatch(clearLeverageOrder());
      setLoader(false);
    }
  }, [creationError]);

  useEffect(() => {
    if (stopped) {
      if (userId) {
        dispatch(getUserLeverageOrders(userId));
        dispatch(getAccount(userId));
      }
      setLoader(false);
      dispatch(clearLeverageOrder());
    }
  }, [stopped]);

  useEffect(() => {
    if (started) {
      if (userId) {
        dispatch(getUserLeverageOrders(userId));
        dispatch(getAccount(userId));
      }
      dispatch(clearLeverageOrder());
    }
  }, [started]);

  // Implement socket
  useEffect(() => {
    if (rate && primaryCoin?.symbol && secondaryCoin?.symbol && currentMarketPrice) {
      setBuyingRate(parseFloat(currentMarketPrice ? currentMarketPrice?.find(row => row.symbol == (primaryCoin?.symbol + secondaryCoin?.symbol)).markPrice : 0));
      setSellingRate(parseFloat(currentMarketPrice ? currentMarketPrice?.find(row => row.symbol == (primaryCoin?.symbol + secondaryCoin?.symbol)).markPrice : 0));
      setRate(false)
    }
  }, [rate, primaryCoin, currentMarketPrice]);

  useEffect(() => {
    if (primaryCoin?.symbol && secondaryCoin?.symbol) {
      setCoinAmountQty(0);
      setCoinAmountCost(0)
      setRate(true);
      sendPairtoParent(primaryCoin?.symbol + secondaryCoin?.symbol)
      dispatch(getLeverageByCurrency(primaryCoin._id))
      if (amounts) {
        setPrimAvbl(parseFloat(amounts?.find((row) => row.currencyId == primaryCoin?._id)?.futures_amount));
        setSecAvbl(parseFloat(amounts?.find((row) => row.currencyId == secondaryCoin?._id)?.futures_amount));
        setInitAvbl(parseFloat(amounts?.find((row) => row.currencyId == secondaryCoin?._id)?.futures_amount));
      }
    }
  }, [secondaryCoin, primaryCoin]);

  const defaultAssignment = () => {
    setCrSymbol("ETHUSDT");
    let prim = currencyData?.find((row) => row.symbol == "ETH");
    setPrimaryCoin(prim);
    let sec = currencyData?.find((row) => row.symbol == "USDT");
    setSecondaryCoin(sec);
    if (amounts) {
      setPrimAvbl(parseFloat(amounts?.find((row) => row.currencyId.toString() == prim?._id.toString())?.futures_amount));
      setSecAvbl(parseFloat(amounts?.find((row) => row.currencyId.toString() == sec?._id.toString())?.futures_amount));
      setInitAvbl(parseFloat(amounts?.find((row) => row.currencyId.toString() == sec?._id.toString())?.futures_amount));
    }
  }

  useEffect(() => {
    if (currencyData) {
      let parseUriSegment = window.location.pathname.split("/");
      if (parseUriSegment[2] && coins.includes(parseUriSegment[2])) {
        setCrSymbol(parseUriSegment[2]);
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
        if (amounts) {
          setPrimAvbl(parseFloat(amounts?.find((row) => row.currencyId == prim?._id)?.futures_amount));
          setSecAvbl(parseFloat(amounts?.find((row) => row.currencyId == sec?._id)?.futures_amount));
          setInitAvbl(parseFloat(amounts?.find((row) => row.currencyId == sec?._id)?.futures_amount));
        }
      } else {
        defaultAssignment()
      }
    }
  }, [history, currencyData, amounts]);

  const marks = {
    0: "0x",
    25: "25x",
    50: "50x",
    75: "75x",
    100: "100x",
  };

  const percentage_marks = {
    0: "0%",
    25: "25%",
    50: "50%",
    75: "75%",
    100: "100%",
  };

  function rangeValue(value) {
    let val = parseFloat(value);
    setPercentage(val + "%");
    if (secAvbl) {
      handleAmountChange((secAvbl * ((val) / 100)) / parseFloat(sellingRate), true);
    } else {
      setError("Insufficient Balance")
    }
  }

  const handleSubmit = async () => {
    if (!(market == 0 || (market == 2 && conditional_market == 0))) await setRate(true);
    let data = {
      userId: userId,
      pairName: primaryCoin?.symbol + secondaryCoin.symbol,
      toCurrency: primaryCoin?._id,
      fromCurrency: secondaryCoin?._id,
      tpsl: TPSL,
      takeProfitPrice: parseFloat(TP),
      stopLossPrice: parseFloat(SL),
      tradeType: toggle,
      leverage: parseFloat(leverage),
      marginType: margin,
      tradeStartPrice: toggle == 1 ? parseFloat(buyingRate) : parseFloat(sellingRate),
      userInvestedAmount: parseFloat(coinAmountCost),
      qty: parseFloat(coinAmountQty) * parseFloat(leverage),
      marketOrder: parseFloat(market),
      futuresOrder: 1,
      trailingPrice: parseFloat(trailingPrice),
      maintenanceMargin: maintenanceMargin,
      maintenanceAmount: maintenanceAmount,
      currentBuyRate: parseFloat(buyingRate),
      currentSellRate: parseFloat(sellingRate)
    };
    dispatch(addLeverageOrder(data));
    handleCloseConfirmation();
    setLoader(true);
  };

  const handlePercentLimit = (val, per = 0) => {
    if (secAvbl) {
      var validNumber = new RegExp(/^\d*\.?\d*$/);
      if (
        !val.replace("%", "").toString().match(validNumber) || parseFloat(val) > 100 || parseFloat(val) < 1 ||
        parseFloat(parseFloat(val) / parseFloat(sellingRate)) > parseFloat(100) ||
        parseFloat(parseFloat(val) / parseFloat(sellingRate)) < parseFloat(0)
      ) {
        Swal.fire({
          text: "Invalid number entered. Please enter a valid number",
          icon: "info",
          showCancelButton: false,
          confirmButtonText: "OK",
        });
        if (per) {
          setCoinAmountQty(0);
          setCoinAmountCost(0)
          setPercentage(0 + "%");
        } else setLeverage(20);
      }
    }
  };

  const padTo2Digits = (num) => {
    return num.toString().padStart(2, "0");
  };

  const handleAmountChange = (val, fromRange = false) => {
    let value = 0
    if (!fromRange && byQty == 0) {
      // val is in usdt -> change it to eth
      value = val / (toggle == 0 ? parseFloat(buyingRate) : parseFloat(sellingRate))
    }
    else {
      value = val
    }
    setError("")
    if (secAvbl) {
      let pr = (((!fromRange && byQty == 0) ? val : value * parseFloat(sellingRate)) * 100) / parseFloat(secAvbl);
      setPercentage(pr + "%");
      if (pr > 100 || pr < 0) {
        setError("Insufficient Balance")
      }
      setCoinAmountQty(value);
      setCoinAmountCost((!fromRange && byQty == 0) ? val : value * parseFloat(sellingRate))
    }
    else {
      setError("Insufficient Balance")
    }
  }

  const handleOrderPriceChange = (e) => {

    let currentVal = 0;
    if (e?.target?.value) {
      currentVal = e?.target?.value;
    }
    setBuyingRate(currentVal);
    setSellingRate(currentVal);
    rangeValue(percentage.replace('%', ''));

  }
  const ordertabs = (
    <div className="buy-tabs">
      <div className="flex-row mb-2 text-white d-flex justify-content-evenly">
        <div
          className={market == 0 ? "text-green point" : "point"}
          onClick={() => setMarket(0)}
        >
          Limit
        </div>
        <div
          className={market == 1 ? "text-green point" : "point"}
          onClick={() => setMarket(1)}
        >
          Market
        </div>
        {toggle == 1 ? (
          <div
            className={market == 2 ? "text-green point" : "point"}
            onClick={() => setMarket(2)}
          >
            Conditional
          </div>
        ) : null}
      </div>
      {market == 2 ? (
        <div className="">
          <span>Trigger Price</span>
          <InputGroup className="mb-4">
            <FormControl
              placeholder="Rate"
              aria-label=""
              aria-describedby=""
              value={toggle == 1 ? buyingRate : sellingRate}
              onChange={(e) => { setBuyingRate(e.target.value); setSellingRate(e.target.value) }}
            />
            <InputGroup.Text
              className="point"
              onClick={() => {
                setRate(true);
              }}
            >
              +/-
            </InputGroup.Text>
          </InputGroup>
          <Tabs
            defaultActiveKey="home"
            id="uncontrolled-tab-example"
            className="mb-3"
          >
            <Tab eventKey="home" title="Last">
              <p></p>
            </Tab>
            <Tab eventKey="profile" title="Index">
              <p></p>
            </Tab>
            <Tab eventKey="contact" title="Mark">
              <p></p>
            </Tab>
          </Tabs>
          <Tab.Container id="left-tabs-example" defaultActiveKey="first">
            <Row>
              <Col sm={12}>
                <Nav variant="pills" className="">
                  <Nav.Item>
                    <Nav.Link
                      className={conditional_market == 1 ? "market-border" : ""}
                      onClick={() => setConditionalMarket(1)}
                      eventKey="first"
                    >
                      Market
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      className={conditional_market == 0 ? "market-border" : ""}
                      onClick={() => setConditionalMarket(0)}
                      eventKey="second"
                    >
                      Limit
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
            </Row>
          </Tab.Container>
        </div>
      ) : (
        ""
      )}
      {/* Conditional Code end */}

      <div className="mt-2 mb-2">
        <p style={{ fontSize: "smaller" }}>
          {" "}
          <u>Available Balance:</u> {token ? parseFloat(secAvbl).toFixed(4) + " " + secondaryCoin.symbol : "--"}
        </p>
      </div>

      {market == 0 || (market == 2 && conditional_market == 0) ? (
        <>
          <span className="text-white">Order Price</span>
          <InputGroup className="mb-4">
            <FormControl
              placeholder="Rate"
              aria-label=""
              aria-describedby=""
              value={toggle == 1 ? buyingRate : sellingRate}
              onChange={handleOrderPriceChange}
            />
            <InputGroup.Text
              className="point"
              onClick={() => {
                setRate(true);
              }}
            >
              +/-
            </InputGroup.Text>
          </InputGroup>
        </>
      ) : null}

      <span className="text-white">Order by {byQty ? "Qty" : "Cost"}</span>
      <InputGroup className="mb-3">
        <FormControl
          type="number"
          step="0.1"
          placeholder="Price"
          min="0.0"
          max={(toggle == 1 ? secAvbl : primAvbl) ? (toggle == 1 ? secAvbl : primAvbl) : 10000000}
          value={byQty ? coinAmountQty : coinAmountCost}
          onChange={(e) => { handleAmountChange(e.target.value); }}
        />
        <div className="dropdown order-by-currency-coin">
          <button className="btn text-white dropdown-toggle d-flex align-items-center" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
            <p>{byQty ? primaryCoin?.symbol : secondaryCoin?.symbol}</p>
          </button>
          <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
            <li><a className="dropdown-item"><p onClick={() => setByQty(1)}>{primaryCoin?.symbol}</p></a></li>
            <li><a className="dropdown-item"><p onClick={() => setByQty(0)}>{secondaryCoin?.symbol}</p></a></li>
          </ul>
        </div>
      </InputGroup>

      <div className="text-red my-2">
        {error == "" ? "" : error}
      </div>

      <Slider
        min={0}
        step={0.1}
        marks={percentage_marks}
        defaultValue={[0, 25, 50, 75, 100]}
        value={percentage.replace('%', '')}
        onChange={rangeValue}
        className="mb-4 range-slider"
      />
      <InputGroup className="mb-2 text-white-light d-flex align-items-center">
        <div style={{ paddingTop: "2px" }}>
          <input
            type="checkbox"
            checked={TPSL}
            onChange={() => { setTPSL(!TPSL); setTP(''); setSL('') }}
            style={{ minWidth: "100%" }}
          />
        </div>{" "}
        <p style={{ margin: "0", paddingLeft: "5px", fontSize: "11px" }}>
          TP/SL
        </p>
      </InputGroup>
      {
        TPSL ? (
          <>
            <InputGroup className="mb-3">
              <FormControl
                type="number"
                placeholder="Take Profit"
                min="0"
                value={TP}
                onChange={(e) => setTP(e.target.value)}
              />
              <InputGroup.Text id="basic-addon2">
                {secondaryCoin?.symbol}
              </InputGroup.Text>
            </InputGroup>
            <InputGroup className="mb-3">
              <FormControl
                type="number"
                placeholder="Stop Loss"
                min="0"
                value={SL}
                onChange={(e) => setSL(e.target.value)}
              />
              <InputGroup.Text id="basic-addon2">
                {secondaryCoin?.symbol}
              </InputGroup.Text>
            </InputGroup>
          </>
        ) : null
      }

      <div className="d-flex justify-content-between order-value--usdt">
        <div>
          <p className="text-white-light">Order Value:</p>
          <p style={{ fontSize: "smaller" }}>
            {(coinAmountQty * leverage * (toggle == 0 ? parseFloat(buyingRate) : parseFloat(sellingRate))).toFixed(4) + " " + secondaryCoin?.symbol}
          </p>
        </div>
        <div>
          <p className="text-white-light">Order Value:</p>
          <p style={{ fontSize: "smaller" }}>
            {((leverage * coinAmountQty)).toFixed(4) + " " + primaryCoin?.symbol}
          </p>
        </div>
      </div>

      {
        token ? (

          <div className="d-flex justify-content-between">
            {toggle == 1 ?
              <button type="button"
                className={
                  error == "" ?
                    "btn open-long-btn"
                    : "btn open-long-btn disabled"
                }
                onClick={() => { handleShowConfirmation(); if (market == 1) setRate(true) }
                }
              >
                Buy Long
                <p className="text-white-light">
                  {
                    (coinAmountCost) + " " + secondaryCoin?.symbol
                  }
                </p>
              </button>
              :
              <button type="button"
                className={
                  error == "" ?
                    "btn open-short-btn"
                    : "btn open-short-btn disabled"
                }
                onClick={() => {
                  handleShowConfirmation(); if (market == 1) setRate(true)
                }}
              >
                Sell Short
                <p className="text-white-light">
                  {
                    (coinAmountCost) + " " + secondaryCoin.symbol
                  }
                </p>
              </button>
            }
          </div>

        ) : (
          <div className=" buy-tabs">
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
        )
      }

      <div>
        <div className="d-flex justify-content-between mt-5">
          <p>Assets</p>
          <WalletTransfer currencies={currencyData} />
        </div>
        {token ? <>
        {/* { totalBalance = secAvbl +  primAvbl } */}
          <div className="d-flex justify-content-between">
            <p className="text-white-light">
              Total Balance
            </p>
            <p>
              {parseFloat(secAvbl +  primAvbl).toFixed(4) + "  " + secondaryCoin.symbol }
            </p>
          </div>
          <div className="d-flex justify-content-between">
            <p className="text-white-light">
              Futures Balance
            </p>
            <p>
              {parseFloat(secAvbl).toFixed(4) + " " + secondaryCoin.symbol}
            </p>
          </div>
        </> : null}
      </div>

      <div className="deposit-buy-exchange-btns">
        <Link to={'/deposit/' + primaryCoin?.symbol}>
          <button type="button" className="mb-1 btn text-white-light">
            Deposit
          </button>
        </Link>
        <button type="button" className="mb-1 btn text-white-light">
          <WalletTransfer currencies={currencyData} />
        </button>
        <Link to={'/withdraw-crypto/' + primaryCoin?.symbol}>
          <button type="button" className="mb-1 btn text-white-light">
            Withdraw
          </button>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      <section className="header-padding">
        {userId ? <GetAccountData /> : null}
        {loader ? <FullPageLoader /> :
          <>
            <div className="trade-page starbitrex pt-2">
              <TradePriceWidget ticketData={ticketData} primaryCoin={primaryCoin} secondaryCoin={secondaryCoin} setPrimaryCoin={(d) => setPrimaryCoin(d)} setSecondaryCoin={(d) => setSecondaryCoin(d)} pairs={coins} currencyData={currencyData} />
              <Container fluid>
                <div className="trade-page-crypto">
                  <div className="graph-orders-table-wrapper">
                    <div className="graph-and-table-wrapper">
                      <Graph />

                      <Order primaryCoin={primaryCoin} secondaryCoin={secondaryCoin} futureTradesAPI={futureTradesAPI} orderBookAPI={orderBookAPI} selectRate={(rate) => { setBuyingRate(parseFloat(rate)); setSellingRate(parseFloat(rate)) }} />

                    </div>
                    <div className="graph-table">
                      <TradeOrdersDatatables style={{ whitespace: "normal" }}
                        rates={orderBookAPI && orderBookAPI.b && orderBookAPI.b.length ? currentMarketPrice : 0}
                        lowestBuyRate={orderBookAPI && orderBookAPI.b && orderBookAPI.b.length ? currentMarketPrice : 0}
                        highestSellRate={orderBookAPI && orderBookAPI.a && orderBookAPI.a.length ? currentMarketPrice : 0}
                        selectedRow={selectedRow}
                        amounts={amounts}
                        token={token}
                        avbl={initAvbl}
                        updateAvbl={(val) => setSecAvbl(val)}
                        currencyData={currencyData}
                        userOrders={userOrders}
                        setSelectedRow={(d) => setSelectedRow(d)}
                        setTP={(d) => setTP(d)}
                        setSL={(d) => setSL(d)}
                        setLoader={(d) => setLoader(d)}
                        setTrailingPrice={(d) => setTrailingPrice(d)}
                        trailingPrice={trailingPrice}
                        TP={TP}
                        SL={SL}
                      />
                    </div>
                  </div>
                  <div className="buy-and-sell">
                    <div className="flex-row mb-2 text-white d-flex justify-content-between margin-x">
                      <div className="dropdown w-100 buy-and-sell-dd">
                        <button onClick={() => handleShowLeverage()} className="btn text-white dropdown-toggle w-100 d-flex justify-content-between align-items-center" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                          <div className="d-flex">
                            <p className="mb-0 text-white-light pe-2" style={{ borderRight: "1px solid rgba(255, 255, 255, 0.46)" }}>{margin == 0 ? "Cross" : "Isolated"}</p>
                            <p className="mb-0 ms-2">{leverage}x{" "}</p>
                          </div>
                        </button>
                      </div>
                    </div>
                    <div className="buy-sell-tabs">
                      <div className="mb-2 text-white d-flex buy-sell">
                        <div className={toggle ? "point bg-green-tab" : "point"}
                          onClick={() => {
                            setToggle(1);
                            setMarket(0);
                            setCoinAmountQty(0);
                            setCoinAmountCost(0)
                            setPercentage(0 + "%");
                            setError('')
                          }}>
                          <span>Buy</span>
                        </div>
                        <div className={!toggle ? "point bg-red-tab" : "point"}
                          onClick={() => {
                            setToggle(0);
                            setMarket(0);
                            setCoinAmountQty(0);
                            setCoinAmountCost(0)
                            setPercentage(0 + "%");
                            setError('')
                          }}>
                          <span>Sell</span>
                        </div>
                      </div>
                      {ordertabs}
                    </div>
                  </div>
                </div>
              </Container>

              {/* ========================== modal 1 ============================== */}
              <Modal className="withdrawal-modal modal-wrapper modal-wrapper-width set-leverage-modal trade-page-modal" onHide={handleCloseLeverage} show={showLeverage} centered>
                <Modal.Body>


                  <div className="modal-main-heading-content mb-4">
                    <h5 className="modal-title text-white" id="exampleModalLabel">
                      Margin Mode
                    </h5>
                  </div>
                  <div className="by-switch full by-switch--rectangle mb-3">
                    <div onClick={() => setMargin(0)} className={margin == 0 ? "by-switch__item by-switch__item--active" : "by-switch__item"}>Cross</div>
                    <div onClick={() => setMargin(1)} className={margin == 1 ? "by-switch__item by-switch__item--active" : "by-switch__item"}>Isolated</div>
                  </div>
                  {margin == 0 ?
                    <p className="trade-modal-para">
                      Under cross margin, all available balance of the corresponding margin account will be deployed to meet maintenance margin requirements and prevent liquidation. All corresponding available balance can be lost in the event of liquidation. Please note that adjusting the leverage will affect all positions and active orders under the current pair.
                    </p>
                    :
                    <p className="trade-modal-para">
                      Under isolated margin, a specific amount of margin, i.e. initial margin, is applied to a position, and position margin can be adjusted manually. In the event of a liquidation, you may lose the initial margin and extra margin added to this position. Please note that adjusting the leverage will affect all positions and active orders under the current pair.
                    </p>
                  }
                  <div className="laverage-long">
                    <div className="modal-main-heading-content">
                      <h5 className="modal-title text-white" id="exampleModalLabel">
                        Leverage
                      </h5>
                    </div>
                    <InputGroup className="mb-3">
                      <FormControl
                        placeholder="Leverage"
                        min="1"
                        className="text-center"
                        max="100"
                        value={leverage}
                        onChange={(e) => {
                          let val = e.target.value;
                          setLeverage(val);
                        }}
                        onBlur={(e) => handlePercentLimit(e.target.value)}
                      />
                      <InputGroup.Text className="leverageEx"> X </InputGroup.Text>
                    </InputGroup>

                    <Slider
                      min={1}
                      value={leverage}
                      marks={marks}
                      onChange={(val) => {
                        if (val !== 0)
                          setLeverage(val);
                        else
                          setLeverage(1);
                      }}
                      className="range-slider"
                    />

                  </div>
                  <br />
                  <div className="limit-modal-btns mt-4">
                    <button onClick={handleCloseLeverage} type="button" className="btn confirm w-100">Confirm</button>
                  </div>

                </Modal.Body>
              </Modal>

              {/* ============================= modal 2 ================================ */}
              <Modal className="withdrawal-modal modal-wrapper modal-wrapper-width trade-page-modal" centered show={showMargin} onHide={handleCloseMargin}>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                  <div className="modal-main-heading-content">
                    <h5 className="modal-title text-white" id="exampleModalLabel">
                      Set Margin
                    </h5>
                  </div>
                  <div className="flex-row d-flex justify-content-evenly pt-3">
                    <div>
                      {" "}
                      <input
                        type="radio"
                        value="0"
                        name="margin"
                        checked={margin == 0 ? 1 : 0}
                        onClick={() => setMargin(0)}
                      />{" "}
                      <label className="text-white">Cross</label>{" "}
                    </div>
                    <div>
                      {" "}
                      <input
                        type="radio"
                        value="1"
                        name="margin"
                        checked={margin == 1 ? 1 : 0}
                        onClick={() => setMargin(1)}
                      />{" "}
                      <label className="text-white">Isolated</label>{" "}
                    </div>
                  </div>
                </Modal.Body>
              </Modal>

              <div className="batton"></div>
            </div>
          </>
        }
      </section>
      <Modal className="withdraw-details two-factor-auth text-center" centered backdrop="static" show={showConfirmation} onHide={handleCloseConfirmation} >
        <Modal.Header className='modal-main-heading' closeButton>
        </Modal.Header>
        <Modal.Body className='text-white'>
          <>
            <div className="d-flex justify-content-between">
              <p>Order Price</p>
              <p><b>{toggle == 1 ? buyingRate : sellingRate}</b> {secondaryCoin?.symbol}</p>
            </div>
            <div className="d-flex justify-content-between">
              <p>Quantity</p>
              <p><b>{coinAmountQty ? parseFloat(coinAmountQty).toFixed(2) : 0}</b> {primaryCoin?.symbol}</p>
            </div>
            <div className="d-flex justify-content-between">
              <p>Order Value</p>
              <p><b>{coinAmountCost ? parseFloat(coinAmountCost) : 0}</b> {secondaryCoin.symbol}</p>
            </div>
            <br />
          </>
          <div className="limit-modal-btns">
            <button type="button" onClick={() => { handleSubmit() }} className="btn confirm">Confirm</button>
            <button type="button" onClick={handleCloseConfirmation} className="btn cancel">Cancel</button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default TradeInfo;