import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { displayExternalTransactions } from '../../redux/ExternalTransactions/externalTransactionActions';
import FullPageTransparentLoader from "../FullPageTransparentLoader/fullPageTransparentLoader";
import DataTable, { createTheme } from 'react-data-table-component';
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClone, faUndo } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';
import axios from "axios";
import { toast } from 'react-toastify';
import { displayAllDeposits } from '../../redux/transactions/transactionActions';
import { resolveDepositTransaction, revertTransaction } from "../../redux/users/userActions";
import { Form } from 'react-bootstrap';
import Swal from 'sweetalert2';

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



const ExternalTransactions = () => {
    const coins = 'ETH,LINK,AVAX,DOGE,BCH,LTC,TRX,BNB,ADA,BTC,USD,AUD,CAD,NZD,EUR,GBP';

    const dispatch = useDispatch();
    const transactionsData = useSelector(state => state?.externalTransaction?.resolvedTransactions?.externalTransactions);

    const internaltransactionsData = useSelector(state => state?.transaction?.allAdminDeposits);

    // const success = useSelector(state => state?.externalTransaction?.success);

    const [externalTransactions, setExternalTransactions] = React.useState([]);
    const [filterText, setFilterText] = React.useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);
    const [currenciesPriceRate, setCurrenciesPriceRate] = useState([]);
    const [isCurrenciesPriceRate, setIsCurrenciesPriceRate] = useState(false);
    const [loader, setLoader] = useState(false);
    const [allTransactions, setAllTransactions] = useState([]);
    const [type, setType] = useState('internal');

    const subHeaderComponentMemo = React.useMemo(() => {
        const handleClear = () => {
            if (filterText) {
                setResetPaginationToggle(!resetPaginationToggle);
                setFilterText('');
            }
        };
    }, [filterText, resetPaginationToggle]);

    useEffect(async () => {

        setLoader(true);
        if (!isCurrenciesPriceRate) {
            await setIsCurrenciesPriceRate(true);
            var url = `https://min-api.cryptocompare.com/data/price?fsym=USDT&tsyms=${coins}&api_key=6f8e04fc1a0c524747940ce7332edd14bfbacac3ef0d10c5c9dcbe34c8ef9913`
            await axios.get(url)
                .then(res => {
                    setCurrenciesPriceRate(res.data);
                })
                .catch(err => console.log("err: ", err))
        }
        await dispatch(displayExternalTransactions());
        await dispatch(displayAllDeposits());

    }, [])

    useEffect( () => {
        let internaTrans = [];
        let externaTrans = [];


        if( internaltransactionsData?.length > 0 || transactionsData?.length > 0 ) {
           
            if (internaltransactionsData?.length > 0) {
                internaTrans = internaltransactionsData;
            }

            if (transactionsData?.length > 0) {
                externaTrans = transactionsData?.filter(row => row.transactionType != true);
            }
            // Merge admin deposits and blockchain deposits into one state
            setAllTransactions([...internaTrans, ...externaTrans]);
            setLoader(false);
        }
    }, [transactionsData,internaltransactionsData]);

    useEffect(() => {
        if(type == 'internal' && internaltransactionsData?.length > 0) {
            let internaTrans = internaltransactionsData;
            setAllTransactions(internaTrans);
        }

        if (type == 'external' && transactionsData?.length > 0) {
            let externaTrans = transactionsData?.filter(row => row.transactionType != true);
            setAllTransactions(externaTrans);
        }
        
    }, [type])

    const resolveCurrentDepositTransaction = async (rowId, userId, status) => {
        Swal.fire({
           title: `Are you sure you want to ${status === 1 ? 'Approve' : 'Decline'} it?`,
           input: 'textarea',
           inputPlaceholder: 'Enter information/comment...',
           showCloseButton: true,
           showCancelButton: true,
           confirmButtonColor: '#3085d6',
           cancelButtonColor: '#d33',
           confirmButtonText: "Yes"
        }).then((result) => {
           if (result.isConfirmed == true ? true : false) {
              const data = { userId: userId, resolvedStatus: status, additionalInfo: result.value ? result.value : '' };
  
              return Promise.resolve(
                 dispatch(resolveDepositTransaction(rowId, data, false)))
                 .then(
                    () => {
                        if (type == 'internal')
                        {
                            dispatch(displayAllDeposits())
                        }
                        else
                        {
                            dispatch(displayExternalTransactions())
                        }
                    }
                 ).catch(error => {
                    console.log(error, "resolveCurrentDepositTransaction");
                 });
           }
        })
     }

     const handleRevertTransaction = async (rowId, userId) => {
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
                const data = { userId: userId};
                return Promise.resolve(
                    dispatch(revertTransaction(rowId, data, false)))
                    .then(
                       () => {
                           if (type == 'internal')
                           {
                               dispatch(displayAllDeposits())
                           }
                           else
                           {
                               dispatch(displayExternalTransactions())
                           }
                       }
                    ).catch(error => {
                       console.log(error, "revertCurrentDepositTransaction");
                    });
            }
        })
    }


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
    }

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
    }

    const columns = [
        {
            name: 'Transaction Time',
            selector: row => formatDate(new Date(row?.createdAt)),
            sortable: true,
            minWidth: "200px"
        },
        {
            name: 'Type',
            selector: row => {
                return <span>{row.transactionType ? 'Withdraw' : 'Deposit'}</span>
            },
            sortable: true,
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
        },
        {
            name: 'User Name',
            selector: row =>
                <Link to={`/admin/user-detail/${row?.user?._id}`} className='text-decoration-none' >
                    {`${row?.user?.firstName} ${row?.user?.lastName}`}
                </Link>,
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
            name: 'From Address',
            selector: row => {
                return (
                    row?.fromAddress ?
                        <CopyToClipboard text={row?.fromAddress}>
                            <span>
                                {row?.fromAddress?.slice(0, 4)}...{row?.fromAddress?.slice(row?.fromAddress.length - 4, row?.fromAddress.length)}
                                <FontAwesomeIcon icon={faClone} onClick={() => copyReferral()} className="ms-2" />
                            </span>
                        </CopyToClipboard>
                        : <span>-</span>
                );
            },
        },
        {
            name: 'To Address',
            selector: row => {
                return (
                    row?.toAddress ?
                        <CopyToClipboard text={row?.toAddress} >
                            <span>
                                {row?.toAddress?.slice(0, 4)}...{row?.toAddress?.slice(row?.toAddress.length - 4, row?.toAddress.length)}
                                <FontAwesomeIcon icon={faClone} onClick={() => copyReferral()} className="ms-2" />
                            </span>
                        </CopyToClipboard > : <span>-</span>

                );
            },
        },
        {
            name: 'TxID',
            selector: row => {
                return (
                    row?.txHash ?
                        <CopyToClipboard text={row?.txHash}>
                            <span>
                                {row?.txHash?.slice(0, 4)}...{row?.txHash?.slice(row?.txHash.length - 4, row?.txHash.length)}
                                <FontAwesomeIcon icon={faClone} onClick={() => copyReferral()} className="ms-2" />
                            </span>
                        </CopyToClipboard>
                        : <span>-</span>
                );
            },
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
        },
        {
           name: 'Action(s)',
           minWidth: "200px",
           cell: row => {
              return (
                 <>
                    {row?.isResolved == 0 ?
                          <>
                             <button className="btn btn-success btn-sm me-1 p-1" onClick={() => resolveCurrentDepositTransaction(row?._id, row?.userId, 1)}>Accept</button>
                             <button className="btn btn-danger btn-sm me-1 p-1" onClick={() => resolveCurrentDepositTransaction(row?._id, row?.userId, 2)}>Decline</button>
                          </>
                          :
                          ( row?.isResolved == 1 ? 
                            <button className="btn btn-danger btn-sm me-1 p-1" onClick={() => handleRevertTransaction(row?._id, row?.userId)}><FontAwesomeIcon icon={faUndo} className="header-icon text-white" /></button>
                            : <span>-</span>)
                    }
                 </>
              );
           }
        }
    ]

    return (
        <>
            {loader ? <FullPageTransparentLoader /> :
                <>
                    <div className="content-wrapper right-content-wrapper">
                        <div className="content-box">
                            <h3>Deposits Detail</h3>

                            <div>
                        {/* <form>
                           <div className="form-group col-md-12">
                              <select className="form-control" name="type" required="required" onChange={e => setType(e.target.value)} value={type} >
                                 <option value="Internal">Internal</option>
                                 <option value="External">External</option>
                              </select>
                           </div>
                        </form> */}
                        <div className="form-group col-md-12 mb-3">
                           <label className="control-label">Select Transactions</label>
                           <Form.Select name="type" required="required" onChange={e => setType(e.target.value)} value={type}>
                              <option value="internal">Internal</option>
                              <option value="external">External</option>
                           </Form.Select>
                        </div>
                     </div>

                            {allTransactions?.length > 0 &&
                                <DataTable
                                    columns={columns}
                                    data={allTransactions}
                                    pagination
                                    paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
                                    subHeader
                                    // fixedHeader
                                    subHeaderComponent={subHeaderComponentMemo}
                                    persistTableHead
                                    highlightOnHover
                                    // defaultSortFieldId={1}
                                    theme="solarizedd"
                                />
                            }
                        </div>
                    </div>
                </>
            }
        </>
    )
}

export default ExternalTransactions;