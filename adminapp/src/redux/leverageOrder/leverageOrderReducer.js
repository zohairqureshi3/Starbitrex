import { GET_ORDER, CLEAR_ORDER, GET_USER_ORDER, ORDER_ERROR, STOP_ORDER, ADD_ORDER, REVERT_ORDER, EDIT_HISTORY_ORDER, UPDATE_ORDER } from './leverageOrderTypes';

const initialState = {
   orders: [],
   userOrders: [],
   order: [],
   success: false,
   error: false,
   updatedOrder: false,
   edittedHistoryOrder: false
}

const LeverageOrderReducer = (state = initialState, action) => {
   switch (action.type) {
      case GET_ORDER:
         return {
            ...state,
            orders: action.payload,
            edittedHistoryOrder: false
         }
      case GET_USER_ORDER:
         return {
            ...state,
            userOrders: action.payload,
            edittedHistoryOrder: false
         }
      case ADD_ORDER:
         return {
            ...state,
            order: action.payload,
            success: true,
            error: false,
            updatedOrder: true,
            edittedHistoryOrder: false
         }
      case CLEAR_ORDER:
         return {
            ...state,
            order: [],
            success: false,
            error: false,
            updatedOrder: false,
            edittedHistoryOrder: false
         }
      case STOP_ORDER:
         return {
            ...state,
            order: [],
            success: false,
            error: false,
            updatedOrder: true,
            edittedHistoryOrder: false
         }
      case REVERT_ORDER:
         return {
            ...state,
            userOrders: state.userOrders.userOrders.filter(item => item._id !== action.payload._id),
            edittedHistoryOrder: false
         }
      case EDIT_HISTORY_ORDER:
         return {
            ...state,
            edittedHistoryOrder: true
         }
      case ORDER_ERROR:
         return {
            ...state,
            error: true
         }
      default:
         return state
   }
}

export default LeverageOrderReducer
