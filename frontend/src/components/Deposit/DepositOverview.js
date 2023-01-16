import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faPlay, faArrowRight, faSearch } from '@fortawesome/free-solid-svg-icons';
import ETH from '../../assets/images/ETH.svg';
import XRP from '../../assets/images/XRP.png';
import USDT from '../../assets/images/USDT.png';
import BTC from '../../assets/images/BTC.svg';
import LTC from '../../assets/images/LTC.svg';
import ADA from '../../assets/images/cardano.svg';
import TRX from '../../assets/images/tron.svg';
import BCH from '../../assets/images/BCH.svg';
import DOGE from '../../assets/images/DOGE.svg';
import BNB from '../../assets/images/BNB.svg';
import AVAX from '../../assets/images/AVAX.svg';
import USDC from '../../assets/images/USDC.svg';
import LINK from '../../assets/images/chainlink.svg';
import EUR from '../../assets/images/EUR.png';
import CAD from '../../assets/images/CAD.png';
import NZD from '../../assets/images/NZD.png';
import AUD from '../../assets/images/AUD.png';
import USD from '../../assets/images/USD.png';
import CNF from '../../assets/images/CoinNotFound.png';
import { useDispatch, useSelector } from "react-redux";
import { getCurrency } from '../../redux/currencies/currencyActions';
import { getNetwork } from '../../redux/networks/networkActions';
import { getUserWallet, createUserWallet } from '../../redux/wallet/walletActions';
import GetAccountData from '../shared/GetAccountData';
import QRCode from "react-qr-code";

