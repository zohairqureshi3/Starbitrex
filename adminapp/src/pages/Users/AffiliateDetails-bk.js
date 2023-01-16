import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams, useHistory } from "react-router-dom";
import { getUserDetails, editUser, addCurrencyAmountToUserAccount, removeCurrencyAmountFromUserAccount, userDirectLogin } from "../../redux/users/userActions";
import FullPageTransparentLoader from "../FullPageTransparentLoader/fullPageTransparentLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faClone, faTrash } from "@fortawesome/free-solid-svg-icons";
import { showAllCurrencies } from '../../redux/currency/currencyActions';
import { getAdminComments, addAdminComment, deleteAdminComment, deleteAdminComments } from '../../redux/adminComment/adminCommentActions';
import DataTable from 'react-data-table-component';
import { CopyToClipboard } from "react-copy-to-clipboard";
import Swal from 'sweetalert2';
import { useForm } from "react-hook-form";
import { Form } from 'react-bootstrap';
import Select from 'react-select';
import ReactFlagsSelect from "react-flags-select";

const currencyFormatter = require('currency-formatter');

var userTypeOptions = [{ label: 'Lead', value: 1 }, { label: 'Client', value: 2 }, { label: 'Affiliate', value: 3 }];
var userTypeStatus = [{ label: 'New', value: 1 }, { label: 'Call Back', value: 2 }, { label: 'Follow Up', value: 3 }, { label: 'No Answer', value: 4 }, { label: 'Not interested', value: 5 }];

