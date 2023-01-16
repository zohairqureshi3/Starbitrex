import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Form } from 'react-bootstrap';
import { MultiSelect } from "react-multi-select-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { addAdminAddress, updateState } from "../../redux/adminAddress/adminAddressActions";
import { showAllNetworks } from "../../redux/network/networkActions";
import FullPageTransparentLoader from "../FullPageTransparentLoader/fullPageTransparentLoader";

const AddAdminAddress = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const [options, setOptions] = useState([]);
    const [selected, setSelected] = useState([]);
    const [currencies, setCurrencies] = useState([]);
    const [currencyErr, setCurrencyErr] = useState("");
    const [loader, setLoader] = useState(false);

    const adminAddressAdded = useSelector(state => state?.adminAddress?.adminAddressAdded);
    const error = useSelector(state => state?.adminAddress?.error);
    const networks = useSelector(state => state.network?.networks);

    const { register, handleSubmit, control, formState: { errors } } = useForm();

    useEffect(() => {
        setLoader(true);
        async function fetchData() {
            dispatch(showAllNetworks());
        }
        fetchData();
    }, []);

    useEffect(() => {
        if (networks?.length > 0) {
            setLoader(false);
        }
    }, [networks]);

    const getCurrencies = async () => {
        if (currencies) {
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
        let currentNetwork = networks.find(net => net._id == e.target.value);

        if (currentNetwork?.currencies?.length > 0)
            setCurrencies(currentNetwork?.currencies);
        else
            setCurrencies([]);
        setSelected([]);
    }

    const adminAddressData = {
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

    const handleSave = (formData) => {
        let tempIds = [];
        selected.forEach(item => {
            tempIds.push(item.value)
        });
        const data = {
            address: formData.address,
            currencyIds: tempIds,
            networkId: formData.network,
        };

        dispatch(addAdminAddress(data));
    };


    useEffect(() => {
        if (adminAddressAdded) {
            dispatch(updateState());
            history.goBack();
        }
    }, [adminAddressAdded])


    useEffect(() => {
        if (error) {
            setLoader(false);
            dispatch(updateState());
        }
    }, [error])

    return (
        <>
            {loader ? (<FullPageTransparentLoader />) :
                <div className="content-wrapper right-content-wrapper">
                    <div className="content-box">
                        <FontAwesomeIcon className="faArrowLeftIcon" icon={faArrowLeft} onClick={() => history.goBack()} />
                        <h5>Add Address</h5>
                        <form onSubmit={handleSubmit(handleSave)}>
                            <div className="form-group col-md-12">
                                <label className="control-label">Wallet Address</label>
                                <input type="text" className="form-control" placeholder="Enter Wallet Address"
                                    {...register('address', adminAddressData.address)} address='address' defaultValue={""} control={control} />
                                {errors?.address && <span className="errMsg">{errors.address.message}</span>}
                            </div>
                            <div className="form-group col-md-12 pt-2">
                                <label className="control-label">Select Network</label>
                                <Form.Select name="network" {...register('network', { onChange: handleNetworkChange })}>
                                    <option value="">Select Network</option>
                                    {networks && networks.length > 0 && networks.map((network => {
                                        return (
                                            <option value={network._id} key={network._id}>{network.name}</option>
                                        )
                                    }))}
                                </Form.Select>
                                {errors?.network && <span className="errMsg">{errors.network.message}</span>}
                            </div>
                            {options?.length > 0 && currencies.length > 0 ?
                                <>
                                <div className="form-group col-md-12 pt-2 custom-milti-select">
                                    <label className="control-label">Select Currencies</label>
                                    <MultiSelect name="options" options={options} value={selected} onChange={setSelected} labelledBy="Select" includeSelectAllOption='false' />
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

export default AddAdminAddress;