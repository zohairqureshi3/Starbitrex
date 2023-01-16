import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSentAmountToUser } from "../../redux/users/userActions";
import DataTable, { createTheme } from 'react-data-table-component';
import ReactTooltip from 'react-tooltip';
import FullPageTransparentLoader from "../FullPageTransparentLoader/fullPageTransparentLoader";

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

const SentAmountToUsers = () => {

   const dispatch = useDispatch();
   const transactionData = useSelector((state, index) => state.users?.sentAmountToUser?.transactions);
   const paginationData = useSelector((state, index) => state.users?.sentAmountToUser?.pagination);
   console.log("paginationData", paginationData);
   const [loader, setLoader] = useState(false);
   // transactionData?.forEach((val, index) => {
   //    console.log("abc", val, index);
   //    let number = index;
   // });

   const [pageNumber, setPageNumber] = useState(0);

   useEffect(() => {
      setLoader(true);
      dispatch(getSentAmountToUser())
   }, []);

   useEffect(() => {
      if (transactionData) {
         setLoader(false);
      }
   }, [transactionData])

   const onChange = (page) => {
      setPageNumber(page - 1)
   }

   const columns = [
      {
         name: '#',
         selector: (row, index) => (10 * pageNumber) + index + 1
      },
      {
         name: 'Name',
         selector: row => row?.toAccount.username,
         sortable: true,
      },
      {
         name: 'Email',
         selector: row => {
            return (
               <>
                  <span data-tip={row?.toAccount.email}>{row?.toAccount.email}</span>
                  <ReactTooltip />
               </>
            )
         },
         sortable: true,
      },
      {
         name: 'Currency',
         selector: row => row?.currencies.name,
         sortable: true,
      },
      {
         name: 'Symbol',
         selector: row => row?.currencies.symbol,
         sortable: true,
      },
      {
         name: 'Amount Sent',
         selector: row => row?.amount,
         sortable: true,
      },
      {
         name: 'Sent At',
         selector: row => row?.createdAt.replace('T', ' ').replace('Z', ' '),
         sortable: true,
      },
   ];

   return (
      <>
         {/* {loader ? <FullPageTransparentLoader /> : */}
         <div className="content-wrapper">
            <DataTable
               columns={columns}
               data={transactionData}
               pagination
               fixedHeader
               persistTableHead
               highlightOnHover
               onChangePage={onChange}
               theme="solarizedd"
            />
         </div>
         {/* } */}
      </>
   )
}

export default SentAmountToUsers