import { GET_ACCOUNT, TRANSFER, CLEAR } from './accountTypes';

const initialState = {
   account: [],
   success: false,
   accountFetched: false,
   amountTransferred: false
}

const AccountReducer = (state = initialState, action) => {
   switch (action.type) {
      case GET_ACCOUNT:
         return {
            ...state,
            account: action.payload,
            accountFetched: true,
            amountTransferred: false
         }
      case TRANSFER:
         return {
            ...state,
            amountTransferred: true
         }
      case CLEAR:
         return {
            ...state,
            success: false,
            accountFetched: false,
            amountTransferred: false
         }
      default:
         return state
   }
}

export default AccountReducer
