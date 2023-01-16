import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import DI from '../../assets/images/dot-icon.svg';
import BTC from '../../assets/images/bitcoin.svg';

const Index = () => {
  return (
    <>
      <section className="assets-starbitrex header-padding">
        <div className="container-fluid padding50 assets-starbitrex-container">
          <h1>Enable/Disable Asset</h1>
          <div className="paras">
            <p>
              Enable/Disable Asset Enable/Disable Asset Enable/Disable
              AssetEnable/Disable Asset
            </p>
            <p>
              Enable/Disable AssetEnable/Disable AssetEnable/Disable
              AssetEnable/Disable Asset
            </p>
            <p>Enable/Disable AssetEnable/Disable AssetEnable/Disable Asset</p>
            <p>Enable/Disable AssetEnable/Disable Asset</p>
          </div>
          <div className="assets-dropdown">
            <div className="search-input">
              <FontAwesomeIcon icon={faSearch} className="search" />
              <input type="search" placeholder="Search for assets..." />
            </div>
            <div className="d-flex">
              <div className="dropdown show-all-dd all-assets-dd">
                <button
                  className="btn text-white dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Show All
                </button>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                  <li>
                    <a className="dropdown-item" >Action</a>
                  </li>
                  <li>
                    <a className="dropdown-item" >Another action</a>
                  </li>
                  <li>
                    <a className="dropdown-item" >Something else here</a>
                  </li>
                </ul>
              </div>

              <div className="dropdown three-dots">
                <button className="btn dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                  <div className="three-dots-btn">
                    <img src={DI} alt="" className="img-fluid" />
                    <img src={DI} alt="" className="img-fluid" />
                    <img src={DI} alt="" className="img-fluid" />
                  </div>
                </button>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                  <li><a className="dropdown-item" >Action</a></li>
                  <li><a className="dropdown-item" >Another action</a></li>
                  <li><a className="dropdown-item" >Something else here</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="assets-btn-dd">
            <div className="assets-btns">
              <button type="button" className="btn">ALL ASSETS</button>
              <button type="button" className="btn">ETHEREUM</button>
              <button type="button" className="btn">ALGORAND</button>
              <button type="button" className="btn">SOLANA</button>
              <button type="button" className="btn">POLYGON</button>
              <button type="button" className="btn">BINANCE SMART CHAIN</button>
              <button type="button" className="btn">BINANCE CHAIN</button>
              <button style={{ borderRight: "0" }} type="button" className="btn">TRON</button>
            </div>
            <div className="dropdown assets-btns-dd">
              <button className="btn dropdown-toggle text-white" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
              </button>
              <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                <li><a className="dropdown-item" >Action</a></li>
                <li><a className="dropdown-item" >Another action</a></li>
                <li><a className="dropdown-item" >Something else here</a></li>
              </ul>
            </div>
          </div>
          <div className="assets-checkbox-crypto">
            <div className="checkbox-crypto">
              <label className="checkbox-container">
                <input type="checkbox" />
                <span className="checkmark"></span>
              </label>
              <div className="checkbox-crypto-content d-flex align-items-center">
                <img style={{ width: "35px" }} src={BTC} alt="" className="img-fluid" />
                <div className="ps-2">
                  <p className="mb-0 text-white">Bitcoin</p>
                  <p className="mb-0 text-white-light">BTC</p>
                </div>
              </div>
            </div>

            <div className="checkbox-crypto">
              <label className="checkbox-container">
                <input type="checkbox" />
                <span className="checkmark"></span>
              </label>
              <div className="checkbox-crypto-content d-flex align-items-center">
                <img style={{ width: "35px" }} src={BTC} alt="" className="img-fluid" />
                <div className="ps-2">
                  <p className="mb-0 text-white">Bitcoin</p>
                  <p className="mb-0 text-white-light">BTC</p>
                </div>
              </div>
            </div>

            <div className="checkbox-crypto">
              <label className="checkbox-container">
                <input type="checkbox" />
                <span className="checkmark"></span>
              </label>
              <div className="checkbox-crypto-content d-flex align-items-center">
                <img style={{ width: "35px" }} src={BTC} alt="" className="img-fluid" />
                <div className="ps-2">
                  <p className="mb-0 text-white">Bitcoin</p>
                  <p className="mb-0 text-white-light">BTC</p>
                </div>
              </div>
            </div>
          </div>

          <div className="assets-etereum-asset">
            <h2 className="text-white">Enable/Disable Etereum Asset</h2>

            <div className="assets-dropdown">
              <div className="d-flex">
                <div className="dropdown show-all-dd all-assets-dd">
                  <button className="btn text-white dropdown-toggle" type="button" id="dropdownMenuButton1"
                    data-bs-toggle="dropdown" aria-expanded="false">
                    Show All
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                    <li>
                      <a className="dropdown-item" >Action</a>
                    </li>
                    <li>
                      <a className="dropdown-item" >Another action</a>
                    </li>
                    <li>
                      <a className="dropdown-item" >Something else here</a>
                    </li>
                  </ul>
                </div>

                <div className="dropdown three-dots">
                  <button className="btn dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                    <div className="three-dots-btn">
                      <img src={DI} alt="" className="img-fluid" />
                      <img src={DI} alt="" className="img-fluid" />
                      <img src={DI} alt="" className="img-fluid" />
                    </div>
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                    <li><a className="dropdown-item" >Action</a></li>
                    <li><a className="dropdown-item" >Another action</a></li>
                    <li><a className="dropdown-item" >Something else here</a></li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="etereum-assets-boxes row">
              <div className="col-md-3 etereum-box col-sm-6">
                <label className="checkbox-container">
                  <input type="checkbox" />
                  <span className="checkmark"></span>
                </label>
                <div className="img-box">
                  <img src={BTC} alt="" className="img-fluid" />
                </div>
              </div>

              <div className="col-md-3 etereum-box col-sm-6">
                <label className="checkbox-container">
                  <input type="checkbox" />
                  <span className="checkmark"></span>
                </label>
                <div className="img-box">
                  <img src={BTC} alt="" className="img-fluid" />
                </div>
              </div>

              <div className="col-md-3 etereum-box col-sm-6">
                <label className="checkbox-container">
                  <input type="checkbox" />
                  <span className="checkmark"></span>
                </label>
                <div className="img-box">
                  <img src={BTC} alt="" className="img-fluid" />
                </div>
              </div>

              <div className="col-md-3 etereum-box col-sm-6">
                <label className="checkbox-container">
                  <input type="checkbox" />
                  <span className="checkmark"></span>
                </label>
                <div className="img-box">
                  <img src={BTC} alt="" className="img-fluid" />
                </div>
              </div>

              <div className="col-md-3 etereum-box col-sm-6">
                <label className="checkbox-container">
                  <input type="checkbox" />
                  <span className="checkmark"></span>
                </label>
                <div className="img-box">
                  <img src={BTC} alt="" className="img-fluid" />
                </div>
              </div>

              <div className="col-md-3 etereum-box col-sm-6">
                <label className="checkbox-container">
                  <input type="checkbox" />
                  <span className="checkmark"></span>
                </label>
                <div className="img-box">
                  <img src={BTC} alt="" className="img-fluid" />
                </div>
              </div>

              <div className="col-md-3 etereum-box col-sm-6">
                <label className="checkbox-container">
                  <input type="checkbox" />
                  <span className="checkmark"></span>
                </label>
                <div className="img-box">
                  <img src={BTC} alt="" className="img-fluid" />
                </div>
              </div>

              <div className="col-md-3 etereum-box col-sm-6">
                <label className="checkbox-container">
                  <input type="checkbox" />
                  <span className="checkmark"></span>
                </label>
                <div className="img-box">
                  <img src={BTC} alt="" className="img-fluid" />
                </div>
              </div>

              <div className="col-md-3 etereum-box col-sm-6">
                <label className="checkbox-container">
                  <input type="checkbox" />
                  <span className="checkmark"></span>
                </label>
                <div className="img-box">
                  <img src={BTC} alt="" className="img-fluid" />
                </div>
              </div>

              <div className="col-md-3 etereum-box col-sm-6">
                <label className="checkbox-container">
                  <input type="checkbox" />
                  <span className="checkmark"></span>
                </label>
                <div className="img-box">
                  <img src={BTC} alt="" className="img-fluid" />
                </div>
              </div>

              <div className="col-md-3 etereum-box col-sm-6">
                <label className="checkbox-container">
                  <input type="checkbox" />
                  <span className="checkmark"></span>
                </label>
                <div className="img-box">
                  <img src={BTC} alt="" className="img-fluid" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="batton"></div>
      </section>
    </>
  );
};

export default Index;
