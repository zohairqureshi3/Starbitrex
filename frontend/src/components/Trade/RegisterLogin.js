import React from 'react'
import { Link } from 'react-router-dom'

const RegisterLogin = ({ submit, disabled }) => {

   const token = localStorage.getItem('uToken');

   return (
      <>
         {token ?
            <Link to="#">
               <button type="button" className="mb-2 register-now" onClick={() => submit()} disabled={disabled}>
                  Order Trade
               </button>
            </Link>
            :
            <>
               <Link to="/register">
                  <button type="button" className="mb-2 register-now">
                     Register Now
                  </button>
               </Link>
               <Link to="/login">
                  <button type="button" className="login-now">
                     Log In
                  </button>
               </Link>
            </>
         }
      </>
   )
}

export default RegisterLogin