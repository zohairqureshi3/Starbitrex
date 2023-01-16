import {
   SHOW_ALL_ADMIN_COMMENTS, GET_ADMIN_COMMENTS, ADD_ADMIN_COMMENT, EDIT_ADMIN_COMMENT, DELETE_ADMIN_COMMENT, TOGGLE_STATE,
   ERROR_STATE
} from './adminCommentTypes';

const initialState = {
   adminComments: [],
   newComment: {},
   success: false,
   fetched: false,
   newCommentAdded: false,
   commentDeleted: false,
   error: false
}

const currencyReducer = (state = initialState, action) => {
   switch (action.type) {
      case SHOW_ALL_ADMIN_COMMENTS:
         return {
            ...state,
            adminComments: action.payload,
            success: false,
            fetched: true
         }
      case GET_ADMIN_COMMENTS:
         return {
            ...state,
            adminComments: action.payload,
            fetched: true,
            newCommentAdded: false,
            commentDeleted: false
         }
      case ADD_ADMIN_COMMENT:
         return {
            ...state,
            adminComments: [...state.adminComments, action.payload],
            newCommentAdded: true,
            fetched: false,
            commentDeleted: false
         }
      case DELETE_ADMIN_COMMENT:
         return {
            ...state,
            adminComments: state.adminComments.filter(item => item._id !== action.payload),
            commentDeleted: true,
            newCommentAdded: false,
            fetched: false,
         }
      case EDIT_ADMIN_COMMENT:
         return {
            ...state,
            adminComments: action.payload
         }
      case TOGGLE_STATE:
         return {
            ...state,
            success: false,
            fetched: false,
            newCommentAdded: false,
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

export default currencyReducer