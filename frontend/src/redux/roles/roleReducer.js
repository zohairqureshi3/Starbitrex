import { DISPLAY_ROLES, GET_ROLE } from './roleTypes';

const initialState = {
   roles: [],
   role: [],
   allPermissions: [],
   success: false
};

const roleReducer = (state = initialState, action) => {
   switch (action.type) {
      case DISPLAY_ROLES:
         return {
            ...state,
            roles: action.payload,
            success: false
         }
      case GET_ROLE:
         return {
            ...state,
            role: action.payload.role,
            allPermissions: action.payload.allPermissions
         }
      default:
         return state
   }
}
export default roleReducer
