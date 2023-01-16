import axios from "axios";
import { ENV } from '../config/config';
import { toast } from 'react-toastify';
import socketIOClient from "socket.io-client";
let baseUrl = ENV.serverUrl


async function apiHelper(apiType, path, data) {
    // console.log("comminggggggggggggggggggggg", apiType, path, data);
    if (baseUrl == undefined || !baseUrl) {
        baseUrl = ""
    }
    const xauthtoken = JSON.parse(localStorage.getItem("token"))

    if (apiType == "post" || apiType == "put" || apiType == "get" || apiType == "delete") {
        // console.log("comminggggggggggggggggggggg2", baseUrl);

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

function exponentToNumber(getValueInPercentage) {
    
    if (getValueInPercentage.toString().includes('e') == true) {
        var exponentVal = ''
        if (getValueInPercentage.toString().includes('+') == true) {
            exponentVal = (getValueInPercentage.toString().split("+").slice(1)).join(":");
        } else if (getValueInPercentage.toString().includes('-') == true) {
            exponentVal = (getValueInPercentage.toString().split("-").slice(1)).join(":");
        }
        var value = new Number(getValueInPercentage); //1e-14
        getValueInPercentage = value.toFixed(exponentVal) //14
    }

    return getValueInPercentage;
}

function socketConnection() {

    const socketURL = process.env.REACT_APP_SOCKET_URL;
    const socket = socketIOClient(socketURL);
    socket.on("connect", () => {
        console.log("Socket id is -->: onNotificationResponse ", socket.id);
    });
    console.log("socket Hit")
    socket.emit("emitNotificationRequest");
    socket.emit("emitAllNotificationRequest");
}

// Number.prototype.noExponents = function() {
//     var data = String(this).split(/[eE]/);
//     if (data.length == 1) return data[0];
  
//     var z = '',
//       sign = this < 0 ? '-' : '',
//       str = data[0].replace('.', ''),
//       mag = Number(data[1]) + 1;
  
//     if (mag < 0) {
//       z = sign + '0.';
//       while (mag++) z += '0';
//       return z + str.replace(/^\-/, '');
//     }
//     mag -= str.length;
//     while (mag--) z += '0';
//     return str + z;
// }


export { apiHelper, exponentToNumber, socketConnection };
