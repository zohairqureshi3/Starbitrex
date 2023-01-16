import React, { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import DataTable from "react-data-table-component";
import { Modal, } from 'react-bootstrap';
import Slider from 'rc-slider';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Swal from 'sweetalert2';
import { faPencil, faUndo } from "@fortawesome/free-solid-svg-icons";
import { revertLeverageOrder, editLeverageHistoryOrder } from '../../../redux/leverageOrder/leverageOrderActions';

const TradeHistory = () => {
    const [filterText, setFilterText] = useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    let { id } = useParams();

    const dispatch = useDispatch();
    const userOrders = useSelector((state) => state.LeverageOrders?.userOrders?.userOrders);
    const [tradeHistoryTimeOpen, setTradeHistoryTimeOpen] = useState("");
    const [tradeHistoryTimeClose, setTradeHistoryTimeClose] = useState("");
    const [isCheckCommentErr, setIsCheckCommentErr] = useState("");



    const [selectedHistoryOrderRow, setSelectedHistoryOrderRow] = useState("");
    const [showEditTradeHistory, setShowEditTradeHistory] = useState(false);
    const [tradeHistoryPriceOpen, setTradeHistoryPriceOpen] = useState(0);
    const [tradeHistoryPriceClose, setTradeHistoryPriceClose] = useState(0);
    const [tradeHistoryVolume, setTradeHistoryVolume] = useState(0);
    const [tradeHistoryProfit, setTradeHistoryProfit] = useState(0);
    const handleCloseEditTradeHistory = () => setShowEditTradeHistory(false);
    const handleShowEditTradeHistory = () => setShowEditTradeHistory(true);


    const handleTradeHistoryVolume = (e) => {
        let historyVolume = e.target.value;

        //Profit
        let historyProfit = (tradeHistoryPriceClose - tradeHistoryPriceOpen) * historyVolume;

        setTradeHistoryVolume(historyVolume);
        setTradeHistoryProfit(historyProfit);
    };

    const handleTradeHistoryPriceOpen = (e) => {
        let historyPriceOpen = e.target.value;

        //Profit
        let historyProfit = (tradeHistoryPriceClose - historyPriceOpen) * tradeHistoryVolume;

        setTradeHistoryPriceOpen(historyPriceOpen);
        setTradeHistoryProfit(historyProfit);
    };

    const handleTradeHistoryPriceClose = (e) => {
        let historyPriceClose = e.target.value;

        //Profit
        let historyProfit = (historyPriceClose - tradeHistoryPriceOpen) * tradeHistoryVolume;

        setTradeHistoryPriceClose(historyPriceClose);
        setTradeHistoryProfit(historyProfit);
    };

    const handleTradeHistoryProfit = (e) => {
        let historyProfit = e.target.value;

        //Price Close
        let historyPriceClose = (historyProfit / tradeHistoryVolume) + tradeHistoryPriceOpen;

        setTradeHistoryPriceClose(historyPriceClose);
        setTradeHistoryProfit(historyProfit);
    };

    const handleEditTradeHistory = () => {
        let data = { ...selectedHistoryOrderRow };

        data.tradeStartPrice = parseFloat(tradeHistoryPriceOpen);
        data.exitPrice = parseFloat(tradeHistoryPriceClose);
        data.qty = parseFloat(tradeHistoryVolume);
        data.diffInProfitOrLoss = parseFloat(data.tradeProfitOrLoss - tradeHistoryProfit);
        data.tradeProfitOrLoss = parseFloat(tradeHistoryProfit);
        data.fromCurrency = data.fromCurrency._id
        data.toCurrency = data.toCurrency._id
        data.currentUserId = id
        dispatch(editLeverageHistoryOrder(data?._id, data));
        handleCloseEditTradeHistory();
        // setLoader(true);
    }

    const handleRevertTradeHistory = async (e, orderId) => {
        e.preventDefault();
        setIsCheckCommentErr("");
        Swal.fire({
            title: `Are you sure you want to Revert the order?`,
            html: '',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: "Yes"
        }).then((result) => {
            if (result.isConfirmed === true) {
                dispatch(revertLeverageOrder(orderId, id));
            }
        })
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

    const TradingColumns = [
        {
            name: 'Type',
            selector: row => row?.marginType == 1 ? "Isolated" : "Cross",
            sortable: true,
        },
        {
            name: 'Trading Pair',
            selector: row => row?.fromCurrency.symbol + row?.toCurrency.symbol,
            sortable: true,
        },
        {
            name: 'Trading Type',
            selector: row => row?.tradeType == 1 ? "Buy" : "Sell",
            sortable: true,
        },
        {
            name: 'Trading volume',
            selector: row => (parseFloat(row?.userInvestedAmount + (row?.leverage * row?.userInvestedAmount))).toFixed(4),
            sortable: true,
        },
        {
            name: 'Total Fee Paid',
            selector: row => row?.tradingFeePaid ? row?.tradingFeePaid : 0,
            sortable: true,
        },
        {
            name: 'Profit/Loss',
            minWidth: '200px',
            selector: row => row?.tradeProfitOrLoss ? row?.tradeProfitOrLoss : 0,
            sortable: true,
        },

        {
            name: 'Start Time',
            minWidth: '200px',
            selector: row => row?.createdAt.replace('T', ' ').replace('Z', ' '),
            sortable: true,
        },
        {
            name: 'End Time',
            minWidth: '200px',
            selector: row => row?.updatedAt.replace('T', ' ').replace('Z', ' '),
            sortable: true,
        },
        {
            name: 'Action',
            selector: row => {
                return (
                    <>
                        {row?.isResolved != false ?
                            <>
                                <button className="btn btn-success btn-sm me-1 p-1" onClick={() => { setSelectedHistoryOrderRow(row); setTradeHistoryPriceOpen(row.tradeStartPrice); setTradeHistoryPriceClose(row.exitPrice); setTradeHistoryVolume(row.qty); setTradeHistoryProfit(row.tradeProfitOrLoss); setTradeHistoryTimeOpen(row.createdAt); setTradeHistoryTimeClose(row.updatedAt); handleShowEditTradeHistory() }}><FontAwesomeIcon icon={faPencil} className="header-icon text-white" /></button>
                                <button className="btn btn-danger btn-sm me-1 p-1" onClick={(e) => handleRevertTradeHistory(e, row?._id)}><FontAwesomeIcon icon={faUndo} className="header-icon text-white" /></button>
                            </>
                            : <span>-</span>
                        }

                    </>
                );
            },
            minWidth: '200px'
        }
    ]

    return (
        <>
            <div className="tab-pane fade" id="tradehist">
                <div className='table-responsive'>
                    {userOrders && userOrders.filter(row => row.isResolved != false && row.status != 0 && row.status != 1).length ?
                        <DataTable
                            columns={TradingColumns}
                            data={
                                filterText == '' ? userOrders.filter(row => row.isResolved != false && row.status != 0 && row.status != 1) :
                                    userOrders.filter(row => row.isResolved != false && row.status != 0 && row.status != 1).filter(row => (row.fromCurrency?.symbol.toLowerCase()?.includes(filterText.toLowerCase()) ||
                                        row.toCurrency?.symbol.toLowerCase()?.includes(filterText.toLowerCase())))
                            }
                            pagination
                            paginationResetDefaultPage={resetPaginationToggle}
                            subHeader
                            subHeaderComponent={subHeaderComponentMemo}
                            fixedHeader
                            persistTableHead
                        />
                        :
                        <tr >
                            <td colSpan="7" >No Transactions Found!</td>
                        </tr>
                    }
                </div>
            </div>

            
            <Modal className="withdraw-details two-factor-auth text-center edit-trade-history-modal" centered backdrop="static" size="lg" show={showEditTradeHistory} onHide={handleCloseEditTradeHistory} >
                <Modal.Header className='modal-main-heading' closeButton>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-1"><h4>Edit Order</h4></div>
                    {/* <form className="mb-3" onSubmit={handleSubmit(handleSave)}> */}
                    <div className="row mb-3">
                        <div className="form-group col-md-6 mt-2">
                            <label className="control-label">Price Open</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter Price Open"
                                aria-label=""
                                aria-describedby=""
                                value={tradeHistoryPriceOpen}
                                onChange={(e) => { handleTradeHistoryPriceOpen(e) }}
                            />
                        </div>
                        <div className="form-group col-md-6 mt-2">
                            <label className="control-label">Price Close</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter Price Closed"
                                aria-label=""
                                aria-describedby=""
                                value={tradeHistoryPriceClose}
                                onChange={(e) => { handleTradeHistoryPriceClose(e) }}
                            />
                        </div>
                        <div className="form-group col-md-6 mt-2">
                            <label className="control-label">Volume</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter Volume"
                                aria-label=""
                                aria-describedby=""
                                value={tradeHistoryVolume}
                                onChange={(e) => { handleTradeHistoryVolume(e) }}
                            />
                        </div>
                        <div className="form-group col-md-6 mt-2">
                            <label className="control-label">Profit</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter Profit"
                                aria-label=""
                                aria-describedby=""
                                value={tradeHistoryProfit}
                                onChange={(e) => { handleTradeHistoryProfit(e) }}
                            />
                        </div>
                        <div className="form-group col-md-6 mt-2">
                            <label className="control-label">Time Opened</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter Time Opened"
                                aria-label=""
                                aria-describedby=""
                                value={tradeHistoryTimeOpen?.replace('T', ' ')?.replace('Z', ' ')}
                                onChange={(e) => { setTradeHistoryTimeOpen(e.target.value) }}
                            />
                        </div>
                        <div className="form-group col-md-6 mt-2">
                            <label className="control-label">Time Closed</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter Time Closed"
                                aria-label=""
                                aria-describedby=""
                                value={tradeHistoryTimeClose?.replace('T', ' ')?.replace('Z', ' ')}
                                onChange={(e) => { setTradeHistoryTimeClose(e.target.value) }}
                            />
                        </div>
                    </div>
                    {/* </form> */}
                    <div>
                        <button className="btn btn-default me-2" onClick={() => { handleEditTradeHistory() }}>Save</button>
                        <button onClick={handleCloseEditTradeHistory} className="btn btn-danger">Cancel</button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default TradeHistory