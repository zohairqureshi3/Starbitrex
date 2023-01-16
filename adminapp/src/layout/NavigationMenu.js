import { Link, NavLink } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPerRole } from '../redux/roles/roleActions';
import { getPermission } from '../config/helpers';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusCircle, faUsers, faBriefcase, faCheckCircle, faPlug, faMoneyCheck, faClock, faShareSquare, faExchange, faMoneyBill, faTrademark, faBars, faTimes, faNetworkWired, faBuilding, faPeopleArrows } from '@fortawesome/free-solid-svg-icons';

const NavigationMenu = (props) => {
    const history = useHistory()
    const [path, setPath] = useState('/admin');
    let token = localStorage.getItem('token');
    const dispatch = useDispatch();
    const roleData = useSelector(state => state?.role.role);
    const loginPermissions = roleData[0]?.permissions;
    const permissionName = getPermission(loginPermissions);
    const [activeSidebar, setActiveSidebar] = useState(true);
    const activeTab = (path) => {
        setPath(path)
        history.push(path)
    }

    useEffect(() => {
        const pathname = window.location.pathname;
        setPath(pathname)
    }, []);

    useEffect(() => {
        const loginData = localStorage.getItem('user');
        const data = JSON.parse(loginData);
        const uId = data?.roleId;
        dispatch(getPerRole(uId));
    }, [token])

    const checkScreen = () => {
        if (window.innerWidth < 768 === true) {
            setActiveSidebar(false);
        } else {
            setActiveSidebar(true);
        }
    }

    useEffect(() => {
        checkScreen();
    }, []);
    const showSidebar = () => {
        setActiveSidebar(!activeSidebar);
    }

    return (
        <>
            {
                activeSidebar ?
                    <><div className='sidebar-is-active'></div></> :
                    <></>
            }
            <div className={activeSidebar ? "sidebar left-sidebar-fix show-sidenav" : "sidebar left-sidebar-fix hide-sidenav"}>
                <div style={{ position: "relative" }}>
                    <div className="profile pt-0">
                        <div className="profile-info">
                            <h5>Admin Panel</h5>
                        </div>
                    </div>
                    <div className='menu-toggle'>
                        {
                            activeSidebar ?
                                <><FontAwesomeIcon icon={faTimes} className="text-white sidebar-icon-hide" onClick={() => showSidebar()} /></> :
                                <><FontAwesomeIcon icon={faBars} className="text-white sidebar-icon-hide" onClick={() => showSidebar()} /></>
                        }
                    </div>
                </div>
                <div className='admin-panel-btns'>
                    <nav className='w-100'>
                        {/* <div className='menu-padding'>
                            <Link className={`admin-nav-link ${window.location.pathname == "/admin" ? 'active' : 'unactive'}`} to="/admin">Dashboard</Link>
                        </div> */}
                        <div className='menu-padding'>
                            <text className='menutitle'>User Managment</text>
                            <Dropdown className='user-dropdown'>
                                <Dropdown.Toggle variant="success" id="dropdown-basic">
                                    <span className="admin-nav-link d-flex justify-content-between align-items-center">
                                        <span>Users</span> <FontAwesomeIcon icon={faUsers} />
                                    </span>
                                </Dropdown.Toggle>
                                <Dropdown.Menu show={path === "/admin/users" || path === "/admin/add-user" || path === "/admin/deleted-users" ? true : false}>
                                    {
                                        permissionName && permissionName.length > 0 && permissionName.includes('leads') ?
                                            <NavLink to='/admin/leads' className="admin-nav-link sub-menu-padding">
                                                <FontAwesomeIcon icon={faMinusCircle} className="me-2" />Leads
                                            </NavLink>
                                            :
                                            null
                                    }
                                    {
                                        permissionName && permissionName.length > 0 && permissionName.includes('clients') ?
                                            <NavLink to='/admin/users' className="admin-nav-link sub-menu-padding">
                                                <FontAwesomeIcon icon={faMinusCircle} className="me-2" />Clients
                                            </NavLink>
                                            :
                                            null
                                    }
                                    {/* <NavLink to='/admin/add-user' className="admin-nav-link sub-menu-padding">
                                    <FontAwesomeIcon icon={faMinusCircle} className="me-2" />Add User
                                </NavLink>
                                <NavLink to='/admin/deleted-users' className="admin-nav-link sub-menu-padding">
                                    <FontAwesomeIcon icon={faMinusCircle} className="me-2" />Deleted Users
                                </NavLink> */}
                                </Dropdown.Menu>
                            </Dropdown>
                            {
                                permissionName && permissionName.length > 0 && permissionName.includes('sub_admins_management') ?
                                    <Dropdown className='user-dropdown'>
                                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                                            <span className="admin-nav-link d-flex justify-content-between align-items-center">
                                                <span>Affiliates</span> <FontAwesomeIcon icon={faUsers} />
                                            </span>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu show={path === "/admin/sub-admins" || path === "/admin/add-sub-admin" || path === "/admin/deleted-sub-admins" ? true : false}>
                                            <NavLink to='/admin/affiliate' className="admin-nav-link sub-menu-padding">
                                                <FontAwesomeIcon icon={faMinusCircle} className="me-2" />Affiliate
                                            </NavLink>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    :
                                    null
                            }
                            {
                                permissionName && permissionName.length > 0 && permissionName.includes('statuses') ?
                                    <NavLink className="admin-nav-link d-flex justify-content-between align-items-center" to='/admin/statuses'>
                                        <span>Statuses</span><FontAwesomeIcon icon={faPeopleArrows} />
                                    </NavLink>
                                    : null
                            }
                            {
                               
                                    <NavLink className="admin-nav-link d-flex justify-content-between align-items-center" to='/admin/crm-users'>
                                        <span>CRM Users</span><FontAwesomeIcon icon={faUsers} />
                                    </NavLink>
                                   
                            }
                            {
                                // permissionName && permissionName.length > 0 && permissionName.includes('sub_admins_general') ?
                                //     <Dropdown className='user-dropdown'>
                                //         <Dropdown.Toggle variant="success" id="dropdown-basic">
                                //             <span className="admin-nav-link d-flex justify-content-between align-items-center">
                                //                 <span>Agents</span> <FontAwesomeIcon icon={faUsers} />
                                //             </span>
                                //         </Dropdown.Toggle>
                                //         <Dropdown.Menu show={path === "/admin/sub-admins" || path === "/admin/add-sub-admin" || path === "/admin/deleted-sub-admins" ? true : false}>
                                //             {
                                //                 permissionName && permissionName.length > 0 && permissionName.includes('sub_admins_management') ?
                                //                     <NavLink to='/admin/crm-users' className="admin-nav-link sub-menu-padding">
                                //                         <FontAwesomeIcon icon={faMinusCircle} className="me-2" />CRM Users
                                //                     </NavLink>
                                //                     : null
                                //             }
                                //             {
                                //                 permissionName && permissionName.length > 0 && permissionName.includes('sub_admins_management') ?
                                //                     <NavLink to='/admin/sub-admins' className="admin-nav-link sub-menu-padding">
                                //                         <FontAwesomeIcon icon={faMinusCircle} className="me-2" />Sub Admins
                                //                     </NavLink>
                                //                     : null
                                //             }
                                //             {
                                //                 permissionName && permissionName.length > 0 && permissionName.includes('sales_agents') ?
                                //                     <NavLink to='/admin/sales-agents' className="admin-nav-link sub-menu-padding">
                                //                         <FontAwesomeIcon icon={faMinusCircle} className="me-2" />Sales Agents
                                //                     </NavLink>
                                //                     : null
                                //             }
                                //             {
                                //                 permissionName && permissionName.length > 0 && permissionName.includes('sales_teamleads') ?
                                //                     <NavLink to='/admin/sales-teamleads' className="admin-nav-link sub-menu-padding">
                                //                         <FontAwesomeIcon icon={faMinusCircle} className="me-2" />Sales Teamleads
                                //                     </NavLink>
                                //                     : null
                                //             }
                                //             {
                                //                 permissionName && permissionName.length > 0 && permissionName.includes('retention_agents') ?
                                //                     <NavLink to='/admin/reten-agents' className="admin-nav-link sub-menu-padding">
                                //                         <FontAwesomeIcon icon={faMinusCircle} className="me-2" />Retention Agents
                                //                     </NavLink>
                                //                     : null
                                //             }
                                //             {
                                //                 permissionName && permissionName.length > 0 && permissionName.includes('retention_teamleads') ?
                                //                     <NavLink to='/admin/reten-teamleads' className="admin-nav-link sub-menu-padding">
                                //                         <FontAwesomeIcon icon={faMinusCircle} className="me-2" />Retention Teamleads
                                //                     </NavLink>
                                //                     : null
                                //             }
                                //             {
                                //                 permissionName && permissionName.length > 0 && permissionName.includes('supervisors') ?
                                //                     <NavLink to='/admin/supervisors' className="admin-nav-link sub-menu-padding">
                                //                         <FontAwesomeIcon icon={faMinusCircle} className="me-2" />Supervisors
                                //                     </NavLink>
                                //                     : null
                                //             }
                                //             {/* <NavLink to='/admin/add-sub-admin' className="admin-nav-link sub-menu-padding">
                                //             <FontAwesomeIcon icon={faMinusCircle} className="me-2" />Add Sub Admins
                                //         </NavLink>
                                //         <NavLink to='/admin/deleted-sub-admins' className="admin-nav-link sub-menu-padding">
                                //             <FontAwesomeIcon icon={faMinusCircle} className="me-2" />Deleted Sub Admins
                                //         </NavLink> */}
                                //         </Dropdown.Menu>
                                //     </Dropdown>
                                //     :
                                //     null
                            }
                            {
                                permissionName && permissionName.length > 0 && permissionName.includes('roles_management') ?
                                    <Dropdown className='user-dropdown'>
                                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                                            <span className="admin-nav-link d-flex justify-content-between align-items-center">
                                                <span>Roles</span> <FontAwesomeIcon icon={faBriefcase} />
                                            </span>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu show={path === "/admin/roles" || path === "/admin/add-role" ? true : false}>
                                            <NavLink to='/admin/roles' className="admin-nav-link sub-menu-padding">
                                                <FontAwesomeIcon icon={faMinusCircle} className="me-2" />Roles Details
                                            </NavLink>
                                            {/* <NavLink to='/admin/add-role' className="admin-nav-link sub-menu-padding">
                                            <FontAwesomeIcon icon={faMinusCircle} className="me-2" />Add Roles
                                        </NavLink> */}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    :
                                    null
                            }
                            {
                                permissionName && permissionName.length > 0 && permissionName.includes('permissions_management') ?
                                    <Dropdown className='user-dropdown'>
                                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                                            <span className="admin-nav-link d-flex justify-content-between align-items-center">
                                                <span>Permissions</span> <FontAwesomeIcon icon={faCheckCircle} />
                                            </span>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu show={path === "/admin/permissions" || path === "/admin/add-permission" ? true : false}>
                                            <NavLink to='/admin/permissions' className="admin-nav-link sub-menu-padding">
                                                <FontAwesomeIcon icon={faMinusCircle} className="me-2" />Permissions Details
                                            </NavLink>
                                            <NavLink to='/admin/add-permission' className="admin-nav-link sub-menu-padding">
                                                <FontAwesomeIcon icon={faMinusCircle} className="me-2" />Add Permissions
                                            </NavLink>
                                            <NavLink to='/admin/permissions-modules' className="admin-nav-link sub-menu-padding">
                                                <FontAwesomeIcon icon={faMinusCircle} className="me-2" />Permissions Modules Detail
                                            </NavLink>
                                            <NavLink to='/admin/add-permissions-module' className="admin-nav-link sub-menu-padding">
                                                <FontAwesomeIcon icon={faMinusCircle} className="me-2" />Add Permissions Module
                                            </NavLink>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    :
                                    null
                            }
                            {/* {
                            permissionName && permissionName.length > 0 && permissionName.includes('permissions_modules_management') ?
                                <Dropdown className='user-dropdown'>
                                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                                        <span className="admin-nav-link d-flex justify-content-between align-items-center">
                                            <span>Permissions Modules</span> <FontAwesomeIcon icon={faCheckCircle} />
                                        </span>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu show={path === "/admin/permissions-modules" || path === "/admin/add-permissions-module" ? true : false}>
                                        <NavLink to='/admin/permissions-modules' className="admin-nav-link sub-menu-padding">
                                            <FontAwesomeIcon icon={faMinusCircle} className="me-2" />Permissions Modules Detail
                                        </NavLink>
                                        <NavLink to='/admin/add-permissions-module' className="admin-nav-link sub-menu-padding">
                                            <FontAwesomeIcon icon={faMinusCircle} className="me-2" />Add Permissions Module
                                        </NavLink>
                                    </Dropdown.Menu>
                                </Dropdown>
                                :
                                null
                        } */}
                        </div>
                        <div className='menu-padding'>
                            <text className='menutitle'>Transaction Managment</text>
                            <Dropdown className='user-dropdown'>
                                <Dropdown.Toggle variant="success" id="dropdown-basic">
                                    <span className="admin-nav-link d-flex justify-content-between align-items-center">
                                        <span>Orders</span> <FontAwesomeIcon icon={faUsers} />
                                    </span>
                                </Dropdown.Toggle>
                                <Dropdown.Menu show={path === "/admin/open-orders" || path === "/admin/orders-history" ? true : false}>
                                    <NavLink to='/admin/open-orders' className="admin-nav-link sub-menu-padding">
                                        <FontAwesomeIcon icon={faMinusCircle} className="me-2" />Open Orders
                                    </NavLink>
                                    <NavLink to='/admin/orders-history' className="admin-nav-link sub-menu-padding">
                                        <FontAwesomeIcon icon={faMinusCircle} className="me-2" />Orders History
                                    </NavLink>
                                </Dropdown.Menu>
                            </Dropdown>
                            {/* <NavLink className="admin-nav-link d-flex justify-content-between align-items-center" to='/admin/withdraw-currency'>
                            <span>Withdraw Fees</span><FontAwesomeIcon icon={faMoneyCheck} />
                        </NavLink> */}
                            <NavLink className="admin-nav-link d-flex justify-content-between align-items-center" to='/admin/pending-withdraws'>
                                <span>Pending Withdrawals</span><FontAwesomeIcon icon={faClock} />
                            </NavLink>
                            <NavLink className="admin-nav-link d-flex justify-content-between align-items-center" to='/admin/external-transactions'>
                                <span>Deposits</span><FontAwesomeIcon icon={faExchange} />
                            </NavLink>
                            {/* <Dropdown className='user-dropdown'>
                                <Dropdown.Toggle variant="success" id="dropdown-basic">
                                    <span className="admin-nav-link d-flex justify-content-between align-items-center">
                                        <span>Deposits</span> <FontAwesomeIcon icon={faExchange} />
                                    </span>
                                </Dropdown.Toggle>
                                <Dropdown.Menu show={path === "/admin/transactions" || path === "/admin/external-transactions" ? true : false}>
                                    <NavLink to='/admin/transactions' className="admin-nav-link sub-menu-padding">
                                        <FontAwesomeIcon icon={faMinusCircle} className="me-2" />Internal Transactions
                                    </NavLink>
                                    <NavLink to='/admin/external-transactions' className="admin-nav-link sub-menu-padding">
                                        <FontAwesomeIcon icon={faMinusCircle} className="me-2" />External Deposits
                                    </NavLink>
                                </Dropdown.Menu>
                            </Dropdown> */}
                            {
                                permissionName && permissionName.length > 0 && permissionName.includes('trade_management') ?
                                    <Dropdown className='user-dropdown'>
                                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                                            <span className="admin-nav-link d-flex justify-content-between align-items-center">
                                                <span>Trade</span> <FontAwesomeIcon icon={faTrademark} />
                                            </span>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu show={path === "/admin/trade-history" ? true : false}>
                                            <NavLink to='/admin/trade-history' className="admin-nav-link sub-menu-padding">
                                                <FontAwesomeIcon icon={faMinusCircle} className="me-2" /> Trade History
                                            </NavLink>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    :
                                    null
                            }
                        </div>
                        <div className='menu-padding'>
                            <text className='menutitle'>General Settings</text>
                            <Link className={`admin-nav-link ${window.location.pathname == "/admin/notifications" ? 'active' : 'unactive'}`} to="/admin/notifications">Notifications</Link>
                            <Dropdown className='user-dropdown'>
                                <Dropdown.Toggle variant="success" id="dropdown-basic">
                                    <span className="admin-nav-link d-flex justify-content-between align-items-center">
                                        <span>PSP</span> <FontAwesomeIcon icon={faMoneyBill} />
                                    </span>
                                </Dropdown.Toggle>
                                <Dropdown.Menu show={path === "/admin/networks" || path === "/admin/add-network" ? true : false}>
                                    <NavLink className="admin-nav-link" to="/admin/bank-accounts">
                                        <FontAwesomeIcon icon={faMinusCircle} className="me-2" /> Bank Accounts</NavLink>
                                    <NavLink className="admin-nav-link" to="/admin/admin-addresses">
                                        <FontAwesomeIcon icon={faMinusCircle} className="me-2" />Admin Wallets</NavLink>
                                </Dropdown.Menu>
                            </Dropdown>
                            {/* <Dropdown className='user-dropdown'>
                                <Dropdown.Toggle variant="success" id="dropdown-basic">
                                    <span className="admin-nav-link d-flex justify-content-between align-items-center">
                                        <span>Networks</span> <FontAwesomeIcon icon={faNetworkWired} />
                                    </span>
                                </Dropdown.Toggle>
                                <Dropdown.Menu show={path === "/admin/networks" || path === "/admin/add-network" ? true : false}>
                                    <NavLink to='/admin/networks' className="admin-nav-link sub-menu-padding">
                                        <FontAwesomeIcon icon={faMinusCircle} className="me-2" />Network Details
                                    </NavLink>
                                    {
                                        permissionName && permissionName.length > 0 && permissionName.includes('add_currency') ?
                                            <NavLink to='/admin/add-network' className="admin-nav-link sub-menu-padding">
                                                <FontAwesomeIcon icon={faMinusCircle} className="me-2" />Add Network
                                            </NavLink>
                                            : null
                                    }
                                </Dropdown.Menu>
                            </Dropdown> */}
                            <Dropdown className='user-dropdown'>
                                <Dropdown.Toggle variant="success" id="dropdown-basic">
                                    <span className="admin-nav-link d-flex justify-content-between align-items-center">
                                        <span> Crypto Currency</span> <FontAwesomeIcon icon={faMoneyCheck} />
                                    </span>
                                </Dropdown.Toggle>
                                <Dropdown.Menu show={path === "/admin/currency" || path === "/admin/add-currency" ? true : false}>
                                    <NavLink to='/admin/currency' className="admin-nav-link sub-menu-padding">
                                        <FontAwesomeIcon icon={faMinusCircle} className="me-2" /> Crypto Currency Details
                                    </NavLink>
                                    {/* {
                                        permissionName && permissionName.length > 0 && permissionName.includes('add_currency') ?
                                            <NavLink to='/admin/add-currency' className="admin-nav-link sub-menu-padding">
                                                <FontAwesomeIcon icon={faMinusCircle} className="me-2" />Add Crypto Currency
                                            </NavLink>
                                            : null
                                    } */}
                                </Dropdown.Menu>
                            </Dropdown>
                            <Dropdown className='user-dropdown'>
                                <Dropdown.Toggle variant="success" id="dropdown-basic">
                                    <span className="admin-nav-link d-flex justify-content-between align-items-center">
                                        <span>Fiat Currencies</span> <FontAwesomeIcon icon={faMoneyCheck} />
                                    </span>
                                </Dropdown.Toggle>
                                <Dropdown.Menu show={path === "/admin/fiat-currency" || path === "/admin/add-fiat-currency" ? true : false}>
                                    <NavLink to='/admin/fiat-currency' className="admin-nav-link sub-menu-padding">
                                        <FontAwesomeIcon icon={faMinusCircle} className="me-2" />Fiat Currency Details
                                    </NavLink>
                                    {/* {
                                        permissionName && permissionName.length > 0 && permissionName.includes('add_fiat_currency') ?
                                            <NavLink to='/admin/add-fiat-currency' className="admin-nav-link sub-menu-padding">
                                                <FontAwesomeIcon icon={faMinusCircle} className="me-2" />Add Fiat Currency
                                            </NavLink>
                                            : null
                                    } */}
                                </Dropdown.Menu>
                            </Dropdown>
                            {
                                permissionName && permissionName.length > 0 && permissionName.includes('transaction_fee_management') ?
                                    <Dropdown className='user-dropdown'>
                                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                                            <span className="admin-nav-link d-flex justify-content-between align-items-center">
                                                <span>Conversion Fees</span> <FontAwesomeIcon icon={faExchange} />
                                            </span>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu show={path === "/admin/conversion-fee" || path === "/admin/set-conversion-fee" ? true : false}>
                                            <NavLink to='/admin/conversion-fee' className="admin-nav-link sub-menu-padding">
                                                <FontAwesomeIcon icon={faMinusCircle} className="me-2" />Conversion Details
                                            </NavLink>
                                            <NavLink to='/admin/set-conversion-fee' className="admin-nav-link sub-menu-padding">
                                                <FontAwesomeIcon icon={faMinusCircle} className="me-2" />Set Conversion
                                            </NavLink>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    :
                                    null
                            }
                            {
                                permissionName && permissionName.length > 0 && permissionName.includes('withdraw_fee_management') ?
                                    <Dropdown className='user-dropdown'>
                                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                                            <span className="admin-nav-link d-flex justify-content-between align-items-center">
                                                <span>Withdraw Fee</span> <FontAwesomeIcon icon={faMoneyBill} />
                                            </span>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu show={path === "/admin/withdraw-fee" || path === "/admin/set-withdraw-fee" ? true : false}>
                                            <NavLink to='/admin/withdraw-fee' className="admin-nav-link sub-menu-padding">
                                                <FontAwesomeIcon icon={faMinusCircle} className="me-2" />Withdraw Fee Details
                                            </NavLink>
                                            <NavLink to='/admin/set-withdraw-fee' className="admin-nav-link sub-menu-padding">
                                                <FontAwesomeIcon icon={faMinusCircle} className="me-2" />Set Withdraw Fee
                                            </NavLink>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    :
                                    null
                            }
                            {
                                permissionName && permissionName.length > 0 && permissionName.includes('leverage_management') ?
                                    <Dropdown className='user-dropdown'>
                                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                                            <span className="admin-nav-link d-flex justify-content-between align-items-center">
                                                <span>Leverage</span> <FontAwesomeIcon icon={faUsers} />
                                            </span>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu show={path === "/admin/leverage" || path === "/admin/set-leverage" ? true : false}>
                                            <NavLink to='/admin/leverage' className="admin-nav-link sub-menu-padding">
                                                <FontAwesomeIcon icon={faMinusCircle} className="me-2" />Leverage Details
                                            </NavLink>
                                            <NavLink to='/admin/set-leverage' className="admin-nav-link sub-menu-padding">
                                                <FontAwesomeIcon icon={faMinusCircle} className="me-2" />Add Leverage
                                            </NavLink>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    :
                                    null
                            }
                        </div>
                    </nav>
                </div>
            </div>
        </>
    )
}
export default NavigationMenu