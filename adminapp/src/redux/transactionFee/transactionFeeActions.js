import {
  DISPLAY_TRANSACTION_FEE, SET_TRANSACTION_FEE, GET_TRANSACTION_FEE, DELETE_TRANSACTION_FEE,
  EDIT_TRANSACTION_FEE, TOGGLE_STATE, ERROR_STATE
} from './transactionFeeTypes';
import { apiHelper } from "../apiHelper";
import { toast } from "react-toastify";

export const displayTransactionFee = () => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/transactionManagement`, '')
    if (res?.data) {
      let { data } = res
      // toast.success(res.data.message)
      dispatch({
        type: DISPLAY_TRANSACTION_FEE,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const getTransactionFee = (id) => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/transactionManagement/${id}`, '')
    if (res?.data) {
      let { data } = res
      dispatch({
        type: GET_TRANSACTION_FEE,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const addTransactionFee = (data) => async (dispatch) => {
  try {
    let res = await apiHelper("post", `/api/transactionManagement/add`, data)
    if (res?.data) {
      let { data } = res
     
      dispatch({
        type: SET_TRANSACTION_FEE,
        payload: data
      })
      toast.success(res.data.message)
    }
    else {
      dispatch({
        type: ERROR_STATE
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const editTransactionFee = (id, data) => async (dispatch) => {
  try {
    let res = await apiHelper("put", `/api/transactionManagement/${id}`, data)
    if (res?.data) {
      let { data } = res
      toast.success(res.data.message)
      dispatch({
        type: EDIT_TRANSACTION_FEE,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const deleteTransactionFee = (id) => async (dispatch) => {
  try {
    let res = await apiHelper("delete", `/api/transactionManagement/${id}`, '')
    if (res?.data) {
      let { data } = res
      toast.success(res.data.message)
      dispatch({
        type: DELETE_TRANSACTION_FEE,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const updateState = () => async (dispatch) => {
  try {
    dispatch({
      type: TOGGLE_STATE
    })
  } catch (error) {
    console.log(error.response.message)
  }
}
