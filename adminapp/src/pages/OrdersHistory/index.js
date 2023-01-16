import React, { useState, useMemo, useEffect } from 'react';
import DataTable, { createTheme } from 'react-data-table-component';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faColumns, faCross, faDownload, faFilter, faPlusCircle, faRefresh, faUsers } from '@fortawesome/free-solid-svg-icons';
import FilterComponent from '../../components/FilterComponent';
import { useDispatch, useSelector } from 'react-redux';
import { getLeverageOrders } from '../../redux/leverageOrder/leverageOrderActions';
import FullPageTransparentLoader from '../FullPageTransparentLoader/fullPageTransparentLoader';
import { Link } from 'react-router-dom';

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

const Index = () => {

   const [filterText, setFilterText] = useState('');
   const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
   const [loader, setLoader] = useState(false);

   const dispatch = useDispatch();
   const orders = useSelector(state => state.LeverageOrders?.orders?.orders);
   const success = useSelector(state => state.LeverageOrders?.orders?.success);


   useEffect(() => {
      setLoader(true)
      dispatch(getLeverageOrders());
   }, [])

   useEffect(() => {
      if (success) setLoader(false)
   }, [success])

   const columns = [
      {
         name: 'User',
         selector: row =>
            <Link to={`/admin/user-detail/${row?.user?._id}`} className='text-decoration-none text-white' >
               {row?.user.username}
            </Link >,
         sortable: true,
      },
      {
         name: 'Type',
         selector: row => row?.marginType == 1 ? "Isolated" : "Cross",
         sortable: true,
      },
      {
         name: 'Trading Pair',
         selector: row => row?.fromCurrency.symbol + row?.toCurrency.symbol,
         sortable: true,
      },
      {
         name: 'Trading Type',
         selector: row => row?.tradeType == 1 ? "Buy" : "Sell",
         sortable: true,
      },
      {
         name: 'Trading volume',
         selector: row => (parseFloat(row?.userInvestedAmount + (row?.leverage * row?.userInvestedAmount))).toFixed(4),
         sortable: true,
      },
      // {
      //   name: 'Total Fee',
      //   selector: row => "0.00000",
      //   sortable: true,
      // },
      {
         name: 'Total Fee Paid',
         selector: row => row?.tradingFeePaid ? row?.tradingFeePaid : 0,
         sortable: true,
      },
      // {
      //   name: 'Rebate Ration',
      //   selector: row => "0", // TBA
      //   sortable: true,
      // },
      {
         name: 'Profit/Loss',
         selector: row => row?.tradeProfitOrLoss ? row?.tradeProfitOrLoss : 0,
         sortable: true,
      },
      {
         name: 'Start Time',
         selector: row => row?.createdAt.replace('T', ' ').replace('Z', ' '),
         sortable: true,
      },
      {
         name: 'End Time',
         selector: row => row?.updatedAt.replace('T', ' ').replace('Z', ' '),
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


   // const columns = [
   //    {
   //       name: 'ID',
   //       selector: row => {
   //          return (
   //             <></>
   //          )
   //       }
   //    },
   //    {
   //       name: 'Type',
   //       selector: row => {

   //       },
   //       cell: (row) => {
   //          return (
   //             <></>
   //          );
   //       },
   //       sortable: true,
   //    },
   //    {
   //       name: 'Symbol',
   //       selector: row => {
   //          return (
   //             <>

   //             </>
   //          )
   //       },
   //       sortable: true,
   //    },
   //    {
   //       name: 'Open Price',
   //       selector: row => {
   //          return (
   //             <>
   //             </>
   //          )
   //       },
   //       sortable: true,
   //    },
   //    {
   //       name: 'Volume',
   //       selector: row => <></>,
   //       sortable: true,
   //    },
   //    {
   //       name: 'Time Opened',
   //       selector: row => {
   //          return (
   //             <>

   //             </>
   //          )
   //       },
   //       sortable: true,
   //    },
   //    {
   //       name: 'Time Closed',
   //       selector: row => {
   //          return (
   //             <>

   //             </>
   //          )
   //       },
   //       sortable: true,
   //    },
   //    {
   //       name: 'Profit',
   //       selector: row => {
   //          return (
   //             <></>
   //          )
   //       },
   //       sortable: true,
   //    },
   //    {
   //       name: 'Swap',
   //       selector: row => {
   //          return (
   //             <></>
   //          )
   //       },
   //       sortable: true,
   //    },
   //    {
   //       name: 'Commision',
   //       selector: row => {
   //          return (
   //             <></>
   //          )
   //       },
   //       sortable: true,
   //    },
   //    {
   //       name: 'Actions',
   //       selector: row => {
   //          return (
   //             <></>
   //          )
   //       },
   //       sortable: true,
   //    },
   // ];

   return (

      <>
         {loader ? <FullPageTransparentLoader /> :
            <>
               {/* <div className="col-lg-9 col-md-8"> */}
               <div className="content-wrapper right-content-wrapper">
                  <div className="content-box">
                     {/* <h3>Trade History</h3> */}
                     <div className='table-responsive'>
                        <DataTable
                           title="History"
                           columns={columns}
                           data={
                              'isolated'.includes(filterText.toLowerCase()) ?
                                 orders?.filter(row => (row?.marginType == 1))
                                 :
                                 'cross'.includes(filterText.toLowerCase()) ?
                                    orders?.filter(row => (row?.marginType != 1))
                                    :
                                    'buy'.includes(filterText.toLowerCase()) ?
                                       orders?.filter(row => (row?.tradeType == 1))
                                       :
                                       'sell'.includes(filterText.toLowerCase()) ?
                                          orders?.filter(row => (row?.tradeType != 1))
                                          :
                                          orders?.filter(row => (row.user.username.toLowerCase()?.includes(filterText.toLowerCase()) ||
                                             (row?.fromCurrency.symbol + row?.toCurrency.symbol).toLowerCase().includes(filterText.toLowerCase()) ||
                                             (row?.tradingFeePaid ? row?.tradingFeePaid : "0").toString().includes(filterText) ||
                                             (row?.tradeProfitOrLoss ? row?.tradeProfitOrLoss : '0').toString().includes(filterText) ||
                                             (parseFloat(row?.userInvestedAmount + (row?.leverage * row?.userInvestedAmount))).toFixed(4).toString().includes(filterText)
                                          ))
                           }
                           pagination
                           paginationResetDefaultPage={resetPaginationToggle}
                           subHeader
                           subHeaderComponent={subHeaderComponentMemo}
                           fixedHeader
                           persistTableHead
                           highlightOnHover
                           theme="solarizedd"
                        />
                     </div>
                  </div>
               </div>
               {/* </div> */}
            </>
         }
      </>


      // <>
      //    <div className="content-wrapper right-content-wrapper open-orders">
      //       <div className="content-box">
      //          <h4>Orders History</h4>
      //          <div className='action-btns'>
      //             <Button className='btn-default' variant=""><FontAwesomeIcon icon={faDownload} />Download</Button>{' '}
      //             <Button className='btn-default' variant=""><FontAwesomeIcon icon={faFilter} />Filter</Button>{' '}
      //             <Button className='btn-default' variant=""><FontAwesomeIcon icon={faCross} />Clear</Button>{' '}
      //             <Button className='btn-default' variant=""><FontAwesomeIcon icon={faColumns} />Columns</Button>{' '}
      //             <Button className='btn-default' variant=""><FontAwesomeIcon icon={faRefresh} />Refresh</Button>{' '}
      //          </div>
      //          <DataTable
      //             columns={columns}
      //             pagination
      //             highlightOnHover
      //             subHeader
      //             persistTableHead
      //             theme="solarizedd"
      //          />
      //       </div>
      //    </div>
      // </>
   )
}

export default Index