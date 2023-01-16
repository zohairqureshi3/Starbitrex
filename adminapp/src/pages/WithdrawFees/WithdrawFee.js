import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClone } from "@fortawesome/free-solid-svg-icons";
import { deleteWithdrawFee, displayWithdrawFee } from '../../redux/withdrawFee/withdrawFeeActions';
import { getRole } from '../../redux/roles/roleActions';
import { getPermission } from "../../config/helpers";
import Swal from 'sweetalert2';
import FullPageTransparentLoader from "../FullPageTransparentLoader/fullPageTransparentLoader";
import { toast } from 'react-toastify';

const WithdrawFee = () => {

   const dispatch = useDispatch();
   const withdrawFeeDta = useSelector(state => state.withdrawFee.withdrawFee.withdrawFees);
   const [loader, setLoader] = useState(false);

   const roleData = useSelector(state => state.role.role);
   const permissions = roleData[0]?.permissions;
   const permissionName = getPermission(permissions);

   const success = useSelector(state => state.withdrawFee.success);
   const fetched = useSelector(state => state.withdrawFee.fetched);

   useEffect(() => {
      setLoader(true)
      dispatch(displayWithdrawFee());
      if (fetched)
         setLoader(false)
   }, [success, fetched]);

   useEffect(() => {
      const loginData = localStorage.getItem('user');
      const data = JSON.parse(loginData);
      const id = data?.roleId;
      dispatch(getRole(id));
   }, [withdrawFeeDta])

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
            dispatch(deleteWithdrawFee(id))
         }
      })
   }

   const copyReferral = () => {
      toast.success('Successfully copied!');
   }

   return (
      <>
         {loader ? <FullPageTransparentLoader /> :
            <>
               <div className="content-wrapper right-content-wrapper">
                  <div className="content-box">
                     <h3>Withdraw Fee Details</h3>
                     {
                        permissionName && permissionName.length > 0 && permissionName.includes('set_withdraw_fee') ?
                           <Link to='/admin/set-withdraw-fee'><button className="btn-default btn">Set Withdraw Fee</button></Link>
                           :
                           null
                     }
                     <Table responsive>
                        <thead>
                           <tr>
                              <th>Currency</th>
                              <th>Network</th>
                              <th>Fee (%)</th>
                              <th>Admin Wallet</th>
                              <th>Min</th>
                              <th>Max</th>
                              {
                                 permissionName && permissionName.length > 0 && permissionName.includes('edit_withdraw_fee', 'delete_withdraw_fee') ?
                                    <th>Action(s)</th>
                                    :
                                    null
                              }
                           </tr>
                        </thead>
                        <tbody>
                           {withdrawFeeDta && withdrawFeeDta.length > 0 && withdrawFeeDta.map((withdrawFee) => {
                              return (
                                 <tr key={withdrawFee._id}>
                                    <td>{withdrawFee.currencies.name}</td>
                                    <td>{withdrawFee.networks.name}</td>
                                    <td>{withdrawFee.fee}</td>
                                    <td>{withdrawFee?.feeAdminWallet ?
                                       <CopyToClipboard text={withdrawFee.feeAdminWallet}>
                                          <span>
                                             {withdrawFee.feeAdminWallet?.slice(0, 4)}...{withdrawFee.feeAdminWallet?.slice(withdrawFee.feeAdminWallet.length - 4, withdrawFee.feeAdminWallet.length)}
                                             <FontAwesomeIcon icon={faClone} onClick={() => copyReferral()} className="ms-2" />
                                          </span>
                                       </CopyToClipboard>
                                       : <span>-</span>}</td>
                                    <td>{withdrawFee.min}</td>
                                    <td>{withdrawFee.max}</td>
                                    <td>
                                       {
                                          permissionName && permissionName.length > 0 && permissionName.includes('edit_withdraw_fee') ?
                                             <Link to={`/admin/edit-withdraw-fee/${withdrawFee._id}`} className='btn btn-primary me-2 text-decoration-none text-light'>Edit</Link>
                                             :
                                             null
                                       }
                                       {
                                          permissionName && permissionName.length > 0 && permissionName.includes('delete_withdraw_fee') ?
                                             <button className="btn btn-danger me-2" onClick={() => deleteAction(withdrawFee._id)}>Delete</button>
                                             :
                                             null
                                       }
                                    </td>
                                 </tr>
                              )
                           })}
                        </tbody>
                     </Table>
                  </div>
               </div>
            </>
         }
      </>
   )
}

export default WithdrawFee