import { ADD_WALLET, GET_WALLETS, DELETE_WALLET } from './externalWalletTypes';

const initialState = {
   externalWallets: [],
   externalWallet: [],
   success: false
}

const externalWalletReducer = (state = initialState, action) => {
   switch (action.type) {
      case ADD_WALLET:
         return {
            ...state,
            externalWallets: action.payload.externalWallet,
            externalWallet: action.payload,
            success: action.payload.success
         }
      case GET_WALLETS:
         return {
            ...state,
            externalWallets: action.payload.externalWallet,
            success: action.payload.success
         }
      case DELETE_WALLET:
         return {
            ...state,
            externalWallets: action.payload.externalWallet,
            success: action.payload.success
         }
      default:
         return state
   }
}

export default externalWalletReducer
