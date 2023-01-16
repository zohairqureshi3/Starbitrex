import { REGISTER_USER, LOGIN_USER, TOGGLE_STATE } from './authTypes';

const initialState = {
   user: [],
   needPinCode: false
}

const authReducer = (state = initialState, action) => {
   switch (action.type) {
      case REGISTER_USER:
         return {
            ...state,
            user: action.payload,
            needPinCode: false
         }
      case LOGIN_USER:
         return {
            ...state,
            // isLoggedIn: true,
            user: action.payload,
            needPinCode: action.payload.needPinCode
         }
      case TOGGLE_STATE:
         return {
            ...state,
            needPinCode: false
         }
      default:
         return state
   }
}

export default authReducer
