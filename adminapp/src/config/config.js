// const CryptoJS = require("crypto-js");
const dataEncryptionKey = 'Rockey/Handsome/PrivateKey';

require('dotenv').config();
export const ENV = {
    appBaseUrl: process.env.REACT_APP_BASE_URL,
    serverUrl: process.env.REACT_APP_SERVER_URL,
    rinkybyTokenAddress: process.env.REACT_APP_RINKYBY_ETHERSCAN_TOKEN,
    Authorization: `Bearer ${process.env.REACT_APP_AUTHORIZATION}`,
    x_access_token: JSON.parse(localStorage.getItem("token")),
    x_auth_token: process.env.REACT_APP_X_AUTH_TOKEN,
    adminPrivateKey: process.env.REACT_APP_ADMIN_PRIVATE_KEY,
    saveItem: function (name, value) {
        localStorage.setItem(`${name}`, JSON.stringify(value));
    },
    removeItem: function (name) {
        localStorage.removeItem(name);
    },
    encryptUserData: function (data, token, id) {
        if (data) {
            localStorage.setItem('user', JSON.stringify(data));
            localStorage.setItem('userId', JSON.stringify(id));
        }
        if (token) {
            localStorage.setItem('token', JSON.stringify(token));
        }
        return true;
    },
    encryptAffUserData: function (data, token, id) {
        if (data) {
            localStorage.setItem('affUser', JSON.stringify(data));
            localStorage.setItem('affUserId', JSON.stringify(id));
        }
        if (token) {
            localStorage.setItem('affToken', JSON.stringify(token));
        }
        return true;
    },
    getUserKeys: function (keys = null) {
        let userData = localStorage.getItem('user');
        return userData;

    }, getToken: function () {
        let userData = localStorage.getItem('token');
        if (userData) {
            return userData;
        }
        return {};
    },
    getHeaders: function () {
        let token = JSON.parse(localStorage.getItem('token'));
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        };
        if (token) {
            headers["Authorization"] = "Bearer " + token;
            headers["access-token"] = token;
        }
        // if (isFormData) {
        //     delete headers["Accept"];
        //     delete headers["Content-Type"];
        // }
        return headers;
    }
    , logout: function () {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userId');
        localStorage.removeItem('WalletAddress');
    }
}