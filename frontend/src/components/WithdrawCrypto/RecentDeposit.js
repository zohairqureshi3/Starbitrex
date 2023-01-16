import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTh, faBars, faClone } from '@fortawesome/free-solid-svg-icons';
import DataTable, { createTheme } from 'react-data-table-component';
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useDispatch, useSelector } from 'react-redux';
import { getWithdraws } from '../../redux/externalTransactions/externalTransactionActions';
import { toast } from 'react-toastify';

const RecentDeposit = () => {

    createTheme(
        "solarizedd",
        {
            text: {
                primary: "#fff",
                secondary: "#fff",
            },
            background: {
                default: "#0c0d14",
            },
            context: {
                background: "#0c0d14",
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

    const dispatch = useDispatch();
    const userId = useSelector((state) => state.user?.user?._id);
    const withdraws = useSelector((state) => state.externalTransactions?.withdraws?.withdraws);

    useEffect(() => {
        if (userId) {
            dispatch(getWithdraws(userId))
        }
    }, [userId])

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

    const withdrawColumns = [
        {
            name: 'Withdrawn At',
            selector: row => formatDate(new Date(row?.createdAt)),
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
            name: 'Withdraw Wallet',
            selector: row => {
                return (
                    <>
                        <CopyToClipboard text={row?.toAddress}>
                            <span>
                                {row?.toAddress.slice(0, 4)}...{row?.toAddress.slice(row?.toAddress.length - 4, row?.toAddress.length)}
                                <FontAwesomeIcon icon={faClone} onClick={() => copyReferral()} className="ms-2" />
                            </span>
                        </CopyToClipboard>
                    </>
                );
            },
        },
        {
            name: 'TxID',
            selector: row => {
                return (
                    <>
                        {row?.txHash ?
                            <CopyToClipboard text={row?.txHash}>
                                <span>
                                    {row?.txHash.slice(0, 4)}...{row?.txHash.slice(row?.txHash.length - 4, row?.txHash.length)}
                                    <FontAwesomeIcon icon={faClone} onClick={() => copyReferral()} className="ms-2" />
                                </span>
                            </CopyToClipboard>
                            : "-"
                        }
                    </>
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
        }
    ]

    return (
        <div className="recent-deposit">
            <div className="container-fluid user-screen">
                <div className="d-flex flex-md-row flex-column justify-content-md-between mb-40 align-items-center">
                    <div className="d-flex align-items-center mb-md-0 mb-3">
                        <h3 className="text-capitalize mb-0">Recent Withdrawals</h3>
                    </div>
                </div>
                <div className="deposit-data">
                    <DataTable
                        columns={withdrawColumns}
                        data={withdraws}
                        pagination
                        fixedHeader
                        persistTableHead
                        theme='solarizedd'
                    />
                </div>
            </div>

        </div>
    )
}

export default RecentDeposit