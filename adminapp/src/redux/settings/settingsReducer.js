import { SHOW_ALL_SETTING, ADD_SETTING, DELETE_SETTING, EDIT_SETTING, GET_SETTING, WALLET_CURRENCIES } from './settingsTypes';

const initialState = {
   settings: [],
   success: false,
   fetched: false
}

const settingsReducer = (state = initialState, action) => {
   switch (action.type) {
      case SHOW_ALL_SETTING:
         return {
            ...state,
            settings: action.payload,
            success: false,
            fetched: true
         }
      case GET_SETTING:
         return {
            ...state,
            settings: action.payload
         }
      case ADD_SETTING:
         return {
            ...state,
            settings: [state.settings, action.payload],
            success: true
         }
      case DELETE_SETTING:
         return {
            ...state,
            settings: action.payload,
            success: true
         }
      case EDIT_SETTING:
         return {
            ...state,
            settings: action.payload
         }
      case WALLET_CURRENCIES:
         return {
            ...state,
            walletSettings: action.payload
         }
      default:
         return state
   }
}

export default settingsReducer
