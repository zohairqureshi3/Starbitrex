import React, { useState, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import FilterComponent from '../../components/FilterComponent';

const CommissionStatistics = () => {

   const [filterText, setFilterText] = useState('');
   const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

   const columns = [
      {
         name: 'User',
         selector: row => "User Name with link to the user detail",
         sortable: true,
      },
      {
         name: 'Type',
         selector: row => "Cross/Isolated",
         sortable: true,
      },
      {
         name: 'Trading Pair',
         selector: row => "BTCUSDT",
         sortable: true,
      },
      {
         name: 'Trading Type',
         selector: row => "Buy/Sell",
         sortable: true,
      },
      {
         name: 'Trading volume',
         selector: row => "0.00000",
         sortable: true,
      },
      {
         name: 'Total Fee',
         selector: row => "0.00000",
         sortable: true,
      },
      {
         name: 'Total Fee Paid',
         selector: row => "0.00000",
         sortable: true,
      },
      {
         name: 'Rebate Ration',
         selector: row => "0.00000", // TBA
         sortable: true,
      },
      {
         name: 'Total Commission',
         selector: row => "0.00000",
         sortable: true,
      },

      {
         name: 'Start Time',
         selector: row => "2022-03-22 08:30:00",
         sortable: true,
      },
      {
         name: 'End Time',
         selector: row => "2022-03-22 08:30:00",
         sortable: true,
      }
   ]

   const subHeaderComponentMemo = useMemo(() => {
      const handleClear = () => {
         if (filterText) {
            setResetPaginationToggle(!resetPaginationToggle);
            setFilterText('');
         }
      };

      return (
         <FilterComponent onFilter={e => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} />
      );
   }, [filterText, resetPaginationToggle]);

   return (
      <>
         <div className="col-lg-9 col-md-8">
            <div className="content-wrapper">
               <div className="content-box">
                  <h5>Commission Statistics</h5>
                  <br />
                  <p>Total Comm(USDT): 6915.2119</p>
                  <br />
                  <div>
                     <table className="table mt-3 table-responsive table">
                        <thead className="table_head">
                           <tr>
                              <th>Type</th>
                              <th>Trading</th>
                              <th>Coin</th>
                              <th>Total Comm</th>
                           </tr>
                        </thead>
                        <tbody>
                           <tr>
                              <td>USDT</td>
                              <td>BTCUSDT</td>
                              <td>USDT</td>
                              <td>1387.062</td>
                           </tr>
                        </tbody>
                     </table>
                  </div>
                  <br />
                  <div className='table-responsive'>
                     <DataTable
                        columns={columns}
                        data={columns}
                        pagination
                        paginationResetDefaultPage={resetPaginationToggle}
                        subHeader
                        subHeaderComponent={subHeaderComponentMemo}
                        fixedHeader
                        persistTableHead
                     />
                  </div>
               </div>
            </div>
         </div>
      </>
   )
}

export default CommissionStatistics