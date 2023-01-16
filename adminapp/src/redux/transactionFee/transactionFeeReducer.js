import {
   DISPLAY_TRANSACTION_FEE, SET_TRANSACTION_FEE, GET_TRANSACTION_FEE, DELETE_TRANSACTION_FEE,
   EDIT_TRANSACTION_FEE, TOGGLE_STATE, ERROR_STATE
} from './transactionFeeTypes';

const initialState = {
   transactionFee: [],
   txFee: null,
   success: false,
   fetched: false,
   error: false
};

const transactionFeeReducer = (state = initialState, action) => {
   switch (action.type) {
      case DISPLAY_TRANSACTION_FEE:
         return {
            ...state,
            transactionFee: action.payload,
            success: false,
            fetched: true
         }
      case SET_TRANSACTION_FEE:
         return {
            ...state,
            transactionFee: action.payload,
            success: true
         }
      case GET_TRANSACTION_FEE:
         return {
            ...state,
            txFee: action.payload.transactionManagement[0]
         }
      case EDIT_TRANSACTION_FEE:
         return {
            ...state,
            transactionFee: action.payload,
            success: true
         }
      case DELETE_TRANSACTION_FEE:
         return {
            ...state,
            transactionFee: action.payload,
            success: true
         }
      case TOGGLE_STATE:
         return {
            ...state,
            fetched: false,
            success: false,
            error: false
         }
      case ERROR_STATE:
         return {
            ...state,
            error: true
         }
      default:
         return state
   }
}
export default transactionFeeReducer
