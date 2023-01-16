import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { Accordion } from "react-bootstrap";
import { getCurrency } from "../../redux/currencies/currencyActions";
import { getAccount } from "../../redux/account/accountActions";
import { useDispatch, useSelector } from "react-redux";
import { getInternalOrders } from '../../redux/internalOrder/internalOrderActions';
import { getDeposits, getWithdraws } from '../../redux/externalTransactions/externalTransactionActions';
import { getAdminDeposits, getAdminWithdraws } from "../../redux/transactions/transactionActions";
import { getFiatWithdraws } from '../../redux/externalFiatTransactions/externalFiatTransactionActions';
import { getBankWithdraws } from "../../redux/externalBankTransactions/externalBankTransactionActions";
import DataTable, { createTheme } from "react-data-table-component";
import ReactTooltip from 'react-tooltip';
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
import { useParams } from "react-router-dom";
import FullPageLoader from '../FullPageLoader/fullPageLoader';
import Buttons from './ActivityButtons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faSearch } from '@fortawesome/free-solid-svg-icons';
import { CopyToClipboard } from "react-copy-to-clipboard";
import SC from '../../assets/images/successfully-copied.svg';

const Index = () => {

  createTheme(
    "solarizedd",
    {
      text: {
        primary: "#fff",
        secondary: "#fff",
      },
      background: {
        default: "#0c0d14",
      },
      context: {
        background: "#0c0d14",
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

  const { coin } = useParams();
  const dispatch = useDispatch();
  const currencyDataState = useSelector((state) => state.currency?.currencies?.allCurrencies);
  const amounts = useSelector((state) => state.accounts?.account?.amounts);
  const userId = useSelector((state) => state.user?.user?._id);
  const orders = useSelector((state) => state.internalOrders?.orders?.userOrders);
  const withdraws = useSelector((state) => state.externalTransactions?.withdraws?.withdraws);
  const deposits = useSelector((state) => state.externalTransactions?.deposits?.deposits);
  const adminDeposits = useSelector((state) => state.adminTransactions?.adminDeposits?.adminDeposits);
  const adminWithdraws = useSelector((state) => state.adminTransactions?.adminWithdraws?.adminWithdraws);
  const cardFiatWithdraws = useSelector((state) => state.externalFiatTransactions?.fiatWithdraws?.withdraws);
  const bankFiatWithdraws = useSelector((state) => state?.externalBankTransactions?.bankWithdraws?.withdraws);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [displayMessage, setDisplayMessage] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [currencyFilter, setCurrencyFilter] = useState('');
  const [coinIndex, setCoinIndex] = useState(0);
  const [currencyData, setCurrencyData] = useState([]);

  useEffect(() => {
    setLoader(true)
    dispatch(getCurrency());
    if (userId) {
      dispatch(getInternalOrders(userId));
      dispatch(getDeposits(userId))
      dispatch(getWithdraws(userId))
      dispatch(getAdminDeposits(userId))
      dispatch(getAdminWithdraws(userId))
      dispatch(getFiatWithdraws(userId))
      dispatch(getBankWithdraws(userId))
    }
  }, [userId])

  useEffect(() => {
    if (orders && withdraws && deposits && adminDeposits && adminWithdraws && cardFiatWithdraws && bankFiatWithdraws) {
      const combineData = [...orders, ...withdraws, ...deposits, ...adminDeposits, ...adminWithdraws, ...cardFiatWithdraws, ...bankFiatWithdraws];
      setTransactions(combineData)
    }
  }, [orders, withdraws, deposits, adminDeposits, adminWithdraws, cardFiatWithdraws, bankFiatWithdraws])

  useEffect(() => {
    dispatch(getCurrency());
    if (userId) dispatch(getAccount(userId));
  }, [userId]);

  useEffect(() => {
    if (currencyDataState && currencyDataState.length) {
      let currencyDataFilter = currencyDataState.filter(row => row?.isFiat == true);
      let selectNewCurrency = currencyDataFilter?.find(row => row.symbol == coin);
      if (selectNewCurrency) {
        setCurrencyData(currencyDataFilter);
        setSelectedCurrency(selectNewCurrency);
        setCoinIndex(currencyDataFilter?.findIndex(row => row.symbol == coin));
      }
      setLoader(false)
    }
  }, [currencyDataState]);

  const delay = ms => new Promise(res => setTimeout(res, ms));
  const copyTxtHash = async () => {
    setDisplayMessage(true)
    await delay(3000);
    setDisplayMessage(false)
  }

  useEffect(() => {
    if (transactions && transactions.length) {
      let dataArr = [];
      transactions.filter(row => row.isResolved).sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); }).map(row => {
        // Check for admin Transactions
        if (row.txHash) {
          let thisCoin = currencyData?.find(co => co.symbol == row.currency)
          if (thisCoin) {
            if (row.transactionType == 0) // Check if withdraw or deposit
              dataArr.push({
                symbol: row?.currency, coin: thisCoin?.name, color: thisCoin?.color, amount: row?.amount, sign: '+', type: 1, category: 'Deposit',
                txHash: row.txHash, fromAddress: row.fromAddress, toAddress: row.toAddress, date: row.createdAt, info: row.additionalInfo, resolveStatus: row.isResolved
              })
            else
              dataArr.push({
                symbol: row?.currency, coin: thisCoin?.name, color: thisCoin?.color, amount: row?.amount, sign: '-', type: 1, category: 'Withdraw',
                txHash: row.txHash, fromAddress: row.fromAddress, toAddress: row.toAddress, date: row.createdAt, info: row.additionalInfo, resolveStatus: row.isResolved
              })
          }
        }
        else if (row.userAccountId || row.toCard || row.toIban) {
          let thisCoin = currencyData.find(co => co.symbol == row.currency)
          if (thisCoin) {
            if (row.transactionType == 0) // Check if withdraw or deposit
              dataArr.push({
                symbol: row?.currency, coin: thisCoin?.name, color: thisCoin?.color, amount: row?.amount, sign: '+', type: 1, category: 'Deposit',
                txHash: row.userAccountId ? row.userAccountId : (row.toCard ? row.toCard : row.toIban), fromAddress: row.fromAddress ? row.fromAddress : '-', toAddress: row.toAddress ? row.toAddress : '-', date: row.createdAt, info: row.additionalInfo, resolveStatus: row.isResolved
              })
            else
              dataArr.push({
                symbol: row?.currency, coin: thisCoin?.name, color: thisCoin?.color, amount: row?.amount, sign: '-', type: 1, category: 'Withdraw',
                txHash: row.userAccountId ? row.userAccountId : (row.toCard ? row.toCard : row.toIban), fromAddress: row.fromAddress ? row.fromAddress : '-', toAddress: row.toAddress ? row.toAddress : '-', date: row.createdAt, info: row.additionalInfo, resolveStatus: row.isResolved
              })
          }
        }
        else if (!row.toCurrency) {
          let thisCoin = currencyData.find(co => co.symbol == row.currency)
          if (thisCoin) {
            if (row.transactionType == 0) // Check if withdraw or deposit
              dataArr.push({
                symbol: row?.currency, coin: thisCoin?.name, color: thisCoin?.color, amount: row?.amount, sign: '+', type: 1, category: 'Deposit',
                txHash: row.userId, fromAddress: row.fromAddress, toAddress: row.toAddress, date: row.createdAt, info: row.additionalInfo, resolveStatus: row.isResolved
              })
            else
              dataArr.push({
                symbol: row?.currency, coin: thisCoin?.name, color: thisCoin?.color, amount: row?.amount, sign: '-', type: 1, category: 'Withdraw',
                txHash: row.userId, fromAddress: row.fromAddress, toAddress: row.toAddress, date: row.createdAt, info: row.additionalInfo, resolveStatus: row.isResolved
              })
          }
        }
        else {
          dataArr.push({
            symbol: row.toCurrency.symbol, coin: row.toCurrency.name, color: row.toCurrency?.color, amount: row.convertedAmount, sign: '+', type: 2, category: 'Conversion',
            id: row._id, otherCoin: row.fromCurrency.name, otherAmount: row.fromAmount, rate: row.conversionRate, date: row.createdAt, info: row.additionalInfo, resolveStatus: row.isResolved
          })
          dataArr.push({
            symbol: row.fromCurrency.symbol, coin: row.fromCurrency.name, color: row.fromCurrency?.color, amount: row.fromAmount, sign: '-', type: 2, category: 'Conversion',
            id: row._id, otherCoin: row.toCurrency.name, otherAmount: row.convertedAmount, rate: row.conversionRate, date: row.createdAt, info: row.additionalInfo, resolveStatus: row.isResolved
          })
        }
      })
      setDisplayData(dataArr.filter(c => c.symbol == selectedCurrency?.symbol))
    }
  }, [transactions, selectedCurrency])

  const settings = {
    initialSlide: coinIndex,
    focusOnSelect: true,
    dots: false,
    infinite: true,
    loop: false,
    speed: 500,
    slidesToShow: currencyData?.length > 10 ? 10 : currencyData?.length,
    slidesToScroll: 1,
    className: "center",
    cursor: "pointer",
    // centerMode: true,
    responsive: [
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 7,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          beforeChange: function (prev, next) {
            changeCurrency(currencyData[next]);
          }
        },
      },
    ],
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

  const changeCurrency = (currency) => {
    setSelectedCurrency(currency)
    setCoinIndex(currencyData?.findIndex(row => row.symbol == currency?.symbol));
    window.history.pushState("", "", '/fiat-activity/' + currency.symbol);
  }

  const columns = [
    {
      selector: (row, index) => {
        return (
          <div key={index}>
            <Accordion defaultActiveKey={0}>
              <Accordion.Item className="transcations-accord-item mb-2" eventKey={index}>
                <Accordion.Header>
                  <div className="transcations-accord-content">
                    <div className="content">
                      <div>
                        <img src={getCoinImg(row.symbol)} alt="" className="img-fluid" />
                      </div>
                      <div className="ms-2">
                        <h5 className="text-white">{row.coin}</h5>
                        <p className="m-0 text-white-light text-start">{row.symbol}</p>
                      </div>
                    </div>

                    <div className="text-white dd-icon d-flex align-items-center">
                      <h5 className="m-0" style={{ color: selectedCurrency?.color }}>{row.sign} {parseFloat(row.amount).toFixed(2)} {row.symbol}</h5>
                    </div>
                  </div>
                </Accordion.Header>
                <Accordion.Body className="p-0">
                  {row.type == 1 ?
                    <div className="accordion-content">
                      <p className=" mb-0" style={{ color: selectedCurrency?.color }}>{row?.category}</p>
                      <div className="accordion-content-activity">
                        <div className="activity">
                          <p className="text-white-light">Date</p>
                          <p className="mb-0">{row?.date.replace('T', ' ').replace('Z', ' ')}</p>
                        </div>
                        {
                          row?.info && <div className="activity">
                            <p className="text-white-light">Info</p>
                            <p className="mb-0" style={{ color: selectedCurrency?.color }}>
                              {row?.info}
                            </p>
                          </div>
                        }
                        <div className="activity">
                          <p className="text-white-light">Transaction ID</p>
                          <p className="mb-0" style={{ color: selectedCurrency?.color }}>{row?.txHash}
                            <CopyToClipboard text={row?.txHash} >
                              <FontAwesomeIcon className="text-white ms-3" icon={faCopy} onClick={() => copyTxtHash()} />
                            </CopyToClipboard>
                          </p>
                        </div>
                        <div className="activity">
                          <p className="text-white-light">Amount</p>
                          <p className="text-light mb-0">{row.sign} {parseFloat(row.amount).toFixed(2)} {row.symbol}</p>
                        </div>
                        <div className="activity">
                          <p className="text-white-light">Status</p>
                          <p className="mb-0" style={{ color: row?.resolveStatus == 2 ? '#dc3545' : selectedCurrency?.color }}>
                            {row?.resolveStatus == 2 ? 'Declined' : 'Approved'}
                          </p>
                        </div>
                      </div>
                    </div>
                    :
                    <div className="accordion-content">
                      <p className=" mb-0" style={{ color: selectedCurrency?.color }}>{row?.category}</p>
                      <div className="accordion-content-activity">
                        <div className="activity">
                          <p className="text-white-light">Date</p>
                          <p className="mb-0">{row?.date.replace('T', ' ').replace('Z', ' ')}</p>
                        </div>
                        {
                          row?.info && <div className="activity">
                            <p className="text-white-light">Info</p>
                            <p className="mb-0" style={{ color: selectedCurrency?.color }}>
                              {row?.info}
                            </p>
                          </div>
                        }
                        <div className="activity">
                          <p className="text-white-light">Amount</p>
                          <p className="text-light mb-0">{row.sign} {parseFloat(row.amount).toFixed(2)} {row.symbol}</p>
                        </div>
                        <div className="activity">
                          <p className="text-white-light"> From </p>
                          <p className="text-light mb-0">{row.sign == '-' ? row.coin : row.otherCoin}</p>
                        </div>
                        <div className="activity">
                          <p className="text-white-light"> To </p>
                          <p className="text-light mb-0">{row.sign == '-' ? row.otherCoin : row.coin}</p>
                        </div>
                        <div className="activity">
                          <p className="text-white-light"> Conversion Rate </p>
                          <p className="text-light mb-0">{row.rate}</p>
                        </div>
                        <div className="activity">
                          <p className="text-white-light"> Total </p>
                          <p className="text-light mb-0">{row.otherCoin}: {row.sign == '-' ? '+' : '-'} {row.otherAmount}</p>
                        </div>
                        <div className="activity">
                          <p className="text-white-light">Status</p>
                          <p className="mb-0" style={{ color: row?.resolveStatus == 2 ? '#dc3545' : selectedCurrency?.color }}>
                            {row?.resolveStatus == 2 ? 'Declined' : 'Approved'}
                          </p>
                        </div>
                      </div>
                    </div>
                  }
                  {displayMessage ? <p className="successfully-copied"><img src={SC} alt="" className="img-fluid" /> Successfully Copied!</p> : ""}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
        );
      },
    }
  ];

  return (
    <>
      {loader ? <FullPageLoader /> :
        <section className="header-padding">
          <div className="send-receive-crypto padding50">
            <div className="container-fluid send-receive-container">
              <div className="slider-search-container mb-3">
                <div className="activity-cion-search-box">
                  <FontAwesomeIcon style={showSearch ? { color: "green" } : { color: "white" }} icon={faSearch} className="search" onClick={() => { if (showSearch) { setCurrencyFilter(''); } setShowSearch(!showSearch) }} />
                  {showSearch ? <div className="searchbox-input-fleid"><input type="search" placeholder="Search" onChange={(e) => setCurrencyFilter(e.target.value)} /></div> : null}
                </div>
                {selectedCurrency?.symbol ?
                  <Slider {...settings}>
                    {currencyData && currencyData.length > 0 && currencyData?.filter(row => { return (row.name.toLowerCase().includes(currencyFilter.toLowerCase()) || row.symbol.toLowerCase().includes(currencyFilter.toLowerCase())) }).map((currency, index) => (
                      <div className={selectedCurrency?.symbol == currency.symbol ? "icon-symbol slider-current-grey" : "icon-symbol"} key={index} onClick={() => changeCurrency(currency)}>
                        <h6 className="text-light" > {currency?.name}</h6>
                        <p style={{ color: "gray" }}>{currency?.symbol}</p>
                      </div>
                    ))}
                  </Slider>
                  : null
                }
              </div>
              <div className="crypto-container text-center">
                <div>
                  <img src={getCoinImg(selectedCurrency?.symbol)} alt="" className="img-fluid" />
                </div>
                <h1 className="text-white">
                  <span className="pe-2" data-tip={amounts?.find((c) => c.currencyId == selectedCurrency?._id) ? amounts?.find((c) => c.currencyId == selectedCurrency?._id)?.amount : "0"}>
                    {
                      amounts?.find((c) => c.currencyId == selectedCurrency?._id) && amounts?.find((c) => c.currencyId == selectedCurrency?._id).amount !== '0' ? parseFloat(amounts?.find((c) => c.currencyId == selectedCurrency?._id)?.amount).toFixed(2) : "0"
                    }
                  </span>
                  <ReactTooltip />
                  {selectedCurrency?.symbol}
                </h1>

                <Buttons selectedCurrency={selectedCurrency} getCoinImg={getCoinImg} />
              </div>

              <h3 className="text-center" style={{ color: selectedCurrency?.color }}>Activity</h3>
              <div>
                <DataTable
                  columns={columns}
                  data={displayData}
                  pagination
                  className="transactions-datatable"
                  persistTableHead
                  theme="solarizedd"
                />
              </div>
            </div>
          </div>

        </section>
      }
    </>
  );
};

export default Index;