const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NetworkSchema = new Schema({

    id: Number,
    name: {
        type: String,
        required: 'Network name is required',
        trim: true
    },
    symbol: {
        type: String,
        required: 'Network symbol is required',
        trim: true
    },
    chainId: {
        type: String,
        // required: 'Chain Id is required',
        required: false,
        trim: true
    },
    rpcURL: {
        type: [String],
        // required: 'RPC URL is required',
        required: false,
        trim: true
    },
    multicallAddress: {
        type: String,
        required: false,
        trim: true
    },
    type: { // EVM, BTC
        type: String,
        // required: 'Type is required',
        required: false,
        trim: true
    },
    explorerURL: {
        type: String,
        required: false,
        trim: true
    },
    currencyIds: {  // We may remove it in future.
        type: [mongoose.Types.ObjectId],
        ref: 'currencies',
        required: true,
    },
    isEVM: {
        type: Boolean,
        required: true,
        default: false
    },
    isTestnet: {
        type: Boolean,
        required: true,
        default: false
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    }
}, { timestamps: true });


module.exports = mongoose.model('Network', NetworkSchema);