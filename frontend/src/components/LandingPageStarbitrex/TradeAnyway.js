import React from 'react';
import Mockup from '../../assets/images/mockup1.1.png';
import AppleStore from "../../assets/images/apple-store.svg";
import Windows from "../../assets/images/windows.svg";
import PlayStore from "../../assets/images/play-store.png";
import MacOs from "../../assets/images/mac-os.svg";
import Linux from "../../assets/images/linux.svg";


const TradeAnyway = () => {
    return (
        <>
            <section className='trade-anyway padding50'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-8'>
                            <div className='mockup-img'>
                                <img src={Mockup} alt="" className='img-fluid' />
                            </div>
                            <div className='trade-anyway-content'>
                                <h1 className='text-white2'>Trade Anywhere <span className='text-gray'>Anytime.</span></h1>
                                <p className='text-white2'>Compatible with multiple devices, start trading with safety convenience.</p>
                            </div>
                        </div>
                        <div className='col-md-4'>
                        </div>
                    </div>
                    <div className="device-services">
                        <div className="d-flex flex-wrap justify-content-center">

                            <a className="card mb-5 text-decoration-none">
                                <figure className="mb-0">
                                    <img src={Windows} alt="" className="img-fluid" />
                                </figure>
                                <p className="card-title text-capitalize text-center">Windows</p>
                            </a>
                            <a className="card mb-5 text-decoration-none">
                                <figure className="mb-0">
                                    <img src={MacOs} alt="" className="img-fluid" />
                                </figure>
                                <p className="card-title text-capitalize text-center">Mac OS</p>
                            </a>
                            <a className="card mb-5 text-decoration-none">
                                <figure className="mb-0">
                                    <img src={PlayStore} alt="" className="img-fluid" />
                                </figure>
                                <p className="card-title text-capitalize text-center">Google Play</p>
                            </a>
                            <a className="card mb-5 text-decoration-none">
                                <figure className="mb-0">
                                    <img src={AppleStore} alt="" className="img-fluid" />
                                </figure>
                                <p className="card-title text-capitalize text-center">Apps Store</p>
                            </a>
                            <a className="card mb-5 text-decoration-none">
                                <figure className="mb-0">
                                    <img src={Linux} alt="" className="img-fluid" />
                                </figure>
                                <p className="card-title text-capitalize text-center">linux</p>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default TradeAnyway