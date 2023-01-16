import React from "react";
import { Link } from "react-router-dom";
import ZZZ from "../../assets/images/reset-password.svg";
import SecuritySVG from "../../assets/images/security-phrase.svg";

const Index = () => {
  return (
    <>
      <section className="header-padding">
        <div className="backup-complete">
          <div className="page-content">
            <h1>BACKUP COMPLETE</h1>
            {/* <h3 className="text-white-light">TEXT</h3> */}
          </div>
          <div className="backup-options">
            <div className="option">
              <img src={ZZZ} alt="" className="img-fluid mb-5" />
              <p className="text-white mb-4">
                Securely manage over 100 cryptocurrencies. Your funds are always
                under your control.
              </p>
              <Link to="/change-password">
                <button type="button" className="btn">
                  RESET PASSWORD
                </button>
              </Link>
            </div>
            <div className="option">
              <img src={SecuritySVG} alt="" className="img-fluid mb-5" />
              <p className="text-white mb-4">
                Quickly restore access to your wallet with your secret 12-word
                recovery phrase.
              </p>
              <button type="button" className="btn">
                VIEW SECRET PHRASE
              </button>
            </div>
          </div>
          <div className="batton"></div>
        </div>
      </section>
    </>
  );
};

export default Index;
