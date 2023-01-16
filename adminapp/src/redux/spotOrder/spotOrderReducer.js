import { GET_SPOT_ORDER, GET_USER_SPOT_ORDER, ADD_SPOT_ORDER, STOP_SPOT_ORDER, CLEAR_SPOT_ORDER, SPOT_ORDER_ERROR, COMPLETE_ORDER } from './spotOrderTypes';

const initialState = {
   spotOrders: [],
   userSpotOrders: [],
   spotOrder: [],
   success: false,
   auto: false,
   error: false,
}

const SpotOrderReducer = (state = initialState, action) => {
   switch (action.type) {
      case GET_SPOT_ORDER:
         return {
            ...state,
            spotOrders: action.payload
         }
      case GET_USER_SPOT_ORDER:
         return {
            ...state,
            success: false,
            userSpotOrders: action.payload
         }
      case ADD_SPOT_ORDER:
         return {
            ...state,
            spotOrder: action.payload,
            success: true,
            error: false
         }
      case CLEAR_SPOT_ORDER:
         return {
            ...state,
            spotOrder: [],
            success: false,
            auto: false,
            error: false
         }
      case STOP_SPOT_ORDER:
         return {
            ...state,
            spotOrder: [],
            auto: true,
            error: false
         }
      case SPOT_ORDER_ERROR:
         return {
            ...state,
            error: true
         }
      case COMPLETE_ORDER:
         return {
            ...state,
            auto: true,
         }
      default:
         return state
   }
}

export default SpotOrderReducer