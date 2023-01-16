import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { editCurrency, getCurrency } from '../../redux/currency/currencyActions';
import FullPageTransparentLoader from "../FullPageTransparentLoader/fullPageTransparentLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { HexColorPicker } from "react-colorful";

const EditCurrency = () => {

   let { id } = useParams();
   const history = useHistory();
   const dispatch = useDispatch();
   const [loader, setLoader] = useState(false);
   const [currency, setCurrency] = useState({ name: "", symbol: "", networkId: "", minAmount: "", maxAmount: "", conversionFee: "" });
   const [color, setColor] = useState("#aabbcc");
   const [nameErr, setNameErr] = useState("");
   const [symbolErr, setSymbolErr] = useState("");
   const [minAmountErr, setMinAmountErr] = useState("");
   const [maxAmountErr, setMaxAmountErr] = useState("");
   const [conversionFeeErr, setConversionFeeErr] = useState("");
   const [displayColorPicker, setDisplayColorPicker] = useState(false);
   const [colorErr, setColorErr] = useState("");
   const currencyData = useSelector(state => state.currency?.currencies?.allCurrencies);
   const currencyEditted = useSelector(state => state.currency?.currencyEditted);

   useEffect(async () => {
      await dispatch(getCurrency(id))
   }, [])

   const handleChange = (e) => {
      setCurrency({ ...currency, [e.target.name]: e.target.value })
   };

   useEffect(() => {
      if (currencyData) {
         setColor(currencyData?.color);
         setCurrency(currencyData);
      }
   }, [currencyData]);

   const handleSubmit = async (e) => {
      e.preventDefault();
      const { name, symbol } = currency;
      const exp = /^[a-z A-Z]+$/;
      if (!name && !symbol) {
         setNameErr("Currency name is required");
         setSymbolErr("Currency symbol is required");
      } else if (name == "") {
         setNameErr("Currency name is required");
      } else if (!name.match(exp)) {
         setNameErr("Invalid Currency name (Only letters a-z allowed)");
      } else if (symbol == "") {
         setSymbolErr("Currency symbol is required");
      } else {
         const data = {
            name: currency.name,
            symbol: currency.symbol,
            color: color,
            minAmount: currency.minAmount,
            maxAmount: currency.maxAmount,
            conversionFee: currency.conversionFee,
         }
         await dispatch(editCurrency(id, data));
         setLoader(true);
      }
   }

   useEffect(() => {
      if (currencyEditted) {
         history.goBack();
      }
   }, [currencyEditted])


   return (
      <>
         {loader ? <FullPageTransparentLoader /> :
            currency && currency ?
               <>
                  {/* <div className="col-lg-9 col-md-8"> */}
                  <div className="content-wrapper right-content-wrapper">
                     <div className="content-box">
                        <FontAwesomeIcon className="faArrowLeftIcon" icon={faArrowLeft} onClick={() => history.goBack()} />
                        <h3>Edit Currency</h3>
                        <form>
                           <div className="form-group col-md-12">
                              <label className="control-label">Currency Name</label>
                              <input type="text" required="required" className="form-control" name="name" onChange={handleChange}
                                 value={currency.name} placeholder="Enter currency name" />
                              {nameErr ? (<span className="errMsg">{nameErr}</span>) : ("")}
                           </div>
                           <div className="form-group col-md-12 pt-2">
                              <label className="control-label">Currency Symbol</label>
                              <input type="text" required="required" className="form-control" onChange={handleChange}
                                 name="symbol" value={currency.symbol} placeholder="Enter currency symbol" />
                              {symbolErr ? (<span className="errMsg">{symbolErr}</span>) : ("")}
                           </div>
                           <div className="form-group col-md-12 pt-2">
                              <label className="control-label">Min Convertible Amount</label>
                              <input type="text" required="required" className="form-control" onChange={handleChange}
                                 name="minAmount" value={currency.minAmount} placeholder="Enter min convertible amount" />
                              {minAmountErr ? (<span className="errMsg">{minAmountErr}</span>) : ("")}
                           </div>
                           <div className="form-group col-md-12 pt-2">
                              <label className="control-label">Max Convertible Amount</label>
                              <input type="text" required="required" className="form-control" onChange={handleChange}
                                 name="maxAmount" value={currency.maxAmount} placeholder="Enter max convertible amount" />
                              {maxAmountErr ? (<span className="errMsg">{maxAmountErr}</span>) : ("")}
                           </div>
                           <div className="form-group col-md-12 pt-2">
                              <label className="control-label">Conversion Fee(%)</label>
                              <input type="text" required="required" className="form-control" onChange={handleChange}
                                 name="conversionFee" value={currency.conversionFee} placeholder="Enter conversion fee" />
                              {conversionFeeErr ? (<span className="errMsg">{conversionFeeErr}</span>) : ("")}
                           </div>
                           <div className="form-group col-md-12 pt-2">
                              <label className="control-label">Currency Color</label>
                              <div className="inputWithButton">
                                 <input type="text" className="form-control" name="color" disabled />
                                 <button className='btn btn-secondary' onClick={() => setDisplayColorPicker(!displayColorPicker)} type='button'>
                                    Pick Color
                                 </button>
                                 {displayColorPicker ? (
                                    <div>
                                       <HexColorPicker color={color} onChange={setColor} />
                                    </div>
                                 ) : null
                                 }
                                 <span className="picked-value" style={{ borderLeftColor: color }}>
                                    Picked color is {color}
                                 </span>
                              </div>
                              {/* <div className="form-group col-md-12 pt-2">
                                 <label className="control-label">Upload Currency Icon </label>
                                 <input type="file" className="form-control" name="icon" accept="image/*" />
                              </div> */}
                           </div>
                           <div>
                              <button className="btn-default hvr-bounce-in nav-button" onClick={handleSubmit}>Save</button>
                           </div>
                        </form>
                     </div>
                  </div>
                  {/* </div> */}
               </>
               : ''
         }
      </>
   )
}

export default EditCurrency
