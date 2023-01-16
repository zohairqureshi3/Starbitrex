import React, { useState, useEffect } from 'react'
import { Tabs, Tab, Table, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import DataTable, { createTheme } from "react-data-table-component";
import { useDispatch } from "react-redux";
import { stopSpotOrder, completeSpotOrder } from '../../redux/spotOrder/spotOrderActions';

let completed = []

function SpotTradeOrdersData({ primaryCoin, secondaryCoin, token, userSpotOrders, rates }) {

      const dispatch = useDispatch();
      const [show, setShow] = useState(false);
      const [orderId, setOrderId] = useState("");
      // const [buyRate, setBuyRate] = useState(0);
      // const [sellRate, setSellRate] = useState(0);
      const handleClose = () => setShow(false);
      const handleShow = (id) => setShow(true);
      const handleCancel = () => {
            dispatch(stopSpotOrder(orderId));
            setShow(false);
            setOrderId("")
      };

      createTheme(
            "solarizedd",
            {
                  text: {
                        primary: "#fff",
                        secondary: "#fff",
                  },
                  background: {
                        // default: "rgba(33, 34, 46, 1)",
                        default: "#13141c",
                  },
                  context: {
                        // background: "rgba(33, 34, 46, 1)",
                        background: "#13141c",
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

      useEffect(() => {
            rates && userSpotOrders && userSpotOrders.length && userSpotOrders?.filter(row => row.status == 1).map(async row => {
                  let rate = rates ? parseFloat(rates?.find(line => line.symbol == row?.spotPair)?.markPrice).toFixed(2) : 0
                  if (
                        rate &&
                        (
                              (row.tradeType == 1 && rate !== 0 && (rate >= row.tradeStartPrice)) ||
                              (row.tradeType == 0 && rate !== 0 && (rate <= row.tradeStartPrice))
                        )
                  ) {
                        if (!completed.includes(row._id)) {
                              completed.push(row._id)
                              dispatch(completeSpotOrder(row._id));
                        }
                        // window.location.reload();
                  }
            })
      }, [rates])

      const limitOrdersColumns = [
            {
                  name: 'Spot Pairs',
                  selector: row => row?.spotPair,
                  sortable: true,
            },
            {
                  name: 'Order Type',
                  selector: row => row?.marketOrder == "1" ? "Market" : "Limit",
                  sortable: true,
            },
            {
                  name: 'Direction',
                  selector: row => row?.tradeType ? "Buy" : "Sell",
                  sortable: true,
            },
            {
                  name: 'Order Value',
                  selector: row => (parseFloat(parseFloat(row?.investedQty) * parseFloat(row?.tradeStartPrice)).toFixed(2)) + " " + secondaryCoin.symbol,
                  sortable: true,
            },
            {
                  name: 'Order Qty',
                  selector: row => parseFloat(row?.investedQty).toFixed(2) + ' ' + primaryCoin.symbol,
                  sortable: true,
            },
            {
                  name: 'Order Price',
                  selector: row => row?.tradeStartPrice + " " + secondaryCoin.symbol,
                  sortable: true,
            },
            {
                  name: 'Mark Price',
                  selector: row => rates != [] ? parseFloat(rates?.find(line => line.symbol == row?.spotPair)?.markPrice).toFixed(2) : 0 + ' ' + secondaryCoin.symbol,
                  sortable: true,
            },
            {
                  name: 'Unfilled Qty',
                  selector: row => parseFloat(row?.investedQty).toFixed(2) + ' ' + primaryCoin.symbol,
                  sortable: true,
            },
            {
                  name: 'Order Time',
                  selector: row => row?.createdAt.replace('T', ' ').replace('Z', ' '),
                  sortable: true,
            },
            {
                  name: 'Order ID',
                  selector: row => row?._id,
                  sortable: true,
            },
            {
                  name: 'Action',
                  selector: row => <span>
                        <button type="button" className="btn graph-table-btns ms-2" onClick={() => { setOrderId(row?._id); handleShow() }}> Cancel </button>
                  </span>,
            }
      ]

      const limitPastOrdersColumns = [
            {
                  name: 'Spot Pairs',
                  selector: row => row?.spotPair,
                  sortable: true,
            },
            {
                  name: 'Order Type',
                  selector: row => row?.marketOrder == "1" ? "Market" : "Limit",
                  sortable: true,
            },
            {
                  name: 'Direction',
                  selector: row => row?.tradeType ? "Buy" : "Sell",
                  sortable: true,
            },
            {
                  name: 'Order Value',
                  selector: row => (parseFloat(parseFloat(row?.investedQty) * parseFloat(row?.tradeStartPrice)).toFixed(2)) + " " + secondaryCoin.symbol,
                  sortable: true,
            },
            {
                  name: 'Filled Qty',
                  selector: row => row?.status == 3 ? 0 + ' ' + primaryCoin.symbol : parseFloat(row?.investedQty).toFixed(2) + ' ' + primaryCoin.symbol,
                  sortable: true,
            },
            {
                  name: 'Order Price',
                  selector: row => (row?.tradeStartPrice) + ' ' + secondaryCoin.symbol,
                  sortable: true,
            },
            {
                  name: 'Order Qty',
                  selector: row => parseFloat(row?.investedQty).toFixed(2) + ' ' + primaryCoin.symbol,
                  sortable: true,
            },
            {
                  name: 'Order Status',
                  selector: row => row?.status == 2 ? "Completed" : "Cancelled",
                  sortable: true,
            },
            {
                  name: 'Order Time',
                  selector: row => row?.createdAt.replace('T', ' ').replace('Z', ' '),
                  sortable: true,
            },
            {
                  name: 'Order ID',
                  selector: row => row?._id,
                  sortable: true,
            }
      ]

      return (
            <>
                  <Tabs defaultActiveKey="current" className="">
                        <Tab eventKey="current" title="Current Orders">
                              <Tabs defaultActiveKey="Limit" className="mt-1">
                                    <Tab eventKey="Limit" title="Limit & Market Orders">
                                          {userSpotOrders && userSpotOrders.length ? (
                                                <DataTable
                                                      columns={limitOrdersColumns}
                                                      data={userSpotOrders?.filter(row => row.status == 1)}
                                                      pagination
                                                      fixedHeader
                                                      persistTableHead
                                                      theme='solarizedd'
                                                />
                                          ) : (
                                                <Table responsive className="">
                                                      <thead>
                                                            <tr>
                                                                  <th scope="col">Spot Pairs</th>
                                                                  <th scope="col">Order Type</th>
                                                                  <th scope="col">Direction</th>
                                                                  <th scope="col">Order Value</th>
                                                                  <th scope="col">Order Qty</th>
                                                                  <th scope="col">Order Price</th>
                                                                  <th scope="col">Market Price</th>
                                                                  <th scope="col">Unfilled Qty</th>
                                                                  <th scope="col">Order Time</th>
                                                                  <th scope="col">Order ID</th>
                                                                  <th scope="col">Action</th>
                                                            </tr>
                                                      </thead>
                                                      <tbody>
                                                            <td colSpan="11">
                                                                  {token ? (
                                                                        "Empty"
                                                                  ) : (
                                                                        <div className="graph-table-btns buy-tabs">
                                                                              <Link to="/register">
                                                                                    <button
                                                                                          type="button"
                                                                                          className="mb-2 register-now"
                                                                                    >
                                                                                          Register Now
                                                                                    </button>
                                                                              </Link>
                                                                              <Link to="/login">
                                                                                    <button type="button" className="login-now">
                                                                                          Log In
                                                                                    </button>
                                                                              </Link>
                                                                        </div>
                                                                  )}
                                                            </td>
                                                      </tbody>
                                                </Table>
                                          )}
                                    </Tab>
                                    {/* <Tab eventKey="Conditional" title="Conditional Orders">
                                          {userSpotOrders && userSpotOrders.length ? (
                                                <DataTable
                                                      columns={conditionalOrdersColumns}
                                                      data={userSpotOrders.filter(row => row.futuresOrder == showBtns).filter((row) => row.status == 1)}
                                                      pagination
                                                      fixedHeader
                                                      persistTableHead
                                                      theme='solarizedd'
                                                />
                                          ) : (
                                                <Table responsive className="">
                                                      <thead>
                                                            <tr>
                                                                  <th scope="col">Spot Pairs</th>
                                                                  <th scope="col">Order Type</th>
                                                                  <th scope="col">Direction</th>
                                                                  <th scope="col">Order Value</th>
                                                                  <th scope="col">Order Qty</th>
                                                                  <th scope="col">Order Price</th>
                                                                  <th scope="col">Trigger Price</th>
                                                                  <th scope="col">Order Status</th>
                                                                  <th scope="col">Order Time</th>
                                                                  <th scope="col">Order ID</th>
                                                                  <th scope="col">Action</th>
                                                            </tr>
                                                      </thead>
                                                      <tbody>
                                                            <td colSpan="10">
                                                                  {token ? (
                                                                        "Empty"
                                                                  ) : (
                                                                        <div className="graph-table-btns buy-tabs">
                                                                              <Link to="/register">
                                                                                    <button
                                                                                          type="button"
                                                                                          className="mb-2 register-now"
                                                                                    >
                                                                                          Register Now
                                                                                    </button>
                                                                              </Link>
                                                                              <Link to="/login">
                                                                                    <button type="button" className="login-now">
                                                                                          Log In
                                                                                    </button>
                                                                              </Link>
                                                                        </div>
                                                                  )}
                                                            </td>
                                                      </tbody>
                                                </Table>
                                          )}
                                    </Tab> */}
                              </Tabs>
                        </Tab>
                        <Tab eventKey="Past" title="Past Orders">
                              <Tabs defaultActiveKey="Limit" className="mt-1">
                                    <Tab eventKey="Limit" title="Limit & Market Orders">
                                          {userSpotOrders && userSpotOrders.length ? (
                                                <DataTable
                                                      columns={limitPastOrdersColumns}
                                                      data={userSpotOrders?.filter(row => row.status != 1)}
                                                      pagination
                                                      fixedHeader
                                                      persistTableHead
                                                      theme='solarizedd'
                                                />
                                          ) : (
                                                <Table responsive className="">
                                                      <thead>
                                                            <tr>
                                                                  <th scope="col">Spot Pairs</th>
                                                                  <th scope="col">Order Type</th>
                                                                  <th scope="col">Direction</th>
                                                                  <th scope="col">Order Value</th>
                                                                  <th scope="col">Filled Qty</th>
                                                                  <th scope="col">Order Price</th>
                                                                  <th scope="col">Order Qty</th>
                                                                  <th scope="col">Order Status</th>
                                                                  <th scope="col">Order Time</th>
                                                                  <th scope="col">Order ID</th>
                                                            </tr>
                                                      </thead>
                                                      <tbody>
                                                            <td colSpan="10">
                                                                  {token ? (
                                                                        "Empty"
                                                                  ) : (
                                                                        <div className="graph-table-btns buy-tabs">
                                                                              <Link to="/register">
                                                                                    <button
                                                                                          type="button"
                                                                                          className="mb-2 register-now"
                                                                                    >
                                                                                          Register Now
                                                                                    </button>
                                                                              </Link>
                                                                              <Link to="/login">
                                                                                    <button type="button" className="login-now">
                                                                                          Log In
                                                                                    </button>
                                                                              </Link>
                                                                        </div>
                                                                  )}
                                                            </td>
                                                      </tbody>
                                                </Table>
                                          )}
                                    </Tab>
                                    {/* <Tab eventKey="Conditional" title="Conditional Orders">
                                          {userSpotOrders && userSpotOrders.length ? (
                                                <DataTable
                                                      columns={conditionalPastOrdersColumns}
                                                      data={userSpotOrders}
                                                      pagination
                                                      fixedHeader
                                                      persistTableHead
                                                      theme='solarizedd'
                                                />
                                          ) : (
                                                <Table responsive className="">
                                                      <thead>
                                                            <tr>
                                                                  <th scope="col">Spot Pairs</th>
                                                                  <th scope="col">Order Type</th>
                                                                  <th scope="col">Direction</th>
                                                                  <th scope="col">Order Value</th>
                                                                  <th scope="col">Order Qty</th>
                                                                  <th scope="col">Order Price</th>
                                                                  <th scope="col">Trigger Price</th>
                                                                  <th scope="col">Order Status</th>
                                                                  <th scope="col">Trigger Time</th>
                                                                  <th scope="col">Order Time</th>
                                                                  <th scope="col">Order ID</th>
                                                                  <th scope="col">Action</th>
                                                            </tr>
                                                      </thead>
                                                      <tbody>
                                                            <td colSpan="10">
                                                                  {token ? (
                                                                        "Empty"
                                                                  ) : (
                                                                        <div className="graph-table-btns buy-tabs">
                                                                              <Link to="/register">
                                                                                    <button
                                                                                          type="button"
                                                                                          className="mb-2 register-now"
                                                                                    >
                                                                                          Register Now
                                                                                    </button>
                                                                              </Link>
                                                                              <Link to="/login">
                                                                                    <button type="button" className="login-now">
                                                                                          Log In
                                                                                    </button>
                                                                              </Link>
                                                                        </div>
                                                                  )}
                                                            </td>
                                                      </tbody>
                                                </Table>
                                          )}
                                    </Tab> */}
                              </Tabs>
                        </Tab>
                        {/* <Tab eventKey="Trade" title="Trade History">
                              {userSpotOrders && userSpotOrders.length ? (
                                    <DataTable
                                          columns={tradeHistoryColumns}
                                          data={userSpotOrders.filter(row => row.futuresOrder == showBtns).filter((row) => row.status == 2 || row.status == 3)}
                                          pagination
                                          fixedHeader
                                          persistTableHead
                                          theme='solarizedd'
                                    />
                              ) : (
                                    <Table responsive className="">
                                          <thead>
                                                <tr>
                                                      <th scope="col">Spot Pairs</th>
                                                      <th scope="col">Order Type</th>
                                                      <th scope="col">Direction</th>
                                                      <th scope="col">Filled Value</th>
                                                      <th scope="col">Filled Price</th>
                                                      <th scope="col">Filled Qty</th>
                                                      <th scope="col">Trading Fee</th>
                                                      <th scope="col">Filled Time</th>
                                                      <th scope="col">Transaction ID</th>
                                                      <th scope="col">Order ID</th>
                                                </tr>
                                          </thead>
                                          <tbody>
                                                <td colSpan="9">
                                                      {token ? (
                                                            "Empty"
                                                      ) : (
                                                            <div className="graph-table-btns buy-tabs">
                                                                  <Link to="/register">
                                                                        <button
                                                                              type="button"
                                                                              className="mb-2 register-now"
                                                                        >
                                                                              Register Now
                                                                        </button>
                                                                  </Link>
                                                                  <Link to="/login">
                                                                        <button type="button" className="login-now">
                                                                              Log In
                                                                        </button>
                                                                  </Link>
                                                            </div>
                                                      )}
                                                </td>
                                          </tbody>
                                    </Table>
                              )}
                        </Tab> */}
                  </Tabs>

                  <Modal className="withdraw-details two-factor-auth text-center" centered backdrop="static" show={show} onHide={handleClose} >
                        <Modal.Header className='modal-main-heading' closeButton>
                        </Modal.Header>
                        <Modal.Body className='text-white'>
                              <h5 className='mb-5'>Are you sure want to cancel it?</h5>
                              <div className="limit-modal-btns">
                                    <button type="button" onClick={handleClose} className="btn cancel">No</button>
                                    <button type="button" onClick={() => { handleCancel() }} className="btn confirm">Yes</button>
                              </div>
                        </Modal.Body>
                  </Modal>
            </>
      )
}

export default SpotTradeOrdersData