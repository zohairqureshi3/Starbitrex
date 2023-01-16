import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deletePermission } from '../../redux/permissions/permissionActions';
import { getRole } from '../../redux/roles/roleActions';
import { getPermission } from '../../config/helpers';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUndo } from "@fortawesome/free-solid-svg-icons";
import FullPageTransparentLoader from "../FullPageTransparentLoader/fullPageTransparentLoader";
import DataTable, { createTheme } from 'react-data-table-component';
import { approvePendingTransaction, getPendingWithdraws, declinePendingTransaction } from '../../redux/ExternalTransactions/externalTransactionActions';
import { approvePendingFiatTransaction, getPendingFiatWithdraws, resolveWithDrawFiatTransaction } from '../../redux/externalFiatTransactions/externalFiatTransactionActions';
import { approvePendingBankTransaction, getPendingBankWithdraws, resolveWithDrawBankTransaction } from '../../redux/externalBankTransactions/externalBankTransactionActions';
import { resolveWithDrawTransaction, revertTransaction } from '../../redux/users/userActions';
import { Link } from 'react-router-dom';
import axios from "axios";
import moment from 'moment';
const currencyFormatter = require('currency-formatter');


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



const PendingWithdraws = () => {
   const coins = 'ETH,LINK,AVAX,DOGE,BCH,LTC,TRX,BNB,ADA,BTC,USD,AUD,CAD,NZD,EUR,GBP';

   const dispatch = useDispatch();
   const data = useSelector(state => state.externalTransaction?.pendingWithdraws?.pendingTransactions);
   const data2 = useSelector(state => state.externalFiatTransaction?.pendingFiatWithdraws?.pendingFiatTransactions);
   const dataBank = useSelector(state => state.externalBankTransaction?.pendingBankWithdraws?.pendingBankTransactions);
   const success = useSelector(state => state.externalTransaction?.pendingWithdraws?.success);
   const success2 = useSelector(state => state.externalFiatTransaction?.pendingFiatWithdraws.success2);
   const success3 = useSelector(state => state.externalBankTransaction?.pendingBankWithdraws.success3);
   const [loader, setLoader] = useState(false);
   const [currenciesPriceRate, setCurrenciesPriceRate] = useState([]);
   const [isCurrenciesPriceRate, setIsCurrenciesPriceRate] = useState(false);
   const roleData = useSelector(state => state?.role.role);
   const loginPermissions = roleData[0]?.permissions;
   const permissionName = getPermission(loginPermissions);

   useEffect(async () => {
      if (!isCurrenciesPriceRate) {
         await setIsCurrenciesPriceRate(true);
         var url = `https://min-api.cryptocompare.com/data/price?fsym=USDT&tsyms=${coins}&api_key=6f8e04fc1a0c524747940ce7332edd14bfbacac3ef0d10c5c9dcbe34c8ef9913`
         await axios.get(url)
            .then(res => {
               setCurrenciesPriceRate(res.data);
            })
            .catch(err => console.log("err: ", err))
      }
   }, [])

   const getRateInUsdt = (coin_symbol, amount) => {
      if (currenciesPriceRate) {
         let total_in_usdt = parseFloat(parseFloat((1 / currenciesPriceRate[coin_symbol == 'USDT' ? 'USD' : coin_symbol])) * parseFloat(amount));

         if (!isNaN(total_in_usdt)) {
            return total_in_usdt
         }
         else {
            return null;
         }
      }
      else {
         return '-'
      }
   }

   const resolveCurrentFiatWithDrawTransaction = async (id, status) => {
      await Swal.fire({
         title: `Are you sure you want to ${status === 1 ? 'Approve' : 'Decline'} it?`,
         input: 'textarea',
         inputPlaceholder: 'Enter information/comment...',
         showCloseButton: true,
         showCancelButton: true,
         confirmButtonColor: '#3085d6',
         cancelButtonColor: '#d33',
         confirmButtonText: "Yes"
      }).then((result) => {
         if (result.isConfirmed == true ? true : false) {
            const data = { resolvedStatus: status, additionalInfo: result.value ? result.value : '' };
            dispatch(resolveWithDrawFiatTransaction(id, data))
         }
      })
   }

   const resolveCurrentBankWithDrawTransaction = async (id, status) => {
      Swal.fire({
         title: `Are you sure you want to ${status === 1 ? 'Approve' : 'Decline'} it?`,
         input: 'textarea',
         inputPlaceholder: 'Enter information/comment...',
         showCloseButton: true,
         showCancelButton: true,
         confirmButtonColor: '#3085d6',
         cancelButtonColor: '#d33',
         confirmButtonText: "Yes"
      }).then((result) => {
         if (result.isConfirmed == true ? true : false) {
            const data = { resolvedStatus: status, additionalInfo: result.value ? result.value : '' };
            dispatch(resolveWithDrawBankTransaction(id, data))
         }
      })
   }

   const columns = [
      {
         name: 'Amount',
         selector: row => row?.amount,
         sortable: true,
      },
      {
         name: 'Currency',
         selector: row => row?.currency,
         sortable: true,
      },
      {
         name: 'Gas Price',
         selector: row => row?.gasPrice,
         sortable: true,
      },
      {
         name: 'User Name',
         selector: row =>
            <Link to={`/admin/user-detail/${row?.user?._id}`} className='text-decoration-none' >
               {row?.user.username}
            </Link >,
         sortable: true,
      },
      {
         name: 'In USD',
         selector: row => parseFloat(row?.amount).toFixed(2),
         cell: (row) => {
            let usdtValue = getRateInUsdt(row?.currency, row?.amount);
            if (usdtValue) {
               return (currencyFormatter.format(usdtValue.toFixed(2), { code: 'USD' }));
            }
            else {
               return '-'
            }

         },
         sortable: true,
      },
      {
         name: 'From Address',
         selector: row => row?.fromAddress,
         sortable: true,
      },
      {
         name: 'Status',
         selector: row => {
            return (
               <>
                  {row?.isResolved == 0 ?
                     <span className="badge rounded-pill bg-warning">Pending</span>
                     : row?.isResolved == 1 ?
                        <span className="badge rounded-pill bg-success">Completed</span>
                        :
                        <span className="badge rounded-pill bg-danger">Declined</span>
                  }
               </>
            );
         },
         minWidth: '200px'
      },
      {
         name: 'To Address',
         selector: row => row?.toAddress,
         sortable: true,
      },
      {
         name: 'Created At',
         selector: row =>  row?.createdAt ? (moment(row?.createdAt).format('YYYY-MM-DD HH:mm:ss')) : '',
         sortable: true,
      },
      {
         name: 'Action(s)',
         minWidth: "200px",
         cell: row => {
            return (
               <>
                  {permissionName && permissionName.length > 0 && permissionName.includes('approve_pending_transactions') ?
                     row?.isResolved == 0 ?
                        <>
                           {/* <button className="btn btn-success btn-sm me-1 p-1" onClick={() => approveAction(row?._id)}>Accept</button> 
                        <button className="btn btn-danger btn-sm me-1 p-1" onClick={() => approveAction(row?._id, 2)}>Decline</button>
                        */}
                           <button className="btn btn-success btn-sm me-1 p-1" onClick={() => resolveCurrentWithDrawTransaction(row?._id, row?.userId, 1)}>Accept</button>
                           <button className="btn btn-danger btn-sm me-1 p-1" onClick={() => resolveCurrentWithDrawTransaction(row?._id, row?.userId, 2)}>Decline</button>
                        </>
                        : 
                        ( row?.isResolved == 1 ? 
                           <button className="btn btn-danger btn-sm me-1 p-1" onClick={() => handleRevertTransaction(row?._id, row?.userId)}><FontAwesomeIcon icon={faUndo} className="header-icon text-white" /></button>
                        : <span>-</span>)
                     : null
                  }
               </>
            );
         },
      }
   ];

   const columnsCards = [
      {
         name: 'Amount',
         selector: row => row?.amount,
         sortable: true,
      },
      {
         name: 'Currency',
         selector: row => row?.currency,
         sortable: true,
      },
      {
         name: 'User Name',
         selector: row =>
            <Link to={`/admin/user-detail/${row?.user?._id}`} className='text-decoration-none' >
               {row?.user.username}
            </Link >,
         sortable: true,
      },
      {
         name: 'In USD',
         selector: row => parseFloat(row?.amount).toFixed(2),
         cell: (row) => {
            let usdtValue = getRateInUsdt(row?.currency, row?.amount);
            if (usdtValue) {
               return (currencyFormatter.format(usdtValue.toFixed(2), { code: 'USD' }));
            }
            else {
               return '-'
            }

         },
         sortable: true,
      },
      // {
      //    name: 'From Address',
      //    selector: row => row?.fromAddress,
      //    sortable: true,
      // },
      {
         name: 'To Card',
         selector: row => row?.toCard,
         sortable: true,
      },
      {
         name: 'Status',
         selector: row => {
            return (
               <>
                  {row?.isResolved == 0 ?
                     <span className="badge rounded-pill bg-warning">Pending</span>
                     : row?.isResolved == 1 ?
                        <span className="badge rounded-pill bg-success">Completed</span>
                        :
                        <span className="badge rounded-pill bg-danger">Declined</span>
                  }
               </>
            );
         },
         minWidth: '200px'
      },
      {
         name: 'Created At',
         selector: row =>  row?.createdAt ? (moment(row?.createdAt).format('YYYY-MM-DD HH:mm:ss')) : '',
         //sortable: true,
      },
      {
         name: 'Action(s)',
         minWidth: "200px",
         cell: row => {
            return (
               <>
                  {permissionName && permissionName.length > 0 && permissionName.includes('approve_pending_transactions') ?
                     row?.isResolved == 0 ?
                        <>
                           <button className="btn btn-success btn-sm me-1 p-1" onClick={() => resolveCurrentFiatWithDrawTransaction(row?._id, 1)}>Accept</button>
                           <button className="btn btn-danger btn-sm me-1 p-1" onClick={() => resolveCurrentFiatWithDrawTransaction(row?._id, 2)}>Decline</button>
                        </>
                        : <span>-</span>

                     : null
                  }
               </>
            );
         },
      }
   ];

   const columnsBanks = [
      {
         name: 'Amount',
         selector: row => row?.amount,
         sortable: true,
      },
      {
         name: 'Currency',
         selector: row => row?.currency,
         sortable: true,
      },
      // {
      //    name: 'Gas Price',
      //    selector: row => row?.gasPrice,
      //    sortable: true,
      // },
      {
         name: 'User Name',
         selector: row =>
            <Link to={`/admin/user-detail/${row?.user?._id}`} className='text-decoration-none' >
               {row?.user.username}
            </Link >,
         sortable: true,
      },
      {
         name: 'In USD',
         selector: row => parseFloat(row?.amount).toFixed(2),
         cell: (row) => {
            let usdtValue = getRateInUsdt(row?.currency, row?.amount);
            if (usdtValue) {
               return (currencyFormatter.format(usdtValue.toFixed(2), { code: 'USD' }));
            }
            else {
               return '-'
            }

         },
         sortable: true,
      },
      // {
      //    name: 'From Address',
      //    selector: row => row?.fromAddress,
      //    sortable: true,
      // },
      {
         name: 'Iban',
         selector: row => row?.toIban,
         sortable: true,
      },
      {
         name: 'Account Number',
         selector: row => row?.toAccountNumber,
         sortable: true,
      },
      // {
      //    name: 'Bank Name',
      //    selector: row => row?.toBankName,
      //    sortable: true,
      // },
      {
         name: 'Swift Code',
         selector: row => row?.toSwiftCode,
         sortable: true,
      },
      // {
      //    name: 'Bank Address',
      //    selector: row => row?.toBankAddress,
      //    sortable: true,
      // },
      {
         name: 'Status',
         selector: row => {
            return (
               <>
                  {row?.isResolved == 0 ?
                     <span className="badge rounded-pill bg-warning">Pending</span>
                     : row?.isResolved == 1 ?
                        <span className="badge rounded-pill bg-success">Completed</span>
                        :
                        <span className="badge rounded-pill bg-danger">Declined</span>
                  }
               </>
            );
         },
         minWidth: '200px'
      },
      {
         name: 'Created At',
         selector: row =>  row?.createdAt ? (moment(row?.createdAt).format('YYYY-MM-DD HH:mm:ss')) : '',
         sortable: true,
      },
      {
         name: 'Action(s)',
         minWidth: "200px",
         cell: row => {
            return (
               <>
                  {permissionName && permissionName.length > 0 && permissionName.includes('approve_pending_transactions') ?
                     row?.isResolved == 0 ?
                        <>
                           <button className="btn btn-success btn-sm me-1 p-1" onClick={() => resolveCurrentBankWithDrawTransaction(row?._id, 1)}>Accept</button>
                           <button className="btn btn-danger btn-sm me-1 p-1" onClick={() => resolveCurrentBankWithDrawTransaction(row?._id, 2)}>Decline</button>
                        </>
                        : <span>-</span>

                     : null
                  }
               </>
            );
         },
      }
   ];

   useEffect(() => {
      setLoader(true);
      dispatch(getPendingWithdraws());
      dispatch(getPendingFiatWithdraws());
      dispatch(getPendingBankWithdraws());
      if (success) {
         setLoader(false);
      }
      else if (success2) {
         setLoader(false);
      }
      else if (success3) {
         setLoader(false);
      }
   }, [success, success2, success3]);

   useEffect(() => {
      const loginData = localStorage.getItem('user');
      const data = JSON.parse(loginData);
      const id = data?.roleId;
      dispatch(getRole(id));
   }, [])

   const approveAction = (id) => {
      Swal.fire({
         title: `Are you sure want to Approve it?`,
         html: '',
         showCloseButton: true,
         showCancelButton: true,
         confirmButtonColor: '#3085d6',
         cancelButtonColor: '#d33',
         confirmButtonText: "Yes"
      }).then((result) => {
         if (result.isConfirmed == true ? true : false) {
            dispatch(approvePendingTransaction(id))
         }
      })
   }

   const resolveCurrentWithDrawTransaction = async (rowId, userId, status) => {
      Swal.fire({
         title: `Are you sure you want to ${status === 1 ? 'Approve' : 'Decline'} it?`,
         input: 'textarea',
         inputPlaceholder: 'Enter information/comment...',
         showCloseButton: true,
         showCancelButton: true,
         confirmButtonColor: '#3085d6',
         cancelButtonColor: '#d33',
         confirmButtonText: "Yes"
      }).then((result) => {
         if (result.isConfirmed == true ? true : false) {
            const data = { userId: userId, resolvedStatus: status, additionalInfo: result.value ? result.value : '' };

            return Promise.resolve(
               dispatch(resolveWithDrawTransaction(rowId, data, false)))
               .then(
                  () => dispatch(getPendingWithdraws())
               ).catch(error => {
                  console.log(error, "resolveCurrentWithDrawTransaction");
               });
         }
      })
   }

   const handleRevertTransaction = async (rowId, userId) => {
      Swal.fire({
          title: `Are you sure you want to Revert the transaction?`,
          html: '',
          showCloseButton: true,
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: "Yes"
      }).then((result) => {
          if (result.isConfirmed === true) {
              const data = { userId: userId};
              return Promise.resolve(
                  dispatch(revertTransaction(rowId, data, false)))
                  .then(
                     () => dispatch(getPendingWithdraws())
                  ).catch(error => {
                     console.log(error, "revertCurrentwithdrawTransaction");
                  });
          }
      })
  }

   return (
      <>
         {loader ? <FullPageTransparentLoader /> :
            <>
               {
                  console.log(data2,"CARD Withdraws data")
               }
               <div className="content-wrapper right-content-wrapper">
                  <div className="content-box">
                     <h3>Crypto Withdraws</h3>
                     <DataTable
                        columns={columns}
                        data={data}
                        pagination
                        fixedHeader
                        persistTableHead
                        highlightOnHover
                        //defaultSortFieldId={1}
                        theme="solarizedd"
                     />
                  </div>
                  <div className="content-box">
                     <h3>Card Withdraws</h3>
                     <DataTable
                        columns={columnsCards}
                        data={data2}
                        pagination
                        fixedHeader
                        persistTableHead
                        highlightOnHover
                        //defaultSortFieldId={1}
                        theme="solarizedd"
                     />
                  </div>
                  <div className="content-box">
                     <h3>Bank Withdraws</h3>
                     <DataTable
                        columns={columnsBanks}
                        data={dataBank}
                        pagination
                        fixedHeader
                        persistTableHead
                        highlightOnHover
                        //defaultSortFieldId={1}
                        theme="solarizedd"
                     />
                  </div>
               </div>
            </>
         }
      </>
   )
}

export default PendingWithdraws