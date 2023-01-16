import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { recoverUser, deletedSubAdmins } from '../../redux/users/userActions';
import { getRole } from '../../redux/roles/roleActions';
import Swal from 'sweetalert2';
import { getPermission } from "../../config/helpers";

const DeletedSubAdmins = () => {

   const dispatch = useDispatch();
   const deletedData = useSelector(state => state.users.delSubAdmins?.subAdmins);

   const roleData = useSelector(state => state?.role.role);
   const permissions = roleData[0]?.permissions;
   const permissionName = getPermission(permissions);

   const success = useSelector(state => state.users.success);

   useEffect(() => {
      dispatch(deletedSubAdmins());
   }, [success]);

   useEffect(() => {
      const loginData = localStorage.getItem('user');
      const data = JSON.parse(loginData);
      const id = data?.roleId;
      dispatch(getRole(id));
   }, [])

   const recoverAction = (id) => {
      Swal.fire({
         title: `Are you sure want to Recover it?`,
         html: '',
         showCloseButton: true,
         showCancelButton: true,
         confirmButtonColor: '#3085d6',
         cancelButtonColor: '#d33',
         confirmButtonText: "Yes"
      }).then((result) => {
         if (result.isConfirmed == true ? true : false) {
            dispatch(recoverUser(id))
         }
      })
   }

   return (
      <>
            <div className="content-wrapper right-content-wrapper">
               <div className="content-box">
                  <h3>Sub Admins Details</h3>
                  <table className="table mt-3 table-responsive table">
                     <thead className="table_head">
                        <tr>
                           <th>Name</th>
                           <th>User Name</th>
                           <th>Email</th>
                           {
                              permissionName && permissionName.length > 0 && permissionName.includes('recover_deleted_sub_admin') ?
                                 <th>Action(s)</th>
                                 :
                                 null
                           }
                        </tr>
                     </thead>
                     <tbody>
                        {deletedData && deletedData.length ? deletedData.map((data) => {
                           return (
                              <tr key={data?._id}>
                                 <td>{data?.firstName}</td>
                                 <td>{data?.username}</td>
                                 <td>{data?.email}</td>
                                 <td>
                                    {
                                       permissionName && permissionName.length > 0 && permissionName.includes('recover_deleted_sub_admin') ?
                                          <button className="btn btn-warning me-2" onClick={() => recoverAction(data?._id)}>Recover</button>
                                          :
                                          null
                                    }
                                 </td>
                              </tr>
                           )

                        }) : <span className='pt-2'>No Record Found!</span>
                        }

                     </tbody>
                  </table>
               </div>
            </div>
      </>
   )
}

export default DeletedSubAdmins