import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { getSalesStatuses, deleteSalesStatus, updateState } from '../../redux/salesStatus/salesStatusActions';
import { getRole } from '../../redux/roles/roleActions';
import { getPermission } from "../../config/helpers";
import FullPageTransparentLoader from "../FullPageTransparentLoader/fullPageTransparentLoader";

const SalesStatus = () => {
   const dispatch = useDispatch();

   const [loader, setLoader] = useState(false);

   const salesStatuses = useSelector(state => state?.salesStatus?.salesStatuses);
   const roleData = useSelector(state => state?.role?.role);
   const salesStatusesfetched = useSelector(state => state?.salesStatus?.salesStatusesfetched);
   const salesStatusDeleted = useSelector(state => state?.salesStatus?.salesStatusDeleted);
   const permissions = roleData[0]?.permissions;
   const permissionName = getPermission(permissions);

   useEffect(async () => {
      if (salesStatusesfetched || salesStatusDeleted) {
         await dispatch(updateState());
         setLoader(false);
      }
   }, [salesStatusesfetched, salesStatusDeleted]);

   useEffect(async () => {
      setLoader(true);
      const loginData = localStorage.getItem('user');
      const data = JSON.parse(loginData);
      const id = data?.roleId;
      await dispatch(getRole(id));
      await dispatch(getSalesStatuses());
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
      }).then(async (result) => {
         if (result.isConfirmed == true ? true : false) {
            setLoader(true);
            await dispatch(deleteSalesStatus(id));
         }
      })
   }

   return (
      <>
         {loader ? <FullPageTransparentLoader /> :
            <div className="content-wrapper right-content-wrapper">
               <div className="content-box">
                  <h3>Statuses</h3>
                  {
                     permissionName && permissionName.length > 0 && permissionName.includes('add_sales_status') ?
                        <Link to='/admin/add-status'><button className="btn btn-default">Add Status</button></Link>
                        :
                        null
                  }
                  <div className="mt-3 table-responsive">
                     <table className="table">
                        <thead className="table_head">
                           <tr>
                              <th>Name</th>
                              <th>Type</th>
                              <th>Color</th>
                              {
                                 permissionName && permissionName.length > 0 && permissionName.includes('edit_sales_status', 'delete_sales_status') ?
                                    <th>Action(s)</th>
                                    :
                                    null
                              }
                           </tr>
                        </thead>
                        <tbody>
                           {salesStatuses?.length > 0 && salesStatuses?.map((salesStatus) => {
                              return (
                                 <tr key={salesStatus._id}>
                                    <td>{salesStatus.name}</td>
                                    <td>{salesStatus?.type === 2 ? 'Both' : (salesStatus?.type === 1 ? 'Retention' : 'Sales')}</td>
                                    <td>
                                       <span className="picked-value" style={{ borderLeftColor: salesStatus?.color ? salesStatus?.color : "#aabbcc" }}>
                                          {salesStatus?.color ? salesStatus?.color : "#aabbcc"}
                                       </span>
                                    </td>
                                    <td>
                                       {
                                          permissionName && permissionName.length > 0 && permissionName.includes('edit_sales_status') ?
                                             <Link to={`/admin/edit-status/${salesStatus._id}`} className='btn btn-primary me-2 text-decoration-none text-light'>Edit</Link>
                                             :
                                             null
                                       }
                                       {
                                          permissionName && permissionName.length > 0 && permissionName.includes('delete_sales_status') ?
                                             <button className="btn btn-danger me-2" onClick={() => deleteAction(salesStatus._id)}>Delete</button>
                                             :
                                             null
                                       }
                                    </td>
                                 </tr>
                              )
                           })}
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
         }
      </>
   )
}

export default SalesStatus;
