import { SHOW_ALL_SETTING, GET_SETTING, ADD_SETTING, DELETE_SETTING, EDIT_SETTING, WALLET_CURRENCIES } from "./settingsTypes";
import { apiHelper } from "../apiHelper"
import { toast } from "react-toastify";

export const showAllSettings = () => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/setting`, '')
    if (res?.data) {
      let { data } = res
      dispatch({
        type: SHOW_ALL_SETTING,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const getSetting = (id) => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/setting/${id}`, '')
    if (res?.data) {
      let { data } = res
      dispatch({
        type: GET_SETTING,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const addSetting = (data) => async (dispatch) => {
  try {
    let res = await apiHelper("post", `/api/setting/add`, data)
    if (res?.data) {
      let { data } = res
      toast.success(res.data.message)
      dispatch({
        type: ADD_SETTING,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.message)
    toast.error(error.message)
  }
}

export const editSetting = (data) => async (dispatch) => {
  try {
    let res = await apiHelper("put", `/api/setting`, data)
    if (res?.data) {
      let { data } = res
      toast.success(res.data.message)
      dispatch({
        type: EDIT_SETTING,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const deleteSetting = (id) => async (dispatch) => {
  try {
    let res = await apiHelper("delete", `/api/setting/${id}`, '')
    if (res?.data) {
      let { data } = res
      toast.success(res.data.message)
      dispatch({
        type: DELETE_SETTING,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const walletSettings = (data) => async (dispatch) => {
  try {
    if (data) {
      toast.success(data.message)
      dispatch({
        type: WALLET_CURRENCIES,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}