const DepositOverview = () => {
    const [show, setShow] = useState(false);
    const [showNetworks, setShowNetworks] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState([]);
    const [selectedNetwork, setSelectedNetwork] = useState([]);
    const [currencyFilter, setCurrencyFilter] = useState('');
    const [networkFilter, setNetworkFilter] = useState('');
    const [showWallet, setShowWallet] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleCloseNetworks = () => setShowNetworks(false);
    const handleShowNetworks = () => setShowNetworks(true);

    const dispatch = useDispatch();
    const currencyData = useSelector((state) => state.currency?.currencies?.allCurrencies);
    const networks = useSelector((state) => state.networks?.networks);
    const userId = useSelector((state) => state.user?.user?._id);
    const wallet = useSelector((state) => state.wallet?.wallet);

    const getWalletInfo = (network) => {
        dispatch(getUserWallet(userId, network._id));
        handleCloseNetworks();
    }

    const createWallet = () => {
        dispatch(createUserWallet(userId, selectedNetwork._id));
    }

    useEffect(() => {
        dispatch(getCurrency());
        dispatch(getNetwork());
    }, []);

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

    return (
        <section className="overview section-padding">
            <GetAccountData />
            <div className="bar">
                <div className="user-screen">
                    <div className="d-flex justify-content-between align-items-center flex-md-row flex-column">
                        <div className="d-flex align-items-center mb-lg-0 mb-3">
                            <i className="fa fa-angle-left me-lg-4 me-3 left-angle"></i>
                            <h3 className="mb-0">Deposit Crypto</h3>
                        </div>
                        {/* <div className="inline-block">
                            <a type="submit" className="btn w-100 form-btn text-capitalize">Withdraw Fiat</a>
                        </div> */}
                    </div>
                </div>
            </div>
            <div className="container-fluid user-screen">
                <div className="row">
                    <div className="col-lg-7 mb-lg-0 mb-4">
                        <div className="wrap-coin-box d-flex flex-lg-row flex-column justify-content-lg-between align-items-lg-start align-items-center">
                            {/* <p className="p2 text-capitalize coin-box-space">Select Coin</p> */}
                            <div className="select-crypto w-100">
                                <p className="p2">Deposit Coin</p>
                                <div className="coin-dropdown">
                                    <div className="dropdown mb-3">
                                        <button onClick={handleShow} className="btn coin-btn dropdown-toggle w-100" type="button">
                                            <p className="p2 mb-0">{selectedCurrency && selectedCurrency.symbol ? selectedCurrency.symbol : "Select coin"}</p>
                                        </button>
                                    </div>
                                    <div className="coin-img">
                                        <ul>
                                            {currencyData && currencyData.length > 0 && currencyData.slice(0, 4).map((currency) => (
                                                <li key={currency._id}>
                                                    <div className="d-flex align-items-center">
                                                        <figure className="mb-0">
                                                            <img src={getCoinImg(currency.symbol)} alt={currency.name} className="img-fluid" />
                                                        </figure>
                                                        <p className="p2 mb-0 text-uppercase">{currency.name}</p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {selectedCurrency && selectedCurrency.name ?
                            <div className="wrap-coin-box d-flex flex-lg-row flex-column justify-content-lg-between align-items-lg-start align-items-center mt-5">
                                {/* <p className="p2 text-capitalize coin-box-space">Deposit to</p> */}
                                <div className="select-crypto w-100">
                                    <p className="p2">Deposit Network</p>
                                    <div className="coin-dropdown">
                                        <div className="dropdown mb-3">
                                            <button onClick={handleShowNetworks} className="btn coin-btn w-100 dropdown-toggle" type="button">
                                                <p className="p2 mb-0">{selectedNetwork && selectedNetwork.name ? selectedNetwork.name : "Select Network"}</p>
                                            </button>
                                        </div>
                                        <div className="coin-img">
                                            <ul>
                                                {networks && networks.length > 0 && networks.filter(network => network.currencies.some((o) => o._id == selectedCurrency._id)).slice(0, 4).map((network) => (
                                                    <li key={network._id}>
                                                        <div className="d-flex align-items-center">
                                                            <div className="d-flex align-items-center">
                                                                <figure className="mb-0">
                                                                    <img src={getCoinImg(network.symbol)} alt={network.name} className="img-fluid" />
                                                                </figure>
                                                                <p className="p2 mb-0 text-uppercase">{network.name}</p>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            :
                            null
                        }
                        {showWallet ?
                            wallet && wallet.address ?
                                <div>
                                    <div className="wrap-coin-box d-flex flex-lg-row flex-column justify-content-lg-between align-items-lg-start align-items-center mt-5">
                                        <p className="p2 text-capitalize coin-box-space"></p>
                                        <div className="select-crypto w-100 d-flex jusify-content-between">
                                            <p> <b>Address:</b> {wallet.address}  </p>

                                        </div>

                                    </div>
                                    <div className=''> <QRCode size={100} value={wallet.address} /> </div>
                                </div>

                                :
                                <div className="inline-block">
                                    <a onClick={() => createWallet()} className="btn w-100 form-btn text-capitalize mt-5">Create Wallet</a>
                                </div>
                            : null
                        }

                    </div>
                    <div className="col-lg-4 offset-lg-1  mb-lg-0 mb-4">
                        <div className="mb-50 center-div">
                            <div className="mb-30 d-flex flex-lg-row flex-column justify-content-lg-between align-items-center">
                                <span className="span-2">Deposit hasn't arrived?</span>
                                <div className="inline-block">
                                    <a className="btn light-btn">Learn more</a>
                                </div>
                            </div>
                            <p className="p2 p-w">
                                If you encounter the following problems during the deposit process, you can go to Deposit Status Query to search for your current deposit status or retrieve your assets via self service application
                            </p>
                            <ul className="dot-ul mb-30">
                                <li><p className="p2">Deposit has not arrived after a long while.</p></li>
                                <li><p className="p2">Didn't enter MEMO/Tag correctly</p></li>
                                <li><p className="p2">Deposoit unlisted coins</p></li>
                            </ul>
                            {/* <div className="inline-block">
                                <a type="submit" className="btn search-icon form-btn text-capitalize">Search
                                    <FontAwesomeIcon className='ms-lg-4 ms-3' icon={faArrowRight} />
                                </a>
                            </div> */}
                        </div>
                        <div className="faq center-div">
                            <div className="mb-30">
                                <span className="span-2 text-uppercase">faq</span>
                            </div>
                            <div className="video-play">
                                <a className="d-flex align-items-center">
                                    <span><FontAwesomeIcon icon={faPlay} /></span><p className="p2 mb-0">Deposoit unlisted coins</p>
                                </a>
                            </div>
                            <ul className="crypto-guide">
                                <li>
                                    <div className="guide-icon">
                                        <FontAwesomeIcon className='me-2' icon={faFile} />
                                        <a ><p className="p2 mb-0">Deposit has not arrived after a long while.</p></a>
                                    </div>
                                </li>
                                <li>
                                    <div className="guide-icon">
                                        <FontAwesomeIcon className='me-2' icon={faFile} />
                                        <a ><p className="p2 mb-0">Didn't enter MEMO/Tag correctly</p></a>
                                    </div>
                                </li>
                                <li>
                                    <div className="guide-icon">
                                        <FontAwesomeIcon className='me-2' icon={faFile} />
                                        <a ><p className="p2 mb-0">Deposoit unlisted coins</p></a>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>


            <Modal className='modal-wrapper modal-wrapper-width' show={show} onHide={handleClose}>
                <Modal.Header className='modal-main-heading' closeButton>
                    <div className="modal-main-heading-content">
                        <h5 className="modal-title" id="exampleModalLabel">Select Coin to deposit</h5>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="modal-two-input-wrapper d-flex align-items-center mb-3">
                            <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Search coin name" onChange={(e) => setCurrencyFilter(e.target.value)} value={currencyFilter} />
                            <FontAwesomeIcon icon={faSearch} className='search' />
                        </div>
                    </form>
                    <div className="currency-scroll-wrapper overflow-auto">
                        {currencyData && currencyData.length > 0 && currencyData.filter(currency => currency.name.toLowerCase().includes(currencyFilter.toLowerCase())).length ?
                            currencyData && currencyData.length > 0 && currencyData.filter(currency => currency.name.toLowerCase().includes(currencyFilter.toLowerCase())).map((currency) => (
                                <div key={currency._id} className="currency-info d-flex" onClick={() => { setSelectedCurrency(currency); setSelectedNetwork([]); handleClose(); setShowWallet(false); }}>
                                    <div className="currency-info-logo-popup">
                                        <img src={getCoinImg(currency.symbol)} alt={currency.name} className="img-fluid" />
                                    </div>
                                    <div className="currency-info-content">
                                        <h5>{currency.name}</h5>
                                        <p>{currency.symbol}</p>
                                    </div>
                                </div>
                            ))
                            : "No Currency found!"
                        }

                    </div>
                </Modal.Body>
            </Modal>

            <Modal className='modal-wrapper modal-wrapper-width' show={showNetworks} onHide={handleCloseNetworks}>
                <Modal.Header className='modal-main-heading' closeButton>
                    <div className="modal-main-heading-content">
                        <h5 className="modal-title" id="exampleModalLabel">Select Network</h5>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="modal-two-input-wrapper d-flex align-items-center mb-3">
                            <input type="search" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Search network name" onChange={(e) => setNetworkFilter(e.target.value)} value={networkFilter} />
                            <FontAwesomeIcon icon={faSearch} className='search' />
                        </div>
                    </form>
                    <div className="currency-scroll-wrapper overflow-auto">
                        {networks && networks.length > 0 && networks.filter(network => network.currencies.some((o) => o._id == selectedCurrency._id)).filter(network => network.name.toLowerCase().includes(networkFilter.toLowerCase())).length ?
                            networks && networks.length > 0 && networks.filter(network => network.currencies.some((o) => o._id == selectedCurrency._id)).filter(network => network.name.toLowerCase().includes(networkFilter.toLowerCase())).map((network) => (
                                <div key={network._id} className="currency-info d-flex" onClick={() => { getWalletInfo(network); setSelectedNetwork(network); setShowWallet(true) }}>
                                    <div className="currency-info-logo">
                                        <img src={getCoinImg(network.symbol)} alt={network.name} className="img-fluid" />
                                    </div>
                                    <div className="currency-info-content">
                                        <h5>{network.symbol}</h5>
                                        <p>{network.name}</p>
                                    </div>
                                </div>
                            ))
                            : "No Network found!"
                        }
                    </div>
                </Modal.Body>
            </Modal>
        </section>
    )
}

export default DepositOverview