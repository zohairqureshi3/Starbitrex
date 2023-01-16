import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from 'react-redux';
import { showAllCurrencies } from '../../redux/currency/currencyActions';
import { addBalance, sendTransactionDataToDB } from "../../redux/users/userActions";
import { ENV } from "../../config/config";
import { toast } from "react-toastify";
import SentAmountToUsers from "./SentAmountToUsers";
import AdminAccountBalance from "./AdminAccountBalance";
import FullPageTransparentLoader from "../FullPageTransparentLoader/fullPageTransparentLoader";
import { updateState } from "../../redux/users/userActions";

const Dashboard = () => {

    const dispatch = useDispatch();
    const currenciesList = useSelector(state => state?.currency?.currencies?.allCurrencies);
    const success = useSelector(state => state.users?.success);
    const balanceAdded = useSelector(state => state.users?.balanceAdded);

    let userKeys = ENV.getUserKeys()
    let user = JSON.parse(userKeys)
    if (user.user) {
        user = user.user
    }
    const loginUser = localStorage.getItem('userId');
    const uId = JSON.parse(loginUser);
    const [currency, setCurrency] = useState("")
    const [username, setUserName] = useState("")
    const [email, setEmail] = useState("")
    const [amount, setAmount] = useState("")
    const [ModelErrors, setModErrors] = useState("")
    const [loader, setLoader] = useState(false);
    const [show, setShow] = useState(false);
    const [showBalance, setShowBalance] = useState(false);
    const handleClose = () => {
        setShow(false)
        setEmail("");
        setCurrency("");
        setAmount("");
    };
    const handleShow = () => { setShow(true) }
    const handleCloseBalance = () => setShowBalance(false);
    const handleShowBalance = () => { setShowBalance(true) }

    useEffect(() => {
        if (!currenciesList) {
            dispatch(showAllCurrencies())
        }
    }, []);

    const seCurrency = (e) => {
        setCurrency(e.target.value)
    }

    const sendCurrency = (e) => {
        e.preventDefault()
        const numReg = /^([0-9]*[.])?[0-9]+$/;
        const regexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email == "") {
            setModErrors("Email address is required!");
        } else if (!email.match(regexp)) {
            setModErrors("Invalid email address!");
        } else if (currency == "") {
            setModErrors("Please select the currency")
        } else if (amount == "") {
            setModErrors("Amount is required")
        } else if (!amount.match(numReg)) {
            setModErrors("Amount must be a number")
        } else {
            setModErrors("")
            setLoader(true)
            const data = {
                fromAccount: user?._id,
                email: email,
                currencyId: currency,
                amount: amount,
            }
            dispatch(sendTransactionDataToDB(data))
        }
    }

    const addBalanceToAccount = (e) => {
        e.preventDefault()
        const numReg = /^([0-9]*[.])?[0-9]+$/;
        if (currency == "") {
            setModErrors("Please select the currency")
        } else if (amount == "") {
            setModErrors("Amount is required")
        } else if (!amount.match(numReg)) {
            setModErrors("Amount must be a number")
        } else {
            setModErrors("")
            const data = {
                currencyId: currency,
                amount: amount,
                userId: uId
            }
            dispatch(addBalance(data))
        }
    }

    useEffect(() => {
        if (success || balanceAdded) {
            setAmount("");
            setEmail("");
            setCurrency("");
            setShow(false);
            setShowBalance(false);
            setLoader(false)
        }
        dispatch(updateState())
    }, [success])

    useEffect(() => {
        const loginUser = localStorage.getItem('user');
        const roleId = JSON.parse(loginUser);
        const name = roleId?.username;
        setUserName(name);
    }, [])

    return (
        <>
            {loader ? (<FullPageTransparentLoader />) : (
                <>
                    {/* <div className="col-lg-10 col-md-9"> */}
                    <div className="content-wrapper right-content-wrapper">
                        <Modal show={show} onHide={handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>Transaction</Modal.Title>
                            </Modal.Header>
                            <Modal.Body> <div className="transaction-selection-content">
                                <label className="control-label">Email</label>
                                <input type="email" className="form-control" onChange={(e) => setEmail(e.target.value)}
                                    name="email" value={email} placeholder="Enter email" />
                                <label>Wallet</label>
                                <select className="form-select" aria-label="Default select example" value={currency}
                                    onChange={seCurrency}>
                                    <option value="" disabled>Select your currency</option>
                                    {currenciesList && currenciesList.length > 0 ?
                                        currenciesList.map((currency, key) => {
                                            return (<option key={key} value={currency?._id} >{currency.name + " " + "-" + " " + currency.symbol}</option>
                                            )
                                        })
                                        : ""}
                                </select>
                                <label className="control-label">Amount</label>
                                <input type="number" className="form-control" onChange={(e) => setAmount(e.target.value)}
                                    name="amount" value={amount} placeholder="Enter amount" />
                            </div>    </Modal.Body>
                            {ModelErrors ? (
                                <div
                                    style={{ color: "#FE6E00" }}
                                    className="alert alert-danger"
                                >
                                    {ModelErrors}
                                </div>
                            ) : (
                                ""
                            )}
                            <Modal.Footer>

                                <Button variant="secondary" onClick={handleClose}>
                                    Close
                                </Button>
                                <Button variant="primary" onClick={(e) => { sendCurrency(e) }}>
                                    Send
                                </Button>
                            </Modal.Footer>
                        </Modal>

                        <Modal show={showBalance} onHide={handleCloseBalance}>
                            <Modal.Header closeButton>
                                <Modal.Title>Add Balance</Modal.Title>
                            </Modal.Header>
                            <Modal.Body> <div className="transaction-selection-content">
                                <select className="form-select" aria-label="Default select example" value={currency}
                                    onChange={seCurrency}>
                                    <option value="">Select your currency</option>
                                    {currenciesList && currenciesList.length > 0 ?
                                        currenciesList.map((currency, key) => {
                                            return (<option key={key} value={currency?._id} >{currency.name + " " + "-" + " " + currency.symbol}</option>
                                            )
                                        })
                                        : ""}
                                </select>
                                <label className="control-label">Amount</label>
                                <input type="number" className="form-control" onChange={(e) => setAmount(e.target.value)}
                                    name="amount" value={amount} placeholder="Enter amount" />
                            </div>    </Modal.Body>
                            {ModelErrors ? (
                                <div
                                    style={{ color: "#FE6E00" }}
                                    className="alert alert-danger"
                                >
                                    {ModelErrors}
                                </div>
                            ) : (
                                ""
                            )}
                            <Modal.Footer>

                                <Button variant="secondary" onClick={handleCloseBalance}>
                                    Close
                                </Button>
                                <Button variant="primary" onClick={(e) => { addBalanceToAccount(e) }}>
                                    Add
                                </Button>
                            </Modal.Footer>
                        </Modal>

                        <div className="content-box">
                            <div className="d-flex justify-content-between dashboard-localhost-add">
                                <h3>Dashboard</h3>
                            </div>






                            {username == 'Admin' ?
                                <div>
                                    <button className='btn btn-default mb-3' onClick={handleShow}>
                                        Send Amount to User
                                    </button>
                                    <SentAmountToUsers />
                                </div>
                                : ""
                            }
                        </div>
                    </div>
                    {/* </div> */}
                </>
            )}
        </>
    )
}

export default Dashboard