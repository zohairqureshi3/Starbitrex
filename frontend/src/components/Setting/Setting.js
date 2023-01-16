import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import userImage from "../../assets/images/generic-user.png";
import { editUser, getUser } from '../../redux/users/userActions';
import FullPageLoader from '../FullPageLoader/fullPageLoader';
import ReactFlagsSelect from "react-flags-select";

const Setting = () => {
  const dispatch = useDispatch();
  const initialUserState = { firstName: "", lastName: "", phone: "" };
  const [image, setImage] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [imageName, setImageName] = useState("");
  const [user, setUser] = useState(initialUserState);
  const [errors, setErrors] = useState("");
  const [loader, setLoader] = useState(true);
  const [selectedFlagCountry, setSelectedFlagCountry] = useState("");
  const userData = useSelector(state => state.user?.user);

  useEffect(() => {
    const loginUser = localStorage.getItem('uId');
    const uId = JSON.parse(loginUser)
    dispatch(getUser(uId));
  }, []);

  useEffect(() => {
    setLoader(true)
    setUser(userData);
    if (userData?.countryCode)
      setSelectedFlagCountry(userData?.countryCode)
    if (userData?.profileImage) {
      setImagePath(`${process.env.REACT_APP_SERVER_URL}/images/${userData?.profileImage}`);
    }

    if (userData) {
      setLoader(false)
    }
  }, [userData]);

  const handleImageChange = (event) => {
    if (event.target.type === 'file') {
      const file = event.target.files[0];
      if (file) {
        const reader = new window.FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          setImagePath(reader.result);
          setImage(event.target.files[0]);
          setImageName(event.target.files[0].name)
        };
      }
    }
    else {
      this.setState({
        [event.target.name]: event.target.value
      })
    }
  }

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value })
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { firstName, lastName, phone } = user;
    const exp = /^[a-z A-Z]+$/;
    const phoneExp = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
    if (firstName == "") {
      setErrors("Firstname is required!");
    } else if (!firstName?.match(exp)) {
      setErrors("Invalid firstname (Only letters a-z allowed)!");
    } else if (lastName == "") {
      setErrors("Lastname is required!");
    } else if (!lastName?.match(exp)) {
      setErrors("Invalid lastname (Only letters a-z allowed)!");
    } else if (phone == "") {
      setErrors("Phone number is required!");
    } else if (!phone?.match(phoneExp)) {
      setErrors("Please enter a valid phone number");
    } else {
      setErrors("")
      var formData = new FormData();
      formData.append("firstName", user.firstName)
      formData.append("lastName", user.lastName)
      formData.append("phone", user.phone)
      formData.append("countryCode", selectedFlagCountry)

      if (image) {
        formData.append("image", image, imageName)
      }
      dispatch(editUser(user._id, formData));
    }
  }

  return (
    <>
      <section className='user-setting header-padding'>
        <div className="my-profile-col">
          <Container fluid >
            {loader ? <FullPageLoader /> :

              <div className="row">
                <div className="col-md-3 border-right">
                  <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                    {console.log("imagePath", imagePath)}
                    {console.log("userImage", userImage)}
                    <div><img className="rounded-circle mt-5" width={'200px'} height='200px' src={!loader ? imagePath ? imagePath : userImage : ''} alt="" fluid /></div>
                    <div className='profile-img-choosen'><input type='file' name="image" accept="image/*" onChange={handleImageChange} /></div>
                    <div style={{ paddingTop: "10px" }}><span className="text-white">{user?.username}</span></div>
                  </div>
                </div>
                <div className="col-md-9 border-right">
                  <form onSubmit={handleSubmit}>
                    <div className="py-5">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="text-right text-light">Profile Settings</h4>
                      </div>
                      <div className="row mt-2">
                        <div className="col-md-6 mb-3">
                          <label className="labels text-light">First Name</label>
                          <input type="text" className="form-control" placeholder="first name" value={user?.firstName}
                            onChange={handleChange} name="firstName" />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="labels text-light">Last Name</label>
                          <input type="text" className="form-control" placeholder="last name" value={user?.lastName}
                            onChange={handleChange} name="lastName" />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="labels text-light">Username</label>
                          <input type="text" className="form-control" value={user?.username} disabled />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="labels text-light">Email</label>
                          <input type="text" className="form-control" value={user?.email} disabled />
                        </div>
                        <div className="react-select-country col-md-6 mb-3">
                          <label className='labels text-light'>Select Country</label>
                          <div>
                            <ReactFlagsSelect
                              selected={selectedFlagCountry}
                              onSelect={(code) => setSelectedFlagCountry(code)}
                              searchable={true}
                              searchPlaceholder="Search for a country"
                              className='country-react-flags-select'
                            />
                          </div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="labels text-light">PhoneNumber</label>
                          <input type="text" className="form-control" placeholder="Enter phone number" value={user?.phone}
                            onChange={handleChange} name="phone" />
                        </div>
                      </div>
                      {errors ? (
                        <div style={{ color: "#FE6E00" }} className="alert alert-danger">
                          {errors}
                        </div>
                      ) : ("")
                      }
                      <div className="mt-5 text-center">
                        <button className="btn enter-btn" onClick={handleSubmit}>Save Profile</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>

            }
          </Container>
        </div>
      </section>
    </>
  )
}

export default Setting