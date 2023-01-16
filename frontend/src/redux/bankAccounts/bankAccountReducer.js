import { ADD_BANK_ACCOUNT, GET_BANK_ACCOUNTS, DELETE_BANK_ACCOUNT, GET_DEFAULT_BANK_ACCOUNT } from "./bankAccountTypes";

const initialState = {
   bankAccounts: [],
   bankAccount: [],
   defaultBankAccount: {},
   success: false
}

const bankAccountReducer = (state = initialState, action) => {
   switch (action.type) {
      case ADD_BANK_ACCOUNT:
         return {
            ...state,
            bankAccounts: action.payload.bankAccount,
            bankAccount: action.payload,
            success: action.payload.success
         }
      case GET_BANK_ACCOUNTS:
         return {
            ...state,
            bankAccounts: action.payload.bankAccount,
            success: action.payload.success
         }
      case DELETE_BANK_ACCOUNT:
         return {
            ...state,
            bankAccounts: action.payload.bankAccount,
            success: action.payload.success
         }
      case GET_DEFAULT_BANK_ACCOUNT:
         return {
            ...state,
            defaultBankAccount: action.payload
         }
      default:
         return state
   }
}

export default bankAccountReducer