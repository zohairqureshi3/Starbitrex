import React, { useEffect, useState } from "react";
import PortfolioBG from "../../assets/images/portfolio-bg.png";
import WalletSVG from "../../assets/images/portfolio-wallet.svg";
import TimerSVG from "../../assets/images/portfolio-timer.svg";
import DataTable, { createTheme } from "react-data-table-component";
import { Link } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getUserAnalytics } from "../../redux/users/userActions";
import { getCurrency } from "../../redux/currencies/currencyActions";
import { updateAccount } from "../../redux/account/accountActions";
import GetAccountData from "../shared/GetAccountData";
import { getPortfolioCurrencies } from "../../redux/cron/cronActions";
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
// import Logo from "../../assets/images/logo171.png";
import Logo from "../../assets/images/STBRX-new-logo-01.png";
import { Tabs, Tab, Table, Dropdown, ProgressBar } from "react-bootstrap";
import WalletTransfer from "./WalletTransfer";
import Footer from "../Footer/Footer"
import { io } from "socket.io-client";
import userPlaceholder from '../../assets/images/user-placeholder.jpg';
import verification from '../../assets/images/verified.png';
import {
  getUserLeverageOrders,
} from "../../redux/leverageOrder/leverageOrderActions";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp, faEnvelope, faLocationDot, faEllipsis, faArrowDown } from '@fortawesome/free-solid-svg-icons'
import { ENV } from "../../config/config";

const currencyFormatter = require('currency-formatter');


