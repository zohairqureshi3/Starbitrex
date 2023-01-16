import React, { useEffect, useState } from "react"
import { forgetPassword } from "../../redux/users/userActions"
import { useDispatch } from 'react-redux';

function ForgetPasswords(props) {
    const dispatch = useDispatch();
    let initialState = { password: "", confirmPassword: "", token: "" }
    const [state, setState] = useState(initialState)

    const [errors, setErrors] = useState("")

    useEffect(() => {
        let token = props.match.params.token
        setState({ token: token })
    }, [])

    const handleChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value })
    }
    const handleSubmit = async (e) => {
        const { password, confirmPassword, token } = state
        e.preventDefault();

        if (password == "") {
            setErrors("Password is required!");
        } else if (password.length < 6) {
            setErrors("Password must have at-least 6 characters!");
        } else if (confirmPassword == "") {
            setErrors("Password confirmation is required!");
        } else if (password !== confirmPassword) {
            setErrors("Password do not match!");
        } else {
            const data = {
                password: password,
                confirmPassword: confirmPassword,
                token: token
            }
            dispatch(forgetPassword(data))
        }

    }




    return (
        <>
            <div className="col-lg-9 col-md-8">
                <div className="content-wrapper">
                    <div className="content-box">
                        <h3>Forget Password</h3>
                        <form>
                            <div className="form-group col-md-12">
                                <label className="control-label">Password</label>

                                <input type="password" className="form-control"
                                    name="password" value={state.password}
                                    onChange={e => handleChange(e)}
                                    placeholder="Enter your Password" />
                            </div>
                            <div className="form-group col-md-12">
                                <label className="control-label">Confrm password</label>

                                <input type="password" className="form-control" onChange={e => handleChange(e)}
                                    name="confirmPassword" value={state.confirmPassword} placeholder="Confirm password" />
                            </div>
                        </form>

                        <div className="row">
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
                            <div className="col-md-6">
                                <button className="btn-default hvr-bounce-in nav-button" onClick={(e) => handleSubmit(e)}>Submit</button>

                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default ForgetPasswords
