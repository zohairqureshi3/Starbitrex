import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { showAllCurrencies } from '../../redux/currency/currencyActions';
import { addTransactionFee, updateState } from '../../redux/transactionFee/transactionFeeActions';
import FullPageTransparentLoader from "../FullPageTransparentLoader/fullPageTransparentLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

const SetTransactionFee = () => {

   const history = useHistory();
   const dispatch = useDispatch();
   const currencies = useSelector(state => state.currency?.currencies?.allCurrencies);
   const [loader, setLoader] = useState(false);
   const success = useSelector(state => state.transactionFee?.success);
   // const fetched = useSelector(state => state.currency?.fetched);
   const error = useSelector((state) => state.currency?.error);

   useEffect(() => {
      dispatch(showAllCurrencies());
   }, []);

   const { register, handleSubmit, formState: { errors } } = useForm();
   const addFeeData = {
      currency: { required: "Please select currency" },
      conversionFee: {
         required: "Conversion fee is required",
         pattern: {
            value: /^[0-9]\d*(\.\d+)?$/,
            message: 'Only number and decimals are allowed',
         }
      }
   };

   const handleSave = (formData) => {
      setLoader(true);
      const data = {
         currencyId: formData.currency,
         fee: formData.conversionFee,
         min: formData.min
      }
      dispatch(addTransactionFee(data));
   }

   useEffect(() => {
      if (success) {
         setLoader(false);
         history.goBack();
      }
      dispatch(updateState());
   }, [success]);

   useEffect(() => {
      if (error) {
         setLoader(false);
         dispatch(updateState());
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
                     <h3>Set Conversion Fee</h3>
                     <form onSubmit={handleSubmit(handleSave)}>
                        <div className="form-group col-md-12">
                           <label className="control-label">Select Currency</label>
                           <Form.Select name="currency" {...register('currency', addFeeData.currency)}>
                              <option value="">Select Currency</option>
                              {currencies && currencies.length > 0 && currencies.map((currency) => {
                                 return (
                                    <option value={currency._id} key={currency._id}>{currency.name}</option>
                                 )
                              })}
                           </Form.Select>
                           {errors?.currency && <span className="errMsg">{errors.currency.message}</span>}
                        </div>
                        <div className="form-group col-md-12 pt-2">
                           <label className="control-label">Min Convertable Amount</label>
                           <input type="text" className="form-control" placeholder="Min Convertable Amount"
                              {...register('min', addFeeData.min)} name='min' />
                           {errors?.min && <span className="errMsg">{errors.min.message}</span>}
                        </div>
                        {/* <div className="form-group col-md-12 pt-2">
                           <label className="control-label">Max Convertable Amount</label>
                           <input type="text" className="form-control" placeholder="Max Convertable Amount"
                              {...register('max', addFeeData.max)} name='max' />
                           {errors?.max && <span className="errMsg">{errors.max.message}</span>}
                        </div> */}
                        <div className="form-group col-md-12 pt-2">
                           <label className="control-label">Conversion Fee</label>
                           <input type="text" className="form-control" placeholder="Enter Conversion Fee"
                              {...register('conversionFee', addFeeData.conversionFee)} name='conversionFee' />
                           {errors?.conversionFee && <span className="errMsg">{errors.conversionFee.message}</span>}
                        </div>
                        <div>
                           <button className="btn btn-default" type="submit">Save</button>
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

export default SetTransactionFee