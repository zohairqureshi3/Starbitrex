import { GET_CURRENCY, TOGGLE_STATE } from './currencyTypes';

const initialState = {
   currencies: [],
   currenciesFetched: false
}

const currencyReducer = (state = initialState, action) => {
   switch (action.type) {
      case GET_CURRENCY:
         return {
            ...state,
            currencies: action.payload,
            currenciesFetched: true
         }
      case TOGGLE_STATE:
         return {
            ...state,
            currenciesFetched: false
         }
      default:
         return state
   }
}

export default currencyReducer
