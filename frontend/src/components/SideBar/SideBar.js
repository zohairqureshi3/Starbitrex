import React, { useState, useEffect } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faBars, faBarsProgress } from "@fortawesome/free-solid-svg-icons";
import { } from "@fortawesome/free-brands-svg-icons";
import { Link, useNavigate } from "react-router-dom";

const SideBar = () => {

  const navigate = useNavigate()
  const [path, setPath] = useState('/overview');

  const activeTab = (path) => {
    setPath(path)
    navigate(path)
  }

  useEffect(() => {
    let parseUriSegment = window.location.pathname.split("/");
    setPath(parseUriSegment[1])
  }, [window.location.href]);

  return (
    <div className="col-lg-2 mb-0 content2 siderbar">
      {/* <FontAwesomeIcon className="history-navbar-icon" icon={faBarsProgress} /> */}
      <div className="custom-navbar-history" style={{ height: "100%" }}>
        <div
          style={{ minHeight: "100vh" }}
          className="sidebar collapse collapse-horizontal show"
          id="collapseWidthExample"
        >
          <ul>
            <li>
              <Link to='/overview' className={path == "overview" ? "active" : ""} onClick={() => activeTab('/overview')}>
                overview
              </Link>
            </li>
            <li>
              <Link to='/futures' className={path == "futures" ? "active" : ""} onClick={() => activeTab('/futures')}>
                future trading
              </Link>
            </li>
            <li>
              <Link to='/transaction-history' className={path == "transaction-history" ? "active" : ""} onClick={() => activeTab('/transaction-history')}>
                transaction history
              </Link>
            </li>
            <li>
              <Link to='/account-statement' className={path == "account-statement" ? "active" : ""} onClick={() => activeTab('/account-statement')}>
                account statement
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
