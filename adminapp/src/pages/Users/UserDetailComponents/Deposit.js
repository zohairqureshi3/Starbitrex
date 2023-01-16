import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Form, Modal, Button, Row, Col } from 'react-bootstrap';
import DataTable, { createTheme } from "react-data-table-component";
import { getPermission } from "../../../config/helpers";
import { useForm } from "react-hook-form";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClone, faUndo  } from "@fortawesome/free-solid-svg-icons";
import { toast } from 'react-toastify';
import { addCurrencyAmountToUserAccount, resolveDepositTransaction, revertTransaction } from "../../../redux/users/userActions";
// import { displayUnreadNotifications } from "../../../redux/notifications/notificationActions"
import Swal from 'sweetalert2';
import { listUnreadNotification } from "../../../redux/apiHelper";
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

const Deposit = () => {
    const [filterText, setFilterText] = useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const [currenciesPriceRate, setCurrenciesPriceRate] = useState([]);
    const [loader, setLoader] = useState(false);
    const [user, setUser] = useState("");
    let { id } = useParams();

    const [show, setShow] = useState(false);


    const handleShow = () => setShow(true);


    const dispatch = useDispatch();
    const userData = useSelector((state) => state?.users?.user);
    const currencies = useSelector(state => state.currency?.currencies?.allCurrencies);
    const [userDeposits, setUserDeposits] = useState([]);

    const roleData = useSelector(state => state?.role.role);
    const permissions = roleData[0]?.permissions;
    const permissionName = getPermission(permissions);

    const [addAmountInfo, setAddAmountInfo] = useState("");
    const [addAmountInfoErr, setAddAmountInfoErr] = useState("");
    const [isReal, setIsReal] = useState(3);
    const [isRealErr, setIsRealErr] = useState("");
    const [isResolved, setIsResolved] = useState(3);
    const [isResolvedErr, setIsResolvedErr] = useState("");
    const [balanceType, setBalanceType] = useState(3);
    const [balanceTypeErr, setBalanceTypeErr] = useState("");
    const [currencyAccountSelectedErr, setCurrencyAccountSelectedErr] = useState("");

    const { register: register1, handleSubmit: handleSubmit1, control: control1, reset: reset1, formState: { errors: errors1 } } = useForm();

    const handleClose = () => {
        setShow(false);
        setAddAmountInfo("");
        setIsRealErr("");
        setIsResolvedErr("");
        setBalanceTypeErr("");
        setCurrencyAccountSelectedErr("");
        setIsReal(3);
        setIsResolved(3);
        setBalanceType(3);
        reset1();
    };

    const handleCurrencyAmountSave = async (formData) => {
        let errorsOccured = false;

        if (formData.currencyAccountSelected == 0) {
            setCurrencyAccountSelectedErr("Select currency of transaction");
            errorsOccured = true;
        }

        if (balanceType == 3) {
            setBalanceTypeErr("Select type of transaction");
            errorsOccured = true;
        }

        if (isResolved == 3) {
            setIsResolvedErr("Select status of transaction");
            errorsOccured = true;
        }

        if (isReal == 3) {
            setIsRealErr("Select if transaction is real or fake");
            errorsOccured = true;
        }

        if (!errorsOccured) {
            const data = {
                userId: id,
                currencyId: formData.currencyAccountSelected,
                amount: formData.amountForCurrency,
                additionalInfo: addAmountInfo,
                isReal: isReal,
                isResolved: isResolved,
                balanceType: balanceType,
                addedBy: localStorage.getItem('userId').slice(1, -1)
            };
            await dispatch(addCurrencyAmountToUserAccount(data));
            // await dispatch(displayUnreadNotifications());
            await listUnreadNotification();
            setAddAmountInfo("");
            handleClose();
        }
    };

    const addCurrencyAmount = {
        currencyAccountSelected: {
            required: "Please select currency"
        },
        amountForCurrency: {
            required: "Amount is required",
            pattern: {
                value: /^[0-9]\d*(\.\d+)?$/,
                message: 'Only numbers and decimals are allowed',
            }
        }
    };

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
    };

    const getRateInUsdt = (coin_symbol, amount) => {
        if (currenciesPriceRate) {
            let total_in_usdt = parseFloat(parseFloat((1 / currenciesPriceRate[coin_symbol == 'USDT' ? 'USD' : coin_symbol])) * parseFloat(amount));

            if (!isNaN(total_in_usdt)) {
                return total_in_usdt
            }
            else {
                return null;
            }
        }
        else {
            return '-'
        }
    };

    const copyReferral = () => {
        toast.success('Successfully copied!');
    }

    const handleClear = () => {
        if (filterText) {
            setResetPaginationToggle(!resetPaginationToggle);
            setFilterText('');
        }
    };

    const subHeaderComponentMemo = useMemo(() => {

        return (
            <>
                <input
                    id="search"
                    type="text"
                    className='w-25 form-control'
                    placeholder="Search here..."
                    aria-label="Search Input"
                    value={filterText}
                    onChange={e => setFilterText(e.target.value)}
                />
                <button type="button" className='btn btn-primary' onClick={handleClear}>Clear</button>
            </>
        );
    }, [filterText, resetPaginationToggle]);

    useEffect(async () => {
        setLoader(true);
        setUser(userData);
        if (userData?.externalTransactions || userData?.adminTransactions) {
            const deposits = userData?.externalTransactions?.filter(row => row.transactionType != true);
            const adminDeposits = userData?.adminTransactions?.filter(row => row.transactionType != true);

            let newDeposits1 = [];
            let newDeposits2 = [];
            if (deposits?.length > 0) {
                newDeposits1 = deposits;
            }
            if (adminDeposits?.length > 0) {
                newDeposits2 = adminDeposits;
            }
            // Merge admin deposits and blockchain deposits into one state
            setUserDeposits([...newDeposits1, ...newDeposits2]);
        }

    }, [userData]);

    const resolveCurrentDepositTransaction = async (row, status) => {
        Swal.fire({
            title: `Are you sure you want to ${status === 1 ? 'Approve' : 'Decline'} it?`,
            input: 'textarea',
            inputPlaceholder: 'Enter information/comment...',
            inputValue: row?.additionalInfo ? row?.additionalInfo : '',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: "Yes"
        }).then(async (result) => {
            if (result.isConfirmed == true ? true : false) {
                const data = { userId: id, resolvedStatus: status, additionalInfo: result.value ? result.value : '' };
                await dispatch(resolveDepositTransaction(row?._id, data))
            }
        })
    }

    const handleRevertTransaction = async (row) => {
        Swal.fire({
            title: `Are you sure you want to Revert the transaction?`,
            html: '',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: "Yes"
        }).then((result) => {
            if (result.isConfirmed === true) {
                const data = { userId: id};
                dispatch(revertTransaction(row?._id, data));
            }
        })
    }

    const depositColumns = [
        {
            name: 'Received At',
            selector: row => formatDate(new Date(row?.createdAt)),
            sortable: true,
            minWidth: '200px'
        },
        {
            name: 'Asset',
            selector: row => row?.currency,
            sortable: true
        },
        {
            name: 'Amount',
            selector: row => row?.amount,
            sortable: true,
            minWidth: '150px'
        },
        {
            name: 'In USD',
            selector: row => parseFloat(row?.amount).toFixed(2),
            cell: (row) => {
                let usdtValue = getRateInUsdt(row?.currency, row?.amount);
                if (usdtValue) {
                    return (currencyFormatter.format(usdtValue.toFixed(2), { code: 'USD' }));
                }
                else {
                    return '-'
                }

            },
            sortable: true,
            minWidth: '150px'
        },
        {
            name: 'From',
            selector: row => "Deposit",
            sortable: true,
            minWidth: '200px'
        },
        {
            name: 'To',
            selector: row => {
                return (
                    <>
                        {row?.walletAddress ?
                            <CopyToClipboard text={row?.walletAddress}>
                                <span>
                                    {row?.walletAddress.slice(0, 4)}...{row?.walletAddress.slice(row?.walletAddress.length - 4, row?.walletAddress.length)}
                                    <FontAwesomeIcon icon={faClone} onClick={() => copyReferral()} className="ms-2" />
                                </span>
                            </CopyToClipboard> : '-'
                        }
                    </>
                );
            },
            minWidth: '200px'
        },
        {
            name: 'Account#',
            selector: row => {
                return (
                    <>
                        <CopyToClipboard text={row?.account?._id}>
                            <span>
                                {row?.account?._id?.slice(0, 4)}...{row?.account?._id?.slice(row?.account?._id?.length - 4, row?.account?._id?.length)}
                                <FontAwesomeIcon icon={faClone} onClick={() => copyReferral()} className="ms-2" />
                            </span>
                        </CopyToClipboard>
                    </>
                );
            },
            minWidth: '200px'
        },
        {
            name: 'Deposit Type',
            selector: row => (row?.transactionRequestBy === true ? 'Real' : 'Fake'),
            sortable: true
        },
        {
            name: 'Status',
            selector: row => {
                return (
                    <>
                        {row?.isResolved == 0 ?
                            <span className="badge rounded-pill bg-warning">Pending</span>
                            : row?.isResolved == 1 ?
                                <span className="badge rounded-pill bg-success">Completed</span>
                                :
                                <span className="badge rounded-pill bg-danger">Declined</span>
                        }
                    </>
                );
            }
        },
        {
            name: 'Action',
            selector: row => {
                return (
                    <>
                        {row?.isResolved == 0 ?
                            <>
                                <button className="btn btn-success btn-sm me-1 p-1" onClick={() => resolveCurrentDepositTransaction(row, 1)}>Accept</button>
                                <button className="btn btn-danger btn-sm me-1 p-1" onClick={() => resolveCurrentDepositTransaction(row, 2)}>Decline</button>
                            </>
                            :
                            ( row?.isResolved == 1 ? 
                                <button className="btn btn-danger btn-sm me-1 p-1" onClick={() => handleRevertTransaction(row)}><FontAwesomeIcon icon={faUndo} className="header-icon text-white" /></button>
                            : <span>-</span>)
                        }

                    </>
                );
            },
            minWidth: '200px'
        }
    ]


    return (
        <>
            <div className="tab-pane fade" id="deposits">
                {
                    permissionName && permissionName.length > 0 && permissionName.includes('add_amount_to_user') ?
                        <>
                            <Button className="btn btn-default mb-5" onClick={handleShow}>
                                Add Deposit
                            </Button>
                            <Modal show={show} onHide={handleClose} className="widthdrawal-modal">
                                <Modal.Header closeButton>
                                    <Modal.Title className="text-white">ADD DEPOSIT</Modal.Title>
                                </Modal.Header>
                                <form onSubmit={handleSubmit1(handleCurrencyAmountSave)} className="account-balance-currency me-0">
                                    {/* <div className="row">
                                <div className="col-lg-6">
                                    <div className="form-group me-2">
                                        <label className="control-label">Amount</label>
                                        <div className="input-wrapper">
                                            <input type="text" className="form-control" placeholder="Enter amount"
                                                {...register1('amountForCurrency', addCurrencyAmount?.amountForCurrency)} name='amountForCurrency' defaultValue='' control={control1} />
                                            {errors1?.amountForCurrency && <span className="errMsg">{errors1?.amountForCurrency?.message}</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-sm-12">
                                    <div className="form-group me-2 ">
                                        <label className="control-label">Select Currency</label>
                                        <div className="input-wrapper">
                                            <Form.Select name="currencyAccountSelected" {...register1('currencyAccountSelected', addCurrencyAmount.currencyAccountSelected)}>
                                                <option value="">Select Currency</option>
                                                {currencies && currencies.length > 0 && currencies.map((currency) => {
                                                    return (
                                                        <option value={currency._id} key={currency._id}>{currency.name}</option>
                                                    )
                                                })}
                                            </Form.Select>
                                            {errors1?.currencyAccountSelected && <span className="errMsg">{errors1.currencyAccountSelected.message}</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-12 col-sm-12">
                                    <div className="form-group custom-text-area">
                                        <label className="control-label">Info</label>
                                        <textarea className="form-control" id="exampleFormControlTextarea1" placeholder="Type info...." rows="3" name="addAmountInfo" value={addAmountInfo} onChange={(event) => setAddAmountInfo(event.target.value)}></textarea>
                                        {addAmountInfoErr ? (<span className="errMsg">{addAmountInfoErr}</span>) : ("")}
                                    </div>
                                </div>
                            </div>
                            <button className="btn btn-default" type="submit">Add Amount</button> */}



                                    <Modal.Body>
                                        <div className="withdrawal-data">
                                            <Row>
                                                <Col md={6}>
                                                    <div className="form-group me-2">
                                                        <label className="control-label mb-2">Amount</label>
                                                        <div className="input-wrapper">
                                                            <input type="text" className="form-control" placeholder="Enter amount"
                                                                {...register1('amountForCurrency', addCurrencyAmount?.amountForCurrency)} name='amountForCurrency' defaultValue='' control={control1} />
                                                            {errors1?.amountForCurrency && <span className="errMsg">{errors1?.amountForCurrency?.message}</span>}
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md={6}>
                                                    <div className="form-group me-2">
                                                        <label className="control-label mb-2">Currency</label>
                                                        <div className="input-wrapper">
                                                            <Form.Select name="currencyAccountSelected" {...register1('currencyAccountSelected', addCurrencyAmount.currencyAccountSelected)} defaultValue='0' control={control1}>
                                                                <option value="0">Select Currency</option>
                                                                {currencies && currencies.length > 0 && currencies.map((currency) => {
                                                                    return (
                                                                        <option value={currency._id} key={currency._id}>{currency.name}</option>
                                                                    )
                                                                })}
                                                            </Form.Select>
                                                            {errors1?.currencyAccountSelected && <span className="errMsg">{errors1.currencyAccountSelected.message}</span>}
                                                            {currencyAccountSelectedErr ? (<span className="errMsg">{currencyAccountSelectedErr}</span>) : ("")}
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md={6}>
                                                    <div className="form-group me-2">
                                                        <label className="control-label mb-2">Type</label>
                                                        <div className="input-wrapper">
                                                            <Form.Select name="balanceType" value={balanceType} onChange={(event) => setBalanceType(event.target.value)}>
                                                                <option value="3">Select Type</option>
                                                                <option value="0">Balance</option>
                                                                <option value="1">Credit</option>
                                                            </Form.Select>
                                                            {balanceTypeErr ? (<span className="errMsg">{balanceTypeErr}</span>) : ("")}
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md={6}>
                                                    <div className="form-group me-2">
                                                        <label className="control-label mb-2">Status</label>
                                                        <div className="input-wrapper">
                                                            <Form.Select name="isResolved" value={isResolved} onChange={(event) => setIsResolved(event.target.value)}>
                                                                <option value="3">Select Type</option>
                                                                <option value="0">Pending</option>
                                                                <option value="1">Approved</option>
                                                                <option value="2">Declined</option>
                                                            </Form.Select>
                                                            {isResolvedErr ? (<span className="errMsg">{isResolvedErr}</span>) : ("")}
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md={6}>
                                                    <div className="form-group me-2">
                                                        <label className="control-label mb-2">Real</label>
                                                        <div className="input-wrapper">
                                                            <Form.Select name="isReal" value={isReal} onChange={(event) => setIsReal(event.target.value)}>
                                                                <option value="3">Select Transactions </option>
                                                                <option value="0">Real</option>
                                                                <option value="1">Fake</option>
                                                            </Form.Select>
                                                            {isRealErr ? (<span className="errMsg">{isRealErr}</span>) : ("")}
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md={6}>
                                                    <div className="form-group me-2">
                                                        <label className="control-label mb-2">Info</label>
                                                        <div className="input-wrapper">
                                                            <input type="text" className="form-control" name="addAmountInfo" value={addAmountInfo} onChange={(event) => setAddAmountInfo(event.target.value)} />
                                                            {addAmountInfoErr ? (<span className="errMsg">{addAmountInfoErr}</span>) : ("")}
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={handleClose}>
                                            Close
                                        </Button>
                                        <Button variant="primary" type="submit">
                                            Save Changes
                                        </Button>
                                    </Modal.Footer>
                                </form>
                            </Modal>

                        </>


                        : null
                }


                <div className='table-responsive'>
                    {userDeposits && userDeposits.length ?
                        <DataTable
                            columns={depositColumns}
                            data={
                                userDeposits.filter(row => (row.currency?.toLowerCase()?.includes(filterText.toLowerCase()) || row.amount?.toLowerCase()?.includes(filterText.toLowerCase()) ||
                                    row.walletAddress?.toLowerCase()?.includes(filterText.toLowerCase()) || row.account?._id?.toLowerCase()?.includes(filterText.toLowerCase())))
                            }
                            pagination
                            paginationResetDefaultPage={resetPaginationToggle}
                            subHeader
                            subHeaderComponent={subHeaderComponentMemo}
                            fixedHeader
                            persistTableHead
                            theme="solarizedd"
                        />
                        :
                        <tr >
                            <td colSpan="7" >No Transactions Found!</td>
                        </tr>
                    }
                </div>
            </div>
        </>
    )
}

export default Deposit