import React, { useState } from "react"
import Header from '../../layout/Header';
import { resetPassword } from "../../utilities/constant";
import ToastNotification from '../../components/Toast'

function ForgetPassword(props) {
    const [state, setState] = useState({ newPassword: '', confirmPassword: '' })

    const handleChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
     }

    return (
        <>
        <Header />
         <div className="col-lg-12 col-md-12">
            <div className="content-wrapper">
               <div className="content-box auth-box">
                  <h3>Forget Password</h3>
                  <form>
                     <div className="form-group col-md-12">
                        <label className="control-label">New Password</label>
                        <input type="password" required="required" className="form-control" onChange={handleChange}
                           name="newPassword" value={state.password} placeholder="Enter new password" />
                     </div>
                     <div className="form-group col-md-12">
                        <label className="control-label">Confirm New Password</label>
                        <input type="password" required="required" className="form-control" onChange={handleChange}
                           name="confirmPassword" value={state.password} placeholder="Enter confirm password" />
                     </div>
                     <div>
                        <button className="btn-default hvr-bounce-in nav-button" onClick={handleSubmit}>Save</button>
                     </div>
                  </form>
               </div>
            </div>
         </div>
      </>
    )
}

export default ForgetPassword
