import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addCurrency, updateState } from '../../redux/currency/currencyActions';
import FullPageTransparentLoader from "../FullPageTransparentLoader/fullPageTransparentLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from 'react-router-dom';
import { HexColorPicker } from "react-colorful";

const AddCurrency = () => {

   const history = useHistory();
   const dispatch = useDispatch();
   const [loader, setLoader] = useState(false);
   const [name, setName] = useState("");
   const [symbol, setSymbol] = useState("");
   const [minAmount, setMinAmount] = useState("");
   const [maxAmount, setMaxAmount] = useState("");
   const [conversionFee, setConversionFee] = useState("");
   const [color, setColor] = useState("#aabbcc");
   const [displayColorPicker, setDisplayColorPicker] = useState(false);
   const [nameErr, setNameErr] = useState("");
   const [symbolErr, setSymbolErr] = useState("");
   const [minAmountErr, setMinAmountErr] = useState("");
   const [maxAmountErr, setMaxAmountErr] = useState("");
   const [conversionFeeErr, setConversionFeeErr] = useState("");
   const [colorErr, setColorErr] = useState("");
   const currencyAdded = useSelector(state => state?.currency?.currencyAdded);
   const error = useSelector(state => state.network?.error);

   const handleSubmit = (e) => {
      e.preventDefault();
      const exp = /^[a-z A-Z]+$/;
      const numCheck = /^[0-9]\d*(\.\d+)?$/;
      if (!name && !symbol && !minAmount && !maxAmount && !conversionFee) {
         setNameErr("Currency name is required");
         setSymbolErr("Currency symbol is required");
         setMinAmountErr("Min amount is required");
         setMaxAmountErr("Max amount is required");
         setConversionFeeErr("Conversion fee is required");
         // setIconErr("Currency icon is required");
      } else if (name == "") {
         setNameErr("Currency name is required");
      } else if (!name.match(exp)) {
         setNameErr("Invalid Currency name (Only letters a-z allowed)");
      } else if (symbol == "") {
         setSymbolErr("Currency symbol is required");
      } else if (minAmount == "") {
         setMinAmountErr("Min amount is required");
      } else if (!minAmount.match(numCheck)) {
         setMinAmountErr("Only numbers and decimals are allowed");
      } else if (maxAmount == "") {
         setMaxAmountErr("Max amount is required");
      } else if (!maxAmount.match(numCheck)) {
         setMaxAmountErr("Only numbers and decimals are allowed");
      } else if (conversionFee == "") {
         setConversionFeeErr("Conversion fee is required");
      } else if (!conversionFee.match(numCheck)) {
         setConversionFeeErr("Only numbers and decimals are allowed");
      } else if (color == "") {
         setColorErr("Currency color is required");
         // } else if (iconName == "") {
         //    setIconErr("Currency icon is required")
      } else {
         setLoader(true);
         const formData = {
            name: name,
            symbol: symbol,
            color: color,
            minAmount: minAmount,
            maxAmount: maxAmount,
            conversionFee: conversionFee,
            status: true,

         }
         dispatch(addCurrency(formData));
      }
   }

   useEffect(() => {
      if (currencyAdded) {
         history.goBack();
      }
   }, [currencyAdded])


   useEffect(() => {
      if (error) {
         setLoader(false);
         dispatch(updateState())
      }
   }, [error])

   return (
      <>
         {loader ? <FullPageTransparentLoader /> :
            <>
               {/* <div className="col-lg-9 col-md-8"> */}
               <div className="content-wrapper right-content-wrapper">
                  <div className="content-box">
                     <FontAwesomeIcon className="faArrowLeftIcon" icon={faArrowLeft} onClick={() => history.goBack()} />
                     <h3>Add Currency</h3>
                     <form>
                        <div className="form-group col-md-12">
                           <label className="control-label">Currency Name</label>
                           <input type="text" required="required" className="form-control" name="name" value={name}
                              placeholder="Enter currency name" onChange={(e) => {
                                 if (e.target.value) {
                                    setName(e.target.value)
                                    setNameErr("")
                                 } else {
                                    setName(e.target.value)
                                    setNameErr("Currency name is required")
                                 }
                              }} />
                           {nameErr ? (<span className="errMsg">{nameErr}</span>) : ("")}
                        </div>
                        <div className="form-group col-md-12 pt-2">
                           <label className="control-label">Currency Symbol</label>
                           <input type="text" required="required" className="form-control" name="symbol" value={symbol}
                              placeholder="Enter currency symbol" onChange={(e) => {
                                 if (e.target.value) {
                                    setSymbol(e.target.value)
                                    setSymbolErr("")
                                 } else {
                                    setSymbol(e.target.value)
                                    setSymbolErr("Currency symbol is required")
                                 }
                              }} />
                           {symbolErr ? (<span className="errMsg">{symbolErr}</span>) : ("")}
                        </div>

                        <div className="form-group col-md-12 pt-2">
                           <label className="control-label">Min Convertible Amount</label>
                           <input type="text" required="required" className="form-control" name="minAmount" value={minAmount}
                              placeholder="Enter min convertible amount" onChange={(e) => {
                                 if (e.target.value) {
                                    setMinAmount(e.target.value)
                                    setMinAmountErr("")
                                 } else {
                                    setMinAmount(e.target.value)
                                    setMinAmountErr("Min convertible amount is required")
                                 }
                              }} />
                           {minAmountErr ? (<span className="errMsg">{minAmountErr}</span>) : ("")}
                        </div>
                        <div className="form-group col-md-12 pt-2">
                           <label className="control-label">Max Convertible Amount</label>
                           <input type="text" required="required" className="form-control" name="maxAmount" value={maxAmount}
                              placeholder="Enter max convertible amount" onChange={(e) => {
                                 if (e.target.value) {
                                    setMaxAmount(e.target.value)
                                    setMaxAmountErr("")
                                 } else {
                                    setMaxAmount(e.target.value)
                                    setMaxAmountErr("Max convertible amount is required")
                                 }
                              }} />
                           {maxAmountErr ? (<span className="errMsg">{maxAmountErr}</span>) : ("")}
                        </div>
                        <div className="form-group col-md-12 pt-2">
                           <label className="control-label">Conversion Fee(%)</label>
                           <input type="text" required="required" className="form-control" name="conversionFee" value={conversionFee}
                              placeholder="Enter conversion fee" onChange={(e) => {
                                 if (e.target.value) {
                                    setConversionFee(e.target.value)
                                    setConversionFeeErr("")
                                 } else {
                                    setConversionFee(e.target.value)
                                    setConversionFeeErr("Conversion fee is required")
                                 }
                              }} />
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
                              {colorErr ? (<span className="errMsg">{colorErr}</span>) : ("")}
                           </div>
                        </div>
                        <div>
                           <button className="btn btn-default" onClick={handleSubmit}>Save</button>
                        </div>
                     </form>
                  </div>
               </div>
               {/* </div> */}
            </>
         }
      </>
   )
}

export default AddCurrency