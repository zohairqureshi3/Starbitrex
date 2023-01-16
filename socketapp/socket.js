require('dotenv').config();

const express = require("express");
const socket = require("socket.io");
const Binance = require('node-binance-api');
var mongoose = require('mongoose');
const cors = require("cors");
const Notification = require('./Model/notifications')


const binance = new Binance().options({
    APIKEY: process.env.BINANCE_API_KEY,
    APISECRET: process.env.BINANCE_API_SECRET,
    useServerTime: false,
    recvWindow: 2000,
});


// App setup
const PORT = 4000;
// const PORT = process.env.PORT;

const app = express();
const server = app.listen(PORT, function () {
    console.log(`Ready on port: ${PORT}`);
});
const coins = ['ETHUSDT', 'LINKUSDT', 'AVAXUSDT', 'DOGEUSDT', 'BCHUSDT', 'LTCUSDT', 'TRXUSDT', 'BNBUSDT', 'ADAUSDT', 'BTCUSDT'];

app.use(cors());

// Socket setup
// const io = socket(server);

const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});

io.on("connection", function (socket) {

    console.log("Socket Connected");


    socket.on("getTickerDataRequest", function (pairName) {
        binance.futuresTickerStream(pairName, (ticketData) => {
            io.emit("getTickerDataResponse" + pairName, ticketData);
        });
    });



    socket.on("getBinanceMarketDepthRequest", function (pairName) {
        binance.websockets.depth(pairName, (depth) => {
            io.emit("getBinanceMarketDepthRequest" + pairName, depth);
        });
    });

    socket.on("getCurrentMarketPriceRequest", function (pairName) {
        binance.futuresMarkPriceStream((responseArray) => {
            let data = responseArray?.filter(responseArrayIndex => coins.includes(responseArrayIndex.symbol))?.map(elem => {
                return {
                    "symbol": elem.symbol,
                    "markPrice": elem.markPrice
                }
            })
            io.emit("getCurrentMarketPriceResponse" + pairName, data);
        });
    });

    socket.on("getBinanceFutureTradesRequest", function (pairName) {
        binance.websockets.trades(pairName, (trades) => {
            io.emit("getBinanceFutureTradesRequestResponse" + pairName, trades);
        });
    });

    socket.on("getBinanceMarketChangeRequest", function (pairArray) {
        binance.websockets.prevDay(pairArray, (error, response) => {
            if (response && response.symbol && response.close && response.percentChange) {
                let data = { symbol: response.symbol, price: response.close, change: (response.percentChange + "%") }
                io.emit("getBinanceMarketChangeRequestResponse", data);
            } else {
                io.emit("getBinanceMarketChangeRequestError", { stauts: false, msg: "failed to get data from getBinanceMarketChangeRequest" });
            }
        });
    });

    //unread notifictions
    socket.on("emitNotificationRequest", async function (req) {
        console.log("emitNotificationRequest")
        let results = await Notification.find({ isRead: false }).sort({ createdAt: -1 });
        io.emit("onNotificationResponse", results);
    });
    // all notifications
    socket.on("emitAllNotificationRequest", async function (req) {
        
        let results = await Notification.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true
                }
            }
        ]).sort({ createdAt: -1 });


        //let results = await Notification.find({}).sort({ createdAt: -1 });
        io.emit("onAllNotificationResponse", results);
    });

});

io.on("connect_timeout", function () {
    console.log("Socket giving connect_timeout: ")
});



io.on("disconnect", function (socket) {

    console.log("Disconnected Socket Id: ", socket)
    //   binance.websockets.depth(pairName, (depth) => {
    //     // 1- Add connectedFlat on.Connection and on.disconnected in DB
    //     // 2- Get User orders from DB on the bases of user ID. (Pending and Processing Orders only)
    //     // 3- Sort Socket Data and get Highest Selling rate and Lowest Buying rate
    //     // 4- Compare values with Binance Socket. if it's done, hit the backend function accordingly
    //     // 5- Match ==== Liquidity Price, TPSL, Trailing Stop
    //     // 6- Remove that order from the array of all records.
    //   });
});




//== 2 - SET UP DATABASE
//Configure mongoose's promise to global promise

mongoose.promise = global.Promise;

mongoose.connect(process.env.MONGO_LOCAL_CONN_URL);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
    console.log("Connected successfully");
});