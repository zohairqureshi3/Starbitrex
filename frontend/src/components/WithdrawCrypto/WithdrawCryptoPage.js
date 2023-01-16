import Overview from "./Overview";
import RecentDeposit from "./RecentDeposit";
import UserWalletAddress from "./UserWalletAddress";
import { React, useEffect, useState } from 'react';
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
import Swal from 'sweetalert2';
import { Modal } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { getCurrency } from '../../redux/currencies/currencyActions';
import { getNetwork } from '../../redux/networks/networkActions';
import { getWallets } from '../../redux/addresses/externalWalletActions';
import { getCards } from '../../redux/cards/creditCardActions';
import { getWithdrawFee, resetWithdrawFee } from '../../redux/withdrawFee/withdrawFeeActions';
import { clearWithdraw, submitWithdraw } from '../../redux/externalTransactions/externalTransactionActions';
import { clearFiatWithdraw, submitFiatWithdraw } from "../../redux/externalFiatTransactions/externalFiatTransactionActions";
import { clearBankWithdraw, submitBankWithdraw } from "../../redux/externalBankTransactions/externalBankTransactionActions";
import { getBankAccounts } from '../../redux/bankAccounts/bankAccountActions';
import GetAccountData from '../shared/GetAccountData';
import { getAccount } from '../../redux/account/accountActions';
import FullPageLoader from "../FullPageLoader/fullPageLoader";
import AddAddress from "./AddAddress";
import Cards from 'react-credit-cards';
import 'react-credit-cards/es/styles-compiled.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faQuestionCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';
import CopyToClipboard from 'react-copy-to-clipboard';
import UserCards from "./UserCards";
import AddCard from "./AddCard";
import AddBankAccount from "./AddBankAccount";
import UserBankAccounts from "./UserBankAccounts";
import { toast } from 'react-toastify';
import { socketConnection } from "../../redux/apiHelper";

