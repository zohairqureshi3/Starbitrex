import React from "react";
import FotoCon from "../../assets/images/foto-con.svg";
import FotoCon2 from "../../assets/images/foto-con2.svg";
import FotoText from "../../assets/images/foto-text.svg";

const Index = () => {
  return (
    <>
      <section className="header-padding">
        <div className="connect-devices">
          <div className="container">
            <h1 style={{ fontWeight: "300" }}>Connect Your Devices</h1>
            <div className="connect mb-4">
              <div className="content-and-box">
                <div className="icon-shade">
                  <div>
                    <img
                      style={{ width: "55px" }}
                      src={FotoText}
                      alt=""
                      className="img-fluid"
                    />
                  </div>
                </div>
                <div className="content">
                  <h2>Your text </h2>
                  <h5 className="text-white">Instructions</h5>
                </div>
              </div>
              <div>
                <button type="button" className="btn connect-device-btn">
                  Sync
                </button>
              </div>
            </div>
            <div className="connect">
              <div className="content-and-box">
                <div className="icon-shade">
                  <div className="icon">
                    <img src={FotoCon} alt="" className="img-fluid" />
                  </div>
                  <div className="icon2">
                    <div>
                      <img
                        style={{ width: "55px" }}
                        src={FotoText}
                        alt=""
                        className="img-fluid mb-2"
                      />
                    </div>
                    <div>
                      <img
                        style={{ width: "40px" }}
                        src={FotoCon2}
                        alt=""
                        className="img-fluid"
                      />
                    </div>
                  </div>
                </div>
                <div className="content">
                  <h2>Your text </h2>
                  <h5 className="text-white">Instructions</h5>
                </div>
              </div>
              <div>
                <button type="button" className="btn connect-device-btn">
                  Install Now
                </button>
              </div>
            </div>
          </div>
          <div className="batton connect-device"></div>
        </div>
      </section>
    </>
  );
};

export default Index;
