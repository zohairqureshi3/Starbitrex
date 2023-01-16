import React, { useState, useEffect } from "react";
import AddiSvg from "../../assets/images/additional-security.png";
import { useDispatch, useSelector } from 'react-redux';
import { clearOTP, getUser, otpAuth, verifyOTP, verifyTFA } from "../../redux/users/userActions";
import { Button, Modal } from "react-bootstrap";

const Index = () => {

  const dispatch = useDispatch();
  const userData = useSelector(state => state.user?.user);
  const success = useSelector(state => state.user?.authChanged);
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [tfa, setTfa] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // console.log("user data: ", user);

  const [authModal, setAuthModal] = useState(false);
  const handleClose2 = () => setAuthModal(false);
  const handleShow2 = () => setAuthModal(true);

  useEffect(() => {
    const loginUser = localStorage.getItem('uId');
    const uId = JSON.parse(loginUser)
    dispatch(getUser(uId));
    if (success) {
      dispatch(clearOTP())
      handleClose();
      handleClose2();
    }
  }, [success]);

  useEffect(() => {
    setUser(userData);
  }, [userData]);

  const getCode = () => {
    const data = {
      email: email
    }
    dispatch(otpAuth(data));
  }

  const handleSubmit = () => {
    const data = {
      email: email,
      otpCode: otp
    }
    dispatch(verifyOTP(data));
    handleClose()

    // if (user.optCode == otp) {
    //   Swal.fire({
    //     title: 'Success',
    //     text: "Successfully Verified",
    //     icon: 'success',
    //     showCancelButton: false,
    //     confirmButtonText: 'OK',
    //   })
    //   handleClose()
    // } else {
    //   Swal.fire({
    //     title: 'Sorry',
    //     text: "Invalid OTP",
    //     icon: 'warning',
    //     showCancelButton: false,
    //     confirmButtonText: 'OK',
    //   })
    // }
  }

  const verifySecret = () => {
    const data = {
      email: user.email,
      code: tfa
    }
    dispatch(verifyTFA(data));
    setTfa("")
  }

  // console.log("user.otpStatus: ", user.otpStatus);

  return (
    <>
      <section className="header-padding">
        <div className="additional-security">
          <div className="container">
            <h1>
              Additional <span className="light-green-bg">Security</span>
            </h1>
            <div className="auto-lock d-flex align-items-center">
              <div>
                <img src={AddiSvg} alt="" className="img-fluid" />
              </div>
              <div className="auto-lock-content">
                <h2>
                  <span>Auto-Lock</span>
                </h2>
                <p className="text-white-light">information</p>
                <p className="m-0 paraa" style={{ color: "rgba(13, 90, 76, 1)" }}>
                  Backup your wallet to enable this feature
                </p>
                {/* <button className="btn btn-warning" onClick={handleShow}>Enable</button> */}
                <div className="text-success mb-2">Activate / Deactivate Google Authentication</div>
                <button className="btn btn-warning" onClick={handleShow2}>{user?.otpStatus == true ? "Deactivate 2FA" : "Activate 2FA"}</button>
              </div>
            </div>
          </div>
          <div className="batton"></div>
        </div>
      </section>
      {/* OTP functionality */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Enable two factor authentication</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label className="control-label">Email</label>
          <input type="email" className="form-control" onChange={(e) => setEmail(e.target.value)}
            name="email" value={email} placeholder="Enter email" />
          <button type="button" className="btn btn-primary" onClick={getCode}>Get Code</button>
          <br />
          <label className="control-label">OTP Code</label>
          <input type="email" className="form-control" onChange={(e) => setOtp(e.target.value)}
            name="otp" value={otp} placeholder="Enter 6 Digits OTP" />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button variant="primary" onClick={handleSubmit}>Save</Button>
        </Modal.Footer>
      </Modal>

      {/* 2FA Modal */}
      <Modal show={authModal} onHide={handleClose2} className="withdraw-details two-factor-auth" centered backdrop="static">
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
          <h3 className="text-white mb-3">Two factor authentication</h3>
          <div className='mb-4'>
            <img src={user?.qrCode} alt="img" />
          </div>
          <input type="email" className="form-control mb-5" onChange={(e) => setTfa(e.target.value)}
            name="tfa" value={tfa} placeholder="Enter 6 Digits OTP" />
          <div className="limit-modal-btns">
            <button type="button" onClick={handleClose2} className="btn cancel">Cancel</button>
            <button type="button" onClick={verifySecret} className="btn confirm">Confirm</button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Index;
