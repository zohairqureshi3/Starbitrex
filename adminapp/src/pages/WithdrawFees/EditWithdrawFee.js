import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { showAllCurrencies } from '../../redux/currency/currencyActions';
import { editWithdrawFee, getWithdrawFeeById } from '../../redux/withdrawFee/withdrawFeeActions';
import { useParams, useHistory } from 'react-router-dom';
import FullPageTransparentLoader from "../FullPageTransparentLoader/fullPageTransparentLoader";
import { showAllNetworks } from '../../redux/network/networkActions';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const EditWithdrawFee = () => {

   let { id } = useParams();

   const [feeAdminWallet, setFeeAdminWallet] = useState("");
   const [fee, setFee] = useState("");
   const [actualFee, setActualFee] = useState("");
   const [name, setName] = useState("");
   const [minAmount, setMinAmount] = useState("");
   const [maxAmount, setMaxAmount] = useState("");
   const [network, setNetwork] = useState("");
   const [errors, setErrors] = useState("");
   const [loader, setLoader] = useState(false);

   const dispatch = useDispatch();
   const withdrawFeeData = useSelector(state => state.withdrawFee?.withdrawFee);

   useEffect(() => {
      dispatch(showAllCurrencies());
      dispatch(showAllNetworks());
      dispatch(getWithdrawFeeById(id));
   }, []);

   useEffect(() => {
      if (withdrawFeeData) {
         setFeeAdminWallet(withdrawFeeData?.feeAdminWallet);
         setFee(withdrawFeeData?.fee);
         setActualFee(withdrawFeeData?.actualFee)
         setName(withdrawFeeData?.currencyId);
         setNetwork(withdrawFeeData?.networkId);
         setMinAmount(withdrawFeeData?.min);
         setMaxAmount(withdrawFeeData?.max);
      }

   }, [withdrawFeeData]);

   const currencies = useSelector(state => state.currency?.currencies?.allCurrencies);
   const networks = useSelector(state => state.network?.networks);
   const history = useHistory();

   const handleSubmit = (e) => {
      e.preventDefault();
      var validNumber = new RegExp(/^\d*\.?\d*$/);
      if (name == "") {
         setErrors("Please Select Currency name!");
      } else if (feeAdminWallet == "") {
         setErrors("Admin Wallet is required!");
      } else if (fee == "") {
         setErrors("WithdrawFee is required!");
      } else if (!fee.toString().match(validNumber)) {
         setErrors("Invalid fee (Only number 0-9 and decimals)!");
      } else if (actualFee == "") {
         setErrors("actualFee is required!");
      } else if (!actualFee.toString().match(validNumber)) {
         setErrors("Invalid actualFee (Only number 0-9 and decimals)!");
      } else if (minAmount == "") {
         setErrors("WithdrawFee is required!");
      } else if (!minAmount.toString().match(validNumber)) {
         setErrors("Invalid Min number (Only number 0-9 and decimals)!");
      } else if (maxAmount == "") {
         setErrors("WithdrawFee is required!");
      } else if (!maxAmount.toString().match(validNumber)) {
         setErrors("Invalid Max number (Only number 0-9 and decimals)!");
      }
      else {
         setLoader(true);
         setErrors("");
         const data = {
            currencyId: name,
            fee: fee,
            feeAdminWallet: feeAdminWallet,
            actualFee: actualFee,
            networkId: network,
            min: minAmount,
            max: maxAmount
         }
         dispatch(editWithdrawFee(id, data));
         history.goBack();
      }
   }

   return (
      <>
         {loader ? <FullPageTransparentLoader /> :
            <>
               <div className="content-wrapper right-content-wrapper">
                  <div className="content-box">
                     <FontAwesomeIcon className="faArrowLeftIcon" icon={faArrowLeft} onClick={() => history.goBack()} />
                     <h3>Edit Withdraw Fee</h3>
                     <form>
                        <div className="form-group col-md-12">
                           <label className="control-label">Select Currency</label>
                           <select className="form-control" required="required" name="name" value={name} onChange={e => setName(e.target.value)} >
                              {currencies && currencies.length > 0 && currencies.map((currency) => {
                                 return (
                                    <option value={currency._id} key={currency._id}>{currency.name}</option>
                                 )
                              })}
                           </select>
                        </div>
                        <div className="form-group col-md-12">
                           <label className="control-label">Select Network</label>
                           <select className="form-control" name="network" required="required" onChange={e => setNetwork(e.target.value)} value={network} >
                              <option value="">Select Network</option>
                              {networks && networks.length > 0 && networks.map((network => {
                                 return (
                                    <option value={network._id} key={network._id}>{network.name}</option>
                                 )
                              }))}
                           </select>
                        </div>
                        <div className="form-group col-md-12">
                           <label className="control-label">Withdraw Fee (%)</label>
                           <input type="number" required="required" className="form-control" name="fee" value={fee} onChange={e => setFee(e.target.value)}
                              placeholder="Enter Withdraw Fee" />
                        </div>
                        <div className="form-group col-md-12">
                           <label className="control-label">Withdraw Admin Wallet</label>
                           <input type="text" className="form-control" placeholder="Enter Admin Wallet" name="feeAdminWallet" value={feeAdminWallet} onChange={e => setFeeAdminWallet(e.target.value)} />
                        </div>
                        <div className="form-group col-md-12">
                           <label className="control-label">Actual Fee (in GWEI)</label>
                           <input type="number" required="required" className="form-control" name="actualFee" value={actualFee} onChange={e => setActualFee(e.target.value)}
                              placeholder="Enter Actual Fee" />
                        </div>
                        <div className="form-group col-md-12">
                           <label className="control-label">Min Transfer Amount Allowed</label>
                           <input type="number" required="required" className="form-control" onChange={e => setMinAmount(e.target.value)}
                              name="min" value={minAmount} placeholder="Enter Min Amount" />
                        </div>
                        <div className="form-group col-md-12">
                           <label className="control-label">Max Transfer Amount Allowed</label>
                           <input type="number" required="required" className="form-control" onChange={e => setMaxAmount(e.target.value)}
                              name="max" value={maxAmount} placeholder="Enter Max Amount" />
                        </div>
                        {errors ? (
                           <div style={{ color: "#FE6E00" }} className="alert alert-danger" > {errors} </div>
                        ) : ("")
                        }
                        <div>
                           <button className="btn-default btn" onClick={handleSubmit}>Save</button>
                        </div>
                     </form>
                  </div>
               </div>
            </>
         }
      </>
   )
}

export default EditWithdrawFee