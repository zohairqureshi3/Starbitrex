import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import { getNetwork } from '../../redux/networks/networkActions';
import EXC from '../../assets/images/exchange-svg-icon.svg';
import { getCurrency } from '../../redux/currencies/currencyActions';
import { clearTransfer, getAccount, transferAmounts } from '../../redux/account/accountActions';
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
import FullPageLoader from '../FullPageLoader/fullPageLoader';
import { toast } from 'react-toastify';

function WalletTransfer({ currencies }) {

      const [showWalletTransfer, setShowWalletTransfer] = useState(false);
      const [from, setFrom] = useState(null); // 1= Spot, 2= Futures
      const [to, setTo] = useState(null); // 1= Spot, 2= Futures
      const [selectedCurrency, setSelectedCurrency] = useState("");
      const [haveAmount, setHaveAmount] = useState(0);
      const [amount, setAmount] = useState(0);
      const [loader, setLoader] = useState(false);
      const [amountType, setAmountType] = useState('min');

      const handleClose = () => setShowWalletTransfer(false);
      const handleShow = () => setShowWalletTransfer(true);

      const dispatch = useDispatch();
      const amounts = useSelector((state) => state.accounts?.account?.amounts);
      const currencyData = useSelector((state) => state.currency?.currencies?.allCurrencies);
      const userId = useSelector((state) => state.user?.user?._id);
      const success = useSelector((state) => state.accounts?.success);
      const amountTransferred = useSelector((state) => state.accounts?.amountTransferred);

      useEffect(() => {
            dispatch(getNetwork());
      }, []);

      useEffect(() => {
            dispatch(getCurrency());
            if (userId) dispatch(getAccount(userId));
      }, [userId]);

      useEffect(() => {
            if (amountTransferred) {
                  setLoader(false)
                  setSelectedCurrency("")
                  setAmount(0)
                  setHaveAmount(0)
                  handleClose()
            }
      }, [amountTransferred]);

      useEffect(() => {
            if (currencyData?.length > 0 && amounts?.length > 0) {
                  const defCurrency = currencyData?.find(cur => cur?.symbol == 'USDT');
                  setSelectedCurrency(defCurrency);
                  setHaveAmount(from == 1 ? amounts?.find((row) => row.currencyId == defCurrency._id).amount : amounts?.find((row) => row.currencyId == defCurrency._id).futures_amount);
            }
      }, [currencyData, amounts]);

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
      const userCoinChange = (currency) => {
            setSelectedCurrency(currency);
            setHaveAmount(from == 1 ? amounts?.find((row) => row.currencyId == currency._id).amount : amounts?.find((row) => row.currencyId == currency._id).futures_amount);
      };

      const exchange = () => {
            if (selectedCurrency && selectedCurrency._id)
                  setHaveAmount(to == 1 ? amounts?.find((row) => row.currencyId == selectedCurrency._id).amount : amounts?.find((row) => row.currencyId == selectedCurrency._id).futures_amount);
            let temp = from;
            setFrom(to);
            setTo(temp);
      }

      const handleTransfer = () => {
            let data = {
                  userId: userId,
                  currencyId: selectedCurrency._id,
                  to: to,
                  from: from,
                  amount: parseFloat(amount).toFixed(4)
            }
            dispatch(transferAmounts(data))
            setLoader(true)
      }

      return (
            <>
                  {loader ? <FullPageLoader /> :
                        <>
                              <p style={{ color: "rgba(18, 138, 116, 1)", cursor: "pointer" }} onClick={handleShow}>
                                    Transfer Assets
                              </p>

                              {/* ================================== Transfer Modal ====================== */}

                              <Modal className="transfer-modal" show={showWalletTransfer} onHide={handleClose} centered backdrop="static" size="xl">
                                    <Modal.Header closeButton></Modal.Header>
                                    <Modal.Body>
                                          <div className="transfer-modal-content text-center">
                                                <h4 className='text-white'>Transfer</h4>
                                                <div className='input-text-dropdown mb-2'>
                                                      <p className='m-0 text-white-light'>From</p>
                                                      <div className="dropdown">
                                                            <button className="btn dropdown-toggle text-white-light" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                                                  {from ? (from == 1 ? "Spot" : "Funding") : "Select"}
                                                            </button>
                                                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                                                  {from !== 1 ?
                                                                        <li onClick={() => setFrom(2)}><a className="dropdown-item">Funding</a></li>
                                                                        : null
                                                                  }
                                                                  {from !== 2 ?
                                                                        <li onClick={() => setFrom(1)}><a className="dropdown-item">Spot</a></li>
                                                                        : null
                                                                  }
                                                            </ul>
                                                      </div>
                                                </div>
                                                <div className="text-center" style={{ marginTop: "-7px" }}>
                                                      <img style={{ width: "30px" }} src={EXC} className='img-fluid' alt='' onClick={() => { if (from && to) exchange() }} />
                                                </div>
                                                <div className='input-text-dropdown mb-2'>
                                                      <p className='m-0 text-white-light'>To</p>
                                                      <div className="dropdown">
                                                            <button className="btn dropdown-toggle text-white-light" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                                                  {to ? (to == 1 ? "Spot" : "Funding") : "Select"}
                                                            </button>
                                                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                                                  {from !== 2 ?
                                                                        <li onClick={() => setTo(2)}><a className="dropdown-item">Funding</a></li>
                                                                        : null
                                                                  }
                                                                  {from !== 1 ?
                                                                        <li onClick={() => setTo(1)}><a className="dropdown-item">Spot</a></li>
                                                                        : null
                                                                  }
                                                            </ul>
                                                      </div>
                                                </div>
                                                <hr className='modal-hr-line mb-0' />
                                                <div className='con-heading-dropdown'>
                                                      <h5 className='text-white m-0'>Coin</h5>
                                                      <div className="dropdown transfer-modal-coin-dd">
                                                            <button className="btn text-white dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                                                  <div className='coin-name-img d-flex align-items-center'>
                                                                        <img style={{ width: "35px" }} src={getCoinImg(selectedCurrency?.symbol)} className="img-fluid" alt='' />
                                                                        <p className='mb-0 ms-2'>{selectedCurrency?.name}</p>
                                                                  </div>
                                                                  <div className='coin-symbol'>
                                                                        <p className='mb-0'>{selectedCurrency?.symbol}</p>
                                                                  </div>
                                                            </button>
                                                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                                                  {currencyData && currencyData.length > 0 && currencyData.map((currency) => (
                                                                        <li>
                                                                              <a className="dropdown-item" onClick={() => { userCoinChange(currency) }}>
                                                                                    <img src={getCoinImg(currency?.symbol)} alt="" className="img-fluid coin-img pe-1" />
                                                                                    {currency.name}
                                                                              </a>
                                                                        </li>
                                                                  ))}
                                                            </ul>
                                                      </div>
                                                </div>
                                                <div className='d-flex justify-content-between'>
                                                      <p className='text-white-light'>Amount</p>
                                                      <p className='text-white-light'>{haveAmount} available</p>
                                                </div>
                                                <input type="text" className='mb-2 ps-3 pe-3' value={amount} onChange={(e) => setAmount(e.target.value)} />
                                                <div className="min-half-max-btns">
                                                      <button type="button" className={`btn ${amountType === 'min' ? 'text-green' : ''}`} onClick={() => { setAmount(haveAmount > 0 ? parseFloat(selectedCurrency?.minAmount).toFixed(4) : 0); setAmountType('min'); }}>
                                                            MIN
                                                      </button>
                                                      <button type="button" className={`btn ${amountType === 'half' ? 'text-green' : ''}`} onClick={() => { setAmount(haveAmount > 0 ? (parseFloat(haveAmount) / 2).toFixed(4) : 0); setAmountType('half'); }}>
                                                            HALF
                                                      </button>
                                                      <button type="button" className={`btn ${amountType === 'max' ? 'text-green' : ''}`} onClick={() => { setAmount(haveAmount > 0 ? parseFloat(haveAmount).toFixed(4) : 0); setAmountType('max'); }}>
                                                            MAX
                                                      </button>
                                                </div>
                                                <button type="button" className="btn confirm-btn" onClick={() => handleTransfer()} disabled={!(to && from && selectedCurrency && (parseFloat(amount) >= parseFloat(selectedCurrency?.minAmount)) && (parseFloat(amount) <= parseFloat(haveAmount)))}>
                                                      Confirm
                                                </button>
                                          </div>
                                    </Modal.Body>
                              </Modal>
                        </>
                  }
            </>
      )
}

export default WalletTransfer