import React, { useEffect, useState } from 'react';
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
import GBP from '../../assets/images/GBP.png';
import CNF from '../../assets/images/CoinNotFound.png';
import { useDispatch, useSelector } from "react-redux";
import { getCurrency } from "../../redux/currencies/currencyActions";
import { toast } from "react-toastify";
import axios from "axios";
import { addInternalOrder, ClearData } from "../../redux/internalOrder/internalOrderActions";
import Swal from "sweetalert2";
import { getTransactionFee } from "../../redux/transactionFee/transactionFeeActions";
import { getAccount } from "../../redux/account/accountActions";
import { Modal } from 'react-bootstrap';
import EXC from '../../assets/images/exchange-svg-icon.svg';
import { useParams } from 'react-router-dom';
import { exponentToNumber } from '../../redux/apiHelper';
import { socketConnection } from '../../redux/apiHelper';

// const socketURL = process.env.REACT_APP_SOCKET_URL;


const Index = () => {

  const { symbol } = useParams();
  const token = localStorage.getItem("uToken");
  const [userCoin, setUserCoin] = useState({});
  const [exchangeCoin, setExchangeCoin] = useState({});
  const [amount, setAmount] = useState("");
  const [amountErr, setAmountErr] = useState("");
  const [exchangeAmount, setExchangeAmount] = useState("");
  const [haveCoins, setHaveCoins] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(0);
  const [rate, setRate] = useState(0);
  const [problem, setProblem] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const handleCloseConfirmation = () => setShowConfirmation(false);
  const handleShowConfirmation = () => setShowConfirmation(true);

  const dispatch = useDispatch();
  const currencyData = useSelector((state) => state.currency?.currencies?.allCurrencies);
  const userId = useSelector((state) => state.user?.user?._id);
  const amounts = useSelector((state) => state.accounts?.account?.amounts);
  const success = useSelector((state) => state.internalOrders?.success);

  useEffect(() => {
    dispatch(getCurrency());
    if (userId) dispatch(getAccount(userId));
  }, [userId]);

  useEffect(() => {
    if (success) {
      Swal.fire({
        // title: 'Success',
        text: "Order added successfully",
        icon: "success",
        showCancelButton: false,
        confirmButtonText: "OK",
      }).then((result) => {
        dispatch(getAccount(userId));
        setUserCoin({});
        setExchangeCoin({});
        setAmount(0);
        setExchangeAmount(0);
        setHaveCoins(0);
        setExchangeRate(0);
        dispatch(ClearData())
      });
    }
  }, [success]);

  const userCoinChange = (coin) => {
    getFee(coin._id);
    setUserCoin(coin);
    setHaveCoins(amounts?.find((row) => row.currencyId == coin._id).amount);
    axios
      .get(
        `https://min-api.cryptocompare.com/data/price?fsym=${coin.symbol}&tsyms=ETH,LINK,AVAX,DOGE,BCH,LTC,TRX,BNB,ADA,BTC,USDT,USD,AUD,CAD,NZD,EUR,GBP&api_key=6f8e04fc1a0c524747940ce7332edd14bfbacac3ef0d10c5c9dcbe34c8ef9913`
      )
      .then((res) => {
        setExchangeRate(res.data);
      })
      .catch((error) => {
        setProblem(true);
      });
  };

  useEffect(async () => {
    if (currencyData) {
      let found = await currencyData?.find(currency => currency.symbol == symbol);
      let exchangeCurr = {};
      if (symbol == 'USDT') {
        exchangeCurr = await currencyData?.find(currency => currency.symbol == 'BTC');
      }
      else {
        exchangeCurr = await currencyData?.find(currency => currency.symbol == 'USDT');
      }

      userCoinChange(found);
      setExchangeCoin(exchangeCurr);
    }
  }, [currencyData, amounts])

  const handleLimit = (val) => {
    if (userCoin && userCoin.symbol) {
      var validNumber = new RegExp(/^\d*\.?\d*$/);
      if (
        !val.toString().match(validNumber) ||
        parseFloat(val) >
        parseFloat(
          haveCoins - userCoin.conversionFee >= 0 ? haveCoins - userCoin.conversionFee : 0
        )
      ) {
        Swal.fire({
          // title: 'Success',
          text: "Invalid number entered. Please enter a valid number",
          icon: "info",
          showCancelButton: false,
          confirmButtonText: "OK",
        });
        setAmount(0);
        userAmountChange(0);
      }
    } else {
      Swal.fire({
        // title: 'Success',
        text: "Please select currency first",
        icon: "info",
        showCancelButton: false,
        confirmButtonText: "OK",
      });
      setAmount(0);
      userAmountChange(0);
    }
  };

  const userAmountChange = (val) => {
    val = parseFloat(val);

    if (val) {
      if (val == 0 || val < userCoin.minAmount) {
        setAmount(val)
        setAmountErr("Minimum amount is: " + userCoin.minAmount)
      }
      else if (val > userCoin.maxAmount) {
        setAmount(val)
        setAmountErr("Maximum amount is: " + userCoin.maxAmount)
      }
      else if ((val + convFeePercentage(userCoin.conversionFee, val)) > parseFloat(haveCoins)) {
        setAmount(val)
        setAmountErr(`Available amount is: ${parseFloat(haveCoins)}. You are trying to exchange ${val?.toFixed(2)} ${userCoin.symbol} with ${convFeePercentage(userCoin.conversionFee, val).toFixed(2)} ${userCoin.symbol} fee.`)
      }
      else {
        setAmount(val)
        setAmountErr("")
      }
    } else {
      setAmount(val)
      setAmountErr("")
    }
    // setAmount(val);
    if (exchangeCoin) {
      let a = exchangeCoin?.symbol;
      setRate(exchangeRate[a]);
      setExchangeAmount(val * exchangeRate[a]);
    } else {
      setExchangeAmount(val);
    }
  };

  const convFeePercentage = (num, newAmount = 0) => {

    let getValueInPercentage = (amount * num) / 100;
    if (newAmount != 0) {
      getValueInPercentage = (newAmount * num) / 100;
    }

    if (getValueInPercentage.toString().includes('e') == true) {
      //getValueInPercentage = exponentToNumber(getValueInPercentage)
    }

    return getValueInPercentage;
  }

  const handleConvert = async (e) => {
   
    e.preventDefault();
    if (parseFloat(amount) < userCoin.minAmount || haveCoins <= 0) {
      Swal.fire({
        // title: 'Success',
        text: "Cannot Exchange this Amount",
        icon: "info",
        showCancelButton: false,
        confirmButtonText: "OK",
      });
    } else {
      let a = exchangeCoin?.symbol;
      let exRate = exchangeRate[a];
      let finalConvertedAmount = userCoin.conversionFee > 0 ? convFeePercentage(userCoin.conversionFee) : 0;
      let data = {
        userId: userId,
        fromCurrency: userCoin?._id,
        toCurrency: exchangeCoin?._id,
        fromCurrencySymbol: userCoin?.symbol,
        toCurrencySymbol: exchangeCoin?.symbol,
        conversionRate: parseFloat(exRate),
        fromAmountWithoutFee: parseFloat(amount),
        // fromAmount: parseFloat(amount) + userCoin.conversionFee,
        fromAmount: parseFloat(amount) + finalConvertedAmount,
        convertedAmount: parseFloat(exchangeAmount),
        coversionFee: finalConvertedAmount
        // coversionFee: userCoin.conversionFee
      };
      await dispatch(addInternalOrder(data));

      //connect socket and emit notification
      await socketConnection()

      handleCloseConfirmation()
    }
  };

  const getFee = (currency) => {
    let data = { currencyIds: [currency] };
    dispatch(getTransactionFee(data));
  };

  const exchange = () => {
    let tempCoin = userCoin;
    userCoinChange(exchangeCoin);
    setRate(0);
    getFee(tempCoin._id);
    setExchangeCoin(tempCoin);
    setAmount(0);
    setExchangeAmount(0);
  };

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
    else if (name == 'GBP')
      return GBP;

    return CNF;
  };

  return (
    <>
      <section className="header-padding">
        <div className="exchange-crypto">
          <div className="container">
            <div className="crypto-fields-dd">
              <div className="crypto-have">
                <div className="dropdown crypto-have-dropdown">
                  <a className="btn dropdown-toggle text-white" role="button" id="dropdownMenuLink"
                    data-bs-toggle="dropdown" aria-expanded="false">
                    <div className="dd-coin-img">
                      <img src={getCoinImg(userCoin?.symbol)} alt="" className="img-fluid" />
                    </div>
                    <div>
                      <p className="text-white-light m-0 text-start">
                        You Pay
                      </p>
                      <div className="dd-coin-name">
                        {userCoin && userCoin.symbol
                          ? userCoin.symbol
                          : "Select"}
                      </div>
                    </div>
                  </a>

                  <ul className="dropdown-menu dropdown-scrollable" aria-labelledby="dropdownMenuLink">
                    {currencyData && currencyData.length > 0 && currencyData.filter((c) => c.symbol !== exchangeCoin.symbol).map((currency) => (
                      <li>
                        <a className="dropdown-item" onClick={() => { userCoinChange(currency); userAmountChange(0) }}>
                          <img src={getCoinImg(currency?.symbol)} alt="" className="img-fluid coin-img pe-1" />
                          {currency.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <h3 className="text-white m-0">
                  <div>
                    <p className='mb-1'>Available amount: {' '}
                      {token ?
                        haveCoins ? parseFloat(haveCoins).toFixed(2) : ''
                        : "--"
                      }
                    </p>
                  </div>
                  <div className='text-end'>
                    <input type="number" placeholder={userCoin.minAmount + "-" + userCoin.maxAmount} value={amount} onChange={(e) => { userAmountChange(e.target.value) }} />
                  </div>
                  <div>
                    {amountErr ? (<span className="errMsg">{amountErr}</span>) : ("")}
                  </div>
                </h3>
              </div>

              <div className="text-center" style={{ marginTop: "-15px" }}>
                <img style={{ width: "30px" }} src={EXC} className='img-fluid' alt='' onClick={() => { if (userCoin && userCoin.symbol && exchangeCoin && exchangeCoin.symbol) exchange() }} />
              </div>

              <div className="crypto-have" style={{ marginTop: "-10px" }}>
                <div className="dropdown crypto-have-dropdown">
                  <a className="btn dropdown-toggle text-white" role="button" id="dropdownMenuLink"
                    data-bs-toggle="dropdown" aria-expanded="false">
                    <div className="dd-coin-img">
                      <img src={getCoinImg(exchangeCoin?.symbol)} alt="" className="img-fluid" />
                    </div>
                    <div>
                      <p className="text-white-light m-0 text-start">
                        You get
                      </p>
                      <div className="dd-coin-name">
                        {exchangeCoin && exchangeCoin.symbol
                          ? exchangeCoin.symbol
                          : "Select"}
                      </div>
                    </div>
                  </a>

                  <ul className="dropdown-menu dropdown-scrollable" aria-labelledby="dropdownMenuLink">
                    {currencyData &&
                      currencyData.length > 0 &&
                      currencyData
                        .filter((c) => c.symbol !== userCoin.symbol)
                        .map((currency) => (
                          <li>
                            <a className="dropdown-item" onClick={() => {
                              setExchangeCoin(currency);
                              let a = currency?.symbol;
                              // setExchangeAmount(
                              //   (parseFloat(amount) - parseFloat(amount) * (userCoin.conversionFee / 100)) * exchangeRate[a]
                              // );
                              setExchangeAmount(
                                parseFloat(amount) * exchangeRate[a]
                              );
                              setRate(exchangeRate[a]);
                            }}>
                              <img src={getCoinImg(currency?.symbol)} alt="" className="img-fluid coin-img pe-1" />
                              {currency.name}
                            </a>
                          </li>
                        ))}
                  </ul>
                </div>
                <h3 className="text-white m-0">
                  <input type="number" value={amountErr ? "" : (exchangeAmount == 0 ? exchangeAmount : parseFloat(exchangeAmount).toFixed(9))} disabled />
                </h3>
              </div>
            </div>

            <div className='crypto-have' style={{ flexDirection: "column", backgroundColor: "unset" }}>
              {!amountErr && userCoin &&
                userCoin.symbol &&
                exchangeCoin &&
                exchangeCoin.symbol &&
                amount &&
                exchangeAmount ? (
                <>
                  <div className="text-white-light mb-2 d-sm-flex justify-content-between w-100">
                    <p>Price</p> <p>1 {userCoin && userCoin.symbol ? userCoin.symbol : "Coin"} = {` ${rate} `}
                      {exchangeCoin && exchangeCoin.symbol
                        ? exchangeCoin.symbol
                        : "Coin"}</p>
                  </div>
                  <div className="text-white-light mb-2 d-sm-flex justify-content-between w-100">
                    <p>Inverse Price</p> <p> 1 {exchangeCoin.symbol}  = {1 / rate} {userCoin.symbol}</p>
                  </div>
                  <div className="text-white-light mb-2 d-sm-flex justify-content-between w-100">
                    <p>You will spend</p>  <p>{`${amount + convFeePercentage(userCoin.conversionFee)} ${userCoin.symbol}`}</p>
                  </div>
                  <div className="text-white-light mb-2 d-sm-flex justify-content-between w-100">
                    {/* <p>Conversion Fee</p>  <p>{userCoin.conversionFee}</p> */}
                    <p>Conversion Fee</p>
                    <p>
                      {
                        userCoin.conversionFee > 0 ? convFeePercentage(userCoin.conversionFee) : ''
                      }
                    </p>
                  </div>
                </>
              ) : null}
            </div>

            <div className="min-half-max-btns">
              <button type="button" className="btn" onClick={() => userAmountChange(haveCoins > 0 ? userCoin.minAmount : 0)}>
                MIN
              </button>
              <button type="button" className="btn" onClick={() => userAmountChange(haveCoins > 0 ? (haveCoins) / 2 : 0)}>
                HALF
              </button>
              <button style={{ border: "0" }} type="button" className="btn" onClick={() => userAmountChange(haveCoins > 0 ? (haveCoins - convFeePercentage(userCoin.conversionFee, haveCoins)) : 0)}>
                MAX
              </button>
            </div>
            {!amountErr && userCoin &&
              userCoin.symbol &&
              exchangeCoin &&
              exchangeCoin.symbol &&
              amount &&
              exchangeAmount ? (
              <>
                <div className="text-center mb-3">
                  <button type="button" className="btn enter-btn2" disabled="" onClick={(e) => handleShowConfirmation(e)}>
                    Enter
                  </button>
                </div>
              </>
            ) : null}
          </div>
          <div className="batton connect-device batton-opacity"></div>
        </div>
      </section>

      <Modal className="withdraw-details two-factor-auth text-center" centered backdrop="static" show={showConfirmation} onHide={handleCloseConfirmation} >
        <Modal.Header className='modal-main-heading' closeButton>
        </Modal.Header>
        <Modal.Body className='text-white'>
          <p> <b>Converting {userCoin.symbol + " to " + exchangeCoin.symbol} </b></p>
          <p> <b>Amount: {`${amount} ${userCoin.symbol}`} = {`${amount * rate} ${exchangeCoin.symbol}`} </b></p>
          {/* <p> <b>Conversion Fee: {userCoin.conversionFee}</b> </p> */}
          <p> <b>
            Conversion Fee:
            {
              userCoin.conversionFee > 0 ? convFeePercentage(userCoin.conversionFee) : 0
            }
          </b>
          </p>
          <br />
          <div className="limit-modal-btns">
            <button type="button" onClick={(e) => { handleConvert(e) }} className="btn confirm">Confirm</button>
            <button type="button" onClick={handleCloseConfirmation} className="btn cancel">Cancel</button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Index;
