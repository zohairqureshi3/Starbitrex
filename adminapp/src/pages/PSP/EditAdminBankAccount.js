import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { getAdminBankAccount, editAdminBankAccount, updateState } from '../../redux/psp/adminBankAccountActions';
import FullPageTransparentLoader from "../FullPageTransparentLoader/fullPageTransparentLoader";

const EditAdminBankAccount = () => {
   const dispatch = useDispatch();
   const history = useHistory();
   let { id } = useParams();

   const [loader, setLoader] = useState(false);
   const [adminBankAccountData, setAdminBankAccountData] = useState({ name: "", iban: "", accountNumber: "", bankAddress: "", swiftCode: "", });
   const adminBankAccount = useSelector(state => state?.adminBankAccount?.adminBankAccount);
   const adminBankAccountfetched = useSelector(state => state?.adminBankAccount?.adminBankAccountfetched);
   const adminBankAccountEditted = useSelector(state => state?.adminBankAccount?.adminBankAccountEditted);

   const { register, handleSubmit, reset, control, formState: { errors } } = useForm({
      defaultValues: adminBankAccountData,
   });

   useEffect(async () => {
      setLoader(true);
      await dispatch(getAdminBankAccount(id));
   }, []);

   useEffect(async () => {
      if (adminBankAccountfetched) {
         await dispatch(updateState());
         setLoader(false);
      }
   }, [adminBankAccountfetched]);

   useEffect(() => {
      if (Object.keys(adminBankAccount)?.length > 0) {
         setAdminBankAccountData(adminBankAccount);
         reset(adminBankAccount);
      }
   }, [adminBankAccount])


   useEffect(() => {
      if (adminBankAccountEditted) {
         history.goBack();
      }
   }, [adminBankAccountEditted])

   const editAdminBankAccountData = {
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
      dispatch(editAdminBankAccount(id, data));
   };

   return (
      <>
         {loader ? (<FullPageTransparentLoader />) :
            <div className="content-wrapper right-content-wrapper">
               <div className="content-box">
                  <FontAwesomeIcon className="faArrowLeftIcon" icon={faArrowLeft} onClick={() => history.goBack()} />
                  <h5>Edit Bank Account</h5>
                  <form onSubmit={handleSubmit(handleSave)}>
                     <div className="form-group col-md-12">
                        <label className="control-label">Bank Name</label>
                        <input type="text" className="form-control" placeholder="Enter Bank Name"
                           {...register('name', editAdminBankAccountData.name)} name='name' control={control} />
                        {errors?.name && <span className="errMsg">{errors.name.message}</span>}
                     </div>
                     <div className="form-group col-md-12 pt-2">
                        <label className="control-label">IBAN</label>
                        <input type="text" className="form-control" placeholder="Enter IBAN"
                           {...register('iban', editAdminBankAccountData.iban)} name='iban' control={control} />
                        {errors?.iban && <span className="errMsg">{errors.iban.message}</span>}
                     </div>
                     <div className="form-group col-md-12 pt-2">
                        <label className="control-label">Account Number</label>
                        <input type="text" className="form-control" placeholder="Enter Account Number"
                           {...register('accountNumber', editAdminBankAccountData.accountNumber)} name='accountNumber' control={control} />
                        {errors?.accountNumber && <span className="errMsg">{errors.accountNumber.message}</span>}
                     </div>
                     <div className="form-group col-md-12 pt-2">
                        <label className="control-label">Bank Address</label>
                        <input type="text" className="form-control" placeholder="Enter Bank Address"
                           {...register('bankAddress', editAdminBankAccountData.bankAddress)} name='bankAddress' control={control} />
                        {errors?.bankAddress && <span className="errMsg">{errors.bankAddress.message}</span>}
                     </div>
                     <div className="form-group col-md-12 pt-2">
                        <label className="control-label">Swift Code</label>
                        <input type="text" className="form-control" placeholder="Enter Swift Code"
                           {...register('swiftCode', editAdminBankAccountData.swiftCode)} name='swiftCode' control={control}
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

export default EditAdminBankAccount;
