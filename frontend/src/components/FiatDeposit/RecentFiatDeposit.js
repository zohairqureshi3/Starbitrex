import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTh, faBars, faAngleRight, faLink, faClone } from '@fortawesome/free-solid-svg-icons';
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useDispatch, useSelector } from 'react-redux';
import { getDeposits } from '../../redux/externalTransactions/externalTransactionActions';
import DataTable from 'react-data-table-component';
import { toast } from 'react-toastify';

const RecentFiatDeposit = () => {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const dispatch = useDispatch();
    const userId = useSelector((state) => state.user?.user?._id);
    const deposits = useSelector((state) => state.externalTransactions?.deposits?.deposits);

    useEffect(() => {
        if (userId) {
            dispatch(getDeposits(userId))
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

    const depositColumns = [
        {
            name: 'Received At',
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
            name: 'Deposited From',
            selector: row => {
                return (
                    <>
                        <CopyToClipboard text={row?.fromAddress}>
                            <span>
                                {row?.fromAddress.slice(0, 4)}...{row?.fromAddress.slice(row?.fromAddress.length - 4, row?.fromAddress.length)}
                                <FontAwesomeIcon icon={faClone} onClick={() => copyReferral()} className="ms-2" />
                            </span>
                        </CopyToClipboard>
                    </>
                );
            },
        },
        {
            name: 'Deposit Wallet',
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
                        <CopyToClipboard text={row?.txHash}>
                            <span>
                                {row?.txHash.slice(0, 4)}...{row?.txHash.slice(row?.txHash.length - 4, row?.txHash.length)}
                                <FontAwesomeIcon icon={faClone} onClick={() => copyReferral()} className="ms-2" />
                            </span>
                        </CopyToClipboard>
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
        <section className="recent-deposit">
            <div className="container-fluid user-screen">
                <div className="d-flex flex-md-row flex-column justify-content-md-between mb-40 align-items-center">
                    <div className="d-flex align-items-center mb-md-0 mb-3">
                        <h3 className="text-capitalize mb-0">Recent deposits</h3>
                        {/* <div className="btn-group ms-5 bar-btn-group " role="group" aria-label="Basic mixed styles example">
                            <button type="button" className="btn btn-bar">
                                <FontAwesomeIcon icon={faTh} />
                                <i className="fa-solid fa-grid"></i>
                            </button>
                            <div className="line"></div>
                            <button type="button" className="btn btn-bar">
                                <FontAwesomeIcon icon={faBars} />
                            </button>
                        </div> */}
                    </div>
                    {/* <div className="inline-block">
                        <a href="" className="btn light-btn">Deposit hasn't arrived? Click here</a>
                    </div> */}
                </div>
                <div className="deposit-data">
                    <DataTable
                        columns={depositColumns}
                        data={deposits}
                        pagination
                        fixedHeader
                        persistTableHead
                        theme='solarized'
                    />
                </div>
            </div>
        </section>
    )
}

export default RecentFiatDeposit;