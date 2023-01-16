import { GET_TRANSACTION, GET_DEPOSITS, GET_WITHDRAWS, ADD_TRANSACTION, CLEAR_TRANSACTION, TRANSACTION_ERROR } from './externalTransactionTypes';

const initialState = {
   transactions: [],
   transaction: [],
   deposits: [],
   withdraws: [],
   success: false,
   error: false,
   withdrawn: false,
   withdrawMessage: ''
}

const ExternalTransactionReducer = (state = initialState, action) => {
   switch (action.type) {
      case GET_TRANSACTION:
         return {
            ...state,
            transactions: action.payload,
            error: false
         }
      case GET_DEPOSITS:
         return {
            ...state,
            deposits: action.payload,
            error: false
         }
      case GET_WITHDRAWS:
         return {
            ...state,
            withdraws: action.payload,
            error: false
         }
      case ADD_TRANSACTION:
         return {
            ...state,
            transaction: action.payload,
            withdrawn: true,
            error: false,
            withdrawMessage: action.payload.message
         }
      case CLEAR_TRANSACTION:
         return {
            ...state,
            withdrawn: false,
            withdrawMessage: '',
            transaction: [],
            error: false
         }
      case TRANSACTION_ERROR:
         return {
            ...state,
            error: true
         }
      default:
         return state
   }
}

export default ExternalTransactionReducer
