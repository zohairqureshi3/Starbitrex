import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { showAllUsers, deleteUser, editUser, referralsPerId, userDirectLogin, deleteUsers, editUsers, showRetenAgents, showAgents, getCountries } from '../../redux/users/userActions';
import { getSalesStatuses } from '../../redux/salesStatus/salesStatusActions';
import { getRole } from '../../redux/roles/roleActions';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getPermission } from "../../config/helpers";
import FullPageTransparentLoader from "../FullPageTransparentLoader/fullPageTransparentLoader";
import DataTable, { createTheme } from 'react-data-table-component';
import FilterComponent from '../../components/FilterComponent';
import { Form } from 'react-bootstrap';
import ReactTooltip from 'react-tooltip';
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClone } from "@fortawesome/free-solid-svg-icons";
import { BsTrashFill } from 'react-icons/bs';
import { toast } from 'react-toastify';
import Select from 'react-select';
import * as Flags from "react-flags-select";

const currencyFormatter = require('currency-formatter');


createTheme(
   "solarizedd",
   {
      text: {
         primary: "#fff",
         secondary: "#fff",
      },
      background: {
         default: "#374057",
      },
      context: {
         background: "#374057",
         text: "#FFFFFF",
      },
      divider: {
         default: "#fff",
      },
      action: {
         button: "rgba(0,0,0,.54)",
         hover: "rgba(0,0,0,.08)",
         disabled: "rgba(0,0,0,.12)",
      },
   },
   "dark"
);
var userTypeStatus = [{ label: 'New', value: 1 }, { label: 'Call Back', value: 2 }, { label: 'Follow Up', value: 3 }, { label: 'No Answer', value: 4 }, { label: 'Deposited', value: 5 }, { label: 'Not interested', value: 6 }];

