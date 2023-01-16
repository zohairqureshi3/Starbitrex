import React, { useState } from "react"
import { forgetPassEmail } from "../../redux/users/userActions"
import { useDispatch } from 'react-redux';
import Header from "../../layout/Header";
import { Link } from "react-router-dom";
import logo from '../../assets/images/STBRX-new-logo-01.png';

function ForgetPassEmail(props) {
    const dispatch = useDispatch();

    const [email, setEmail] = useState("")
    const [errors, setErrors] = useState("")


    const handleSubmit = async (e) => {
        e.preventDefault();
        const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (email == "") {
            setErrors("Email address is required!");
        } else if (!email.match(regexp)) {
            setErrors("Invalid email address!");
        } else {
            const data = {
                email: email
            }
            dispatch(forgetPassEmail(data))
        }

    }




    return (
        <>
            {/* <Header /> */}
            <div className="col-lg-12 col-md-12 forgot-password p-0">
                <div className="content-wrapper">
                    {/* <div className="content-box"> */}
                    {/* <h3 className="text-center mb-4">Forget Password Email</h3>
                    <div className="form-group col-md-12 pt-2">
                        <input type="email" className="form-control mb-2" onChange={e => setEmail(e.target.value)}
                            name="role" value={email} placeholder="Enter your email" />
                    </div>
                    <div>
                        {errors ? (
                            <div
                                style={{ color: "#FE6E00" }}
                                className="alert alert-danger"
                            >
                                {errors}
                            </div>
                        ) : (
                            ""
                        )}

                        <button style={{ width: "100%" }} className="btn-default btn mt-3" onClick={(e) => handleSubmit(e)}>Send Email</button>
                    </div>
                    <br />
                    <div className="text-center">
                        <Link to='/admin/login'>Login Page</Link>
                    </div>
                    <br /> */}
                    {/* </div> */}
                    {/* </div> */}


                    <div className="login-section">
                        <div className="image-section">

                        </div>
                        <div className="login-data">
                            <div className="logo">
                                <Link to="/admin"><img className="img-fluid" src={logo} /></Link>
                            </div>
                            <h3 className="text-center mb-4">Forget Password Email</h3>
                            <div className="form-group col-md-12 pt-2">
                                <label className="control-label mb-2">Email</label>
                                <input type="email" className="form-control mb-2" onChange={e => setEmail(e.target.value)}
                                    name="role" value={email} placeholder="Enter your email" />
                            </div>
                            <div>
                                {errors ? (
                                    <div
                                        style={{ color: "#FE6E00" }}
                                        className="alert alert-danger"
                                    >
                                        {errors}
                                    </div>
                                ) : (
                                    ""
                                )}

                                <button className="btn-default w-100 btn mt-3" onClick={(e) => handleSubmit(e)}>Send Email</button>
                            </div>
                            <br />
                            <div className="text-center">
                                <Link to='/admin/login'>Login Page</Link>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </>
    )
}

export default ForgetPassEmail