const WithdrawCryptoPage = () => {

  const { symbol } = useParams();
  const [show, setShow] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [showBank, setShowBank] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [showAddCards, setShowAddCards] = useState(false);
  const [showBankAccount, setShowBankAccount] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleCloseAddr = () => setShowAddAddress(false);
  const handleShowAddr = () => setShowAddAddress(true);

  const handleCloseCard = () => setShowCard(false);
  const handleShowCard = () => setShowCard(true);
  const handleShowBank = () => setShowBank(true)
  const handleCloseBank = () => setShowBank(false);
  const handleCloseCC = () => setShowAddCards(false);
  const handleShowCC = () => setShowAddCards(true);
  const handleShowBankAccount = () => setShowBankAccount(true);
  const handleCloseBankAccount = () => setShowBankAccount(false);

  const [selectedCurrency, setSelectedCurrency] = useState([]);
  const [selectedNetwork, setSelectedNetwork] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState([]);
  const [withdrawTo, setWithdrawTo] = useState(1); // 1: Address book , 2: New address
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [haveCoins, setHaveCoins] = useState(0);
  const [withdrawCoins, setWithdrawCoins] = useState(0);
  const [loader, setLoader] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showConfirmationCC, setShowConfirmationCC] = useState(false);
  const [showConfirmationBank, setShowConfirmationBank] = useState(false);
  const [depositCoin, setDepositCoin] = useState(true);
  const [depositCoin2, setDepositCoin2] = useState(false);
  const [depositCoin3, setDepositCoin3] = useState(false);
  const [number, SetNumber] = useState("");
  const [name, SetName] = useState("");
  const [month, SetMonth] = useState("");
  let [expiry, SetExpiry] = useState("");
  const [cvc, SetCvc] = useState("");
  const [focus, SetFocus] = useState("");

  const [selectedCard, setSelectedCard] = useState([]);
  const [selectedBank, setSelectedBank] = useState([]);

  const [Iban, setIban] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankAddress, setBankAddress] = useState("");
  const [swiftCode, setSwiftCode] = useState("");

  const handleCloseConfirmation = () => setShowConfirmation(false);
  const handleCloseConfirmationCC = () => setShowConfirmationCC(false);
  const handleCloseConfirmationBank = () => setShowConfirmationBank(false);
  const handleShowConfirmation = () => setShowConfirmation(true);
  const handleShowConfirmationCC = () => setShowConfirmationCC(true);
  const handleShowConfirmationBank = () => setShowConfirmationBank(true);
  const handleDate = (e) => {
    SetMonth(e.target.value);
    SetExpiry(e.target.value);
  };
  const handleExpiry = (e) => {
    SetExpiry(month.concat(e.target.value));
  };

  const dispatch = useDispatch();
  const currencyData = useSelector((state) => state.currency?.currencies?.allCurrencies);
  const externalWallets = useSelector((state) => state.externalWallets?.externalWallets);
  const creditCards = useSelector((state) => state.creditCards?.creditCards);
  const bankAccounts = useSelector((state) => state.bankAccounts?.bankAccounts);
  const networks = useSelector((state) => state.networks?.networks);
  const userId = useSelector((state) => state.user?.user?._id);
  const amounts = useSelector((state) => state.accounts?.account?.amounts);
  const withdrawFee = useSelector((state) => state.withdrawFee?.withdrawFee);
  const withdrawn = useSelector((state) => state.externalTransactions?.withdrawn);
  const fiatWithdrawn = useSelector((state) => state.externalFiatTransactions?.fiatWithdrawn);
  const bankWithdrawn = useSelector((state) => state.externalBankTransactions?.bankWithdrawn);
  const bankWithdrawMessage = useSelector((state) => state.externalBankTransactions?.bankWithdrawMessage);
  const error = useSelector((state) => state.externalTransactions?.error);
  const withdrawMsg = useSelector((state) => state.externalTransactions?.transaction?.message);

  useEffect(() => {
    dispatch(getCurrency());
    dispatch(getNetwork());
    if (userId) {
      dispatch(getWallets(userId));
      dispatch(getCards(userId));
      dispatch(getBankAccounts(userId));
    }
  }, [userId]);

  useEffect(() => {
    if (error) {
      setLoader(false)
      dispatch(clearWithdraw());
      dispatch(clearFiatWithdraw());
      dispatch(clearBankWithdraw());
    }
    else if (withdrawn) {
      setLoader(false)
      Swal.fire({
        title: 'Success',
        text: withdrawMsg,
        icon: 'success',
        showCancelButton: false,
        confirmButtonText: 'OK',
      }).then((result) => {
        dispatch(getAccount(userId));
        dispatch(clearWithdraw());
        setSelectedCurrency([])
        handleSelectedCoin(null)
      })
    }
    else if (fiatWithdrawn) {
      setLoader(false)
      Swal.fire({
        title: 'Success',
        text: withdrawMsg,
        icon: 'success',
        showCancelButton: false,
        confirmButtonText: 'OK',
      }).then((result) => {
        dispatch(getAccount(userId));
        dispatch(clearFiatWithdraw());
        setSelectedCurrency([])
        handleSelectedCoin(null)
      })
    }
    else if (bankWithdrawn) {
      setLoader(false)
      Swal.fire({
        title: 'Success',
        text: bankWithdrawMessage,
        icon: 'success',
        showCancelButton: false,
        confirmButtonText: 'OK',
      }).then((result) => {
        dispatch(getAccount(userId));
        dispatch(clearBankWithdraw());
        setSelectedCurrency([])
        handleSelectedCoin(null)
      })
    }
  }, [withdrawn, fiatWithdrawn, bankWithdrawn, error])

  useEffect(() => {
    if (currencyData) {
      let found = currencyData?.find(currency => currency.symbol == symbol)
      handleSelectedCoin(found);
    }
  }, [currencyData])

  const handleWithdraw = async () => {
    if (parseFloat(withdrawCoins) < parseFloat(withdrawFee?.min) || parseFloat(haveCoins) <= 0) {
      Swal.fire({
        // title: 'Success',
        text: "Cannot Withdraw 0 Amount",
        icon: 'info',
        showCancelButton: false,
        confirmButtonText: 'OK',
      })
    } else {
      let data = {
        userId: userId,
        networkId: selectedNetwork?._id,
        currencyId: selectedCurrency?._id,
        sendToAddress: selectedAddress?.address,
        deducted: (parseFloat(withdrawCoins) + parseFloat((withdrawCoins * withdrawFee?.fee) / 100)).toPrecision(8),
        fee: parseFloat((withdrawCoins * withdrawFee?.fee) / 100).toPrecision(8),
        coins: withdrawCoins.toString(),
        gas: withdrawFee?.actualFee
      }
      console.log("data: ", data);
      await dispatch(submitWithdraw(data));
      setLoader(true);

      //connect socket and emit notification
      await socketConnection()
    }
  };

  const handleWithdrawCard = async () => {
    if (parseFloat(haveCoins) <= 0) {
      Swal.fire({
        // title: 'Success',
        text: "Cannot Withdraw 0 Amount",
        icon: 'info',
        showCancelButton: false,
        confirmButtonText: 'OK',
      })
    } else {
      let data = {
        userId: userId,
        currencyId: selectedCurrency?._id,
        sendToCard: selectedCard?.card,
        deducted: (parseFloat(withdrawCoins)).toPrecision(8),
        // fee: parseFloat((withdrawCoins * withdrawFee?.fee) / 100).toPrecision(8),
        coins: withdrawCoins.toString(),
      }
      console.log("data: ", data);
      await dispatch(submitFiatWithdraw(data));
      setLoader(true);

      //connect socket and emit notification
      await socketConnection()
    }
  };

  const handleWithdrawBank = async () => {
    if (parseFloat(haveCoins) <= 0) {
      Swal.fire({
        // title: 'Success',
        text: "Cannot Withdraw 0 Amount",
        icon: 'info',
        showCancelButton: false,
        confirmButtonText: 'OK',
      })
    } else {
      let data = {
        userId: userId,
        currencyId: selectedCurrency?._id,
        sendToIban: selectedBank?.iban,
        sendToAddress: selectedBank?.bankAddress,
        sendToAccountNumber: selectedBank?.accountNumber,
        sendToSwiftCode: selectedBank?.swiftCode,
        deducted: (parseFloat(withdrawCoins)).toPrecision(8),
        // fee: parseFloat((withdrawCoins * withdrawFee?.fee) / 100).toPrecision(8),
        coins: withdrawCoins.toString(),
      }
      console.log("data: ", data);
      await dispatch(submitBankWithdraw(data));
      setLoader(true);

      //connect socket and emit notification
      await socketConnection()
    }
  };

  const getWithdrawInfo = (network) => {
    setShowWithdraw(true)
    let data = {
      networkId: network._id,
      currencyId: selectedCurrency?._id
    }
    dispatch(getWithdrawFee(data));
  }

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

  useEffect(() => {
    if (currencyData?.length > 0 && amounts?.length > 0) {
      const defCurrency = currencyData?.find(cur => cur?.symbol == 'USD');
      setSelectedCurrency(defCurrency);
      // setHaveAmount(from == 1 ? amounts?.find((row) => row.currencyId == defCurrency._id).amount : amounts?.find((row) => row.currencyId == defCurrency._id).futures_amount);
    }
  }, [currencyData, amounts]);

  const handleSelectedCoin = (coin) => {
    setSelectedCurrency(coin);
    if (coin)
      setHaveCoins(amounts?.find(row => row.currencyId == coin._id).amount);
    setSelectedNetwork([]);
    setSelectedAddress([]);
    setSelectedCard([]);
    setSelectedBank([]);
    setShowWithdraw(false);
    setWithdrawCoins(0)
    clearWithdrawFee();
  }

  const clearWithdrawFee = () => {
    dispatch(resetWithdrawFee());
  }

  const handleWithdrawLimit = () => {
    var validNumber = new RegExp(/^\d*\.?\d*$/);
    let fee_amount = (withdrawCoins * withdrawFee?.fee) / 100;

    if (!withdrawCoins.toString().match(validNumber) || parseFloat(withdrawCoins) > parseFloat((parseFloat(haveCoins) - fee_amount >= 0 ? parseFloat(haveCoins) - fee_amount : 0) < withdrawFee?.max ? (parseFloat(haveCoins) - fee_amount >= 0 ? parseFloat(haveCoins) - fee_amount : 0) : withdrawFee?.max) || parseFloat(withdrawCoins) < parseFloat(withdrawFee?.min)) {
      let textMesasge = '';
      let selectedCurrSymbol = selectedCurrency && selectedCurrency?.symbol ? selectedCurrency?.symbol : "";
      if (!withdrawCoins.toString().match(validNumber)) {
        textMesasge = "Invalid number entered. Please enter a valid number";
      }
      else if (parseFloat(withdrawCoins) > (parseFloat(haveCoins) - parseFloat(fee_amount))) {
        textMesasge = `You do not have enough balance. Your balance is ${haveCoins} ${selectedCurrSymbol} and you are trying to withdraw ${parseFloat(withdrawCoins)} ${selectedCurrSymbol} with ${fee_amount} ${selectedCurrSymbol} fee.`;
      }
      else if (parseFloat(withdrawCoins) > parseFloat(withdrawFee?.max)) {
        textMesasge = `You can not withdraw amount greater than ${withdrawFee?.max} ${selectedCurrSymbol}`;
      }
      else if (parseFloat(withdrawCoins) < parseFloat(withdrawFee?.min)) {
        textMesasge = `You can not withdraw amount less than ${withdrawFee?.min} ${selectedCurrSymbol}`;
      }

      setWithdrawCoins(0)
      Swal.fire({
        // title: 'Success',
        text: textMesasge,
        icon: 'info',
        showCancelButton: false,
        confirmButtonText: 'OK',
      })
    }
  }

  const handleWithdrawLimitFiat = () => {
    var validNumber = new RegExp(/^\d*\.?\d*$/);

    if (!withdrawCoins.toString().match(validNumber) || parseFloat(withdrawCoins) > parseFloat((parseFloat(haveCoins)))) {
      let textMesasge = '';
      let selectedCurrSymbol = selectedCurrency && selectedCurrency?.symbol ? selectedCurrency?.symbol : "";
      if (!withdrawCoins.toString().match(validNumber)) {
        textMesasge = "Invalid number entered. Please enter a valid number";
      }
      else if (parseFloat(withdrawCoins) > (parseFloat(haveCoins))) {
        textMesasge = `You do not have enough balance. Your balance is ${haveCoins} ${selectedCurrSymbol} and you are trying to withdraw ${parseFloat(withdrawCoins)} ${selectedCurrSymbol}`;
      }

      setWithdrawCoins(0)
      Swal.fire({
        // title: 'Success',
        text: textMesasge,
        icon: 'info',
        showCancelButton: false,
        confirmButtonText: 'OK',
      })
    }
  }


  const depositCoinHandler = () => {
    setDepositCoin(true);
    setDepositCoin2(false);
    setDepositCoin3(false);
  };
  const depositCoinHandler2 = () => {
    setDepositCoin(false);
    setDepositCoin2(true);
    setDepositCoin3(false);
  };
  const depositCoinHandler3 = () => {
    setDepositCoin(false);
    setDepositCoin2(false);
    setDepositCoin3(true);
  };

  const copyReferral = () => {
    toast.success('Successfully copied!');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(`The name you entered was: ${Iban}, ${accountNumber}, ${bankName}, ${bankAddress}, ${swiftCode}`)
  };

  return (
    loader ? <FullPageLoader /> :
      <>
        {/* <Overview />
        <RecentDeposit /> */}

        <section className="header-padding withdrawal-page">
          <GetAccountData />

          <div className="container-fluid custom-box padding50">
            <div className="d-flex justify-content-center align-items-center flex-md-row flex-column">
              <div className="d-flex align-items-center mb-lg-0 mb-3">
                <i className="fa fa-angle-left me-lg-4 me-3 left-angle"></i>
                <h3 className="mb-0 text-light">WITHDRAWAL</h3>
              </div>
            </div>
            <div className="row pt-4">
              <div className="col-md-8">
                <div className="deposit-col">
                  <div className="deposit-coin">
                    <button className='payopt' onClick={depositCoinHandler} autoFocus>Coin</button>
                    <button className='payopt' onClick={depositCoinHandler2}>Credit Card</button>
                    <button className='payopt' onClick={depositCoinHandler3}>Bank</button>
                    {depositCoin && (<div className="dropdown deposit-dropdown">
                      <button
                        className="btn dropdown-toggle"
                        type="button"
                        id="dropdownMenuButton1"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <div className="d-flex justify-content-between">
                          <p className="coin-name">{selectedCurrency?.symbol ? selectedCurrency?.symbol : symbol}</p>
                          <div className="coin-details d-flex align-items-center">
                            <p className="detail">({selectedCurrency?.name ? selectedCurrency?.name : 'Select'})</p>
                            <p className="dd-arrow"></p>
                          </div>
                        </div>
                      </button>
                      <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                        {currencyData && currencyData.length > 0 && currencyData.length ?
                          currencyData && currencyData.length > 0 && currencyData.filter(row => row?.isFiat != true).map((currency) => (
                            <li key={currency._id} onClick={() => handleSelectedCoin(currency)}>
                              <a className="dropdown-item" onClick={() => { handleSelectedCoin(currency) }}>
                                <img src={getCoinImg(currency?.symbol)} alt="" className="img-fluid coin-img pe-1" />
                                {currency.name}
                              </a>
                            </li>
                          ))
                          : <p className='text-light'> No Currencies found! </p>
                        }
                      </ul>
                    </div>)}

                    <div className="deposit-coin3">
                      {/* <h2 onClick={depositCoinHandler3}>Bank</h2> */}

                      {depositCoin3 && (
                        <form className="ccdetailw">
                          {/* <h1>Bank Transfer</h1> */}

                          {depositCoin3 && (
                            <div className="dropdown deposit-dropdown">
                              <button
                                className="btn dropdown-toggle"
                                type="button"
                                id="dropdownMenuButton1"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                <div className="d-flex justify-content-between">
                                  <p className="coin-name">{selectedCurrency?.symbol ? selectedCurrency?.symbol : symbol}</p>
                                  <div className="coin-details d-flex align-items-center">
                                    <p className="detail">({selectedCurrency?.name ? selectedCurrency?.name : 'Select'})</p>
                                    <p className="dd-arrow"></p>
                                  </div>
                                </div>
                              </button>
                              <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                {currencyData && currencyData.length > 0 && currencyData.length ?
                                  currencyData && currencyData.length > 0 && currencyData.filter(row => row?.isFiat == true).map((currency) => (
                                    <li key={currency._id} onClick={() => handleSelectedCoin(currency)}>
                                      <a className="dropdown-item" onClick={() => { handleSelectedCoin(currency) }}>
                                        <img src={getCoinImg(currency?.symbol)} alt="" className="img-fluid coin-img pe-1" />
                                        {currency.name}
                                      </a>
                                    </li>
                                  ))
                                  : <p className='text-light'> No Currencies found! </p>
                                }
                              </ul>
                            </div>)}

                          <div className="row">
                            <div className="wallet-address">
                              <div className="address-add">
                                <p className="mb-0 text-white">Bank Account</p>
                                <button type="button" onClick={handleShowBank} className="btn add-address-btn">Add</button>
                              </div>
                              <div className="dropdown wallet-address-dd">
                                <button
                                  className="btn dropdown-toggle"
                                  type="button"
                                  id="dropdownMenuButton1"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  {selectedBank && selectedBank.bankAddress ?
                                    selectedBank.name
                                    :
                                    "Select Bank Account..."
                                  }
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                  {bankAccounts && bankAccounts.filter(bank => (bank && bank.currencyId == selectedCurrency?._id)).length ?
                                    bankAccounts && bankAccounts.filter(bank => (bank && bank.currencyId == selectedCurrency?._id)).map(bank =>
                                      <li>
                                        <a className="dropdown-item" key={bank._id} onClick={() => setSelectedBank(bank)}>
                                          {bank.name}
                                        </a>
                                      </li>
                                    )
                                    :
                                    <li>
                                      <a className="dropdown-item">No Addresses Added</a>
                                    </li>
                                  }
                                </ul>
                              </div>
                            </div>
                          </div>


                          <br />
                          <br />
                          {selectedBank && selectedBank.status ?
                            <>
                              <div className="amount-withdrawal">
                                <div className="withdrawal-amount">
                                  <p className="mb-0 text-white">Amount Withdrawable</p>
                                  <p className="text-white-light mb-0">
                                    Amount {haveCoins} {selectedCurrency && selectedCurrency?.symbol ? selectedCurrency?.symbol : ""}
                                  </p>
                                </div>
                                <div className="input-all">
                                  <input type="text" onChange={(e) => { setWithdrawCoins(e.target.value) }} onBlur={() => handleWithdrawLimitFiat()} value={withdrawCoins} />
                                  <button type="button" className="btn text-green"
                                    onClick={() => { setWithdrawCoins((parseFloat(haveCoins) - ((withdrawCoins) / 100) >= 0 ? parseFloat(haveCoins) - ((withdrawCoins) / 100) : 0)) }}
                                  >
                                    All
                                  </button>
                                </div>
                              </div>
                              <br />
                              <button type="button" className="btn enter-btn3" onClick={() => handleShowConfirmationBank()} disabled={loader}>ENTER</button>
                            </>
                            : null
                          }
                        </form>
                      )}


                    </div>

                    <div className="deposit-coin2">

                      {depositCoin2 && (
                        <div className="dropdown deposit-dropdown">
                          <button
                            className="btn dropdown-toggle"
                            type="button"
                            id="dropdownMenuButton1"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <div className="d-flex justify-content-between">
                              <p className="coin-name">{selectedCurrency?.symbol ? selectedCurrency?.symbol : symbol}</p>
                              <div className="coin-details d-flex align-items-center">
                                <p className="detail">({selectedCurrency?.name ? selectedCurrency?.name : 'Select'})</p>
                                <p className="dd-arrow"></p>
                              </div>
                            </div>
                          </button>
                          <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                            {currencyData && currencyData.length > 0 && currencyData.length ?
                              currencyData && currencyData.length > 0 && currencyData.filter(row => row?.isFiat == true).map((currency) => (
                                <li key={currency._id} onClick={() => handleSelectedCoin(currency)}>
                                  <a className="dropdown-item" onClick={() => { handleSelectedCoin(currency) }}>
                                    <img src={getCoinImg(currency?.symbol)} alt="" className="img-fluid coin-img pe-1" />
                                    {currency.name}
                                  </a>
                                </li>
                              ))
                              : <p className='text-light'> No Currencies found! </p>
                            }
                          </ul>
                        </div>)}

                      {depositCoin2 && (<div className='cardf'><div>
                        <Cards
                          number={number}
                          name={name}
                          expiry={expiry}
                          cvc={cvc}
                          focused={focus}
                        />
                      </div>
                      </div>)}

                      <br />
                      {depositCoin2 && (<form className='ccdetailw'>
                        {/* <div className="row">
                          <div className="col-sm-11">
                            <label for="name" className='carddet'>Card Number</label>
                            <input
                              type="tel"
                              className="form-controlcarddet"
                              value={number}
                              name="number"
                              maxLength="16"
                              pattern="[0-9]+"
                              onChange={(e) => {
                                SetNumber(e.target.value);
                              }}
                              onFocus={(e) => SetFocus(e.target.name)}
                            ></input>
                          </div>
                        </div> */}
                        <br />
                        <div className="row">
                          <div className="wallet-address">
                            <div className="address-add">
                              <p className="mb-0 text-white">Card Number</p>
                              <button type="button" onClick={handleShowCard} className="btn add-address-btn">Add</button>
                            </div>
                            <div className="dropdown wallet-address-dd">
                              <button
                                className="btn dropdown-toggle"
                                type="button"
                                id="dropdownMenuButton1"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                {selectedCard && selectedCard.card ?
                                  selectedCard.name
                                  :
                                  "Select card number..."
                                }
                              </button>
                              <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                {creditCards && creditCards.filter(card => (card && card.currencyId == selectedCurrency?._id)).length ?
                                  creditCards && creditCards.filter(card => (card && card.currencyId == selectedCurrency?._id)).map(card =>
                                    <li>
                                      <a className="dropdown-item" key={card._id} onClick={() => setSelectedCard(card)}>
                                        {card.name}
                                      </a>
                                    </li>
                                  )
                                  :
                                  <li>
                                    <a className="dropdown-item">No Addresses Added</a>
                                  </li>
                                }
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          {selectedCard && selectedCard.status ?
                            <>
                              <div className="amount-withdrawal">
                                <div className="withdrawal-amount">
                                  <p className="mb-0 text-white">Amount Withdrawable</p>
                                  <p className="text-white-light mb-0">
                                    Amount {haveCoins} {selectedCurrency && selectedCurrency?.symbol ? selectedCurrency?.symbol : ""}
                                  </p>
                                </div>
                                <div className="input-all">
                                  <input type="text" onChange={(e) => { setWithdrawCoins(e.target.value) }} onBlur={() => handleWithdrawLimitFiat()} value={withdrawCoins} />
                                  <button type="button" className="btn text-green"
                                    onClick={() => { setWithdrawCoins((parseFloat(haveCoins) - ((withdrawCoins) / 100) >= 0 ? parseFloat(haveCoins) - ((withdrawCoins) / 100) : 0)) }}
                                  >
                                    All
                                  </button>
                                </div>
                              </div>
                            </>
                            : null
                          }
                        </div>
                        <div className="row">
                          {selectedCard && selectedCard.status && parseFloat(withdrawCoins) ?
                            <button type="button" className="btn enter-btn4" onClick={() => handleShowConfirmationCC()} disabled={loader}>ENTER</button>
                            : null
                          }
                        </div>




                        {/* <div className="amount-withdrawal">
                          <div className="withdrawal-amount">
                            <p className="mb-0 text-white">Amount Withdrawable</p>
                            <p className="text-white-light mb-0">
                              Amount {haveCoins} {selectedCurrency && selectedCurrency?.symbol ? selectedCurrency?.symbol : ""}
                            </p>
                          </div>
                          <div className="input-all">
                            <input type="text" max={(parseFloat(haveCoins) - ((withdrawCoins * ((withdrawCoins * withdrawFee?.fee) / 100)) / 100) >= 0 ? parseFloat(haveCoins) - ((withdrawCoins * withdrawFee?.fee) / 100) : 0) < withdrawFee?.max ? (parseFloat(haveCoins) - ((withdrawCoins * withdrawFee?.fee) / 100) >= 0 ? parseFloat(haveCoins) - ((withdrawCoins * withdrawFee?.fee) / 100) : 0) : withdrawFee?.max} min={withdrawFee?.min} onChange={(e) => { setWithdrawCoins(e.target.value) }} onBlur={() => handleWithdrawLimit()} value={withdrawCoins} />
                            <button type="button" className="btn text-green"
                              onClick={() => { setWithdrawCoins((parseFloat(haveCoins) - ((withdrawCoins * withdrawFee?.fee) / 100) >= 0 ? parseFloat(haveCoins) - ((withdrawCoins * withdrawFee?.fee) / 100) : 0) < withdrawFee?.max ? (parseFloat(haveCoins) - ((withdrawCoins * withdrawFee?.fee) / 100) >= 0 ? parseFloat(haveCoins) - ((withdrawCoins * withdrawFee?.fee) / 100) : 0) : withdrawFee?.max) }}
                            >
                              All
                            </button>
                          </div>
                        </div>
                        <br />
                        <button type="button" className="btn enter-btn3" onClick={() => handleShowConfirmationCC()} disabled={loader}>ENTER</button> */}
                      </form>)}
                    </div>

                    {depositCoin && (<div className="chain-type">
                      <h2>Chain Type</h2>
                      <div className="deposit-selected-coin d-flex align-items-center">
                        {networks && networks.length > 0 && networks.filter(network => network.currencies.some((o) => o._id == selectedCurrency?._id)).length ?
                          networks && networks.length > 0 && networks.filter(network => network.currencies.some((o) => o._id == selectedCurrency?._id)).map((network) => (
                            <p key={network._id} className={selectedNetwork && selectedNetwork.symbol == network.symbol ? "" : "non-active"} onClick={() => { clearWithdrawFee(); getWithdrawInfo(network); setSelectedNetwork(network) }}>
                              {network.name}
                            </p>
                          ))
                          : <b className='text-light'> No Networks found! </b>
                        }
                      </div>
                    </div>)}
                    {selectedNetwork && selectedNetwork.name ?
                      showWithdraw && withdrawFee && withdrawFee?.fee ?
                        <>
                          {depositCoin && (<div className="wallet-address-amount-withdrawal">
                            <div className="wallet-address">
                              <div className="address-add">
                                <p className="mb-0 text-white">Wallet Address</p>
                                <button type="button" onClick={handleShow} className="btn add-address-btn">Add</button>
                              </div>
                              <div className="dropdown wallet-address-dd">
                                <button
                                  className="btn dropdown-toggle"
                                  type="button"
                                  id="dropdownMenuButton1"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  {selectedAddress && selectedAddress.address ?
                                    selectedAddress.name
                                    :
                                    "Select wallet address..."
                                  }
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                  {externalWallets && externalWallets.filter(wallet => (wallet.networkId == selectedNetwork._id && wallet.currencyId == selectedCurrency?._id)).length ?
                                    externalWallets && externalWallets.filter(wallet => (wallet.networkId == selectedNetwork._id && wallet.currencyId == selectedCurrency?._id)).map(wallet =>
                                      <li>
                                        <a className="dropdown-item" key={wallet._id} onClick={() => setSelectedAddress(wallet)}>
                                          {wallet.name}
                                        </a>
                                      </li>
                                    )
                                    :
                                    <li>
                                      <a className="dropdown-item">No Addresses Added</a>
                                    </li>
                                  }
                                </ul>
                              </div>
                            </div>


                            {selectedAddress && selectedAddress.status ?
                              <>
                                <div className="amount-withdrawal">
                                  <div className="withdrawal-amount">
                                    <p className="mb-0 text-white">Amount Withdrawable</p>
                                    <p className="text-white-light mb-0">
                                      Amount {haveCoins} {selectedCurrency && selectedCurrency?.symbol ? selectedCurrency?.symbol : ""}
                                    </p>
                                  </div>
                                  <div className="input-all">
                                    <input type="text" max={(parseFloat(haveCoins) - ((withdrawCoins * ((withdrawCoins * withdrawFee?.fee) / 100)) / 100) >= 0 ? parseFloat(haveCoins) - ((withdrawCoins * withdrawFee?.fee) / 100) : 0) < withdrawFee?.max ? (parseFloat(haveCoins) - ((withdrawCoins * withdrawFee?.fee) / 100) >= 0 ? parseFloat(haveCoins) - ((withdrawCoins * withdrawFee?.fee) / 100) : 0) : withdrawFee?.max} min={withdrawFee?.min} onChange={(e) => { setWithdrawCoins(e.target.value) }} onBlur={() => handleWithdrawLimit()} value={withdrawCoins} />
                                    <button type="button" className="btn text-green"
                                      onClick={() => { setWithdrawCoins((parseFloat(haveCoins) - ((withdrawCoins * withdrawFee?.fee) / 100) >= 0 ? parseFloat(haveCoins) - ((withdrawCoins * withdrawFee?.fee) / 100) : 0) < withdrawFee?.max ? (parseFloat(haveCoins) - ((withdrawCoins * withdrawFee?.fee) / 100) >= 0 ? parseFloat(haveCoins) - ((withdrawCoins * withdrawFee?.fee) / 100) : 0) : withdrawFee?.max) }}
                                    >
                                      All
                                    </button>
                                  </div>
                                </div>

                                {depositCoin && (<div className="transcation-and-amount">
                                  <p>Transaction Fee</p>
                                  <p>{(withdrawCoins * withdrawFee?.fee) / 100} {selectedCurrency && selectedCurrency?.symbol ? selectedCurrency?.symbol : ""}</p>
                                </div>)}
                              </>
                              : null
                            }
                          </div>)}
                          {selectedAddress && selectedAddress.status && parseFloat(withdrawCoins) >= withdrawFee?.min ?
                            <button type="button" className="btn enter-btn3" onClick={() => handleShowConfirmation()} disabled={loader}>ENTER</button>
                            : null
                          }
                        </>
                        :
                        <b className="text-white-light">Cannot withdraw this coin and network. Withdraw Fee not Found</b>
                      :
                      null
                    }
                  </div>
                </div>






              </div>


              <div className="col-md-4">
                <div className="deposit-col">
                  <div className="important-faqs">
                    <h3>Important:</h3>
                    <div className="important-faqs-content">
                      <p>FAQ</p>
                      <p>1</p>
                      <p>
                        Is it safe to deposit and store my cryptocurrencies with StarBitrex?
                      </p>
                      <p>
                        Yes, it is safe to do so! To maintain a high level of asset security and flexibility, StarBitrex uses an industry-standard cold wallet to keep your deposited assets safe, and a hot wallet that allows for all-day withdrawals. All withdrawals undergo a strict confirmation procedure and every withdrawal request is manually reviewed by our team daily 24\7. In addition, 100% of our traders' deposit assets are segregated from StarBitrex own operating budget for increased financial accountability.

                      </p>
                      <p>2</p>
                      <p>What type of coin deposits does StarBitrex support?</p>
                      <p>
                        We're constantly working on expanding the types of coin deposits we accept to better suit your needs. Here are the types of coin deposits we currently support: BTC ETH XRP ADA USDT DOGE BNB LTC TRX AVAX Note: Each coin must be based and have their transaction hash (TXID) validated on their respective standard blockchains. Depositing a coin type via a blockchain not listed above may result in the permanent loss of your coin. For more info, please refer to Depositing Unsupported Coins Into Your StarBitrex Account
                      </p>
                      <p>3</p>
                      <p>Trading in financial instruments and/or cryptocurrencies involves high risks including the risk of losing some, or all, of your investment amount, and may not be suitable for all investors. Prices of cryptocurrencies are extremely volatile and may be affected by external factors such as financial, regulatory or political events. Trading on margin increases the financial risks.</p>
                      <p>Before deciding to trade in financial instrument or cryptocurrencies you should be fully informed of the risks and costs associated with trading the financial markets, carefully consider your investment objectives, level of experience, and risk appetite, and seek professional advice where needed.</p>
                      <p>
                        Fusion Media would like to remind you that the data contained in this website is not necessarily real-time nor accurate. The data and prices on the website are not necessarily provided by any market or exchange, but may be provided by market makers, and so prices may not be accurate and may differ from the actual price at any given market, meaning prices are indicative and not appropriate for trading purposes. Fusion Media and any provider of the data contained in this website will not accept liability for any loss or damage as a result of your trading, or your reliance on the information contained within this website.

                      </p>
                      <p>
                        It is prohibited to use, store, reproduce, display, modify, transmit or distribute the data contained in this website without the explicit prior written permission of Fusion Media and/or the data provider. All intellectual property rights are reserved by the providers and/or the exchange providing the data contained in this website.
                      </p>
                      <p>
                        Fusion Media may be compensated by the advertisers that appear on the website, based on your interaction with the advertisements or advertisers

                      </p>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="batton"></div>
        </section>

        {/* ==================================== confirmation modal ============================== */}

        <Modal Modal className='withdrawal-modal' centered show={showConfirmation} onHide={handleCloseConfirmation} >
          <Modal.Header className='modal-main-heading' closeButton>
            <div className="modal-main-heading-content">
              <h5 className="modal-title" id="exampleModalLabel">ARE YOU SURE?</h5>
            </div>
          </Modal.Header>
          <Modal.Body>
            <div className="withdrawal-modal1 text-light">
              <p> <b>Sending to Address: </b> <p style={{ wordBreak: "break-all" }}>{selectedAddress?.address}</p>  </p>
              <p> <b>Sending: </b> {withdrawCoins} {selectedCurrency?.symbol} </p>
              <p> <b>Transaction Fee: </b> {(withdrawCoins * withdrawFee?.fee) / 100} {selectedCurrency?.symbol} </p>
              <p> <b>Deducted from your Wallet: </b> {(parseFloat(withdrawCoins) + parseFloat((withdrawCoins * withdrawFee?.fee) / 100)).toPrecision(8)} {selectedCurrency?.symbol} </p>
              <br />
              <p> <b className='text-danger'>Warning: </b> We will not be responsible if the coins are sent to a wrong address!!! </p>
              <div className='d-flex justify-content-right'>
                <button type="button" className='btn form-btn text-capitalize' onClick={() => { handleWithdraw(); handleCloseConfirmation() }}> YES, Send! </button>
                <button type="button" className='btn btn-danger text-capitalize ms-2' onClick={() => { handleCloseConfirmation() }}> Cancel </button>
              </div>
            </div>
          </Modal.Body>
        </Modal>

        {/* ==================================== confirmation modal for CC ============================== */}

        <Modal Modal className='withdrawal-modal' centered show={showConfirmationCC} onHide={handleCloseConfirmationCC} >
          <Modal.Header className='modal-main-heading' closeButton>
            <div className="modal-main-heading-content">
              <h5 className="modal-title" id="exampleModalLabel">ARE YOU SURE?</h5>
            </div>
          </Modal.Header>
          <Modal.Body>
            <div className="withdrawal-modal1 text-light">
              <p> <b>Sending to Card: </b> <p style={{ wordBreak: "break-all" }}>{selectedCard?.card}</p>  </p>
              <p> <b>Sending: </b> {withdrawCoins} {selectedCurrency?.symbol} </p>
              <p> <b>Deducted from your Wallet: </b> {(parseFloat(withdrawCoins)).toPrecision(8)} {selectedCurrency?.symbol} </p>
              <br />
              <p> <b className='text-danger'>Warning: </b> We will not be responsible if the coins are sent to a wrong address!!! </p>
              <div className='d-flex justify-content-right'>
                <button type="button" className='btn form-btn text-capitalize' onClick={() => { handleWithdrawCard(); handleCloseConfirmationCC() }}> YES, Send! </button>
                <button type="button" className='btn btn-danger text-capitalize ms-2' onClick={() => { handleCloseConfirmationCC() }}> Cancel </button>
              </div>
            </div>
          </Modal.Body>
        </Modal>

        {/* ==================================== confirmation modal for Bank Account ============================== */}

        <Modal Modal className='withdrawal-modal' centered show={showConfirmationBank} onHide={handleCloseConfirmationBank} >
          <Modal.Header className='modal-main-heading' closeButton>
            <div className="modal-main-heading-content">
              <h5 className="modal-title" id="exampleModalLabel">ARE YOU SURE?</h5>
            </div>
          </Modal.Header>
          <Modal.Body>
            <div className="withdrawal-modal1 text-light">
              <p> <b>Sending to Bank Account: </b> <p style={{ wordBreak: "break-all" }}>{selectedBank?.iban}</p>  </p>
              <p> <b>Sending: </b> {withdrawCoins} {selectedCurrency?.symbol} </p>
              <p> <b>Deducted from your Wallet: </b> {(parseFloat(withdrawCoins)).toPrecision(8)} {selectedCurrency?.symbol} </p>
              <br />
              <p> <b className='text-danger'>Warning: </b> We will not be responsible if the coins are sent to a wrong address!!! </p>
              <div className='d-flex justify-content-right'>
                <button type="button" className='btn form-btn text-capitalize' onClick={() => { handleWithdrawBank(); handleCloseConfirmationBank() }}> YES, Send! </button>
                <button type="button" className='btn btn-danger text-capitalize ms-2' onClick={() => { handleCloseConfirmationBank() }}> Cancel </button>
              </div>
            </div>
          </Modal.Body>
        </Modal>

        {/* ==================================== modal 1 ============================== */}

        <Modal className="withdrawal-modal" show={show} onHide={handleClose} centered size="xl">
          <Modal.Header closeButton>
          </Modal.Header>
          <Modal.Body>
            <div className="withdrawal-modal1">
              <h4 className="text-white mb-0">Addresses</h4>
              <div className="text-end">
                <button type="button" onClick={handleShowAddr} className="btn add-address-btn">Add Address</button>
              </div>
              <br />
              <UserWalletAddress />
            </div>
          </Modal.Body>
        </Modal>

        {/* ==================================== modal 2 =============================== */}

        <Modal className="withdrawal-modal" show={showAddAddress} onHide={handleCloseAddr} centered backdrop="static" size="xl">
          <Modal.Header closeButton>
          </Modal.Header>
          <Modal.Body>
            <AddAddress handleCloseAddr={handleCloseAddr} />
          </Modal.Body>
        </Modal>

        {/* ==================================== modal 1 Bank Account ============================== */}

        <Modal className="withdrawal-modal" show={showBank} onHide={handleCloseBank} centered size="xl">
          <Modal.Header closeButton>
          </Modal.Header>
          <Modal.Body>
            <div className="withdrawal-modal1">
              <h4 className="text-white mb-0">Bank Accounts</h4>
              <div className="text-end">
                <button type="button" onClick={handleShowBankAccount} className="btn add-address-btn">Add Bank Account</button>
              </div>
              <br />
              <UserBankAccounts />
            </div>
          </Modal.Body>
        </Modal>

        {/* ==================================== modal 2 Bank Account =============================== */}

        <Modal className="withdrawal-modal" show={showBankAccount} onHide={handleCloseBankAccount} centered backdrop="static" size="xl">
          <Modal.Header closeButton>
          </Modal.Header>
          <Modal.Body>
            <AddBankAccount handleCloseBankAccount={handleCloseBankAccount} />
          </Modal.Body>
        </Modal>

        {/* ==================================== modal 1 CC ============================== */}

        <Modal className="withdrawal-modal" show={showCard} onHide={handleCloseCard} centered size="xl">
          <Modal.Header closeButton>
          </Modal.Header>
          <Modal.Body>
            <div className="withdrawal-modal1">
              <h4 className="text-white mb-0">Cards</h4>
              <div className="text-end">
                <button type="button" onClick={handleShowCC} className="btn add-address-btn">Add Card</button>
              </div>
              <br />
              <UserCards />
            </div>
          </Modal.Body>
        </Modal>

        {/* ==================================== modal 2 CC =============================== */}

        <Modal className="withdrawal-modal" show={showAddCards} onHide={handleCloseCC} centered backdrop="static" size="xl">
          <Modal.Header closeButton>
          </Modal.Header>
          <Modal.Body>
            <AddCard handleCloseCC={handleCloseCC} />
          </Modal.Body>
        </Modal>

      </>
  );
};

export default WithdrawCryptoPage;
