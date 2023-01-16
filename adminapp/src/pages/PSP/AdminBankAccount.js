import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { getAdminBankAccounts, deleteAdminBankAccount, setDefaultAdminBankAccount, updateState } from '../../redux/psp/adminBankAccountActions';
import { getRole } from '../../redux/roles/roleActions';
import { getPermission } from "../../config/helpers";
import FullPageTransparentLoader from "../FullPageTransparentLoader/fullPageTransparentLoader";

const AdminBankAccount = () => {
   const dispatch = useDispatch();

   const [loader, setLoader] = useState(false);
   const roleData = useSelector(state => state?.role?.role);
   const adminBankAccounts = useSelector(state => state?.adminBankAccount?.adminBankAccounts);
   const adminBankAccountsfetched = useSelector(state => state?.adminBankAccount?.adminBankAccountsfetched);
   const adminBankAccountDeleted = useSelector(state => state?.adminBankAccount?.adminBankAccountDeleted);
   const permissions = roleData[0]?.permissions;
   const permissionName = getPermission(permissions);

   useEffect(async () => {
      if (adminBankAccountsfetched || adminBankAccountDeleted) {
         await dispatch(updateState());
         setLoader(false);
      }
   }, [adminBankAccountsfetched, adminBankAccountDeleted]);

   useEffect(async () => {
      setLoader(true);
      const loginData = localStorage.getItem('user');
      const data = JSON.parse(loginData);
      const id = data?.roleId;
      await dispatch(getRole(id));
      await dispatch(getAdminBankAccounts());
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
            await dispatch(deleteAdminBankAccount(id));
         }
      })
   }

   const setDefaultAction = (id) => {
      Swal.fire({
         title: `Are you sure you want to set it as default bank account?`,
         html: '',
         showCloseButton: true,
         showCancelButton: true,
         confirmButtonColor: '#3085d6',
         cancelButtonColor: '#d33',
         confirmButtonText: "Yes"
      }).then(async (result) => {
         if (result.isConfirmed == true ? true : false) {
            // setLoader(true);
            const data = {
               isDefault: true
            };
            await dispatch(setDefaultAdminBankAccount(id, data));
         }
      })
   }

   return (
      <>
         {loader ? <FullPageTransparentLoader /> :
            <div className="content-wrapper right-content-wrapper">
               <div className="content-box">
                  <h3>Bank Accounts</h3>
                  {
                     permissionName && permissionName.length > 0 && permissionName.includes('add_admin_bank_account') ?
                        <Link to='/admin/add-bank-account'><button className="btn btn-default">Add Bank Account</button></Link>
                        :
                        null
                  }
                  <div className="mt-3 table-responsive">
                     <table className="table">
                        <thead className="table_head">
                           <tr>
                              <th>Name</th>
                              <th>IBAN</th>
                              <th>Account Number</th>
                              <th>Bank Address</th>
                              <th>Swift Code</th>
                              {
                                 permissionName && permissionName.length > 0 && permissionName.includes('edit_admin_bank_account', 'delete_admin_bank_account') ?
                                    <th>Action(s)</th>
                                    :
                                    null
                              }
                           </tr>
                        </thead>
                        <tbody>
                           {adminBankAccounts?.length > 0 && adminBankAccounts?.map((adminBankAccount) => {
                              return (
                                 <tr key={adminBankAccount._id}>
                                    <td>{adminBankAccount.name}</td>
                                    <td>{adminBankAccount.iban}</td>
                                    <td>{adminBankAccount.accountNumber}</td>
                                    <td>{adminBankAccount.bankAddress}</td>
                                    <td>{adminBankAccount.swiftCode}</td>
                                    <td className='action-buttons'>
                                       {
                                          permissionName && permissionName.length > 0 && permissionName.includes('set_default_admin_bank_account') ?
                                             adminBankAccount.isDefault ? <button className="btn btn-success me-2" disabled>Default</button> : <button className="btn btn-success me-2" onClick={() => setDefaultAction(adminBankAccount._id)}>Set As Default</button>
                                             :
                                             null
                                       }
                                       {
                                          permissionName && permissionName.length > 0 && permissionName.includes('edit_admin_bank_account') ?
                                             <Link to={`/admin/edit-bank-account/${adminBankAccount._id}`} className='btn btn-primary me-2 text-decoration-none text-light'>Edit</Link>
                                             :
                                             null
                                       }
                                       {
                                          permissionName && permissionName.length > 0 && permissionName.includes('delete_admin_bank_account') ?
                                             <button className="btn btn-danger me-2" onClick={() => deleteAction(adminBankAccount._id)}>Delete</button>
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

export default AdminBankAccount;
