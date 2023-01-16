import {
   GET_ADMIN_BANK_ACCOUNTS,
   GET_ADMIN_BANK_ACCOUNT,
   ADD_ADMIN_BANK_ACCOUNT,
   EDIT_ADMIN_BANK_ACCOUNT,
   DELETE_ADMIN_BANK_ACCOUNT,
   SET_DEFAULT_ADMIN_BANK_ACCOUNT,
   TOGGLE_STATE,
   ERROR_STATE
} from "./adminBankAccountTypes";

const initialState = {
   adminBankAccounts: [],
   adminBankAccount: {},
   adminBankAccountsfetched: false,
   adminBankAccountAdded: false,
   adminBankAccountfetched: false,
   adminBankAccountEditted: false,
   adminBankAccountDeleted: false,
   adminBankAccountDefaultSet: false,
   error: false
}

const adminBankAccountReducer = (state = initialState, action) => {
   switch (action.type) {
      case GET_ADMIN_BANK_ACCOUNTS:
         return {
            ...state,
            adminBankAccounts: action.payload,
            adminBankAccountsfetched: true
         }
      case GET_ADMIN_BANK_ACCOUNT:
         return {
            ...state,
            adminBankAccount: action.payload,
            adminBankAccountfetched: true
         }
      case ADD_ADMIN_BANK_ACCOUNT:
         return {
            ...state,
            adminBankAccounts: [state.adminBankAccounts, action.payload],
            adminBankAccountAdded: true
         }
      case EDIT_ADMIN_BANK_ACCOUNT:
         return {
            ...state,
            adminBankAccount: action.payload,
            adminBankAccountEditted: true
         }
      case DELETE_ADMIN_BANK_ACCOUNT:
         return {
            ...state,
            adminBankAccounts: state.adminBankAccounts.filter(item => item._id !== action.payload),
            adminBankAccountDeleted: true
         }
      case SET_DEFAULT_ADMIN_BANK_ACCOUNT:
         return {
            ...state,
            adminBankAccountDefaultSet: true
         }
      case TOGGLE_STATE:
         return {
            ...state,
            adminBankAccountsfetched: false,
            adminBankAccountAdded: false,
            adminBankAccountfetched: false,
            adminBankAccountEditted: false,
            adminBankAccountDeleted: false,
            adminBankAccountDefaultSet: false,
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

export default adminBankAccountReducer;
