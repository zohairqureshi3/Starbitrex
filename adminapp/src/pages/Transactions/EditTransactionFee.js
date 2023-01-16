import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { showAllCurrencies } from '../../redux/currency/currencyActions';
import { editTransactionFee, getTransactionFee } from '../../redux/transactionFee/transactionFeeActions';
import { useParams, useHistory } from 'react-router-dom';
import FullPageTransparentLoader from "../FullPageTransparentLoader/fullPageTransparentLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const EditTransactionFee = () => {

   let { id } = useParams();
   const [fee, setFee] = useState("");
   const [min, setMin] = useState("");
   // const [max, setMax] = useState("");
   const [name, setName] = useState("");
   const [error, setError] = useState("");
   const [loader, setLoader] = useState(false);

   useEffect(() => {
      dispatch(showAllCurrencies());
      dispatch(getTransactionFee(id));
   }, []);

   const dispatch = useDispatch();
   const transactionFeeData = useSelector(state => state.transactionFee?.txFee);

   useEffect(() => {
      setFee(transactionFeeData?.fee);
      setMin(transactionFeeData?.min);
      // setMax(transactionFeeData?.max);
      setName(transactionFeeData?.currencies._id);
   }, [transactionFeeData?.fee]);

   const currencies = useSelector(state => state.currency?.currencies?.allCurrencies);
   const history = useHistory();

   const handleSubmit = (e) => {
      e.preventDefault();
      var validNumber = new RegExp(/^\d*\.?\d*$/);
      if (fee == "") {
         setError("Conversion fee is required!");

      } else if (!fee.toString().match(validNumber)) {
         setError("Only numbers and decimals are allowed)!");
      } else {
         setLoader(true);
         setError("");
         const data = {
            currencyId: name,
            fee: fee,
            min: min
         }
         dispatch(editTransactionFee(id, data));
         history.goBack();
      }
   }

   return (
      <>
         {loader ? <FullPageTransparentLoader /> :
            <>
               {/* <div className="col-lg-9 col-md-8"> */}
               <div className="content-wrapper right-content-wrapper">
                  <div className="content-box">
                     <FontAwesomeIcon className="faArrowLeftIcon" icon={faArrowLeft} onClick={() => history.goBack()} />
                     <h3>Edit Conversion Fee</h3>
                     <form>
                        <div className="form-group col-md-12">
                           <label className="control-label">Select Currency</label>
                           <select className="form-control" required="required" name="name" value={name} disabled >
                              {currencies && currencies.length > 0 && currencies.map((currency) => {
                                 return (
                                    <option value={currency._id} key={currency._id}>{currency.name}</option>
                                 )
                              })}
                           </select>
                        </div>

                        <div className="form-group col-md-12">
                           <label className="control-label">Min Convertable Amount</label>
                           <input type="text" required="required" className="form-control" name="min" value={min}
                              placeholder="Enter Min Convertable Amount" onChange={(e) => {
                                 if (e.target.value) {
                                    setMin(e.target.value)
                                    setError("")
                                 } else {
                                    setMin(e.target.value)
                                    setError("Min Convertable Amount is required!")
                                 }
                              }} />
                        </div>
                        {/* <div className="form-group col-md-12">
                           <label className="control-label">Max Convertable Amount</label>
                           <input type="text" required="required" className="form-control" name="max" value={max}
                              placeholder="Enter Max Convertable Amount" onChange={(e) => {
                                 if (e.target.value) {
                                    setFee(e.target.value)
                                    setError("")
                                 } else {
                                    setFee(e.target.value)
                                    setError("Max Convertable Amount is required!")
                                 }
                              }} />
                        </div> */}
                        <div className="form-group col-md-12">
                           <label className="control-label">Conversion Fee</label>
                           <input type="text" required="required" className="form-control" name="fee" value={fee}
                              placeholder="Enter Conversion Fee" onChange={(e) => {
                                 if (e.target.value) {
                                    setFee(e.target.value)
                                    setError("")
                                 } else {
                                    setFee(e.target.value)
                                    setError("Conversion fee is required!")
                                 }
                              }} />
                        </div>
                        {error ? (<span className="errMsg">{error}</span>) : ("")}
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

export default EditTransactionFee