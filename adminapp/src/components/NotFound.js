import React from 'react'

const NotFound = () => {

    // useEffect(() => {
    document.title = "Page Not Found";
    // }, []);

    return (
        <div className="col-lg-9 col-md-8">
            <div className="content-wrapper">
                <div className="content-box">
                    <h3>Error 404. Not Found</h3>
                </div>
            </div>
        </div>
    )
}

export default NotFound