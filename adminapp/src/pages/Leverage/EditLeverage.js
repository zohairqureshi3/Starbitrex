import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { showAllCurrencies } from '../../redux/currency/currencyActions';
import { editLeverage, getLeverage } from '../../redux/leverage/leverageActions';
import { useParams, useHistory } from 'react-router-dom';
import FullPageTransparentLoader from "../FullPageTransparentLoader/fullPageTransparentLoader";
import { showAllNetworks } from '../../redux/network/networkActions';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const EditLeverage = () => {

   let { id } = useParams();

   const history = useHistory();
   const [sourceCurrencyId, setSourceCurrencyId] = useState("");
   const [destinationCurrencyId, setDestinationCurrencyId] = useState("");
   const [fromAmount, setFromAmount] = useState("");
   const [toAmount, setToAmount] = useState("");
   const [leverage, setLeverage] = useState("");
   const [maintenanceMR, setMaintenanceMR] = useState("");
   const [maintenanceAmount, setMaintenanceAmount] = useState("");
   const [leverageFee, setLeverageFee] = useState("");
   const [fromAmountErr, setFromAmountErr] = useState("");
   const [toAmountErr, setToAmountErr] = useState("");
   const [leverageErr, setLeverageErr] = useState("");
   const [maintenanceMRErr, setMaintenanceMRErr] = useState("");
   const [maintenanceAmountErr, setMaintenanceAmountErr] = useState("");
   const [leverageFeeErr, setLeverageFeeErr] = useState("");
   const [loader, setLoader] = useState(false);
   const dispatch = useDispatch();
   const leverageData = useSelector(state => state.leverages?.leverage);
   const currencies = useSelector(state => state.currency?.currencies?.allCurrencies);

   useEffect(() => {
      dispatch(showAllCurrencies());
      dispatch(showAllNetworks());
      dispatch(getLeverage(id));
   }, []);

   useEffect(() => {
      dispatch(showAllCurrencies());
   }, []);

   useEffect(() => {
      var data = null;
      if (leverageData?.leverages)
         data = leverageData.leverages[0];
      setSourceCurrencyId(data?.sourceCurrencyId);
      setDestinationCurrencyId(data?.destinationCurrencyId);
      setFromAmount(data?.fromAmount);
      setToAmount(data?.toAmount)
      setLeverage(data?.leverage);
      setMaintenanceMR(data?.maintenanceMR)
      setMaintenanceAmount(data?.maintenanceAmount);
      setLeverageFee(data?.leverageFee)
   }, [leverageData]);

   const handleSubmit = (e) => {
      e.preventDefault();
      let validNumber = new RegExp(/^\d*\.?\d*$/);
      if (leverage == "") {
         setLeverageErr("Leverage is required");
      } else if (!leverage.toString().match(validNumber)) {
         setLeverageErr("Only numbers and decimals are allowed");
      } else if (leverageFee == "") {
         setLeverageFeeErr("LeverageFee is required");
      } else if (!leverageFee.toString().match(validNumber)) {
         setLeverageFeeErr("Only numbers and decimals are allowed");
      } else {
         setLoader(true);
         setFromAmountErr("");
         setToAmountErr("");
         setLeverageErr("");
         setMaintenanceMRErr("");
         setMaintenanceAmountErr("");
         setLeverageFeeErr("");

         const data = {
            fromAmount: fromAmount,
            toAmount: toAmount,
            leverage: leverage,
            maintenanceMR: maintenanceMR,
            maintenanceAmount: maintenanceAmount,
            leverageFee: leverageFee
         }
         dispatch(editLeverage(id, data));
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
                     <h3>Edit Leverage</h3>
                     <form>
                        <div className="form-group col-md-12">
                           <label className="control-label">Select Currency PAIR</label>
                           <select className="form-control" name="currency" required="required" disabled onChange={e => setSourceCurrencyId(e.target.value)} value={sourceCurrencyId} >
                              <option value="">Select Currency PAIR</option>
                              {currencies && currencies.length > 0 && currencies.map((currency) => {
                                 return (
                                    <option value={currency._id} key={currency._id}>{`${currency.symbol}USDT`}</option>
                                 )
                              })}
                           </select>
                        </div>
                        <div className="form-group col-md-12 pt-2">
                           <label className="control-label">From Amount</label>
                           <input type="text" required="required" className="form-control" name="fromAmount" value={fromAmount} placeholder="Enter from amount" onChange={(e) => {
                              if (e.target.value) {
                                 setFromAmount(e.target.value)
                                 setFromAmountErr("")
                              } else {
                                 setFromAmount(e.target.value)
                                 setFromAmountErr("From amount is required")
                              }
                           }} />
                           {fromAmountErr ? (<span className="errMsg">{fromAmountErr}</span>) : ("")}
                        </div>
                        <div className="form-group col-md-12 pt-2">
                           <label className="control-label">To Amount</label>
                           <input type="text" required="required" className="form-control" name="toAmount" value={toAmount} placeholder="Enter to amount" onChange={(e) => {
                              if (e.target.value) {
                                 setToAmount(e.target.value)
                                 setToAmountErr("")
                              } else {
                                 setToAmount(e.target.value)
                                 setToAmountErr("To amount is required")
                              }
                           }} />
                           {toAmountErr ? (<span className="errMsg">{toAmountErr}</span>) : ("")}
                        </div>
                        <div className="form-group col-md-12 pt-2">
                           <label className="control-label">Max Leverage</label>
                           <input type="text" required="required" className="form-control" name="leverage" value={leverage} placeholder="Enter max leverage" onChange={(e) => {
                              if (e.target.value) {
                                 setLeverage(e.target.value)
                                 setLeverageErr("")
                              } else {
                                 setLeverage(e.target.value)
                                 setLeverageErr("Max leverage is required")
                              }
                           }} />
                           {leverageErr ? (<span className="errMsg">{leverageErr}</span>) : ("")}
                        </div>
                        <div className="form-group col-md-12 pt-2">
                           <label className="control-label">Maintenance Margin Rate (%)</label>
                           <input type="text" required="required" className="form-control" name="maintenanceMR" value={maintenanceMR} placeholder="Enter maintenance margin rate" onChange={(e) => {
                              if (e.target.value) {
                                 setMaintenanceMR(e.target.value)
                                 setMaintenanceMRErr("")
                              } else {
                                 setMaintenanceMR(e.target.value)
                                 setMaintenanceMRErr("Maintenance margin rate is required")
                              }
                           }} />
                           {maintenanceMRErr ? (<span className="errMsg">{maintenanceMRErr}</span>) : ("")}
                        </div>
                        <div className="form-group col-md-12 pt-2">
                           <label className="control-label">Maintenance Amount</label>
                           <input type="text" required="required" className="form-control" name="maintenanceAmount" value={maintenanceAmount} placeholder="Enter maintenance amount" onChange={(e) => {
                              if (e.target.value) {
                                 setMaintenanceAmount(e.target.value)
                                 setMaintenanceAmountErr("")
                              } else {
                                 setMaintenanceAmount(e.target.value)
                                 setMaintenanceAmountErr("Maintenance amount is required")
                              }
                           }} />
                           {maintenanceAmountErr ? (<span className="errMsg">{maintenanceAmountErr}</span>) : ("")}
                        </div>
                        <div className="form-group col-md-12 pt-2">
                           <label className="control-label">Leverage Fee</label>
                           <input type="text" required="required" className="form-control" name="leverageFee" value={leverageFee} placeholder="Enter Leverage Fee" onChange={(e) => {
                              if (e.target.value) {
                                 setLeverageFee(e.target.value)
                                 setLeverageFeeErr("")
                              } else {
                                 setLeverageFee(e.target.value)
                                 setLeverageFeeErr("LeverageFee is required")
                              }
                           }} />
                           {leverageFeeErr ? (<span className="errMsg">{leverageFeeErr}</span>) : ("")}
                        </div>
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

export default EditLeverage