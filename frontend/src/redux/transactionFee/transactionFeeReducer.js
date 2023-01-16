import { GET_TRANSACTION_FEE, RESET_TRANSACTION_FEE } from './transactionFeeTypes';

const initialState = {
   transactionFee: [],
   success: false,
   fetched: false
};

const transactionFeeReducer = (state = initialState, action) => {
   switch (action.type) {
      case GET_TRANSACTION_FEE:
         return {
            ...state,
            transactionFee: action.payload,
            success: true
         }
      case RESET_TRANSACTION_FEE:
         return {
            ...state,
            transactionFee: [],
            success: false
         }
      default:
         return state
   }
}
export default transactionFeeReducer
