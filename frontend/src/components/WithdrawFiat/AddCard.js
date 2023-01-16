import { React, useEffect, useState } from 'react';
import { getCurrency } from '../../redux/currencies/currencyActions';
// import { getNetwork } from '../../redux/networks/networkActions';
import { addCard } from '../../redux/cards/creditCardActions';
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';

const AddCards = ({ handleCloseCC }) => {

    const [label, setLabel] = useState('');
    const [card, setCard] = useState('');
    const [selectedCurrency, setSelectedCurrency] = useState([]);
    // const [selectedNetwork, setSelectedNetwork] = useState([]);

    const dispatch = useDispatch();
    const currencyData = useSelector((state) => state.currency?.currencies?.allCurrencies);
    // const networks = useSelector((state) => state.networks?.networks);
    const userId = useSelector((state) => state.user?.user?._id);

    useEffect(() => {
        dispatch(getCurrency());
        // dispatch(getNetwork());
    }, []);

    const handleAdd = () => {
        const data = {
            name: label,
            card: card,
            // symbol: selectedNetwork.symbol,
            // networkId: selectedNetwork._id,
            currencyId: selectedCurrency._id,
            userId: userId
        }
        console.log(data);
        dispatch(addCard(data));
        setSelectedCurrency([])
        // setSelectedNetwork([])
        handleCloseCC();
    }

    return (
        <>
            <div className="withdrawal-modal2">
                <h4 className="text-green">Add Card</h4>
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
                            {currencyData && currencyData.length > 0 && currencyData?.filter(row => row?.isFiat == true)?.map((currency) => (
                                <li onClick={() => { setSelectedCurrency(currency) }}>
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
                            <div className="input-group buttonInside">
                                <p className="text-white">Card Number</p>
                                <input type="text" placeholder="Enter Card Number" onChange={(e) => setCard(e.target.value)} />
                            </div>
                            <div className="d-block">
                                <button type="button" onClick={() => handleAdd()} className="btn enter-btn3">Continue</button>
                            </div>
                        </>
                        : ""
                    }
                </form>
            </div>
        </>
    )
}

export default AddCards