import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addNetwork, updateState } from '../../redux/network/networkActions';
import FullPageTransparentLoader from "../FullPageTransparentLoader/fullPageTransparentLoader";
import { MultiSelect } from "react-multi-select-component";
import { showAllCurrencies } from '../../redux/currency/currencyActions';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const AddNetwork = () => {

   const history = useHistory();
   const dispatch = useDispatch();
   const [name, setName] = useState("");
   const [symbol, setSymbol] = useState("");
   const [loader, setLoader] = useState(false);
   const success = useSelector(state => state.network.success);
   const [options, setOptions] = useState([]);
   const [selected, setSelected] = useState([]);
   const [nameErr, setNameErr] = useState("");
   const [symbolErr, setSymbolErr] = useState("");
   const [currencyErr, setCurrencyErr] = useState("");
   const [isEVM, setIsEVM] = useState(false);
   const [isTestnet, setIsTestnet] = useState(false);

   // Farhan Code Start
   const [chainId, setChainId] = useState("");
   const [rpcURL, setRpcURL] = useState("");
   const [multicallAddress, setMultiCallAddress] = useState("");
   const [type, setType] = useState("");
   const [explorerURL, setExplorerURL] = useState("");
   const [chainIdErr, setChainIdErr] = useState("");
   const [rpcURLErr, setRpcURLErr] = useState("");
   const [multicallAddressErr, setMultiCallAddressErr] = useState("");
   const [typeErr, setTypeErr] = useState("");
   const [explorerURLErr, setExplorerURLErr] = useState("");
   // Farhan Code End
   const currencies = useSelector(state => state.currency?.currencies?.allCurrencies);
   const success2 = useSelector(state => state.currency?.currencies?.success);
   const error = useSelector(state => state.network?.error);

   const getCurrencies = async () => {
      if (currencies) {
         const optionsValue = await currencies?.map((currency) => ({
            "key": currency?._id,
            "value": currency?._id,
            "label": currency?.name
         }));
         setOptions(optionsValue)
      }
   }

   useEffect(() => {
      getCurrencies();
   }, [currencies]);

   useEffect(() => {
      setLoader(true);
      dispatch(showAllCurrencies());
      if (success2) {
         setLoader(false);
      }
   }, [success2]);

   const handleSubmit = (e) => {
      e.preventDefault();
      if (!name && !symbol && selected.length < 1) {
         setNameErr("Network name is required");
         setSymbolErr("Network symbol is required");
         setCurrencyErr("Please select currency");
      } else if (!name) {
         setNameErr("Network name is required");
      } else if (!symbol) {
         setSymbolErr("Network symbol is required");
      }

      else if (selected.length < 1) {
         setCurrencyErr("Please select currency");
      } else {
         setLoader(true);
         let tempIds = [];
         selected.forEach(item => {
            tempIds.push(item.value)
         });
         const data = {
            name: name,
            symbol: symbol,
            chainId: chainId,
            rpcURL: rpcURL,
            multicallAddress: multicallAddress,
            type: type,
            explorerURL: explorerURL,
            currencyIds: tempIds,
            isEVM: isEVM,
            isTestnet: isTestnet
         }
         dispatch(addNetwork(data));
         setNameErr("");
         setSymbolErr("");
         setCurrencyErr("");
         setChainIdErr("");
         setRpcURLErr("");
         setMultiCallAddressErr("");
         setTypeErr("");
         setExplorerURLErr("");
         setSelected([]);
      }
   }

   useEffect(() => {
      if (success) {
         setLoader(false);
         history.goBack();
      }
      dispatch(updateState())
   }, [success])

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
                     <FontAwesomeIcon className="faArrowLeftIcon" icon={faArrowLeft} onClick={() => history.goBack()} />
                     <h3>Add Network</h3>
                     <form>
                        <div className="form-group col-md-12">
                           <label className="control-label">Network Name</label>
                           <input type="text" required="required" className="form-control" name="name" value={name}
                              placeholder="Enter network name" onChange={(e) => {
                                 if (e.target.value) {
                                    setName(e.target.value)
                                    setNameErr("")
                                 } else {
                                    setName(e.target.value)
                                    setNameErr("Network name is required")
                                 }
                              }} />
                           {nameErr ? (<span className="errMsg">{nameErr}</span>) : ("")}
                        </div>
                        <div className="form-group col-md-12 pt-2">
                           <label className="control-label">Network Symbol</label>
                           <input type="text" required="required" className="form-control" name="symbol" value={symbol}
                              placeholder="Enter network symbol" onChange={(e) => {
                                 if (e.target.value) {
                                    setSymbol(e.target.value)
                                    setSymbolErr("")
                                 } else {
                                    setSymbol(e.target.value)
                                    setSymbolErr("Network symbol is required")
                                 }
                              }} />
                           {symbolErr ? (<span className="errMsg">{symbolErr}</span>) : ("")}
                        </div>
                        {/* Farhan Code Start */}

                        <div className="form-group col-md-12 pt-2">
                           <label className="control-label">Chain Id</label>
                           <input type="text" required="required" className="form-control" name="chainId" value={chainId}
                              placeholder="Enter Chain Id" onChange={(e) => {
                                 if (e.target.value) {
                                    setChainId(e.target.value)
                                    setChainIdErr("")
                                 } else {
                                    setChainId(e.target.value)
                                    setChainIdErr("Chain Id is required")
                                 }
                              }} />
                           {chainIdErr ? (<span className="errMsg">{chainIdErr}</span>) : ("")}
                        </div>

                        <div className="form-group col-md-12 pt-2">
                           <label className="control-label">RPC URL</label>
                           <input type="text" required="required" className="form-control" name="rpcurl" value={rpcURL}
                              placeholder="Enter RPC-URL" onChange={(e) => {
                                 if (e.target.value) {
                                    setRpcURL(e.target.value)
                                    setRpcURLErr("")
                                 } else {
                                    setRpcURL(e.target.value)
                                    setRpcURLErr("RPC URL is required")
                                 }
                              }} />
                           {rpcURLErr ? (<span className="errMsg">{rpcURLErr}</span>) : ("")}
                        </div>

                        <div className="form-group col-md-12 pt-2">
                           <label className="control-label">MultiCall Address</label>
                           <input type="text" required="required" className="form-control" name="multicallAddress" value={multicallAddress}
                              placeholder="Enter MultiCall Address" onChange={(e) => {
                                 if (e.target.value) {
                                    setMultiCallAddress(e.target.value)
                                    setMultiCallAddressErr("")
                                 } else {
                                    setMultiCallAddress(e.target.value)
                                    setMultiCallAddressErr("MultiCall Address is required")
                                 }
                              }} />
                           {multicallAddressErr ? (<span className="errMsg">{multicallAddressErr}</span>) : ("")}
                        </div>

                        <div className="form-group col-md-12 pt-2">
                           <label className="control-label">Type</label>
                           <input type="text" required="required" className="form-control" name="type" value={type}
                              placeholder="Enter type" onChange={(e) => {
                                 if (e.target.value) {
                                    setType(e.target.value)
                                    setTypeErr("")
                                 } else {
                                    setType(e.target.value)
                                    setTypeErr("Type is required")
                                 }
                              }} />
                           {typeErr ? (<span className="errMsg">{typeErr}</span>) : ("")}
                        </div>

                        <div className="form-group col-md-12 pt-2">
                           <label className="control-label">Explorer URL</label>
                           <input type="text" required="required" className="form-control" name="explorerURL" value={explorerURL}
                              placeholder="Enter Explorer URL" onChange={(e) => {
                                 if (e.target.value) {
                                    setExplorerURL(e.target.value)
                                    setExplorerURLErr("")
                                 } else {
                                    setExplorerURL(e.target.value)
                                    setExplorerURLErr("Explorer URL is required")
                                 }
                              }} />
                           {explorerURLErr ? (<span className="errMsg">{explorerURLErr}</span>) : ("")}
                        </div>
                        {/* Farhan Code end */}
                        <div className="form-group col-md-12 pt-2 custom-milti-select">
                           <label className="control-label">Select Currencies</label>
                           <MultiSelect name="options" options={options} value={selected} onChange={setSelected} labelledBy="Select" includeSelectAllOption='false' />
                           {currencyErr ? (<span className="errMsg">{currencyErr}</span>) : ("")}
                        </div>
                        <div className="form-group col-md-12 pt-2">
                           <label className="control-label">EVM</label>
                           <div>
                              {" "}
                              <input
                                 type="radio"
                                 value={true}
                                 name="isEVM"
                                 checked={isEVM == true ? 1 : 0}
                                 onChange={() => setIsEVM(true)}
                              />{" "}
                              <label>YES</label>{" "}
                           </div>
                           <div>
                              {" "}
                              <input
                                 type="radio"
                                 value={false}
                                 name="isEVM"
                                 checked={isEVM == false ? 1 : 0}
                                 onChange={() => setIsEVM(0)}
                              />{" "}
                              <label>NO</label>{" "}
                           </div>
                        </div>
                        <div className="form-group col-md-12 pt-2">
                           <label className="control-label">TestNet</label>
                           <div>
                              {" "}
                              <input
                                 type="radio"
                                 value={true}
                                 name="isTestnet"
                                 checked={isTestnet == true ? 1 : 0}
                                 onChange={() => setIsTestnet(1)}
                              />{" "}
                              <label>YES</label>{" "}
                           </div>
                           <div>
                              {" "}
                              <input
                                 type="radio"
                                 value={false}
                                 name="isTestnet"
                                 checked={isTestnet == false ? 1 : 0}
                                 onChange={() => setIsTestnet(false)}
                              />{" "}
                              <label>NO</label>{" "}
                           </div>
                        </div>

                        <div>
                           <button className="btn btn-default" onClick={handleSubmit}>Save</button>
                        </div>
                     </form>
                  </div>
               </div>
            </>

         }
      </>
   )
}

export default AddNetwork