import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { getUserDetails, editUser, getManagers, updateAffiliateToken } from "../../redux/users/userActions";
import { getSalesStatuses } from '../../redux/salesStatus/salesStatusActions';
import FullPageTransparentLoader from "../FullPageTransparentLoader/fullPageTransparentLoader";
import { showAllCurrencies } from '../../redux/currency/currencyActions';
import { useForm } from "react-hook-form";
import Select from 'react-select';

var userTypeOptions = [{ label: 'Nothing selected', value: 1 }, { label: 'Client', value: 2 }, { label: 'Affiliate', value: 3 }];
var userTypeOptionsTwo = [{ label: 'Show', value: 1 }, { label: 'Client', value: 2 }, { label: 'Affiliate', value: 3 }];
var userTypeOptionsThree = [{ label: 'Lead', value: 1 }, { label: 'Client', value: 2 }, { label: 'Affiliate', value: 3 }];
var userTypeOptionsFour = [{ label: 'No', value: 1 }, { label: 'Client', value: 2 }, { label: 'Affiliate', value: 3 }];
var userTypeOptionsFive = [{ label: 'Yes', value: 1 }, { label: 'Client', value: 2 }, { label: 'Affiliate', value: 3 }];
var userTypeOptionsSix = [{ label: 'Stage', value: 1 }, { label: 'Client', value: 2 }, { label: 'Affiliate', value: 3 }];
var userTypeStatus = [{ label: 'New', value: 1 }, { label: 'Call Back', value: 2 }, { label: 'Follow Up', value: 3 }, { label: 'No Answer', value: 4 }, { label: 'Deposited', value: 5 }, { label: 'Not interested', value: 6 }];

