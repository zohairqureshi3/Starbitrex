import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { addAdminBankAccount, updateState } from '../../redux/psp/adminBankAccountActions';
import FullPageTransparentLoader from "../FullPageTransparentLoader/fullPageTransparentLoader";

const AddAdminBankAccount = () => {
   const dispatch = useDispatch();
   const history = useHistory();

   const [loader, setLoader] = useState(false);
   const adminBankAccountAdded = useSelector(state => state?.adminBankAccount?.adminBankAccountAdded);
   const error = useSelector(state => state?.adminBankAccount?.error);

   const { register, handleSubmit, control, formState: { errors } } = useForm();

   const adminBankAccountData = {
      name: {
         required: "Name is required"
      },
      iban: {
         required: "IBAN is required"
      },
      accountNumber: {
         required: "Account number is required"
      },
      bankAddress: {
         required: "Bank address is required"
      },
      swiftCode: {
         required: "Swift code is required"
      }
   };

   const handleSave = (formData) => {
      setLoader(true);
      const data = {
         name: formData.name,
         iban: formData.iban,
         accountNumber: formData.accountNumber,
         bankAddress: formData.bankAddress,
         swiftCode: formData.swiftCode
      };
      dispatch(addAdminBankAccount(data));
   };


   useEffect(() => {
      if (adminBankAccountAdded) {
         dispatch(updateState());
         history.goBack();
      }
   }, [adminBankAccountAdded])


   useEffect(() => {
      if (error) {
         setLoader(false);
         dispatch(updateState());
      }
   }, [error])

   return (
      <>
         {loader ? (<FullPageTransparentLoader />) :
            <div className="content-wrapper right-content-wrapper">
               <div className="content-box">
                  <FontAwesomeIcon className="faArrowLeftIcon" icon={faArrowLeft} onClick={() => history.goBack()} />
                  <h5>Add Bank Account</h5>
                  <form onSubmit={handleSubmit(handleSave)}>
                     <div className="form-group col-md-12">
                        <label className="control-label">Bank Name</label>
                        <input type="text" className="form-control" placeholder="Enter Bank Name"
                           {...register('name', adminBankAccountData.name)} name='name' defaultValue={""} control={control} />
                        {errors?.name && <span className="errMsg">{errors.name.message}</span>}
                     </div>
                     <div className="form-group col-md-12 pt-2">
                        <label className="control-label">IBAN</label>
                        <input type="text" className="form-control" placeholder="Enter IBAN"
                           {...register('iban', adminBankAccountData.iban)} name='iban' defaultValue={""} control={control} />
                        {errors?.iban && <span className="errMsg">{errors.iban.message}</span>}
                     </div>
                     <div className="form-group col-md-12 pt-2">
                        <label className="control-label">Account Number</label>
                        <input type="text" className="form-control" placeholder="Enter Account Number"
                           {...register('accountNumber', adminBankAccountData.accountNumber)} name='accountNumber' defaultValue={""} control={control} />
                        {errors?.accountNumber && <span className="errMsg">{errors.accountNumber.message}</span>}
                     </div>
                     <div className="form-group col-md-12 pt-2">
                        <label className="control-label">Bank Address</label>
                        <input type="text" className="form-control" placeholder="Enter Bank Address"
                           {...register('bankAddress', adminBankAccountData.bankAddress)} name='bankAddress' defaultValue={""} control={control} />
                        {errors?.bankAddress && <span className="errMsg">{errors.bankAddress.message}</span>}
                     </div>
                     <div className="form-group col-md-12 pt-2">
                        <label className="control-label">Swift Code</label>
                        <input type="text" className="form-control" placeholder="Enter Swift Code"
                           {...register('swiftCode', adminBankAccountData.swiftCode)} name='swiftCode' defaultValue={""} control={control}
                        />
                        {errors?.swiftCode && <span className="errMsg">{errors.swiftCode.message}</span>}
                     </div>
                     <div>
                        <button className="btn btn-default" type="submit">Save</button>
                     </div>
                  </form>
               </div>
            </div>
         }
      </>
   );
};

export default AddAdminBankAccount;
