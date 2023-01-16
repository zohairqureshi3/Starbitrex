import { GET_FIAT_TRANSACTION, GET_FIAT_WITHDRAWS, ADD_FIAT_TRANSACTION, CLEAR_FIAT_TRANSACTION, TRANSACTION_FIAT_ERROR } from './externalFiatTransactionTypes';

const initialState = {
   fiatTransactions: [],
   fiatTransaction: [],
   deposits: [],
   fiatWithdraws: [],
   success: false,
   error: false,
   fiatWithdrawn: false,
   fiatWithdrawMessage: ''
}

const ExternalFiatTransactionReducer = (state = initialState, action) => {
   switch (action.type) {
      case GET_FIAT_TRANSACTION:
         return {
            ...state,
            fiatTransactions: action.payload,
            error: false
         }
    //   case GET_DEPOSITS:
    //      return {
    //         ...state,
    //         deposits: action.payload,
    //         error: false
    //      }
      case GET_FIAT_WITHDRAWS:
         return {
            ...state,
            fiatWithdraws: action.payload,
            error: false
         }
      case ADD_FIAT_TRANSACTION:
         return {
            ...state,
            fiatTransaction: action.payload,
            fiatWithdrawn: true,
            error: false,
            fiatWithdrawMessage: action.payload.message
         }
      case CLEAR_FIAT_TRANSACTION:
         return {
            ...state,
            fiatWithdrawn: false,
            fiatWithdrawMessage: '',
            fiatTransaction: [],
            error: false
         }
      case TRANSACTION_FIAT_ERROR:
         return {
            ...state,
            error: true
         }
      default:
         return state
   }
}

export default ExternalFiatTransactionReducer