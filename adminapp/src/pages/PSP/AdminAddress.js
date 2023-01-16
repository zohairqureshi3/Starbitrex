import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Table, Container, Row, Col } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { getRole } from '../../redux/roles/roleActions';
import { showAllNetworks } from "../../redux/network/networkActions";
import { getAdminAddressesByCurrencyNetwork, deleteAdminAddress, setDefaultNetworkAdminAddress, updateState } from '../../redux/adminAddress/adminAddressActions';
import { getPermission } from "../../config/helpers";
import FullPageTransparentLoader from "../FullPageTransparentLoader/fullPageTransparentLoader";

const AdminAddress = () => {
    const dispatch = useDispatch();

    const [loader, setLoader] = useState(false);
    const [network, setNetwork] = useState("");
    const [currency, setCurrency] = useState("");
    const [currencies, setCurrencies] = useState([]);
    const roleData = useSelector(state => state?.role?.role);
    const adminAddressesNetwork = useSelector(state => state?.adminAddress?.adminAddressesNetwork);
    const adminAddressesNetworkfetched = useSelector(state => state?.adminAddress?.adminAddressesNetworkfetched);
    const adminAddressDeleted = useSelector(state => state?.adminAddress?.adminAddressDeleted);
    const networks = useSelector(state => state.network?.networks);
    const permissions = roleData[0]?.permissions;
    const permissionName = getPermission(permissions);

    useEffect(() => {
        async function fetchData() {
            if (adminAddressesNetworkfetched || adminAddressDeleted) {
                await dispatch(updateState());
                setLoader(false);
            }
        }
        fetchData();
    }, [adminAddressesNetworkfetched, adminAddressDeleted]);

    useEffect(() => {
        async function fetchData() {
            setLoader(true);
            const loginData = localStorage.getItem('user');
            const data = JSON.parse(loginData);
            const id = data?.roleId;
            await dispatch(getRole(id));
            await dispatch(showAllNetworks());
            await dispatch(getAdminAddressesByCurrencyNetwork(network, currency));
        }
        fetchData();
    }, [])

    useEffect(() => {
        if (network) {
            let currentNetwork = networks.find(net => net._id == network);

            if (currentNetwork?.currencies?.length > 0)
                setCurrencies(currentNetwork?.currencies);
        }
        else {
            setCurrencies([]);
            setCurrency("");
        }
    }, [network]);

    useEffect(() => {
        if(network && currency)
        {
            dispatch(getAdminAddressesByCurrencyNetwork(network, currency));
        }
        else
        {
            dispatch(getAdminAddressesByCurrencyNetwork());
        }
    }, [network, currency]);

    const handleNetworkChange = (e) => {
        setNetwork(e.target.value);
    }

    const handleCurrencyChange = (e) => {
        setCurrency(e.target.value);
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
        }).then(async (result) => {
            if (result.isConfirmed == true ? true : false) {
                setLoader(true);
                await dispatch(deleteAdminAddress(id));
            }
        })
    }

    const setDefaultAction = (id) => {
        Swal.fire({
            title: `Are you sure you want to set it as default Address for selected Network?`,
            html: '',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: "Yes"
        }).then(async (result) => {
            if (result.isConfirmed == true ? true : false) {
                setLoader(true);
                const data = {
                    isDefault: true,
                    currencyId: currency,
                    networkId: network
                };
                await dispatch(setDefaultNetworkAdminAddress(id, data));
            }
        })
    }

    return (
        <>
            {loader ? <FullPageTransparentLoader /> :
                <div className="content-wrapper right-content-wrapper">
                    <div className="content-box">
                        <h3>Admin Wallets</h3>
                        {
                            permissionName && permissionName.length > 0 && permissionName.includes('add_admin_address') ?
                                <Link to='/admin/add-admin-address'><button className="btn btn-default">Add Wallet</button></Link>
                                :
                                null
                        }
                        <div className='filters-section'>
                            <Container fluid>
                                <Row>
                                    <Col md={12}>
                                        <h4 className='mb-4'>Filters</h4>
                                    </Col>
                                    <Col md={4}>
                                        <div className="form-group col-md-12 pb-3">
                                            <label className="control-label">Select Network</label>
                                            <select className="form-control" name="network" required="required" onChange={handleNetworkChange} value={network} >
                                                <option value="">Select Network</option>
                                                {networks && networks.length > 0 && networks.map((net => {
                                                    return (
                                                        <option value={net._id} key={net._id}>{net.name}</option>
                                                    )
                                                }))}
                                            </select>
                                        </div>
                                    </Col>
                                    <Col md={4}>
                                        <div className="form-group col-md-12 pb-3">
                                            <label className="control-label">Select Currency</label>
                                            <select className="form-control" name="currency" required="required" onChange={handleCurrencyChange} value={currency} >
                                                <option value="">Select Currency</option>
                                                {currencies && currencies.length > 0 && currencies.map((cur => {
                                                    return (
                                                        <option value={cur._id} key={cur._id}>{cur.name}</option>
                                                    )
                                                }))}
                                            </select>
                                        </div>
                                    </Col>
                                </Row>
                            </Container>
                        </div>
                        <div className="mt-3 table-responsive">
                            <Table responsive>
                                <thead className="table_head">
                                    <tr>
                                        <th>Address</th>
                                        <th>Network</th>
                                        <th>Currencies</th>
                                        {
                                            permissionName && permissionName.length > 0 && permissionName.includes('edit_admin_address', 'delete_admin_address') ?
                                                <th>Action(s)</th>
                                                :
                                                null
                                        }
                                    </tr>
                                </thead>
                                <tbody className={`${adminAddressesNetwork && adminAddressesNetwork.length > 0 ? '' : 'no-admin-address'}`}>
                                    {adminAddressesNetwork && adminAddressesNetwork.length > 0 ? adminAddressesNetwork.map((adminAddress) => {
                                        return (
                                            <tr key={adminAddress._id}>
                                                <td>{adminAddress.address}</td>
                                                <td>{adminAddress?.network ? adminAddress?.network?.map((netw, index) => (index ? ', ' : '') + netw?.symbol) : '-'}</td>
                                                <td>{adminAddress?.currencies ? adminAddress?.currencies?.map((curr, index) => (index ? ', ' : '') + curr?.symbol) : '-'}</td>
                                                <td className='action-buttons'>
                                                    {
                                                        permissionName && permissionName.length > 0 && permissionName.includes('set_default_admin_address') ?
                                                            adminAddress.isDefault ? <button className="btn btn-success me-2" disabled>Default</button> : <button className="btn btn-success me-2" onClick={() => setDefaultAction(adminAddress._id)}>Set As Default</button>
                                                            :
                                                            null
                                                    }
                                                    {
                                                        permissionName && permissionName.length > 0 && permissionName.includes('edit_admin_address') ?
                                                            <Link to={`/admin/edit-admin-address/${adminAddress._id}`} className='btn btn-primary me-2 text-decoration-none text-light'>Edit</Link>
                                                            :
                                                            null
                                                    }
                                                    {
                                                        permissionName && permissionName.length > 0 && permissionName.includes('delete_admin_address') ?
                                                            <button className="btn btn-danger me-2" onClick={() => deleteAction(adminAddress._id)}>Delete</button>
                                                            :
                                                            null
                                                    }
                                                </td>
                                            </tr>
                                        )
                                    }) :
                                        <tr>
                                            <td colSpan={100} className="text-center">Please select Network and Currency from the above filter.</td>
                                        </tr>
                                    }
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default AdminAddress;