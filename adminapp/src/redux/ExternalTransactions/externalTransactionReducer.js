import { DISPLAY_EXTERNAL_TRANSACTIONS, GET_PENDING_WITHDRAWS, APPROVE_PENDING_TRANSACTION, WITHDRAW_CURRENCY, ERROR_STATE, TOGGLE_STATE, DECLINE_EXTERNAL_TRANSACTION } from './externalTransactionTypes';

const initialState = {
   resolvedTransactions: [],
   pendingWithdraws: [],
   withdrawCurrencies: [],
   success: false,
   error: false,
   withdrawn: false
}

const ExternalTransactionReducer = (state = initialState, action) => {
   switch (action.type) {
      case DISPLAY_EXTERNAL_TRANSACTIONS:
         return {
            ...state,
            resolvedTransactions: action.payload,
            success: true
         }

      case DECLINE_EXTERNAL_TRANSACTION:
         return {
            ...state,
            pendingWithdraws: action.payload,
            success: true
         }
      case GET_PENDING_WITHDRAWS:
         return {
            ...state,
            pendingWithdraws: action.payload,
            success: true
         }
      case APPROVE_PENDING_TRANSACTION:
         return {
            ...state,
            pendingWithdraws: action.payload
         }
      case WITHDRAW_CURRENCY:
         return {
            ...state,
            withdrawCurrencies: action.payload,
            withdrawn: true
         }
      case ERROR_STATE:
         return {
            ...state,
            error: true
         }
      case TOGGLE_STATE:
         return {
            ...state,
            error: false
         }
      default:
         return state
   }
}

export default ExternalTransactionReducer