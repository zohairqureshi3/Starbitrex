import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { displayTransactions } from '../../redux/transactions/transactionActions';
import FullPageTransparentLoader from "../FullPageTransparentLoader/fullPageTransparentLoader";
import DataTable, { createTheme } from 'react-data-table-component';
import { Form } from 'react-bootstrap';



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



const Transactions = () => {
   const [loader, setLoader] = useState(false);

   const dispatch = useDispatch();
   const transactionsData = useSelector(state => state.transaction.transactions);
   const [type, setType] = useState("Internal");
   const fetched = useSelector(state => state.transaction.fetched);

   const [filterText, setFilterText] = React.useState('');
   const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);

   const subHeaderComponentMemo = React.useMemo(() => {
      const handleClear = () => {
         if (filterText) {
            setResetPaginationToggle(!resetPaginationToggle);
            setFilterText('');
         }
      };
   }, [filterText, resetPaginationToggle]);

   useEffect(() => {
      setLoader(true);
      dispatch(displayTransactions());
      if (fetched) {
         setLoader(false);
      }
   }, [fetched]);

   const columns = [
      {
         name: 'Amount',
         selector: row => row.amount,
         sortable: true,
      },
      {
         name: 'Currency',
         selector: row => row.currencies.name,
         sortable: true,
      },
      {
         name: 'From Account',
         selector: row => row.fromAccount.username,
         sortable: true,
      },
      {
         name: 'To Account',
         selector: row => row.toAccount.username,
         sortable: true,
      },
   ];

   return (
      <>
         {loader ? <FullPageTransparentLoader /> :
            <>
               {/* <div className="col-lg-9 col-md-8"> */}
               <div className="content-wrapper right-content-wrapper">
                  <div className="content-box">
                     <h3>Transactions Details</h3>
                     <br /> <br />
                     <div>
                        {/* <form>
                           <div className="form-group col-md-12">
                              <select className="form-control" name="type" required="required" onChange={e => setType(e.target.value)} value={type} >
                                 <option value="Internal">Internal</option>
                                 <option value="External">External</option>
                              </select>
                           </div>
                        </form> */}
                        <div className="form-group col-md-12 mb-3">
                           <label className="control-label">Select Transactions</label>
                           <Form.Select name="type" required="required" onChange={e => setType(e.target.value)} value={type}>
                              <option value="Internal">Internal</option>
                              <option value="External">External</option>
                           </Form.Select>
                        </div>
                     </div>
                     <DataTable
                        columns={columns}
                        data={transactionsData}
                        pagination
                        paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
                        subHeader
                        // fixedHeader
                        subHeaderComponent={subHeaderComponentMemo}
                        persistTableHead
                        highlightOnHover
                        defaultSortFieldId={1}
                        theme="solarizedd"
                     />
                     {/* <Table responsive>
                        <thead>
                           <tr>
                              <th>Amount</th>
                              <th>Currency</th>
                              <th>From Account</th>
                              <th>To Account</th>
                           </tr>
                        </thead>
                        <tbody>
                           {transactionsData && transactionsData.length > 0 && transactionsData.map((transaction) => {
                              return (
                                 <tr key={transaction._id}>
                                    <td>{transaction.amount}</td>
                                    <td>{transaction.currencies.name}</td>
                                    <td>{transaction.fromAccount.username}</td>
                                    <td>
                                       <Link to={`/admin/user-detail/${transaction.toAccount._id}`}>{transaction.toAccount.username}</Link>
                                    </td>
                                 </tr>
                              )
                           })}
                        </tbody>
                     </Table> */}
                  </div>
               </div>
               {/* </div> */}
            </>
         }
      </>
   )
}

export default Transactions