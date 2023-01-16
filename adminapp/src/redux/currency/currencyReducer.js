import {
   SHOW_ALL_CURRENCIES, ADD_CURRENCY, DELETE_CURRENCY, EDIT_CURRENCY, GET_CURRENCY, WALLET_CURRENCIES,
   TOGGLE_STATE, ERROR_STATE
} from './currencyTypes';

const initialState = {
   currencies: [],
   walletCurrencies: [],
   success: false,
   fetched: false,
   error: false,
   currencyAdded: false,
   currencyEditted: false
}

const currencyReducer = (state = initialState, action) => {
   switch (action.type) {
      case SHOW_ALL_CURRENCIES:
         return {
            ...state,
            currencies: action.payload,
            success: true,
            fetched: true,
            currencyEditted: false,
            currencyAdded: false
         }
      case GET_CURRENCY:
         return {
            ...state,
            currencies: action.payload,
            currencyEditted: false,
            currencyAdded: false
         }
      case ADD_CURRENCY:
         return {
            ...state,
            currencies: [state.currencies, action.payload],
            success: true,
            currencyEditted: false,
            currencyAdded: true
         }
      case DELETE_CURRENCY:
         return {
            ...state,
            currencies: action.payload,
            success: true,
            currencyEditted: false,
            currencyAdded: false
         }
      case EDIT_CURRENCY:
         return {
            ...state,
            currencies: action.payload,
            currencyEditted: true,
            currencyAdded: false
         }
      case WALLET_CURRENCIES:
         return {
            ...state,
            walletCurrencies: action.payload,
            currencyEditted: false,
            currencyAdded: false
         }
      case TOGGLE_STATE:
         return {
            ...state,
            success: false,
            error: false,
            currencyEditted: false,
            currencyAdded: false
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

export default currencyReducer
