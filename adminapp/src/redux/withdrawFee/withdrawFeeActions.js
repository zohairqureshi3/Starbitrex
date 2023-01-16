import {
  DISPLAY_WITHDRAW_FEE, SET_WITHDRAW_FEE, GET_WITHDRAW_FEE, DELETE_WITHDRAW_FEE,
  EDIT_WITHDRAW_FEE, TOGGLE_STATE, ERROR_STATE
} from './withdrawFeeTypes';
import { apiHelper } from "../apiHelper";
import { toast } from "react-toastify";

export const displayWithdrawFee = () => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/withdrawManagement`, '')
    if (res?.data) {
      let { data } = res
      // toast.success(res.data.message)
      dispatch({
        type: DISPLAY_WITHDRAW_FEE,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const getWithdrawFee = (postData) => async (dispatch) => {
  try {
    let res = await apiHelper("post", `/api/withdrawManagement/get-fee`, postData)
    if (res?.data) {
      let { data } = res
      dispatch({
        type: GET_WITHDRAW_FEE,
        payload: data?.withdrawFee
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const getWithdrawFeeById = (id) => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/withdrawManagement/${id}`)
    if (res?.data) {
      let { data } = res
      dispatch({
        type: GET_WITHDRAW_FEE,
        payload: data?.withdrawFee?.[0]
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const addWithdrawFee = (data) => async (dispatch) => {
  try {
    let res = await apiHelper("post", `/api/withdrawManagement/add`, data)
    if (res?.data) {
      let { data } = res
      toast.success(res.data.message)
      dispatch({
        type: SET_WITHDRAW_FEE,
        payload: data
      })
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

export const editWithdrawFee = (id, data) => async (dispatch) => {
  try {
    let res = await apiHelper("put", `/api/withdrawManagement/${id}`, data)
    if (res?.data) {
      let { data } = res
      toast.success(res.data.message)
      dispatch({
        type: EDIT_WITHDRAW_FEE,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const deleteWithdrawFee = (id) => async (dispatch) => {
  try {
    let res = await apiHelper("delete", `/api/withdrawManagement/${id}`, '')
    if (res?.data) {
      let { data } = res
      toast.success(res.data.message)
      dispatch({
        type: DELETE_WITHDRAW_FEE,
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