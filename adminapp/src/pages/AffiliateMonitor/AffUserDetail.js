import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getUserDetails } from "../../redux/users/userActions";
import FullPageTransparentLoader from "../FullPageTransparentLoader/fullPageTransparentLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClone } from "@fortawesome/free-solid-svg-icons";
import { showAllCurrencies } from '../../redux/currency/currencyActions';
import { getAdminComments } from '../../redux/adminComment/adminCommentActions';
import { getUserLeverageOrders } from '../../redux/leverageOrder/leverageOrderActions';
import { getUserSpotOrders } from "../../redux/spotOrder/spotOrderActions";
import { getSalesStatuses } from '../../redux/salesStatus/salesStatusActions';

import DataTable from 'react-data-table-component';
import { CopyToClipboard } from "react-copy-to-clipboard";
import Select from 'react-select';
import ReactFlagsSelect from "react-flags-select";
import { toast } from "react-toastify";

const currencyFormatter = require('currency-formatter');

var userTypeOptions = [{ label: 'Lead', value: 1 }, { label: 'Client', value: 2 }, { label: 'Affiliate', value: 3 }];
var userTypeStatus = [{ label: 'New', value: 1 }, { label: 'Call Back', value: 2 }, { label: 'Follow Up', value: 3 }, { label: 'No Answer', value: 4 }, { label: 'Deposited', value: 5 }, { label: 'Not interested', value: 6 }];

