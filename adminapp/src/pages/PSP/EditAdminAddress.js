import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { MultiSelect } from "react-multi-select-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { getAdminAddress, editAdminAddress, updateState } from "../../redux/adminAddress/adminAddressActions";
import { showAllNetworks } from "../../redux/network/networkActions";
import FullPageTransparentLoader from "../FullPageTransparentLoader/fullPageTransparentLoader";

const EditAdminAddress = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    let { id } = useParams();

    const [loader, setLoader] = useState(false);
    const [network, setNetwork] = useState("");
    const [currencies, setCurrencies] = useState([]);
    const [selected, setSelected] = useState([]);
    const [currencyErr, setCurrencyErr] = useState("");
    const [options, setOptions] = useState([]);
    const [adminAddressData, setAdminAddressData] = useState({ address: "", networkId: "", currencyId: "" });

    const networks = useSelector(state => state.network?.networks);
    const adminAddress = useSelector(state => state?.adminAddress?.adminAddress);
    const adminAddressfetched = useSelector(state => state?.adminAddress?.adminAddressfetched);
    const adminAddressEditted = useSelector(state => state?.adminAddress?.adminAddressEditted);

    const { register, handleSubmit, reset, control, formState: { errors } } = useForm({
        defaultValues: adminAddressData,
    });

    useEffect(() => {
        setLoader(true);
        async function fetchData() {
            dispatch(showAllNetworks());
            dispatch(getAdminAddress(id));
        }
        fetchData();
    }, []);

    useEffect(() => {
        if (network) {
            let currentNetwork = networks.find(net => net._id == network);

            if (currentNetwork?.currencies?.length > 0)
                setCurrencies(currentNetwork?.currencies);
        }
        else {
            setCurrencies([]);
        }
    }, [network]);

    useEffect(() => {
        if (adminAddressfetched) {
            dispatch(updateState());
            setLoader(false);
        }
    }, [adminAddressfetched]);

    useEffect(() => {
        if (Object.keys(adminAddress)?.length > 0) {
            setAdminAddressData(adminAddress);
            reset(adminAddress);
            if (adminAddress?.networkId) {
                setNetwork(adminAddress?.networkId);
            }
            if (adminAddress?.currencies?.length > 0) {
                let tempCurr = [];
                adminAddress?.currencies?.forEach(item => {
                    tempCurr.push({
                        "value": item._id,
                        "label": item.name,
                    })
                });
                setSelected(tempCurr);
            }
        }
    }, [adminAddress])

    useEffect(() => {
        if (adminAddressEditted) {
            history.goBack();
        }
    }, [adminAddressEditted])

    const getCurrencies = async () => {
        if (currencies?.length > 0) {
            const optionsValue = await currencies?.map((currency) => ({
                "key": currency?._id,
                "value": currency?._id,
                "label": currency?.name
            }));
            setOptions(optionsValue)
        }
    }

    useEffect(() => {
        getCurrencies();
    }, [currencies]);

    const handleNetworkChange = (e) => {
        setNetwork(e.target.value);
        setSelected([]);
    }

    const editAdminAddressData = {
        address: {
            required: "address is required"
        },
        currencyId: {
            required: "Please select currency"
        },
        networkId: {
            required: "Please select network"
        }
    };

    const handleSave = async (formData) => {
        setLoader(true);

        let tempIds = [];
        selected.forEach(item => {
            tempIds.push(item.value)
        });
        const data = {
            address: formData.address,
            currencyIds: tempIds,
            networkId: network,
        };
        dispatch(editAdminAddress(id, data));
    };

    return (
        <>
            {loader ? (<FullPageTransparentLoader />) :
                <div className="content-wrapper right-content-wrapper">
                    <div className="content-box">
                        <FontAwesomeIcon className="faArrowLeftIcon" icon={faArrowLeft} onClick={() => history.goBack()} />
                        <h5>Edit Admin Wallet</h5>
                        <form onSubmit={handleSubmit(handleSave)}>
                            <div className="form-group col-md-12">
                                <label className="control-label">Wallet Address</label>
                                <input type="text" className="form-control" placeholder="Enter Wallet Address"
                                    {...register('address', editAdminAddressData.address)} name='name' control={control} />
                                {errors?.address && <span className="errMsg">{errors.address.message}</span>}
                            </div>
                            <div className="form-group col-md-12">
                                <label className="control-label">Select Network</label>
                                <select className="form-control" name="network" required="required" onChange={handleNetworkChange} value={network} >
                                    <option value="">Select Network</option>
                                    {networks && networks.length > 0 && networks.map((network => {
                                        return (
                                            <option value={network._id} key={network._id}>{network.name}</option>
                                        )
                                    }))}
                                </select>
                            </div>
                            {options?.length > 0 && currencies.length > 0 ?
                            <>
                                <div className="form-group col-md-12 pt-2 custom-milti-select">
                                    <label className="control-label">Select Currencies</label>
                                    <MultiSelect options={options} value={selected} onChange={setSelected} labelledBy="Select" />
                                    {currencyErr ? (<span className="errMsg">{currencyErr}</span>) : ("")}
                                </div>
                                <div>
                                    <button className="btn btn-default" type="submit">Save</button>
                                </div>
                            </>
                            : null}
                        </form>
                    </div>
                </div>
            }
        </>
    );
};

export default EditAdminAddress;