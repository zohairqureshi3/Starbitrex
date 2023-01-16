import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { HexColorPicker, HexColorInput } from "react-colorful";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { getSalesStatus, editSalesStatus, updateState } from '../../redux/salesStatus/salesStatusActions';
import FullPageTransparentLoader from "../FullPageTransparentLoader/fullPageTransparentLoader";

const EditSalesStatus = () => {
   let { id } = useParams();
   const history = useHistory();
   const dispatch = useDispatch();

   const [loader, setLoader] = useState(false);
   const [currStatus, setCurrStatus] = useState({ name: "", type: 0 });
   const [color, setColor] = useState("#aabbcc");
   const [nameErr, setNameErr] = useState("");
   const [displayColorPicker, setDisplayColorPicker] = useState(false);

   const salesStatusData = useSelector(state => state?.salesStatus?.salesStatus);
   const salesStatusfetched = useSelector(state => state?.salesStatus?.salesStatusfetched);
   const salesStatusEditted = useSelector(state => state?.salesStatus?.salesStatusEditted);

   useEffect(async () => {
      setLoader(true);
      await dispatch(getSalesStatus(id));
   }, []);

   useEffect(async () => {
      if (salesStatusfetched) {
         await dispatch(updateState());
         setLoader(false);
      }
   }, [salesStatusfetched]);

   useEffect(() => {
      if (salesStatusEditted) {
         history.goBack();
      }
   }, [salesStatusEditted])


   useEffect(() => {
      if (salesStatusData) {
         setColor(salesStatusData?.color);
         setCurrStatus(salesStatusData);
      }
   }, [salesStatusData]);

   const handleChange = (e) => {
      setCurrStatus({ ...currStatus, [e.target.name]: e.target.value })
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      const { name } = currStatus;
      if (name == "") {
         setNameErr("Status name is required");
      } else {
         setLoader(true);
         const data = {
            name: currStatus.name,
            type: currStatus.type,
            color: color
         }
         await dispatch(editSalesStatus(id, data));
      }
   }
   return (
      <>
         {loader ? <FullPageTransparentLoader /> :
            salesStatusData ?
               <div className="content-wrapper right-content-wrapper">
                  <div className="content-box">
                     <FontAwesomeIcon className="faArrowLeftIcon" icon={faArrowLeft} onClick={() => history.goBack()} />
                     <h3>Edit Status</h3>
                     <form>
                        <div className="form-group col-md-12">
                           <label className="control-label">Status Name</label>
                           <input type="text" required="required" className="form-control" name="name" onChange={handleChange}
                              value={currStatus.name} placeholder="Enter status name" />
                           {nameErr ? (<span className="errMsg">{nameErr}</span>) : ("")}
                        </div>
                        <div className="form-group col-md-12">
                           <label className="control-label">Select Type</label>
                           <select className="form-control" required="required" name="type" value={currStatus.type} onChange={handleChange}>
                              <option value={0}>Sales</option>
                              <option value={1}>Retention</option>
                              <option value={2}>Both</option>
                           </select>
                        </div>
                        <div className="form-group col-md-12 pt-2">
                           <label className="control-label">Status Color</label>
                           <div className="inputWithButton">
                              <input type="text" className="form-control" name="color" disabled />
                              <button className='btn btn-secondary' onClick={() => setDisplayColorPicker(!displayColorPicker)} type='button'>
                                 Pick Color
                              </button>
                              {displayColorPicker ? (
                                 <div>
                                    <HexColorPicker color={color} onChange={setColor} />
                                    <HexColorInput color={color} onChange={setColor} placeholder="Type a color" prefixed alpha />
                                 </div>
                              ) : null
                              }
                              <span className="picked-value" style={{ borderLeftColor: color }}>
                                 Picked color is {color}
                              </span>
                           </div>
                        </div>
                        <div>
                           <button className="btn-default hvr-bounce-in nav-button" onClick={handleSubmit}>Save</button>
                        </div>
                     </form>
                  </div>
               </div>
               : null
         }
      </>
   )
}

export default EditSalesStatus;
