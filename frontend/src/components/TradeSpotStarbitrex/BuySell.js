import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import Slider from "rc-slider";
import { useDispatch, useSelector } from "react-redux";
import { getCurrency } from "../../redux/currencies/currencyActions";
import GetAccountData from "../shared/GetAccountData";
import { Link } from "react-router-dom";
import { addSpotOrder, clearSpotOrder, getUserSpotOrders } from "../../redux/spotOrder/spotOrderActions";
import { getAccount } from "../../redux/account/accountActions";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const BuySell = ({ updateRate, primaryCoin, secondaryCoin, setPrimaryCoin, setSecondaryCoin, marketRate }) => {

  const marks = {
    0: "0%",
    25: "25%",
    50: "50%",
    75: "75%",
    100: "100%",
  };

  const token = localStorage.getItem("uToken");
  const coins = ['BTCUSDT', 'ETHUSDT', 'LINKUSDT', 'AVAXUSDT', 'DOGEUSDT', 'BCHUSDT', 'LTCUSDT', 'TRXUSDT', 'BNBUSDT', 'ADAUSDT'];
  const [crSymbol, setCrSymbol] = useState("ETHUSDT");
  const [primAvbl, setPrimAvbl] = useState(0);
  const [secAvbl, setSecAvbl] = useState(0);
  const [rate, setRate] = useState(0);
  const [buyAmt, setBuyAmt] = useState(0);
  const [sellAmt, setSellAmt] = useState(0);
  const [buyTotalAmt, setBuyTotalAmt] = useState(0); // in USDT
  const [sellTotalAmt, setSellTotalAmt] = useState(0); // in USDT
  const [buySlider, setBuySlider] = useState(0);
  const [sellSlider, setSellSlider] = useState(0);
  const [loader, setLoader] = useState(false);
  const [checkType, setCheckType] = useState(1);
  const [getMarketRate, setGetMarketRate] = useState(true);

  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user?.user?._id);
  const currencyData = useSelector((state) => state.currency?.currencies?.allCurrencies);
  const amounts = useSelector((state) => state.accounts?.account?.amounts);
  const [market, setMarket] = useState(0); // 1=market 0=limit
  const success = useSelector((state) => state.spotOrder?.success);
  const auto = useSelector((state) => state.spotOrder?.auto);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const handleCloseConfirmation = () => setShowConfirmation(false);
  const [buyAmountErr, setBuyAmountErr] = useState("");
  const [sellAmountErr, setSellAmountErr] = useState("");
  const [disableButton, setDisableButton] = useState(false);

  const defaultAssignment = () => {
    setCrSymbol("ETHUSDT");
    let prim = currencyData?.find((row) => row.symbol == "ETH");
    setPrimaryCoin(prim);
    let sec = currencyData?.find((row) => row.symbol == "USDT");
    if (amounts) {
      setPrimAvbl(amounts?.find((row) => row.currencyId == prim?._id)?.amount);
      setSecAvbl(amounts?.find((row) => row.currencyId == sec?._id)?.amount);
    }
    setSecondaryCoin(sec);
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
        if (amounts) {
          setPrimAvbl(amounts?.find((row) => row.currencyId == prim?._id)?.amount);
          setSecAvbl(amounts?.find((row) => row.currencyId == sec?._id)?.amount);
        }
        setSecondaryCoin(sec);
      } else {
        defaultAssignment()
      }
    }
  }, [currencyData, amounts]);

  useEffect(async () => {
    dispatch(getCurrency());
  }, []);

  useEffect(async () => {
    if (primaryCoin) {
      setGetMarketRate(true);
      setRate(0)
      setBuyAmt(0);
      setSellAmt(0);
      setSellTotalAmt(0);
      setBuyTotalAmt(0);
      if (amounts) {
        setPrimAvbl(amounts?.find((row) => row.currencyId == primaryCoin?._id)?.amount);
        setSecAvbl(amounts?.find((row) => row.currencyId == secondaryCoin?._id)?.amount);
      }
    }
  }, [primaryCoin]);

  useEffect(async () => {
    if (updateRate !== 0) {
      setRate(updateRate);
    }
  }, [updateRate]);

  useEffect(async () => {
    // console.log(!!primaryCoin.symbol, !!secondaryCoin.symbol, !!marketRate, (getMarketRate || rate == 0))
    if (!!primaryCoin.symbol && !!secondaryCoin.symbol && (getMarketRate || rate == 0)) {
      let vall = marketRate
      if (marketRate) {
        setRate(parseFloat(vall));
        setBuyTotalAmt(parseFloat(buyAmt) * (vall))
        setSellTotalAmt(parseFloat(sellAmt) * (vall))
        if (market) {
          setGetMarketRate(false)
        }
      }
      else {
        setRate(0);
      }
    }
  }, [primaryCoin, marketRate, getMarketRate]);

  const setBuyPrice = (amount) => {

    setBuyAmountErr("")
    if (secAvbl) {
      let pr = ((amount * rate) * 100) / secAvbl;
      setBuySlider(pr);
      if (pr > 100 || pr < 0) {
        setBuyAmountErr("Invalid number entered. Please enter a valid number")
      }
      setBuyAmt(amount);
      setBuyTotalAmt(parseFloat(amount) * (rate))
    }
  }
  const setSellPrice = (amount) => {
    setSellAmountErr("")
    if (primAvbl) {
      let pr = (amount * 100) / primAvbl;
      setSellSlider(pr);
      if (pr > 100 || pr < 0) {
        setSellAmountErr("Invalid number entered. Please enter a valid number")
      }
      setSellAmt(amount);
      setSellTotalAmt(parseFloat(amount) * (rate))
    }
  }

  const clickMarketTab = (market) => {
    if (market)
      setGetMarketRate(true)
    setMarket(market);
    setBuyAmountErr("");
    setSellAmountErr("");
  }

  const handleShowConfirmation = async (buy_sell) => {
    setCheckType(buy_sell);
    setBuyAmountErr("");
    setSellAmountErr("");
    var amount = await buy_sell == 1 ? (buyAmt * rate) : sellAmt;
    var avail = buy_sell == 1 ? secAvbl : primAvbl;
    if (parseFloat(amount) >= parseFloat(avail) || parseFloat(amount) <= 0) {
      if (buy_sell == 1) {
        setBuyAmountErr("Cannot Buy this Amount")
      }
      else {
        setSellAmountErr("Cannot Sell this Amount")
      }
    } else {
      setShowConfirmation(true);
    }
  };

  const handleConvert = () => {
    let qty = checkType == 1 ? buyAmt : sellAmt;
    var amount = checkType == 1 ? (buyAmt * rate) : sellAmt;
    var sendRate = market == 1 ? marketRate : rate;
    let data = {
      userId: userId,
      spotPair: primaryCoin?.symbol + secondaryCoin?.symbol,
      fromCurrency: checkType == 1 ? secondaryCoin?._id : primaryCoin?._id,
      fromCurrencySymbol: checkType == 1 ? secondaryCoin?.symbol : primaryCoin?.symbol,
      toCurrency: checkType == 1 ? primaryCoin?._id : secondaryCoin?._id,
      toCurrencySymbol: checkType == 1 ? primaryCoin?.symbol : secondaryCoin?.symbol,
      tradeType: checkType == 1 ? 1 : 0,
      tradeStartPrice: parseFloat(sendRate),
      userInvestedAmount: parseFloat(amount),
      marketOrder: parseFloat(market), // 1=market 0=limit,
      tradeEndPrice: parseFloat(checkType == 1 ? buyTotalAmt : sellTotalAmt),
      investedQty: parseFloat(qty)
      // tradeEndPrice: "1234"// buyTotalAmt // : sellTotalAmt
    };
    dispatch(addSpotOrder(data));
    handleCloseConfirmation();
    setLoader(true);
    setDisableButton(true);
  }

  useEffect(() => {
    if (success) {
      // if(market == 1) {
      //   setSecAvbl( parseFloat(secAvbl) - parseFloat(sellAmt));
      // }
      setLoader(false);
      dispatch(clearSpotOrder());
      if (userId) {
        dispatch(getAccount(userId));
        dispatch(getUserSpotOrders(userId));
      }
      setBuyAmt(0);
      setSellAmt(0);
      setSellTotalAmt(0);
      setBuyTotalAmt(0);
      setDisableButton(false);
      // Swal.fire({
      //   title: "Success",
      //   text: "Please check your Trade Order in the Order Listings below.",
      //   icon: "success",
      //   showCancelButton: false,
      //   confirmButtonText: "OK",
      // })
    }
  }, [success]);

  useEffect(() => {
    if (auto) {
      dispatch(clearSpotOrder());
      if (userId) {
        dispatch(getAccount(userId));
        dispatch(getUserSpotOrders(userId));
      }
    }
  }, [auto]);

  return (
    <>
      {userId ? <GetAccountData /> : null}
      <div className="trade-spot-transfer">
        <h5>Spot</h5>
        <div className="tabs-transfer mt-3">
          <div className="tabs-">
            <span className={market == 0 ? "text-green point me-4" : "text-light point me-4"} onClick={() => clickMarketTab(0)}>
              Limit
            </span>
            <span className={market == 1 ? "text-green point" : "text-light point"} onClick={() => clickMarketTab(1)}>
              Market
            </span>
            <div className="buy-sell-btc mt-3">
              <div className="buy-btc">
                <div className="avdl-usdt mb-2">
                  <p className="m-0 text-white-light">Avbl</p>
                  <p className="m-0 text-white">{token ? parseFloat(secAvbl).toFixed(2) : "--"} {secondaryCoin.symbol}</p>
                </div>
                <div className="price-amount">
                  {market == 0 ?
                    <div className="custom-form-field mb-3">
                      <div>
                        <label className="text-white-light">Price</label>
                      </div>
                      <div className="d-flex">
                        <input type="number" value={rate} onChange={(e) => { setRate(e.target.value); setGetMarketRate(false); }} />
                        <div>
                          <label className="text-white">{secondaryCoin.symbol}</label>
                        </div>
                      </div>
                    </div>
                    : ""
                  }
                  <div className="custom-form-field mb-3">
                    <div>
                      <label className="text-white-light">Amount</label>
                    </div>
                    <div className="d-flex">
                      <input type="number" value={buyAmt} onChange={(e) => { setBuyPrice(e.target.value) }} max={secAvbl} min={0} />
                      <div>
                        <label className="text-white">{primaryCoin.symbol}</label>
                      </div>
                    </div>
                  </div>
                  <div>
                    {buyAmountErr ? (<span className="errMsg">{buyAmountErr}</span>) : ("")}
                  </div>
                </div>
                <Slider
                  min={0}
                  step={0.1}
                  marks={marks}
                  defaultValue={[0, 25, 50, 75, 100]}
                  className="mb-4 range-slider trade-spot-range-slider"
                  onChange={(val) => { if (token) setBuyPrice(((secAvbl * (val / 100)) / rate) >= 0 ? ((secAvbl * (val / 100) / rate)) : 0) }}
                  value={buySlider}
                />
                {market == 0 ?
                  <div className="price-amount">
                    <div className="custom-form-field mb-3">
                      <div>
                        <label className="text-white-light">Total</label>
                      </div>
                      <div className="d-flex">
                        <input type="number" value={parseFloat(buyTotalAmt).toFixed(2)} disabled />
                        <div>
                          <label className="text-white">{secondaryCoin.symbol}</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  : ""
                }
                {token ? (
                  <div className="text-center">
                    {disableButton ?
                      <button type="button" className="btn buy-btc-btn">
                        <FontAwesomeIcon icon={faSpinner} className="fa-spin" />
                      </button>
                      :
                      <button type="button" disabled={disableButton} className="btn buy-btc-btn" onClick={() => { if (market) setGetMarketRate(true); handleShowConfirmation(1) }}>
                        Buy {primaryCoin.symbol}
                      </button>}
                  </div>
                ) : (
                  <div className=" buy-tabs">
                    <Link to="/register">
                      <button type="button" className="mb-2 register-now">Register Now</button>
                    </Link>
                    <Link to="/login">
                      <button type="button" className="login-now">Log In</button>
                    </Link>
                  </div>
                )}
              </div>
              <div className="sell-btc">
                <div className="avdl-usdt mb-2">
                  <p className="m-0 text-white-light">Avbl</p>
                  <p className="m-0 text-white">{token ? parseFloat(primAvbl).toFixed(2) : "--"} {primaryCoin.symbol}</p>
                </div>
                <div className="price-amount">
                  {market == 0 ?
                    <div className="custom-form-field mb-3">
                      <div>
                        <label className="text-white-light">Price</label>
                      </div>
                      <div className="d-flex">
                        <input type="number" value={rate} onChange={(e) => setRate(e.target.value)} />
                        <div>
                          <label className="text-white">{secondaryCoin.symbol}</label>
                        </div>
                      </div>
                    </div>
                    : ""
                  }
                  <div className="custom-form-field mb-3">
                    <div>
                      <label className="text-white-light">Amount</label>
                    </div>
                    <div className="d-flex">
                      <input type="number" value={sellAmt} onChange={(e) => { setSellPrice(e.target.value) }} max={primAvbl} min={0} />
                      <div>
                        <label className="text-white">{primaryCoin.symbol}</label>
                      </div>
                    </div>
                  </div>
                  <div>
                    {sellAmountErr ? (<span className="errMsg">{sellAmountErr}</span>) : ("")}
                  </div>
                </div>
                <Slider
                  min={0}
                  step={0.1}
                  marks={marks}
                  defaultValue={[0, 25, 50, 75, 100]}
                  className="mb-4 range-slider trade-spot-range-slider"
                  onChange={(val) => { if (token) setSellPrice((primAvbl * (val / 100)) >= 0 ? (primAvbl * (val / 100)) : 0); }}
                  value={sellSlider}
                />
                {market == 0 ?
                  <div className="price-amount">
                    <div className="custom-form-field mb-3">
                      <div>
                        <label className="text-white-light">Total</label>
                      </div>
                      <div className="d-flex">
                        <input type="number" value={parseFloat(sellTotalAmt).toFixed(2)} disabled />
                        <div>
                          <label className="text-white">{secondaryCoin.symbol}</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  : ""
                }
                {token ? (
                  <div className="text-center">
                    <button type="button" className="btn sell-btc-btn" onClick={() => { if (market) setGetMarketRate(true); handleShowConfirmation(2) }}>
                      Sell {primaryCoin.symbol}
                    </button>
                  </div>
                ) : (
                  <div className=" buy-tabs">
                    <Link to="/register">
                      <button type="button" className="mb-2 register-now">Register Now</button>
                    </Link>
                    <Link to="/login">
                      <button type="button" className="login-now">Log In</button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* <p className="m-0 transfer">Transfer</p> */}
        </div>
      </div>

      <Modal className="withdraw-details two-factor-auth text-center" centered backdrop="static" show={showConfirmation} onHide={handleCloseConfirmation} >
        <Modal.Header className='modal-main-heading' closeButton>
        </Modal.Header>
        <Modal.Body className='text-white'>
          {/* <p> <b>Invested Amount {sellAmt + " to " + exchangeCoin.symbol} </b></p> */}
          {checkType == 1 ?
            <>
              <div className="d-flex justify-content-between">
                <p>Order Price</p>
                <p><b>{rate}</b> {secondaryCoin.symbol}</p>
              </div>
              <div className="d-flex justify-content-between">
                <p>Quantity</p>
                <p><b>{buyAmt}</b> {primaryCoin.symbol}</p>
              </div>
              <div className="d-flex justify-content-between">
                <p>Order Value</p>
                <p><b>{parseFloat(buyTotalAmt).toFixed(2)}</b> {secondaryCoin.symbol}</p>
              </div>
              <br />
            </>
            :
            <>
              <div className="d-flex justify-content-between">
                <p>Order Price</p>
                <p><b>{rate}</b>  {secondaryCoin.symbol}</p>
              </div>
              <div className="d-flex justify-content-between">
                <p>Quantity</p>
                <p><b>{sellAmt}</b> {primaryCoin.symbol}</p>
              </div>
              <div className="d-flex justify-content-between">
                <p>Order Value</p>
                <p><b>{parseFloat(sellTotalAmt).toFixed(2)}</b> {secondaryCoin.symbol}</p>
              </div>
              <br />
            </>
          }
          <div className="limit-modal-btns">
            <button type="button" onClick={() => { handleConvert() }} className="btn confirm">Confirm</button>
            <button type="button" onClick={handleCloseConfirmation} className="btn cancel">Cancel</button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );

};

export default BuySell;
