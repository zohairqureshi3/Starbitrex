import React, { useEffect, useState } from "react"
import Header from '../../layout/Header';
import { useHistory } from 'react-router-dom';
import { ENV } from "../../config/config"
function Referred(props) {
    const history = useHistory()
    const redirectToRegister = () => {

        history.push({ pathname: "/register" })
    }
    useEffect(() => {
        let str = props.match.params.id
        const refCount = str.substring(str.indexOf('-') + 1);
        var id = str.substr(0, str.indexOf('-'));


        if (id) {
            ENV.saveItem("code", id)
            ENV.saveItem("refCount", refCount)

        }
    }, [])
    return (

        <>
            <Header />
            <div className="col-lg-12 col-md-12">
                <div className="content-wrapper">
                    <div className="content-box auth-box">
                        <h3>Referral page</h3>


                        <button className="btn-default hvr-bounce-in nav-button" onClick={redirectToRegister}>Register</button>

                    </div >
                </div >
            </div >
        </>

    )
}
export default Referred;