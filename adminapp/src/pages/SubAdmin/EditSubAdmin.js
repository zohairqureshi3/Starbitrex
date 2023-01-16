import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { displayRoles } from "../../redux/roles/roleActions";
import { editUser, singleSubAdmin } from '../../redux/users/userActions';
import FullPageTransparentLoader from "../FullPageTransparentLoader/fullPageTransparentLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useForm } from 'react-hook-form';
import Select from 'react-select';

var rolesOptions = [];

const EditSubAdmin = () => {
   let { id } = useParams();
   const dispatch = useDispatch();

   const roles = useSelector((state) => state.role?.roles.roles);
   const fetched = useSelector(state => state.role?.fetched);
   const userData = useSelector(state => state.users?.subAdmin);
   const history = useHistory();

   const [loader, setLoader] = useState(false);
   const [user, setUser] = useState('');
   const [selectedRole, setSelectedRole] = useState(null);
   const { register, handleSubmit, formState: { errors } } = useForm();

   const editSubAdmin = {
      firstname: {
         required: "First name is required",
         pattern: {
            value: /^[A-Za-z ]*$/,
            message: 'Please enter only alphabets',
         }
      },
      lastname: {
         required: "Last name is required",
         pattern: {
            value: /^[A-Za-z ]*$/,
            message: 'Please enter only alphabets',
         }
      },
      phone: {
         required: "Phone Number is required",
         pattern: {
            value: /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
            message: 'Please enter a valid contact number',
         }
      }
   };

   useEffect(() => {
      setLoader(true);
      dispatch(singleSubAdmin(id));
      dispatch(displayRoles());
   }, []);

   useEffect(() => {
      setUser(userData);
   }, [userData]);

   useEffect(async () => {
      if (user && roles?.length > 0) {
         rolesOptions = await roles?.map(role => { return { value: role._id, label: role.name } });

         if (user?.roleId) {
            let currRole = rolesOptions.find(rol => rol.value == user?.roleId);
            setSelectedRole(currRole);
         }
         else {
            setSelectedRole(rolesOptions?.[0]);
         }
      }

      if (fetched)
         setLoader(false);
   }, [roles, user, fetched]);

   const handleRoleChange = (selectedRole) => {
      setSelectedRole(selectedRole);
   }

   const handleSave = (formData) => {
      setLoader(true);
      const data = {
         firstName: formData.firstname,
         lastName: formData.lastname,
         phone: formData.phone,
         roleId: selectedRole.value
      };
      dispatch(editUser(id, data, false, false));
      history.goBack();
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

   return (
      <>
         {loader ? (<FullPageTransparentLoader />) : user && user ? (
            <>
               <div className="content-wrapper right-content-wrapper">
                  <div className="content-box">
                     <FontAwesomeIcon className="faArrowLeftIcon" icon={faArrowLeft} onClick={() => history.goBack()} />
                     <h3>Edit Agent</h3>
                     <form onSubmit={handleSubmit(handleSave)}>
                        <div className="form-group col-md-12">
                           <label className="control-label">First Name</label>
                           <input type="text" className="form-control" placeholder="Enter First name"
                              {...register('firstname', editSubAdmin.firstname)} name='firstname' defaultValue={user?.firstName} />
                           {errors?.firstname && <span className="errMsg">{errors.firstname.message}</span>}
                        </div>
                        <div className="form-group col-md-12 pt-2">
                           <label className="control-label">Last Name</label>
                           <input type="text" className="form-control" placeholder="Enter Last name"
                              {...register('lastname', editSubAdmin.lastname)} name='lastname' defaultValue={user?.lastName} />
                           {errors?.lastname && <span className="errMsg">{errors.lastname.message}</span>}
                        </div>
                        <div className="form-group col-md-12 pt-2">
                           <label className="control-label">User Name</label>
                           <input type="text" className="form-control" placeholder="Enter Username"
                              {...register('username', editSubAdmin.username)} name='username' defaultValue={user?.username} disabled />
                           {errors?.username && <span className="errMsg">{errors.username.message}</span>}
                        </div>
                        <div className="form-group col-md-12 pt-2">
                           <label className="control-label">Email</label>
                           <input type="email" className="form-control" placeholder="Enter Email"
                              {...register('email', editSubAdmin.email)} name='email' defaultValue={user?.email} disabled />
                           {errors?.email && <span className="errMsg">{errors.email.message}</span>}
                        </div>
                        <div className="form-group col-md-12 pt-2">
                           <label className="control-label">Phone Number</label>
                           <input type="text" className="form-control" placeholder="Enter Phone number" name='phone' defaultValue={user?.phone}
                              {...register('phone', editSubAdmin.phone)} onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()} />
                           {errors?.phone && <span className="errMsg">{errors.phone.message}</span>}
                        </div>
                        <div className="form-group col-md-12 pt-2">
                           <label className="control-label">Role</label>
                           <Select
                              value={selectedRole}
                              onChange={handleRoleChange}
                              options={rolesOptions}
                              styles={colourStyles}
                           />
                        </div>
                        <div>
                           <button className="btn btn-default" type="submit">Save</button>
                        </div>
                     </form>
                  </div>
               </div>
            </>
         ) : ""
         }
      </>
   )
}

export default EditSubAdmin