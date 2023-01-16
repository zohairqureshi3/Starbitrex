import { EDIT_USER, SET_USER, CHANGE_PASS, GET_USER, CHANGE_2FA, CLEAR_2FA, GET_COUNTRIES, GET_USER_ANALYTICS } from './userTypes';

const initialState = {
   user: [],
   countries: [],
   userAnalytics: {},
   passChanged: false,
   authChanged: false,
   countriesFetched: false,
   userAnalyticsFetched: false
}

const userReducer = (state = initialState, action) => {
   switch (action.type) {
      case GET_USER:
         return {
            ...state,
            user: action.payload
         }
      case GET_USER_ANALYTICS:
         return {
            ...state,
            userAnalytics: action.payload,
            userAnalyticsFetched: true
         }
      case EDIT_USER:
         return {
            ...state,
            user: action.payload
         }
      case SET_USER:
         return {
            ...state,
            user: action.payload
         }
      case CHANGE_PASS:
         return {
            ...state,
            passChanged: true
         }
      case CHANGE_2FA:
         return {
            ...state,
            authChanged: true
         }
      case CLEAR_2FA:
         return {
            ...state,
            authChanged: false
         }
      case GET_COUNTRIES:
         return {
            ...state,
            countries: action.payload,
            countriesFetched: true
         }
      default:
         return state
   }
}

export default userReducer
