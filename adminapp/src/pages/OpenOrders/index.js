import React, { useState, useEffect } from "react";
import DataTable, { createTheme } from 'react-data-table-component';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faColumns, faCross, faDownload, faFilter, faPlusCircle, faRefresh, faUsers } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from "react-redux";
//import { getUserSpotOrders, stopSpotOrder } from "../../../redux/spotOrder/spotOrderActions";

import { getSpotOrders } from '../../redux/spotOrder/spotOrderActions';



const Index = () => {

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

   const dispatch = useDispatch();

   const userSpotOrders = useSelector((state) => state.spotOrder?.spotOrders);



   useEffect(() => {

      const callInit = async () => {

         //await dispatch(getUserLeverageOrders(id));

         let searchField = '?' + new URLSearchParams({ status: 1 } ).toString();
         await dispatch(getSpotOrders(searchField));
      }

      callInit();

   }, []);


   const spotOrders = [
      {
         name: (
            <div>
              Spot Pairs
              <input
                type="text"
                placeholder="Title"
                value=""
                //onChange={(e) => onChange(e)}
                style={{ width: "80%" }}
              />
            </div>
          ),
         selector: row => row?.spotPair,
         sortable: true,
      },
      {
         name: 'Order Type',
         selector: row => row?.marketOrder == "1" ? "Market" : "Limit",
         sortable: true,
      },
      {
         name: 'Direction',
         selector: row => row?.tradeType ? "Buy" : "Sell",
         sortable: true,
      },
      {
         name: 'Order Value',
         selector: row => (parseFloat(parseFloat(row?.investedQty) * parseFloat(row?.tradeStartPrice)).toFixed(3)) + " " + 'USDT',
         sortable: true,
      },
      {
         name: 'Order Qty',
         selector: row => parseFloat(row?.investedQty).toFixed(3) + ' ' + row?.spotPair?.replace('USDT', ''),
         sortable: true,
      },
      {
         name: 'Order Price',
         selector: row => row?.tradeStartPrice + " " + 'USDT',
         sortable: true,
      },
      {
         name: 'Unfilled Qty',
         selector: row => parseFloat(row?.investedQty).toFixed(3) + ' ' + row?.spotPair?.replace('USDT', ''),
         sortable: true,
      },
      {
         name: 'Order Time',
         selector: row => row?.createdAt.replace('T', ' ').replace('Z', ' '),
         sortable: true,
      },
      {
         name: 'Order ID',
         selector: row => row?._id,
         sortable: true,
      },
      // {
      //     name: 'Action',
      //     selector: row => <span>
      //         {/* <button className="btn btn-danger btn-sm me-1 p-1" onClick={() => { setSpotOrderId(row?._id); handleCancelOrder(row?._id) }}>Cancel</button> */}
      //     </span >
      // }
   ]



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
   //       name: 'SL',
   //       selector: row => {
   //          return (
   //             <></>
   //          )
   //       },
   //       sortable: true,
   //    },
   //    {
   //       name: 'TP',
   //       selector: row => {
   //          return (
   //             <></>
   //          )
   //       },
   //       sortable: true,
   //    },
   //    {
   //       name: 'PNL',
   //       selector: row => {
   //          return (
   //             <></>
   //          )
   //       },
   //       sortable: true,
   //    },
   //    {
   //       name: 'SWAP',
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
   //       name: 'Action',
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
         <div className="content-wrapper right-content-wrapper open-orders">
            <div className="content-box">
               <h4>Open Orders</h4>
               <div className='action-btns'>
                  <Button className='mb-1' variant="success"><FontAwesomeIcon icon={faPlusCircle} />New Order</Button>{' '}
                  <Button className='btn-default mb-1' variant=""><FontAwesomeIcon icon={faDownload} />Download</Button>{' '}
                  <Button className='btn-default mb-1' variant=""><FontAwesomeIcon icon={faFilter} />Filter</Button>{' '}
                  <Button className='btn-default mb-1' variant=""><FontAwesomeIcon icon={faCross} />Clear</Button>{' '}
                  <Button className='btn-default mb-1' variant=""><FontAwesomeIcon icon={faColumns} />Columns</Button>{' '}
                  <Button className='btn-default mb-1' variant=""><FontAwesomeIcon icon={faRefresh} />Refresh</Button>{' '}
               </div>
               {
                  userSpotOrders && userSpotOrders.filter(row => row.status == 1).length > 0 ?
                     <DataTable
                        title="Spot Orders"
                        columns={spotOrders}
                        data={userSpotOrders}
                        pagination
                        fixedHeader
                        subHeader
                        persistTableHead
                        theme='solarizedd'
                     />
                     :
                     null
               }
            </div>
         </div>
      </>
   )
}

export default Index