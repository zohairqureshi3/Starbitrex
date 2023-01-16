import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from 'react-router-dom';
import { faEye, faEyeSlash, faRefresh, faUnlock, faUser } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from "react-redux";
import { LoginUser, resendVerification, updateState } from "../../redux/auth/authActions";
import LOGO from "../../assets/images/STBRX-new-logo-01.png";
import { Modal } from 'react-bootstrap';
import logo from '../../assets/images/STBRX-new-logo-01.png';
import { Row, Col, Nav, Tab } from "react-bootstrap";
import SignUp from '../RegisterStarbitrex';

const Index = () => {

    const dispatch = useDispatch();
    const userData = useSelector((state) => state.auth?.user);
    const needPinCode = useSelector((state) => state.auth?.needPinCode);
    const qrCode = userData?.user?.[0]?.users.qrCode
    const [errors, setErrors] = useState("");
    const [user, setUser] = useState({ email: "", password: "" });
    const [status, setStatus] = useState(0);
    const [view, setView] = useState(0);
    const [message, setMessage] = useState("");
    const [resend, setResend] = useState('');
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [tfa, setTfa] = useState("");
    const [path, setPath] = useState("");

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };
  
    useEffect(() => {
      const pathname = window.location.pathname;
      setPath(pathname);
    }, [window.location.pathname]);

    useEffect(() => {
        if (needPinCode) {
            setShow(true)
            dispatch(updateState());
        }
    }, [needPinCode])

    const handleSubmit = async () => {
        const regexp =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const { email, password } = user;
        if (email == "") {
            setErrors("Please enter email first!");
        } else if (!email.match(regexp)) {
            setErrors("Invalid email!");
        } else if (password == "") {
            setErrors("Password is required!");
        } else {
            setErrors("");
            const data = {
                email: user.email,
                password: user.password,
                pincode: tfa,
                currentBrowser: findBrowser(),
                currentOS: getOperatingSystem()
            };
            dispatch(LoginUser(data));
        }
    };

    useEffect(() => {
        let params = new URLSearchParams(window.location.search);
        if (params.get('status')) {
            if (params.get('status') == '200')
                setStatus(1)
            else
                setStatus(2)
        }
        if (params.get('message')) {
            setMessage(params.get('message'))
        }
        if (params.get('resend')) {
            setResend(params.get('resend'))
        }
        window.history.pushState({}, document.title, window.location.pathname);
    }, [])

    const resendEmail = () => {
        console.log(resend);
        dispatch(resendVerification(resend))
    }

    const verifySecret = () => {
        const data = {
            email: user.email,
            code: tfa
        }
        setTfa("")
        handleSubmit()
    }

    const findBrowser = () => {
        let currentBrowser = 'unknown';
        if ((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1) {
            currentBrowser = 'Opera';
        }
        else if (navigator.userAgent.indexOf("Edg") != -1) {
            currentBrowser = 'Edge';
        }
        else if (navigator.userAgent.indexOf("Chrome") != -1) {
            currentBrowser = 'Chrome';
        }
        else if (navigator.userAgent.indexOf("Safari") != -1) {
            currentBrowser = 'Safari';
        }
        else if (navigator.userAgent.indexOf("Firefox") != -1) {
            currentBrowser = 'Firefox';
        }
        else if ((navigator.userAgent.indexOf("MSIE") != -1) || (!!document.documentMode == true)) //IF IE > 10
        {
            currentBrowser = 'IE';
        }
        return currentBrowser;
    }

    const getOperatingSystem = () => {
        let operatingSystem = 'Not known';
        if (window.navigator.appVersion.indexOf('Win') !== -1) { operatingSystem = 'Windows OS'; }
        else if (window.navigator.appVersion.indexOf('Mac') !== -1) { operatingSystem = 'MacOS'; }
        else if (window.navigator.appVersion.indexOf('X11') !== -1) { operatingSystem = 'UNIX OS'; }
        else if (window.navigator.appVersion.indexOf('Linux') !== -1) { operatingSystem = 'Linux OS'; }

        return operatingSystem;
    }


    const OS = (window) => getOperatingSystem(window);

    return (
        <>
            <section className='login-starbitrex register-starbitrex'>
                {/* <div className='welcomeback-page'>
                    <div className='login-bg'>
                        <Link className="starbitrex-logo" to="/">
                            <img src={LOGO} alt="" className='img-fluid' style={{width:"20%"}} />
                        </Link>
                        {status ?
                            <div className={"bar " + (status == 1 ? "bg-green green-bar-bridth mb-5" : "bg-red")}>
                                <span className="bar-content d-flex justify-content-center align-items-center">
                                    <p className="mb-0">
                                        {message}{"   "}
                                        {resend ?
                                            <button type="button" onClick={() => resendEmail()} className="mt-4 btn form-btn text-capitalize d-block m-auto">
                                                Resend Token
                                            </button>
                                            : ""
                                        }
                                    </p>
                                </span>
                            </div>
                            : ""
                        }
                        <div className='login-bg-container'>
                            {status ?
                                <div className={"bar " + (status == 1 ? "bg-green" : "bg-red")}>
                                    <span className="bar-content d-flex justify-content-center align-items-center">
                                        <p className="mb-0">
                                            {message}{"   "}
                                            {resend ?
                                                <button type="button" onClick={() => resendEmail()} className="btn form-btn text-capitalize d-block m-auto">
                                                    Resend Token
                                                </button>
                                                : ""
                                            }
                                        </p>
                                    </span>
                                </div>
                                : ""
                            }
                            <h1>LOGIN</h1>
                            <div className="password-input-field">
                                <p className='text-white-light'>Enter email </p>
                                <div>
                                    <input type="text" className="text-light" placeholder="Type your email..." name='email' value={user.email} onChange={(e) => handleChange(e)} />
                                </div>
                            </div>
                            <div className="password-input-field">
                                <p className='text-white-light'>Enter Password</p>
                                <div>
                                    <div onClick={() => setView(!view)}><FontAwesomeIcon className='faeye' icon={view ? faEyeSlash : faEye} /></div>
                                    <input type={view ? "text" : "password"} className="text-light" placeholder="Type your password..." name='password' value={user.password} onChange={(e) => handleChange(e)} />
                                </div>
                            </div>
                            {errors ? (
                                <div style={{ color: "#FE6E00" }} className="alert alert-danger">
                                    {" "}
                                    {errors}{" "}
                                </div>
                            ) : (
                                ""
                            )}
                            <div className='text-center'>
                                <button type="button" className="btn enter-btn" onClick={handleSubmit}>
                                    LOGIN
                                </button>
                            </div>
                            <div className="custom-support-icons">
                                <Link to="/register">
                                    <div className='icon'>
                                        <div className='icon-svg'><FontAwesomeIcon icon={faUser} /></div>
                                        <div className="text-white-light">Register</div>
                                    </div>
                                </Link>
                                <Link to="/restore">
                                    <div className='icon'>
                                        <div className='icon-svg'><FontAwesomeIcon icon={faRefresh} /></div>
                                        <div className="text-white-light">Restore</div>
                                    </div>
                                </Link>
                                <div className='icon'>
                                    <div className='icon-svg text-green-bg'><FontAwesomeIcon icon={faUnlock} /></div>
                                    <div className="text-white-light text-green">Login</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}

                <div className="login-section non-active">
                    <div className="image-section">

                    </div>
                    <div className="login-data">
                        <div className=''>
                            {path &&
                            <Tab.Container id="left-tabs-example" defaultActiveKey={path == '/register' ? "second" : "first"}>
                                <Row>
                                    <Col sm={12}>
                                        <Nav variant="pills" className="flex-column">
                                            <Nav.Item>
                                                <Nav.Link eventKey="first">LOGIN</Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link eventKey="second">REGISTER</Nav.Link>
                                            </Nav.Item>
                                        </Nav>
                                    </Col>
                                    <Col sm={12}>
                                        <Tab.Content>
                                            <Tab.Pane eventKey="first">
                                                <div className="abc-1">
                                                    <div className="logo">
                                                        <Link to="/"><img className="img-fluid" src={logo} /></Link>
                                                    </div>
                                                    <form>
                                                        <div className="password-input-field">
                                                            <p className='text-white-light'>Enter Email </p>
                                                            <div>
                                                                <input type="text" className="text-light" placeholder="Type your email..." name='email' value={user.email} onChange={(e) => handleChange(e)} />
                                                            </div>
                                                        </div>
                                                        <div className="password-input-field">
                                                            <p className='text-white-light'>Enter Password</p>
                                                            <div>
                                                                <span onClick={() => setView(!view)}><FontAwesomeIcon className='faeye' icon={view ? faEyeSlash : faEye} /></span>
                                                                <input type={view ? "text" : "password"} className="text-light" placeholder="Type your password..." name='password' value={user.password} onChange={(e) => handleChange(e)} />
                                                            </div>
                                                        </div>
                                                        {errors ? (
                                                            <div style={{ color: "#FE6E00" }} className="alert alert-danger">
                                                                {" "}
                                                                {errors}{" "}
                                                            </div>
                                                        ) : (
                                                            ""
                                                        )}
                                                        <div className='text-center'>
                                                            <button type="button" className="btn enter-btn" onClick={handleSubmit}>
                                                                LOGIN
                                                            </button>
                                                        </div>
                                                        <div className='my-4 text-center'>
                                                            <Link to="/restore">Forget Password</Link>
                                                        </div>
                                                    </form>
                                                </div>
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="second">
                                                <div className="abc">
                                                    <div className="logo">
                                                        <Link to="/"><img className="img-fluid" src={logo} /></Link>
                                                    </div>
                                                    <form>
                                                        <SignUp />
                                                    </form>
                                                </div>
                                            </Tab.Pane>
                                        </Tab.Content>
                                    </Col>
                                </Row>
                            </Tab.Container>}
                        </div>
                    </div>
                </div>




            </section>

            <Modal show={show} onHide={handleClose} className="withdraw-details two-factor-auth" centered backdrop="static">
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <h3 className="text-white mb-3">Two factor authentication</h3>
                    <div className='mb-4'>
                        <img src={qrCode} alt="img" />
                    </div>
                    <input type="email" className="form-control mb-5" onChange={(e) => setTfa(e.target.value)}
                        name="tfa" value={tfa} placeholder="Enter 6 Digits OTP" />
                    <div className="limit-modal-btns">
                        <button type="button" onClick={handleClose} className="btn cancel">Cancel</button>
                        <button type="button" onClick={verifySecret} className="btn confirm">Confirm</button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default Index