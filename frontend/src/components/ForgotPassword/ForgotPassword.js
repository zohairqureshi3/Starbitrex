import React from "react";
import Header from "../Header/Header";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  return (
    <>
      <section className="account-login forgot-password account-bg">
        <div className="text-center bottom-space mb-lg-0 container-fluid custom-box">
          <h3 className="text-capitalize mb-lg-3">Reset Your Password</h3>
        </div>
        <div className=" register create-account">
          <div className="banner">
            <div className="container-fluid custom-box">
              <form className="account-form wrap-account-form m-auto">
                <div>
                  <div className="input-group buttonInside mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Your Email"
                      aria-label="Email verification code"
                      aria-describedby="button-addon2"
                    />
                  </div>
                </div>
                <div className="d-block">
                  <Link
                    to="/account-created"
                    type="submit"
                    className="btn w-100 form-btn text-capitalize"
                  >
                    Continue
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ForgotPassword;
