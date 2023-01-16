import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import './FullPageTransparentLoader.css';

function FullPageTransparentLoader() {
    useEffect(() => {
        AOS.init();
    }, [])

    return (
        <React.Fragment>
            <div className="center-body">
                <span className="loader"></span>
            </div>
        </React.Fragment>
    );
};

export default FullPageTransparentLoader;