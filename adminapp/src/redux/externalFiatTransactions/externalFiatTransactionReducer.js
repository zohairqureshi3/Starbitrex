import { DISPLAY_EXTERNAL_FIAT_TRANSACTIONS, GET_PENDING_FIAT_WITHDRAWS, APPROVE_PENDING_FIAT_TRANSACTION, WITHDRAW_FIAT_CURRENCY, ERROR_FIAT_STATE, TOGGLE_FIAT_STATE, RESOLVE_USER_FIAT_TRANSACTION } from './externalFiatTransactionTypes';

const initialState = {
   resolvedFiatTransactions: [],
   pendingFiatWithdraws: [],
   withdrawFiatCurrencies: [],
   success: false,
   error: false,
   fiatWithdrawn: false
}

const ExternalFiatTransactionReducer = (state = initialState, action) => {
   switch (action.type) {
      case DISPLAY_EXTERNAL_FIAT_TRANSACTIONS:
         return {
            ...state,
            resolvedFiatTransactions: action.payload,
            success: true
         }
      case GET_PENDING_FIAT_WITHDRAWS:
         return {
            ...state,
            pendingFiatWithdraws: action.payload,
            success: true
         }
      case APPROVE_PENDING_FIAT_TRANSACTION:
         return {
            ...state,
            pendingFiatWithdraws: action.payload
         }
      case WITHDRAW_FIAT_CURRENCY:
         return {
            ...state,
            withdrawFiatCurrencies: action.payload,
            fiatWithdrawn: true
         }
      case ERROR_FIAT_STATE:
         return {
            ...state,
            error: true
         }
      case TOGGLE_FIAT_STATE:
         return {
            ...state,
            error: false
         }
      case RESOLVE_USER_FIAT_TRANSACTION:
         return{
            ...state,
            fiatWithdrawn: true
         }
      default:
         return state
   }
}

export default ExternalFiatTransactionReducer