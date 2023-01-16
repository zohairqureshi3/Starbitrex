import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { showAllUsers, editUser, deleteUsers, showSalesAgents, deletedSalesAgents, showSalesTeamleads, showRetenAgents, showRetenTeamleads, showSubAdmins, showSupervisors, showAgents, showAgentRoles, deleteAgent } from '../../redux/users/userActions';
import { getPermission } from "../../config/helpers";
import { getRole, displayRoles } from '../../redux/roles/roleActions';
import { Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import FullPageTransparentLoader from "../FullPageTransparentLoader/fullPageTransparentLoader";
import DataTable, { createTheme } from 'react-data-table-component';
import FilterComponent from '../../components/FilterComponent';
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClone } from "@fortawesome/free-solid-svg-icons";
import { BsTrashFill } from 'react-icons/bs';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { Form } from 'react-bootstrap';
import moment from 'moment';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
//import Select from 'react-select/dist/declarations/src/Select';



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


const CRMUsers = () => {
    const [roleId, setRoleId] = useState('');
    const [userId, setUserId] = useState('');
    const [loader, setLoader] = useState(false);
    const [agent, setAgent] = useState('');
    const [user, setUser] = useState('');
    const [users, setUsers] = useState([]);
    const [selectedUsersIds, setSelectedUsersIds] = useState([]);
    const [agentRoles, setAgentRoles] = useState([]);
    const [fullname, setFullname] = useState('');
    const [searchEmail, setSearchEmail] = useState('');
    const [statusDropdownShow, setStatusDropdownShow] = useState(false);
    const [statusInput, setStatusInput] = useState('');
    const [isCheckAllStatuses, setIsCheckAllStatuses] = useState(false);
    const [isCheckStatus, setIsCheckStatus] = useState([]);
    const [statusesToShow, setStatusesToShow] = useState([]);
    const [userOnlineStatus, setUserOnlineStatus] = useState('');

    const [filterText, setFilterText] = useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const [filteredItems, setFilteredItems] = useState([]);

    const [registerDate, setRegisterDate] = useState();
    const [selectedDate, setSelectedDate] = useState();
    const [showCalendar, setShowCalendar] = useState(false);
    const visibleCalendar = () => setShowCalendar(!showCalendar);
    const [restData, setRestData] = useState(false);
    const [phone, setPhone] = useState('');
    

    const dispatch = useDispatch();

    const roles = useSelector(state => state.role?.roles?.roles);

    const agentUsers = useSelector(state => state.users?.allAgents);
    const getAgentRoles = useSelector(state => state.users?.agentRoles);

    const roleData = useSelector(state => state?.role.role);
    const permissions = roleData[0]?.permissions;
    const permissionName = getPermission(permissions);
    const [type, setType] = useState("0");
    const [show, setShow] = useState(true);
    const success = useSelector(state => state.users.success);
    const fetched = useSelector(state => state.users.fetched);
    const userDeleted = useSelector(state => state?.users?.userDeleted);
    const userEditted = useSelector(state => state?.users?.userEditted);



    useEffect(() => {
        if (agentUsers?.length > 0) {
            //setUsers(salesAgents);
            //setFilteredItems(salesAgents);
            setUsers(agentUsers);
            setFilteredItems(agentUsers);
        }
        if (getAgentRoles?.length > 0) {
            setAgentRoles(getAgentRoles);
        }
    }, [agentUsers, getAgentRoles]);


    useEffect(() => {

        const renderAgents = async () => {
            if (agent) {
                await dispatch(showAgents(agent));
            } else {
                await dispatch(showAgents());
            }
        }
        renderAgents();

    }, [agent]);



    useEffect(async () => {
        setLoader(true);
        const loginData = localStorage.getItem('user');
        const data = JSON.parse(loginData);
        const id = data?.roleId;
        const uid = data?._id;

        await dispatch(showSalesAgents(type, id, uid));
        //if (success) {
        if (fetched) {
            setLoader(false);
        }
    }, [type, success, fetched]);


    useEffect(async () => {

        await dispatch(showAgents());
        await dispatch(showAgentRoles());

    }, [])

    const copyReferral = () => {
        toast.success('Successfully copied!');
    }

    const deleteAction = async (id) => {
        Swal.fire({
            title: `Are you sure you want to Delete?`,
            html: '',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: "Yes"
        }).then(async (result) => {
            if (result.isConfirmed == true ? true : false) {
                await dispatch(deleteAgent(id))
                if (agent) {
                    await dispatch(showAgents(agent));
                } else {
                    await dispatch(showAgents());
                }
            }
        })
    }

    const userAction = async (id, type) => {
        Swal.fire({
            title: `Are you sure you want to ${type && type == "block" ? "block" : "unblock"}?`,
            html: '',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `${type && type == "block" ? "Block" : "Unblock"}`
        }).then(async (result) => {
            if (result.isConfirmed) {
                const data = { status: type && type == "block" ? false : true }
                await dispatch(editUser(id, data, false, false))

                if (agent) {
                    await dispatch(showAgents(agent));
                } else {
                    await dispatch(showAgents());
                }
            }
        })
    }


    const subHeaderComponentMemo = useMemo(() => {
        const handleClear = () => {
            if (filterText) {
                setResetPaginationToggle(!resetPaginationToggle);
                setFilterText('');
            }
        };

        return (
            <div className='d-flex w-100 justify-content-between mt-5 mb-4'>
                {/* <div className="btn-group btn-group-toggle">
                    <button className="btn btn-danger btn-sm me-1 p-1" style={{ position: 'relative', }} onClick={() => deleteUsersInBulk()}><BsTrashFill color="white" size={20} /></button>
                </div> */}
                {/* <FilterStatusComponent onFilter={e => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} /> */}
                {/* <FilterComponent onFilter={e => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} /> */}
            </div>
        );
    }, [filterText, resetPaginationToggle, selectedUsersIds]);


    const searchByName = (e) => {
        setFullname(e.target.value)
        let searchText = e.target.value;
        let searchData = users.filter(
            row => (
                row?.firstName?.toLowerCase()?.includes(searchText.toLowerCase()) ||
                row?.lastName?.toLowerCase()?.includes(searchText.toLowerCase())
            )
        )
        setFilteredItems(searchData)

    }

    const searchByEmail = (e) => {

        setSearchEmail(e.target.value)
        let searchText = e.target.value;
        let searchData = users.filter(row => (row?.email?.toLowerCase()?.includes(searchText.toLowerCase())))
        setFilteredItems(searchData)
    }

    const searchByPhone = (e) => {
        setPhone(e.target.value)
    }

    const handleStatusDropdownShow = () => {
        setStatusDropdownShow(!statusDropdownShow);
    };

    const handleSelectAllStatuses = (e, allChecked) => {
        setIsCheckAllStatuses(allChecked);
        setIsCheckStatus(agentRoles?.map(li => li._id));
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

    const myStatustHandler = async (e) => {
        setStatusInput(e.target.value);
        const statusItems = await agentRoles?.filter(
            (item, index) =>
                item?.name && item?.name.toLowerCase().includes(e.target.value.toLowerCase())
        );
        setStatusesToShow(statusItems);
    }
    
    const clearFilter = () => {

        setRestData(true)
        setFullname('')
        setSearchEmail('') 
        setStatusDropdownShow(false)
        setIsCheckStatus([]);
        
        setSelectedDate('');
        setShowCalendar(false)
        setUserOnlineStatus('');
        setPhone('');

        //setFilteredItems(users);
        setRestData(false)
    }


    useEffect(() => {
        if(restData == false) {
            console.log(isCheckStatus,selectedDate,userOnlineStatus,"aaaaaaaaaaa")
            handleSearchResults()
        }
        
    }, [isCheckStatus, selectedDate, userOnlineStatus,phone])


    const handleSearchResults = () => {
        let searchData = users.filter(
            (row, index) => {
                const isCheckStatusLength = isCheckStatus?.length;
                const registerDateLength = selectedDate?.length;
                const userOnlineStatusLength = userOnlineStatus?.length;
                const phoneLength = phone?.length;

                const isStatusInclude = isCheckStatus?.includes(row?.userRole?._id);
                let rowDate;
                if (registerDateLength) {
                    if (row?.createdAt) {
                        rowDate = moment(row?.createdAt).format('YYYY-MM-DD');
                    }
                }

                let userStatus;
                if (userOnlineStatusLength) {
                    console.log(userOnlineStatus,"userOnlineStatus")
                    if ((timePassed(row?.lastLoginAt) && row?.isLogin === true)) {
                        console.log(row?.lastLoginAt, "row?.lastLoginAt", index)
                        let status = timePassed(row?.lastLoginAt)
                        console.log(status.toLocaleLowerCase(), userOnlineStatus, "check value")
                        if (status.toLocaleLowerCase() == userOnlineStatus) {
                            userStatus = true;
                        } else {
                            userStatus = false;
                        }
                    } else {
                        let status
                        if (row?.lastLoginAt) {
                            status = timePassed(row?.lastLoginAt)
                            if (status.toLocaleLowerCase() == userOnlineStatus) {
                                userStatus = true;
                            }
                        } else if (userOnlineStatus == 'offline') {
                            userStatus = true;
                        }
                    }
                }

                let phoneStatus = false;
                if(phoneLength) {
                    console.log(phone , row?.phone, "Phone")
                    if(row?.phone)
                    {
                        if(row?.phone.indexOf(phone) != '-1') {
                            phoneStatus = true;
                        }
                        
                    }
                }

                if (isCheckStatusLength && registerDateLength && userOnlineStatusLength && phoneLength) {
                    return isStatusInclude && (selectedDate == rowDate ? true : false) && userStatus && phoneStatus;
                } else if (isCheckStatusLength && registerDateLength && phoneLength) {
                    return isStatusInclude && (selectedDate == rowDate ? true : false) && phoneStatus;
                } else if (isCheckStatusLength && userOnlineStatusLength && phoneLength) {
                    return isStatusInclude && userStatus && phoneStatus;
                } else if (registerDateLength && userOnlineStatusLength && phoneLength) {
                    return (selectedDate == rowDate ? true : false) && userStatus && phoneStatus;
                }
                else if (isCheckStatusLength && registerDateLength ) {
                    return isStatusInclude && (selectedDate == rowDate ? true : false);
                }
                else if (isCheckStatusLength && userOnlineStatusLength) {
                    return isStatusInclude && userStatus;
                } else if (registerDateLength && userOnlineStatusLength ) {
                    return (selectedDate == rowDate ? true : false) && userStatus;
                }
                
                
                else if (isCheckStatusLength && phoneLength) {
                    return isStatusInclude && phoneStatus;
                } else if (registerDateLength && phoneLength) {
                    return (selectedDate == rowDate ? true : false) && phoneStatus;
                } else if (userOnlineStatusLength && phoneLength) {
                    return userStatus && phoneStatus;
                } else if ( isCheckStatusLength) {
                    return  isStatusInclude;
                } else if ( registerDateLength) {
                    return  (selectedDate == rowDate ? true : false);
                } else if ( userOnlineStatusLength) {
                    return  userStatus;
                } else if ( phoneLength) {
                    return  phoneStatus;
                }
                
                else {
                    return true;
                }
            }
        )
        setFilteredItems(searchData)
    }

    const datePick = (e) => {
        let dt = new Date(e);
        setSelectedDate(moment(dt).format('YYYY-MM-DD'))
        setShowCalendar(!showCalendar);
    }

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
            name: (
                <div className='d-flex flex-column search-input-des'>
                    Full Name
                    <input
                        type="text"
                        placeholder="Search"
                        name="fullname"
                        value={fullname}
                        onChange={(e) => searchByName(e)}
                    //style={{ width: "80%" }}
                    />
                </div>
            ),
            selector: row => {
                return `${row?.firstName} ${row?.lastName}`
            },
            cell: (row) => {
                return (
                    <>
                        <span data-tip={`${row?.firstName} ${row?.lastName}`}>{row?.firstName} {row?.lastName}</span>
                        <ReactTooltip />
                    </>
                );
            },
            sortable: false
        },
        {
            name: (
                <div className='d-flex flex-column search-input-des'>
                    Email
                    <input
                        type="text"
                        placeholder="email@example.com"
                        name="email"
                        value={searchEmail}
                        onChange={(e) => searchByEmail(e)}
                    //style={{ width: "80%" }}
                    />
                </div>
            ),
            width: "250px",
            selector: row => {
                return (
                    <>
                        {
                            <CopyToClipboard text={row?.email}>
                                <span style={{ margin: '5px' }} data-tip={row?.email}>
                                    {row?.email}&nbsp;<FontAwesomeIcon icon={faClone} onClick={() => copyReferral()} className="ms-2 cursor-pointer" />
                                </span>
                            </CopyToClipboard>
                        }
                    </>
                )
            },
            sortable: false
        },

        {
            name: (
                <div>
                    Role
                    <div className=''>
                        <div className="dropdown search-custom-dropdown dropdown-check-nostyle crm-search-dropdown" style={{position: "unset"}}>
                            <button onClick={handleStatusDropdownShow} className="dropbtn text-start">Search</button>
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
                </div>
            ),
            selector: row => {
                return `${row?.userRole?.name}`
            },
            cell: (row) => {
                return (
                    <>
                        <span data-tip={`${row?.userRole?.name}`}>{row?.userRole?.name}</span>
                        <ReactTooltip />
                    </>
                );
            },
            sortable: false,
        },
        {
            name: (
                <div className='search2'>
                    <div className="dropdown search-custom-dropdown dropdown-check-nostyle reg-celender-des">
                        {/* <button onClick={visibleCalendar} className="dropbtn">Show</button> */}
                        <div className='d-flex flex-column search-input-des agent-celender-field' onClick={visibleCalendar}>
                            Registration Date
                            <input
                                type="text"
                                placeholder="Show Celender"
                                name="refDat"
                                value={registerDate}
                                onClick={visibleCalendar}
                            // onChange={(e) => searchByEmail(e)}
                            />
                        </div>
                        <div className={showCalendar ? 'd-block' : 'd-none'}>
                            <Calendar onChange={datePick} value={registerDate} />
                        </div>
                    </div>
                </div>
            ),
            width: "200px",
            selector: row => {
                return (
                    <>
                        {
                            <span style={{ margin: '5px' }} data-tip={row?.createdAt}>
                                {row?.createdAt}
                            </span>
                        }
                    </>
                )
            },
            sortable: false,
        },

        // {
        //     name: 'Delete User',
        //     width: "120px",
        //     cell: row => {
        //         return (
        //             <>

        //                 {
        //                     permissionName && permissionName.length > 0 && permissionName.includes('delete_user') ?
        //                         <button className="btn btn-danger btn-sm me-1 p-1" onClick={() => deleteAction(row?._id)}><BsTrashFill color="white" size={18} /></button>
        //                         :
        //                         null
        //                 }
        //                 {/* {row.refCount >= 0 && row.refCount < 2 ?
        //                <button className="btn btn-warning btn-sm me-1 p-1" onClick={() => viewReferrals(row?.users?._id, setShow(false))}>Referrals</button>
        //                : null
        //             } */}
        //                 {
        //                     permissionName && permissionName.length > 0 && permissionName.includes('block_user') ?
        //                         <>
        //                             {row?.users.status == true ?
        //                                 <button className="btn btn-warning btn-sm me-1 p-1" onClick={() => userAction(row?.users?._id, "block")}>Block</button>
        //                                 : <button className="btn btn-warning btn-sm me-1 p-1" onClick={() => userAction(row?.users?._id, "unBlock")}>Unblock</button>
        //                             }
        //                         </>
        //                         : null}
        //             </>
        //         );
        //     },
        // },

        {
            name: (
                <div className='search2' style={{position: "unset"}}>
                    <div className="form-group col-md-12 online-search-des">
                        <label className="control-label">Online</label>
                        <Form.Select className='crm-online' name="type" onChange={e => setUserOnlineStatus(e.target.value)}>
                            <option value="">Select option</option>
                            <option value="online">Online</option>
                            <option value="offline">Offline</option>
                        </Form.Select>
                    </div>
                </div>
            ),
            selector: row => {
                return (
                    <>
                        <span data-tip={(timePassed(row?.lastLoginAt) && row?.isLogin === true) ? timePassed(row?.lastLoginAt) : 'Offline'}>{(timePassed(row?.lastLoginAt) && row?.isLogin === true) ? <span className={timePassed(row?.lastLoginAt)?.toLocaleLowerCase()}>{timePassed(row?.lastLoginAt)}</span> : <span className='offline'>Offline</span>}</span>
                        <ReactTooltip />
                    </>
                )
            },
            sortable: false,
        },
        {
            name: (
                <div className='d-flex flex-column search-input-des'>
                    Phone Number
                    <input
                        type="text"
                        placeholder="Search"
                        name="phoneNumber"
                        value={phone}
                        onChange={(e) => searchByPhone(e)}
                    //style={{ width: "80%" }}
                    />
                </div>
            ),
            width: "200px",
            selector: row => {
                return (
                    <>
                        {
                            <CopyToClipboard text={row?.phone}>
                                <span style={{ margin: '5px' }} data-tip={row?.phone}>
                                    {row?.phone}&nbsp;<FontAwesomeIcon icon={faClone} onClick={() => copyReferral()} className="ms-2 cursor-pointer" />
                                </span>
                            </CopyToClipboard>
                        }
                    </>
                )
            },
            sortable: false,
        },

        {
            name: 'Actions',
            width: "170px",
            cell: row => {
                return (

                    <>
                        {/* <Link to={`/admin/user-detail/${row?._id}`} className='btn btn-success btn-sm me-1 p-1 text-decoration-none text-light'>Edit</Link> */}
                        {
                            permissionName && permissionName.length > 0 && permissionName.includes('edit_sub_admin') ?
                                <Link to={`/admin/edit-sub-admin/${row?._id}`} className='btn btn-primary me-2 text-decoration-none text-light btn-edit'>Edit</Link>
                                // <button to={`/admin/edit-sub-admin/${row?._id}`} className='btn btn-primary me-2'>Edit</button>
                                :
                                null
                        }
                        {
                            permissionName && permissionName.length > 0 && permissionName.includes('delete_sub_admin') ?
                                <button className="btn btn-danger me-2" onClick={() => deleteAction(row?._id)}>Delete</button>
                                :
                                null
                        }
                        {
                            permissionName && permissionName.length > 0 && permissionName.includes('block_sub_admin') ?
                                <>
                                    {row?.status == true ?
                                        <button className="btn btn-warning me-2" onClick={() => userAction(row?._id, "block")}>Block</button>
                                        : <button className="btn btn-warning me-2" onClick={() => userAction(row?._id, "unBlock")}>Unblock</button>
                                    }
                                </>
                                :
                                null
                        }

                    </>
                );
            }
        }
    ];


    return (
        <>
            {loader ? <FullPageTransparentLoader /> :
                <>
                    <div className="content-wrapper right-content-wrapper">
                        <div className="content-box">
                            <h3>Agent Details</h3>
                            <div className='d-flex'>
                                {
                                    show && permissionName && permissionName.length > 0 && permissionName.includes('add_user') ?
                                    <>
                                        <Link to='/admin/add-sub-admin'><button className="btn btn-default">Add Agent</button></Link> &nbsp;&nbsp;
                                        <button className="btn btn-default" onClick={clearFilter} >Clear Filter</button>
                                    </>
                                        
                                        
                                        :
                                        null
                                }
                            </div>
                            <br /> <br />
                            {/* <div>
                                <div className="form-group col-md-12 mb-3">
                                    <label className="control-label">Filter By Agent Type</label>
                                    <Form.Select name="type" onChange={e => setAgent([e.target.value])}>
                                        <option value="">Select Role</option>
                                        {
                                            agentRoles && agentRoles.length > 0 && agentRoles.map((role) => {
                                                return (
                                                    <>
                                                        <option value={role?._id}>{role?.name}</option>
                                                    </>
                                                );
                                            })
                                        }
                                    </Form.Select>
                                </div>
                            </div> */}

                            <DataTable
                                title="CRM Users"
                                rows={users?._id}
                                columns={columns}
                                data={filteredItems}
                                pagination
                                highlightOnHover
                                //paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
                                paginationRowsPerPageOptions={[10, 50, 100, 500]}
                                //subHeader
                                //subHeaderComponent={subHeaderComponentMemo}
                                persistTableHead
                                //selectableRows
                                //onSelectedRowsChange={handleUserSelectedChange}
                                //selectableRowSelected={users?._id}
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

export default CRMUsers