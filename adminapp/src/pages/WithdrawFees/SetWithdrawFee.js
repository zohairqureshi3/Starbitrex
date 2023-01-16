import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { showAllCurrencies } from '../../redux/currency/currencyActions';
import { showAllNetworks } from '../../redux/network/networkActions';
import { addWithdrawFee, updateState } from '../../redux/withdrawFee/withdrawFeeActions';
import FullPageTransparentLoader from "../FullPageTransparentLoader/fullPageTransparentLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from 'react-router-dom';

const SetWithdrawFee = () => {

   const history = useHistory();
   const dispatch = useDispatch();
   const currencies = useSelector(state => state.currency?.currencies?.allCurrencies);
   const networks = useSelector(state => state.network?.networks);
   const success = useSelector(state => state.withdrawFee?.success);
   const error = useSelector(state => state.withdrawFee?.error);
   const [loader, setLoader] = useState(false);

   useEffect(() => {
      dispatch(showAllCurrencies());
      dispatch(showAllNetworks());
   }, []);

   const { register, handleSubmit, formState: { errors } } = useForm();

   const withdrawFeeData = {
      currency: {
         required: "Please select currency"
      },
      network: {
         required: "Please select network"
      },
      withdrawFee: {
         required: "Withdraw fee is required",
         pattern: {
            value: /^[0-9]\d*(\.\d+)?$/,
            message: 'Only numbers and decimals are allowed',
         },
         max: {
            value: 100,
            message: 'Withdraw fee can not be greater than 100',
         },
         min: {
            value: 0,
            message: 'Withdraw fee can not be less than 0',
         }
      },
      feeAdminWallet: {
         required: "Please Enter Admin Wallet"
      },
      actualFee: {
         required: "Actual fee is required",
         pattern: {
            value: /^[0-9]\d*(\.\d+)?$/,
            message: 'Only numbers and decimals are allowed',
         }
      },
      min: {
         required: "Min amount is required",
         pattern: {
            value: /^[0-9]\d*(\.\d+)?$/,
            message: 'Only number and decimals are allowed',
         }
      },
      max: {
         required: "Max amount is required",
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
         networkId: formData.network,
         fee: formData.withdrawFee,
         feeAdminWallet: formData.feeAdminWallet,
         actualFee: formData.actualFee,
         min: formData.min,
         max: formData.max
      }
      dispatch(addWithdrawFee(data));
   }

   useEffect(() => {
      if (success) {
         setLoader(false);
         history.goBack();
      }
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
                     <h3>Set Withdraw Fee</h3>
                     <form onSubmit={handleSubmit(handleSave)}>
                        <div className="form-group col-md-12">
                           <label className="control-label">Select Currency</label>
                           <Form.Select name="currency" {...register('currency', withdrawFeeData?.currency)}>
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
                           <label className="control-label">Select Network</label>
                           <Form.Select name="network" {...register('network', withdrawFeeData?.network)}>
                              <option value="">Select Network</option>
                              {networks && networks.length > 0 && networks.map((network => {
                                 return (
                                    <option value={network._id} key={network._id}>{network.name}</option>
                                 )
                              }))}
                           </Form.Select>
                           {errors?.network && <span className="errMsg">{errors.network.message}</span>}
                        </div>
                        <div className="form-group col-md-12 pt-2">
                           <label className="control-label">Withdraw Fee %</label>
                           <input type="text" className="form-control" placeholder="Enter Withdraw Fee In Percentage"
                              {...register('withdrawFee', withdrawFeeData.withdrawFee)} name='withdrawFee' />
                           {errors?.withdrawFee && <span className="errMsg">{errors.withdrawFee.message}</span>}
                        </div>
                        <div className="form-group col-md-12 pt-2">
                           <label className="control-label">Withdraw Admin Wallet</label>
                           <input type="text" className="form-control" placeholder="Enter Admin Wallet"
                              {...register('feeAdminWallet', withdrawFeeData.feeAdminWallet)} name='feeAdminWallet' />
                           {errors?.feeAdminWallet && <span className="errMsg">{errors.feeAdminWallet.message}</span>}
                        </div>
                        <div className="form-group col-md-12 pt-2">
                           <label className="control-label">Actual Fee (in GWEI)</label>
                           <input type="text" className="form-control" placeholder="Enter Actual Fee"
                              {...register('actualFee', withdrawFeeData.actualFee)} name='actualFee' />
                           {errors?.actualFee && <span className="errMsg">{errors.actualFee.message}</span>}
                        </div>
                        <div className="form-group col-md-12 pt-2">
                           <label className="control-label">Min Transfer Amount Allowed</label>
                           <input type="text" className="form-control" placeholder="Enter Min Amount" name='min'
                              {...register('min', withdrawFeeData.min)} />
                           {errors?.min && <span className="errMsg">{errors.min.message}</span>}
                        </div>
                        <div className="form-group col-md-12 pt-2">
                           <label className="control-label">Max Transfer Amount Allowed</label>
                           <input type="text" className="form-control" placeholder="Enter Max Amount"
                              {...register('max', withdrawFeeData.max)} name='max' />
                           {errors?.max && <span className="errMsg">{errors.max.message}</span>}
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

export default SetWithdrawFee