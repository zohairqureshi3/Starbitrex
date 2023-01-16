import { GET_ORDER, ADD_ORDER, CLEAR_ORDER } from './internalOrderTypes';

const initialState = {
   orders: [],
   order: [],
   success: false
}

const InternalOrderReducer = (state = initialState, action) => {
   switch (action.type) {
      case GET_ORDER:
         return {
            ...state,
            orders: action.payload
         }
      case ADD_ORDER:
         return {
            ...state,
            order: action.payload,
            success: true
         }
      case CLEAR_ORDER:
         return {
            ...state,
            orders: [],
            order: [],
            success: false
         }
      default:
         return state
   }
}

export default InternalOrderReducer
