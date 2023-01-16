import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import Binance from '../../assets/images/binance.png';
import CoinImg from '../../assets/images/coin-img.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTh, faBars, faAngleRight, faLink, faClone } from '@fortawesome/free-solid-svg-icons';
import { CopyToClipboard } from "react-copy-to-clipboard";
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { getExternalTransactions } from '../../redux/externalTransactions/externalTransactionActions';


const RecentDeposit = () => {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const dispatch = useDispatch();
    const userId = useSelector((state) => state.user?.user?._id);
    const externalTransactions = useSelector((state) => state.externalTransactions?.transactions?.externalTransactions);
    console.log(externalTransactions, "ext");

    useEffect(() => {
        if (userId) {
            dispatch(getExternalTransactions(userId))
        }
    }, [userId])

    const copyReferral = () => {
        Swal.fire(
            'Successfully Copied!'
        )
    }

    return (
        <section className="recent-deposit">
            <div className="container-fluid user-screen">
                <div className="d-flex flex-md-row flex-column justify-content-md-between mb-40 align-items-center">
                    <div className="d-flex align-items-center mb-md-0 mb-3">
                        <h3 className="text-capitalize mb-0">recent deposits</h3>
                        {/* <div className="btn-group ms-5 bar-btn-group " role="group" aria-label="Basic mixed styles example">
                            <button type="button" className="btn btn-bar">
                                <FontAwesomeIcon icon={faTh} />
                                <i className="fa-solid fa-grid"></i>
                            </button>
                            <div className="line"></div>
                            <button type="button" className="btn btn-bar">
                                <FontAwesomeIcon icon={faBars} />
                            </button>
                        </div> */}
                    </div>
                    <div className="inline-block">
                        <a href="" className="btn light-btn">Deposit hasn't arrived? Click here</a>
                    </div>
                </div>
                <div className="deposit-data">
                    <div className="wrap-deposit pe-auto" data-bs-toggle="modal" data-bs-target="#exampleModalthree">
                        <div className="deposit-cmplt mb-30">
                            <div className="deposit-img d-flex align-items-center">
                                <figure className="mb-0">
                                    <img src={Binance} alt="Deposits" className="img-fluid" />
                                </figure>
                                <span className="ms-2 text-capitalize">4000 USDT  </span>
                            </div>
                            <div className="inline-block">
                                <a href="" className="btn green-btn text-capitalize">completed</a>
                            </div>
                        </div>
                        <div className="deposit-info">
                            <div className="row">
                                <div className="col-lg-12">
                                    <ul>
                                        <li>
                                            <div className="d-flex align-items-center"><p className="p2 mb-0">2022-02-02</p><p className="p2 mb-0 ms-2">19:36</p></div>
                                        </li>
                                        <li>
                                            <div className="d-flex align-items-center"><p className="p2 mb-0 gray text-capitalize">Network</p><p className="p2 mb-0 ms-2 text-uppercase">bsc</p></div>
                                        </li>
                                        <li>
                                            <div className="d-flex align-items-center">
                                                <p className="p2 mb-0 gray text-capitalize">Address</p>
                                                <p className="p2 mb-0 ms-2 d-flex align-items-center">
                                                    <span>0xacd26bc24aae55be583e4903ac4e0f2f1d434466</span>
                                                    <FontAwesomeIcon icon={faLink} className='ms-1' />
                                                    <CopyToClipboard text='0xacd26bc24aae55be583e4903ac4e0f2f1d434466' >
                                                        <span className="ms-2">
                                                            <FontAwesomeIcon icon={faClone} onClick={() => copyReferral()} />
                                                        </span>
                                                    </CopyToClipboard>
                                                </p>
                                            </div>
                                        </li>

                                        <li>
                                            <div className="d-flex align-items-center">
                                                <p className="p2 mb-0 gray">TxID</p>
                                                <p className="p2 mb-0 ms-2">
                                                    <span>96408702002</span>
                                                </p>
                                                <p className="p2 mb-0 gray ms-1">Internal</p>
                                                <CopyToClipboard text='96408702002' >
                                                    <span className="ms-2">
                                                        <FontAwesomeIcon icon={faClone} onClick={() => copyReferral()} />
                                                    </span>
                                                </CopyToClipboard>
                                            </div>
                                        </li>

                                        <li>
                                            <div className="d-flex align-items-center">
                                                <p className="p2 mb-0 gray text-capitalize">Deposit Wallet</p>
                                            </div>
                                        </li>
                                        <li>
                                            <a className="ms-lg-3 ms-3 float-lg-none float-end" data-bs-toggle="modal" data-bs-target="#exampleModalthree" onClick={handleShow}>
                                                <FontAwesomeIcon icon={faAngleRight} className="fa text-white right-angle" />
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                {/* <div className="col-lg-1">
                                    <a href="" className="ms-lg-3 ms-3 float-lg-none float-end" data-bs-toggle="modal" data-bs-target="#exampleModalthree">
                                        <FontAwesomeIcon icon={faAngleRight} className="fa text-white right-angle" />
                                    </a>
                                </div> */}
                            </div>

                        </div>
                    </div>
                    <div className="wrap-deposit pe-auto" data-bs-toggle="modal" data-bs-target="#exampleModalthree">
                        <div className="deposit-cmplt mb-30">
                            <div className="deposit-img d-flex align-items-center">
                                <figure className="mb-0">
                                    <img src={Binance} alt="Deposits" className="img-fluid" />
                                </figure>
                                <span className="ms-2 text-capitalize">4000 USDT</span>
                            </div>
                            <div className="inline-block">
                                <a href="" className="btn green-btn text-capitalize">completed</a>
                            </div>
                        </div>
                        <div className="deposit-info">
                            <div className="row">
                                <div className="col-lg-12">
                                    <ul>
                                        <li><div className="d-flex align-items-center"><p className="p2 mb-0">2022-02-02</p><p className="p2 mb-0 ms-2">19:36</p></div></li>
                                        <li><div className="d-flex align-items-center"><p className="p2 mb-0 gray text-capitalize">Network</p><p className="p2 mb-0 ms-2 text-uppercase">bsc</p></div></li>
                                        <li>
                                            <div className="d-flex align-items-center">
                                                <p className="p2 mb-0 gray text-capitalize">Address</p>
                                                <p className="p2 mb-0 ms-2 d-flex align-items-center">0xacd26bc24aae55be583e4903ac4e0f2f1d434466 <FontAwesomeIcon icon={faLink} className='ms-1' />
                                                    <FontAwesomeIcon icon={faClone} className='ms-1' onClick={() => copyReferral()} />
                                                </p>
                                            </div>
                                        </li>
                                        <li><div className="d-flex align-items-center"><p className="p2 mb-0 gray">TxID</p><p className="p2 mb-0 ms-2">96408702002 </p> <p className="p2 mb-0 gray ms-1">Internal</p>
                                            <FontAwesomeIcon icon={faClone} className='ms-1' onClick={() => copyReferral()} />
                                        </div></li>
                                        <li>
                                            <div className="d-flex align-items-center">
                                                <p className="p2 mb-0 gray text-capitalize">Deposit Wallet</p>
                                            </div>
                                        </li>

                                        <li>
                                            <a className="ms-lg-3 ms-3 float-lg-none float-end" data-bs-toggle="modal" data-bs-target="#exampleModalthree" onClick={handleShow}>
                                                <FontAwesomeIcon icon={faAngleRight} className="fa text-white right-angle" />
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                {/* <div className="col-lg-1">
                                    <a href="" className="ms-lg-3 ms-3 float-lg-none float-end" data-bs-toggle="modal" data-bs-target="#exampleModalthree">
                                    <FontAwesomeIcon icon={faAngleRight} className="fa text-white right-angle" />
                                    </a>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <Modal className="modal-wrapper" show={show} onHide={handleClose}>
                <Modal.Header className='modal-main-heading' closeButton>
                    <div className="modal-main-heading-content">
                        <h5 className="modal-title" id="exampleModalLabel">Deposit Details</h5>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div className="deposit-details d-flex justify-content-between align-items-center">
                        <div className="deposit-details-content">
                            <p className="m-0">Status</p>
                        </div>
                        <div className="deposit-details-content-info details-dot d-flex align-items-center">
                            <p className="m-0"> Completed</p>
                        </div>
                    </div>
                    <div className="deposit-details d-flex justify-content-between align-items-center">
                        <div className="deposit-details-content">
                            <p className="m-0">Date</p>
                        </div>
                        <div className="deposit-details-content-info d-flex align-items-center">
                            <p className="m-0"> 2022-02-01 19:36</p>
                        </div>
                    </div>
                    <div className="deposit-details d-flex justify-content-between align-items-center">
                        <div className="deposit-details-content">
                            <p className="m-0">Coin</p>
                        </div>
                        <div className="deposit-details-content-info d-flex align-items-center">
                            <div className="deposit-logo">
                                <img src={CoinImg} className="img-fluid" />
                            </div>
                            <p className="m-0"> USTD</p>
                        </div>
                    </div>
                    <div className="deposit-details d-flex justify-content-between align-items-center">
                        <div className="deposit-details-content">
                            <p className="m-0">Deposit Amount</p>
                        </div>
                        <div className="deposit-details-content-info d-flex align-items-center">
                            <p className="m-0"> 400</p>
                        </div>
                    </div>
                    <div className="deposit-details d-flex justify-content-between align-items-center">
                        <div className="deposit-details-content">
                            <p className="m-0">Network</p>
                        </div>
                        <div className="deposit-details-content-info d-flex align-items-center">
                            <p className="m-0"> BSC</p>
                        </div>
                    </div>
                    <div className="deposit-details d-flex justify-content-between align-items-center">
                        <div className="deposit-details-content">
                            <p className="m-0">Address</p>
                        </div>
                        <div className="deposit-details-content-info d-flex align-items-center">
                            <p className="m-0 text-truncate"> 0xacd26bc24aae55be583e4903ac4e0f2f1d434466</p>
                            <div className="deposit-logo">
                                <FontAwesomeIcon icon={faClone} className='ms-1' onClick={() => copyReferral()} />
                            </div>
                        </div>
                    </div>
                    <div className="deposit-details d-flex justify-content-between align-items-center">
                        <div className="deposit-details-content">
                            <p className="m-0">Note</p>
                        </div>
                        <div className="deposit-details-content-info d-flex align-items-center">
                            <p className="m-0 text-truncate"> 678890009087787 Internal</p>
                            <div className="deposit-logo">
                                <FontAwesomeIcon icon={faClone} className='ms-1' onClick={() => copyReferral()} />
                            </div>
                        </div>
                    </div>
                    <div className="deposit-details d-flex justify-content-between align-items-center">
                        <div className="deposit-details-content">
                            <p className="m-0">Deposit Wallet</p>
                        </div>
                        <div className="deposit-details-content-info d-flex align-items-center">
                            <p className="m-0"> Spot Wallet</p>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>


        </section>
    )
}

export default RecentDeposit