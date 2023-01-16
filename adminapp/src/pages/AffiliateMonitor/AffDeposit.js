import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { affUserMonitor } from '../../redux/users/userActions';
import FullPageTransparentLoader from "../FullPageTransparentLoader/fullPageTransparentLoader";

function useQuery() {
   const { search } = useLocation();

   return React.useMemo(() => new URLSearchParams(search), [search]);
}


const AffDeposit = () => {
   let query = useQuery();
   const dispatch = useDispatch();
   const [loader, setLoader] = useState(true);

   useEffect(async () => {
      let otl = query.get("otl");

      if (otl) {
         await dispatch(affUserMonitor(otl));
      }
      else {
         window.location.href = "/";
      }
   }, [])

   return (
      <>
         {loader ? <FullPageTransparentLoader /> :
            <>
               <div className="content-wrapper right-content-wrapper">
                  <div className="content-box">
                     <h3>User Details</h3>
                  </div>
               </div>
            </>
         }
      </>
   )
}

export default AffDeposit;