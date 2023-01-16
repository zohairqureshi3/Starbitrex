import { ADD_PERMISSION, DISPLAY_PERMISSIONS, DELETE_PERMISSION, TOGGLE_STATE, ERROR_STATE } from './permissionTypes';

const initialState = {
   permissions: [],
   success: false,
   fetched: false,
   error: false
};

const permissionReducer = (state = initialState, action) => {
   switch (action.type) {
      case DISPLAY_PERMISSIONS:
         return {
            ...state,
            permissions: action.payload.permissions,
            success: false,
            fetched: true
         }
      case ADD_PERMISSION:
         return {
            ...state,
            permissions: action.payload.permissions,
            fetched: true,
            success: true
         }
      case DELETE_PERMISSION:
         return {
            ...state,
            permissions: action.payload.permissions,
            success: true,
            fetched: true
         }
      case TOGGLE_STATE:
         return {
            fetched: false,
            success: false
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
export default permissionReducer
