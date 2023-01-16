import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { showAllUsers, deleteUser, editUser, referralsPerId, userDirectLogin } from '../../redux/users/userActions';
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
import * as Flags from "react-flags-select";
import { toast } from 'react-toastify';

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

const Affiliate = () => {
   const [roleId, setRoleId] = useState('');
   const [userId, setUserId] = useState('');
   const [loader, setLoader] = useState(false);
   const [filterText, setFilterText] = useState('');
   const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

   const dispatch = useDispatch();
   const users = useSelector(state => state?.users?.users);
   const referrals = useSelector(state => state);

   const roleData = useSelector(state => state?.role.role);
   const permissions = roleData[0]?.permissions;
   const [type, setType] = useState("0");
   const [all, setAll] = useState("");
   const permissionName = getPermission(permissions);
   const [show, setShow] = useState(true);
   const success = useSelector(state => state.users.success);
   const userDeleted = useSelector(state => state?.users?.userDeleted);
   const salesStatuses = useSelector(state => state?.salesStatus?.salesStatuses);

   const filteredItems = users?.filter(
      (item, index) =>
         item.users.firstName && item.users.firstName.toLowerCase().includes(filterText.toLowerCase()) ||
         item.users.email && item.users.email.toLowerCase().includes(filterText.toLowerCase()) ||
         item.userType && item.userType.toLowerCase().includes(filterText.toLowerCase()) ||
         item?.users?.clientStatus && userTypeStatus?.find(stat => stat.value == item?.users?.clientStatus)?.label?.toLowerCase().includes(filterText.toLowerCase()) ||
         !item?.users?.clientStatus && userTypeStatus?.[0]?.label?.toLowerCase().includes(filterText.toLowerCase())
   );

   useEffect(async () => {
      const loginData = localStorage.getItem('user');
      const data = JSON.parse(loginData);
      const id = data?.roleId;
      setRoleId(id)
      const uid = data?._id
      await setUserId(uid)
      await dispatch(getRole(id));
      await dispatch(getSalesStatuses());
   }, [])

   useEffect(async () => {
      setLoader(true);
      const loginData = localStorage.getItem('user');
      const data = JSON.parse(loginData);
      const id = data?.roleId;
      const uid = data?._id;
      const clientType = 3;

      await dispatch(showAllUsers(type, id, uid, clientType));
      type == "0" ? setShow(true) : setShow(false);
      if (success) {
         setLoader(false);
      }
   }, [type, success, userDeleted]);

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

   const loginAsUser = (user) => {
      if (user?._id) {
         const data = { email: user?.email, userByAdmin: true }
         dispatch(userDirectLogin(data))
      }
   }

   const copyReferral = () => {
      toast.success('Successfully copied!');
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


   const columns = [
      {
         name: 'UID',
         selector: row => {
            return (
               <>
                  <CopyToClipboard text={row?.users._id}>
                     <span>
                        {row?.users._id?.slice(0, 4)}...{row?.users._id?.slice(row?.users._id.length - 4, row?.users._id.length)}
                        <FontAwesomeIcon icon={faClone} onClick={() => copyReferral()} className="ms-2" />
                     </span>
                  </CopyToClipboard>
               </>
            )
         }
      },

      {
         name: 'Actions',
         width: "150px",
         cell: row => {
            return (
               <>
                  {/* {
                     <button className="btn login-as-user-btn btn-sm me-1 p-1" onClick={() => loginAsUser(row?.users)}>Login</button>
                  } */}
                  <Link to={`/admin/affiliate-detail/${row?.users?._id}`} className='btn btn-success btn-sm me-1 p-1 text-decoration-none text-light'>Edit</Link>
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
                  <CopyToClipboard text={row?.users.email}>
                     <span data-tip={row?.users.email}>{row?.users.email}
                        <FontAwesomeIcon icon={faClone} onClick={() => copyReferral()} className="ms-2" />
                     </span>
                  </CopyToClipboard>
               </>
            )
         },
         sortable: true,
      },
      {
         name: 'Phone Number',
         selector: row => {
            return (
               <>
                  <span data-tip={row?.users.phone}>{row?.users.phone}</span>
                  <ReactTooltip />
               </>
            )
         },
         sortable: true,
      },
      {
         name: 'Country',
         selector: row => {
            if (row?.users?.countryCode && row?.users?.country?.[0]?.nicename) {
               const flagTitleCase = titleCase(row?.users?.countryCode);
               const UserCountryFlag = Flags[flagTitleCase];

               return (
                  <>
                     <span style={{ fontSize: 18 }}><UserCountryFlag /></span>
                     {' '}{' '}
                     <span data-tip={row?.users?.country?.[0]?.nicename}>{row?.users?.country?.[0]?.nicename}</span>
                     <ReactTooltip />
                  </>
               )
            }
            else {
               return '-'
            }
         },
         sortable: true,
      },
      {
         name: 'Status',
         selector: row => row?.users?.salesStatusId ? row?.users?.salesStatusId : "",
         cell: (row) => {
            let currSalesStatusType = { _id: "", name: "No Status", color: "#fff" };
            if (row?.users?.salesStatusId) {
               currSalesStatusType = salesStatuses.find(stat => stat._id == row?.users?.salesStatusId);
            }
            return (
               <>
                  <span style={{ color: currSalesStatusType?.color }}>{currSalesStatusType?.name}</span>
               </>
            )
         },
         sortable: true,
      },
      // {
      //    name: 'Status',
      //    selector: row => {
      //       return (
      //          <>
      //             <span>{row?.users?.clientStatus ? userTypeStatus?.find(stat => stat.value == row?.users?.clientStatus)?.label : userTypeStatus?.[0]?.label}</span>
      //          </>
      //       )
      //    },
      //    sortable: true,
      // },
      // {
      //    name: 'Status',
      //    selector: row => {
      //       return (
      //          <>
      //             <span>{row?.users.isDeleted == true ? 'Deleted' : (row?.users.status == true ? 'Active' : 'Inactive')}</span>
      //          </>
      //       )
      //    },
      //    sortable: true,
      // },
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

   const subHeaderComponentMemo = useMemo(() => {
      const handleClear = () => {
         if (filterText) {
            setResetPaginationToggle(!resetPaginationToggle);
            setFilterText('');
         }
      };

      return (
         <FilterComponent onFilter={e => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} />
      );
   }, [filterText, resetPaginationToggle]);

   const viewReferrals = (id) => {
      if (id) {
         let data = { id }
         dispatch(referralsPerId(data));
      }
   }
   return (
      <>
         {loader ? <FullPageTransparentLoader /> :
            <>
               <div className="content-wrapper right-content-wrapper">
                  <div className="content-box">
                     <h3>Affiliate Details</h3>
                     {
                        show && permissionName && permissionName.length > 0 && permissionName.includes('add_user') ?
                           <Link to='/admin/add-user'><button className="btn btn-default">Add Affiliate</button></Link>
                           :
                           null
                     }
                     <br /> <br />
                     <div>

                        {/* <div className="form-group col-md-12 mb-3">
                           <label className="control-label">Select Management</label>
                           <Form.Select aria-label="Default select example" name="type" required="required" onChange={e => setType(e.target.value)} value={type}>
                              <option value="0">All</option>
                              <option value="1">Master</option>
                              <option value="2">Partner</option>
                              <option value="3">Slave</option>
                           </Form.Select>
                        </div> */}
                     </div>
                     <DataTable
                        columns={columns}
                        data={filteredItems}
                        pagination
                        highlightOnHover
                        paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
                        subHeader
                        subHeaderComponent={subHeaderComponentMemo}
                        persistTableHead
                        selectableRows
                        theme="solarizedd"
                     />
                  </div>
               </div>
            </>
         }
      </>
   )
}

export default Affiliate