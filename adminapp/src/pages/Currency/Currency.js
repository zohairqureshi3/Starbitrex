import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCurrency, showAllCurrencies } from '../../redux/currency/currencyActions';
import { getRole } from '../../redux/roles/roleActions';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getPermission } from "../../config/helpers";
import FullPageTransparentLoader from "../FullPageTransparentLoader/fullPageTransparentLoader";
import ETH from '../../assets/images/ETH.svg';
import XRP from '../../assets/images/XRP.png';
import USDT from '../../assets/images/USDT.png';
import BTC from '../../assets/images/BTC.svg';
import LTC from '../../assets/images/LTC.svg';
import ADA from '../../assets/images/ADA.svg';
import TRX from '../../assets/images/TRX.svg';
import BCH from '../../assets/images/BCH.svg';
import DOGE from '../../assets/images/DOGE.svg';
import BNB from '../../assets/images/BNB.svg';
import AVAX from '../../assets/images/AVAX.svg';
import USDC from '../../assets/images/USDC.svg';
import LINK from '../../assets/images/LINK.svg';
import EUR from '../../assets/images/EUR.png';
import CAD from '../../assets/images/CAD.png';
import NZD from '../../assets/images/NZD.png';
import AUD from '../../assets/images/AUD.png';
import USD from '../../assets/images/USD.png';
import CNF from '../../assets/images/CoinNotFound.png';


const Currency = () => {

   const [loader, setLoader] = useState(false);
   const dispatch = useDispatch();
   const currencies = useSelector(state => state.currency?.currencies?.allCurrencies);
   const roleData = useSelector(state => state.role?.role);
   const permissions = roleData[0]?.permissions;

   const permissionName = getPermission(permissions);
   const success = useSelector(state => state.currency?.currencies?.success);

   const getCoinImg = (name) => {
      if (name == 'ETH')
         return ETH;
      else if (name == 'BTC')
         return BTC;
      else if (name == 'XRP')
         return XRP;
      else if (name == 'USDT')
         return USDT;
      else if (name == 'LTC')
         return LTC;
      else if (name == 'DOGE')
         return DOGE;
      else if (name == 'ADA')
         return ADA;
      else if (name == 'TRX')
         return TRX;
      else if (name == 'BCH')
         return BCH;
      else if (name == 'BNB')
         return BNB;
      else if (name == 'TBNB')
         return BNB;
      else if (name == 'AVAX')
         return AVAX;
      else if (name == 'USDC')
         return USDC;
      else if (name == 'LINK')
         return LINK;
      else if (name == 'EUR')
         return EUR;
      else if (name == 'CAD')
         return CAD;
      else if (name == 'NZD')
         return NZD;
      else if (name == 'AUD')
         return AUD;
      else if (name == 'USD')
         return USD;

      return CNF;
   };

   useEffect(async () => {
      setLoader(true);
      await dispatch(showAllCurrencies());
      if (success) {
         setLoader(false);
      }
   }, [success]);

   useEffect(async () => {
      const loginData = localStorage.getItem('user');
      const data = JSON.parse(loginData);
      const id = data?.roleId;
      await dispatch(getRole(id));
   }, [])

   const deleteAction = (id) => {
      Swal.fire({
         title: `Are you sure you want to Delete?`,
         html: '',
         showCloseButton: true,
         showCancelButton: true,
         confirmButtonColor: '#3085d6',
         cancelButtonColor: '#d33',
         confirmButtonText: "Yes"
      }).then(async (result) => {
         if (result.isConfirmed == true ? true : false) {
            await dispatch(deleteCurrency(id));
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
                     <h3>Currencies Details</h3>
                     {
                        permissionName && permissionName.length > 0 && permissionName.includes('add_currency') ?
                           <Link to='/admin/add-currency'><button className="btn btn-default">Add Currency</button></Link>
                           :
                           null
                     }
                     <div className="mt-3 table-responsive">
                        <table className="table">
                           <thead className="table_head">
                              <tr>
                                 <th>Name</th>
                                 <th>Symbol</th>
                                 <th>Min Con</th>
                                 <th>Max Con</th>
                                 <th>Con Fee(%)</th>
                                 <th>Color</th>
                                 {/* <th>Currency Icon</th> */}
                                 {
                                    permissionName && permissionName.length > 0 && permissionName.includes('edit_currency', 'delete_currency') ?
                                       <th>Action(s)</th>
                                       :
                                       null
                                 }
                              </tr>
                           </thead>
                           <tbody>
                              {currencies && currencies?.length > 0 && currencies?.filter(row => row?.isFiat != true && row?.status == true)?.map((currency) => {
                                 return (
                                    <tr key={currency._id}>
                                       <td><img src={getCoinImg(currency?.symbol)} alt="" className="img-fluid coin-img pe-1" width={"44px"} height={"44px"} />{currency.name}</td>
                                       <td>{currency.symbol}</td>
                                       <td>{currency.minAmount}</td>
                                       <td>{currency.maxAmount}</td>
                                       <td>{currency.conversionFee}</td>
                                       <td>
                                          <span className="picked-value" style={{ borderLeftColor: currency?.color ? currency?.color : "#aabbcc" }}>
                                             {currency?.color ? currency?.color : "#aabbcc"}
                                          </span>
                                       </td>
                                       {/* <td>
                                          <div>
                                             <img width={'60px'} height='60px' src={currency?.currencyIcon ? `${process.env.REACT_APP_SERVER_URL}/images/` + currency?.currencyIcon : ""} alt="" fluid />
                                          </div>
                                       </td> */}
                                       <td>
                                          {
                                             permissionName && permissionName.length > 0 && permissionName.includes('edit_currency') ?
                                                <Link to={`/admin/edit-currency/${currency._id}`} className='btn btn-primary me-2 text-decoration-none text-light'>Edit</Link>
                                                :
                                                null
                                          }
                                          {
                                             permissionName && permissionName.length > 0 && permissionName.includes('delete_currency') ?
                                                <button className="btn btn-danger me-2" onClick={() => deleteAction(currency._id)}>Delete</button>
                                                :
                                                null
                                          }
                                       </td>
                                    </tr>
                                 )
                              })}
                           </tbody>
                        </table>
                     </div>
                  </div>
               </div>
               {/* </div> */}
            </>
         }
      </>
   )
}

export default Currency