const Users = () => {
   const [roleId, setRoleId] = useState('');
   const [userId, setUserId] = useState('');
   const [loader, setLoader] = useState(false);
   const [filterText, setFilterText] = useState('');
   const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

   const dispatch = useDispatch();
   const allUsersList = useSelector(state => state?.users?.users);
   const allCountries = useSelector(state => state?.users?.countries);
   const [users, setUsers] = useState([]);
   const [selectedUsersIds, setSelectedUsersIds] = useState([]);
   const referrals = useSelector(state => state);

   const roleData = useSelector(state => state?.role.role);
   const permissions = roleData[0]?.permissions;
   const [type, setType] = useState("0");
   const [all, setAll] = useState("");
   const permissionName = getPermission(permissions);
   const [show, setShow] = useState(true);
   const success = useSelector(state => state.users.success);
   const userDeleted = useSelector(state => state?.users?.userDeleted);
   const userEditted = useSelector(state => state?.users?.userEditted);
   const retenAgents = useSelector(state => state.users?.retenAgents);
   const agentUsersData = useSelector(state => state.users?.allAgents);
   const [selectedUserStatus, setSelectedUserStatus] = useState({ label: 'New', value: 1 });
   const [agentUsers, setAgentUsers] = useState([]);
   const [assignedTo, setAssignedTo] = useState(null);
   const salesStatuses = useSelector(state => state?.salesStatus?.salesStatuses);

   const [filteredItems, setFilteredItems] = useState([]);

   // Search Boxes 
   const [countriesToShow, setCountriesToShow] = useState([]);
   const [isCheckAllCountries, setIsCheckAllCountries] = useState(false);
   const [isCheckCountry, setIsCheckCountry] = useState([]);
   const [countryDropdownShow, setCountryDropdownShow] = useState(false);
   const [countryInput, setCountryInput] = useState('');
   const [statusesToShow, setStatusesToShow] = useState([]);
   // const [statusesToShow, setStatusesToShow] = useState(userTypeStatus);
   const [isCheckAllStatuses, setIsCheckAllStatuses] = useState(false);
   const [isCheckStatus, setIsCheckStatus] = useState([]);
   const [statusDropdownShow, setStatusDropdownShow] = useState(false);
   const [statusInput, setStatusInput] = useState('');
   const [assignToShow, setAssignToShow] = useState([]);
   const [isCheckAllAssignTo, setIsCheckAllAssignTo] = useState(false);
   const [isCheckAssignTo, setIsCheckAssignTo] = useState([]);
   const [assignToDropdownShow, setAssignToDropdownShow] = useState(false);
   const [assignToInput, setAssignToInput] = useState('');

   const handleCountryDropdownShow = () => {
      setCountryDropdownShow(!countryDropdownShow);
      setStatusDropdownShow(false);
      setAssignToDropdownShow(false);
   };

   const handleStatusDropdownShow = () => {
      setStatusDropdownShow(!statusDropdownShow);
      setCountryDropdownShow(false);
      setAssignToDropdownShow(false);
   };

   const handleAssignToDropdownShow = () => {
      setAssignToDropdownShow(!assignToDropdownShow);
      setStatusDropdownShow(false);
      setCountryDropdownShow(false);
   };

   const myCountryHandler = async (e) => {
      setCountryInput(e.target.value);
      const countryItems = await allCountries?.filter(
         (item, index) =>
            item?.nicename && item?.nicename.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setCountriesToShow(countryItems);
   }

   // const myStatustHandler = async (e) => {
   //    setStatusInput(e.target.value);
   //    const statusItems = await userTypeStatus?.filter(
   //       (item, index) =>
   //          item?.label && item?.label.toLowerCase().includes(e.target.value.toLowerCase())
   //    );
   //    setStatusesToShow(statusItems);
   // }

   const myStatustHandler = async (e) => {
      setStatusInput(e.target.value);
      const statusItems = await salesStatuses?.filter(
         (item, index) =>
            item?.name && item?.name.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setStatusesToShow(statusItems);
   }

   const assignToHandler = async (e) => {
      const val = e.target.value;
      setAssignToInput(val);
      let agents;
      if(roleData?.length > 0)
      {
         if(roleData[0]?.name === 'Admin')
         {
            agents = agentUsersData;
         }
         else
         {
            agents = retenAgents;
         }
      }
      const assignToItems = await agents?.filter(
         (item, index) =>
            item?.firstName?.toLowerCase().includes(val.toLowerCase()) ||
            item?.lastName?.toLowerCase().includes(val.toLowerCase())
      );
      setAssignToShow(assignToItems);
   }

   useEffect(() => {
      if (allCountries?.length > 0) {
         setCountriesToShow(allCountries);
      }
   }, [allCountries])

   useEffect(() => {
      if (salesStatuses?.length > 0) {
         setStatusesToShow(salesStatuses);
      }
   }, [salesStatuses])

   const timePassed = (date) => {
      let status = '';
      if (date) {
         let first = new Date(date);
         let end = new Date(Date.now());
         let elapsed = (end - first);
         let CalcElapsed = elapsed / 1000;
         if (CalcElapsed > 0 && CalcElapsed < 50) {
            status = "Online";
         } else {
            status = "Offline";
         }
         return status;
      }
      return status;
   }

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

   const titleCase = (string) => {
      return string[0].toUpperCase() + string.slice(1).toLowerCase();
   }

   const handleGlobalFilter = () => {
      const filteredItemsResult = users?.filter(
         (item, index) =>
            item.users.firstName && item.users.firstName.toLowerCase().includes(filterText.toLowerCase()) ||
            item?.users?.phone && item?.users?.phone.toLowerCase().includes(filterText.toLowerCase()) ||
            item.users.email && item.users.email.toLowerCase().includes(filterText.toLowerCase()) ||
            item.userType && item.userType.toLowerCase().includes(filterText.toLowerCase()) ||
            item?.users?.country?.[0]?.nicename && item?.users?.country?.[0]?.nicename.toLowerCase().includes(filterText.toLowerCase()) ||
            item?.users?.account?.previousTotalAmount && currencyFormatter.format(item?.users?.account?.previousTotalAmount, { code: 'USD' }).toLowerCase().includes(filterText.toLowerCase()) ||
            item?.users?.createdAt && formatDate(new Date(item?.users?.createdAt)).toLowerCase().includes(filterText.toLowerCase()) ||
            item?.users?.lastLoginAt && formatDate(new Date(item?.users?.lastLoginAt))?.toLowerCase().includes(filterText.toLowerCase()) ||
            // item?.users?.clientStatus && userTypeStatus?.find(stat => stat.value == item?.users?.clientStatus)?.label?.toLowerCase().includes(filterText.toLowerCase()) ||
            // !item?.users?.clientStatus && userTypeStatus?.[0]?.label?.toLowerCase().includes(filterText.toLowerCase()) ||
            item?.users?.salesStatusId && salesStatuses?.find(stat => stat._id == item?.users?.salesStatusId)?.name?.toLowerCase().includes(filterText.toLowerCase()) ||
            !item?.users?.salesStatusId && 'Select Status'.toLowerCase().includes(filterText.toLowerCase()) ||
            item?.users?.assignedToAgent?.[0] && item?.users?.assignedToAgent?.[0]?.firstName?.toLowerCase().includes(filterText.toLowerCase()) ||
            item?.users?.assignedToAgent?.[0] && item?.users?.assignedToAgent?.[0]?.lastName?.toLowerCase().includes(filterText.toLowerCase())
      );
      setFilteredItems([...filteredItemsResult]);
   }

   const handleMultiSelectFilter = () => {
      const filteredItemsResult = users?.filter(
         (item, index) => {
            const isCheckCountryLength = isCheckCountry?.length;
            const isCheckStatusLength = isCheckStatus?.length;
            const isCheckAssignToLength = isCheckAssignTo?.length;
            const isCountryInclude = isCheckCountry?.includes(item?.users?.country?.[0]?._id);
            const isStatusInclude = isCheckStatus?.includes(item?.users?.salesStatusId);
            const isAssignToInclude = isCheckAssignTo?.includes(item?.users?.assignedToAgent?.[0]?._id);

            if (isCheckCountryLength > 0 && isCheckStatusLength > 0 && isCheckAssignToLength > 0) {
               return isCountryInclude && isStatusInclude && isAssignToInclude;
            }
            else if (isCheckCountryLength > 0 && isCheckStatusLength > 0 && isCheckAssignToLength < 1) {
               return isCountryInclude && isStatusInclude
            }
            else if (isCheckCountryLength > 0 && isCheckStatusLength < 1 && isCheckAssignToLength > 0) {
               return isCountryInclude && isAssignToInclude
            }
            else if (isCheckCountryLength < 1 && isCheckStatusLength > 0 && isCheckAssignToLength > 0) {
               return isStatusInclude && isAssignToInclude
            }
            else if (isCheckCountryLength > 0 && isCheckStatusLength < 1 && isCheckAssignToLength < 1) {
               return isCountryInclude
            }
            else if (isCheckCountryLength < 1 && isCheckStatusLength > 0 && isCheckAssignToLength < 1) {
               return isStatusInclude
            }
            else if (isCheckCountryLength < 1 && isCheckStatusLength < 1 && isCheckAssignToLength > 0) {
               return isAssignToInclude
            }
            else {
               return true
            }
         }

      );
      setFilteredItems([...filteredItemsResult]);
   }

   useEffect(() => {
      handleGlobalFilter();
   }, [filterText])

   useEffect(() => {
      handleMultiSelectFilter();
   }, [isCheckCountry, isCheckStatus, isCheckAssignTo])

   const handleSelectAllCountries = (e, allChecked) => {
      setIsCheckAllCountries(allChecked);
      setIsCheckCountry(allCountries?.map(li => li._id));
      if (!allChecked) {
         setIsCheckCountry([]);
      }
   };

   const handleCountryClick = e => {
      const { value, checked } = e.target;
      setIsCheckCountry([...isCheckCountry, value]);
      if (!checked) {
         setIsCheckCountry(isCheckCountry.filter(item => item !== value));
      }
   };

   const handleSelectAllStatuses = (e, allChecked) => {
      setIsCheckAllStatuses(allChecked);
      setIsCheckStatus(salesStatuses?.map(li => li._id));
      if (!allChecked) {
         setIsCheckStatus([]);
      }
   };

   const handleStatusClick = e => {
      const { value, checked } = e.target;
      setIsCheckStatus([...isCheckStatus, value]);
      if (!checked) {
         setIsCheckStatus(isCheckStatus.filter(item => item != value));
      }
   };

   const handleSelectAllAssignTo = (e, allChecked) => {
      setIsCheckAllAssignTo(allChecked);
      let agents;
      if(roleData?.length > 0)
      {
         if(roleData[0]?.name === 'Admin')
         {
            agents = agentUsersData;
         }
         else
         {
            agents = retenAgents;
         }
      }
      setIsCheckAssignTo(agents?.map(li => li._id));
      if (!allChecked) {
         setIsCheckAssignTo([]);
      }
   };

   const handleAssignToClick = e => {
      const { value, checked } = e.target;
      setIsCheckAssignTo([...isCheckAssignTo, value]);
      if (!checked) {
         setIsCheckAssignTo(isCheckAssignTo.filter(item => item !== value));
      }
   };

   useEffect(() => {
      if(roleData?.length > 0)
      {
         if(roleData[0]?.name === 'Admin')
         {
            if (agentUsersData?.length > 0) {
               let allAgents = agentUsersData?.map(agen => { return { label: agen.firstName + agen.lastName, value: agen._id } });
               setAgentUsers(allAgents);
               setAssignToShow(agentUsersData);
               setAssignedTo({ label: allAgents?.[0]?.label, value: allAgents?.[0]?.value });
            }
         }
         else
         {
            if (retenAgents?.length > 0) {
               let allAgents = retenAgents?.map(agen => { return { label: agen.firstName + agen.lastName, value: agen._id } });
               setAgentUsers(allAgents);
               setAssignToShow(retenAgents);
               setAssignedTo({ label: allAgents?.[0]?.label, value: allAgents?.[0]?.value });
            }
         }
      }
      
   }, [retenAgents, agentUsersData]);

   useEffect(() => {
      if (allUsersList?.length > 0) {
         setUsers(allUsersList);
         setFilteredItems(allUsersList);
      }
   }, [allUsersList]);

   useEffect(async () => {
      const loginData = localStorage.getItem('user');
      const data = JSON.parse(loginData);
      const id = data?.roleId;
      setRoleId(id)
      const uid = data?._id
      await setUserId(uid)
      await dispatch(getRole(id));
      await dispatch(getCountries());
      await dispatch(getSalesStatuses());
   }, [])
   
   useEffect(async () => {
      if(roleData?.length > 0)
      {
         if(roleData[0]?.name === 'Admin')
         {
            await dispatch(showAgents());
         }
         else
         {
            await dispatch(showRetenAgents());
         }
      }
   }, [roleData])

   useEffect(async () => {
      setLoader(true);
      const loginData = localStorage.getItem('user');
      const data = JSON.parse(loginData);
      const id = data?.roleId;
      const uid = data?._id;
      const clientType = 2;

      await dispatch(showAllUsers(type, id, uid, clientType));
      type == "0" ? setShow(true) : setShow(false);
      if (success) {
         setLoader(false);
      }
   }, [type, success, userDeleted, userEditted]);

   const userAction = (id, type) => {
      Swal.fire({
         title: `Are you sure you want to ${type && type == "block" ? "block" : "unblock"}?`,
         html: '',
         showCloseButton: true,
         showCancelButton: true,
         confirmButtonColor: '#3085d6',
         cancelButtonColor: '#d33',
         confirmButtonText: `${type && type == "block" ? "Block" : "Unblock"}`
      }).then((result) => {
         if (result.isConfirmed) {
            const data = { status: type && type == "block" ? false : true }
            dispatch(editUser(id, data))
         }
      })
   }

   const deleteAction = (id) => {
      Swal.fire({
         title: `Are you sure you want to Delete?`,
         html: '',
         showCloseButton: true,
         showCancelButton: true,
         confirmButtonColor: '#3085d6',
         cancelButtonColor: '#d33',
         confirmButtonText: "Yes"
      }).then((result) => {
         if (result.isConfirmed == true ? true : false) {
            dispatch(deleteUser(id))
         }
      })
   }

   const deleteUsersInBulk = () => {
      if (selectedUsersIds?.length > 0) {
         Swal.fire({
            title: `Are you sure you want to delete user(s)?`,
            html: '',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: "Yes"
         }).then(async (result) => {
            if (result.isConfirmed == true ? true : false) {
               const data = {
                  ids: selectedUsersIds
               }
               await dispatch(deleteUsers(data));
               setSelectedUsersIds([])
            }
         })
      }
      else {
         toast.error('Select atleast one user to complete this action.')
      }
   }

   const assignUsersToAgentInBulk = () => {
      if (selectedUsersIds?.length > 0) {
         Swal.fire({
            title: `Are you sure you want to assign all users to selected agent?`,
            html: '',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: "Yes"
         }).then(async (result) => {
            if (result.isConfirmed == true ? true : false) {
               // Assign users to Agents
               const data = {
                  ids: selectedUsersIds,
                  assignedTo: assignedTo.value,
               };
               await dispatch(editUsers(data));
            }
         })
      }
      else {
         toast.error('Select atleast one user to complete this action.')
      }
   }

   const changeUsersStatusInBulk = () => {
      if (selectedUsersIds?.length > 0) {
         Swal.fire({
            title: `Are you sure you want to change all users status?`,
            html: '',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: "Yes"
         }).then(async (result) => {
            if (result.isConfirmed == true ? true : false) {
               // Change Status
               const data = {
                  ids: selectedUsersIds,
                  clientStatus: selectedUserStatus.value,
               };
               await dispatch(editUsers(data));
            }
         })
      }
      else {
         toast.error('Select atleast one user to complete this action.')
      }
   }

   const moveUsersInBulk = () => {
      if (selectedUsersIds?.length > 0) {
         Swal.fire({
            title: `Are you sure you want to move user(s) to lead category?`,
            html: '',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: "Yes"
         }).then(async (result) => {
            if (result.isConfirmed == true ? true : false) {
               // Move to Leads
               const data = {
                  ids: selectedUsersIds,
                  clientType: 1,
               };
               await dispatch(editUsers(data));
               setSelectedUsersIds([])
            }
         })
      }
      else {
         toast.error('Select atleast one user to complete this action.')
      }
   }

   const loginAsUser = (user) => {
      if (user?._id) {
         const data = { email: user?.email, userByAdmin: true }
         dispatch(userDirectLogin(data))
      }
   }

   const copyReferral = () => {
      toast.success('Successfully copied!');
   }

   const handleUserSelectedChange = async ({ selectedRows }) => {
      let ids = await selectedRows.map(row => row.users?._id);
      await setSelectedUsersIds(ids);
   };

   const columns = [
      // {
      //    name: 'UID',
      //    selector: row => {
      //       return (
      //          <>
      //             <CopyToClipboard text={row?.users._id}>
      //                <span>
      //                   {row?.users._id?.slice(0, 4)}...{row?.users._id?.slice(row?.users._id.length - 4, row?.users._id.length)}
      //                   <FontAwesomeIcon icon={faClone} onClick={() => copyReferral()} className="ms-2" />
      //                </span>
      //             </CopyToClipboard>
      //          </>
      //       )
      //    }
      // },

      {
         name: 'Actions',
         width: "170px",
         cell: row => {
            return (
               <>
                  {
                     <button className="btn login-as-user-btn btn-sm me-1 p-1" onClick={() => loginAsUser(row?.users)}>Login</button>
                  }
                  <Link to={`/admin/user-detail/${row?.users?._id}`} className='btn btn-success btn-sm me-1 p-1 text-decoration-none text-light'>Edit</Link>
               </>
            );
         },
      },

      {
         name: 'Full Name',
         selector: row => {
            return `${row?.users.firstName} ${row?.users.lastName}`
         },
         cell: (row) => {
            return (
               <>
                  <span data-tip={`${row?.users.firstName} ${row?.users.lastName}`}>{row?.users.firstName} {row?.users.lastName}</span>
                  <ReactTooltip />
               </>
            );
         },
         sortable: true,

      },
      {
         name: 'Email',
         width: "300px",
         selector: row => {
            return (
               <>
                  {
                     permissionName && permissionName.length > 0 && permissionName.includes('user_email') ?
                        <CopyToClipboard text={row?.users.email}>
                           <span style={{ margin: '5px' }} data-tip={row?.users.email}>
                              <FontAwesomeIcon icon={faClone} onClick={() => copyReferral()} className="me-2" />
                              {row?.users.email}
                           </span>
                        </CopyToClipboard>
                        : null
                  }
               </>
            )
         },
         sortable: true,
      },
      {
         name: 'Phone Number',
         width: "200px",
         selector: row => {
            return (
               <>
                  {
                     permissionName && permissionName.length > 0 && permissionName.includes('user_phone') ?
                        <CopyToClipboard text={row?.users.phone}>
                           <span style={{ margin: '5px' }} data-tip={row?.users.phone}>
                              <FontAwesomeIcon icon={faClone} onClick={() => copyReferral()} className="me-2" />
                              {row?.users.phone}
                           </span>
                        </CopyToClipboard>
                        : null
                  }
               </>
            )
         },
         sortable: true,
      },
      {
         name: (
            <div>
               <div className='search1'>
                  <div className="dropdown search-custom-dropdown dropdown-check-nostyle">
                     <button onClick={handleCountryDropdownShow} className="dropbtn">Search</button>
                     <div id="myDropdown" className={`dropdown-content ${countryDropdownShow ? 'show' : ''}`}>
                        <input type="text" placeholder="Filter" value={countryInput} id="myInput" onChange={myCountryHandler} />
                        <div className="btn-group">
                           <button type="button" className="actions-btn " onClick={(e) => handleSelectAllCountries(e, true)}>Check all</button>
                           <button type="button" className="actions-btn" onClick={(e) => handleSelectAllCountries(e, false)}>Uncheck all</button>
                        </div>
                        <div className="search-options">
                           {countriesToShow?.length > 0 ? countriesToShow?.map(country =>
                              <>
                                 <input className="styled-checkbox" id={`styled-checkbox-${country?._id}`} type="checkbox" value={country?._id} checked={isCheckCountry?.includes(country?._id) || false} onChange={(e) => handleCountryClick(e)} />
                                 <label htmlFor={`styled-checkbox-${country?._id}`}>{country?.nicename}</label>
                              </>
                           ) : null}
                        </div>
                     </div>
                  </div>
               </div >
               Country
            </div >
         ),
         selector: row => {
            if (row?.users?.countryCode && row?.users?.country?.[0]?.nicename) {
               const flagTitleCase = titleCase(row?.users?.countryCode);
               const UserCountryFlag = Flags[flagTitleCase];

               return (
                  <>
                     <span style={{ fontSize: 18 }} className="me-1"><UserCountryFlag /></span>
                     {' '}{' '}
                     <span data-tip={row?.users?.country?.[0]?.nicename}>{row?.users?.country?.[0]?.nicename}</span>
                     <ReactTooltip />
                  </>
               )
            }
            else {
               return '-'
            }
         }
      },
      {
         name: (
            <div>
               <div className='search2'>
                  <div className="dropdown search-custom-dropdown dropdown-check-nostyle">
                     <button onClick={handleStatusDropdownShow} className="dropbtn">Search</button>
                     <div id="myDropdown1" className={`dropdown-content ${statusDropdownShow ? 'show' : ''}`}>
                        <input type="text" placeholder="Filter" value={statusInput} id="myInput" onChange={myStatustHandler} />
                        <div className="btn-group">
                           <button type="button" className="actions-btn " onClick={(e) => handleSelectAllStatuses(e, true)}>Check all</button>
                           <button type="button" className="actions-btn" onClick={(e) => handleSelectAllStatuses(e, false)}>Uncheck all</button>
                        </div>
                        <div className="search-options">
                           {statusesToShow?.length > 0 ? statusesToShow?.map(status =>
                              <>
                                 <input className="styled-checkbox" id={`styled-checkbox-${status?._id}`} type="checkbox" value={status?._id} checked={isCheckStatus?.includes(status?._id) || false} onChange={(e) => handleStatusClick(e)} />
                                 <label htmlFor={`styled-checkbox-${status?._id}`} style={{ color: status?.color }}>{status?.name}</label>
                              </>
                           ) : null}
                        </div>
                     </div>
                  </div>
               </div>
               Status
            </div>
         ),
         minWidth: '190px',
         selector: row => row?.users?.salesStatusId ? row?.users?.salesStatusId : "",
         cell: (row) => {
            let currSalesStatusType = { _id: "", name: "Select Status", color: "#fff" };
            if (row?.users?.salesStatusId) {
               currSalesStatusType = salesStatuses.find(stat => stat._id == row?.users?.salesStatusId);
            }
            return (
               <select className="form-control user-status-select leads-status-select" name="type" value={currSalesStatusType?._id} onChange={(e) => handleStatusChange2(row?.users._id, e)} style={{ color: currSalesStatusType?.color ? currSalesStatusType?.color : "#fff" }}>
                  <option value="" style={{ color: "#fff" }} color="#fff">Select Status</option>
                  {salesStatuses?.length > 0 && salesStatuses?.map(currentStatus => {
                     return <option value={currentStatus?._id} key={currentStatus?._id} style={{ color: currentStatus?.color }} color={currentStatus?.color}> {currentStatus?.name}</option>
                  })}
               </select>
            );
         },
         // selector: row => {
         //    if (row?.users?.clientStatus)
         //       return `${userTypeStatus?.find(stat => stat.value == row?.users?.clientStatus)?.label}`
         //    else
         //       return userTypeStatus?.[0]?.label
         // },
         // cell: (row) => {
         //    let currStatus = userTypeStatus?.[0];
         //    if (row?.users?.clientStatus) {
         //       currStatus = userTypeStatus.find(stat => stat.value == row?.users?.clientStatus);
         //    }
         //    return (
         //       <>
         //          <Select
         //             value={currStatus}
         //             onChange={(selectedUserTypeStatus) => handleStatusChange(row?.users._id, selectedUserTypeStatus)}
         //             options={userTypeStatus}
         //             styles={colourStyles}
         //          />
         //       </>
         //    );
         // }
      },
      {
         name: "Balance",
         selector: (row) => row?.users?.account?.previousTotalAmount,
         cell: (row) => {
            return (
               <>
                  <span>{currencyFormatter.format(row?.users?.account?.previousTotalAmount, { code: 'USD' })}</span>
               </>
            );
         },
         sortable: true,
      },
      {
         name: (
            <div>
               <div className='search3'>
                  <div className="dropdown search-custom-dropdown dropdown-check-nostyle">
                     <button onClick={handleAssignToDropdownShow} className="dropbtn">Search</button>
                     <div id="myDropdown2" className={`dropdown-content ${assignToDropdownShow ? 'show' : ''}`}>
                        <input type="text" placeholder="Filter" value={assignToInput} id="myInput" onChange={assignToHandler} />
                        <div className="btn-group">
                           <button type="button" className="actions-btn " onClick={(e) => handleSelectAllAssignTo(e, true)}>Check all</button>
                           <button type="button" className="actions-btn" onClick={(e) => handleSelectAllAssignTo(e, false)}>Uncheck all</button>
                        </div>
                        <div className="search-options">
                           {assignToShow?.length > 0 ? assignToShow?.map(assignItem =>
                              <>
                                 <input className="styled-checkbox" id={`styled-checkbox-${assignItem?._id}`} type="checkbox" value={assignItem?._id} checked={isCheckAssignTo?.includes(assignItem?._id) || false} onChange={(e) => handleAssignToClick(e)} />
                                 <label htmlFor={`styled-checkbox-${assignItem?._id}`}>{`${assignItem?.firstName} ${assignItem?.lastName}`}</label>
                              </>
                           ) : null}
                        </div>
                     </div>
                  </div>
               </div>
               Assigned To
            </div>
         ),
         selector: row => {
            if (row?.users?.assignedToAgent)
               return `${row?.users?.assignedToAgent?.[0]?.firstName} ${row?.users?.assignedToAgent?.[0]?.lastName}`
            else
               return '-'
         },
         cell: (row) => {
            let assignedToAgent = row?.users?.assignedToAgent?.[0] ? row?.users?.assignedToAgent?.[0] : '';
            return (
               <>
                  {assignedToAgent ?
                     <>
                        <span data-tip={`${assignedToAgent?.firstName} ${assignedToAgent?.lastName}`}>{assignedToAgent?.firstName} {assignedToAgent?.lastName}</span>
                        <ReactTooltip />
                     </> : '-'}
               </>
            );
         },
         omit: !permissionName || permissionName.length < 1 || !permissionName.includes('assign_to_agent')
      },
      {
         name: 'Registration Date',
         selector: row => {
            return (
               <>
                  <span data-tip={formatDate(new Date(row?.users.createdAt))}>{formatDate(new Date(row?.users.createdAt))}</span>
                  <ReactTooltip />
               </>
            )
         },
         sortable: true,
      },
      {
         name: 'Last Login Date',
         selector: row => {
            return (
               <>
                  <span data-tip={row?.users?.lastLoginAt ? formatDate(new Date(row?.users.lastLoginAt)) : '-'}>{row?.users?.lastLoginAt ? formatDate(new Date(row?.users.lastLoginAt)) : '-'}</span>
                  <ReactTooltip />
               </>
            )
         },
         sortable: true,
      },
      {
         name: 'Online',
         selector: row => {
            return (
               <>
                  <span data-tip={(timePassed(row?.users?.lastLoginAt) && row?.users?.isLogin === true) ? timePassed(row?.users?.lastLoginAt) : 'Offline'}>{(timePassed(row?.users?.lastLoginAt) && row?.users?.isLogin === true) ? <span className={timePassed(row?.users?.lastLoginAt)?.toLocaleLowerCase()}>{timePassed(row?.users?.lastLoginAt)}</span> : <span className='offline'>Offline</span>}</span>
                  <ReactTooltip />
               </>
            )
         },
         sortable: true,
      },
      {
         name: 'Delete User',
         width: "120px",
         cell: row => {
            return (
               <>

                  {
                     permissionName && permissionName.length > 0 && permissionName.includes('delete_user') ?
                        <button className="btn btn-danger btn-sm me-1 p-1" onClick={() => deleteAction(row?.users?._id)}><BsTrashFill color="white" size={18} /></button>
                        :
                        null
                  }
                  {/* {row.refCount >= 0 && row.refCount < 2 ?
                     <button className="btn btn-warning btn-sm me-1 p-1" onClick={() => viewReferrals(row?.users?._id, setShow(false))}>Referrals</button>
                     : null
                  } */}
                  {
                     permissionName && permissionName.length > 0 && permissionName.includes('block_user') ?
                        <>
                           {row?.users.status == true ?
                              <button className="btn btn-warning btn-sm me-1 p-1" onClick={() => userAction(row?.users?._id, "block")}>Block</button>
                              : <button className="btn btn-warning btn-sm me-1 p-1" onClick={() => userAction(row?.users?._id, "unBlock")}>Unblock</button>
                           }
                        </>
                        : null}
               </>
            );
         },
      },
   ];


   const handleAssignedToChange = (selectedAssignedTo) => {
      setAssignedTo(selectedAssignedTo);
   };

   // const handleStatusChange = (_id, selectedUserTypeStatus) => {
   //    if (_id) {
   //       let newUsers = [...users];
   //       let objIndex = newUsers.findIndex((obj => obj?.users?._id == _id));
   //       newUsers[objIndex].users.clientStatus = selectedUserTypeStatus.value;
   //       setUsers([...newUsers]);
   //       const data = { clientStatus: selectedUserTypeStatus.value };
   //       dispatch(editUser(_id, data, false));
   //    }
   // };

   const handleStatusChange2 = (_id, e) => {
      if (_id) {
         let newUsers = [...users];
         let objIndex = newUsers.findIndex((obj => obj?.users?._id == _id));
         newUsers[objIndex].users.salesStatusId = e.target.value;
         setUsers([...newUsers]);
         const data = { salesStatusId: e.target.value ? e.target.value : null };
         dispatch(editUser(_id, data, false));
      }
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
         border: '1px solid #000000',
         borderRadius: '4px',
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

   const handleClear = () => {
      if (filterText) {
         setResetPaginationToggle(!resetPaginationToggle);
         setFilterText('');
      }
   };

   const subHeaderComponentMemo = useMemo(() => {
      const handleClear = () => {
         if (filterText) {
            setResetPaginationToggle(!resetPaginationToggle);
            setFilterText('');
         }
      };

      return (
         <div className='d-flex w-100 justify-content-between mt-5 mb-4'>
            <div className="btn-group btn-group-toggle" data-toggle="buttons">
               <button className="btn btn-secondary btn-sm me-1 p-1" style={{ position: 'relative'}} onClick={() => moveUsersInBulk()}>Move to Leads</button>
               <button className="btn btn-danger btn-sm me-1 p-1" style={{ position: 'relative'}} onClick={() => deleteUsersInBulk()}><BsTrashFill color="white" size={20} /></button>
            </div>
            {/* <FilterComponent onFilter={e => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} /> */}
         </div>
      );
   }, [filterText, resetPaginationToggle, selectedUsersIds]);

   const viewReferrals = (id) => {
      if (id) {
         let data = { id }
         dispatch(referralsPerId(data));
      }
   }

   const handleParentDivClick = (e) => {
      const parentHasClass = e?.target?.closest('.dropdown-check-nostyle') !== null;
      if (!parentHasClass) {
         setCountryDropdownShow(false);
         setStatusDropdownShow(false);
         setAssignToDropdownShow(false);
         setCountryInput('');
         setCountriesToShow(allCountries);
         setStatusInput('');
         setStatusesToShow(salesStatuses);
         // setStatusesToShow(userTypeStatus);
         setAssignToInput('');
         if(roleData?.length > 0)
         {
            if(roleData[0]?.name === 'Admin')
            {
               setAssignToShow(agentUsersData);
            }
            else
            {
               setAssignToShow(retenAgents);
            }
         }
      }
   }

   return (
      <>
         {loader ? <FullPageTransparentLoader /> :
            <>
               <div className="content-wrapper right-content-wrapper" onClick={(e) => handleParentDivClick(e)}>
                  <div className="content-box">
                     <h3>Users Details</h3>
                     {
                        show && permissionName && permissionName.length > 0 && permissionName.includes('add_user') ?
                           <Link to='/admin/add-user'><button className="btn btn-default">Add User</button></Link>
                           :
                           null
                     }
                     <br /> <br />
                     <div>

                        <div className="form-group col-md-12 mb-3">
                           <label className="control-label">Global Search</label>
                           <FilterComponent onFilter={e => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} />
                        </div>
                     </div>
                     <div className='d-inline-flex w-100'>
                        {
                           show && permissionName && permissionName.length > 0 && permissionName.includes('assign_to_agent') ?
                              <div className='listing-dropdown-wrapper d-inline-flex pt-3'>
                                 <div className="form-group col-lg-3 col-md-6 col-12" style={{ position: 'relative', zIndex: '10' }}>
                                    <Select
                                       value={assignedTo}
                                       onChange={handleAssignedToChange}
                                       options={agentUsers}
                                       styles={colourStyles}
                                    />
                                 </div>
                                 <button className="btn btn-default" onClick={() => assignUsersToAgentInBulk()}>Assign to Sales Agent</button>
                              </div>
                              : null
                        }
                        {/* {
                           show && permissionName && permissionName.length > 0 && permissionName.includes('assign_to_agent') ?
                              <div className='listing-dropdown-wrapper d-inline-flex pt-3'>
                                 <div className="form-group col-lg-3 col-md-6 col-12" style={{ position: 'relative', zIndex: '10' }}>
                                    <Select
                                       value={selectedUserStatus}
                                       onChange={handleStatusChange}
                                       options={userTypeStatus}
                                       styles={colourStyles}
                                    />
                                 </div>
                                 <button className="btn btn-default" onClick={() => changeUsersStatusInBulk()}>Change Status</button>
                              </div>
                              : null
                        } */}
                     </div>
                     <DataTable
                        rows={users?._id}
                        columns={columns}
                        data={filteredItems}
                        pagination
                        highlightOnHover
                        paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
                        paginationRowsPerPageOptions={[10, 50, 100, 500]}
                        subHeader
                        subHeaderComponent={subHeaderComponentMemo}
                        persistTableHead
                        selectableRows
                        onSelectedRowsChange={handleUserSelectedChange}
                        selectableRowSelected={users?._id}
                        selectableRowsHighlight
                        theme="solarizedd"
                        className='specific-field-table custome-table-scroll'
                     />
                  </div>
               </div>
            </>
         }
      </>
   )
}

export default Users