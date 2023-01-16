import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deletedUsers, recoverUser } from '../../redux/users/userActions';
import { getRole } from '../../redux/roles/roleActions';
import Swal from 'sweetalert2';
import { getPermission } from "../../config/helpers";

const DeletedUsers = () => {

   const dispatch = useDispatch();
   const deletedData = useSelector(state => state.users.delUsers);
   const userData = deletedData?.users;

   const roleData = useSelector(state => state?.role.role);
   const permissions = roleData[0]?.permissions;
   const permissionName = getPermission(permissions);

   const success = useSelector(state => state.users.success);

   useEffect(() => {
      dispatch(deletedUsers());
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
         {/* <div className="col-lg-9 col-md-8"> */}
            <div className="content-wrapper right-content-wrapper">
               <div className="content-box">
                  <h3>Deleted Users Details</h3>
                  <table className="table mt-3 table-responsive table">
                     <thead className="table_head">
                        <tr>
                           <th>Name</th>
                           <th>User Name</th>
                           <th>Email</th>
                           {
                              permissionName && permissionName.length > 0 && permissionName.includes('recover_deleted_user') ?
                                 <th>Action(s)</th>
                                 :
                                 null
                           }
                        </tr>
                     </thead>
                     <tbody>
                        {userData && userData.length ? userData.map((data) => {
                           return (
                              <tr key={data?.users._id}>
                                 <td>{data?.users.firstName}</td>
                                 <td>{data?.users.username}</td>
                                 <td>{data?.users.email}</td>
                                 <td>
                                    {
                                       permissionName && permissionName.length > 0 && permissionName.includes('recover_deleted_user') ?
                                          <button className="btn btn-warning me-2" onClick={() => recoverAction(data?.users._id)}>Recover</button>
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
         {/* </div> */}
      </>
   )
}

export default DeletedUsers