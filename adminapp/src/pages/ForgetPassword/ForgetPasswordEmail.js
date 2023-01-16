import React, { useState, useEffect } from "react";
import Header from '../../layout/Header';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';

const ForgetPasswordEmail = (props) => {

   const history = useHistory()
   const dispatch = useDispatch();
   const [email, setEmail] = useState("");

   const handleSubmit = async (e) => {
      e.preventDefault();
   }

   return (
      <>
         <Header />
         <div className="col-lg-12 col-md-12">
            <div className="content-wrapper">
               <div className="content-box auth-box">
                  <h3>User Email</h3>
                  <form>
                     <div className="form-group col-md-12">
                        <label className="control-label">Email</label>
                        <input type="email" required="required" className="form-control" onChange={e => setEmail(e.target.value)}
                           name="email" value={email} placeholder="Enter your email" />
                     </div>
                     <div>
                        <button className="btn-default hvr-bounce-in nav-button me-2" onClick={handleSubmit}>Submit</button>
                     </div>
                     <br />
                  </form>
               </div>
            </div>
         </div>
      </>
   )
}

export default ForgetPasswordEmail
