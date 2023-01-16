import { GET_FIAT_CURRENCY } from './fiatCurrencyTypes';

const initialState = {
   fiatCurrencies: []
}

const fiatCurrencyReducer = (state = initialState, action) => {
   switch (action.type) {
      case GET_FIAT_CURRENCY:
         return {
            ...state,
            fiatCurrencies: action.payload
         }
      default:
         return state
   }
}

export default fiatCurrencyReducer;
