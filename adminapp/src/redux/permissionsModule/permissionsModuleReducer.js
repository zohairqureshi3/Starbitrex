import { ADD_PERMISSIONS_MODULE, DISPLAY_PERMISSIONS_MODULES, DISPLAY_MODULES_WITH_PERMISSIONS, DELETE_PERMISSIONS_MODULE, TOGGLE_STATE, ERROR_STATE } from './permissionsModuleTypes';

const initialState = {
   permissionsModules: [],
   success: false,
   fetched: false,
   error: false
};

const permissionsModuleReducer = (state = initialState, action) => {
   switch (action.type) {
      case DISPLAY_PERMISSIONS_MODULES:
         return {
            ...state,
            permissionsModules: action.payload.permissionsModules,
            success: false,
            fetched: true
         }
      case DISPLAY_MODULES_WITH_PERMISSIONS:
         return {
            ...state,
            modulesWithPermissions: action.payload.modulesWithPermissions,
            success: false,
            fetched: true
         }
      case ADD_PERMISSIONS_MODULE:
         return {
            ...state,
            permissionsModules: action.payload.permissionsModules,
            fetched: true,
            success: true
         }
      case DELETE_PERMISSIONS_MODULE:
         return {
            ...state,
            permissionsModules: action.payload.permissionsModules,
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
export default permissionsModuleReducer
