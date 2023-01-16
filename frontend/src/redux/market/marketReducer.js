import { GET_LIVE_CURRENCIES } from './marketTypes';

const initialState = {
   liveCurrencies: [],
   success: false,
   error: false
}

const marketReducer = (state = initialState, action) => {
   switch (action.type) {
      case GET_LIVE_CURRENCIES:
         return {
            ...state,
            liveCurrencies: action.payload
         }
      default:
         return state
   }
}

export default marketReducer
