import { DISPLAY_EXTERNAL_BANK_TRANSACTIONS, GET_PENDING_BANK_WITHDRAWS, APPROVE_PENDING_BANK_TRANSACTION, WITHDRAW_BANK_CURRENCY, ERROR_BANK_STATE, TOGGLE_BANK_STATE, RESOLVE_USER_BANK_TRANSACTION } from "./externalBankTransactionTypes";
import { apiHelper } from "../apiHelper"
import { toast } from "react-toastify";

export const displayExternalBankTransactions = () => async (dispatch) => {
    try {
        let res
        res = await apiHelper("get", `/api/externalBankTransaction`, '')
        if (res?.data) {
            let { data } = res;
            dispatch({
                type: DISPLAY_EXTERNAL_BANK_TRANSACTIONS,
                payload: data
            })
        }
    } catch (error) {
        console.log(error.response.message)
        toast.error(error.response.message)
    }
}

export const getPendingBankWithdraws = () => async (dispatch) => {
    try {
        let res = await apiHelper("get", `/api/externalBankTransaction/pending-bank-transactions`, '')
        if (res?.data) {
            let { data } = res
            dispatch({
                type: GET_PENDING_BANK_WITHDRAWS,
                payload: data
            })
        }
    } catch (error) {
        toast.error(error.response.message)
    }
}

export const approvePendingBankTransaction = (id) => async (dispatch) => {
    try {
        let res = await apiHelper("put", `/api/externalBankTransaction/complete-pending-bank-transaction/${id}`, '')
        if (res?.data) {
            let { data } = res
            toast.success(res.data.message)
            dispatch({
                type: APPROVE_PENDING_BANK_TRANSACTION,
                payload: data
            })
        }
    } catch (error) {
        toast.error(error.response.message)
    }
}

export const submitBankWithdraw = (postData) => async (dispatch) => {
    try {
        let res = await apiHelper("post", `/api/externalBankTransaction/withdraw-bank-coins`, postData)
        if (res?.data) {
            let { data } = res
            toast.success(res.data.message)
            dispatch({
                type: WITHDRAW_BANK_CURRENCY,
                payload: data
            })
        }
        else {
            dispatch({
                type: ERROR_BANK_STATE
            })
        }
    } catch (error) {
        toast.error(error.response.message)
    }
}

export const updateState = () => async (dispatch) => {
    try {
        dispatch({
            type: TOGGLE_BANK_STATE
        })
    } catch (error) {
        console.log(error.response.message)
    }
}


export const resolveWithDrawBankTransaction = (id, data) => async (dispatch) => {
    try {
        let res = await apiHelper("post", `/api/externalBankTransaction/resolve-withdraw-bank-transaction/${id}`, data);
        if (res?.data && res?.data?.status === 1) {
            toast.success(res?.data?.message)
            await dispatch({
                type: RESOLVE_USER_BANK_TRANSACTION
            })
            await dispatch(getPendingBankWithdraws());
        }
        else {
            toast.error(res?.data?.message);
            await dispatch({
                type: RESOLVE_USER_BANK_TRANSACTION
            });
        }
    } catch (error) {
        console.log(error.response.message)
        toast.error(error.response.message)
    }
}