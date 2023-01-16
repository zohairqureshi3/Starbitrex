// import useToken from '../hooks/useToken'
import { Link } from 'react-router-dom';
import { Dropdown, Modal, Button } from 'react-bootstrap';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBell } from '@fortawesome/free-solid-svg-icons';
import logoImage from '../assets/images/STBRX-new-logo-01.png'
// import { CopyToClipboard } from "react-copy-to-clipboard";
// import { faClone } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
// import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
// import { getPermission } from '../config/helpers';
// import { getRole } from '../redux/roles/roleActions';
import { displayUnreadNotifications, readNotification } from '../redux/notifications/notificationActions';
import socketIOClient from "socket.io-client";
import { listUnreadNotification } from '../redux/apiHelper';

const socketURL = process.env.REACT_APP_SOCKET_URL;

const Header = (props) => {

    // const getNotifications = useSelector((state) => state.notification?.unreadNotifications);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [notification, setNotification] = useState([]);

    const history = useHistory()

    let token = localStorage.getItem('token')
    // const walletAddress = localStorage.getItem('WalletAddress');
    // const walletAddress = useSelector(state => state.users?.mAddress);
    // let [wAddress, setWAddress] = useState("")

    const dispatch = useDispatch();
    // const roleData = useSelector(state => state?.role.role);
    // const loginPermissions = roleData[0]?.permissions;
    // const permissionName = getPermission(loginPermissions);

    // useEffect(() => {
    //     let wallAddress = localStorage.getItem("WalletAddress")
    //     if (walletAddress) {
    //         setWAddress(walletAddress)
    //     } else {
    //         setWAddress(wallAddress)
    //     }
    //     token = localStorage.getItem('token')
    //     if (!token) { history.push("/admin/login") }
    // }, [walletAddress])

    useEffect(() => {
        localStorage.getItem('user');

        // dispatch(displayUnreadNotifications());
        // const loginData = localStorage.getItem('user');
        // if(loginData){
        //     const data = JSON.parse(loginData);
        //     const id = data?.roleId;
        //     dispatch(getRole(id));
        // }
    }, [token])

    // useEffect(() => {
    //     localStorage.getItem('user');
    //     setNotification(getNotifications)

    // }, [getNotifications])

    useEffect(() => {
        const socket = socketIOClient(socketURL);
        console.log("socket Hit")
        socket.emit("emitNotificationRequest");
        socket.on("onNotificationResponse", data => {
            console.log(data,"socket Hit data")
          //setResponse(data);
          setNotification(data)
        });
      }, []);


    const logOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userId');
        localStorage.removeItem('Currencies');
        localStorage.removeItem('WalletAddress');
    }

    const redirectToPage = (url) => {
        history.push(url)
    }

    const markReadNotifcation = async (id) => {
        setNotification([])
        await dispatch(readNotification(id));
        await listUnreadNotification();
        // return Promise.resolve(dispatch(readNotification(id)))
        //     .then(
        //         dispatch(displayUnreadNotifications())
        //     ).catch(error => {
        //         console.log(error, "displayUnreadNotifications");
        //     });
    }
    

    return (
        <header id="header">
            <div className="container-fluid main-menu">
                <div className="row">
                    <nav className="navbar navbar-expand-lg w-100 fixed-top main-padding">
                        <Link to="/admin/" className='logo '>
                            <img className='img-fluid' src={logoImage} alt="Logo" />
                        </Link>
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
                                    {/* <button className="btn-default hvr-bounce-in">
                                        <Link to={`/admin/user-profile`} className='text-decoration-none text-light'>Profile</Link>
                                    </button> */}

                                    {/* {wAddress && wAddress ?
                                        <span className='me-3' style={{ color: "#fff" }} >
                                            {wAddress}
                                            <CopyToClipboard text={wAddress}
                                                onCopy={() => toast.success("Copied")}>
                                                <span className="ms-2"><FontAwesomeIcon style={{ cursor: "pointer" }} icon={faClone} /></span>
                                            </CopyToClipboard>
                                        </span>
                                        : null
                                    } */}

                                    {/* <button className="btn-default hvr-bounce-in m-0">
                                        <Link className='text-decoration-none text-light'>Connect Wallet</Link>
                                    </button> */}
                                    {/* <a className="nav-link hvr-float-shadow" href="/admin/">
                                        <button className="btn-default hvr-bounce-in" onClick={() => logOut()}>
                                            <span className="icon"></span>{'Log Out'}
                                        </button>
                                    </a> */}
                                    <Button className='noti-button' onClick={handleShow}>
                                        <FontAwesomeIcon icon={faBell} />
                                        <div className='notifiction-badge'>
                                            {notification?.length ? notification?.length : '0'}
                                        </div>
                                    </Button>

                                    <Modal className='noti-modal' show={show} onHide={handleClose}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Notifications</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            {
                                                notification?.length && notification.length > 0 ?
                                                    notification.map((i, index) =>
                                                        <span onClick={() => { markReadNotifcation(i._id); redirectToPage('/admin' + i.redirectUrl) }} className={`content active`} key={i._id}>
                                                            <span className='unread'>Unread</span>
                                                            <h6 className='status'><Link to={`/admin${i.redirectUrl}`} className="d-inline">{i.message}</Link></h6>
                                                            <p><span className='date'>{moment(i.createdAt).format('LLL')}</span>
                                                                {/* <span className='time'>10:00 PM</span> */}
                                                            </p>
                                                        </span>
                                                    )
                                                    :
                                                    <div className='no-noti-found'>
                                                        <span className='text-white'>No notification found!</span>
                                                    </div>
                                            }
                                        </Modal.Body>
                                    </Modal>

                                    <Dropdown className='user-dropdown'>
                                        <Dropdown.Toggle variant="success" id="dropdown-basic" className='noti-button m-0'>
                                            <FontAwesomeIcon icon={faUser} />
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            {/* <Link className="dropdown-item conntect-wallet-btn">Connect Wallet</Link> */}
                                            <Link className="dropdown-item" to={`/admin/user-profile`}>Profile</Link>
                                            <Link className="dropdown-item" to={`/admin/change-password`}>Change Password</Link>
                                            <Link className="dropdown-item" to={`/admin/settings`}>Settings</Link>
                                            <a className="dropdown-item" href={`/admin/`} onClick={() => logOut()}>{'Log Out'}</a>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </>
                                :
                                <>
                                    {/* <Link to='/login'>
                                        <button className="btn-default hvr-bounce-in"><span className="icon">
                                        </span>Login</button>
                                    </Link>
                                    <Link to='/register'>
                                        <button className="btn-default hvr-bounce-in"><span className="icon">
                                        </span>Sign Up</button>
                                    </Link> */}
                                </>
                            }
                            {/* <div className="flags-dropdown btn-group">
                                <button type="button" className="btn" data-toggle="dropdown" aria-haspopup="true"
                                    aria-expanded="false">
                                </button>
                                <div className="dropdown-menu">
                                    <a className="dropdown-item" href="#"><img className="img-fluid" src="img/flag.png"
                                        alt="Flag" /></a>
                                    <a className="dropdown-item" href="#"><img className="img-fluid" src="img/flag.png"
                                        alt="Flag" /></a>
                                    <a className="dropdown-item" href="#"><img className="img-fluid" src="img/flag.png"
                                        alt="Flag" /></a>
                                </div>
                            </div> */}
                            {/* <div className="mobile login-signup">
                                <div className="account-dropdown btn-group">
                                    <button type="button" className="btn dropdown-toggle" data-toggle="dropdown"
                                        aria-haspopup="true" aria-expanded="false">
                                        <span className="img fa fa-user"></span>Humaz
                                    </button>
                                    <div className="dropdown-menu">
                                        <a href="dashboard.html" className="dropdown-item active" role="button">Profile</a>
                                        <a href="messages.html" className="dropdown-item" role="button">Messages</a>
                                        <a href="create-store.html" className="dropdown-item" role="button">Create a Store</a>
                                        <a href="#" className="dropdown-item" role="button">Disconnect my wallet</a>
                                        <a href="#" className="dropdown-item" role="button">Help</a>
                                        <a href="#" className="dropdown-item" role="button">Log out</a>
                                        <a href="#" className="dropdown-item" role="button">Suggest a feature</a>
                                    </div>
                                </div>
                            </div> */}
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    )
}

export default Header