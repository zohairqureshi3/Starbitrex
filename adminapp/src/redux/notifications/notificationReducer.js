import { DISPLAY_UNREAD_NOTIFICATIONS,DISPLAY_NOTIFICATIONS } from './notificationTypes';

const initialState = {
   notifications: [],
   unreadNotifications: [],
   success: false,
   fetched: false,
   error: false
};

const notificationReducer = (state = initialState, action) => {
   switch (action.type) {
      case DISPLAY_UNREAD_NOTIFICATIONS:
         return {
            ...state,
            unreadNotifications: action.payload.notifications,
            success: false,
            fetched: true
         }
      case DISPLAY_NOTIFICATIONS:
         return {
            ...state,
            notifications: action.payload.notifications,
            success: false,
            fetched: true
         }         
      default:
         return state
   }
}
export default notificationReducer
