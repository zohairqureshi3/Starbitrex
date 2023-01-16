import React, { useEffect, useState } from "react"
import { changePassword } from "../../redux/users/userActions"
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { ENV } from "../../config/config";

function ChangePassword(props) {

    const passChanged = useSelector(state => state.users?.passChanged);
    const history = useHistory();
    const dispatch = useDispatch();
    const initialState = { oldPassword: "", password: "", confirmPassword: "" }
    const [state, setState] = useState(initialState);
    const [errors, setErrors] = useState("");
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
            setState(initialState);
        }
    }

    useEffect(() => {
        if (passChanged) {
            ENV.logout();
            history.push("/admin/login");
        }
    }, [passChanged])

    useEffect(() => {
        const loginUser = localStorage.getItem('userId');
        const id = JSON.parse(loginUser);
        setId(id);
    }, [])

    return (
        <>
            {/* <div className="col-lg-9 col-md-8"> */}
                <div className="content-wrapper right-content-wrapper">
                    <div className="content-box">
                        <h3>Change Password</h3>
                        <form>
                            <div className="form-group col-md-12 mb-2">
                                <label className="control-label">Old password</label>

                                <input type="password" className="form-control"
                                    name="oldPassword" value={state.oldPassword}
                                    onChange={e => handleChange(e)}
                                    placeholder="Enter your Password" />
                            </div>
                            <div className="form-group col-md-12 mb-2">
                                <label className="control-label">New password</label>

                                <input type="password" className="form-control"
                                    name="password" value={state.password}
                                    onChange={e => handleChange(e)}
                                    placeholder="Enter your Password" />
                            </div>
                            <div className="form-group col-md-12 mb-3">
                                <label className="control-label">Confirm password</label>

                                <input type="password" className="form-control" onChange={e => handleChange(e)}
                                    name="confirmPassword" value={state.confirmPassword} placeholder="Confirm password" />
                            </div>
                        </form>

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
                            <div>
                                <button className="btn-default btn" onClick={(e) => handleSubmit(e)}>Save</button>
                            </div>
                        </div>
                    </div>
                </div>

            {/* </div> */}
        </>
    )
}

export default ChangePassword
