import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Select from 'react-select';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { getPermission } from "../../../config/helpers";
import { useForm } from "react-hook-form";
import { getRole } from '../../../redux/roles/roleActions';
import { editUser } from "../../../redux/users/userActions";
import { getAdminComments, addAdminComment, deleteAdminComment, deleteAdminComments } from '../../../redux/adminComment/adminCommentActions';
import { getSalesStatuses } from '../../../redux/salesStatus/salesStatusActions';
import Swal from 'sweetalert2';
// import { displayUnreadNotifications } from '../../../redux/notifications/notificationActions';
import { listUnreadNotification } from "../../../redux/apiHelper";


var userTypeOptions = [{ label: 'Lead', value: 1 }, { label: 'Client', value: 2 }, { label: 'Affiliate', value: 3 }];
var userTypeStatus = [{ label: 'New', value: 1 }, { label: 'Call Back', value: 2 }, { label: 'Follow Up', value: 3 }, { label: 'No Answer', value: 4 }, { label: 'Deposited', value: 5 }, { label: 'Not interested', value: 6 }];




const EditUser = () => {
    const [user, setUser] = useState("");
    const [loader, setLoader] = useState(false);
    let { id } = useParams();


    const dispatch = useDispatch();
    const userData = useSelector((state) => state?.users?.user);
    const [selectedFlagCountry, setSelectedFlagCountry] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [selectedUserType, setSelectedUserType] = useState({ label: 'Lead', value: 1 });
    const [selectedUserStatus, setSelectedUserStatus] = useState({ label: 'New', value: 1 });
    const internalTransactions = useSelector((state) => state.users?.user?.internalTransaction);
    const deposits = useSelector((state) => state.users?.user?.externalTransactions?.filter(row => row.transactionType != true));
    const withdraws = useSelector((state) => state.users?.user?.externalTransactions?.filter(row => row.transactionType == true));
    const [additionalInfo, setAdditionalInfo] = useState("");


    const salesStatuses = useSelector(state => state?.salesStatus?.salesStatuses);
    const [salesStatusType, setSalesStatusType] = useState({ value: "", color: "#fff" });
    const [agentUsers, setAgentUsers] = useState([]);
    const [assignedTo, setAssignedTo] = useState(null);

    const adminComments = useSelector((state) => state?.adminComment?.adminComments);
    const adminCommentsFetched = useSelector((state) => state?.adminComment?.fetched);
    const [adminComment, setAdminComment] = useState("");
    const [adminCommentErr, setAdminCommentErr] = useState("");
    const [isCheckAllComments, setIsCheckAllComments] = useState(false);
    const [isCheckComment, setIsCheckComment] = useState([]);
    const [isCheckCommentErr, setIsCheckCommentErr] = useState("");
    const [commentLoader, setCommentLoader] = useState(false);


    const roleData = useSelector(state => state?.role.role);
    const permissions = roleData[0]?.permissions;
    const permissionName = getPermission(permissions);

    const { register, handleSubmit, control, reset, formState: { errors } } = useForm();




    const padTo2Digits = (num) => {
        return num.toString().padStart(2, '0');
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
            // clientStatus: selectedUserStatus.value,
            assignedTo: assignedTo.value,
            salesStatusId: salesStatusType?.value ? salesStatusType?.value : null
        };
        await dispatch(editUser(id, data));
        // await dispatch(displayUnreadNotifications())
        await listUnreadNotification();
    };

    const handleUserTypeChange = (selectedCurrUserType) => {
        setSelectedUserType(selectedCurrUserType);
    }

    const handleUserStatusChange = (selectedUserStatus) => {
        setSelectedUserStatus(selectedUserStatus);
    };

    const handleUserStatusChange2 = (e) => {
        setSalesStatusType({ value: e.target.value, color: e.target[e.target.selectedIndex].getAttribute('color') })
    };

    const handleAssignedToChange = (selectedAssignedTo) => {
        setAssignedTo(selectedAssignedTo);
    };

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

    useEffect(async () => {
        setCommentLoader(true);
        const loginData = localStorage.getItem('user');
        const data = JSON.parse(loginData);
        const roleId = data?.roleId;
        dispatch(getRole(roleId));

        await dispatch(getSalesStatuses());
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
            setSelectedUserType({ label: userData?.clientType === 1 ? 'Lead' : 'Client', value: userData?.clientType })
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

        if (userData?.agentUsers?.length > 0) {
            let allAgents = userData?.agentUsers?.map(agen => { return { label: agen.firstName + agen.lastName, value: agen._id } });
            setAgentUsers(allAgents);
            if (userData?.assignedTo) {
                let currAgent = allAgents.find(stat => stat?.value == userData?.assignedTo);
                if (currAgent) {
                    setAssignedTo({ label: currAgent.label, value: currAgent.value });
                } else {
                    setAssignedTo({ label: allAgents?.[0]?.label, value: allAgents?.[0]?.value });
                }
            }
            else {
                setAssignedTo({ label: allAgents?.[0]?.label, value: allAgents?.[0]?.value });
            }
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
            < div className="tab-pane fade show active" id="editUser" >
                <h5> Sales Information </h5>
                <form onSubmit={handleSubmit(handleSave)}>
                    <div className="row">
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
                                User ID
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                value={user._id}
                                disabled
                            />
                        </div>
                        <div className="form-group col-md-4 mt-2">
                            <label className="control-label">
                                Affiliate Channel
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                value={user?.affiliator?.[0] ? `${user?.affiliator?.[0]?.firstName} ${user?.affiliator?.[0]?.lastName}` : '-'}
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
                        {/* <div className="form-group col-md-4 mt-2">
                          <label className="control-label">Select User Status</label>
                          <Select
                            value={selectedUserStatus}
                            onChange={handleUserStatusChange}
                            options={userTypeStatus}
                            styles={colourStyles}
                          />
                        </div> */}
                        <div className="form-group col-md-4 mt-2">
                            <label className="control-label">Select User Status</label>
                            <select className="form-control user-status-select" name="type" value={salesStatusType?.value} onChange={handleUserStatusChange2} style={{ color: salesStatusType?.color ? salesStatusType?.color : "#fff" }}>
                                <option value="" style={{ color: "#fff" }} color="#fff">Select Status</option>
                                {salesStatuses?.length > 0 && salesStatuses?.map(currentStatus => {
                                    return <option value={currentStatus?._id} key={currentStatus?._id} style={{ color: currentStatus?.color }} color={currentStatus?.color}> {currentStatus?.name}</option>
                                })}
                            </select>
                        </div>
                        {
                            permissionName && permissionName.length > 0 && permissionName.includes('assign_to_agent') ?
                                <div className="form-group col-md-4 mt-2">
                                    {!user?.clientType || user?.clientType == 1 ? <label className="control-label">Assign To Sales Agent</label> : <label className="control-label">Assign To Retentions Agent</label>}
                                    <Select
                                        value={assignedTo}
                                        onChange={handleAssignedToChange}
                                        options={agentUsers}
                                        styles={colourStyles}
                                    />
                                </div>
                                :
                                null
                        }

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
                                        {
                                            permissionName && permissionName.length > 0 && permissionName.includes('delete_comment') ?
                                                <div className="checkboxes me-3">
                                                    <input className="form-check-input" type="checkbox" value={comment?._id} checked={isCheckComment?.includes(comment?._id) || false} onChange={(e) => handleCommentClick(e)} />
                                                    <FontAwesomeIcon icon={faTrash} className="del-icon" onClick={(e) => handleDelSingleComment(e, comment?._id)} />

                                                </div>
                                                : null
                                        }
                                        <div className="info-content">
                                            <h5 className="mb-1"> {`${formatDate(new Date(comment?.createdAt))}, ${comment?.author?.firstName} ${comment?.author?.lastName}`} </h5>
                                            <label className="control-label ps-1">{comment?.text}</label>
                                        </div>
                                    </div>
                                )
                                }
                            </div>
                            {isCheckCommentErr ? (<span className="errMsg">{isCheckCommentErr}</span>) : ("")}
                            {
                                permissionName && permissionName.length > 0 && permissionName.includes('delete_comment') ?
                                    <div className="delete-comment d-flex justify-content-end">
                                        <button onClick={handleDelMultiComments}>Delete selected comments</button>
                                    </div>
                                    : null
                            }
                        </>
                        : null}
                </div>
                {/* END */}
                <br />
            </div >
        </>
    );
}

export default EditUser