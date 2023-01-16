import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { HexColorPicker, HexColorInput } from "react-colorful";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { addSalesStatus, updateState } from '../../redux/salesStatus/salesStatusActions';
import FullPageTransparentLoader from "../FullPageTransparentLoader/fullPageTransparentLoader";

const AddSalesStatus = () => {
   const history = useHistory();
   const dispatch = useDispatch();

   const [loader, setLoader] = useState(false);
   const [name, setName] = useState("");
   const [type, setType] = useState(0);
   const [color, setColor] = useState("#aabbcc");
   const [displayColorPicker, setDisplayColorPicker] = useState(false);
   const [nameErr, setNameErr] = useState("");
   const [colorErr, setColorErr] = useState("");

   const salesStatusAdded = useSelector(state => state?.salesStatus?.salesStatusAdded);
   const error = useSelector(state => state?.salesStatus?.error);

   const handleSubmit = (e) => {
      e.preventDefault();

      if (name == "") {
         setNameErr("Status name is required");
      } else if (color == "") {
         setColorErr("Status color is required");
      } else {
         setLoader(true);
         setDisplayColorPicker(false);
         const formData = {
            name: name,
            color: color,
            type: type
         }
         dispatch(addSalesStatus(formData));
      }
   }

   useEffect(() => {
      if (salesStatusAdded) {
         dispatch(updateState());
         history.goBack();
      }
   }, [salesStatusAdded])


   useEffect(() => {
      if (error) {
         setLoader(false);
         dispatch(updateState());
      }
   }, [error])

   return (
      <>
         {loader ? <FullPageTransparentLoader /> :
            <div className="content-wrapper right-content-wrapper">
               <div className="content-box">
                  <FontAwesomeIcon className="faArrowLeftIcon" icon={faArrowLeft} onClick={() => history.goBack()} />
                  <h3>Add Status</h3>
                  <form>
                     <div className="form-group col-md-12">
                        <label className="control-label">Status Name</label>
                        <input type="text" required="required" className="form-control" name="name" value={name}
                           placeholder="Enter status name" onChange={(e) => {
                              if (e.target.value) {
                                 setName(e.target.value)
                                 setNameErr("")
                              } else {
                                 setName(e.target.value)
                                 setNameErr("Status name is required")
                              }
                           }} />
                        {nameErr ? (<span className="errMsg">{nameErr}</span>) : ("")}
                     </div>
                     <div className="form-group col-md-12">
                        <label className="control-label">Select Type</label>
                        <select className="form-control" required="required" name="type" value={type} onChange={(e) => setType(e.target.value)}>
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
                           {colorErr ? (<span className="errMsg">{colorErr}</span>) : ("")}
                        </div>
                     </div>
                     <div>
                        <button className="btn btn-default" onClick={handleSubmit}>Save</button>
                     </div>
                  </form>
               </div>
            </div>
         }
      </>
   )
}

export default AddSalesStatus;