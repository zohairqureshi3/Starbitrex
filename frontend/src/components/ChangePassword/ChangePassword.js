import React, { useEffect, useState } from "react"
import Header from '../Header/Header';
import ProfileSideBar from '../ProfileSideBar/ProfileSideBar';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { changePassword } from "../../redux/users/userActions"
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ENV } from "../../config/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';


const ChangePassword = () => {

  const passChanged = useSelector(state => state.user?.passChanged);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const initialState = { oldPassword: "", password: "", confirmPassword: "" }
  const [state, setState] = useState(initialState);
  const [errors, setErrors] = useState("");
  const [view, setView] = useState(0);
  const [id, setId] = useState("");

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    const { password, confirmPassword, oldPassword } = state
    e.preventDefault();

    if (oldPassword == "") {
      setErrors("Enter your old password!");
    } else if (password == "") {
      setErrors("Enter your new password!");
    } else if (password.length < 6) {
      setErrors("Password selected must have at-least 6 characters!");
    } else if (password == oldPassword) {
      setErrors("Your new password should be different from your old password!");
    } else if (confirmPassword == "") {
      setErrors("Password confirmation is required!");
    } else if (password !== confirmPassword) {
      setErrors("Password do not match!");
    } else {
      const data = {
        oldPassword: oldPassword,
        password: password,
        confirmPassword: confirmPassword
      }
      dispatch(changePassword(id, data))
    }
  }

  useEffect(() => {
    if (passChanged) {
      setState(initialState);
      ENV.logout();
      navigate('/login');
    }
  }, [passChanged])

  useEffect(() => {
    const loginUser = localStorage.getItem('uId');
    const id = JSON.parse(loginUser);
    setId(id);
  }, [])

  return (
    <>
      <section className='user-change-password header-padding'>
        <Row>
          <Col lg={12}>
            
              <div className="text-center bottom-space mb-lg-0 container-fluid">
                <h3 className="text-capitalize mb-5 text-white">Change Password</h3>
              </div>
              <div className="register create-account">
                <div className="banner">
                  <div className="container-fluid">
                    <form className="account-form wrap-account-form m-auto">
                      <div className="input-group buttonInside mb-3">
                        <input
                          type={view ? "text" : "password"} className="form-control"
                          name="oldPassword" value={state.oldPassword}
                          onChange={e => handleChange(e)}
                          placeholder="Enter Current Password"
                          aria-label="Email verification code"
                          aria-describedby="button-addon2"
                        />
                        <div className="eyeicon" onClick={() => setView(!view)}><FontAwesomeIcon className='faeye' icon={view ? faEyeSlash : faEye} /></div>
                      </div>
                      <div className="input-group buttonInside mb-3">
                        <input
                          type={view ? "text" : "password"} className="form-control"
                          name="password" value={state.password}
                          onChange={e => handleChange(e)}
                          placeholder="Enter New Password"
                          aria-label="Email verification code"
                          aria-describedby="button-addon2"
                        />
                        <div className="eyeicon" onClick={() => setView(!view)}><FontAwesomeIcon className='faeye' icon={view ? faEyeSlash : faEye} /></div>
                      </div>
                      <div className="input-group buttonInside mb-3">
                        <input
                          type={view ? "text" : "password"} className="form-control"
                          name="confirmPassword" value={state.confirmPassword}
                          onChange={e => handleChange(e)}
                          placeholder="Enter Confirm Password"
                          aria-label="Email verification code"
                          aria-describedby="button-addon2"
                        />
                        <div className="eyeicon" onClick={() => setView(!view)}><FontAwesomeIcon className='faeye' icon={view ? faEyeSlash : faEye} /></div>
                      </div>
                      {errors ? (
                        <div style={{ color: "#FE6E00", padding: "8px" }} className="alert alert-danger">
                          {errors}
                        </div>
                      ) : ("")
                      }
                      <div className="d-block">
                        {/* <Link to="/account-created" type="submit" className="btn w-100 form-btn text-capitalize">
                          Continue
                        </Link> */}
                        <button className="btn w-100 enter-btn" onClick={(e) => handleSubmit(e)}>Save</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            
          </Col>
        </Row>

      </section>
    </>
  )
}

export default ChangePassword