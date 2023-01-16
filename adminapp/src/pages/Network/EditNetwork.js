import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { editNetwork, getNetwork } from '../../redux/network/networkActions';
import FullPageTransparentLoader from "../FullPageTransparentLoader/fullPageTransparentLoader";
import { MultiSelect } from "react-multi-select-component";
import { showAllCurrencies } from '../../redux/currency/currencyActions';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const EditNetwork = () => {

   let { id } = useParams();
   const [loader, setLoader] = useState(false);
   const [network, setNetwork] = useState({ name: "", symbol: "", chainId: "", multicallAddress: "", type: "", explorerURL: "" });
   const [isEVM, setIsEVM] = useState(false);
   const [isTestnet, setIsTestnet] = useState(false);
   const history = useHistory();
   const [options, setOptions] = useState([]);
   const [selected, setSelected] = useState([]);
   const [rpcURL, setRpcURL] = useState("");
   const [nameErr, setNameErr] = useState("");
   const [symbolErr, setSymbolErr] = useState("");
   const [currencyErr, setCurrencyErr] = useState("");
   const [chainIdErr, setChainIdErr] = useState("");
   const [rpcURLErr, setRpcURLErr] = useState("");
   const [multicallAddressErr, setMultiCallAddressErr] = useState("");
   const [typeErr, setTypeErr] = useState("");
   const [explorerURLErr, setExplorerURLErr] = useState("");

   const currencies = useSelector(state => state.currency?.currencies?.allCurrencies);
   const success2 = useSelector(state => state.currency?.currencies?.success);
   const networkEditted = useSelector(state => state.network?.networkEditted);

   useEffect(() => {
      dispatch(getNetwork(id))
   }, [])

   const getCurrencies = async () => {
      if (currencies) {
         const optionsValue = await currencies.map((currency) => ({
            "key": currency._id,
            "value": currency._id,
            "label": currency.name
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

   const dispatch = useDispatch();
   const networkData = useSelector(state => state?.network.networks);

   const handleChange = (e) => {
      setNetwork({ ...network, [e.target.name]: e.target.value })
   };

   useEffect(() => {
      if (networkData?.allNetworks) {
         let tempCurr = []
         networkData.allNetworks[0].currencies.forEach(item => {
            tempCurr.push({
               "value": item._id,
               "label": item.name,
            })
         })
         setSelected(tempCurr)
      }
   }, [networkData]);

   useEffect(async () => {
      if (networkData && networkData.allNetworks) {
         setNetwork(networkData?.allNetworks[0]);
         setRpcURL(networkData?.allNetworks[0]?.rpcURL);
         setIsTestnet(networkData?.allNetworks[0]?.isTestnet);
         setIsEVM(networkData?.allNetworks[0]?.isEVM);
      }
   }, [networkData]);

   const handleSubmit = async (e) => {
      e.preventDefault();
      const { name, symbol, chainId, multicallAddress, type, explorerURL } = network;

      if (!name && !symbol && selected.length < 1) {
         setNameErr("Network name is required");
         setSymbolErr("Network symbol is required");
         setCurrencyErr("Please select currency");
      } else if (!name) {
         setNameErr("Network name is required");
      } else if (!symbol) {
         setSymbolErr("Network symbol is required");
      } else if (selected.length < 1) {
         setCurrencyErr("Please select currency");
      }
      else {
         let tempIds = [];
         selected.forEach(item => {
            tempIds.push(item.value)
         });
         const data = {
            name: network.name,
            symbol: network.symbol,
            chainId: network.chainId,
            rpcURL: rpcURL,
            multicallAddress: network.multicallAddress,
            type: network.type,
            explorerURL: network.explorerURL,
            currencyIds: tempIds,
            isEVM: isEVM,
            isTestnet: isTestnet
         }
         await dispatch(editNetwork(id, data));
         setLoader(true);
      }
   }

   useEffect(() => {
      if (networkEditted)
         history.goBack();
   }, [networkEditted])

   return (
      <>
         {loader ? <FullPageTransparentLoader /> :
            network && network ?
               <>
                  <div className="content-wrapper right-content-wrapper">
                     <div className="content-box">
                        <FontAwesomeIcon className="faArrowLeftIcon" icon={faArrowLeft} onClick={() => history.goBack()} />
                        <h3>Edit Network</h3>
                        <form>
                           <div className="form-group col-md-12">
                              <label className="control-label">Network Name</label>
                              <input type="text" required="required" className="form-control" name="name" onChange={handleChange}
                                 value={network.name} placeholder="Enter network name" />
                              {nameErr ? (<span className="errMsg">{nameErr}</span>) : ("")}
                           </div>
                           <div className="form-group col-md-12 pt-2">
                              <label className="control-label">Network Symbol</label>
                              <input type="text" required="required" className="form-control" onChange={handleChange}
                                 name="symbol" value={network.symbol} placeholder="Enter network symbol" />
                              {symbolErr ? (<span className="errMsg">{symbolErr}</span>) : ("")}
                           </div>
                           <div className="form-group col-md-12 pt-2">
                              <label className="control-label">Chain Id</label>
                              <input type="text" required="required" className="form-control" name="chainId" value={network.chainId}
                                 placeholder="Enter Chain Id" onChange={handleChange} />
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
                              <input type="text" required="required" className="form-control" name="multicallAddress" value={network.multicallAddress}
                                 placeholder="Enter MultiCall Address" onChange={handleChange} />
                              {multicallAddressErr ? (<span className="errMsg">{multicallAddressErr}</span>) : ("")}
                           </div>
                           <div className="form-group col-md-12 pt-2">
                              <label className="control-label">Type</label>
                              <input type="text" required="required" className="form-control" name="type" value={network.type}
                                 placeholder="Enter type" onChange={handleChange} />
                              {typeErr ? (<span className="errMsg">{typeErr}</span>) : ("")}
                           </div>

                           <div className="form-group col-md-12 pt-2">
                              <label className="control-label">Explorer URL</label>
                              <input type="text" required="required" className="form-control" name="explorerURL" value={network.explorerURL}
                                 placeholder="Enter Explorer URL" onChange={handleChange} />
                              {explorerURLErr ? (<span className="errMsg">{explorerURLErr}</span>) : ("")}
                           </div>
                           <div className="form-group col-md-12 pt-2 custom-milti-select">
                              <label className="control-label">Select Currencies</label>
                              <MultiSelect options={options} value={selected} onChange={setSelected} labelledBy="Select" />
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
               : ''
         }
      </>
   )
}

export default EditNetwork