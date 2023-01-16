import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RegisterUser, updateState } from "../../redux/auth/authActions";
import { displayModulesWithPermissions } from '../../redux/permissionsModule/permissionsModuleActions';
import { displayRoles } from "../../redux/roles/roleActions";
import { getSalesStatuses } from '../../redux/salesStatus/salesStatusActions';
import FullPageTransparentLoader from "../FullPageTransparentLoader/fullPageTransparentLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from 'react-router-dom';
import { useForm } from "react-hook-form";
import Select from 'react-select';
import ReactFlagsSelect from "react-flags-select";
import { getManagers } from "../../redux/users/userActions";

var rolesOptions = [];
var userTypeOptions = [{ label: 'Lead', value: 1 }, { label: 'Client', value: 2 }, { label: 'Affiliate', value: 3 }];
var userTypeStatus = [{ label: 'New', value: 1 }, { label: 'Call Back', value: 2 }, { label: 'Follow Up', value: 3 }, { label: 'No Answer', value: 4 }, { label: 'Deposited', value: 5 }, { label: 'Not interested', value: 6 }];

const AddUser = () => {

  const dispatch = useDispatch();
  const registered = useSelector(state => state.auth?.registered);
  const error = useSelector(state => state.auth?.error);
  const roles = useSelector(state => state.role?.roles?.roles);
  const fetched = useSelector(state => state.role?.fetched);
  const managersData = useSelector((state) => state?.users?.managers);
  console.log(managersData,"Managers data");
  const modulesWithPermissions = useSelector((state) => state.permissionsModule?.modulesWithPermissions);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [selectedPermissionModule, setSelectedPermissionModule] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedUserType, setSelectedUserType] = useState({ label: 'Lead', value: 1 });
  const [selectedUserStatus, setSelectedUserStatus] = useState({ label: 'New', value: 1 });
  const [selectedFlagCountry, setSelectedFlagCountry] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [loader, setLoader] = useState(false);
  const history = useHistory();
  const salesStatuses = useSelector(state => state?.salesStatus?.salesStatuses);
  const [salesStatusType, setSalesStatusType] = useState({ value: "", color: "#fff" });

  const [defaultManager, setDefaultManager] = useState(null);
  const [managers, setManagers] = useState([]);

  const { register, handleSubmit, formState: { errors } } = useForm();

    useEffect(() => {

        const intiEvent = async () => {

            await dispatch(getManagers());
            await dispatch(getSalesStatuses());
        }
        intiEvent();

    }, []);

    useEffect(() => {

        const initManagetData = async() => {

            if (managersData?.length > 0) {
                let allManagers = await managersData?.map(manage => { return { label: manage.firstName + ' ' + manage.lastName, value: manage._id } });
                setManagers(allManagers);
            }
        }
        initManagetData();

    }, [managersData])


  const addUser = {
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
    username: {
      required: "Username is required",
      pattern: {
        value: /^[a-zA-Z0-9_.-]*$/,
        message: 'Please enter only alphabets and numbers',
      }
    },
    email: {
      required: "Email is required",
      pattern: {
        value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        message: 'Please enter a valid email',
      }
    },
    phone: {
      required: "Phone number is required",
      pattern: {
        value: /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
        message: 'Please enter a valid contact number',
      }
    },
    password: {
      required: "Password is required",
      minLength: {
        value: 6,
        message: "Password must have at least 6 characters"
      }
    },
    dateOfBirth: {
      required: "Date of birth is required"
    }
  };

  const handleAddUser = (formData) => {
    setLoader(true);
    const data = {
      firstName: formData.firstname,
      lastName: formData.lastname,
      username: formData.username,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      dateOfBirth: formData.dateOfBirth,
      additionalInfo: additionalInfo,
      roleId: selectedRole.value,
      clientType: selectedUserType.value,
      // clientStatus: selectedUserStatus.value,
      countryCode: selectedFlagCountry,
      salesStatusId: salesStatusType?.value ? salesStatusType?.value : null,
      isVerified: true,
      status: true,
      defaultManager: defaultManager?.value
    };
    dispatch(RegisterUser(data));
  };

  useEffect(() => {
    if (registered) {
      setLoader(false);
      history.goBack();
    }
    dispatch(updateState())
  }, [registered])

  useEffect(() => {
    if (error) {
      setLoader(false);
      dispatch(updateState())
    }
  }, [error])

  useEffect(() => {
    dispatch(displayRoles());
    dispatch(displayModulesWithPermissions());
  }, []);

  useEffect(async () => {
    setLoader(true);
    rolesOptions = await roles?.map(role => { return { value: role._id, label: role.name } });
    if (rolesOptions && rolesOptions.length > 0) {
      setSelectedRole(rolesOptions?.[0]);
    }
    if (fetched)
      setLoader(false);
  }, [roles, fetched]);

  const handleRoleChange = (selectedRole) => {
    setSelectedRole(selectedRole);
  }

  const handleUserTypeChange = (selectedCurrUserType) => {
    setSelectedUserType(selectedCurrUserType);
  }

  const handleUserStatusChange = (selectedUserStatus) => {
    setSelectedUserStatus(selectedUserStatus);
  };

  const handleUserStatusChange2 = (e) => {
    setSalesStatusType({ value: e.target.value, color: e.target[e.target.selectedIndex].getAttribute('color') })
  };

  const handleModWithPermChange = async (event, mod) => {
    let perms = [...selectedPermissions];
    let modperms = [...selectedPermissionModule];

    if (event.target.checked) {
      if (modperms.indexOf(mod._id) == -1) {
        await modperms.push(mod._id)
      }
      mod?.permissions?.forEach(async (elem) => {
        if (perms.indexOf(elem._id) == -1) {
          await perms.push(elem._id)
        }
      })
    }
    else {
      const modpermIndex = await modperms.indexOf(mod._id);
      if (modpermIndex > -1) {
        await modperms.splice(modpermIndex, 1);
      }

      let removeValFromIndex = await mod?.permissions?.map(perm => perms.indexOf(perm._id));
      for (var i = removeValFromIndex.length - 1; i >= 0; i--)
        perms.splice(removeValFromIndex[i], 1);
    }
    setSelectedPermissionModule([...modperms]);
    setSelectedPermissions([...perms]);
  }

  const handlePermissionsChange = async (event, perm, mod) => {
    let perms = [...selectedPermissions];
    let modperms = [...selectedPermissionModule];

    if (event.target.checked) {
      if (perms.indexOf(perm._id) == -1) {
        await perms.push(perm._id)
      }
    }
    else {
      const permIndex = await perms.indexOf(perm._id);
      if (permIndex > -1) {
        await perms.splice(permIndex, 1);
      }
    }

    let isModChecked = mod?.permissions?.every(res => perms.includes(res._id))
    if (isModChecked) {
      if (modperms.indexOf(mod._id) == -1) {
        await modperms.push(mod._id)
      }
    }
    else {
      const modpermIndex = await modperms.indexOf(mod._id);
      if (modpermIndex > -1) {
        await modperms.splice(modpermIndex, 1);
      }
    }

    setSelectedPermissionModule([...modperms]);
    setSelectedPermissions([...perms]);
  }


  const handleDefaultManagerChange = (selectedDefaultManager) => {
    setDefaultManager(selectedDefaultManager);
 };

  const colourStyles = {
    control: (styles, { isSelected }) => ({
      ...styles,
      background: '#374057',
      color: '#fff',
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
    option: (styles, { isFocused, isSelected }) => ({
      ...styles,
      background: isFocused
        ? '#16202e'
        : isSelected
          ? '#16202e'
          : undefined,
      color: "#fff",
      cursor: 'pointer',
      zIndex: 1,
      "&:hover": {
        background: "#16202e",
      }
    }),
  }

  return (
    <>
      {loader ? (<FullPageTransparentLoader />) : (
        <>
          <div className="content-wrapper right-content-wrapper">
            <div className="content-box">
              <FontAwesomeIcon className="faArrowLeftIcon" icon={faArrowLeft} onClick={() => history.goBack()} />


              <ul className="nav nav-tabs mb-3" id="myTab" role="tablist">
                <li className="nav-item" role="presentation">
                  <button className="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">
                    Add User
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button className="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">
                    Add Permissions
                  </button>
                </li>
              </ul>
              <div className="tab-content" id="myTabContent">
                <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                  <h5>Add User</h5>
                  <form onSubmit={handleSubmit(handleAddUser)}>
                    <div className="form-group col-md-12">
                      <label className="control-label">First Name</label>
                      <input type="text" className="form-control" placeholder="Enter First name"
                        {...register('firstname', addUser.firstname)} name='firstname' />
                      {errors?.firstname && <span className="errMsg">{errors.firstname.message}</span>}
                    </div>
                    <div className="form-group col-md-12 pt-2">
                      <label className="control-label">Last Name</label>
                      <input type="text" className="form-control" placeholder="Enter Last name"
                        {...register('lastname', addUser.lastname)} name='lastname' />
                      {errors?.lastname && <span className="errMsg">{errors.lastname.message}</span>}
                    </div>
                    <div className="form-group col-md-12 pt-2">
                      <label className="control-label">User Name</label>
                      <input type="text" className="form-control" placeholder="Enter Username"
                        {...register('username', addUser.username)} name='username' />
                      {errors?.username && <span className="errMsg">{errors.username.message}</span>}
                    </div>
                    <div className="form-group col-md-12 pt-2 ">
                      <label className="control-label">Select Role</label>
                      <Select
                        value={selectedRole}
                        onChange={handleRoleChange}
                        options={rolesOptions}
                        styles={colourStyles}
                      />
                    </div>
                    <div className="form-group col-md-12 pt-2 ">
                      <label className="control-label">Select User Type</label>
                      <Select
                        value={selectedUserType}
                        onChange={handleUserTypeChange}
                        options={userTypeOptions}
                        styles={colourStyles}
                      />
                    </div>
                    {/* <div className="form-group col-md-12 pt-2 ">
                      <label className="control-label">Select User Status</label>
                      <Select
                        value={selectedUserStatus}
                        onChange={handleUserStatusChange}
                        options={userTypeStatus}
                        styles={colourStyles}
                      />
                    </div> */}
                    <div className="form-group col-md-12 pt-2">
                      <label className="control-label">Select User Status</label>
                      <select className="form-control user-status-select" name="type" value={salesStatusType?.value} onChange={handleUserStatusChange2} style={{ color: salesStatusType?.color ? salesStatusType?.color : "#fff" }}>
                        <option value="" style={{ color: "#fff" }} color="#fff">Select Status</option>
                        {salesStatuses?.length > 0 && salesStatuses?.map(currentStatus => {
                          return <option value={currentStatus?._id} key={currentStatus?._id} style={{ color: currentStatus?.color }} color={currentStatus?.color}> {currentStatus?.name}</option>
                        })}
                      </select>
                    </div>
                    {/* <div className="input-wrapper d-flex flex-lg-row flex-column align-items-lg-center align-items-start justify-content-between"> */}
                    <div className="form-group col-md-12 pt-2">
                      <label htmlFor="exampleFormControlInput1" className="form-label">Default Managers</label>
                      <Select
                        className='form-control'
                        value={defaultManager}
                        onChange={handleDefaultManagerChange}
                        options={managers}
                        styles={colourStyles}
                      />
                    </div>
                    <div className="form-group col-md-12 pt-2">
                      <label className="control-label">Email</label>
                      <input type="email" className="form-control" placeholder="Enter Email"
                        {...register('email', addUser.email)} name='email' />
                      {errors?.email && <span className="errMsg">{errors.email.message}</span>}
                    </div>
                    <div className="form-group col-md-12 pt-2">
                      <label className="control-label">Country</label>
                      <ReactFlagsSelect
                        selected={selectedFlagCountry}
                        onSelect={(code) => setSelectedFlagCountry(code)}
                        searchable={true}
                        searchPlaceholder="Search for a country"
                        className='admin-country-react-flags-select'
                      />
                    </div>
                    <div className="form-group col-md-12 pt-2  dob">
                      <label className="control-label">Select Date Of Birth</label>
                      <input type="date" className="form-control" placeholder="Type date of birth..." name='dateOfBirth'
                        {...register('dateOfBirth', addUser.dateOfBirth)} />
                      {errors?.dateOfBirth && <span className="errMsg">{errors.dateOfBirth.message}</span>}
                    </div>
                    <div className="form-group col-md-12 pt-2">
                      <label className="control-label">Phone Number</label>
                      <input type="text" className="form-control" placeholder="Enter Phone number" name='phone'
                        {...register('phone', addUser.phone)} />
                      {errors?.phone && <span className="errMsg">{errors.phone.message}</span>}
                    </div>
                    <div className="form-group col-md-12 pt-2">
                      <label className="control-label">Password</label>
                      <input type="password" className="form-control" placeholder="Enter Password"
                        {...register('password', addUser.password)} name='password' />
                      {errors?.password && <span className="errMsg">{errors.password.message}</span>}
                    </div>
                    <div className="form-group col-md-12 pt-2">
                      <label className="control-label">Additional Info</label>
                      <textarea placeholder="Enter additional info if any..." className="form-control" name="additionalInfo" value={additionalInfo} rows="3" onChange={(event) => setAdditionalInfo(event.target.value)}></textarea>
                    </div>
                    <div>
                      <button className="btn btn-default" type="submit">Save</button>
                    </div>
                  </form>
                </div>
                <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                  <h5>Add Permissions</h5>
                  <div className="add-permissions-container">
                    <div className="row">
                      {modulesWithPermissions?.length > 0 ? modulesWithPermissions?.map(modWithPerm => <div key={modWithPerm?._id} className="col-md-6">
                        <div className="checkboxes-wrapper">
                          <h6 className="d-flex align-items-center"><input type="checkbox" className="me-2" checked={selectedPermissionModule?.includes(modWithPerm?._id)} onChange={(e) => handleModWithPermChange(e, modWithPerm)} /> {modWithPerm.name}</h6>
                          <div className="child-checkboxes">
                            {modWithPerm?.permissions?.length > 0 &&
                              modWithPerm?.permissions?.map(perm => <>
                                <p key={perm?._id} className="text-white d-flex align-items-center mb-0"><input type="checkbox" className="me-1" checked={selectedPermissions?.includes(perm?._id)} onChange={(e) => handlePermissionsChange(e, perm, modWithPerm)} />{perm?.name}</p>
                              </>)
                            }
                          </div>
                        </div>
                      </div>) : null}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AddUser;