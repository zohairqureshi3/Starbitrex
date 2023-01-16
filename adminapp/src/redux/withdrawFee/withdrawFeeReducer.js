import {
   DISPLAY_WITHDRAW_FEE, SET_WITHDRAW_FEE, GET_WITHDRAW_FEE, DELETE_WITHDRAW_FEE,
   EDIT_WITHDRAW_FEE, TOGGLE_STATE, ERROR_STATE
} from './withdrawFeeTypes';

const initialState = {
   withdrawFee: [],
   txFee: null,
   success: false,
   fetched: false,
   error: false
};

const withdrawFeeReducer = (state = initialState, action) => {
   switch (action.type) {
      case DISPLAY_WITHDRAW_FEE:
         return {
            ...state,
            withdrawFee: action.payload,
            success: false,
            fetched: true
         }
      case SET_WITHDRAW_FEE:
         return {
            ...state,
            withdrawFee: action.payload,
            success: true
         }
      case GET_WITHDRAW_FEE:
         return {
            ...state,
            withdrawFee: action.payload
         }
      case EDIT_WITHDRAW_FEE:
         return {
            ...state,
            withdrawFee: action.payload,
            success: true
         }
      case DELETE_WITHDRAW_FEE:
         return {
            ...state,
            withdrawFee: action.payload,
            success: true
         }
      case TOGGLE_STATE:
         return {
            ...state,
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
export default withdrawFeeReducer
