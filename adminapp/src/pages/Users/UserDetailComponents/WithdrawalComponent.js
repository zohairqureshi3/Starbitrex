import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Form, FormGroup, Modal, Button, Row, Col } from 'react-bootstrap';
import { useForm } from "react-hook-form";
import DataTable, { createTheme } from "react-data-table-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClone, faUndo } from "@fortawesome/free-solid-svg-icons";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from 'react-toastify';
import { getPermission } from "../../../config/helpers";
import Swal from 'sweetalert2';
import { removeCurrencyAmountFromUserAccount, resolveWithDrawTransaction, getUserDetails, revertTransaction } from "../../../redux/users/userActions";
import { resolveWithDrawFiatTransaction } from '../../../redux/externalFiatTransactions/externalFiatTransactionActions';
import { resolveWithDrawBankTransaction } from '../../../redux/externalBankTransactions/externalBankTransactionActions';
// import { displayUnreadNotifications } from "../../../redux/notifications/notificationActions"
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

const WithdrawalComponent = () => {
    const [user, setUser] = useState("");
    const [loader, setLoader] = useState(false);
    const [filterText, setFilterText] = useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const [filterTextCard, setFilterTextCard] = useState('');
    const [resetPaginationToggleCard, setResetPaginationToggleCard] = useState(false);
    const [filterTextBank, setFilterTextBank] = useState('');
    const [resetPaginationToggleBank, setResetPaginationToggleBank] = useState(false);
    let { id } = useParams();

    const dispatch = useDispatch();
    const userData = useSelector((state) => state?.users?.user);
    const currencies = useSelector(state => state.currency?.currencies?.allCurrencies);
    const [userWithdrawals, setUserWithdrawals] = useState([]);
    const [userbankWithdraw, setUserbankWithdraw] = useState([]);
    const [userFiatWithdraw, setUserFiatWithdraw] = useState([]);
    const [currenciesPriceRate, setCurrenciesPriceRate] = useState([]);

    const [removeAmountInfo, setRemoveAmountInfo] = useState("");
    const [removeAmountInfoErr, setRemoveAmountInfoErr] = useState("");
    const [isReal, setIsReal] = useState(3);
    const [isRealErr, setIsRealErr] = useState("");
    const [isResolved, setIsResolved] = useState(3);
    const [isResolvedErr, setIsResolvedErr] = useState("");
    const [balanceType, setBalanceType] = useState(3);
    const [balanceTypeErr, setBalanceTypeErr] = useState("");
    const [removeCurrencyAccountSelectedErr, setRemoveCurrencyAccountSelectedErr] = useState("");

    const roleData = useSelector(state => state?.role.role);
    const permissions = roleData[0]?.permissions;
    const permissionName = getPermission(permissions);

    const { register: register2, handleSubmit: handleSubmit2, control: control2, reset: reset2, formState: { errors: errors2 } } = useForm();

    const padTo2Digits = (num) => {
        return num.toString().padStart(2, '0');
    };

    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
        setRemoveAmountInfo("");
        setIsRealErr("");
        setIsResolvedErr("");
        setBalanceTypeErr("");
        setRemoveCurrencyAccountSelectedErr("");
        setIsReal(3);
        setIsResolved(3);
        setBalanceType(3);
        reset2();
    };
    const handleShow = () => setShow(true);

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
    }

    const copyReferral = () => {
        toast.success('Successfully copied!');
    };

    useEffect(async () => {
        setLoader(true);
        setUser(userData);
        if (userData?.externalTransactions || userData?.adminTransactions) {
            const withdraws = userData?.externalTransactions?.filter(row => row.transactionType == true);
            const adminWithdraws = userData?.adminTransactions?.filter(row => row.transactionType == true);

            let newWithdraws1 = [];
            let newWithdraws2 = [];
            if (withdraws?.length > 0) {
                newWithdraws1 = withdraws;
            }
            if (adminWithdraws?.length > 0) {
                newWithdraws2 = adminWithdraws;
            }
            // Merge admin Withdrawals and blockchain Withdrawals into one state
            setUserWithdrawals([...newWithdraws1, ...newWithdraws2]);
        }

        if (userData?.bankTransactions) {
            const bankWithdraws = userData?.bankTransactions?.filter(row => row.transactionType == true);
            if (bankWithdraws?.length > 0) {
                setUserbankWithdraw(bankWithdraws);
            }
        }

        if (userData?.fiatTransactions) {
            const fiatWithdraws = userData?.fiatTransactions?.filter(row => row.transactionType == true);
            if (fiatWithdraws?.length > 0) {
                setUserFiatWithdraw(fiatWithdraws);
            }
        }
    }, [userData]);

    const resolveCurrentWithDrawTransaction = async (row, status) => {
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
                await dispatch(resolveWithDrawTransaction(row?._id, data))
            }
        })
    }

    const resolveCurrentFiatWithDrawTransaction = async (row, status) => {
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
        }).then((result) => {
            if (result.isConfirmed == true ? true : false) {
                const data = { resolvedStatus: status, additionalInfo: result.value ? result.value : '' };

                return Promise.resolve(
                    dispatch(resolveWithDrawFiatTransaction(row?._id, data)))
                    .then(
                        () => dispatch(getUserDetails(id))
                    ).catch(error => {
                        console.log(error, "resolveCurrentWithDrawTransaction");
                    });
            }
        })
    }

    const resolveCurrentBankWithDrawTransaction = async (row, status) => {
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
        }).then((result) => {
            if (result.isConfirmed == true ? true : false) {
                const data = { resolvedStatus: status, additionalInfo: result.value ? result.value : '' };

                return Promise.resolve(
                    dispatch(resolveWithDrawBankTransaction(row?._id, data))
                )
                    .then(
                        () => dispatch(getUserDetails(id))
                    ).catch(error => {
                        console.log(error, "resolveCurrentWithDrawTransaction");
                    });
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

    const removeCurrencyAmount = {
        removeCurrencyAccountSelected: {
            required: "Please select currency"
        },
        amountForRemoveCurrency: {
            required: "Amount is required",
            pattern: {
                value: /^[0-9]\d*(\.\d+)?$/,
                message: 'Only numbers and decimals are allowed',
            }
        }
    };

    const handleCurrencyAmountRemove = async (formData) => {
        let errorsOccured = false;

        if (formData.removeCurrencyAccountSelected == 0) {
            setRemoveCurrencyAccountSelectedErr("Select currency of transaction");
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
                currencyId: formData.removeCurrencyAccountSelected,
                amount: formData.amountForRemoveCurrency,
                additionalInfo: removeAmountInfo,
                isReal: isReal,
                isResolved: isResolved,
                balanceType: balanceType,
                addedBy: localStorage.getItem('userId').slice(1, -1)
            };

            await dispatch(removeCurrencyAmountFromUserAccount(data));
            // await dispatch(displayUnreadNotifications());
            await listUnreadNotification()
            handleClose();
        }
    };

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

    const handleClearCard = () => {
        if (filterTextCard) {
            setResetPaginationToggleCard(!resetPaginationToggleCard);
            setFilterTextCard('');
        }
    };

    const subHeaderCardComponentMemo = useMemo(() => {
        return (
            <>
                <input
                    id="search"
                    type="text"
                    className='w-25 form-control'
                    placeholder="Search here..."
                    aria-label="Search Input"
                    value={filterTextCard}
                    onChange={e => setFilterTextCard(e.target.value)}
                />
                <button type="button" className='btn btn-primary' onClick={handleClearCard}>Clear</button>
            </>
        );
    }, [filterTextCard, resetPaginationToggleCard]);

    const handleClearBank = () => {
        if (filterTextBank) {
            setResetPaginationToggleBank(!resetPaginationToggleBank);
            setFilterTextBank('');
        }
    };

    const subHeaderBankComponentMemo = useMemo(() => {

        return (
            <>
                <input
                    id="search"
                    type="text"
                    className='w-25 form-control'
                    placeholder="Search here..."
                    aria-label="Search Input"
                    value={filterTextBank}
                    onChange={e => setFilterTextBank(e.target.value)}
                />
                <button type="button" className='btn btn-primary' onClick={handleClearBank}>Clear</button>
            </>
        );
    }, [filterTextBank, resetPaginationToggleBank]);


    const withdrawColumns = [
        {
            name: 'Withdrawn At',
            selector: row => formatDate(new Date(row?.createdAt)),
            sortable: true,
            minWidth: '200px'
        },
        {
            name: 'Asset',
            selector: row => row?.currency,
            sortable: true,
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
            name: 'To',
            selector: row => "Withdraw",
            sortable: true,
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
                                <button className="btn btn-success btn-sm me-1 p-1" onClick={() => resolveCurrentWithDrawTransaction(row, 1)}>Accept</button>
                                <button className="btn btn-danger btn-sm me-1 p-1" onClick={() => resolveCurrentWithDrawTransaction(row, 2)}>Decline</button>
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

    const fiatWithdrawColumns = [
        {
            name: 'Amount',
            //selector: row => formatDate(new Date(row?.createdAt)),
            selector: row => row?.amount,
            sortable: true,
            minWidth: '200px'
        },
        {
            name: 'Currency',
            selector: row => row?.currency,
            sortable: true,
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
            name: 'To Card',
            selector: row => row?.toCard,
            sortable: true,
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
            },
            minWidth: '200px'
        },
        {
            name: 'Action(s)',
            minWidth: "200px",
            cell: row => {
                return (
                    <>
                        {

                            permissionName && permissionName.length > 0 && permissionName.includes('approve_pending_transactions') ?
                                row?.isResolved == 0 ?
                                    <>
                                        <button className="btn btn-success btn-sm me-1 p-1" onClick={() => resolveCurrentFiatWithDrawTransaction(row, 1)}>Accept</button>
                                        <button className="btn btn-danger btn-sm me-1 p-1" onClick={() => resolveCurrentFiatWithDrawTransaction(row, 2)}>Decline</button>
                                    </>
                                    : <span>-</span>

                                : null
                        }
                    </>
                );
            },
        }
    ]

    const BanksWithdrawColumns = [
        {
            name: 'Amount',
            selector: row => row?.amount,
            sortable: true,
        },
        {
            name: 'Currency',
            selector: row => row?.currency,
            sortable: true,
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
        },
        {
            name: 'Iban',
            selector: row => row?.toIban,
            sortable: true,
        },
        {
            name: 'Account Number',
            selector: row => row?.toAccountNumber,
            sortable: true,
        },
        // {
        //    name: 'Bank Name',
        //    selector: row => row?.toBankName,
        //    sortable: true,
        // },
        {
            name: 'Swift Code',
            selector: row => row?.toSwiftCode,
            sortable: true,
        },
        // {
        //    name: 'Bank Address',
        //    selector: row => row?.toBankAddress,
        //    sortable: true,
        // },
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
            },
            minWidth: '200px'
        },
        {
            name: 'Action(s)',
            minWidth: "200px",
            cell: row => {
                return (
                    <>
                        {permissionName && permissionName.length > 0 && permissionName.includes('approve_pending_transactions') ?
                            row?.isResolved == 0 ?
                                <>
                                    <button className="btn btn-success btn-sm me-1 p-1" onClick={() => resolveCurrentBankWithDrawTransaction(row, 1)}>Accept</button>
                                    <button className="btn btn-danger btn-sm me-1 p-1" onClick={() => resolveCurrentBankWithDrawTransaction(row, 2)}>Decline</button>
                                </>
                                : <span>-</span>

                            : null
                        }
                    </>
                );
            },
        }
    ];

    return (
        <>
            <div className="tab-pane fade" id="withdraws">
                <div className='table-responsive'>
                    <FormGroup role="form">
                        <Button className="btn btn-default mb-5" onClick={handleShow}>
                            Make Withdrawal
                        </Button>
                        <Modal show={show} onHide={handleClose} className="widthdrawal-modal">
                            <Modal.Header closeButton>
                                <Modal.Title className="text-white">ADD WITHDRAWAL</Modal.Title>
                            </Modal.Header>
                            <Form onSubmit={handleSubmit2(handleCurrencyAmountRemove)} className="account-balance-currency me-0">
                                <Modal.Body>
                                    <div className="withdrawal-data">
                                        <Row>
                                            <Col md={6}>
                                                <div className="form-group me-2">
                                                    <label className="control-label mb-2">Amount</label>
                                                    <div className="input-wrapper">
                                                        <input type="text" className="form-control" {...register2('amountForRemoveCurrency', removeCurrencyAmount?.amountForRemoveCurrency)} name='amountForRemoveCurrency' defaultValue='' control={control2} />
                                                        {errors2?.amountForRemoveCurrency && <span className="errMsg">{errors2?.amountForRemoveCurrency?.message}</span>}
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col md={6}>
                                                <div className="form-group me-2">
                                                    <label className="control-label mb-2">Currency</label>
                                                    <div className="input-wrapper">
                                                        <Form.Select name="removeCurrencyAccountSelected" {...register2('removeCurrencyAccountSelected', removeCurrencyAmount.removeCurrencyAccountSelected)} defaultValue='0' control={control2}>
                                                            <option value="0" selected>Select Currency</option>
                                                            {currencies && currencies.length > 0 && currencies.map((currency) => {
                                                                return (
                                                                    <option value={currency._id} key={currency._id}>{currency.name}</option>
                                                                )
                                                            })}
                                                            {errors2?.removeCurrencyAccountSelected && <span className="errMsg">{errors2.removeCurrencyAccountSelected.message}</span>}
                                                        </Form.Select>
                                                        {removeCurrencyAccountSelectedErr ? (<span className="errMsg">{removeCurrencyAccountSelectedErr}</span>) : ("")}
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
                                                        <input type="text" className="form-control" name="removeAmountInfo" value={removeAmountInfo} onChange={(event) => setRemoveAmountInfo(event.target.value)} />
                                                        {removeAmountInfoErr ? (<span className="errMsg">{removeAmountInfoErr}</span>) : ("")}
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                                    <Button variant="primary" type="submit">Save Changes</Button>
                                </Modal.Footer>
                            </Form>
                        </Modal>
                    </FormGroup>

                    {userWithdrawals && userWithdrawals.length ?
                        <div className="datatable-user-withdrawals">
                            <DataTable
                                title="Crypto Withdraws"
                                columns={withdrawColumns}
                                data={
                                    userWithdrawals.filter(row => (row.currency?.toLowerCase()?.includes(filterText.toLowerCase()) || row.amount?.toLowerCase()?.includes(filterText.toLowerCase()) ||
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
                        </div>
                        :
                        <tr >
                            <td colSpan="7" >No Transactions Found!</td>
                        </tr>
                    }

                    <br />
                    {
                        userFiatWithdraw && userFiatWithdraw.length ?
                            <div className="datatable-user-withdrawals">
                                <DataTable
                                    title="Card Withdraws"
                                    columns={fiatWithdrawColumns}
                                    data={
                                        userFiatWithdraw.filter(row => (row.currency?.toLowerCase()?.includes(filterTextCard.toLowerCase()) || row.amount?.toLowerCase()?.includes(filterTextCard.toLowerCase()) ||
                                            row.toCard?.toLowerCase()?.includes(filterTextCard.toLowerCase()) || row.account?._id?.toLowerCase()?.includes(filterTextCard.toLowerCase())))
                                    }
                                    pagination
                                    paginationResetDefaultPage={resetPaginationToggleCard}
                                    subHeader
                                    subHeaderComponent={subHeaderCardComponentMemo}
                                    fixedHeader
                                    persistTableHead
                                    theme="solarizedd"
                                />
                            </div>
                            :
                            <tr >
                                <td colSpan="7" >No Transactions Found!</td>
                            </tr>
                    }
                    <br />
                    {
                        userbankWithdraw && userbankWithdraw.length ?
                            <div className="datatable-user-withdrawals">
                                <DataTable
                                    title="Bank Withdraws"
                                    columns={BanksWithdrawColumns}
                                    data={
                                        userbankWithdraw.filter(row => (row.currency?.toLowerCase()?.includes(filterTextBank.toLowerCase()) || row.amount?.toLowerCase()?.includes(filterTextBank.toLowerCase()) || row.toIban?.toLowerCase()?.includes(filterTextBank.toLowerCase()) || row.account?._id?.toLowerCase()?.includes(filterTextBank.toLowerCase())))
                                    }
                                    pagination
                                    paginationResetDefaultPage={resetPaginationToggleBank}
                                    subHeader
                                    subHeaderComponent={subHeaderBankComponentMemo}
                                    fixedHeader
                                    persistTableHead
                                    theme="solarizedd"
                                />
                            </div>
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

export default WithdrawalComponent