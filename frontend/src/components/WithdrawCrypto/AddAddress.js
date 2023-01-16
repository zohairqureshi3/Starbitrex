import { React, useEffect, useState } from 'react';
import { getCurrency } from '../../redux/currencies/currencyActions';
import { getNetwork } from '../../redux/networks/networkActions';
import { addWallet } from '../../redux/addresses/externalWalletActions';
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';

const AddAddress = ({ handleCloseAddr }) => {

    const [label, setLabel] = useState('');
    const [address, setAddress] = useState('');
    const [selectedCurrency, setSelectedCurrency] = useState([]);
    const [selectedNetwork, setSelectedNetwork] = useState([]);

    const dispatch = useDispatch();
    const currencyData = useSelector((state) => state.currency?.currencies?.allCurrencies);
    const networks = useSelector((state) => state.networks?.networks);
    const userId = useSelector((state) => state.user?.user?._id);

    useEffect(() => {
        dispatch(getCurrency());
        dispatch(getNetwork());
    }, []);

    const handleAdd = () => {
        const data = {
            name: label,
            address: address,
            symbol: selectedNetwork.symbol,
            networkId: selectedNetwork._id,
            currencyId: selectedCurrency._id,
            userId: userId
        }
        console.log(data);
        dispatch(addWallet(data));
        setSelectedCurrency([])
        setSelectedNetwork([])
        handleCloseAddr();
    }

    return (
        <>
            <div className="withdrawal-modal2">
                <h4 className="text-green">Add Address</h4>
                <form className="address-form wrap-address-form m-auto">
                    <div className="input-group buttonInside">
                        <p className="text-white">Address Label</p>
                        <input type="text" placeholder="Enter Address label" onChange={(e) => setLabel(e.target.value)} />
                    </div>
                    <p className="text-white">Select Coin</p>
                    <div className="dropdown deposit-dropdown">
                        <button className="btn dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                            <div className="d-flex justify-content-between">
                                <p className="coin-name">
                                    {selectedCurrency && selectedCurrency.symbol ? <>{selectedCurrency.name}</> : "Select Coin"}
                                </p>
                                <div className="coin-details d-flex align-items-center">
                                    {selectedCurrency && selectedCurrency.symbol ? <><p className="detail">({selectedCurrency.symbol})</p></> : <><p className="detail">(Symbol)</p></>}
                                    <p className="dd-arrow"></p>
                                </div>
                            </div>
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                            {currencyData && currencyData.length > 0 && currencyData?.filter(row => row?.isFiat != true)?.map((currency) => (
                                <li onClick={() => { setSelectedCurrency(currency); setSelectedNetwork([]); }}>
                                    <a className="dropdown-item">
                                        <div className="d-items d-flex justify-content-between">
                                            <p>{currency.name}</p>
                                            <p>{currency.symbol}</p>
                                        </div>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {selectedCurrency && selectedCurrency._id ?
                        <>
                            <p className="text-white">Select Network</p>
                            <div className="dropdown deposit-dropdown">
                                <button className="btn dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                    <div className="d-flex justify-content-between">
                                        <p className="coin-name">
                                            {selectedNetwork && selectedNetwork.name ? <>{selectedNetwork.name}</> : "Select Network"}
                                        </p>
                                        <div className="coin-details d-flex align-items-center">
                                            {selectedNetwork && selectedNetwork.name ? <><p className="detail">({selectedNetwork.symbol})</p></> : <><p className="detail">(Symbol)</p></>}
                                            <p className="dd-arrow"></p>
                                        </div>
                                    </div>
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                    {networks && networks.length > 0 && networks.filter(network => network.currencies.some((o) => o._id == selectedCurrency._id)).map((network) => (
                                        <li onClick={() => { setSelectedNetwork(network) }}>
                                            <a className="dropdown-item">
                                                <div className="d-items d-flex justify-content-between">
                                                    <p>{network.name}</p>
                                                    <p>{network.symbol}</p>
                                                </div>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {selectedNetwork && selectedNetwork.name ?
                                <>
                                    <div className="input-group buttonInside">
                                        <p className="text-white">Wallet Address</p>
                                        <input type="text" placeholder="Enter Wallet Address" onChange={(e) => setAddress(e.target.value)} />
                                    </div>
                                    <div className="d-block">
                                        <button type="button" onClick={() => handleAdd()} className="btn enter-btn3">Continue</button>
                                    </div>
                                </>
                                : ""
                            }
                        </>
                        : ""
                    }
                </form>
            </div>
        </>
    )
}

export default AddAddress