import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { showAllCurrencies } from '../../redux/currency/currencyActions';
import { addLeverage, updateState } from '../../redux/leverage/leverageActions';
import FullPageTransparentLoader from "../FullPageTransparentLoader/fullPageTransparentLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Form } from 'react-bootstrap';

const SetLeverage = () => {

   const history = useHistory();
   const dispatch = useDispatch();
   const currencies = useSelector(state => state.currency?.currencies?.allCurrencies);
   const success = useSelector(state => state.leverages?.success);
   const error = useSelector(state => state.leverages?.error);
   const [loader, setLoader] = useState(false);

   const { register, handleSubmit, formState: { errors } } = useForm();

   const addLeverageData = {
      sourceCurrency: {
         required: "Please select source currency"
      },
      destinationCurrency: {
         required: "Please select destination currency"
      },
      fromAmount: {
         required: "From amount is required",
         pattern: {
            value: /^[0-9]\d*(\.\d+)?$/,
            message: 'Only numbers and decimals are allowed',
         }
      },
      toAmount: {
         required: "To amount is required",
         pattern: {
            value: /^[0-9]\d*(\.\d+)?$/,
            message: 'Only numbers and decimals are allowed',
         }
      },
      leverage: {
         required: "Leverage is required",
         pattern: {
            value: /^[0-9]\d*(\.\d+)?$/,
            message: 'Only numbers and decimals are allowed',
         }
      },
      maintenanceMR: {
         required: "Maintenance margin rate is required",
         max: {
            value: 100,
            message: 'Maintenance margin rate can not be greater than 100'
         },
         pattern: {
            value: /^[0-9]\d*(\.\d+)?$/,
            message: 'Only numbers and decimals are allowed',
         }
      },
      maintenanceAmount: {
         required: "Maintenance amount is required",
         pattern: {
            value: /^[0-9]\d*(\.\d+)?$/,
            message: 'Only numbers and decimals are allowed',
         }
      },
      leverageFee: {
         required: "leverage fee is required",
         pattern: {
            value: /^[0-9]\d*(\.\d+)?$/,
            message: 'Only numbers and decimals are allowed',
         }
      }
   };

   useEffect(() => {
      dispatch(showAllCurrencies());
   }, []);

   const handleSave = (formData) => {
      setLoader(true);
      const data = {
         sourceCurrencyId: formData.sourceCurrency,
         destinationCurrencyId: currencies?.filter(curr => curr.symbol == 'USDT')?.[0]?._id,
         fromAmount: formData.fromAmount,
         toAmount: formData.toAmount,
         leverage: formData.leverage,
         maintenanceMR: formData.maintenanceMR,
         maintenanceAmount: formData.maintenanceAmount,
         leverageFee: formData.leverageFee,
      }
      dispatch(addLeverage(data));
   }

   useEffect(() => {
      if (success) {
         setLoader(false);
         history.goBack();
      }
      dispatch(updateState());
   }, [success])

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
               <div className="content-wrapper right-content-wrapper">
                  <div className="content-box">
                     <FontAwesomeIcon className="faArrowLeftIcon" icon={faArrowLeft} onClick={() => history.goBack()} />
                     <h3>Set Leverage</h3>
                     <form onSubmit={handleSubmit(handleSave)}>
                        <div className="form-group col-md-12">
                           <label className="control-label">Select Currency PAIR</label>
                           <Form.Select name="sourceCurrency" {...register('sourceCurrency', addLeverageData?.sourceCurrency)}>
                              <option value="">Select Currency PAIR</option>
                              {currencies?.filter(curr => curr.symbol != 'USDT')?.map((currency) => {
                                 return (
                                    <option value={currency._id} key={currency._id}>{`${currency.symbol}USDT`}</option>
                                 )
                              })}
                           </Form.Select>
                           {errors?.sourceCurrency && <span className="errMsg">{errors.sourceCurrency.message}</span>}
                        </div>
                        <div className="form-group col-md-12 pt-2">
                           <label className="control-label">From Amount</label>
                           <input type="text" className="form-control" placeholder="Enter From Amount"
                              {...register('fromAmount', addLeverageData.fromAmount)} name='fromAmount' />
                           {errors?.fromAmount && <span className="errMsg">{errors.fromAmount.message}</span>}
                        </div>
                        <div className="form-group col-md-12 pt-2">
                           <label className="control-label">To Amount</label>
                           <input type="text" className="form-control" placeholder="Enter To Amount"
                              {...register('toAmount', addLeverageData.toAmount)} name='toAmount' />
                           {errors?.toAmount && <span className="errMsg">{errors.toAmount.message}</span>}
                        </div>
                        <div className="form-group col-md-12 pt-2">
                           <label className="control-label">Max Leverage</label>
                           <input type="text" className="form-control" placeholder="Enter Max Leverage"
                              {...register('leverage', addLeverageData.leverage)} name='leverage' />
                           {errors?.leverage && <span className="errMsg">{errors.leverage.message}</span>}
                        </div>
                        <div className="form-group col-md-12 pt-2">
                           <label className="control-label">Maintenance Margin Rate (%)</label>
                           <input type="text" className="form-control" placeholder="Enter Maintenance Margin Rate"
                              {...register('maintenanceMR', addLeverageData.maintenanceMR)} name='maintenanceMR' />
                           {errors?.maintenanceMR && <span className="errMsg">{errors.maintenanceMR.message}</span>}
                        </div>
                        <div className="form-group col-md-12 pt-2">
                           <label className="control-label">Maintenance Amount</label>
                           <input type="text" className="form-control" placeholder="Enter Maintenance Amount"
                              {...register('maintenanceAmount', addLeverageData.maintenanceAmount)} name='maintenanceAmount' />
                           {errors?.maintenanceAmount && <span className="errMsg">{errors.maintenanceAmount.message}</span>}
                        </div>
                        <div className="form-group col-md-12 pt-2">
                           <label className="control-label">Leverage Fee</label>
                           <input type="text" className="form-control" placeholder="Enter Leverage Fee"
                              {...register('leverageFee', addLeverageData.leverageFee)} name='leverageFee' defaultValue={0} />
                           {errors?.leverageFee && <span className="errMsg">{errors.leverageFee.message}</span>}
                        </div>
                        <div>
                           <button className="btn-default btn" type="submit">Save</button>
                        </div>
                     </form>
                  </div>
               </div>
            </>
         }
      </>
   )
}

export default SetLeverage