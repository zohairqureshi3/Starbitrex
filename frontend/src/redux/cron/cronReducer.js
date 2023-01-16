import { GET_PORTFOLIO } from './cronTypes';

const initialState = {
   portfolioCurrencies: [],
   success: false
}

const CronReducer = (state = initialState, action) => {
   switch (action.type) {
        case GET_PORTFOLIO:
            return {
                ...state,
                portfolioCurrencies: action.payload.data
            }
        default:
            return state
   }
}
export default CronReducer