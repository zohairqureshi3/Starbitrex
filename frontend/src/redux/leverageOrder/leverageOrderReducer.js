import { GET_ORDER, ADD_ORDER, CLEAR_ORDER, GET_USER_ORDER, ORDER_ERROR, STOP_ORDER, START_ORDER, ORDER_BOOK, ORDER_PNL } from './leverageOrderTypes';

const initialState = {
   orders: [],
   userOrders: [],
   order: [],
   success: false,
   error: false,
   stopped: false,
   started: false,
   orderBook: [],
   orderPnL: 0
}

const LeverageOrderReducer = (state = initialState, action) => {
   switch (action.type) {
      case ORDER_PNL:
         return {
            ...state,
            orderPnL: action.payload
         }
      case GET_ORDER:
         return {
            ...state,
            orders: action.payload
         }
      case GET_USER_ORDER:
         return {
            ...state,
            userOrders: action.payload
         }
      case ADD_ORDER:
         return {
            ...state,
            order: action.payload,
            success: true,
            error: false
         }
      case CLEAR_ORDER:
         return {
            ...state,
            order: [],
            success: false,
            stopped: false,
            started: false,
            error: false
         }
      case STOP_ORDER:
         return {
            ...state,
            stopped: true,
            // success: false,
            // started: false,
            // error: false
         }
      case START_ORDER:
         return {
            ...state,
            started: true,
            // stopped: false,
            // success: false,
            // error: false
         }
      case ORDER_ERROR:
         return {
            ...state,
            error: true
         }
      case ORDER_BOOK:
         return {
            ...state,
            orderBook: action.payload,
            success: false,
            error: false
         }
      default:
         return state
   }
}

export default LeverageOrderReducer
