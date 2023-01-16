import { DISPLAY_TRANSACTIONS,DISPLAY_ALL_ADMIN_DEPOSITS } from './transactionTypes';

const initialState = {
   transactions: [],
   allAdminDeposits: [],
   fetched: false
};

const transactionReducer = (state = initialState, action) => {
   switch (action.type) {
      case DISPLAY_TRANSACTIONS:
         return {
            ...state,
            transactions: action.payload.transactions,
            fetched: true
         }
         case DISPLAY_ALL_ADMIN_DEPOSITS:
         return {
            ...state,
            allAdminDeposits: action.payload,
            fetched: true
         }
      default:
         return state
   }
}

export default transactionReducer
