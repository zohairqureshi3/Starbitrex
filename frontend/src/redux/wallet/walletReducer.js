import { GET_WALLET, CREATE_WALLET } from './RequestTypes';

const initialState = {
   wallet: [],
   success: false
}

const walletReducer = (state = initialState, action) => {
   switch (action.type) {
      case GET_WALLET:
         return {
            ...state,
            wallet: action.payload.wallet,
            success: action.payload.success
         }
      case CREATE_WALLET:
         return {
            ...state,
            wallet: action.payload.wallet,
            success: action.payload.success
         }
      default:
         return state
   }
}

export default walletReducer