const AffiliateDetails = () => {
  const [user, setUser] = useState("");
  const [loader, setLoader] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  let { id } = useParams();

  const dispatch = useDispatch();
  const userData = useSelector((state) => state?.users?.user);
  // const transactionsData = useSelector(state => state.transaction.transactions);
  const internalTransactions = useSelector((state) => state.users?.user?.internalTransaction);
  const deposits = useSelector((state) => state.users?.user?.externalTransactions?.filter(row => row.transactionType != true));
  const withdraws = useSelector((state) => state.users?.user?.externalTransactions?.filter(row => row.transactionType == true));
  const history = useHistory();
  const userEditted = useSelector(state => state?.users?.userEditted);
  const [selectedFlagCountry, setSelectedFlagCountry] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [selectedUserType, setSelectedUserType] = useState({ label: 'Lead', value: 1 });
  const [selectedUserStatus, setSelectedUserStatus] = useState({ label: 'New', value: 1 });

  const adminComments = useSelector((state) => state?.adminComment?.adminComments);
  const adminCommentsFetched = useSelector((state) => state?.adminComment?.fetched);
  const [adminComment, setAdminComment] = useState("");
  const [adminCommentErr, setAdminCommentErr] = useState("");
  const [isCheckAllComments, setIsCheckAllComments] = useState(false);
  const [isCheckComment, setIsCheckComment] = useState([]);
  const [isCheckCommentErr, setIsCheckCommentErr] = useState("");
  const [commentLoader, setCommentLoader] = useState(false);

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm();
  const { register: register1, handleSubmit: handleSubmit1, control: control1, reset: reset1, formState: { errors: errors1 } } = useForm();
  const { register: register2, handleSubmit: handleSubmit2, control: control2, reset: reset2, formState: { errors: errors2 } } = useForm();

  useEffect(async () => {
    setCommentLoader(true);
    await dispatch(showAllCurrencies());
    await dispatch(getUserDetails(id));
    await dispatch(getAdminComments(id));
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
      selectedUserStatus({ label: userData?.clientStatus === 1 ? 'New' : 'Not interested', value: userData?.clientStatus })
    }
    else {
      setSelectedUserStatus({ label: 'New', value: 1 })
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
    if (adminCommentsFetched) {
      setCommentLoader(false);
    }
  }, [adminCommentsFetched]);

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
      additionalInfo: additionalInfo,
      clientType: selectedUserType.value,
      clientStatus: selectedUserStatus.value
    };
    await dispatch(editUser(id, data));
  };

  useEffect(() => {
    if (userEditted) {
      history.goBack();
    }
  }, [userEditted]);

  const copyReferral = () => {
    Swal.fire({
      text: 'Successfully copied!',
      icon: 'success',
      showCancelButton: false,
      confirmButtonText: 'OK',
    })
  }

  const padTo2Digits = (num) => {
    return num.toString().padStart(2, '0');
  }

  const loginAsUser = (user) => {
    if (user?._id) {
      const data = { email: user?.email, userByAdmin: true }
      dispatch(userDirectLogin(data))
    }
  }

  const formatDate = (date) => {
    return (
      [
        date.getFullYear(),
        padTo2Digits(date.getMonth() + 1),
        padTo2Digits(date.getDate()),
      ].join('-') +
      ' ' +
      [
        padTo2Digits(date.getHours()),
        padTo2Digits(date.getMinutes()),
        padTo2Digits(date.getSeconds()),
      ].join(':')
    );
  }





  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!adminComment) {
      setAdminCommentErr("Comment is required");
    }
    else {
      let authorId = JSON.parse(localStorage.getItem('userId'));
      let author = JSON.parse(localStorage.getItem('user'));
      const data = {
        text: adminComment,
        authorId: authorId,
        userId: id,
        author: author
      }
      setAdminCommentErr("");
      setAdminComment("");
      await dispatch(addAdminComment(data));
    }
  }

  const handleSelectAllComments = e => {
    setIsCheckCommentErr("");
    setIsCheckAllComments(!isCheckAllComments);
    setIsCheckComment(adminComments?.map(li => li._id));
    if (isCheckAllComments) {
      setIsCheckComment([]);
    }
  };

  const handleCommentClick = e => {
    setIsCheckCommentErr("");
    const { value, checked } = e.target;
    setIsCheckComment([...isCheckComment, value]);
    if (!checked) {
      setIsCheckComment(isCheckComment.filter(item => item !== value));
    }
  };

  useEffect(() => {
    setIsCheckCommentErr("");
    if (isCheckComment?.length === adminComments?.length) {
      setIsCheckAllComments(true);
    }
    else {
      setIsCheckAllComments(false);
    }
  }, [isCheckComment, adminComments])


  const handleDelSingleComment = async (e, commentId) => {
    e.preventDefault();
    setIsCheckCommentErr("");
    Swal.fire({
      title: `Are you sure you want to Delete?`,
      html: '',
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: "Yes"
    }).then((result) => {
      if (result.isConfirmed === true) {
        dispatch(deleteAdminComment(commentId));
        setIsCheckComment([]);
      }
    })
  }

  const handleDelMultiComments = async (e) => {
    e.preventDefault();
    if (isCheckComment?.length < 1) {
      setIsCheckCommentErr("Check atleast one comment to delete");
    }
    else if (isCheckComment?.length > 0) {
      setIsCheckCommentErr("");
      const data = {
        ids: isCheckComment,
        userId: id
      }

      Swal.fire({
        title: `Are you sure you want to Delete?`,
        html: '',
        showCloseButton: true,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: "Yes"
      }).then((result) => {
        if (result.isConfirmed === true) {
          dispatch(deleteAdminComments(data));
          setIsCheckComment([]);
        }
      })
    }
  }

  const handleUserTypeChange = (selectedCurrUserType) => {
    setSelectedUserType(selectedCurrUserType);
  }

  const handleUserStatusChange = (selectedUserStatus) => {
    setSelectedUserStatus(selectedUserStatus);
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
      {loader || commentLoader ? (<FullPageTransparentLoader />) : user && user ? (
        <>
          <div className="content-wrapper right-content-wrapper">
            <div className="content-box">
              <FontAwesomeIcon className="faArrowLeftIcon" icon={faArrowLeft} onClick={() => history.goBack()} />
              <h5>Affiliate Information</h5>
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
                  <div className="form-group col-md-4 mt-2">
                    <label className="control-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={user.email}
                      disabled
                    />
                  </div>
                  <div className="form-group col-md-4 mt-2">
                    <label className="control-label">Phone Number</label>
                    <input type="text" className="form-control" placeholder="Enter Phone number"
                      {...register('phone', editUserData?.phone)} name='phone' defaultValue={user?.phone} control={control} />
                    {errors?.phone && <span className="errMsg">{errors?.phone?.message}</span>}
                  </div>
                </div>
                <br />
              </form>
              <br />
              <div>


                <br />

                <div className="tab-content">
                  <div className="tab-pane fade show active" id="editUser">
                    <h5> Sales Information </h5>
                    <form onSubmit={handleSubmit(handleSave)}>
                      <div className="row">
                        {/* <div className="form-group col-md-4 mt-2">
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
                        <div className="form-group col-md-4 mt-2">
                          <label className="control-label">Email</label>
                          <input
                            type="email"
                            className="form-control"
                            value={user.email}
                            disabled
                          />
                        </div>
                        <div className="form-group col-md-4 mt-2">
                          <label className="control-label">Phone Number</label>
                          <input type="text" className="form-control" placeholder="Enter Phone number"
                            {...register('phone', editUserData?.phone)} name='phone' defaultValue={user?.phone} control={control} />
                          {errors?.phone && <span className="errMsg">{errors?.phone?.message}</span>}
                        </div> */}
                        <div className="form-group col-md-4 mt-2 dob">
                          <label className="control-label">Select Date Of Birth</label>
                          <input type="date" className="form-control" placeholder="Type date of birth..."
                            name='dateOfBirth' value={dateOfBirth ? new Date(dateOfBirth)?.toISOString()?.substring(0, 10) : new Date()?.toISOString()?.substring(0, 10)} onChange={(event) => setDateOfBirth(event.target.value)} />
                        </div>
                        <div className="form-group col-md-4 mt-2">
                          <label className="control-label">Select User Type</label>
                          <Select
                            value={selectedUserType}
                            onChange={handleUserTypeChange}
                            options={userTypeOptions}
                            styles={colourStyles}
                          />
                        </div>
                        {user.ref && user.ref.refererId ?
                          <div className="form-group col-md-4 mt-2">
                            <label className="control-label">Referrer Id</label>
                            <input
                              type="text"
                              className="form-control"
                              value={user.ref.refererId}
                              disabled
                            />
                          </div>
                          : null
                        }
                        <div className="form-group col-md-4 mt-2">
                          <label className="control-label">
                            Affiliate Channel
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            value="Web"
                            disabled
                          />
                        </div>
                        {user.referals && user.referals.length ?
                          <div className="form-group col-md-4 mt-2">
                            <label className="control-label">Invitation Count</label>
                            <input
                              type="text"
                              className="form-control"
                              value={user.referals.length}
                              disabled
                            />
                          </div>
                          : null
                        }
                        <div className="form-group col-md-4 mt-2">
                          <label className="control-label">Registration Time</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formatDate(new Date(user?.createdAt))}
                            disabled
                          />
                        </div>
                        {user.verifiedAt ?
                          <div className="form-group col-md-4 mt-2">
                            <label className="control-label">Activation Time</label>
                            <input
                              type="text"
                              className="form-control"
                              value={formatDate(new Date(user.verifiedAt))}
                              disabled
                            />
                          </div>
                          : null
                        }
                        <div className="form-group col-md-4 mt-2">
                          <label className="control-label">Select User Status</label>
                          <Select
                            value={selectedUserStatus}
                            onChange={handleUserStatusChange}
                            options={userTypeStatus}
                            styles={colourStyles}
                          />
                        </div>
                        {deposits && deposits.length ?
                          <div className="form-group col-md-4 mt-2">
                            <label className="control-label">
                              First Crypto Deposit Time
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={formatDate(new Date(deposits[0]?.createdAt))}
                              disabled
                            />
                          </div>
                          : null
                        }
                        {deposits && deposits.length ?
                          <div className="form-group col-md-4 mt-2">
                            <label className="control-label">
                              Last Crypto Deposit Time
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={formatDate(new Date(deposits[deposits.length - 1]?.createdAt))}
                              disabled
                            />
                          </div>
                          : null
                        }
                        {withdraws && withdraws.length ?
                          <div className="form-group col-md-4 mt-2">
                            <label className="control-label">
                              First Crypto Withdraw Time
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={formatDate(new Date(withdraws[0]?.createdAt))}
                              disabled
                            />
                          </div>
                          : null
                        }
                        {withdraws && withdraws.length ?
                          <div className="form-group col-md-4 mt-2">
                            <label className="control-label">
                              Last Crypto Withdraw Time
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={formatDate(new Date(withdraws[withdraws.length - 1]?.createdAt))}
                              disabled
                            />
                          </div>
                          : null
                        }
                        {internalTransactions && internalTransactions.length ?
                          <div className="form-group col-md-4 mt-2">
                            <label className="control-label">First Trading Time</label>
                            <input
                              type="text"
                              className="form-control"
                              value={formatDate(new Date(internalTransactions[0]?.createdAt))}
                              disabled
                            />
                          </div>
                          : null
                        }
                        {internalTransactions && internalTransactions.length ?
                          <div className="form-group col-md-4 mt-2">
                            <label className="control-label">Last Trading Time</label>
                            <input
                              type="text"
                              className="form-control"
                              value={formatDate(new Date(internalTransactions[internalTransactions.length - 1]?.createdAt))}
                              disabled
                            />
                          </div>
                          : null
                        }
                      </div>
                      <div className="form-group col-md-12 pt-2">
                        <label className="control-label">Additional Info</label>
                        <textarea placeholder="Enter additional info if any..." className="form-control" name="additionalInfo" value={additionalInfo} rows="3" onChange={(event) => setAdditionalInfo(event.target.value)}></textarea>
                      </div>
                      <div>
                        <button className="btn btn-default" type="submit">Save</button>
                      </div>
                      <br />
                    </form>
                    {/* new html */}
                    <div className="comments-wrapper">
                      <div className="comments-content">
                        <h3>COMMENTS</h3>
                      </div>
                      <div className="form-group col-md-12 pt-2 mb-4">
                        <label className="control-label">Add new comment</label>
                        <textarea rows="10" placeholder="Type your comment...." className="form-control" name="adminComment" value={adminComment} onChange={(event) => setAdminComment(event.target.value)}></textarea>
                        {adminCommentErr ? (<span className="errMsg">{adminCommentErr}</span>) : ("")}
                      </div>
                      <div className="add-comment d-flex justify-content-end">
                        <button onClick={handleCommentSubmit} className="btn btn-default">Add Comment</button>
                      </div>
                      {adminComments?.length > 0 ?
                        <>
                          <div className="form-check form-group mb-lg-5 mb-4">
                            <input className="form-check-input me-3" type="checkbox" checked={isCheckAllComments} onChange={(e) => handleSelectAllComments(e)} />
                            <label className="control-label" htmlFor="flexCheckDefault">
                              Select all comments
                            </label>
                          </div>
                          <div className="form-border-wrapper">
                            {adminComments?.map(comment =>
                              <div key={`comment-${comment?._id}`} className="form-check form-group input-wrapper input-border d-flex mb-3">
                                <div className="checkboxes me-3">
                                  <input className="form-check-input" type="checkbox" value={comment?._id} checked={isCheckComment?.includes(comment?._id) || false} onChange={(e) => handleCommentClick(e)} />
                                  <FontAwesomeIcon icon={faTrash} className="del-icon" onClick={(e) => handleDelSingleComment(e, comment?._id)} />
                                </div>
                                <div className="info-content">
                                  <h5 className="mb-1"> {`${formatDate(new Date(comment?.createdAt))}, ${comment?.author?.firstName} ${comment?.author?.lastName}`} </h5>
                                  <label className="control-label ps-1">{comment?.text}</label>
                                </div>
                              </div>
                            )
                            }
                          </div>
                          {isCheckCommentErr ? (<span className="errMsg">{isCheckCommentErr}</span>) : ("")}
                          <div className="delete-comment d-flex justify-content-end">
                            <button onClick={handleDelMultiComments}>Delete selected comments</button>
                          </div>
                        </>
                        : null}
                    </div>
                    {/* END */}
                    <br />


                  </div>

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

export default AffiliateDetails;