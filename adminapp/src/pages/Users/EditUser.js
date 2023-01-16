import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { editUser, getUser } from "../../redux/users/userActions";
import FullPageTransparentLoader from "../FullPageTransparentLoader/fullPageTransparentLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";

const EditUser = () => {

  const [user, setUser] = useState('');
  let { id } = useParams();
  const [loader, setLoader] = useState(false);

  const dispatch = useDispatch();
  const userData = useSelector((state) => state.users?.user);
  const userEditted = useSelector(state => state.users.userEditted);
  const history = useHistory();

  const { register, handleSubmit, control, formState: { errors } } = useForm();

  const editUserData = {
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
    username: {
      required: "username is required",
      pattern: {
        value: /^[A-Za-z0-9]*$/,
        message: 'Please enter a valid username',
      }
    },
    email: {
      required: "email is required",
      pattern: {
        value: /^[A-Za-z0-9@a-z.a-z]*$/,
        message: 'Please enter a valid email',
      }
    },
    phone: {
      required: "Phone Number is required",
      pattern: {
        value: /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
        message: 'Please enter a valid contact number',
      }
    },
  };

  const handleSave = (formData) => {
    setLoader(true);
    const data = {
      firstName: formData.firstname,
      lastName: formData.lastname,
      username: formData.username,
      email: formData.email,
      phone: formData.phone
    };
    dispatch(editUser(id, data));
  };

  useEffect(() => {
    dispatch(getUser(id));
  }, []);

  useEffect(() => {
    setUser(userData);
  }, [userData]);

  useEffect(() => {
    if (userEditted) {
      history.goBack();
    }
  }, [userEditted]);

  return (
    <>
      {loader ? (<FullPageTransparentLoader />) : user && user ? (
        <>
          {/* <div className="col-lg-9 col-md-8"> */}
          <div className="content-wrapper right-content-wrapper">
            <div className="content-box">
              <FontAwesomeIcon className="faArrowLeftIcon" icon={faArrowLeft} onClick={() => history.goBack()} />
              <h5>Edit User</h5>
              <form onSubmit={handleSubmit(handleSave)}>
                <div className="form-group col-md-12">
                  <label className="control-label">First Name</label>
                  <input type="text" className="form-control" placeholder="Enter First name"
                    {...register('firstname', editUserData.firstname)} name='firstname' defaultValue={user?.firstName} control={control} />
                  {errors?.firstname && <span className="errMsg">{errors.firstname.message}</span>}
                </div>
                <div className="form-group col-md-12 pt-2">
                  <label className="control-label">Last Name</label>
                  <input type="text" className="form-control" placeholder="Enter Last name"
                    {...register('lastname', editUserData.lastname)} name='lastname' defaultValue={user?.lastName} control={control} />
                  {errors?.lastname && <span className="errMsg">{errors.lastname.message}</span>}
                </div>
                <div className="form-group col-md-12 pt-2">
                  <label className="control-label">User Name</label>
                  <input type="text" className="form-control" placeholder="Enter Username"
                    {...register('username', editUserData.username)} name='username' defaultValue={user?.username} control={control} />
                  {errors?.username && <span className="errMsg">{errors.username.message}</span>}
                </div>
                <div className="form-group col-md-12 pt-2">
                  <label className="control-label">Email</label>
                  <input type="email" className="form-control" placeholder="Enter Email"
                    {...register('email', editUserData.email)} name='email' defaultValue={user?.email} control={control} />
                  {errors?.email && <span className="errMsg">{errors.email.message}</span>}
                </div>
                <div className="form-group col-md-12 pt-2">
                  <label className="control-label">Phone Number</label>
                  <input type="text" className="form-control" placeholder="Enter Phone number" name='phone' defaultValue={user?.phone} control={control}
                    {...register('phone', editUserData.phone)} />
                  {errors?.phone && <span className="errMsg">{errors.phone.message}</span>}
                </div>
                <div>
                  <button className="btn btn-default" type="submit">Save</button>
                </div>
              </form>
            </div>
          </div>
          {/* </div> */}
        </>
      ) : ""
      }
    </>
  );
};

export default EditUser;
