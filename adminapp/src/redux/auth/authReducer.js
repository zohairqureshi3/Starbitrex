import { REGISTER_USER, LOGIN_ADMIN, REGISTER_SUB_ADMIN, TOGGLE_STATE, ERROR_STATE } from './authTypes';

const initialState = {
   user: [],
   subAdmin: [],
   success: false,
   registered: false,
   error: false
}

const authReducer = (state = initialState, action) => {
   switch (action.type) {
      case REGISTER_SUB_ADMIN:
         return {
            ...state,
            subAdmin: action.payload,
            success: true,
            registered: true
         }
      case REGISTER_USER:
         return {
            ...state,
            user: action.payload,
            success: true,
            registered: true,
            error: false
         }
      case LOGIN_ADMIN:
         return {
            ...state,
            isLoggedIn: true,
            user: action.payload
         }
      case TOGGLE_STATE:
         return {
            ...state,
            registered: false,
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

export default authReducer
