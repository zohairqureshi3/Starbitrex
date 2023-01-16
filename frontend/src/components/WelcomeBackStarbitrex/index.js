import React, { useEffect, useState } from "react";
import PIcon from "../../assets/images/passwordhideshow.svg";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LoginUser, resendVerification } from "../../redux/auth/authActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPowerOff, faRefresh, faUser } from '@fortawesome/free-solid-svg-icons';
import LOGO from "../../assets/images/logo171.png";

const Index = () => {

  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth?.user);
  const [errors, setErrors] = useState("");
  const [user, setUser] = useState({ email: localStorage.userInfo ? JSON.parse(localStorage?.userInfo)[0]?.users?.email : "", password: "" });
  const [status, setStatus] = useState(0);
  const [message, setMessage] = useState("");
  const [resend, setResend] = useState('');

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      };
      // console.log(data);
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

  return (
    <>
      {status ?
        <div className={"bar " + (status == 1 ? "bg-green" : "bg-red")}>
          <span className="bar-content d-flex justify-content-center align-items-center">
            <p className="mb-0">
              {message}{"   "}
              {resend ?
                <button type="button" onClick={() => resendEmail()} className="btn form-btn text-capitalize">
                  Resend Token
                </button>
                : ""
              }
            </p>
          </span>
        </div>
        : ""
      }
      <div className="welcomeback-page-container">
        <div className="welcomeback-page">
          <div className="welcomeback">
            <Link className="starbitrex-logo" to="/">
              <img src={LOGO} alt="" className='img-fluid' />
            </Link>
            <h1>Welcome Back</h1>
            <h5 className="text-white-light">starbitrex V22.3.25</h5>
            <div className="password-input-field">
              <div>
                <img src={PIcon} alt="" className="img-fluid text-light" />
                <input type="password" name="password" className="text-light" placeholder="Type your Password..." value={user.password} onChange={handleChange} />
              </div>
              {errors ? (
                <div style={{ color: "#FE6E00" }} className="alert alert-danger">
                  {" "}
                  {errors}{" "}
                </div>
              ) : (
                ""
              )}
            </div>
            {/* <Link to="/portfolio"> */}
            <button type="button" className="btn enter-btn" onClick={handleSubmit}>
              Enter
            </button>
            {/* </Link> */}
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
                <div className='icon-svg'><FontAwesomeIcon icon={faPowerOff} /></div>
                <div className="text-white-light">Quit</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
