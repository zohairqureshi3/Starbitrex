import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from 'react-router-dom';
import { faEye, faEyeSlash, faRefresh, faUnlock, faUser } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RegisterUser } from "../../redux/auth/authActions";
import { displayRoles } from "../../redux/roles/roleActions";
import LOGO from "../../assets/images/STBRX-new-logo-01.png";
import FullPageLoader from '../FullPageLoader/fullPageLoader';
import ReactFlagsSelect from "react-flags-select";

const SignUp = () => {

    const dispatch = useDispatch();
    const roles = useSelector(state => state.role?.roles.roles);
    const initialUserState = { firstName: "", lastName: "", username: "", email: "", phoneNumber: "", password: "", confirmPassword: "", referralCode: "", dateOfBirth: "", additionalInfo: "" };
    const [user, setUser] = useState(initialUserState);
    const [errors, setErrors] = useState("");
    const [viewPass, setViewPass] = useState(0);
    const [viewCPass, setViewCPass] = useState(0);
    const [selectedFlagCountry, setSelectedFlagCountry] = useState("");
    const [loader, setLoader] = useState(true);
    // const [code, setCode] = useState("");
    // const [refsCount, setRefCount] = useState(0);

    // useEffect(() => {
    //   let inviteCode = JSON.parse(localStorage.getItem("code"))
    //   let refCount = JSON.parse(localStorage.getItem("refCount"))
    //   setCode(inviteCode);
    //   setRefCount(refCount ? (parseInt(refCount) + 1) : 0)
    // }, [])

    useEffect(() => {
        dispatch(displayRoles());
    }, []);

    useEffect(async () => {
        if (roles)
            setLoader(false);
    }, [roles]);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value })
    };

    const handleSubmit = async () => {
        let roleId = '';
        roles?.forEach(element => {
            if (element.name == 'Master') {
                roleId = element._id
            }
        });

        const { firstName, lastName, username, email, password, confirmPassword, referralCode, dateOfBirth } = user;

        const exp = /^[a-z A-Z]+$/;
        const numCheck = /^[0-9]*$/;
        const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (firstName == "") {
            setErrors("First name is required!");
        } else if (!firstName.match(exp)) {
            setErrors("Invalid first name (Only letters a-z allowed)!");
        } else if (lastName == "") {
            setErrors("Last name is required!");
        } else if (!lastName.match(exp)) {
            setErrors("Invalid last name (Only letters a-z allowed)!");
        } else if (username == "") {
            setErrors("Username is required!");
        } else if (email == "") {
            setErrors("Email address is required!");
        } else if (!email.match(regexp)) {
            setErrors("Invalid email address!");
            // } else if (phoneNumber == "") {
            //     setErrors("Phone number is required!");
            // } else if (!phoneNumber.match(numCheck)) {
            //     setErrors("Invalid phone number!");
        } else if (dateOfBirth == "") {
            setErrors("Date Of Birth is required!");
        }
        else if (password == "") {
            setErrors("Password is required!");
        } else if (password.length < 5) {
            setErrors("Password must have at-least 6 characters!");
        } else if (password !== confirmPassword) {
            setErrors("Password and Confirm Password does not match!");
        } else if (referralCode !== "" && referralCode.length < 24) {
            setErrors("Invalid referer code, valid referer code contains 24 characters!");
        } else {
            setErrors("");
            const myArray = referralCode.split("-");
            const code = myArray[0];
            const refsCount = parseInt(myArray[1]) + parseInt(1);

            const data = {
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
                phone: user.phoneNumber,
                password: user.password,
                dateOfBirth: user.dateOfBirth,
                additionalInfo: user.additionalInfo,
                refererId: code,
                refCount: refsCount,
                roleId: roleId,
                countryCode: selectedFlagCountry,
                clientType: 1
            }
            dispatch(RegisterUser(data));
        }
    }

    return (
        <>
            <div className="password-input-field">
                <p className='text-white-light'>First name</p>
                <div>
                    <input type="text" className="text-light" placeholder="Type first name..." name='firstName' value={user.firstName} onChange={handleChange} />
                </div>
            </div>
            <div className="password-input-field">
                <p className='text-white-light'>Last name</p>
                <div>
                    <input type="text" className="text-light" placeholder="Type last name..." name='lastName' value={user.lastName} onChange={handleChange} />
                </div>
            </div>
            <div className="password-input-field">
                <p className='text-white-light'>Email</p>
                <div>
                    <input type="email" className="text-light" placeholder="Type your email..." name='email' value={user.email} onChange={handleChange} />
                </div>
            </div>
            <div className="password-input-field">
                <p className='text-white-light'>Phone Number</p>
                <div>
                    <input type="text" className="text-light" placeholder="Type phone number..." name='phoneNumber' value={user.phoneNumber} onChange={handleChange} />
                </div>
            </div>
            <div className="react-select-country">
                <p className='text-white-light'>Select Country</p>
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
            <div className="password-input-field dob">
                <p className='text-white-light'>Select Date Of Birth</p>
                <div>
                    <input type="date" className="text-light" placeholder="Type date of birth..." name='dateOfBirth' value={user.dateOfBirth} onChange={handleChange} />
                </div>
            </div>
            <div className="password-input-field">
                <p className='text-white-light'>Choose a password</p>
                <div>
                    <span onClick={() => setViewPass(!viewPass)}><FontAwesomeIcon className='faeye' icon={viewPass ? faEyeSlash : faEye} /></span>
                    <input type={viewPass ? "text" : "password"} className="text-light" placeholder="Type your password..." name="password" value={user.password} onChange={handleChange} />
                </div>
            </div>
            <div className="password-input-field">
                <p className='text-white-light'>Repeat password</p>
                <div>
                    <span onClick={() => setViewCPass(!viewCPass)}><FontAwesomeIcon className='faeye' icon={viewCPass ? faEyeSlash : faEye} /></span>
                    <input type={viewCPass ? "text" : "password"} className="text-light" placeholder="Confirm password..." name="confirmPassword" value={user.confirmPassword} onChange={handleChange} />
                </div>
            </div>
            <div className="password-input-field">
                <p className='text-white-light'>Username</p>
                <div>
                    <input type="text" className="text-light" placeholder="Type your username..." name='username' value={user.username} onChange={handleChange} />
                </div>
            </div>
            <div className="password-input-field">
                <p className='text-white-light'>Referral Code</p>
                <div>
                    <input type="text" className="text-light" placeholder="Enter referral code..." name="referralCode" value={user.referralCode} onChange={handleChange} />
                </div>
            </div>
            <div className="password-input-field col-md-12 register-ad-info">
                <p className='text-white-light'>Additional Info</p>
                <div className="form-group">
                    <textarea placeholder="Enter additional info if any..." className="form-control" name="additionalInfo" value={user.additionalInfo} rows="3" onChange={handleChange}></textarea>
                </div>
            </div>

            {errors ? (
                <div style={{ color: "#FE6E00" }} className="alert alert-danger"> {errors} </div>
            ) :
                ("")
            }
            <div className='text-center'>
                <button type="button" className="btn enter-btn" onClick={() => handleSubmit()}>
                    SIGN UP
                </button>
            </div>
        </>
    )
}

export default SignUp