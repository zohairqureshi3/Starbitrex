import { ADD_CARD, GET_CARDS, DELETE_CARD } from "./creditCardTypes";

const initialState = {
    creditCards: [],
    creditCard: [],
    success: false
 }
 
 const creditCardReducer = (state = initialState, action) => {
    switch (action.type) {
       case ADD_CARD:
          return {
             ...state,
             creditCards: action.payload.creditCard,
             creditCard: action.payload,
             success: action.payload.success
          }
       case GET_CARDS:
          return {
             ...state,
             creditCards: action.payload.creditCard,
             success: action.payload.success
          }
       case DELETE_CARD:
          return {
             ...state,
             creditCards: action.payload.creditCard,
             success: action.payload.success
          }
       default:
          return state
    }
 }
 
 export default creditCardReducer