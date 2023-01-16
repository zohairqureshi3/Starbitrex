import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { getRole } from '../../redux/roles/roleActions';
import FullPageTransparentLoader from "../FullPageTransparentLoader/fullPageTransparentLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import DataTable, { createTheme } from 'react-data-table-component';



createTheme(
   "solarizedd",
   {
      text: {
         primary: "#fff",
         secondary: "#fff",
      },
      background: {
         default: "#374057",
      },
      context: {
         background: "#374057",
         text: "#FFFFFF",
      },
      divider: {
         default: "#fff",
      },
      action: {
         button: "rgba(0,0,0,.54)",
         hover: "rgba(0,0,0,.08)",
         disabled: "rgba(0,0,0,.12)",
      },
   },
   "dark"
);




const PermissionPerRole = () => {

   const history = useHistory();
   let { id } = useParams();

   const dispatch = useDispatch();
   const roleData = useSelector(state => state.role?.editRole[0]?.permissions);
   const fetched = useSelector(state => state.role?.fetched);
   const [loader, setLoader] = useState(false);

   useEffect(() => {
      setLoader(true)
      dispatch(getRole(id));
   }, []);

   useEffect(() => {
      if (fetched) {
         setLoader(false)
      }
   }, [fetched]);

   const columns = [
      {
         name: 'Permissions',
         selector: row => row.name,
         sortable: true,
      }
   ];

   return (
      <>
         {loader ? <FullPageTransparentLoader /> :
            <>
               <div className="content-wrapper right-content-wrapper">
                  <div className="content-box">
                     <FontAwesomeIcon className="faArrowLeftIcon" icon={faArrowLeft} onClick={() => history.goBack()} />
                     <h3>Permissions Per Role</h3>
                     <DataTable
                        columns={columns}
                        data={roleData}
                        pagination
                        subHeader
                        persistTableHead
                        highlightOnHover
                        defaultSortFieldId={1}
                        theme="solarizedd"
                     />
                  </div>
               </div>
            </>
         }
      </>
   )
}

export default PermissionPerRole