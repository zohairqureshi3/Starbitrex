import React, { useEffect, useState } from "react"
// import Header from '../../layout/Header';
import { useNavigate, useParams } from 'react-router-dom';
import { ENV } from "../../config/config"

function Referred(props) {

    const { code } = useParams();
    const navigate = useNavigate()
    const redirectToRegister = () => {

        navigate("/register")
    }

    useEffect(() => {
        let str = code.toString();
        const refCount = str.substring(str.indexOf('-') + 1);
        var refId = str.substring(0, str.indexOf('-'));
        console.log("id", refId);
        if (refId) {
            ENV.saveItem("code", refId)
            ENV.saveItem("refCount", refCount)
        }
    }, [])

    return (
        <>
            <div className="col-lg-12 col-md-12">
                <div className="content-wrapper">
                    <div className="content-box auth-box">
                        <h3>Referral page</h3>
                        <button className="btn-default hvr-bounce-in nav-button" onClick={redirectToRegister}>Register</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Referred;
