import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { showAllCurrencies } from '../../redux/currency/currencyActions';
import { showAllNetworks } from '../../redux/network/networkActions';
import { addSetting, editSetting, showAllSettings } from '../../redux/settings/settingsActions';

const Settings = () => {

   const dispatch = useDispatch();
   const networks = useSelector(state => state.network?.networks?.allNetworks);
   const currencies = useSelector(state => state.currency?.currencies?.allCurrencies);
   const settings = useSelector(state => state.settings?.settings?.settings);

   const initialUserState = {
      siteTitle: "", companyName: "", contactNumber: "", contactEmail: "", companyRegistrationNumber: "", companyAddress: "",
      companyZipCode: "", companyCity: "", companyCountry: "", operatingHours: "", pinterest: "", facebook: "", twitter: "", linkedin: "",
      ethNetwork: "", ethAddress: "", ethPercenage: "",
      xrpNetwork: "", xrpAddress: "", xrpPercenage: "",
      btcNetwork: "", btcAddress: "", btcPercenage: "",
   };
   const [info, setInfo] = useState(initialUserState);

   const handleChange = (e) => {
      setInfo({ ...info, [e.target.name]: e.target.value })
   };

   const handleDropDownChange = (name, val) => {
      setInfo({ ...info, [name]: val })
   };

   const handleSubmit = () => {
      dispatch(editSetting(info));
   }

   useEffect(() => {
      dispatch(showAllNetworks());
      dispatch(showAllSettings());
      dispatch(showAllCurrencies());
   }, []);

   useEffect(() => {
      if (settings)
         setInfo(settings)
   }, [settings]);

   return (
      <>
            <div className="content-wrapper right-content-wrapper">
               <div className="content-box">
                  <h3>Settings</h3>
                  <form>
                     <div className='row'>
                        <div className="form-group col-md-4">
                           <label className="control-label">Site Title</label>
                           <input type="text" required="required" className="form-control" onChange={handleChange}
                              name="siteTitle" value={info.siteTitle} placeholder="Enter Site Title" />
                        </div>
                        <div className="form-group col-md-4">
                           <label className="control-label">Company Name</label>
                           <input type="text" required="required" className="form-control" onChange={handleChange}
                              name="companyName" value={info.companyName} placeholder="Enter Company Name" />
                        </div>
                        <div className="form-group col-md-4">
                           <label className="control-label">Contact Number</label>
                           <input type="text" required="required" className="form-control" onChange={handleChange}
                              name="contactNumber" value={info.contactNumber} placeholder="Enter Contact Number" />
                        </div>
                     </div>
                     <br />
                     <div className='row'>
                        <div className="form-group col-md-4">
                           <label className="control-label">Contact Email</label>
                           <input type="text" required="required" className="form-control" onChange={handleChange}
                              name="contactEmail" value={info.contactEmail} placeholder="Enter Contact Email" />
                        </div>
                        <div className="form-group col-md-4">
                           <label className="control-label">Company Registration Number</label>
                           <input type="text" required="required" className="form-control" onChange={handleChange}
                              name="companyRegistrationNumber" value={info.companyRegistrationNumber} placeholder="Enter Company Registration Number" />
                        </div>
                        <div className="form-group col-md-4">
                           <label className="control-label">Company Address</label>
                           <input type="text" required="required" className="form-control" onChange={handleChange}
                              name="companyAddress" value={info.companyAddress} placeholder="Enter Company Address" />
                        </div>
                     </div>
                     <br />
                     <div className='row'>
                        <div className="form-group col-md-4">
                           <label className="control-label">Company ZipCode</label>
                           <input type="text" required="required" className="form-control" onChange={handleChange}
                              name="companyZipCode" value={info.companyZipCode} placeholder="Enter Company ZipCode" />
                        </div>
                        <div className="form-group col-md-4">
                           <label className="control-label">Company City</label>
                           <input type="text" required="required" className="form-control" onChange={handleChange}
                              name="companyCity" value={info.companyCity} placeholder="Enter Company City" />
                        </div>
                        <div className="form-group col-md-4">
                           <label className="control-label">Company Country</label>
                           <input type="text" required="required" className="form-control" onChange={handleChange}
                              name="companyCountry" value={info.companyCountry} placeholder="Enter Company Country" />
                        </div>
                     </div>
                     <br />
                     <div className='row'>
                        <div className="form-group col-md-4">
                           <label className="control-label">Operating Hours</label>
                           <input type="text" required="required" className="form-control" onChange={handleChange}
                              name="operatingHours" value={info.operatingHours} placeholder="Enter Operating Hours" />
                        </div>
                        <div className="form-group col-md-4">
                           <label className="control-label">Pinterest</label>
                           <input type="text" required="required" className="form-control" onChange={handleChange}
                              name="pinterest" value={info.pinterest} placeholder="Enter Pinterest" />
                        </div>
                        <div className="form-group col-md-4">
                           <label className="control-label">Facebook</label>
                           <input type="text" required="required" className="form-control" onChange={handleChange}
                              name="facebook" value={info.facebook} placeholder="Enter Facebook" />
                        </div>
                     </div>
                     <br />
                     <div className='row'>
                        <div className="form-group col-md-4">
                           <label className="control-label">Twitter</label>
                           <input type="text" required="required" className="form-control" onChange={handleChange}
                              name="twitter" value={info.twitter} placeholder="Enter Twitter" />
                        </div>
                        <div className="form-group col-md-4">
                           <label className="control-label">Linkedin</label>
                           <input type="text" required="required" className="form-control" onChange={handleChange}
                              name="linkedin" value={info.linkedin} placeholder="Enter Linkedin" />
                        </div>
                     </div>
                     <div>
                        <button type='button' className="btn-default btn" onClick={() => handleSubmit()}>Save</button>
                     </div>
                  </form>
               </div>
            </div>
      </>
   )
}

export default Settings