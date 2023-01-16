import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams, useHistory } from "react-router-dom";
import { getUserDetails, editUser, userDirectLogin } from "../../redux/users/userActions";
import FullPageTransparentLoader from "../FullPageTransparentLoader/fullPageTransparentLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { getPermission } from "../../config/helpers";
import { getRole } from '../../redux/roles/roleActions';
import { useForm } from "react-hook-form";
import ReactFlagsSelect from "react-flags-select";
import EditUser from "./UserDetailComponents/EditUser";
import AssetInformation from "./UserDetailComponents/AssetInformation";
import Deposit from "./UserDetailComponents/Deposit";
import WithdrawalComponent from "./UserDetailComponents/WithdrawalComponent";
import PendingOrder from "./UserDetailComponents/PendingOrder";
import ActiveOrder from "./UserDetailComponents/ActiveOrder";
import ExchangeList from "./UserDetailComponents/ExchangeList";
import TradeHistory from "./UserDetailComponents/TradeHistory";


const UserDetail = () => {
  let { id } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();

  const [user, setUser] = useState("");
  const [selectedFlagCountry, setSelectedFlagCountry] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [loader, setLoader] = useState(false);
  const userData = useSelector((state) => state?.users?.user);
  const userEditted = useSelector(state => state?.users?.userEditted);
  const roleData = useSelector(state => state?.role.role);
  const permissions = roleData[0]?.permissions;
  const permissionName = getPermission(permissions);

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm();

  // ----------------------------------

  useEffect(async () => {
    const loginData = localStorage.getItem('user');
    const data = JSON.parse(loginData);
    const roleId = data?.roleId;
    dispatch(getRole(roleId));
    await dispatch(getUserDetails(id));
  }, []);


  useEffect(async () => {
    setLoader(true);
    setUser(userData);
    if (userData?.dateOfBirth)
      setDateOfBirth(userData?.dateOfBirth)
    if (userData?.countryCode)
      setSelectedFlagCountry(userData?.countryCode)

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
      phone: formData.phone,
      username: formData.username,
      dateOfBirth: dateOfBirth,
      countryCode: selectedFlagCountry,
    };
    await dispatch(editUser(id, data));
  };

  useEffect(() => {
    if (userEditted) {
      // history.goBack();
      setLoader(false);
    }
  }, [userEditted]);


  const loginAsUser = (user) => {
    if (user?._id) {
      const data = { email: user?.email, userByAdmin: true }
      dispatch(userDirectLogin(data))
    }
  }


  return (
    <>
      {loader ? (<FullPageTransparentLoader />) : user && user ? (
        <>
          <div className="content-wrapper right-content-wrapper">
            <div className="content-box">
              {/* <AdminSocket sendPairtoParent={(pair) => setPairName(pair)} /> */}
              <FontAwesomeIcon className="faArrowLeftIcon" icon={faArrowLeft} onClick={() => history.goBack()} />
              <h5>User Information</h5>
              <button className="btn btn-default" onClick={() => loginAsUser(user)}>Login</button>
              <form onSubmit={handleSubmit(handleSave)}>
                <div className="row">
                  <div className="form-group col-md-4 mt-2">
                    <label className="control-label">First Name</label>
                    <input type="text" className="form-control" placeholder="Enter First name"
                      {...register('firstname', editUserData?.firstname)} name='firstname' defaultValue={user?.firstName} control={control} />
                    {errors?.firstname && <span className="errMsg">{errors?.firstname?.message}</span>}
                  </div>
                  <div className="form-group col-md-4 mt-2">
                    <label className="control-label">Last Name</label>
                    <input type="text" className="form-control" placeholder="Enter Last name"
                      {...register('lastname', editUserData?.lastname)} name='lastname' defaultValue={user?.lastName} control={control} />
                    {errors?.lastname && <span className="errMsg">{errors?.lastname?.message}</span>}
                  </div>
                  <div className="form-group col-md-4 mt-2">
                    <label className="control-label">User Name</label>
                    <input type="text" className="form-control" placeholder="Enter Last name"
                      {...register('username', editUserData?.username)} name='username' defaultValue={user?.username} control={control} />
                    {errors?.username && <span className="errMsg">{errors?.username?.message}</span>}
                  </div>

                  <div className="form-group col-md-4 mt-2">
                    <label className="control-label">Country</label>
                    <ReactFlagsSelect
                      selected={selectedFlagCountry}
                      onSelect={(code) => setSelectedFlagCountry(code)}
                      searchable={true}
                      searchPlaceholder="Search for a country"
                      className='admin-country-react-flags-select'
                    />
                  </div>
                  {
                    permissionName && permissionName.length > 0 && permissionName.includes('user_email') ?
                      <div className="form-group col-md-4 mt-2">
                        <label className="control-label">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          value={user.email}
                          disabled
                        />
                      </div>
                      : null
                  }
                  {
                    permissionName && permissionName.length > 0 && permissionName.includes('user_phone') ?
                      <div className="form-group col-md-4 mt-2">
                        <label className="control-label">Phone Number</label>
                        <input type="text" className="form-control" placeholder="Enter Phone number"
                          {...register('phone', editUserData?.phone)} name='phone' defaultValue={user?.phone} control={control} />
                        {errors?.phone && <span className="errMsg">{errors?.phone?.message}</span>}
                      </div>
                      : null
                  }
                </div>
                <div>
                  <button className="btn btn-default" type="submit">Save</button>
                </div>
                <br />
              </form>
              <br />
              <div>
                <ul className="nav nav-tabs" id="myTab">
                  <li className="nav-item">
                    <Link
                      className="nav-link active"
                      data-bs-toggle="tab"
                      to="#editUser"
                    >
                      Edit User
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      data-bs-toggle="tab"
                      to="#assetInfo"
                    >
                      Asset Information
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      data-bs-toggle="tab"
                      to="#deposits"
                    >
                      Deposits
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      data-bs-toggle="tab"
                      to="#withdraws"
                    >
                      Withdrawals
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      data-bs-toggle="tab"
                      to="#pendingOrder"
                    >
                      Pending Order
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      data-bs-toggle="tab"
                      to="#activeOrder"
                    >
                      Active Order
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      data-bs-toggle="tab"
                      to="#orderList"
                    >
                      Exchange List
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      data-bs-toggle="tab"
                      to="#tradehist"
                    >
                      Trade History
                    </Link>
                  </li>
                </ul>
                <br />

                <div className="tab-content">
                  <EditUser />

                  <AssetInformation />

                  <Deposit />

                  <WithdrawalComponent />
                  <PendingOrder />
                  <ActiveOrder />
                  <ExchangeList />
                  <TradeHistory />
                </div>
              </div>
            </div>
          </div>
        </>
      ) : ("")
      }
    </>
  );
};

export default UserDetail;