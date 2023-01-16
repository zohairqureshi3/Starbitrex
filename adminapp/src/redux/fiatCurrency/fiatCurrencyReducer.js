import {
   SHOW_ALL_FIAT_CURRENCIES, ADD_FIAT_CURRENCY, DELETE_FIAT_CURRENCY, EDIT_FIAT_CURRENCY, GET_FIAT_CURRENCY, TOGGLE_STATE, ERROR_STATE
} from './fiatCurrencyTypes';

const initialState = {
   fiatCurrencies: [],
   success: false,
   fetched: false,
   error: false,
}

const fiatCurrencyReducer = (state = initialState, action) => {
   switch (action.type) {
      case SHOW_ALL_FIAT_CURRENCIES:
         return {
            ...state,
            fiatCurrencies: action.payload,
            success: true,
            fetched: true
         }
      case GET_FIAT_CURRENCY:
         return {
            ...state,
            fiatCurrencies: action.payload
         }
      case ADD_FIAT_CURRENCY:
         return {
            ...state,
            fiatCurrencies: [state.fiatCurrencies, action.payload],
            success: true
         }
      case DELETE_FIAT_CURRENCY:
         return {
            ...state,
            fiatCurrencies: action.payload,
            success: true
         }
      case EDIT_FIAT_CURRENCY:
         return {
            ...state,
            fiatCurrencies: action.payload
         }
      case TOGGLE_STATE:
         return {
            ...state,
            success: false,
            fetched: false,
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

export default fiatCurrencyReducer;
