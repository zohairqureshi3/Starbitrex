import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal } from "react-bootstrap";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Buttons = ({ selectedCurrency, getCoinImg }) => {
  const [show, setShow] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCloseDeposit = () => setShowDeposit(false);
  const handleShowDeposit = () => setShowDeposit(true);

  const handleCloseWithdraw = () => setShowWithdraw(false);
  const handleShowWithdraw = () => setShowWithdraw(true);

  return (
    <>
      <section className="header-padding">
        <div className="crypto-btns">
          <Link to={`/deposit/${selectedCurrency?.symbol}`}>
            <button type="button" className="btn" onClick={handleShowDeposit} style={{ backgroundColor: selectedCurrency?.color }}>
              <h5 style={selectedCurrency?.color == "#FFFFFF" ? { color: "#000000" } : { color: "#FFFFFF" }}>Deposit</h5>
            </button>
          </Link>
          <Link to={`/withdraw-crypto/${selectedCurrency?.symbol}`}>
            <button type="button" className="btn" style={{ backgroundColor: selectedCurrency?.color }}>
              <h5 style={selectedCurrency?.color == "#FFFFFF" ? { color: "#000000" } : { color: "#FFFFFF" }}>Withdrawal</h5>
            </button>
          </Link>
          <Link to={`/exchange/${selectedCurrency?.symbol}`}>
            <button type="button" className="btn" style={{ backgroundColor: selectedCurrency?.color }}>
              <h5 style={selectedCurrency?.color == "#FFFFFF" ? { color: "#000000" } : { color: "#FFFFFF" }}>Exchange</h5>
            </button>
          </Link>
        </div>
      </section>

      <Modal className="withdraw-details" show={showWithdraw} centered backdrop="static" size="xl" onHide={handleCloseWithdraw}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div className="choose-payment-syatem text-center">
            <h2>CHOOSE A PAYMENT SYSTEM</h2>
            <h5 className="text-white-light">information</h5>
            <p className="text-white">payment system here</p>
            <div className="text-center"><button type="button" className="btn withdraw-btn" onClick={handleShow}>WITHDRAW</button></div>
          </div>
        </Modal.Body>
      </Modal>
      <Modal className="receive-crypto crypto-bg-class" show={showDeposit} centered backdrop="static" size="xl" onHide={handleCloseDeposit}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <img src={getCoinImg(selectedCurrency && selectedCurrency?.symbol ? selectedCurrency?.symbol : "#")} alt="" className="img-fluid" />
            <p className="text-white-light">YOUR ADDRESS</p>
            <div className="input-icon"><input type="text" placeholder="information" className="text-white-light" /><FontAwesomeIcon className="text-white-light" icon={faCopy} /></div>
            <p className="text-white-light">QR Code Here</p>
          </div>
        </Modal.Body>
      </Modal>
      <Modal className="crypto-bg-class crypto-success-modal" show={show} centered backdrop="static" size="xl" onHide={handleClose}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <img src={getCoinImg(selectedCurrency && selectedCurrency?.symbol ? selectedCurrency?.symbol : "#")} alt="" className="img-fluid" />
            <h3 className="text-white">The send was successful!</h3>
            <h5 className="text-white">INFORMATION</h5>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Buttons;