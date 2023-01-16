import { GET_WITHDRAW_FEE, RESET_WITHDRAW_FEE } from './withdrawFeeTypes';

const initialState = {
   withdrawFee: [],
   success: false,
   fetched: false
};

const withdrawFeeReducer = (state = initialState, action) => {
   switch (action.type) {
      case GET_WITHDRAW_FEE:
         return {
            ...state,
            withdrawFee: action.payload,
            success: true
         }
      case RESET_WITHDRAW_FEE:
         return {
            ...state,
            withdrawFee: [],
            success: false
         }
      default:
         return state
   }
}
export default withdrawFeeReducer
