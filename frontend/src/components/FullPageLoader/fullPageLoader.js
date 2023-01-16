import React, { useEffect } from 'react';
import AOS from 'aos';
import './FullPageLoader.css';

function FullPageLoader() {
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

export default FullPageLoader;