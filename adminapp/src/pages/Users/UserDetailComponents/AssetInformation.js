import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showAllCurrencies } from '../../../redux/currency/currencyActions';
import { getRole } from '../../../redux/roles/roleActions';
import { toast } from 'react-toastify';


const currencyFormatter = require('currency-formatter');

const AssetInformation = () => {
    const dispatch = useDispatch();
    const [user, setUser] = useState("");
    const amounts = useSelector((state) => state.users?.user?.account?.amounts);
    const previousTotalAmount = useSelector((state) => state.users?.user?.account?.previousTotalAmount);
    const currencies = useSelector(state => state.currency?.currencies?.allCurrencies);

    useEffect(async () => {
        const loginData = localStorage.getItem('user');
        const data = JSON.parse(loginData);
        const roleId = data?.roleId;
        dispatch(getRole(roleId));

        await dispatch(showAllCurrencies());
    }, []);


    return (
        <>
            <div className="tab-pane fade" id="assetInfo">
                <h5> Account Balance </h5>
                <div className="row">
                    <div className="form-group col-md-6">
                        <label className="control-label">
                            Total Balance
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            value={currencyFormatter.format(previousTotalAmount, { code: 'USD' })}
                            disabled
                        />
                    </div>
                    {amounts && amounts.length ?
                        amounts.map(coin =>
                            <>
                                {currencies?.find(row => row._id == coin.currencyId)?.name ?
                                    <div key={coin._id} className="form-group col-md-6">
                                        <label className="control-label">
                                            {currencies?.find(row => row._id == coin.currencyId)?.name}({currencies?.find(row => row._id == coin.currencyId)?.symbol})
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={coin.amount}
                                            disabled
                                        />
                                    </div>
                                    : null
                                }
                            </>
                        )
                        :
                        "Empty Wallet"
                    }
                </div>
                <br />
            </div>
        </>
    )
}

export default AssetInformation