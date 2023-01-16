import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { showAllNetworks } from '../../redux/network/networkActions';
import FullPageTransparentLoader from "../FullPageTransparentLoader/fullPageTransparentLoader";
import { showAllCurrencies } from '../../redux/currency/currencyActions';
import { Form, Modal } from 'react-bootstrap';
import { showAllSettings } from '../../redux/settings/settingsActions';
import { submitWithdraw, updateState } from '../../redux/ExternalTransactions/externalTransactionActions';
import { getWithdrawFee } from '../../redux/withdrawFee/withdrawFeeActions';

const WithdrawCurrency = () => {

   const dispatch = useDispatch();
   const [currency, setCurrency] = useState("");
   const [network, setNetwork] = useState("");
   const [address, setAddress] = useState("");
   const [amount, setAmount] = useState("");
   const [userId, setUerId] = useState("");
   const [loader, setLoader] = useState(false);
   const [errors, setErrors] = useState("");
   const withdrawn = useSelector(state => state.externalTransaction?.withdrawn);
   const error = useSelector(state => state.externalTransaction?.error);

   const currencies = useSelector(state => state.currency?.currencies?.allCurrencies);
   const networks = useSelector(state => state.network?.networks);
   const success2 = useSelector(state => state.currency?.currencies?.success);
   const withdrawFee = useSelector((state) => state.withdrawFee?.withdrawFee);
   const [showConfirmation, setShowConfirmation] = useState(false);

   const handleCloseConfirmation = () => setShowConfirmation(false);
   const handleShowConfirmation = () => setShowConfirmation(true);

   useEffect(() => {
      setLoader(true);
      dispatch(showAllCurrencies());
      dispatch(showAllNetworks());
      if (success2) {
         setLoader(false);
      }
   }, [success2]);

   useEffect(() => {
      const loginData = localStorage.getItem('user');
      const data = JSON.parse(loginData);
      const id = data?._id;
      setUerId(id);
   }, [currency])

   const getWithdrawInfo = (netId) => {
      let data = {
         networkId: netId,
         currencyId: currency._id
      }
      dispatch(getWithdrawFee(data));
   }

   const handleSubmit = () => {
      setLoader(true);
      setErrors("");
      const data = {
         userId: userId,
         networkId: network,
         currencyId: currency._id,
         sendToAddress: address,
         deducted: (parseFloat(amount)),
         coins: amount.toString(),
         gas: withdrawFee.actualFee
      }
      dispatch(submitWithdraw(data));
   }

   useEffect(() => {
      if (withdrawn) {
         setLoader(false);
         setCurrency("");
         setNetwork("");
         setAddress("");
         setAmount("");
      }
   }, [withdrawn])

   const changeCurrency = (coin) => {
      if (coin) {
         setCurrency(currencies.find(row => row._id == coin))
      }
      else {
         setCurrency("")
      }
   }

   const changeNetwork = (val) => {
      getWithdrawInfo(val);
      setNetwork(val)
   }

   useEffect(() => {
      if (error) {
         setLoader(false);
         dispatch(updateState())
      }
   }, [error])

   return (
      <>
         {loader ? <FullPageTransparentLoader /> :

            <>
               <div className="content-wrapper right-content-wrapper">
                  <div className="content-box">
                     <h3>Withdraw Currency</h3>
                     <div className="form-group col-md-12">
                        <div className="form-group col-md-12">
                           <label className="control-label">Select Currency</label>
                           <Form.Select name="currency" required="required" onChange={(e) => changeCurrency(e.target.value)} value={currency?._id}>
                              <option value="" >Select Currency</option>
                              {currencies && currencies.length > 0 && currencies.map((currency) => {
                                 return (
                                    <option value={currency._id} key={currency._id}>{currency.name}</option>
                                 )
                              })}
                           </Form.Select>
                        </div>
                     </div>
                     <div className="form-group col-md-12 pt-2">
                        <label className="control-label">Select Network</label>
                        <Form.Select name="network" required="required" onChange={(e) => changeNetwork(e.target.value)} value={network?._id}>
                           <option value="" >Select Network</option>
                           {networks && networks.length > 0 && networks.filter(network => network.currencies.some((o) => o._id == currency._id)).map((network) => {
                              return (
                                 <option value={network._id} key={network._id}>{network.name}</option>
                              )
                           })}
                        </Form.Select>
                     </div>
                     <div className="form-group col-md-12 pt-2">
                        <label className="control-label">Withdrawal Address</label>
                        <input type="text" required="required" className="form-control" onChange={e => setAddress(e.target.value)} value={address}
                           name="address" placeholder="Enter Wallet Address" />
                     </div>
                     <div className="form-group col-md-12 pt-2">
                        <label className="control-label">Amount</label>
                        <input type="text" required="required" className="form-control" onChange={e => setAmount(e.target.value)}
                           value={amount} name="amount" placeholder="Enter amount" />
                     </div>
                     {errors ? (
                        <div
                           style={{ color: "#FE6E00" }}
                           className="alert alert-danger"
                        >
                           {errors}
                        </div>
                     ) : (
                        ""
                     )}
                     {currency && network && address && amount ?
                        <div>
                           <button type="button" className="btn-default hvr-bounce-in nav-button" onClick={() => handleShowConfirmation()}>Withdraw</button>
                        </div>
                        : ""}
                  </div>
               </div>
               <Modal Modal className='modal-wrapper modal-wrapper-width' show={showConfirmation} onHide={handleCloseConfirmation} >
                  <Modal.Header className='modal-main-heading' closeButton>
                     <div className="modal-main-heading-content">
                        <h5 className="modal-title" id="exampleModalLabel">ARE YOU SURE?</h5>
                     </div>
                  </Modal.Header>
                  <Modal.Body>
                     <p> <b>Sending to Address: </b> {address}  </p>
                     <p> <b>Sending: </b> {amount} {currency?.symbol} </p>
                     <p> <b>Transaction Fee: </b> {withdrawFee?.actualFee} {currency?.symbol} </p>
                     <p> <b>Deducted from your Wallet: </b> {(parseFloat(amount))} {currency?.symbol} </p>
                     <br />
                     <p> <b className='text-danger'>Warning: </b> We will not be responsible if the coins are sent to a wrong address!!! </p>
                     <div className='d-flex justify-content-right'>
                        <button type="button" className='btn btn-primary text-capitalize' onClick={() => { handleSubmit(); handleCloseConfirmation() }}> YES, Send! </button>
                        <button type="button" className='btn btn-danger text-capitalize ms-2' onClick={() => { handleCloseConfirmation() }}> Cancel </button>
                     </div>
                  </Modal.Body>
               </Modal>
            </>

         }
      </>
   )
}

export default WithdrawCurrency