const AffiliateDetails = () => {
   const [selectedUserType, setSelectedUserType] = useState({ label: 'Nothing selected', value: 1 });
   const [selectedUserTypeTwo, setSelectedUserTypeTwo] = useState({ label: 'Show', value: 1 });
   const [selectedUserTypeThree, setSelectedUserTypeThree] = useState({ label: 'Lead', value: 1 });
   const [selectedUserTypeFour, setSelectedUserTypeFour] = useState({ label: 'No', value: 1 });
   const [selectedUserTypeFive, setSelectedUserTypeFive] = useState({ label: 'Yes', value: 1 });
   const [selectedUserTypeSix, setSelectedUserTypeSix] = useState({ label: 'Stage', value: 1 });
   const [selectedUserStatus, setSelectedUserStatus] = useState({ label: 'New', value: 1 });
   const [managers, setManagers] = useState([]);
   const [defaultManager, setDefaultManager] = useState(null);
   const [affiliateAuthToken, setAffiliateAuthToken] = useState("");

   const [user, setUser] = useState("");
   const [loader, setLoader] = useState(false);

   let { id } = useParams();

   const dispatch = useDispatch();
   const userData = useSelector((state) => state?.users?.user);
   const updatedAffiliateToken = useSelector((state) => state?.users?.updatedAffiliateToken);
   const managersData = useSelector((state) => state?.users?.managers);
   const history = useHistory();
   const userEditted = useSelector(state => state?.users?.userEditted);
   const [selectedFlagCountry, setSelectedFlagCountry] = useState("");
   const [additionalInfo, setAdditionalInfo] = useState("");
   const [dateOfBirth, setDateOfBirth] = useState("");
   const salesStatuses = useSelector(state => state?.salesStatus?.salesStatuses);
   const [salesStatusType, setSalesStatusType] = useState({ value: "", color: "#fff" });

   const { register, handleSubmit, control, reset, formState: { errors } } = useForm();
   const { register: register1, handleSubmit: handleSubmit1, control: control1, reset: reset1, formState: { errors: errors1 } } = useForm();
   const { register: register2, handleSubmit: handleSubmit2, control: control2, reset: reset2, formState: { errors: errors2 } } = useForm();

   useEffect(async () => {
      await dispatch(getManagers());
      await dispatch(showAllCurrencies());
      await dispatch(getSalesStatuses());
      await dispatch(getUserDetails(id));
   }, []);

   useEffect(async () => {
      setLoader(true);
      setUser(userData);
      if (userData?.additionalInfo)
         setAdditionalInfo(userData?.additionalInfo);
      if (userData?.dateOfBirth)
         setDateOfBirth(userData?.dateOfBirth)
      if (userData?.countryCode)
         setSelectedFlagCountry(userData?.countryCode)
      if (userData?.clientType) {
         setSelectedUserType({ label: userData?.clientType === 1 ? 'Lead' : (userData?.clientType === 2 ? 'Client' : 'Affiliate'), value: userData?.clientType })
      }
      else {
         setSelectedUserType({ label: 'Lead', value: 1 })
      }

      if (userData?.clientStatus) {
         let currStatus = userTypeStatus.find(stat => stat.value == userData?.clientStatus);
         setSelectedUserStatus(currStatus)
      }
      else {
         setSelectedUserStatus(userTypeStatus?.[0])
      }

      if (userData?.salesStatus && Object.keys(userData?.salesStatus).length > 0) {
         setSalesStatusType({ value: userData?.salesStatus?._id, color: userData?.salesStatus?.color })
      }
      else {
         setSalesStatusType({ value: "", color: "#fff" });
      }

      if (userData?.affialiateToken) {
         setAffiliateAuthToken(userData?.affialiateToken);
      }


      if (userData) {
         reset({
            firstname: userData?.firstName,
            lastname: userData?.lastName,
            phone: userData?.phone,
            username: userData?.username
         });
         setLoader(false)
      }
   }, [userData]);

   useEffect(() => {
      if (updatedAffiliateToken) {
         setAffiliateAuthToken(updatedAffiliateToken);
      }
   }, [updatedAffiliateToken])

   useEffect(async () => {
      if (managersData?.length > 0) {
         let allManagers = await managersData?.map(manage => { return { label: manage.firstName + ' ' + manage.lastName, value: manage._id } });
         setManagers(allManagers);

         if (userData?.defaultManager) {
            let currManager = allManagers.find(stat => stat?.value == userData?.defaultManager);
            if (currManager) {
               setDefaultManager({ label: currManager.label, value: currManager.value });
            }
         }
      }
   }, [managersData, userData])


   const editUserData = {
      firstname: {
         required: "First name is required",
         pattern: {
            value: /^[A-Za-z ]*$/,
            message: 'Please enter only alphabets',
         }
      },
      lastname: {
         required: "Last name is required",
         pattern: {
            value: /^[A-Za-z ]*$/,
            message: 'Please enter only alphabets',
         }
      },
      phone: {
         required: "Phone Number is required",
         pattern: {
            value: /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
            message: 'Please enter a valid contact number',
         }
      },
      username: {
         required: "Username is required",
         pattern: {
            value: /^[a-zA-Z0-9_.-]*$/,
            message: 'Please enter only alphabets and numbers',
         }
      }
   };

   const handleSave = async (formData) => {
      setLoader(true);
      const data = {
         firstName: formData.firstname,
         lastName: formData.lastname,
         // clientStatus: selectedUserStatus.value,
         salesStatusId: salesStatusType?.value ? salesStatusType?.value : null
      };
      if (defaultManager?.value) {
         data.defaultManager = defaultManager?.value;
      }

      await dispatch(editUser(id, data));
   };

   useEffect(() => {
      if (userEditted) {
         setLoader(false);
      }
   }, [userEditted]);

   const handleUserTypeChange = (selectedCurrUserType) => {
      setSelectedUserType(selectedCurrUserType);
   }

   const handleUserStatusChange = (selectedUserStatus) => {
      setSelectedUserStatus(selectedUserStatus);
   };

   const handleUserStatusChange2 = (e) => {
      setSalesStatusType({ value: e.target.value, color: e.target[e.target.selectedIndex].getAttribute('color') })
   };

   const handleDefaultManagerChange = (selectedDefaultManager) => {
      setDefaultManager(selectedDefaultManager);
   };

   const HandleGenerateNewToken = async () => {
      await dispatch(updateAffiliateToken(id));
   };

   const onTokenChangeHandler = async (e) => {
   }

   const colourStyles = {
      control: (styles, { isDisabled, isSelected }) => ({
         ...styles,
         background: isDisabled ? '#aaa' : '#374057',
         color: isDisabled ? '#aaa' : 'fff',
         cursor: isDisabled ? 'not-allowed' : 'pointer',
         border: '1px solid #374057',
         boxShadow: isSelected ? "none" : "none",
         borderColor: isSelected ? "#374057" : "#374057",
         "&:hover": {
            boxShadow: 'none',
         },
      }),
      input: styles => ({
         ...styles,
         color: '#fff',
      }),
      singleValue: styles => ({
         ...styles,
         color: '#fff',
      }),
      menuList: styles => ({
         ...styles,
         background: '#374057',
      }),
      option: (styles, { isDisabled, isFocused, isSelected }) => ({
         ...styles,
         background: isFocused
            ? '#16202e'
            : isSelected
               ? '#16202e'
               : undefined,
         color: 'fff',
         cursor: isDisabled ? 'not-allowed' : 'pointer',
         zIndex: 1,
         "&:hover": {
            background: isDisabled ? '#aaa' : '#16202e',
         }
      }),
   }

   return (
      <>
         {loader ? <FullPageTransparentLoader /> :
            <>
               <div className="content-wrapper right-content-wrapper">
                  <div className="content-box bitrex-wrapper">
                     <div className="bitrex-wrapper-content">
                        <h2>{`${user?.firstName?.toUpperCase()} ${user?.lastName?.toUpperCase()}`}</h2>
                     </div>
                     <ul className="nav nav-tabs bitrex-tabs" id="myTab" role="tablist">
                        <li className="nav-item" role="presentation">
                           <button className="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">PERSONAL</button>
                        </li>
                        {/* <li className="nav-item" role="presentation">
                           <button className="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">CLIENTS</button>
                        </li>
                        <li className="nav-item" role="presentation">
                           <button className="nav-link" id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact" type="button" role="tab" aria-controls="contact" aria-selected="false">DESPOSITS</button>
                        </li>
                        <li className="nav-item" role="presentation">
                           <button className="nav-link" id="contact-three-tab" data-bs-toggle="tab" data-bs-target="#contact-three" type="button" role="tab" aria-controls="contact-three" aria-selected="false">ROUTING</button>
                        </li> */}
                     </ul>
                     <div className="tab-content" id="myTabContent">
                        <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                           <div className="row">
                              <div className='col-xl-6 col-lg-12'>
                                 <div className='bitrex-box-bg mb-4'>
                                    <div className='bitrex-box-bg-content'>
                                       <h2>AFFILIATE INFORMATION</h2>
                                    </div>
                                    <form className='bitrex-form form-group' onSubmit={handleSubmit(handleSave)}>
                                       <div className="input-wrapper d-flex flex-lg-row flex-column align-items-lg-center align-items-start justify-content-between">
                                          <label htmlFor="exampleFormControlInput1" className="form-label">First Name</label>
                                          {/* <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="Bitrex" /> */}
                                          <input type="text" className="form-control" placeholder="Enter First name"
                                             {...register('firstname', editUserData?.firstname)} name='firstname' defaultValue={user?.firstName} control={control} />
                                          {errors?.firstname && <span className="errMsg">{errors?.firstname?.message}</span>}
                                       </div>
                                       <div className="input-wrapper d-flex flex-lg-row flex-column align-items-lg-center align-items-start justify-content-between">
                                          <label htmlFor="exampleFormControlInput1" className="form-label">Last Name</label>
                                          <input type="text" className="form-control" placeholder="Enter Last name"
                                             {...register('lastname', editUserData?.lastname)} name='lastname' defaultValue={user?.lastName} control={control} />
                                          {errors?.lastname && <span className="errMsg">{errors?.lastname?.message}</span>}
                                       </div>
                                       <div className="input-wrapper d-flex flex-lg-row flex-column align-items-lg-center align-items-start justify-content-between">
                                          <label htmlFor="exampleFormControlInput1" className="form-label">E-mail</label>
                                          <input
                                             type="email"
                                             placeholder="email"
                                             className="form-control"
                                             value={user?.email}
                                             disabled
                                          />
                                       </div>
                                       {/* <div className="input-wrapper d-flex flex-lg-row flex-column align-items-lg-center align-items-start justify-content-between">
                                          <label htmlFor="exampleFormControlInput1" className="form-label">Select User Status</label>
                                          <Select
                                             className='form-control'
                                             value={selectedUserStatus}
                                             onChange={handleUserStatusChange}
                                             options={userTypeStatus}
                                             styles={colourStyles}
                                          />
                                       </div> */}
                                       <div className="input-wrapper d-flex flex-lg-row flex-column align-items-lg-center align-items-start justify-content-between">
                                          <label className="control-label">Select User Status</label>
                                          <select className="form-control user-status-select" name="type" value={salesStatusType?.value} onChange={handleUserStatusChange2} style={{ color: salesStatusType?.color ? salesStatusType?.color : "#fff" }}>
                                             <option value="" style={{ color: "#fff" }} color="#fff">Select Status</option>
                                             {salesStatuses?.length > 0 && salesStatuses?.map(currentStatus => {
                                                return <option value={currentStatus?._id} key={currentStatus?._id} style={{ color: currentStatus?.color }} color={currentStatus?.color}> {currentStatus?.name}</option>
                                             })}
                                          </select>
                                       </div>
                                       <div className="input-wrapper d-flex flex-lg-row flex-column align-items-lg-center align-items-start justify-content-between">
                                          <label htmlFor="exampleFormControlInput1" className="form-label">Default Managers</label>
                                          <Select
                                             className='form-control'
                                             value={defaultManager}
                                             onChange={handleDefaultManagerChange}
                                             options={managers}
                                             styles={colourStyles}
                                          />
                                       </div>
                                       <div className="input-wrapper d-flex flex-lg-row flex-column align-items-lg-center align-items-start justify-content-between">
                                          <label htmlFor="exampleFormControlInput1" className="form-label">Hide FTD data in API</label>
                                          <Select
                                             className='form-control'
                                             value={selectedUserTypeTwo}
                                             onChange={handleUserTypeChange}
                                             options={userTypeOptionsTwo}
                                             styles={colourStyles}
                                          />
                                       </div>
                                       <div className="input-wrapper d-flex flex-lg-row flex-column align-items-lg-center align-items-start justify-content-between">
                                          <label htmlFor="exampleFormControlInput1" className="form-label">Role of uploaded users</label>
                                          <Select
                                             className='form-control'
                                             value={selectedUserTypeThree}
                                             onChange={handleUserTypeChange}
                                             options={userTypeOptionsThree}
                                             styles={colourStyles}
                                          />
                                       </div>
                                       <div className="input-wrapper d-flex flex-lg-row flex-column align-items-lg-center align-items-start justify-content-between">
                                          <label htmlFor="exampleFormControlInput1" className="form-label">Minimum FTD Amount</label>
                                          <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="0" />
                                       </div>
                                       <div className="input-wrapper d-flex flex-lg-row flex-column align-items-lg-center align-items-start justify-content-between">
                                          <label htmlFor="exampleFormControlInput1" className="form-label">Allow Re-registeration</label>
                                          <Select
                                             className='form-control'
                                             value={selectedUserTypeFour}
                                             onChange={handleUserTypeChange}
                                             options={userTypeOptionsFour}
                                             styles={colourStyles}
                                          />
                                       </div>
                                       <div className="input-wrapper d-flex flex-lg-row flex-column align-items-lg-center align-items-start justify-content-between">
                                          <label htmlFor="exampleFormControlInput1" className="form-label">Create CFD Account by Default</label>
                                          <Select
                                             className='form-control'
                                             value={selectedUserTypeFive}
                                             onChange={handleUserTypeChange}
                                             options={userTypeOptionsFive}
                                             styles={colourStyles}
                                          />
                                       </div>

                                       <div className='d-flex justify-content-end'>
                                          <button className='btn-default' type="submit">Update Affiliate Details</button>
                                       </div>
                                    </form>
                                 </div>
                                 <div className='bitrex-box-bg mb-4'>
                                    <div className='bitrex-box-bg-content'>
                                       <h2>API & REFERRAL</h2>
                                    </div>
                                    <form className='bitrex-form form-group'>
                                       <div className="input-wrapper d-flex flex-lg-row flex-column align-items-lg-center align-items-start justify-content-between">
                                          <label htmlFor="exampleFormControlInput1" className="form-label">Select brand</label>
                                          <Select
                                             className='form-control'
                                             value={selectedUserTypeSix}
                                             onChange={handleUserTypeChange}
                                             options={userTypeOptionsSix}
                                             styles={colourStyles}
                                          />
                                       </div>
                                       {/* <div className="input-wrapper d-flex flex-lg-row flex-column align-items-lg-center align-items-start justify-content-between">
                                          <label htmlFor="exampleFormControlInput1" className="form-label">Affiliate Link</label>
                                          <input type="text" className="form-control" id="exampleFormControlInput1" placeholder={`${process.env.REACT_APP_SERVER_URL}/affiliate/50/personal`} />
                                       </div> */}
                                       <div className="input-wrapper d-flex flex-lg-row flex-column align-items-lg-center align-items-start justify-content-between">
                                          <label htmlFor="exampleFormControlInput1" className="form-label">Endpoint</label>
                                          <input type="text" className="form-control" id="exampleFormControlInput1" placeholder={`${process.env.REACT_APP_SERVER_URL}/api/user/affiliate/leads`} />
                                       </div>
                                       <div className="input-wrapper d-flex flex-lg-row flex-column align-items-lg-center align-items-start justify-content-between">
                                          <label htmlFor="exampleFormControlInput1" className="form-label">Authorization Token</label>
                                          <textarea rows="5" className='form-control' value={affiliateAuthToken} onChange={onTokenChangeHandler}></textarea>
                                       </div>
                                    </form>
                                    <div className='d-flex justify-content-end'>
                                       <button className='btn-default' onClick={() => HandleGenerateNewToken()}>Generate New Token</button>
                                    </div>
                                 </div>
                                 <div className='bitrex-box-bg mb-4'>
                                    <div className='bitrex-box-bg-content'>
                                       <h2>Shedule</h2>
                                       <p>Click cell, day or hour. The table is in your local time, will be converted to UTC automatically.</p>
                                    </div>
                                    <div className='d-flex justify-content-end'>
                                       <button className='btn-default'>Update Schedule</button>
                                    </div>
                                 </div>
                              </div>
                              <div className='col-xl-6 col-lg-12'>
                                 <div className='bitrex-box-bg mb-4'>
                                    <div className='bitrex-box-bg-content'>
                                       <h2>API:UPLOAD LEADS (POST)</h2>
                                    </div>
                                    <div className='bitrex-box-bg-info'>
                                       <h5>Headers:</h5>
                                    </div>
                                    <div className='bitrex-box-bg-info bitrex-box-bg-content padding'>
                                       <h6><span>Authorization:</span></h6>
                                       <p>{affiliateAuthToken}</p>
                                       <h6><span>Content-Type: </span> application/json</h6>
                                    </div>
                                    <div className='bitrex-box-bg-info'>
                                       <h5>Body:</h5>
                                    </div>
                                    <div className='bitrex-box-bg-info padding'>
                                       <h6><span>json: </span> {`{"leads": [{}, {} ... {}]}, see object structure in the example below`}</h6>
                                    </div>
                                    <div className='bitrex-box-bg-info box-border'>
                                       <h5>Example:</h5>
                                    </div>
                                    <div className='dummy-box-code'>
                                       <pre>{`curl --location --request POST `}<span className="endpoint">{`'${process.env.REACT_APP_SERVER_URL}/api/user/affiliate/leads'`}  \</span>{`
                                          --header 'Authorization: `}<span className="auth-token">{`${affiliateAuthToken}'`}  \</span>
                                          <span>{` 
                                          --header 'Content-Type: application/json' `}  \</span>{"\n"}
                                          {`--data-raw '{
                                             "leads": [{
                                             "email": "test@test.com",
                                             "phone": "+77777777777",
                                             "firstName": "Firstname",
                                             "lastName": "Lastname",
                                             "country": "Country Name",
                                             "password": "Password",
                                             "additionalInfo": "Some extra data"
                                             }]
                                          } '`}
                                       </pre>
                                    </div>
                                 </div>
                                 <div className='bitrex-box-bg mb-4'>
                                    <div className='bitrex-box-bg-content'>
                                       <h2>API:GET LEAD STATUS(GET)</h2>
                                    </div>
                                    <div className='bitrex-box-bg-info'>
                                       <h5>Headers:</h5>
                                    </div>
                                    <div className='bitrex-box-bg-info bitrex-box-bg-content padding'>
                                       <h6><span>Authorization:</span></h6>
                                       <p>{affiliateAuthToken}</p>
                                       <h6><span>Content-Type: </span> application/json</h6>
                                    </div>
                                    <div className='bitrex-box-bg-info'>
                                       <h5>PARAMS:</h5>
                                    </div>
                                    <div className='bitrex-box-bg-info padding'>
                                       <h6><span>deposited: </span> 1 or 0</h6>
                                       <h6><span>from: </span> unix time in seconds (converter)</h6>
                                       <h6><span>to: </span> unix time in seconds (converter)</h6>
                                    </div>
                                    <div className='bitrex-box-bg-info box-border'>
                                       <h5>Example:</h5>
                                    </div>
                                    <div className='dummy-box-code'>
                                       <pre>{`curl --location --request GET `}<span className="endpoint">{`'${process.env.REACT_APP_SERVER_URL}/api/user/affiliate/leads?deposited=1&from=1583020800&to=1599051426'`}  \<span>{` 
                                          --header 'Content-Type: application/json' `}  \</span>
                                       </span>{`
                                          --header 'Authorization: `}<span className="auth-token">{`${affiliateAuthToken}'`} </span>
                                       </pre>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                        {/* <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">...</div>
                        <div className="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">...</div>
                        <div className="tab-pane fade" id="contact-three" role="tabpanel" aria-labelledby="contact-three-tab">...</div> */}
                     </div>
                  </div>
               </div>
            </>
         }
      </>
   )
}

export default AffiliateDetails;