import { GET_BANK_TRANSACTION, GET_BANK_WITHDRAWS, ADD_BANK_TRANSACTION, CLEAR_BANK_TRANSACTION, TRANSACTION_BANK_ERROR } from "./externalBankTransactionTypes";
import { apiHelper } from "../apiHelper"
import { toast } from "react-toastify";

export const getExternalBankTransactions = (id) => async (dispatch) => {
    try {
        let res = await apiHelper("get", `/api/externalBankTransaction/user-bank-transactions/${id}`, '')
        if (res?.data) {
            let { data } = res
            // toast.success(res.data.message)
            dispatch({
                type: GET_BANK_TRANSACTION,
                payload: data
            })
        } else {
            dispatch({
                type: TRANSACTION_BANK_ERROR,
            })
        }
    } catch (error) {
        toast.error(error.response.message)
    }
}


export const getBankWithdraws = (id) => async (dispatch) => {
    try {
        let res = await apiHelper("get", `/api/externalBankTransaction/user-bank-withdraws/${id}`, '')
        if (res?.data) {
            let { data } = res
            // toast.success(res.data.message)
            dispatch({
                type: GET_BANK_WITHDRAWS,
                payload: data
            })
        } else {
            dispatch({
                type: TRANSACTION_BANK_ERROR,
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
            let { data } = res;
            dispatch({
                type: ADD_BANK_TRANSACTION,
                payload: data
            })
        } else {
            dispatch({
                type: TRANSACTION_BANK_ERROR,
            })
        }
    } catch (error) {
        toast.error(error.response.message)
    }
}


export const clearBankWithdraw = () => async (dispatch) => {
    try {
        dispatch({
            type: CLEAR_BANK_TRANSACTION,
        })
    } catch (error) {
        console.log(error.response.message)
        toast.error(error.response.message)
    }
}