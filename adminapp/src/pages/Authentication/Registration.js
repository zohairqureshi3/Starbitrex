import React, { useState, useEffect } from "react";
import { Register } from "../../utilities/constant";
import ToastNotification from '../../components/Toast';
import Header from '../../layout/Header';
import { useDispatch } from 'react-redux';
import { RegisterUser } from "../../redux/auth/authActions";
import { ENV } from "../../config/config"
const RegisterPage = () => {

    const dispatch = useDispatch();
    const initialUserState = { firstName: "", lastName: "", username: "", email: "", password: "" };
    const [user, setUser] = useState(initialUserState);
    const [errors, setErrors] = useState("")
    const [code, setCode] = useState("");
    const [refsCount, setRefCount] = useState("")
    useEffect(() => {
        let inviteCode = JSON.parse(localStorage.getItem("code"))
        let refCount = JSON.parse(localStorage.getItem("refCount"))

        setCode(inviteCode)
        setRefCount(refCount ? refCount : 0)
    }, [])

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value })
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { firstName, lastName, username, email, password } = user;
        const exp = /^[a-z A-Z]+$/;
        const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (firstName == "") {
            setErrors("Firstname is required!");
        } else if (!firstName.match(exp)) {
            setErrors("Invalid firstname (Only letters a-z allowed)!");
        } else if (lastName == "") {
            setErrors("Lastname is required!");
        } else if (!lastName.match(exp)) {
            setErrors("Invalid lastname (Only letters a-z allowed)!");
        } else if (username == "") {
            setErrors("Username is required!");
        } else if (email == "") {
            setErrors("Email address is required!");
        } else if (!email.match(regexp)) {
            setErrors("Invalid email address!");
        } else if (password == "") {
            setErrors("Password is required!");
        } else if (password.length < 5) {
            setErrors(
                "Password must have at-least 6 characters!",
            );
        } else {
            setErrors("");
            const data = {
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
                role: user.role,
                password: user.password,
                refererId: code,
                refCount: refsCount
            }
            dispatch(RegisterUser(data));
            // clearData();
        }
    }

    const clearData = () => {
        setUser(initialUserState)
    }
    return (
        <>
            <Header />
            <div className="col-lg-12 col-md-12">
                <div className="content-wrapper">
                    <div className="content-box auth-box">
                        <h3>Register User</h3>
                        <form>
                            <div className="form-group col-md-12">
                                <label className="control-label">First Name</label>
                                <input type="text" className="form-control" onChange={handleChange}
                                    name="firstName" value={user.firstName} placeholder="Enter first name" />
                            </div>
                            <div className="form-group col-md-12">
                                <label className="control-label">Last Name</label>
                                <input type="text" className="form-control" onChange={handleChange}
                                    name="lastName" value={user.lastName} placeholder="Enter last name" />
                            </div>
                            <div className="form-group col-md-12">
                                <label className="control-label">User Name</label>
                                <input type="text" className="form-control" onChange={handleChange}
                                    name="username" value={user.username} placeholder="Enter username" />
                            </div>
                            <div className="form-group col-md-12">
                                <label className="control-label">Email</label>
                                <input type="email" className="form-control" onChange={handleChange}
                                    name="email" value={user.email} placeholder="Enter email" />
                            </div>
                            <div className="form-group col-md-12">
                                <label className="control-label">Password</label>
                                <input type="password" className="form-control" onChange={handleChange}
                                    name="password" value={user.password} placeholder="Enter password" />
                            </div>
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
                            <div>
                                <button type="button" className="btn-default hvr-bounce-in nav-button" onClick={(e) => handleSubmit(e)}>Save</button>
                                <button type="button" className="btn-default hvr-bounce-in nav-button" onClick={clearData}>Clear</button>
                            </div >
                            <br />
                        </form >
                    </div >
                </div >
            </div >
            {/* <ToastNotification setOpenNotification={setOpenNotification} msg={errorMsg} open={openNotification} success={successMsg} /> */}
        </>
    )
}

export default RegisterPage
