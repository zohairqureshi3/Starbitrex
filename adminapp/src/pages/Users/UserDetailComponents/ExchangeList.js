import React, { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import DataTable from "react-data-table-component"

const ExchangeList = () => {

    const dispatch = useDispatch();
    let { id } = useParams();

    const [filterText, setFilterText] = useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

    const internalTransactions = useSelector((state) => state.users?.user?.internalTransaction);

    const handleClear = () => {
        if (filterText) {
            setResetPaginationToggle(!resetPaginationToggle);
            setFilterText('');
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
    }

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

    const ordersColumns = [
        {
            name: 'Order Coin',
            selector: row => row?.fromCurrency?.symbol,
            sortable: true,
        },
        {
            name: 'Order Amount',
            selector: row => row?.fromAmount,
            sortable: true,
        },
        {
            name: 'Converted Coin',
            selector: row => row?.toCurrency?.symbol,
            sortable: true,
        },
        {
            name: 'Converted Amount',
            selector: row => row?.convertedAmount,
            sortable: true,
        },
        {
            name: 'Status',
            selector: row => {
                return (
                    <>
                        {row?.isResolved == 0 ?
                            <span className="badge rounded-pill bg-warning">Pending</span>
                            :
                            <span className="badge rounded-pill bg-success">Completed</span>
                        }
                    </>
                );
            },
        },
        {
            name: 'Ordered At',
            selector: row => formatDate(new Date(row?.createdAt)),
            sortable: true,
        }
    ]

    return (
        <>
            <div className="tab-pane fade" id="orderList">
                <div className='table-responsive'>
                    {internalTransactions && internalTransactions.filter(row => row.isResolved != false).length ?
                        <DataTable
                            columns={ordersColumns}
                            data={
                                filterText == '' ? internalTransactions.filter(row => row.isResolved != false) :
                                    internalTransactions.filter(row => row.isResolved != false).filter(row => (row.fromCurrency?.symbol.toLowerCase()?.includes(filterText.toLowerCase()) ||
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
        </>
    )
}

export default ExchangeList