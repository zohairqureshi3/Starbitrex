import { SHOW_ALL_NETWORKS, ADD_NETWORK, DELETE_NETWORK, EDIT_NETWORK, GET_SINGLE_NETWORK, TOGGLE_STATE, ERROR_STATE } from './networkTypes';

const initialState = {
   networks: [],
   success: false,
   error: false,
   networkEditted: false
}

const networkReducer = (state = initialState, action) => {
   switch (action.type) {
      case SHOW_ALL_NETWORKS:
         return {
            ...state,
            networks: action.payload,
            networkEditted: false
         }
      case GET_SINGLE_NETWORK:
         return {
            ...state,
            networks: action.payload,
            networkEditted: false
         }
      case ADD_NETWORK:
         return {
            ...state,
            networks: [state.networks, action.payload],
            success: true,
            networkEditted: false
         }
      case DELETE_NETWORK:
         return {
            ...state,
            networks: action.payload,
            success: true,
            networkEditted: false
         }
      case EDIT_NETWORK:
         return {
            ...state,
            networks: action.payload,
            networkEditted: true
         }
      case ERROR_STATE:
         return {
            ...state,
            error: true
         }
      case TOGGLE_STATE:
         return {
            ...state,
            error: false,
            success: false,
            networkEditted: false
         }
      default:
         return state
   }
}

export default networkReducer
