import { DISPLAY_EXTERNAL_FIAT_TRANSACTIONS, GET_PENDING_FIAT_WITHDRAWS, APPROVE_PENDING_FIAT_TRANSACTION, WITHDRAW_FIAT_CURRENCY, ERROR_FIAT_STATE, TOGGLE_FIAT_STATE, RESOLVE_USER_FIAT_TRANSACTION } from "./externalFiatTransactionTypes";
import { apiHelper } from "../apiHelper"
import { toast } from "react-toastify";

export const displayExternalFiatTransactions = () => async (dispatch) => {
  try {
    let res
    res = await apiHelper("get", `/api/externalFiatTransaction`, '')
    if (res?.data) {
      let { data } = res;
      dispatch({
        type: DISPLAY_EXTERNAL_FIAT_TRANSACTIONS,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const getPendingFiatWithdraws = () => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/externalFiatTransaction/pending-fiat-transactions`, '')
    if (res?.data) {
      let { data } = res
      dispatch({
        type: GET_PENDING_FIAT_WITHDRAWS,
        payload: data
      })
    }
  } catch (error) {
    toast.error(error.response.message)
  }
}

export const approvePendingFiatTransaction = (id) => async (dispatch) => {
  try {
    let res = await apiHelper("put", `/api/externalFiatTransaction/complete-pending-fiat-transaction/${id}`, '')
    if (res?.data) {
      let { data } = res
      toast.success(res.data.message)
      dispatch({
        type: APPROVE_PENDING_FIAT_TRANSACTION,
        payload: data
      })
    }
  } catch (error) {
    toast.error(error.response.message)
  }
}

export const submitFiatWithdraw = (postData) => async (dispatch) => {
  try {
    let res = await apiHelper("post", `/api/externalFiatTransaction/withdraw-fiat-coins`, postData)
    if (res?.data) {
      let { data } = res
      toast.success(res.data.message)
      dispatch({
        type: WITHDRAW_FIAT_CURRENCY,
        payload: data
      })
    }
    else {
      dispatch({
        type: ERROR_FIAT_STATE
      })
    }
  } catch (error) {
    toast.error(error.response.message)
  }
}

export const updateState = () => async (dispatch) => {
  try {
    dispatch({
      type: TOGGLE_FIAT_STATE
    })
  } catch (error) {
    console.log(error.response.message)
  }
}

export const resolveWithDrawFiatTransaction = (id, data) => async (dispatch) => {
  try {
    let res = await apiHelper("post", `/api/externalFiatTransaction/resolve-withdraw-fiat-transaction/${id}`, data);
    if (res?.data && res?.data?.status === 1) {
      toast.success(res?.data?.message)
      await dispatch({
        type: RESOLVE_USER_FIAT_TRANSACTION
      })
      await dispatch(getPendingFiatWithdraws());
    }
    else {
      toast.error(res?.data?.message);
      await dispatch({
        type: RESOLVE_USER_FIAT_TRANSACTION
      });
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}