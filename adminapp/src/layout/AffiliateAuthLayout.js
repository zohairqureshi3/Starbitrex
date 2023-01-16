import React, { useEffect } from "react";

const AffiliateAuthLayout = ({ title, children }) => {

  useEffect(() => {
    if (title)
      document.title = title;
    else
      document.title = "StarBitrex";
  }, [title]);

  // useEffect(() => {
  //   if (localStorage.token) {
  //     window.location.href = '/admin/';
  //   }
  // }, []);

  return <div className="dashboard-wrapper main-padding">
    <div className="row">
      {children}
    </div>
  </div>
};

export default AffiliateAuthLayout;
