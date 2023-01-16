import { GET_TRANSACTION, GET_DEPOSITS, GET_WITHDRAWS, ADD_TRANSACTION, CLEAR_TRANSACTION, TRANSACTION_ERROR } from "./externalTransactionTypes";
import { apiHelper } from "../apiHelper"
import { toast } from "react-toastify";

export const getExternalTransactions = (id) => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/externalTransaction/user-transactions/${id}`, '')
    if (res?.data) {
      let { data } = res
      // toast.success(res.data.message)
      dispatch({
        type: GET_TRANSACTION,
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

export const getDeposits = (id) => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/externalTransaction/user-deposits/${id}`, '')
    if (res?.data) {
      let { data } = res
      // toast.success(res.data.message)
      dispatch({
        type: GET_DEPOSITS,
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

export const getWithdraws = (id) => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/externalTransaction/user-withdraws/${id}`, '')
    if (res?.data) {
      let { data } = res
      // toast.success(res.data.message)
      dispatch({
        type: GET_WITHDRAWS,
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

export const submitWithdraw = (postData) => async (dispatch) => {
  try {
    let res = await apiHelper("post", `/api/externalTransaction/withdraw-coins`, postData)
    if (res?.data) {
      let { data } = res
      dispatch({
        type: ADD_TRANSACTION,
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


export const clearWithdraw = () => async (dispatch) => {
  try {
    dispatch({
      type: CLEAR_TRANSACTION,
    })
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}