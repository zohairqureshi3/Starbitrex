import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editUser, getUser } from '../../redux/users/userActions';
import FullPageTransparentLoader from "../FullPageTransparentLoader/fullPageTransparentLoader";

const UserProfile = () => {

   const dispatch = useDispatch();
   const initialUserState = { firstName: "", lastName: "", username: "", email: "" };
   const [user, setUser] = useState(initialUserState);
   const [errors, setErrors] = useState("");
   const userData = useSelector(state => state.users?.user);
   const [loader, setLoader] = useState(false);

   useEffect(() => {
      const loginUser = localStorage.getItem('userId');
      const uId = JSON.parse(loginUser)
      dispatch(getUser(uId));
   }, []);

   useEffect(() => {
      setLoader(true)
      setUser(userData);
      if (userData) {
         setLoader(false)
      }
   }, [userData]);

   const handleChange = (e) => {
      setUser({ ...user, [e.target.name]: e.target.value })
   };

   const handleSubmit = (e) => {
      e.preventDefault();
      const { firstName, lastName } = user;
      const exp = /^[a-z A-Z]+$/;
      if (firstName == "") {
         setErrors("Firstname is required!");
      } else if (!firstName?.match(exp)) {
         setErrors("Invalid firstname (Only letters a-z allowed)!");
      } else if (lastName == "") {
         setErrors("Lastname is required!");
      } else if (!lastName?.match(exp)) {
         setErrors("Invalid lastname (Only letters a-z allowed)!");
      } else {
         setErrors("")
         const data = {
            firstName: user.firstName,
            lastName: user.lastName
         };
         dispatch(editUser(user._id, data));
      }
   }

   return (
      <>
         {loader ? <FullPageTransparentLoader /> :
            <>
               {/* <div className="col-lg-9 col-md-8"> */}
               <div className="content-wrapper right-content-wrapper">
                  <div className="content-box">
                     <h3>Update Profile</h3>
                     <form>
                        <div className="form-group col-md-12">
                           <label className="control-label">First Name</label>
                           <input type="text" required="required" className="form-control" onChange={handleChange}
                              name="firstName" value={user?.firstName} placeholder="Enter first name" />
                        </div>
                        <div className="form-group col-md-12">
                           <label className="control-label">Last Name</label>
                           <input type="text" required="required" className="form-control" onChange={handleChange}
                              name="lastName" value={user?.lastName} placeholder="Enter last name" />
                        </div>
                        <div className="form-group col-md-12">
                           <label className="control-label">User Name</label>
                           <input type="text" name='username' className="form-control" value={user?.username} disabled />
                        </div>
                        <div className="form-group col-md-12">
                           <label className="control-label">Email</label>
                           <input type="email" name='email' className="form-control" value={user?.email} disabled />
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
                        <div>
                           <button className="btn btn-default" onClick={handleSubmit}>Save</button>
                        </div>
                     </form>
                  </div>
               </div>
               {/* </div> */}
            </>
         }
      </>
   )
}

export default UserProfile
