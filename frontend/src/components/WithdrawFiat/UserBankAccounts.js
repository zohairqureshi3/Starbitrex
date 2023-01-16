import React, { useEffect, useState } from 'react'
import { deleteBankAccount, getBankAccounts } from '../../redux/bankAccounts/bankAccountActions';
import { useDispatch, useSelector } from "react-redux";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClone } from '@fortawesome/free-solid-svg-icons';
import DataTable, { createTheme } from "react-data-table-component";
import { toast } from 'react-toastify';

const UserBankAccounts = () => {

   createTheme(
      "solarizedd",
      {
         text: {
            primary: "#fff",
            secondary: "#fff",
         },
         background: {
            default: "rgba(33, 34, 46, 1)",
         },
         context: {
            background: "rgba(33, 34, 46, 1)",
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

   const dispatch = useDispatch();
   const bankAccounts = useSelector((state) => state.bankAccounts.bankAccounts);
   const userId = useSelector((state) => state.user.user._id);
   console.log(bankAccounts, "bankAccounts");
   useEffect(() => {
      if (userId)
         dispatch(getBankAccounts(userId));
   }, [userId]);

   const columnsBanks = [
      {
         name: 'Bank Name',
         selector: row => row?.name,
         sortable: true,
      },
      {
         name: 'Iban',
         selector: row => {
            return (
               <>
                  <CopyToClipboard text={row?.iban}>
                     <span>
                        {row?.iban.slice(0, 4)}...{row?.iban.slice(row?.iban.length - 4, row?.iban.length)}
                        <FontAwesomeIcon icon={faClone} onClick={() => copyReferral()} className="ms-2" />
                     </span>
                  </CopyToClipboard>
               </>
            );
         },
      },
      {
         name: 'Account Number',
         selector: row => {
            return (
               <>
                  <CopyToClipboard text={row?.accountNumber}>
                     <span>
                        {row?.accountNumber.slice(0, 4)}...{row?.accountNumber.slice(row?.accountNumber.length - 4, row?.accountNumber.length)}
                        <FontAwesomeIcon icon={faClone} onClick={() => copyReferral()} className="ms-2" />
                     </span>
                  </CopyToClipboard>
               </>
            );
         },
      },
      {
         name: 'Bank Address',
         selector: row => row?.bankAddress,
         sortable: true,
      },
      {
         name: 'Swift Code',
         selector: row => row?.swiftCode,
         sortable: true,
      },
      // {
      //    name: 'Wallet Type',
      //    selector: row => "Withdrawal",
      //    sortable: true,
      // },
      {
         name: 'Date',
         selector: row => formatDate(new Date(row?.createdAt)),
         sortable: true,
      },
      {
         name: 'Action',
         selector: row => {
            return (
               <>
                  <button className="btn btn-danger btn-sm me-1 p-1" onClick={() => deleteAction(row._id)}>Delete</button>
               </>
            );
         },
      }
   ];

   const padTo2Digits = (num) => {
      return num.toString().padStart(2, '0');
   }

   const formatDate = (date) => {
      return (
         [
            date.getFullYear(),
            padTo2Digits(date.getMonth() + 1),
            padTo2Digits(date.getDate()),
         ].join('-') +
         ' ' +
         [
            padTo2Digits(date.getHours()),
            padTo2Digits(date.getMinutes()),
            padTo2Digits(date.getSeconds()),
         ].join(':')
      );
   }

   const copyReferral = () => {
      toast.success('Successfully copied!');
   }
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
            dispatch(deleteBankAccount(id))
         }
      })
   }

   return (
      <>
         <DataTable
            columns={columnsBanks}
            data={bankAccounts}
            pagination
            fixedHeader
            persistTableHead
            theme='solarizedd'
         />
      </>
   )
}

export default UserBankAccounts