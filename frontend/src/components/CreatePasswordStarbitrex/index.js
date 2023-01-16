import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import UnlockWalletSvg from "../../assets/images/unlock-wallet.svg";
import SecretPhraseSvg from "../../assets/images/secret-phrase.svg";
import SecretPhraseSvg2 from "../../assets/images/secret-phrase2.svg";

const Index = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <div className="createpassword-starbitrex">
        <div className="steps">
          <div className="step">
            <span className="m-0 text-white">1</span>
          </div>
          <div className="step-line-border"></div>
          <div className="step">
            <span className="m-0 text-white">2</span>
          </div>
          <div className="step-line-border"></div>
          <div className="step">
            <span className="m-0 text-white">3</span>
          </div>
          <div className="step-line-border"></div>
          <div className="step">
            <span className="m-0 text-white">4</span>
          </div>
        </div>
        <div className="page-content">
          <h1 style={{ fontWeight: "700" }}>Create your password</h1>
          <h1>information</h1>
          <div className="type-password">
            <input type="password" placeholder="Type your password..." />
          </div>
          <button type="button" onClick={handleShow} className="btn next-btn">
            Next
          </button>
        </div>
      </div>

      {/* ====================================== modal ======================= */}

      {/* secret phase modal */}
      {/* <Modal size='lg' show={show} backdrop="static" centered onHide={handleClose} className="secret-phrase backup-modals">
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
            <img src={SecretPhraseSvg} alt="" className='img-fluid' />
            <h2>SHOW SECRET PHRASE?</h2>
            <p className='text-white-light'>information</p>
            <div className='checkbox-div'><input type="checkbox" className='custom-checkbox' /></div>
            <div className='back-next-btns'>
                <button type="button" className="btn next-btn back-btn">Back</button>
                <button type="button" className="btn next-btn">Next</button>
            </div>
        </Modal.Body>
      </Modal> */}
      {/* ====================== end ==================== */}

      {/* unlock wallet modal */}
      <Modal
        show={show}
        backdrop="static"
        centered
        onHide={handleClose}
        className="unlock-wallet backup-modals"
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <img src={UnlockWalletSvg} alt="" className="img-fluid" />
          <h2>Unlock Your Wallet</h2>
          <div>
            <input type="password" placeholder="Type your password..." />
          </div>
          <div>
            <button type="button" className="btn next-btn">
              Next
            </button>
          </div>
        </Modal.Body>
      </Modal>
      {/* ================== end ========= */}

      {/* secret phase modal 2 */}
      {/* <Modal size='lg' show={show} backdrop="static" centered onHide={handleClose} className="secret-phrase2 secret-phrase backup-modals">
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
            <img src={SecretPhraseSvg2} alt="" className='img-fluid' />
            <h2>SHOW SECRET PHRASE?</h2>
            <p className='text-white-light'>information</p>
            <div className='checkbox-div'><input type="checkbox" className='custom-checkbox' /></div>
            <div className='back-next-btns'>
                <button type="button" className="btn next-btn back-btn">Back</button>
                <button type="button" className="btn next-btn">Next</button>
            </div>
        </Modal.Body>
      </Modal> */}
      {/* ====================== end ==================== */}
    </>
  );
};

export default Index;
