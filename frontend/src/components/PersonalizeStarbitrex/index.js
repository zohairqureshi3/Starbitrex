import React from "react";
import { Accordion } from "react-bootstrap";
import PPIcon from '../../assets/images/personalize-icon.svg';
import BTC from '../../assets/images/bitcoin.svg';

const Index = () => {
  return (
    <>
      <section className="personalize-company header-padding">
        <div className="container-fluid padding50 personalize-custom-container">
          <h1 className="text-center">Personalize COMPANY</h1>
          <h2 className="text-center text-white-light">information</h2>
          <div className="text-center"><button type="button" className="btn use-default-btn">Use Default Theme</button></div>
          <Accordion>

            <div className="personalize-accor-dropdown">
              <div className="dropdown personalize-accor-dd">
                <button className="btn text-white dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                  <div className="dd-data">
                    <img src={BTC} alt="" className="img-fluid" />
                    <p className="mb-0">USD</p>
                  </div>
                </button>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                  <li><a className="dropdown-item" >Action</a></li>
                  <li><a className="dropdown-item" >Another action</a></li>
                  <li><a className="dropdown-item" >Something else here</a></li>
                </ul>
              </div>
              <Accordion.Item className="transcations-accord-item personalize-accord-item mb-2" eventKey="0">
                <Accordion.Header>
                  <div className="transcations-accord-content">
                    <div className="content">
                      <div>
                        <img src={PPIcon} alt="" className="img-fluid" />
                      </div>
                    </div>
                  </div>
                </Accordion.Header>
                <Accordion.Body>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum.
                </Accordion.Body>
              </Accordion.Item>
            </div>

            <Accordion.Item className="transcations-accord-item personalize-accord-item mb-2" eventKey="1">
              <Accordion.Header>
                <div className="transcations-accord-content">
                  <div className="content">
                    <div>
                      <img src={PPIcon} alt="" className="img-fluid" />
                    </div>
                  </div>
                </div>
              </Accordion.Header>
              <Accordion.Body>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco
                laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                irure dolor in reprehenderit in voluptate velit esse cillum
                dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                cupidatat non proident, sunt in culpa qui officia deserunt
                mollit anim id est laborum.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item className="transcations-accord-item personalize-accord-item mb-2" eventKey="2">
              <Accordion.Header>
                <div className="transcations-accord-content">
                  <div className="content">
                    <div>
                      <img src={PPIcon} alt="" className="img-fluid" />
                    </div>
                  </div>
                </div>
              </Accordion.Header>
              <Accordion.Body>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco
                laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                irure dolor in reprehenderit in voluptate velit esse cillum
                dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                cupidatat non proident, sunt in culpa qui officia deserunt
                mollit anim id est laborum.
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
      </section>
    </>
  );
};

export default Index;
