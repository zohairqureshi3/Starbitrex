import React from 'react';
import { Link } from 'react-router-dom';
import FOF from './assets/images/not_found_img.svg'

function NotFound() {
    return (
        <div className="notfound-sec">
            <div className="container">
                <div className="row justify-content-center align-items-center" style={{ height: '100vh' }}>
                    <div className="col-md-6">
                        <div className="text-center img-wrapper">
                            {/* <h1> 404 </h1> */}
                            <img src={FOF} className="img-fluid" />
                        </div>
                        <div className="content-wrapper d-flex flex-column align-items-center mt-5 w-100">
                            <h2 className="text-uppercase">OOPS! Page Not Found</h2>
                            <Link to="/" className="btn go-home-btn"> <span> Back to Home </span> </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NotFound;
