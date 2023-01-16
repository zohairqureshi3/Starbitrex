import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from 'react-router-dom';
import { faRefresh, faUnlock, faUser, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword } from '../../redux/auth/authActions';
import logo from '../../assets/images/STBRX-new-logo-01.png';

const Index = (props) => {

    const dispatch = useDispatch();
    const [phase, setPhase] = useState(1);
    const [email, setEmail] = useState('');
    const [timer, setTimer] = useState(0);
    const [resent, setResent] = useState(0);
    const [errors, setErrors] = useState("");

    const handleSubmit = async () => {
        setErrors("");

        const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (email == "") {
            setErrors("Email address is required!");
        } else if (!email.match(regexp)) {
            setErrors("Invalid email address!");
        }
        else {
            console.log('email', email);
            if (await dispatch(forgotPassword(email))) {
                setPhase(2)
            }
            else {
                setErrors("The email address " + email + " is not associated with any account. Double-check your email address and try again.")
            }

        }
    }

    useEffect(() => {
        if (phase == 2) {
            setTimer(59)
        }
    }, [phase, resent])

    useEffect(() => {
        let myInterval = setInterval(() => {
            if (timer > 0) {
                setTimer(timer - 1);
            }
            if (timer == 0) {
                clearInterval(myInterval)
            }
        }, 1000)
        return () => {
            clearInterval(myInterval);
        };
    }, [timer])

    return (
        <>
            <section className='login-starbitrex register-starbitrex'>
                {/* <div className='welcomeback-page'>
                    <div className='login-bg'>
                        <Link className="starbitrex-logo" to="/">
                            <img src={LOGO} alt="" className='img-fluid' style={{width:"20%"}} />
                        </Link>
                        <div className='login-bg-container'>
                            <h1>RESTORE</h1>
                            <div className="password-input-field">
                                {phase == 1 ?
                                    <p className='text-white-light'>Email</p>
                                    :
                                    <>
                                        <p className='text-white-light m-0'>Email Sent</p>
                                        <span className='text-white-light' style={{ fontSize: "10px" }}>Please check the email sent to </span>
                                    </>
                                }
                                <div>
                                    <input type="text" className="text-light" placeholder="Type your email..." disabled={timer == 0 ? 0 : 1} value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                                {phase == 2 ?
                                    <div className='restore-timer'>
                                        <span className='text-white-light'><FontAwesomeIcon className='text-white-light me-1' icon={faQuestionCircle} />Didn't receive email</span>
                                        <span className='text-white-light'>00:{timer < 10 ? `0${timer}` : timer}
                                            <span onClick={() => { if (timer == 0) handleSubmit() }} className={timer == 0 ? 'text-green ms-1' : 'ms-1'} style={{ cursor: 'pointer' }} >
                                                Resend
                                            </span>
                                        </span>
                                    </div>
                                    : null
                                }
                            </div>
                            {errors ? (
                                <div style={{ color: "#FE6E00" }} className="alert alert-danger"> {errors} </div>
                            ) :
                                ("")
                            }
                            <div className='text-center'>
                                <button type="button" className="btn enter-btn" disabled={timer == 0 ? 0 : 1} onClick={() => { if (timer == 0) handleSubmit(); if (phase == 2) setResent(!resent) }}>
                                    {phase == 1 ? "ENTER" : "RESEND"}
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
                                    <div className='icon-svg text-green-bg'><FontAwesomeIcon icon={faRefresh} /></div>
                                    <div className="text-white-light text-green">Restore</div>
                                </div>
                                </Link>
                                <Link to="/login">
                                    <div className='icon'>
                                        <div className='icon-svg'><FontAwesomeIcon icon={faUnlock} /></div>
                                        <div className="text-white-light">Login</div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div> */}

                <div className="login-section">
                    <div className="image-section">

                    </div>
                    <div className="login-data">
                        <div className='abc-2'>
                            <div className="logo">
                                <Link to="/"><img className="img-fluid" src={logo} /></Link>
                            </div>
                            <form>
                                <div className="password-input-field">
                                    {phase == 1 ?
                                        <p className='text-white-light'>Email</p>
                                        :
                                        <>
                                            <p className='text-white-light m-0'>Email Sent</p>
                                            <span className='text-white-light' style={{ fontSize: "10px" }}>Please check the email sent to </span>
                                        </>
                                    }
                                    <div>
                                        <input type="text" className="text-light" placeholder="Type your email..." disabled={timer == 0 ? 0 : 1} value={email} onChange={(e) => setEmail(e.target.value)} />
                                    </div>
                                    {phase == 2 ?
                                        <div className='restore-timer'>
                                            <span className='text-white-light'><FontAwesomeIcon className='text-white-light me-1' icon={faQuestionCircle} />Didn't receive email</span>
                                            <span className='text-white-light'>00:{timer < 10 ? `0${timer}` : timer}
                                                <span onClick={() => { if (timer == 0) handleSubmit() }} className={timer == 0 ? 'text-green ms-1' : 'ms-1'} style={{ cursor: 'pointer' }} >
                                                    Resend
                                                </span>
                                            </span>
                                        </div>
                                        : null
                                    }
                                </div>
                                {errors ? (
                                    <div style={{ color: "#FE6E00" }} className="alert alert-danger"> {errors} </div>
                                ) :
                                    ("")
                                }
                                <div className='text-center'>
                                    <button type="button" className="btn enter-btn" disabled={timer == 0 ? 0 : 1} onClick={() => { if (timer == 0) handleSubmit(); if (phase == 2) setResent(!resent) }}>
                                        {phase == 1 ? "SEND EMAIL" : "RESEND"}
                                    </button>
                                </div>
                                <div className='my-4 text-center'>
                                    <Link to="/login">Login Page</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Index