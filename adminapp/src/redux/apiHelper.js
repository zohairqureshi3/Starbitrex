import axios from "axios";
import { ENV } from '../config/config';
import { toast } from 'react-toastify';
import socketIOClient from "socket.io-client";

const baseUrl = ENV.serverUrl


async function apiHelper(apiType, path, data, params) {
    if (baseUrl == undefined || !baseUrl) {
        baseUrl = ""
    }
    const xauthtoken = JSON.parse(localStorage.getItem("token"))

    if (apiType == "post" || apiType == "put" || apiType == "get" || apiType == "delete") {
        try {
            let response = await axios({
                method: apiType,
                url: `${baseUrl + path}`,
                data
                // headers: {
                //     'x-access-token': xauthtoken,
                //     'x-auth-token': ENV.x_auth_token
                // }
            })
            return response
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
    // else if (apiType == "get" || apiType == "delete") {
    //     // return new Promise(function (resolve, reject) {
    //     return axios({
    //         method: apiType,
    //         url: `${ baseUrl + path}`,
    //         data,
    //         headers: {
    //             'x-access-token': xauthtoken,
    //             'x-auth-token': ENV.x_auth_token
    //         }
    //     }).then(res => {

    //         return res;

    //     }).catch(err => {
    //         toast.error(err)
    //     }
    //     );
    //     // })
    // }
}

function listUnreadNotification() {

    const socketURL = process.env.REACT_APP_SOCKET_URL;
    const socket = socketIOClient(socketURL);
    socket.on("connect", () => {
        console.log("Socket id is -->: onNotificationResponse ", socket.id);
    });
    socket.emit("emitNotificationRequest");
}

export { apiHelper, listUnreadNotification };
