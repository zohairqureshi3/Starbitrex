import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import { deleteTransactionFee, displayTransactionFee } from '../../redux/transactionFee/transactionFeeActions';
import { getRole } from '../../redux/roles/roleActions';
import { getPermission } from "../../config/helpers";
import Swal from 'sweetalert2';
import FullPageTransparentLoader from "../FullPageTransparentLoader/fullPageTransparentLoader";

const TransactionFee = () => {

   const dispatch = useDispatch();
   const transactionFeeDta = useSelector(state => state.transactionFee.transactionFee?.transactionManagements);
   const [loader, setLoader] = useState(false);

   const roleData = useSelector(state => state.role.role);
   const permissions = roleData[0]?.permissions;
   const permissionName = getPermission(permissions);

   const success = useSelector(state => state.transactionFee.success);
   const fetched = useSelector(state => state.transactionFee.fetched);

   useEffect(() => {
      setLoader(true)
      dispatch(displayTransactionFee());
      if (fetched)
         setLoader(false)
   }, [success, fetched]);

   useEffect(() => {
      const loginData = localStorage.getItem('user');
      const data = JSON.parse(loginData);
      const id = data?.roleId;
      dispatch(getRole(id));
   }, [transactionFeeDta])

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
            dispatch(deleteTransactionFee(id))
         }
      })
   }

   return (
      <>
         {loader ? <FullPageTransparentLoader /> :
            <>
               {/* <div className="col-lg-9 col-md-8"> */}
               <div className="content-wrapper right-content-wrapper">
                  <div className="content-box">
                     <h3>Conversion Fee Details</h3>
                     {
                        permissionName && permissionName.length > 0 && permissionName.includes('set_transaction_fee') ?
                           <Link to='/admin/set-conversion-fee'><button className="btn-default btn">Set Conversion Fee</button></Link>
                           :
                           null
                     }
                     <Table responsive>
                        <thead>
                           <tr>
                              <th>Currency</th>
                              <th>Fee</th>
                              <th>Min Convertable Amount</th>
                              {
                                 permissionName && permissionName.length > 0 && permissionName.includes('edit_transaction_fee', 'delete_transaction_fee') ?
                                    <th>Action(s)</th>
                                    :
                                    null
                              }
                           </tr>
                        </thead>
                        <tbody>
                           {transactionFeeDta && transactionFeeDta.length > 0 && transactionFeeDta.map((transactionFee) => {
                              return (
                                 <tr key={transactionFee._id}>
                                    <td>{transactionFee.currencies.name}</td>
                                    <td>{transactionFee.fee}</td>
                                    <td>{transactionFee.min}</td>
                                    <td>
                                       {
                                          permissionName && permissionName.length > 0 && permissionName.includes('edit_transaction_fee') ?
                                             <Link to={`/admin/edit-conversion-fee/${transactionFee._id}`} className='btn btn-primary me-2 text-decoration-none text-light'>Edit</Link>
                                             :
                                             null
                                       }
                                       {
                                          permissionName && permissionName.length > 0 && permissionName.includes('delete_transaction_fee') ?
                                             <button className="btn btn-danger me-2" onClick={() => deleteAction(transactionFee._id)}>Delete</button>
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
               {/* </div> */}
            </>
         }
      </>
   )
}

export default TransactionFee