import {
   GET_SALES_STATUSES,
   GET_SALES_STATUS,
   ADD_SALES_STATUS,
   EDIT_SALES_STATUS,
   DELETE_SALES_STATUS,
   TOGGLE_STATE,
   ERROR_STATE
} from "./salesStatusTypes";

const initialState = {
   salesStatuses: [],
   salesStatus: {},
   salesStatusesfetched: false,
   salesStatusAdded: false,
   salesStatusfetched: false,
   salesStatusEditted: false,
   salesStatusDeleted: false,
   error: false
}

const salesStatusReducer = (state = initialState, action) => {
   switch (action.type) {
      case GET_SALES_STATUSES:
         return {
            ...state,
            salesStatuses: action.payload,
            salesStatusesfetched: true
         }
      case GET_SALES_STATUS:
         return {
            ...state,
            salesStatus: action.payload,
            salesStatusfetched: true
         }
      case ADD_SALES_STATUS:
         return {
            ...state,
            salesStatuses: [state.salesStatuses, action.payload],
            salesStatusAdded: true
         }
      case EDIT_SALES_STATUS:
         return {
            ...state,
            salesStatus: action.payload,
            salesStatusEditted: true
         }
      case DELETE_SALES_STATUS:
         return {
            ...state,
            salesStatuses: state.salesStatuses.filter(item => item._id !== action.payload),
            salesStatusDeleted: true
         }
      case TOGGLE_STATE:
         return {
            ...state,
            salesStatusesfetched: false,
            salesStatusAdded: false,
            salesStatusfetched: false,
            salesStatusEditted: false,
            salesStatusDeleted: false,
            error: false
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

export default salesStatusReducer;
