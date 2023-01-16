import React, { useState, useEffect } from "react";
import { Col } from 'react-bootstrap';
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faBars } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";

const ProfileSideBar = () => {

  const navigate = useNavigate()
  const [path, setPath] = useState('/profile-setting');

  const activeTab = (path) => {
    setPath(path)
    navigate(path)
  }

  useEffect(() => {
    let parseUriSegment = window.location.pathname.split("/");
    setPath(parseUriSegment[1])
  }, [window.location.href]);

  return (
    <Col lg={2} className="mb-0 content2 profilesidebar" >
      {/* <FontAwesomeIcon className="history-navbar-icon" icon={faBars} /> */}
      <div className="custom-navbar-history" style={{ height: "100%" }}>
        <div
          style={{ minHeight: "100vh" }}
          className="sidebar collapse collapse-horizontal show"
          id="collapseWidthExample"
        >
          <ul>
            {/* <li>
              <Link to="/dashboard" className="active">
                Dashboard
              </Link>
            </li> */}
            <li>
              <Link to="/profile-setting" className={path == "profile-setting" ? "active" : ""} onClick={() => activeTab('/profile-setting')}>
                Profile Setting
              </Link>
            </li>
            <li>
              <Link to="/change-password" className={path == "change-password" ? "active" : ""} onClick={() => activeTab('/change-password')}>
                Change Password
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </Col>
  )
}

export default ProfileSideBar