import React, { useState, useEffect, Component } from 'react';
import QrCode from "../../assets/images/qr-codee.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faQuestionCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from "react-redux";
import { getCurrency } from '../../redux/currencies/currencyActions';
import { getNetwork } from '../../redux/networks/networkActions';
import { getUserWallet, createUserWallet } from '../../redux/wallet/walletActions';
import { getDefaultBankAccount } from '../../redux/bankAccounts/bankAccountActions';
import GetAccountData from '../shared/GetAccountData';
import QRCode from "react-qr-code";
import CopyToClipboard from 'react-copy-to-clipboard';
import { useParams } from 'react-router-dom';
import Ramp from "../../assets/images/ramplogo.svg";
import eclipcoin from "../../assets/images/eclipcoin.svg";
import guard from "../../assets/images/guard.svg";
import bitcoincom from "../../assets/images/bitcoincom.svg";
import Cards from 'react-credit-cards';
import 'react-credit-cards/es/styles-compiled.css';
import { Tab, Tabs } from "react-bootstrap";
import { toast } from 'react-toastify';

const Deposit = () => {
  const { symbol } = useParams();
  const [defaultBankAccountData, setDefaultBankAccountData] = useState({});
  const [selectedCurrency, setSelectedCurrency] = useState([]);
  const [selectedNetwork, setSelectedNetwork] = useState([]);
  const [DepositTo, setDepositTo] = useState('Spot Account');
  const [showWallet, setShowWallet] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const [depositCoin, setDepositCoin] = useState(true);
  const [depositCoin2, setDepositCoin2] = useState(false);
  const [depositCoin3, setDepositCoin3] = useState(false);
  const [number, SetNumber] = useState("");
  const [name, SetName] = useState("");
  const [month, SetMonth] = useState("");
  let [expiry, SetExpiry] = useState("");
  const [cvc, SetCvc] = useState("");
  const [focus, SetFocus] = useState("");
  const handleDate = (e) => {
    SetMonth(e.target.value);
    SetExpiry(e.target.value);
  };
  const handleExpiry = (e) => {
    SetExpiry(month.concat(e.target.value));
  };
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


  const dispatch = useDispatch();
  const currencyData = useSelector((state) => state.currency?.currencies?.allCurrencies);
  const networks = useSelector((state) => state.networks?.networks);
  const userId = useSelector((state) => state.user?.user?._id);
  const wallet = useSelector((state) => state.wallet?.wallet);
  const defaultBankAccount = useSelector((state) => state.bankAccounts?.defaultBankAccount);

  const getWalletInfo = (currency, network) => {
    dispatch(getUserWallet(userId, currency._id, network._id));
  }

  const createWallet = () => {
    setIsLoader(true);
    dispatch(createUserWallet(userId, selectedNetwork._id, selectedCurrency._id));
  }

  useEffect(() => {
    if (Object.keys(defaultBankAccount)?.length > 0) {
      setDefaultBankAccountData(defaultBankAccount);
    }
  }, [defaultBankAccount])


  useEffect(() => {
    dispatch(getCurrency());
    dispatch(getNetwork());
    dispatch(getDefaultBankAccount());
  }, []);


  useEffect(() => {
    console.log("symbol", symbol);
    if (currencyData) {
      let found = currencyData?.find(currency => currency.symbol == symbol)
      setSelectedCurrency(found);
    }
  }, [currencyData])

  const copyReferral = () => {
    toast.success('Successfully copied!');
  }

  return (
    <>
      <GetAccountData />
      <section className="deposit header-padding">
        <div className="container-fluid custom-box padding50">
          <div className="d-flex justify-content-center align-items-center flex-md-row flex-column">
            <div className="d-flex align-items-center mb-lg-0 mb-3">
              <i className="fa fa-angle-left me-lg-4 me-3 left-angle"></i>
              <h3 className="mb-0 text-light">Deposit</h3>
            </div>
          </div>
          <div className="row pt-4">
            <div className="col-md-8">
              <div className="deposit-col">
                <div className="deposit-coin">
                  <button className='payopt' role={Tab} onClick={depositCoinHandler} autoFocus>Coin</button>
                  <button className='payopt' role={Tab} onClick={depositCoinHandler2}>Credit Card</button>
                  <button className='payopt' role={Tab} onClick={depositCoinHandler3}>Bank</button>
                  {depositCoin && (
                    <div className="dropdown deposit-dropdown">
                      <button className="btn dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                        <div className="d-flex justify-content-between">
                          <p className="coin-name">{selectedCurrency && selectedCurrency.symbol ? selectedCurrency.symbol : "???"}</p>
                          <div className="coin-details d-flex align-items-center">
                            <p className="detail">({selectedCurrency && selectedCurrency.symbol ? selectedCurrency.name : "Select coin"})</p>
                            <p className="dd-arrow"></p>
                          </div>
                        </div>
                      </button>
                      <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                        {currencyData && currencyData.length > 0 && currencyData?.filter(row => row?.isFiat != true)?.map((currency) => (
                          <li key={currency._id} onClick={() => { setSelectedCurrency(currency); setSelectedNetwork([]); setShowWallet(false); }}>
                            <a className="dropdown-item">
                              <div className="d-items d-flex justify-content-between">
                                <p>{currency.symbol}</p>
                                <p>{currency.name}</p>
                              </div>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>)}
                  {selectedCurrency && selectedCurrency.symbol ?
                    <>
                      {depositCoin && (<h2>Chain Type</h2>)}
                      {depositCoin && (
                        <div className="d-flex flex-row">
                          {networks && networks.length > 0 && networks.filter(network => network.currencies.some((o) => o._id == selectedCurrency._id)).length ?
                            networks && networks.length > 0 && networks.filter(network => network.currencies.some((o) => o._id == selectedCurrency._id)).map((network) => (
                              <div key={network._id} className={selectedNetwork && selectedNetwork.symbol == network.symbol ? "deposit-selected-coin" : "deposit-notselected-coin"} onClick={() => { getWalletInfo(selectedCurrency, network); setSelectedNetwork(network); setShowWallet(true) }}>
                                <p>{network.symbol}</p>
                              </div>
                            ))
                            : <p className='text-light'> No Networks found! </p>
                          }
                        </div>)}

                      {console.log(showWallet, wallet)}
                      {showWallet ?
                        wallet && wallet.address ?
                          <div>
                            {depositCoin && (<div className="code-address-wallet">
                              <div className="qr-image p-5">
                                <QRCode size={200} value={wallet.address} className="img-fluid" />
                              </div>
                              <p className="text-white">Your Wallet Address</p>
                              <div className="address-wallet d-flex justify-content-between align-items-center text-white">
                                <p className='me-3'>{wallet.address}</p>
                                <CopyToClipboard text={wallet.address}>
                                  <FontAwesomeIcon icon={faCopy} onClick={() => copyReferral()} />
                                </CopyToClipboard>
                              </div>
                            </div>)}
                          </div>
                          :
                          <div className="inline-block">
                            {isLoader ?
                              <a className="btn w-100 form-btn text-capitalize mt-5"><FontAwesomeIcon icon={faSpinner} className="fa-spin" /></a>
                              :
                              <a onClick={() => createWallet()} className="btn w-100 form-btn text-capitalize mt-5">Create Wallet</a>
                            }
                          </div>
                        : null
                      }
                    </>
                    : null
                  }
                </div>


                <div className="deposit-coin2">

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
                  {depositCoin2 && (<form className='ccdetail'>
                    <div className="row">
                      <div className="col-sm-11">
                        <label htmlFor="name" className='carddet'>Card Number</label>
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
                    </div>
                    <br />
                    <div className="row">
                      <div className="col-sm-11">
                        <label htmlFor="name" className='carddet'>Cardholder Name</label>
                        <input
                          type="text"
                          className="form-controlcarddet"
                          value={name}
                          name="name"
                          onChange={(e) => {
                            SetName(e.target.value);
                          }}
                          onFocus={(e) => SetFocus(e.target.name)}
                        ></input>
                      </div>
                    </div>
                    <br />
                    <div className="row">
                      <div
                        className="col-sm-11"

                      >
                        <label htmlFor="month" className='carddet'>Expiration Date</label>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-sm-5">
                        <select
                          className="form-controlcarddet"
                          name="expiry"
                          onChange={handleDate}
                        >
                          <option value=" ">Month</option>
                          <option value="01">Jan</option>
                          <option value="02">Feb</option>
                          <option value="03">Mar</option>
                          <option value="04">April</option>
                          <option value="05">May</option>
                          <option value="06">June</option>
                          <option value="07">July</option>
                          <option value="08">Aug</option>
                          <option value="09">Sep</option>
                          <option value="10">Oct</option>
                          <option value="11">Nov</option>
                          <option value="12">Dec</option>
                        </select>
                      </div>
                      &nbsp;
                      <div className="col-sm-5">
                        <select
                          className="form-controlcarddet"
                          name="expiry"
                          onChange={handleExpiry}
                        >
                          <option value=" ">Year</option>
                          <option value="21">2021</option>
                          <option value="22">2022</option>
                          <option value="23">2023</option>
                          <option value="24">2024</option>
                          <option value="25">2025</option>
                          <option value="26">2026</option>
                          <option value="27">2027</option>
                          <option value="28">2028</option>
                          <option value="29">2029</option>
                          <option value="30">2030</option>
                        </select>
                      </div>
                    </div>
                    <br />
                  </form>)}
                  {depositCoin2 && (
                    <form className='ccdetail2'>
                      <div className="row">
                        <div className="col-sm-11">
                          <label htmlFor="cvv" className='carddet'>CVV</label>
                          <input
                            type="tel"
                            name="cvc"
                            maxLength="3"
                            className="form-controlcarddet"
                            value={cvc}
                            pattern="\d*"
                            onChange={(e) => {
                              SetCvc(e.target.value);
                            }}
                            onFocus={(e) => SetFocus(e.target.name)}
                          ></input>
                        </div>
                      </div>
                      <br />
                      <div className="row">
                        <div className="col-sm-11">
                          <label htmlFor="Currency" className='carddet'>Currency</label>
                          <select
                            className="form-controlcarddet"
                            name="Currency"
                          >
                            <option value=" ">Currency</option>
                            <option value="USD">USD</option>
                            <option value="CAD">CAD</option>
                            <option value="AUD">AUD</option>
                            <option value="NZD">NZD</option>
                            <option value="GBP">GBP</option>
                          </select>
                        </div>
                      </div>
                      <br />
                      <div className="row">
                        <div
                          className="col-sm-11"
                          style={{
                            ...{ "paddingRight": "12em" },
                            ...{ "paddingLeft": "1em" }
                          }}
                        >
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-11">
                          <label htmlFor="Amount" className='carddet'>Amount</label>
                          <input
                            type="number"
                            className="form-controlcarddet"
                            name="number"
                          ></input>
                        </div>
                      </div>
                      <br />
                      <button className='ccbtn' type='submit'>Pay</button>
                    </form>)}

                  <div className='paybat'>

                    {depositCoin2 && (<a href='https://trade4freedom.org/?ref=37' target="_blank" rel="noreferrer">
                      <button className="paybutton">Beginner</button>
                    </a>)}

                    {depositCoin2 && (<a href='https://onlineprotrading.com/checkout/?add-to-cart=47' target="_blank" rel="noreferrer">
                      <button className="paybutton">Advanced</button>
                    </a>)}

                    {depositCoin2 && (<a href='https://onlineprotrading.com/checkout/?add-to-cart=48' target="_blank" rel="noreferrer">
                      <button className="paybutton">Crypto Pro</button>
                    </a>)}
                  </div>



                  <div className='paylogo'>
                    <p>
                      {depositCoin2 && (
                        <a href='https://ramp.network/' target="_blank" rel="noreferrer">
                          <img src={Ramp} className="paylogo"></img>
                        </a>)}

                      {depositCoin2 && (
                        <a href='https://www.moonpay.com/buy/btc' target="_blank" rel="noreferrer">
                          <img src={eclipcoin} className="paylogo"></img>
                        </a>)}

                      {depositCoin2 && (
                        <a href='https://www.coinspot.com.au/' target="_blank" rel="noreferrer">
                          <img src={guard} className="paylogo"></img>
                        </a>)}

                      {depositCoin2 && (
                        <a href='https://www.kraken.com/learn/buy-bitcoin-btc' target="_blank" rel="noreferrer">
                          <img src={bitcoincom} className="paylogo"></img>
                        </a>)}
                    </p>
                  </div>

                </div>

                <div className="deposit-coin3">
                  {/* <h2 onClick={depositCoinHandler3}>Bank</h2> */}

                  {depositCoin3 && (
                    <div className="form-group col-xl-6 col-lg-8 col-md-10 mt-2">
                      <label className="bank-label">Bank Name
                        <CopyToClipboard text={defaultBankAccountData?.name} className="ms-3">
                          <FontAwesomeIcon icon={faCopy} onClick={() => copyReferral()} />
                        </CopyToClipboard>
                      </label>
                      <input
                        type="text"
                        className="form-control-bank"
                        value={defaultBankAccountData?.name}
                        disabled
                      />
                    </div>)}

                  {depositCoin3 && (
                    <div className="form-group col-xl-6 col-lg-8 col-md-10 mt-2">
                      <label className="bank-label">Iban
                        <CopyToClipboard text={defaultBankAccountData?.iban} className="ms-3">
                          <FontAwesomeIcon icon={faCopy} onClick={() => copyReferral()} />
                        </CopyToClipboard>
                      </label>
                      <input
                        type="text"
                        className="form-control-bank"
                        value={defaultBankAccountData?.iban}
                        disabled
                      />
                    </div>)}


                  {depositCoin3 && (
                    <div className="form-group col-xl-6 col-lg-8 col-md-10 mt-2">
                      <label className="bank-label">Account Number <CopyToClipboard text={defaultBankAccountData?.accountNumber} className="ms-3">
                        <FontAwesomeIcon icon={faCopy} onClick={() => copyReferral()} />
                      </CopyToClipboard>
                      </label>
                      <input
                        type="text"
                        className="form-control-bank"
                        value={defaultBankAccountData?.accountNumber}
                        disabled
                      />
                    </div>)}

                  {depositCoin3 && (
                    <div className="form-group col-xl-6 col-lg-8 col-md-10 mt-2">
                      <label className="bank-label">Bank Address
                        <CopyToClipboard text={defaultBankAccountData?.bankAddress} className="ms-3">
                          <FontAwesomeIcon icon={faCopy} onClick={() => copyReferral()} />
                        </CopyToClipboard>
                      </label>
                      <input
                        type="text"
                        className="form-control-bank"
                        value={defaultBankAccountData?.bankAddress}
                        disabled
                      />
                    </div>)}

                  {depositCoin3 && (
                    <div className="form-group col-xl-6 col-lg-8 col-md-10 mt-2">
                      <label className="bank-label">Swift Code
                        <CopyToClipboard text={defaultBankAccountData?.swiftCode} className="ms-3">
                          <FontAwesomeIcon icon={faCopy} onClick={() => copyReferral()} />
                        </CopyToClipboard>
                      </label>
                      <input
                        type="text"
                        className="form-control-bank"
                        value={defaultBankAccountData?.swiftCode}
                        disabled
                      />
                    </div>)}

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
    </>
  );
};

export default Deposit;
