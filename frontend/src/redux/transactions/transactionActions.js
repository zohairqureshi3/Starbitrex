import { GET_ADMIN_DEPOSITS, GET_ADMIN_WITHDRAWS, TRANSACTION_ERROR } from "./transationTypes";
import { apiHelper } from "../apiHelper"
import { toast } from "react-toastify";

export const getAdminDeposits = (id) => async (dispatch) => {
    try {
        let res = await apiHelper("get", `/api/transaction/admin-deposits/${id}`, '')
        if (res?.data) {
            let { data } = res
            // toast.success(res.data.message)
            dispatch({
                type: GET_ADMIN_DEPOSITS,
                payload: data
            })
        } else {
            dispatch({
                type: TRANSACTION_ERROR,
            })
        }
    } catch (error) {
        toast.error(error.response.message)
    }
}

export const getAdminWithdraws = (id) => async (dispatch) => {
    try {
        let res = await apiHelper("get", `/api/transaction/admin-withdraws/${id}`, '')
        if (res?.data) {
            let { data } = res
            // toast.success(res.data.message)
            dispatch({
                type: GET_ADMIN_WITHDRAWS,
                payload: data
            })
        } else {
            dispatch({
                type: TRANSACTION_ERROR,
            })
        }
    } catch (error) {
        toast.error(error.response.message)
    }
}