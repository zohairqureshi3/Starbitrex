import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';


const AffiliateHeader = (props) => {
    let { id } = useParams();
    let token = localStorage.getItem('affToken')

    useEffect(() => {
        localStorage.getItem('affUser');
    }, [token])

    const logOut = () => {
        localStorage.removeItem('affToken');
        localStorage.removeItem('affUser');
        localStorage.removeItem('affUserId');
    }

    return (
        <header id="header">
            <div className="container-fluid main-menu">
                <div className="row">
                    <nav className="navbar navbar-expand-lg w-100 fixed-top main-padding">
                        <h5 className='nav-padding m-0'>StarBitrex</h5>
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown"
                            aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon fa fa-bars"></span>
                        </button>

                        <div className="collapse navbar-collapse" id="navbarNavDropdown">
                            {/* <ul className="navbar-nav ml-auto">

                                <li className="nav-item active">
                                    <a className="nav-link hvr-float-shadow " href='/login'>Login </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link hvr-float-shadow" href="/register">Sign Up</a>
                                </li>
                            </ul> */}
                        </div>
                        <div className="custom-items">
                            {token ?
                                <>
                                    <Dropdown className='user-dropdown'>
                                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                                            <FontAwesomeIcon icon={faUser} />
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            <Link className="dropdown-item" to={`/admin/aff/user-detail/${id ? id : ''}`}>Profile</Link>
                                            <a className="dropdown-item" href={`/`} onClick={() => logOut()}>{'Log Out'}</a>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </>
                                :
                                null
                            }
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    )
}

export default AffiliateHeader