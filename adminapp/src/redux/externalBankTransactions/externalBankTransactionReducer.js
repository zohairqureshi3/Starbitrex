import { DISPLAY_EXTERNAL_BANK_TRANSACTIONS, GET_PENDING_BANK_WITHDRAWS, APPROVE_PENDING_BANK_TRANSACTION, WITHDRAW_BANK_CURRENCY, ERROR_BANK_STATE, TOGGLE_BANK_STATE, RESOLVE_USER_BANK_TRANSACTION } from './externalBankTransactionTypes';

const initialState = {
    resolvedBankTransactions: [],
    pendingBankWithdraws: [],
    withdrawBankCurrencies: [],
    success: false,
    error: false,
    bankWithdrawn: false
}

const ExternalBankTransactionReducer = (state = initialState, action) => {
    switch (action.type) {
        case DISPLAY_EXTERNAL_BANK_TRANSACTIONS:
            return {
                ...state,
                resolvedBankTransactions: action.payload,
                success: true
            }
        case GET_PENDING_BANK_WITHDRAWS:
            return {
                ...state,
                pendingBankWithdraws: action.payload,
                success: true
            }
        case APPROVE_PENDING_BANK_TRANSACTION:
            return {
                ...state,
                pendingBankWithdraws: action.payload
            }
        case WITHDRAW_BANK_CURRENCY:
            return {
                ...state,
                withdrawBankCurrencies: action.payload,
                bankWithdrawn: true
            }
        case ERROR_BANK_STATE:
            return {
                ...state,
                error: true
            }
        case TOGGLE_BANK_STATE:
            return {
                ...state,
                error: false
            }
        case RESOLVE_USER_BANK_TRANSACTION:
            return {
                ...state,
                bankWithdrawn: true
            }
        default:
            return state
    }
}

export default ExternalBankTransactionReducer