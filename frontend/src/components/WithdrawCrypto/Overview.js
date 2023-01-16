import { React, useEffect, useState } from 'react';
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
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dropdown, Tooltip, OverlayTrigger, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { faAngleLeft, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from "react-redux";
import { getCurrency } from '../../redux/currencies/currencyActions';
import { getNetwork } from '../../redux/networks/networkActions';
import { getWallets } from '../../redux/addresses/externalWalletActions';
import { getWithdrawFee, resetWithdrawFee } from '../../redux/withdrawFee/withdrawFeeActions';
import { clearWithdraw, submitWithdraw } from '../../redux/externalTransactions/externalTransactionActions';
import GetAccountData from '../shared/GetAccountData';
import { getAccount } from '../../redux/account/accountActions';
import FullPageLoader from "../FullPageLoader/fullPageLoader";

const Overview = () => {
    const [selectedCurrency, setSelectedCurrency] = useState([]);
    const [selectedNetwork, setSelectedNetwork] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState([]);
    const [withdrawTo, setWithdrawTo] = useState(1); // 1: Address book , 2: New address
    const [showWithdraw, setShowWithdraw] = useState(false);
    const [haveCoins, setHaveCoins] = useState(0);
    const [withdrawCoins, setWithdrawCoins] = useState(0);
    const [loader, setLoader] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleCloseConfirmation = () => setShowConfirmation(false);
    const handleShowConfirmation = () => setShowConfirmation(true);
    const navigate = useNavigate();

    const handleWithdraw = () => {
        if (withdrawCoins <= withdrawFee?.min || haveCoins <= 0) {
            Swal.fire({
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
                deducted: (parseFloat(withdrawCoins) + parseFloat(withdrawFee?.fee)).toPrecision(8),
                coins: withdrawCoins.toString(),
                gas: withdrawFee?.actualFee
            }
            dispatch(submitWithdraw(data));
            setLoader(true)
        }
    };

    const dispatch = useDispatch();
    const currencyData = useSelector((state) => state.currency?.currencies?.allCurrencies);
    const externalWallets = useSelector((state) => state.externalWallets?.externalWallets);
    const networks = useSelector((state) => state.networks?.networks);
    const userId = useSelector((state) => state.user?.user?._id);
    const amounts = useSelector((state) => state.accounts?.account?.amounts);
    const withdrawFee = useSelector((state) => state.withdrawFee?.withdrawFee);
    const withdrawn = useSelector((state) => state.externalTransactions?.withdrawn);
    const error = useSelector((state) => state.externalTransactions?.error);
    const withdrawMsg = useSelector((state) => state.externalTransactions?.transaction?.message);

    useEffect(() => {
        dispatch(getCurrency());
        dispatch(getNetwork());
        if (userId)
            dispatch(getWallets(userId));
    }, [userId]);

    useEffect(() => {
        if (error) {
            setLoader(false)
            dispatch(clearWithdraw());
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
                handleSelectedCoin()
            })
        }
    }, [withdrawn, error])


    const getWithdrawInfo = (network) => {
        setShowWithdraw(true)
        let data = {
            networkId: network._id,
            currencyId: selectedCurrency._id
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

    const handleSelectedCoin = (coin) => {
        setSelectedCurrency(coin);
        if (coin)
            setHaveCoins(amounts.find(row => row.currencyId == coin._id).amount);
        setSelectedNetwork([]);
        setSelectedAddress([]);
        setShowWithdraw(false);
        setWithdrawCoins(0)
        clearWithdrawFee();
    }

    const clearWithdrawFee = () => {
        dispatch(resetWithdrawFee());
    }

    const handleWithdrawLimit = () => {
        var validNumber = new RegExp(/^\d*\.?\d*$/);

        if (!withdrawCoins.toString().match(validNumber) || parseFloat(withdrawCoins) > parseFloat((haveCoins - withdrawFee?.fee >= 0 ? haveCoins - withdrawFee?.fee : 0) < withdrawFee?.max ? (haveCoins - withdrawFee?.fee >= 0 ? haveCoins - withdrawFee?.fee : 0) : withdrawFee?.max) || parseFloat(withdrawCoins) < parseFloat(withdrawFee?.min)) {
            setWithdrawCoins(0)
            Swal.fire({
                text: "Invalid number entered. Please enter a valid number",
                icon: 'info',
                showCancelButton: false,
                confirmButtonText: 'OK',
            })
        }
    }

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            <div className="tooltip-des">
                <div>
                    <p>Min allowed: </p>
                    <p>{withdrawFee?.min}</p>
                </div>
                <div>
                    <p>Max allowed: </p>
                    <p>{withdrawFee?.max}</p>
                </div>
                <div>
                    <p>Fee: </p>
                    <p>{withdrawFee?.fee}</p>
                </div>
            </div>
        </Tooltip>
    );


    return (
        <div>
            {loader ? <FullPageLoader /> :
                <>
                    <GetAccountData />
                    <section className="overview section-padding">
                        <div className="bar">
                            <div className="user-screen">
                                <div className="d-flex justify-content-between align-items-center flex-md-row flex-column">
                                    <div className="d-flex align-items-center mb-lg-0 mb-3">
                                        <FontAwesomeIcon icon={faAngleLeft} style={{ marginRight: "20px" }} onClick={() => navigate(-1)} />
                                        <h3 className="mb-0">Withdraw Crypto</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="container-fluid user-screen">
                            <div className="row">
                                <div className="col-lg-7 mb-lg-0 mb-4">
                                    {amounts ?
                                        <div className="wrap-coin-box mb-3 d-flex flex-lg-row flex-column align-items-center">

                                            <p className="p2 text-capitalize coin-box-space">Select Coin</p>
                                            <div className="select-crypto w-100">
                                                <Dropdown className="coin-dropdown">
                                                    <div className="dropdown mb-3">
                                                        <Dropdown.Toggle className="btn coin-btn w-100 dropdown-toggle" type="button" id="dropdownMenuButton1" >
                                                            {selectedCurrency && selectedCurrency.symbol ?
                                                                <>
                                                                    <figure className="mb-0 toggle-img">
                                                                        <img src={getCoinImg(selectedCurrency.symbol)} alt="" className="img-fluid" />
                                                                    </figure>
                                                                    <p className="p2 mb-0">{selectedCurrency.symbol} <p className="gray mb-0 ms-1">{selectedCurrency.name}</p></p>
                                                                </>
                                                                :
                                                                "Select Coin"
                                                            }
                                                        </Dropdown.Toggle>

                                                        <Dropdown.Menu>
                                                            {currencyData && currencyData.length > 0 && currencyData?.filter(row => row?.isFiat != true)?.map((currency) => (
                                                                <Dropdown.Item key={currency._id} onClick={() => handleSelectedCoin(currency)}>{currency.name}</Dropdown.Item>
                                                            ))}
                                                        </Dropdown.Menu>
                                                    </div>
                                                </Dropdown>
                                            </div>
                                        </div>
                                        : null
                                    }

                                    {selectedCurrency && selectedCurrency._id ?
                                        <>
                                            <div className="wrap-coin-box mb-3 d-flex flex-lg-row flex-column align-items-center">
                                                <p className="p2 text-capitalize coin-box-space">Network</p>
                                                <Dropdown className="coin-dropdown w-100">
                                                    <div className="dropdown mb-3">
                                                        <Dropdown.Toggle className="btn coin-btn w-100 dropdown-toggle" type="button" >
                                                            {selectedNetwork && selectedNetwork.name ?
                                                                <>
                                                                    <figure className="mb-0 toggle-img">
                                                                        <img src={getCoinImg(selectedNetwork.symbol)} alt="" className="img-fluid" />
                                                                    </figure>
                                                                    <p className="p2 mb-0"> {selectedNetwork.symbol} <p className="gray mb-0 ms-1">{selectedNetwork.name}</p></p>
                                                                </>
                                                                :
                                                                "Select Network"
                                                            }
                                                        </Dropdown.Toggle>

                                                        <Dropdown.Menu>
                                                            {networks && networks.length > 0 && networks.filter(network => network.currencies.some((o) => o._id == selectedCurrency._id)).map((network) => (
                                                                <Dropdown.Item key={network._id} onClick={() => { clearWithdrawFee(); getWithdrawInfo(network); setSelectedNetwork(network) }}>{network.name}</Dropdown.Item>
                                                            ))}
                                                        </Dropdown.Menu>
                                                    </div>
                                                </Dropdown>
                                            </div>

                                            {selectedNetwork && selectedNetwork.name ?
                                                showWithdraw && withdrawFee && withdrawFee?.fee ?

                                                    <div className="wrap-coin-box d-flex flex-lg-row flex-column align-items-lg-start align-items-center mb-50">
                                                        <p className="p2 text-capitalize coin-box-space">Withdraw to Address</p>
                                                        <div className="select-crypto w-100">
                                                            <div className="d-flex justify-content-between align-items-center flex-md-row flex-column mb-50">
                                                                <div className="d-flex align-items-center justify-content-lg-start justify-content-center mb-3">
                                                                </div>
                                                                <Link to="/manage-address" style={{ color: "#0c0d14" }}> <span className="dot text-capitalize">Address Management</span> </Link>
                                                            </div>

                                                            <div className="select-crypto w-100">
                                                                <p className="p2 text-capitalize">address book</p>
                                                                <Dropdown className="coin-dropdown">
                                                                    <div className="dropdown mb-3">
                                                                        <Dropdown.Toggle className="btn coin-btn w-100 dropdown-toggle" type="button" >
                                                                            {selectedAddress && selectedAddress.address ?
                                                                                <>
                                                                                    <figure className="mb-0 toggle-img">
                                                                                        <img src={require(`../../assets/images/${selectedAddress.symbol}.png`).default} alt={selectedAddress.symbol} className="img-fluid" />
                                                                                    </figure>
                                                                                    <p className="p2 mb-0">  <p className="gray mb-0 ms-1">{selectedAddress.name}</p></p>
                                                                                </>
                                                                                :
                                                                                "Select Address"
                                                                            }
                                                                        </Dropdown.Toggle>

                                                                        <Dropdown.Menu>
                                                                            <Dropdown.Item onClick={() => { window.location.href = "/manage-address" }}> Add Address </Dropdown.Item>
                                                                            {externalWallets && externalWallets.filter(wallet => (wallet.networkId == selectedNetwork._id && wallet.currencyId == selectedCurrency._id)).map(wallet =>
                                                                                <Dropdown.Item key={wallet._id} onClick={() => setSelectedAddress(wallet)}> {wallet.name} </Dropdown.Item>
                                                                            )}
                                                                        </Dropdown.Menu>
                                                                    </div>
                                                                </Dropdown>

                                                                {selectedAddress && selectedAddress.address ?
                                                                    <div className="address-li mt-5">
                                                                        <ul>
                                                                            <li>
                                                                                <p className="p2 mb-0">Name</p> <span className="ms-lg-5 ms-3">{selectedAddress.name}</span>
                                                                            </li>
                                                                            <li>
                                                                                <p className="p2 mb-0">Address</p> <span className="ms-lg-5 ms-3">{selectedAddress.address}</span>
                                                                            </li>
                                                                            <li>
                                                                                <p className="p2 mb-0">Network</p> <span className="ms-lg-5 ms-3 text-capitalize">{selectedAddress.symbol}</span>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                    :
                                                                    null
                                                                }
                                                            </div>

                                                        </div>
                                                    </div>
                                                    : "Cannot withdraw this coin and network. Withdraw Fee not Found"
                                                : null
                                            }

                                            {selectedAddress && selectedAddress.status ?
                                                <>
                                                    <div className="wrap-coin-box d-flex flex-lg-row flex-column align-items-lg-start align-items-center mb-50">
                                                        <p className="p2 coin-box-space">Withdraw amount</p>
                                                        <div className="select-crypto w-100">
                                                            <div className="select-crypto w-100">
                                                                <div className="d-flex justify-content-between align-items-center flex-md-row flex-column mb-3">
                                                                    <p className="p2 mb-md-0 mb-3">Amount</p>
                                                                    <div className="d-flex align-items-center">
                                                                        <p className="p2 mb-0"> {withdrawCoins} {selectedCurrency && selectedCurrency.symbol ? selectedCurrency.symbol : ""} / {haveCoins} {selectedCurrency && selectedCurrency.symbol ? selectedCurrency.symbol : ""}</p>
                                                                        <OverlayTrigger
                                                                            placement="top"
                                                                            delay={{ show: 250, hide: 400 }}
                                                                            overlay={renderTooltip}
                                                                        >
                                                                            <span><FontAwesomeIcon icon={faInfoCircle} className='ms-3' /></span>
                                                                        </OverlayTrigger>
                                                                    </div>
                                                                </div>
                                                                <div className="coin-dropdown">
                                                                    <div className="dropdown mb-3 rcv-amount">
                                                                        <button className="btn coin-btn theme-border d-flex justify-content-between align-items-center w-100" type="button">

                                                                            <input type="number" max={(haveCoins - withdrawFee?.fee >= 0 ? haveCoins - withdrawFee?.fee : 0) < withdrawFee?.max ? (haveCoins - withdrawFee?.fee >= 0 ? haveCoins - withdrawFee?.fee : 0) : withdrawFee?.max} min={withdrawFee?.min} onChange={(e) => { setWithdrawCoins(e.target.value) }} onBlur={() => handleWithdrawLimit()} value={withdrawCoins} />
                                                                            <span className="d-flex">
                                                                                <p className="p2 mb-0 text-uppercase amount-num me-3 active-btn" onClick={() => { setWithdrawCoins((haveCoins - withdrawFee?.fee >= 0 ? haveCoins - withdrawFee?.fee : 0) < withdrawFee?.max ? (haveCoins - withdrawFee?.fee >= 0 ? haveCoins - withdrawFee?.fee : 0) : withdrawFee?.max) }}>max</p>
                                                                                <p className="p2 mb-0 text-uppercase ms-2">{selectedCurrency && selectedCurrency.symbol ? selectedCurrency.symbol : ""}</p>
                                                                            </span>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="wrap-coin-box d-flex flex-lg-row flex-column align-items-lg-start align-items-center mb-50">
                                                        <p className="p2 coin-box-space">Deducted amount</p>
                                                        <div className="select-crypto w-100">
                                                            <div className="d-flex flex-md-row flex-column justify-content-md-between align-items-center ju">
                                                                <div className="mb-md-0 mb-3 text-md-start text-center w-100">
                                                                    <span className='w-100 d-flex justify-content-between'>
                                                                        <span className="d-inline-block mb-3">{withdrawCoins ? (parseFloat(withdrawCoins) + parseFloat(withdrawFee?.fee)).toPrecision(8) : 0} {selectedCurrency && selectedCurrency.symbol ? selectedCurrency.symbol : ""}</span>
                                                                    </span>
                                                                    <div className="d-flex align-items-center w-100">
                                                                        <p className="p2 mb-0 gray"> {withdrawFee?.fee} transfer fee included</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="inline-block mt-5 d-flex justify-content-end" >
                                                                <button type='button' className="btn form-btn text-capitalize" onClick={() => handleShowConfirmation()} disabled={loader}>Withdraw
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                                : ""
                                            }
                                        </>
                                        : ""
                                    }
                                </div>
                            </div>
                        </div>
                    </section>

                    <Modal Modal className='modal-wrapper modal-wrapper-width' show={showConfirmation} onHide={handleCloseConfirmation} >
                        <Modal.Header className='modal-main-heading' closeButton>
                            <div className="modal-main-heading-content">
                                <h5 className="modal-title" id="exampleModalLabel">ARE YOU SURE?</h5>
                            </div>
                        </Modal.Header>
                        <Modal.Body>
                            <p> <b>Sending to Address: </b> {selectedAddress?.address}  </p>
                            <p> <b>Sending: </b> {withdrawCoins} {selectedCurrency?.symbol} </p>
                            <p> <b>Transaction Fee: </b> {withdrawFee?.fee} {selectedCurrency?.symbol} </p>
                            <p> <b>Deducted from your Wallet: </b> {(parseFloat(withdrawCoins) + parseFloat(withdrawFee?.fee)).toPrecision(8)} {selectedCurrency?.symbol} </p>
                            <br />
                            <p> <b className='text-danger'>Warning: </b> We will not be responsible if the coins are sent to a wrong address!!! </p>
                            <div className='d-flex justify-content-right'>
                                <button type="button" className='btn form-btn text-capitalize' onClick={() => { handleWithdraw(); handleCloseConfirmation() }}> YES, Send! </button>
                                <button type="button" className='btn btn-danger text-capitalize ms-2' onClick={() => { handleCloseConfirmation() }}> Cancel </button>
                            </div>
                        </Modal.Body>
                    </Modal>
                </>
            }
        </div>
    )
}

export default Overview