import { GET_ADMIN_DEPOSITS, GET_ADMIN_WITHDRAWS, TRANSACTION_ERROR } from "./transationTypes";

const initialState = {
    adminDeposits: [],
    adminWithdraws: [],
    error: false
}

const transactionReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ADMIN_DEPOSITS:
            return {
                ...state,
                adminDeposits: action.payload,
                error: false
            }
        case GET_ADMIN_WITHDRAWS:
            return {
                ...state,
                adminWithdraws: action.payload,
                error: false
            }
        case TRANSACTION_ERROR:
            return {
                ...state,
                error: true
            }
        default:
            return state
    }
}

export default transactionReducer

