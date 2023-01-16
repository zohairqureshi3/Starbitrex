import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { showAdminBalance } from "../../redux/users/userActions";
import DataTable from 'react-data-table-component';

const AdminAccountBalance = () => {

   const dispatch = useDispatch();
   const accountBalanceData = useSelector(state => state.users?.adminBalance?.dashboardInfo)

   useEffect(() => {
      dispatch(showAdminBalance())
   }, []);

   const columns = [
      {
         name: 'Currency',
         selector: row => "abc",
         sortable: true,
      },
      {
         name: 'Symbol',
         selector: row => "abc",
         sortable: true,
      },
      {
         name: 'Amount',
         selector: row => "0.005",
         sortable: true,
      },
   ];

   return (
      <>
         <DataTable
            columns={columns}
            data={accountBalanceData}
            fixedHeader
            persistTableHead
            highlightOnHover
         />
      </>
   )
}

export default AdminAccountBalance