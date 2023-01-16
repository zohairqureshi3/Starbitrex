import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { displayPermissionsModules, deletePermissionsModule } from '../../redux/permissionsModule/permissionsModuleActions';
import { Link } from 'react-router-dom';
import { getRole } from '../../redux/roles/roleActions';
import { getPermission } from '../../config/helpers';
import Swal from 'sweetalert2';
import FullPageTransparentLoader from "../FullPageTransparentLoader/fullPageTransparentLoader";
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



const PermissionsModules = () => {

   const dispatch = useDispatch();
   const permissionsModules = useSelector(state => state.permissionsModule.permissionsModules);

   const [loader, setLoader] = useState(false);
   const roleData = useSelector(state => state?.role.role);
   const loginPermissions = roleData[0]?.permissions;
   const permissionName = getPermission(loginPermissions);

   const success = useSelector(state => state.permissionsModule.success);
   const fetched = useSelector(state => state.permissionsModule.fetched);

   const columns = [
      {
         name: 'Permission',
         selector: row => row?.name,
         sortable: true,
      },
      {
         name: 'Action(s)',
         cell: row => {
            return (
               <>
                  {
                     permissionName && permissionName.length > 0 && permissionName.includes('delete_permissions_module') ?
                        <button className="btn btn-danger btn-sm" onClick={() => deleteAction(row._id)}>Delete</button>
                        :
                        null
                  }
               </>
            );
         },
      }
   ];

   useEffect(() => {
      setLoader(true);
      dispatch(displayPermissionsModules());
      if (fetched) {
         setLoader(false);
      }
   }, [fetched, success]);

   useEffect(() => {
      const loginData = localStorage.getItem('user');
      const data = JSON.parse(loginData);
      const id = data?.roleId;
      dispatch(getRole(id));
   }, [])

   const deleteAction = (id) => {
      Swal.fire({
         title: `Are you sure you want to Delete?`,
         html: '',
         showCloseButton: true,
         showCancelButton: true,
         confirmButtonColor: '#3085d6',
         cancelButtonColor: '#d33',
         confirmButtonText: "Yes"
      }).then((result) => {
         if (result.isConfirmed == true ? true : false) {
            dispatch(deletePermissionsModule(id))
         }
      })
   }

   return (
      <>
         {loader ? <FullPageTransparentLoader /> :
            <>
               <div className="content-wrapper right-content-wrapper">
                  <div className="content-box">
                     <h3>Permissions Modules Details</h3>
                     <Link to='/admin/add-permissions-module'><button className="btn btn-default mb-3">Add Permissions Module</button></Link>
                     <DataTable
                        columns={columns}
                        data={permissionsModules}
                        pagination
                        fixedHeader
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

export default PermissionsModules