createTheme(
  "solarizedd",
  {
    text: {
      primary: "#fff",
      secondary: "#fff",
    },
    background: {
      default: "#0F1015",
    },
    context: {
      background: "#0F1015",
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

const Index = () => {
  let profileCompletionCriteria = ENV.profileCompletionCriteria;
  const coins = 'ETH,LINK,AVAX,DOGE,BCH,LTC,TRX,BNB,ADA,BTC,USD,AUD,CAD,NZD,EUR,GBP';
  const [coinData, setCoinData] = useState([])
  const [currenciesPriceRate, setCurrenciesPriceRate] = useState([]);
  const [isCurrenciesPriceRate, setIsCurrenciesPriceRate] = useState(false);
  const [loader, setLoader] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0)
  const [previousAmountChange, setPreviousAmountChange] = useState(0);
  const [previousAmountPercentChange, setPreviousAmountPercentChange] = useState(0);
  const [portfolioAge, setPortfolioAge] = useState(0);
  const [bestAsset, setBestAsset] = useState(0);
  const [worstAsset, setWorstAsset] = useState(0);
  const [profileCompletePercent, setProfileCompletePercent] = useState(0);
  const [imagePath, setImagePath] = useState("");

  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user?.user);
  const currentAccount = useSelector((state) => state.accounts?.account);
  const amounts = useSelector((state) => state.accounts?.account?.amounts);
  const currencyData = useSelector((state) => state.currency?.currencies?.allCurrencies);
  // const reduxPnL = useSelector((state) => state.LeverageOrders?.orderPnL);
  const userOrders = useSelector((state) => state.LeverageOrders?.userOrders?.userOrders);
  const userId = useSelector((state) => state.user?.user?._id);
  const userAnalytics = useSelector((state) => state.user?.userAnalytics);

  // ---------------------------------------

  const [primaryCoin, setPrimaryCoin] = useState("ETH");
  const [secondaryCoin, setSecondaryCoin] = useState("USDT");
  const [pairName, setPairName] = useState((primaryCoin + secondaryCoin));
  const [socket, setSocket] = useState(null);
  const [currentMarketPrice, setcurrentMarketPrice] = useState(0);
  const [startSocket, setStartSocket] = useState(true)


  let socketURL = process.env.REACT_APP_SOCKET_URL;

  useEffect(() => {
    if (userId) {
      dispatch(getUserLeverageOrders(userId));
      dispatch(getUserAnalytics(userId));
    }

    // dispatch(getCurrency());
  }, [userId]);

  useEffect(() => {
    if (pairName) {
      if (socket != null) {
        setStartSocket(false)
        socket.disconnect()
        setSocket(io(socketURL, { transports: ['websocket'] }))
        setStartSocket(true)
        setcurrentMarketPrice(0)
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
        });

        socket.emit("getCurrentMarketPriceRequest", pairName)
        socket.on("getCurrentMarketPriceResponse" + pairName, (currentMarketPrice) => {
          setcurrentMarketPrice(currentMarketPrice)
        });

        socket.emit("getBinanceMarketDepthRequest", pairName)
        socket.on("getBinanceMarketDepthRequestError", (response) => {
          console.log(response)
        });
      }
    }
  }, [socket, pairName]);

  const getUnrealizedPnL = (row) => {
    let val = ''
    if (row) {
      let rate = parseFloat(currentMarketPrice ? currentMarketPrice?.find(line => line.symbol == row.pairName).markPrice : 0)
      val = row?.tradeType == 1 ? //buy
        parseFloat(row?.qty) * (parseFloat(rate) - parseFloat(row?.tradeStartPrice))
        : //sell
        parseFloat(row?.qty) * (parseFloat(row?.tradeStartPrice) - parseFloat(rate))
    }


    return val && !isNaN(val) ? val : 0;
  }

  // ----------------------------------------

  useEffect(() => {
    if (currentUser?.createdAt && userAnalytics) {
      let today = new Date();
      let createdDate = new Date(currentUser?.createdAt);
      let dateDif = today - createdDate;
      let diffinDays = Math.floor(dateDif / 86400000);
      setPortfolioAge(diffinDays);
      let profPercent = 0;
      if (currentUser?.email) {
        profPercent += profileCompletionCriteria.email;
      }
      if (currentUser?.countryCode) {
        profPercent += profileCompletionCriteria.address;
      }
      if (currentUser?.phone) {
        profPercent += profileCompletionCriteria.phoneNumber;
      }
      if (userAnalytics?.bankOrCardWithdrawalAccount) {
        profPercent += profileCompletionCriteria.bankOrCardForWithdrawal;
      }
      if (userAnalytics?.firstDeposit) {
        profPercent += profileCompletionCriteria.firstDeposit;
      }
      if (currentUser?.profileImage) {
        profPercent += profileCompletionCriteria.profilePicture;
        setImagePath(`${process.env.REACT_APP_SERVER_URL}/images/${currentUser?.profileImage}`);
      }

      setProfileCompletePercent(profPercent);
    }
  }, [currentUser, userAnalytics]);

  useEffect(async () => {
    if (!isCurrenciesPriceRate && amounts?.length > 0 && currencyData?.length > 0) {
      await setIsCurrenciesPriceRate(true);
      var url = `https://min-api.cryptocompare.com/data/price?fsym=USDT&tsyms=${coins}&api_key=6f8e04fc1a0c524747940ce7332edd14bfbacac3ef0d10c5c9dcbe34c8ef9913`
      await axios.get(url)
        .then(res => {
          setCurrenciesPriceRate(res.data);
          let resData = res.data;
          let total = 0;
          let firstCurrencyValue = parseFloat(parseFloat((1 / resData[currencyData[0].symbol == 'USDT' ? 'USD' : currencyData[0].symbol])) * parseFloat(amounts?.find(row => row.currencyId == currencyData[0]._id)?.amount));
          let maxCurrency = firstCurrencyValue;
          let minCurrency = firstCurrencyValue;
          currencyData.forEach(currency => {
            let sum = parseFloat(parseFloat((1 / resData[currency.symbol == 'USDT' ? 'USD' : currency.symbol])) * parseFloat(amounts?.find(row => row.currencyId == currency._id)?.amount));
            if (!isNaN(sum)) {
              if (isNaN(maxCurrency) || maxCurrency < sum)
                maxCurrency = sum;
              if (isNaN(minCurrency) || minCurrency > sum)
                minCurrency = sum;
              total += sum
            }
          });
          setBestAsset(maxCurrency);
          setWorstAsset(minCurrency);
          setTotalAmount(total.toFixed(4));
          const data = {
            previousTotalAmount: total
          }
          if (currentAccount?._id) {

            const amountChangeDiff = total - currentAccount?.previousTotalAmount;
            const average = (total + currentAccount?.previousTotalAmount) / 2;
            const amountChangeDiffPercent = (amountChangeDiff / average) * 100;

            setPreviousAmountChange(total - currentAccount?.previousTotalAmount);
            setPreviousAmountPercentChange(amountChangeDiffPercent);
            dispatch(updateAccount(currentAccount?._id, data));
          }
        })
        .catch(err => console.log("err: ", err))
    }
  }, [amounts, currencyData, isCurrenciesPriceRate])


  useEffect(() => {
    dispatch(getCurrency());
    if (coinData) {
      setLoader(false)
    }
  }, [coinData])

  useEffect(() => {
    dispatch(getPortfolioCurrencies());
  }, [])

  const getRateInUsdt = (coin_symbol, amount) => {
    if (currenciesPriceRate) {
      let total_in_usdt = parseFloat(parseFloat((1 / currenciesPriceRate[coin_symbol == 'USDT' ? 'USD' : coin_symbol])) * parseFloat(amount));

      if (!isNaN(total_in_usdt)) {
        return total_in_usdt
      }
      else {
        return null;
      }
    }
    else {
      return '-'
    }
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
    else if (name == 'GBP')
      return GBP;

    return CNF;
  };

  const walletColumns = [
    {
      name: 'Spot Wallet Amount',
      selector: coin => parseFloat(coin.amount).toFixed(2),
      sortable: true,
    }
  ]

  const accountColumns = [
    {
      name: "Coin Name",
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
      name: '24H Change',
      selector: coin => parseFloat(coin.futures_amount).toFixed(2),
      sortable: true,
    },
    {
      name: 'Tranfer Assets',
      cell: row => {
        return (
          <>
            <WalletTransfer></WalletTransfer>
          </>
        );
      },
    },
    {
      name: 'In USD',
      selector: coin => parseFloat(coin?.amount).toFixed(2),
      cell: (coin) => {
        let coinSymbol = currencyData?.find(
          (row) => row._id == coin.currencyId
        )?.symbol;
        let usdtValue = getRateInUsdt(coinSymbol, coin?.amount);
        if (usdtValue) {
          return (currencyFormatter.format(usdtValue.toFixed(2), { code: 'USD' }));
        }
        else {
          return '-'
        }

      },
      sortable: true,
    },
    {
      name: 'Future Wallet Amount',
      selector: coin => parseFloat(coin.futures_amount).toFixed(2),
      sortable: true,
    },
    {
      name: 'Actions',
      cell: (coin) => {
        let coinSymbol = currencyData?.find(
          (row) => row._id == coin.currencyId
        )?.symbol;
        let fiatCoins = ['USD', 'EUR', 'CAD', 'AUD', 'NZD'];

        if (fiatCoins?.includes(coinSymbol)) {
          return (
            <div className="table-button">
              <Link className="btn trade-button" to={`/exchange/${coinSymbol}`}>
                Trade
              </Link>
            </div>
          )
        }
        else {
          return (
            <div className="table-button">
              <Link className="btn trade-button" to={`/trade/${coinSymbol == 'USDT' ? 'ETH' : coinSymbol}USDT`}>
                Trade
              </Link>
            </div>
          )
        }

      }
    },
  ]

  return (
    <>
      {currentUser?._id ? <GetAccountData /> : null}
      <section className="header-padding">
        <div className="portfolio-page">
          <div className="img-content">
            {/* <div className="portfolio-img">
              <img src={PortfolioBG} alt="" className="img-fluid" />
            </div> */}

            {/* {totalAmount > 0 ? */}
              <div className="portfolio-price-box-container">
                <div className="portfolio-price-box d-flex justify-content-between">
                  <div className="portfolio-data-section d-flex align-items-center">
                    <div className="portfolio-img">
                      <div className="profile-img">
                        <img className="img-fluid" src={currentUser ? imagePath ? imagePath : userPlaceholder : ''} alt="" />
                      </div>
                      <div className={`status {red} green`}></div>
                    </div>
                    <div className="portfolio-data">
                      <div className="profile-name d-flex align-items-center">
                        <h3 className="me-3 mb-0">{currentUser?.firstName} {currentUser?.lastName}</h3>
                        {currentUser?.isVerified ?
                          <div className="verification d-flex align-items-center">
                            <div className="verify-icon me-3">
                              <img className="img-fluid" src={verification} alt="" />
                            </div>
                            <div className="verify-button">
                              <span className="verify">Complete Verification</span>
                            </div>
                          </div> : null}
                      </div>
                      <div className="more-data d-flex align-items-center">
                        <div className="plan d-flex align-items-center margin-right">
                          <div className="plan-img me-2">
                            <img className="img-fluid" src={userPlaceholder} alt="" />
                          </div>
                          <h5 className="plan-text">Pro Plan</h5>
                        </div>
                        {currentUser?.countryCode ?
                          <div className="address-area d-flex align-items-center margin-right">
                            <span className="address-icon me-2"><FontAwesomeIcon icon={faLocationDot} /></span>
                            <h5 className="address">{currentUser?.country?.nicename}</h5>
                          </div> : null}
                        <div className="email d-flex align-items-center">
                          <span className="email-icon me-2"><FontAwesomeIcon icon={faEnvelope} /></span>
                          <h5 className="email-address" title={currentUser?.email}>{currentUser?.email}</h5>
                        </div>
                      </div>
                      <div className="balance-section">
                        <div className="green-box">
                          <span className="total-tag">Total Balance</span>
                          <span className="balance">{currencyFormatter.format(parseFloat(totalAmount).toFixed(2), { code: 'USD' })} </span>
                          <div className="flow d-flex align-items-center">
                            <span className={`d-flex align-items-center me-3 ${(previousAmountPercentChange && parseFloat(previousAmountPercentChange) >= 0) ? 'green' : 'red'}`}>
                              <span className="raise me-2">{(previousAmountPercentChange && parseFloat(previousAmountPercentChange) >= 0 )? <FontAwesomeIcon icon={faArrowUp} /> : <FontAwesomeIcon icon={faArrowDown} />}  </span>
                              <span className="raise">{previousAmountPercentChange ? Math.abs(parseFloat(previousAmountPercentChange).toFixed(3)) : ''} %</span>
                            </span>
                            <span className="fixed-text">vs. previous month</span>
                          </div>
                        </div>
                        <div className="green-box">
                          <span className="total-tag">PnL</span>
                          <span className="balance" style={{ color: currentMarketPrice && totalAmount > 0  && getUnrealizedPnL(userOrders[0]) >= 0 ? '#3baf7c' : 'red' }}> {currentMarketPrice && totalAmount > 0 ? parseFloat(getUnrealizedPnL(userOrders[0])).toFixed(4) + ' USD' : 'Loading...'} </span>
                          <div className="flow d-flex align-items-center">
                            <span className={`d-flex align-items-center me-3 ${currentMarketPrice && totalAmount > 0  && getUnrealizedPnL(userOrders[0]) >= 0 ? 'green' : 'red'}`}>
                              <span className="raise me-2">{currentMarketPrice && totalAmount > 0 && getUnrealizedPnL(userOrders[0]) >= 0 ? <FontAwesomeIcon icon={faArrowUp} /> : <FontAwesomeIcon icon={faArrowDown} />} </span>
                              <span className="raise">{currentMarketPrice && totalAmount > 0  && getUnrealizedPnL(userOrders[0]) ? parseFloat(getUnrealizedPnL(userOrders[0]) / (userOrders[0]?.tradeType == 1 ? parseFloat(userOrders[0].userInvestedAmount) : (parseFloat(userOrders[0]?.userInvestedAmount) * parseFloat(userOrders[0]?.tradeStartPrice)))).toFixed(4) : ''} %</span>
                            </span>
                            <span className="fixed-text">vs. previous month</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="stats-section">
                    <div className="buttons-section">
                      <Link className="green-button btn me-2" to="/deposit/USDT">Deposit</Link>
                      {/* <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                          <FontAwesomeIcon icon={faEllipsis} />
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                          <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                          <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown> */}
                    </div>
                    <div className="progress-section">
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <h5 className="progress-label">Profile Completion</h5>
                        <h5 className="progress-percent">{profileCompletePercent}%</h5>
                      </div>
                      <div className="progress-line">
                        <ProgressBar variant="success" now={profileCompletePercent} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* :
              <div className="portfolio-content portfolio-content-logo ps-2 pe-2">
                <h2 className="m-0">
                  Welcome {currentUser?.firstName} {currentUser?.lastName} to
                  <span className="logo-wrapper">
                    <Link to="/">
                      <img src={Logo} fluid />
                    </Link>
                  </span>
                </h2>
                <div className="portlofio-options d-flex flex-lg-row flex-md-row flex-column">
                  <div className="option mb-lg-0 mb-md-0 mb-4">
                    <img src={WalletSVG} alt="" className="img-fluid mb-3" />
                    <p className="mb-2 text-white">
                      Securely manage over 100 cryptocurrencies. Your funds are
                      always under your control.
                    </p>
                    <Link to="/activity/ETH">
                      <button type="button" className="btn">
                        Make Your First Deposit
                      </button>
                    </Link>
                  </div>
                  <div className="option">
                    <img src={TimerSVG} alt="" className="img-fluid mb-3" />
                    <p className="mb-2 text-white">
                      Quickly restore access to your wallet with your secret
                      12-word recovery phrase.
                    </p>
                    <Link to="/backup">
                      <button type="button" className="btn">
                        Restore from Backup
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            } */}
          </div>
          {/* </div> */}
          <div className="mb-4" style={{ backgroundColor: "#0F1015" }}>
            <div className="portfolio-details">
              <div className="detail purple">
                <h5 className="mb-2 text-white">24H Change</h5>
                <h3>{currencyFormatter.format(parseFloat(previousAmountChange).toFixed(2), { code: 'USD' })} </h3>
              </div>
              <div className="detail green">
                <h5 className="mb-2 text-white">Highest Balance</h5>
                <h3>{currencyFormatter.format(parseFloat(totalAmount).toFixed(2), { code: 'USD' })} </h3>
              </div>
              <div className="detail blue">
                <h5 className="mb-2 text-white">Portfolio Age</h5>
                <h3>{portfolioAge < 1 ? 0 : portfolioAge}{portfolioAge <= 1 ? ' Day' : ' Days'}</h3>
              </div>
              <div className="detail dark">
                <h5 className="mb-2 text-white">Best 24H Asset</h5>
                <h3>{currencyFormatter.format(parseFloat(bestAsset).toFixed(2), { code: 'USD' })}</h3>
              </div>
              <div className="detail dark">
                <h5 className="mb-2 text-white">Worst 24H Asset</h5>
                <h3>{currencyFormatter.format(parseFloat(worstAsset).toFixed(2), { code: 'USD' })}</h3>
              </div>
            </div>
          </div>
          <div className="portfolio-datatable">
            <div className="top-heading d-flex align-items-center justify-content-between">
              <span className="cur-tag">My Currencies</span>
              <span className="cur-small-tag">24H</span>
            </div>
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
                    <th scope="col">Transfer Assets</th>
                    <th scope="col">Future Wallet Amount</th>
                  </tr>
                </thead>

              </Table>
            )}

          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Index;