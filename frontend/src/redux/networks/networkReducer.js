import { GET_Networks } from './networkTypes';

const initialState = {
   networks: []
}

const NetworkReducer = (state = initialState, action) => {
   switch (action.type) {
      case GET_Networks:
         return {
            ...state,
            networks: action.payload
         }
      default:
         return state
   }
}

export default NetworkReducer
