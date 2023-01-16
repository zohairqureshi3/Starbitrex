import { GET_BANK_TRANSACTION, GET_BANK_WITHDRAWS, ADD_BANK_TRANSACTION, CLEAR_BANK_TRANSACTION, TRANSACTION_BANK_ERROR } from './externalBankTransactionTypes';

const initialState = {
    bankTransactions: [],
    bankTransaction: [],
    deposits: [],
    bankWithdraws: [],
    success: false,
    error: false,
    bankWithdrawn: false,
    bankWithdrawMessage: ''
}

const ExternalBankTransactionReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_BANK_TRANSACTION:
            return {
                ...state,
                bankTransactions: action.payload,
                error: false
            }
        //   case GET_DEPOSITS:
        //      return {
        //         ...state,
        //         deposits: action.payload,
        //         error: false
        //      }
        case GET_BANK_WITHDRAWS:
            return {
                ...state,
                bankWithdraws: action.payload,
                error: false
            }
        case ADD_BANK_TRANSACTION:
            return {
                ...state,
                bankTransaction: action.payload,
                bankWithdrawn: true,
                error: false,
                bankWithdrawMessage: action.payload.message
            }
        case CLEAR_BANK_TRANSACTION:
            return {
                ...state,
                bankWithdrawn: false,
                bankWithdrawMessage: '',
                bankTransaction: [],
                error: false
            }
        case TRANSACTION_BANK_ERROR:
            return {
                ...state,
                error: true
            }
        default:
            return state
    }
}

export default ExternalBankTransactionReducer