const AffUserDetail = () => {
  const [user, setUser] = useState("");
  const [loader, setLoader] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  let { id } = useParams();

  const dispatch = useDispatch();
  const userData = useSelector((state) => state?.users?.user);
  const internalTransactions = useSelector((state) => state.users?.user?.internalTransaction);
  const deposits = useSelector((state) => state.users?.user?.externalTransactions?.filter(row => row.transactionType != true));
  const withdraws = useSelector((state) => state.users?.user?.externalTransactions?.filter(row => row.transactionType == true));
  const [userDeposits, setUserDeposits] = useState([]);
  const [userWithdrawals, setUserWithdrawals] = useState([]);
  const currencies = useSelector(state => state.currency?.currencies?.allCurrencies);
  const amounts = useSelector((state) => state.users?.user?.account?.amounts);
  const [selectedFlagCountry, setSelectedFlagCountry] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [selectedUserType, setSelectedUserType] = useState({ label: 'Lead', value: 1 });
  const [selectedUserStatus, setSelectedUserStatus] = useState({ label: 'New', value: 1 });
  const userSpotOrders = useSelector((state) => state.spotOrder?.userSpotOrders?.userOrders);
  const [rates, setRates] = useState("");
  const userOrders = useSelector((state) => state.LeverageOrders?.userOrders?.userOrders);
  const salesStatuses = useSelector(state => state?.salesStatus?.salesStatuses);
  const [salesStatusType, setSalesStatusType] = useState({ value: "", color: "#fff" });

  const [avbl, setAvbl] = useState(0);
  const adminComments = useSelector((state) => state?.adminComment?.adminComments);
  const adminCommentsFetched = useSelector((state) => state?.adminComment?.fetched);
  const [commentLoader, setCommentLoader] = useState(false);

  useEffect(async () => {
    setCommentLoader(true);

    await dispatch(showAllCurrencies());
    await dispatch(getSalesStatuses());
    await dispatch(getUserDetails(id));
    await dispatch(getAdminComments(id));
    await dispatch(getUserSpotOrders(id));
    await dispatch(getUserLeverageOrders(id));
  }, []);



  useEffect(async () => {
    setLoader(true);
    setUser(userData);
    if (userData?.additionalInfo)
      setAdditionalInfo(userData?.additionalInfo);
    if (userData?.dateOfBirth)
      setDateOfBirth(userData?.dateOfBirth)
    if (userData?.countryCode)
      setSelectedFlagCountry(userData?.countryCode)
    if (userData?.clientType) {
      setSelectedUserType({ label: userData?.clientType === 1 ? 'Lead' : 'Client', value: userData?.clientType })
    }
    else {
      setSelectedUserType({ label: 'Lead', value: 1 })
    }
    if (userData?.clientStatus) {
      let currStatus = userTypeStatus.find(stat => stat.value == userData?.clientStatus);
      setSelectedUserStatus(currStatus)
    }
    else {
      setSelectedUserStatus(userTypeStatus?.[0])
    }

    if (userData?.salesStatus && Object.keys(userData?.salesStatus).length > 0) {
      setSalesStatusType({ value: userData?.salesStatus?._id, color: userData?.salesStatus?.color })
    }
    else {
      setSalesStatusType({ value: "", color: "#fff" });
    }


    if (userData?.externalTransactions || userData?.adminTransactions) {
      const deposits = userData?.externalTransactions?.filter(row => row.transactionType != true);
      const withdraws = userData?.externalTransactions?.filter(row => row.transactionType == true);
      const adminDeposits = userData?.adminTransactions?.filter(row => row.transactionType != true);
      const adminWithdraws = userData?.adminTransactions?.filter(row => row.transactionType == true);

      let newDeposits1 = [];
      let newDeposits2 = [];
      let newWithdraws1 = [];
      let newWithdraws2 = [];
      if (deposits?.length > 0) {
        newDeposits1 = deposits;
      }
      if (adminDeposits?.length > 0) {
        newDeposits2 = adminDeposits;
      }
      if (withdraws?.length > 0) {
        newWithdraws1 = withdraws;
      }
      if (adminWithdraws?.length > 0) {
        newWithdraws2 = adminWithdraws;
      }
      // Merge admin deposits and blockchain deposits into one state
      setUserDeposits([...newDeposits1, ...newDeposits2]);
      // Merge admin Withdrawals and blockchain Withdrawals into one state
      setUserWithdrawals([...newWithdraws1, ...newWithdraws2]);
    }
    setLoader(false);
  }, [userData]);

  useEffect(() => {
    if (adminCommentsFetched) {
      setCommentLoader(false);
    }
  }, [adminCommentsFetched]);

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
      minWidth: '200px'
    },
    {
      name: 'Asset',
      selector: row => row?.currency,
      sortable: true,
      minWidth: '200px'
    },
    {
      name: 'Amount',
      selector: row => row?.amount,
      sortable: true,
      minWidth: '200px'
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
              <CopyToClipboard text={row?.walletAddress} className="text-black">
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
            <CopyToClipboard text={row?.account?._id} className="text-black">
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
      },
      minWidth: '200px'
    }
  ]

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
      minWidth: '200px'
    },
    {
      name: 'Amount',
      selector: row => row?.amount,
      sortable: true,
      minWidth: '200px'
    },
    {
      name: 'From',
      selector: row => {
        return (
          <>
            {row?.walletAddress ?
              <CopyToClipboard text={row?.walletAddress} className="text-black">
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
            <CopyToClipboard text={row?.account?._id} className="text-black">
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
      },
      minWidth: '200px'
    }
  ]

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

  const handleUserTypeChange = (selectedCurrUserType) => {
    // setSelectedUserType(selectedCurrUserType);
  }

  const handleUserStatusChange = (selectedUserStatus) => {
    // setSelectedUserStatus(selectedUserStatus);
  };

  const handleUserStatusChange2 = (e) => {
    // setSalesStatusType({ value: e.target.value, color: e.target[e.target.selectedIndex].getAttribute('color') })
  };

  const colourStyles = {
    control: (styles, { isSelected }) => ({
      ...styles,
      background: '#374057',
      color: '#fff',
      border: '1px solid #374057',
      boxShadow: isSelected ? "none" : "none",
      borderColor: isSelected ? "#374057" : "#374057",
      "&:hover": {
        boxShadow: 'none',
      },
    }),
    input: styles => ({
      ...styles,
      color: '#fff',
    }),
    singleValue: styles => ({
      ...styles,
      color: '#fff',
    }),
    menuList: styles => ({
      ...styles,
      background: '#374057',
    }),
    option: (styles, { isFocused, isSelected }) => ({
      ...styles,
      background: isFocused
        ? '#16202e'
        : isSelected
          ? '#16202e'
          : undefined,
      color: "#fff",
      cursor: 'pointer',
      zIndex: 1,
      "&:hover": {
        background: "#16202e",
      }
    }),
  }

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
      selector: row => (parseFloat(parseFloat(row?.investedQty) * parseFloat(row?.tradeStartPrice)).toFixed(3)) + " " + 'USDT',
      sortable: true,
    },
    {
      name: 'Order Qty',
      selector: row => parseFloat(row?.investedQty).toFixed(3) + ' ' + row?.spotPair?.replace('USDT', ''),
      sortable: true,
    },
    {
      name: 'Order Price',
      selector: row => row?.tradeStartPrice + " " + 'USDT',
      sortable: true,
    },
    {
      name: 'Unfilled Qty',
      selector: row => parseFloat(row?.investedQty).toFixed(3) + ' ' + row?.spotPair?.replace('USDT', ''),
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

  // Future Active Orders
  const getInnitialMargin = (row) => {
    let val = ((parseFloat(row.qty) * parseFloat(row.tradeStartPrice)) / parseFloat(row.leverage))  //Initial margin
    return (val && !isNaN(val) ? val : 0);
  }

  const getPositionMargin = (row) => {
    //Qty / (entry price x leverage) /  ( Bankruptcy Price = Entry Price * (Leverage / Leverage + 1) )
    let val =
      parseFloat(
        getInnitialMargin(row)  //Initial margin
        +
        (getInnitialMargin(row) * 0.03) // 3%  of  Initial margin 
      ).toFixed(4)

    return (val && !isNaN(val) ? val : 0) + " " + row?.fromCurrency?.symbol;
  }

  const getUnrealizedPnL = (row) => {
    //{ ///* Unrealized P&L = buy => Contract Qty x [(1/Avg Entry Price) - (1/Last Traded Price)]  &  Sell => Contract Qty x [(1/Last Traded Price) - (1/Avg Entry Price)]*/ }
    let rate = parseFloat(rates ? rates?.find(line => line.symbol == row.pairName).markPrice : 0)
    let val = row?.tradeType == 1 ? //buy
      parseFloat(row?.qty) * (parseFloat(rate) - parseFloat(row?.tradeStartPrice))
      : //sell
      parseFloat(row?.qty) * (parseFloat(row?.tradeStartPrice) - parseFloat(rate))
    return val && !isNaN(val) ? val : 0;
  }

  const getLiquidationPrice = (data) => {
    let side = 0
    if (data.tradeType == 0) { side = -1 } else { side = 1 }
    let wb = 0
    let tmm = 0
    let UNPL = 0
    if (data.marginType == 0) { // cross
      wb = (parseFloat(avbl) + parseFloat(data.userInvestedAmount))
      // const otherOrders = await LeverageOrder.find({ userId: data.userId, status: "1" });
      userOrders.filter(row => (row.futuresOrder == 1 && row._id != data._id)).filter((row) => row.status == 1).forEach(ordr => {
        // tmm
        if (ordr.maintenanceMargin)
          tmm = tmm + ((parseFloat(ordr.qty) * parseFloat(rates ? rates?.find(line => line.symbol == ordr.pairName).markPrice : 0)) * (parseFloat(ordr.maintenanceMargin) / 100) - parseFloat(ordr.maintenanceAmount))
        // UNPL 
        UNPL = UNPL + parseFloat(document.getElementById(ordr?._id + "pnl")?.innerText)
      })
    } else { // isolated
      wb = parseFloat(data.userInvestedAmount)
    }
    let liqPrice =
      (
        wb - tmm + UNPL + data.maintenanceAmount
        -
        side
        *
        data.qty
        *
        data.tradeStartPrice
      )
      /
      (
        data.qty
        *
        (data.maintenanceMargin / 100)
        -
        side
        *
        data.qty
      )
    return liqPrice ? liqPrice : 0;
  }

  const pendingOrdersColumns = [
    {
      name: 'Contracts',
      selector: row => <>
        <b> {row.pairName} </b>
        <div> {row.marginType == 0 ? "Cross" : "Isolated"} <span className={row.tradeType == 1 ? "text-green" : "text-red"}>{row.leverage}x</span> </div>
      </>,
      sortable: true,
    },
    {
      name: 'Qty',
      selector: row => parseFloat(row.qty).toFixed(2) + " " + row?.toCurrency?.symbol,
      sortable: true,
    },
    {
      name: 'Value',
      selector: row => parseFloat(parseFloat(row.qty) * parseFloat(row.tradeStartPrice)).toFixed(2) + " " + row?.fromCurrency?.symbol,
      sortable: true,
    },
    {
      name: 'Entry Price',
      minWidth: '200px',
      selector: row => <span>
        {row?.tradeStartPrice ?
          <>
            {parseFloat(row.tradeStartPrice).toFixed(2) + " " + row?.fromCurrency?.symbol}
          </>
          :
          '-'
        }
      </span>,
      sortable: true,
    },
    {
      name: 'Liq. Price',
      selector: row =>
        <>
          <span id={row?._id + "liq"}> {parseFloat(getLiquidationPrice(row)).toFixed(2)} </span>
          <span>  {" " + row?.fromCurrency?.symbol} </span>
        </>,
      sortable: true,
    },
    {
      name: 'Position Margin',
      selector: row => getPositionMargin(row),
      sortable: true,
    },
    {
      name: 'Unrealized P&L (%)',
      selector: row => <span className={(getUnrealizedPnL(row) >= 0 ? 'text-green' : 'text-red') + ' d-flex flex-column'}>
        <>
          <span id={row?._id + "pnl"}> {parseFloat(getUnrealizedPnL(row)).toFixed(4)} </span>
          <span> {+ " " + row?.fromCurrency?.symbol}</span>
        </>
        <span> {parseFloat(getUnrealizedPnL(row) / (row.tradeType == 1 ? parseFloat(row.userInvestedAmount) : (parseFloat(row.userInvestedAmount) * parseFloat(row.tradeStartPrice)))).toFixed(4)} % </span>
        <span> {parseFloat(getUnrealizedPnL(row)).toFixed(2) + " USD"} </span>
      </span>,
      sortable: true,
    },
    {
      name: 'TP/SL',
      selector: row =>
        <span>
          {row.tpsl ?
            <>
              {row.takeProfitPrice ? row.takeProfitPrice + " " + row?.fromCurrency?.symbol : "-"} / {row.stopLossPrice ? row.stopLossPrice + " " + row?.fromCurrency?.symbol : "-"}
            </>
            :
            '-'
          }
        </span>,
      sortable: true,
    },
    {
      name: 'Trailing Stop',
      selector: row => <span>
        {row.tradeTrailingPrice ?
          <>
            {row.tradeTrailingPrice ? row.tradeTrailingPrice + " " + row?.fromCurrency?.symbol : "-"}
          </>
          :
          '-'
        }
      </span>,
      sortable: true,
    }
  ]

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
    }
  ]

  return (
    <>
      {loader || commentLoader ? (<FullPageTransparentLoader />) : user && user ? (
        <>
          <div className="content-wrapper right-content-wrapper">
            <div className="content-box">
              <h5>User Information</h5>
              <div className="row">
                <div className="form-group col-md-4 mt-2">
                  <label className="control-label">First Name</label>
                  <input type="text" className="form-control" placeholder="Enter First name"
                    name='firstname' defaultValue={user?.firstName} readOnly />
                </div>
                <div className="form-group col-md-4 mt-2">
                  <label className="control-label">Last Name</label>
                  <input type="text" className="form-control" placeholder="Enter Last name"
                    name='lastname' defaultValue={user?.lastName} readOnly />
                </div>
                <div className="form-group col-md-4 mt-2">
                  <label className="control-label">User Name</label>
                  <input type="text" className="form-control" placeholder="Enter Last name"
                    name='username' defaultValue={user?.username} readOnly />
                </div>

                <div className="form-group col-md-4 mt-2">
                  <label className="control-label">Country</label>
                  <ReactFlagsSelect
                    selected={selectedFlagCountry}
                    onSelect={(code) => setSelectedFlagCountry(code)}
                    searchable={true}
                    searchPlaceholder="Search for a country"
                    className='admin-country-react-flags-select'
                    disabled
                  />
                </div>
                <div className="form-group col-md-4 mt-2">
                  <label className="control-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={user.email}
                    disabled
                  />
                </div>
                <div className="form-group col-md-4 mt-2">
                  <label className="control-label">Phone Number</label>
                  <input type="text" className="form-control" placeholder="Enter Phone number"
                    name='phone' defaultValue={user?.phone} readOnly />
                </div>
              </div>
              <br />
              <br />
              <div>
                <ul className="nav nav-tabs" id="myTab">
                  <li className="nav-item">
                    <Link
                      className="nav-link active"
                      data-bs-toggle="tab"
                      to="#editUser"
                    >
                      User
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      data-bs-toggle="tab"
                      to="#assetInfo"
                    >
                      Asset Information
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      data-bs-toggle="tab"
                      to="#deposits"
                    >
                      Deposits
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      data-bs-toggle="tab"
                      to="#withdraws"
                    >
                      Withdrawals
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      data-bs-toggle="tab"
                      to="#activeOrder"
                    >
                      Active Order
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      data-bs-toggle="tab"
                      to="#orderList"
                    >
                      Exchange List
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      data-bs-toggle="tab"
                      to="#tradehist"
                    >
                      Trade History
                    </Link>
                  </li>
                </ul>
                <br />

                <div className="tab-content">
                  <div className="tab-pane fade show active" id="editUser">
                    <h5> Information </h5>
                    <div className="row">
                      <div className="form-group col-md-4 mt-2 dob">
                        <label className="control-label">Select Date Of Birth</label>
                        <input type="date" className="form-control" placeholder="Type date of birth..."
                          name='dateOfBirth' value={dateOfBirth ? new Date(dateOfBirth)?.toISOString()?.substring(0, 10) : new Date()?.toISOString()?.substring(0, 10)} onChange={(event) => setDateOfBirth(event.target.value)} />
                      </div>
                      <div className="form-group col-md-4 mt-2">
                        <label className="control-label">Select User Type</label>
                        <Select
                          value={selectedUserType}
                          onChange={handleUserTypeChange}
                          options={userTypeOptions}
                          styles={colourStyles}
                          isDisabled={true}
                        />
                      </div>
                      {user.ref && user.ref.refererId ?
                        <div className="form-group col-md-4 mt-2">
                          <label className="control-label">Referrer Id</label>
                          <input
                            type="text"
                            className="form-control"
                            value={user.ref.refererId}
                            disabled
                          />
                        </div>
                        : null
                      }
                      <div className="form-group col-md-4 mt-2">
                        <label className="control-label">
                          User ID
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={user._id}
                          disabled
                        />
                      </div>
                      <div className="form-group col-md-4 mt-2">
                        <label className="control-label">
                          Affiliate Channel
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={user?.affiliator?.[0] ? `${user?.affiliator?.[0]?.firstName} ${user?.affiliator?.[0]?.lastName}` : '-'}
                          disabled
                        />
                      </div>
                      {user.referals && user.referals.length ?
                        <div className="form-group col-md-4 mt-2">
                          <label className="control-label">Invitation Count</label>
                          <input
                            type="text"
                            className="form-control"
                            value={user.referals.length}
                            disabled
                          />
                        </div>
                        : null
                      }
                      <div className="form-group col-md-4 mt-2">
                        <label className="control-label">Registration Time</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formatDate(new Date(user?.createdAt))}
                          disabled
                        />
                      </div>
                      {user.verifiedAt ?
                        <div className="form-group col-md-4 mt-2">
                          <label className="control-label">Activation Time</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formatDate(new Date(user.verifiedAt))}
                            disabled
                          />
                        </div>
                        : null
                      }
                      {/* <div className="form-group col-md-4 mt-2">
                        <label className="control-label">Select User Status</label>
                        <Select
                          value={selectedUserStatus}
                          onChange={handleUserStatusChange}
                          options={userTypeStatus}
                          styles={colourStyles}
                          isDisabled={true}
                        />
                      </div> */}

                      <div className="form-group col-md-4 mt-2">
                        <label className="control-label">Select User Status</label>
                        <select className="form-control user-status-select" name="type" value={salesStatusType?.value} onChange={handleUserStatusChange2} style={{ color: salesStatusType?.color ? salesStatusType?.color : "#fff" }} disabled>
                          <option value="" style={{ color: "#fff" }} color="#fff">No Status</option>
                          {salesStatuses?.length > 0 && salesStatuses?.map(currentStatus => {
                            return <option value={currentStatus?._id} key={currentStatus?._id} style={{ color: currentStatus?.color }} color={currentStatus?.color}> {currentStatus?.name}</option>
                          })}
                        </select>
                      </div>


                      {deposits && deposits.length ?
                        <div className="form-group col-md-4 mt-2">
                          <label className="control-label">
                            First Crypto Deposit Time
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            value={formatDate(new Date(deposits[0]?.createdAt))}
                            disabled
                          />
                        </div>
                        : null
                      }
                      {deposits && deposits.length ?
                        <div className="form-group col-md-4 mt-2">
                          <label className="control-label">
                            Last Crypto Deposit Time
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            value={formatDate(new Date(deposits[deposits.length - 1]?.createdAt))}
                            disabled
                          />
                        </div>
                        : null
                      }
                      {withdraws && withdraws.length ?
                        <div className="form-group col-md-4 mt-2">
                          <label className="control-label">
                            First Crypto Withdraw Time
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            value={formatDate(new Date(withdraws[0]?.createdAt))}
                            disabled
                          />
                        </div>
                        : null
                      }
                      {withdraws && withdraws.length ?
                        <div className="form-group col-md-4 mt-2">
                          <label className="control-label">
                            Last Crypto Withdraw Time
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            value={formatDate(new Date(withdraws[withdraws.length - 1]?.createdAt))}
                            disabled
                          />
                        </div>
                        : null
                      }
                      {internalTransactions && internalTransactions.length ?
                        <div className="form-group col-md-4 mt-2">
                          <label className="control-label">First Trading Time</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formatDate(new Date(internalTransactions[0]?.createdAt))}
                            disabled
                          />
                        </div>
                        : null
                      }
                      {internalTransactions && internalTransactions.length ?
                        <div className="form-group col-md-4 mt-2">
                          <label className="control-label">Last Trading Time</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formatDate(new Date(internalTransactions[internalTransactions.length - 1]?.createdAt))}
                            disabled
                          />
                        </div>
                        : null
                      }
                    </div>
                    <div className="form-group col-md-12 pt-2">
                      <label className="control-label">Additional Info</label>
                      <textarea placeholder="Enter additional info if any..." className="form-control" name="additionalInfo" value={additionalInfo} rows="3" onChange={(event) => setAdditionalInfo(event.target.value)}></textarea>
                    </div>
                    <br />
                    {/* new html */}
                    <div className="comments-wrapper">
                      <div className="comments-content">
                        <h3>COMMENTS</h3>
                      </div>
                      {adminComments?.length > 0 ?
                        <>
                          <div className="form-border-wrapper">
                            {adminComments?.map(comment =>
                              <div key={`comment-${comment?._id}`} className="form-check form-group input-wrapper input-border d-flex mb-3">
                                <div className="info-content">
                                  <h5 className="mb-1"> {`${formatDate(new Date(comment?.createdAt))}, ${comment?.author?.firstName} ${comment?.author?.lastName}`} </h5>
                                  <label className="control-label ps-1">{comment?.text}</label>
                                </div>
                              </div>
                            )
                            }
                          </div>
                        </>
                        : null}
                    </div>
                    {/* END */}
                    <br />
                    <div className="d-none">
                      <ul className="nav nav-tabs">
                        <li className="nav-item">
                          <Link
                            className="nav-link active"
                            data-bs-toggle="tab"
                            to="#spot"
                          >
                            Spot
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            className="nav-link"
                            data-bs-toggle="tab"
                            to="#contract"
                          >
                            Contract
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            className="nav-link"
                            data-bs-toggle="tab"
                            to="#unitedContract"
                          >
                            United Contract
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            className="nav-link"
                            data-bs-toggle="tab"
                            to="#otc"
                          >
                            OTC
                          </Link>
                        </li>
                      </ul>
                      <br />
                      <div className="tab-content" >
                        <div className="tab-pane fade show active" id="spot">
                          <div className="row">
                            <div className="form-group col-md-12">
                              <label className="control-label">
                                Total Equivalent(USDT)
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                value="1741.61552445"
                                disabled
                              />
                            </div>
                          </div>
                          <div className="table-responsive">
                            <table className="table mt-3 table">
                              <thead className="table_head">
                                <tr>
                                  <th>Coin</th>
                                  <th>Available</th>
                                  <th>On order</th>
                                  <th>Locked</th>
                                  <th>USDT valuation</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>Ether</td>
                                  <td>0.00000</td>
                                  <td>0.00000</td>
                                  <td>0.00000</td>
                                  <td>0.00000</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div
                          className="tab-pane fade show active"
                          id="contract"
                        >
                          <div className="row">
                            <div className="form-group col-md-12">
                              <label className="control-label">
                                Total Equivalent(USDT)
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                value="0.00000000"
                                disabled
                              />
                            </div>
                          </div>
                          <br />
                          <ul className="nav nav-tabs">
                            <li className="nav-item">
                              <Link
                                className="nav-link active"
                                data-bs-toggle="tab"
                                to="#usdt"
                              >
                                USDT
                              </Link>
                            </li>
                            <li className="nav-item">
                              <Link
                                className="nav-link"
                                data-bs-toggle="tab"
                                to="#inverse"
                              >
                                Inverse
                              </Link>
                            </li>
                            <li className="nav-item">
                              <Link
                                className="nav-link"
                                data-bs-toggle="tab"
                                to="#simulation"
                              >
                                Simulation
                              </Link>
                            </li>
                          </ul>
                          <br />
                          <div className="tab-content">
                            <div
                              className="tab-pane fade show active"
                              id="usdt"
                            >
                              <div className="table-responsive">
                                <table className="table mt-3 table">
                                  <thead className="table_head">
                                    <tr>
                                      <th>Contract</th>
                                      <th>Available Equity</th>
                                      <th>Available</th>
                                      <th>On Orders</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>BTC/USDT</td>
                                      <td>0.00000000</td>
                                      <td>0.00000000</td>
                                      <td>0.00000000</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            <div
                              className="tab-pane fade show active"
                              id="inverse"
                            >
                              <div className="table-responsive">
                                <table className="table mt-3 table">
                                  <thead className="table_head">
                                    <tr>
                                      <th>Contract</th>
                                      <th>Available Equity</th>
                                      <th>Available</th>
                                      <th>On Orders</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>BTC/USD</td>
                                      <td>0.00000000</td>
                                      <td>0.00000000</td>
                                      <td>0.00000000</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            <div
                              className="tab-pane fade show active"
                              id="simulation"
                            >
                              <div className="table-responsive">
                                <table className="table mt-3 table">
                                  <thead className="table_head">
                                    <tr>
                                      <th>Contract</th>
                                      <th>Available Equity</th>
                                      <th>Available</th>
                                      <th>On Orders</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>Data</td>
                                      <td>Data</td>
                                      <td>Data</td>
                                      <td>Data</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className="tab-pane fade show active"
                          id="unitedContract"
                        ></div>
                        <div className="tab-pane fade show active" id="otc">
                          <div className="row">
                            <div className="form-group col-md-12">
                              <label className="control-label">
                                Total Equivalent(USDT)
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                value="0"
                                disabled
                              />
                            </div>
                          </div>
                          <div className="table-responsive">
                            <table className="table mt-3 table">
                              <thead className="table_head">
                                <tr>
                                  <th>Contract</th>
                                  <th>Available</th>
                                  <th>On Orders</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>Data</td>
                                  <td>Data</td>
                                  <td>Data</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

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
                          value={currencyFormatter.format(user?.account?.previousTotalAmount, { code: 'USD' })}
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
                    <div className="d-none">
                      <ul className="nav nav-tabs">
                        <li className="nav-item">
                          <Link
                            className="nav-link active"
                            data-bs-toggle="tab"
                            to="#spot"
                          >
                            Spot
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            className="nav-link"
                            data-bs-toggle="tab"
                            to="#contract"
                          >
                            Contract
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            className="nav-link"
                            data-bs-toggle="tab"
                            to="#unitedContract"
                          >
                            United Contract
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            className="nav-link"
                            data-bs-toggle="tab"
                            to="#otc"
                          >
                            OTC
                          </Link>
                        </li>
                      </ul>
                      <br />
                      <div className="tab-content" >
                        <div className="tab-pane fade show active" id="spot">
                          <div className="row">
                            <div className="form-group col-md-12">
                              <label className="control-label">
                                Total Equivalent(USDT)
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                value="1741.61552445"
                                disabled
                              />
                            </div>
                          </div>
                          <div className="table-responsive">
                            <table className="table mt-3 table">
                              <thead className="table_head">
                                <tr>
                                  <th>Coin</th>
                                  <th>Available</th>
                                  <th>On order</th>
                                  <th>Locked</th>
                                  <th>USDT valuation</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>Ether</td>
                                  <td>0.00000</td>
                                  <td>0.00000</td>
                                  <td>0.00000</td>
                                  <td>0.00000</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div
                          className="tab-pane fade show active"
                          id="contract"
                        >
                          <div className="row">
                            <div className="form-group col-md-12">
                              <label className="control-label">
                                Total Equivalent(USDT)
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                value="0.00000000"
                                disabled
                              />
                            </div>
                          </div>
                          <br />
                          <ul className="nav nav-tabs">
                            <li className="nav-item">
                              <Link
                                className="nav-link active"
                                data-bs-toggle="tab"
                                to="#usdt"
                              >
                                USDT
                              </Link>
                            </li>
                            <li className="nav-item">
                              <Link
                                className="nav-link"
                                data-bs-toggle="tab"
                                to="#inverse"
                              >
                                Inverse
                              </Link>
                            </li>
                            <li className="nav-item">
                              <Link
                                className="nav-link"
                                data-bs-toggle="tab"
                                to="#simulation"
                              >
                                Simulation
                              </Link>
                            </li>
                          </ul>
                          <br />
                          <div className="tab-content">
                            <div
                              className="tab-pane fade show active"
                              id="usdt"
                            >
                              <div className="table-responsive">
                                <table className="table mt-3 table">
                                  <thead className="table_head">
                                    <tr>
                                      <th>Contract</th>
                                      <th>Available Equity</th>
                                      <th>Available</th>
                                      <th>On Orders</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>BTC/USDT</td>
                                      <td>0.00000000</td>
                                      <td>0.00000000</td>
                                      <td>0.00000000</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            <div
                              className="tab-pane fade show active"
                              id="inverse"
                            >
                              <div className="table-responsive">
                                <table className="table mt-3 table">
                                  <thead className="table_head">
                                    <tr>
                                      <th>Contract</th>
                                      <th>Available Equity</th>
                                      <th>Available</th>
                                      <th>On Orders</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>BTC/USD</td>
                                      <td>0.00000000</td>
                                      <td>0.00000000</td>
                                      <td>0.00000000</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            <div
                              className="tab-pane fade show active"
                              id="simulation"
                            >
                              <div className="table-responsive">
                                <table className="table mt-3 table">
                                  <thead className="table_head">
                                    <tr>
                                      <th>Contract</th>
                                      <th>Available Equity</th>
                                      <th>Available</th>
                                      <th>On Orders</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>Data</td>
                                      <td>Data</td>
                                      <td>Data</td>
                                      <td>Data</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className="tab-pane fade show active"
                          id="unitedContract"
                        ></div>
                        <div className="tab-pane fade show active" id="otc">
                          <div className="row">
                            <div className="form-group col-md-12">
                              <label className="control-label">
                                Total Equivalent(USDT)
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                value="0"
                                disabled
                              />
                            </div>
                          </div>
                          <div className="table-responsive">
                            <table className="table mt-3 table">
                              <thead className="table_head">
                                <tr>
                                  <th>Contract</th>
                                  <th>Available</th>
                                  <th>On Orders</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>Data</td>
                                  <td>Data</td>
                                  <td>Data</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>


                  <div className="tab-pane fade" id="deposits">



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
                        />
                        :
                        <tr >
                          <td colSpan="7" >No Transactions Found!</td>
                        </tr>
                      }
                    </div>
                  </div>

                  <div className="tab-pane fade" id="withdraws">
                    <div className='table-responsive'>
                      {userWithdrawals && userWithdrawals.length ?
                        <div className="datatable-user-withdrawals">
                          <DataTable
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
                          />
                        </div>
                        :
                        <tr >
                          <td colSpan="7" >No Transactions Found!</td>
                        </tr>
                      }
                    </div>
                  </div>

                  <div className="tab-pane fade" id="activeOrder">
                    <h5> Spot Orders </h5>
                    <div className='table-responsive'>
                      {userSpotOrders && userSpotOrders.filter(row => row.status == 1).length > 0 ?
                        <DataTable
                          columns={limitOrdersColumns}
                          data={userSpotOrders?.filter(row => row.status == 1)}
                          pagination
                          fixedHeader
                          persistTableHead
                          theme='solarizedd'
                        />

                        :
                        null
                      }
                    </div>
                    <br />
                    <h5> Future Orders </h5>
                    <div className='table-responsive'>
                      {userOrders && userOrders?.length > 0 ? <DataTable
                        columns={pendingOrdersColumns}
                        data={userOrders.filter(row => row.futuresOrder == 1).filter((row) => row.status == 0 || row.status == 1)}
                        pagination
                        fixedHeader
                        persistTableHead
                        theme='solarizedd'
                      /> : null}
                    </div>
                  </div>

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


                </div>
              </div>
            </div>
          </div>
        </>
      ) : ("")
      }
    </>
  );
};

export default AffUserDetail;