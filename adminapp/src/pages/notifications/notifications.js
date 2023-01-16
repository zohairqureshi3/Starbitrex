import React from 'react'
import UserPlaceholder from '../../assets/images/user-placeholder.jpg';
import placeholder from '../../assets/images/placeholder.jpg';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import socketIOClient from "socket.io-client";
import { displayNotifications } from '../../redux/notifications/notificationActions';

const socketURL = process.env.REACT_APP_SOCKET_URL;

const Notifications = () => {

    // const getNotifications = useSelector((state) => state.notification?.notifications);
    const [notification, setNotification] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        // dispatch(displayNotifications())
        const socket = socketIOClient(socketURL);
        socket.emit("emitAllNotificationRequest",'all');
        socket.on("onAllNotificationResponse", data => {
            console.log(data,"socket Hit notification page data")
            setNotification(data)
        });
    }, [])

    // useEffect(() => {
    //     setNotification(getNotifications)
    // }, [getNotifications])

    return (
        <div className='notifications-page content-wrapper right-content-wrapper'>
            <div className="content-box">
                <div className="d-flex justify-content-between dashboard-localhost-add">
                    <h3>Notifications</h3>
                </div>
                <div className='notifications-section'>
                    {
                        notification?.length && notification.length > 0 ? notification.map((i,index) => 
                            <div className={`notification d-flex align-items-center ${(i.isRead === false ? 'active' : '')}`} key={i.id}>
                                <div className='noti-img'>
                                    <img className='img-fluid' src={i?.user?.profileImage ? `${process.env.REACT_APP_SERVER_URL}/images/${i?.user?.profileImage}`: UserPlaceholder} alt="" />
                                </div>
                                
                                <div className='noti-content'>
                                    <h5><Link to={`/admin${i.redirectUrl}`} className="d-inline">{i.name}</Link></h5>
                                    <h6 className='status'>{i.message}</h6>
                                    <span className='date text-white'>{moment(i.createdAt).format('LLL')}</span>
                                </div>
                                {/* <div className='noti-last-img'>
                                    <img className='img-fluid' src={placeholder} alt="" />
                                </div> */}
                            </div> 
                        )
                        :
                        <div className='empty-container'>
                            <span>No Notifications Found</span>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default Notifications