import { DISPLAY_LEVERAGE, SET_LEVERAGE, GET_LEVERAGE, DELETE_LEVERAGE, EDIT_LEVERAGE, TOGGLE_STATE, ERROR_STATE } from './leverageTypes';
import { apiHelper } from "../apiHelper";
import { toast } from "react-toastify";

export const displayLeverage = () => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/leverage`, '')
    if (res?.data) {
      let { data } = res
      dispatch({
        type: DISPLAY_LEVERAGE,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const getLeverage = (id) => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/leverage/${id}`, '')
    if (res?.data) {
      let { data } = res
      dispatch({
        type: GET_LEVERAGE,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const addLeverage = (data) => async (dispatch) => {
  try {
    let res = await apiHelper("post", `/api/leverage/add`, data)
    if (res?.data) {
      let { data } = res
      toast.success(res.data.message)
      dispatch({
        type: SET_LEVERAGE,
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

export const editLeverage = (id, data) => async (dispatch) => {
  try {
    let res = await apiHelper("put", `/api/leverage/${id}`, data)
    if (res?.data) {
      let { data } = res
      toast.success(res.data.message)
      dispatch({
        type: EDIT_LEVERAGE,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const deleteLeverage = (id) => async (dispatch) => {
  try {
    let res = await apiHelper("delete", `/api/leverage/${id}`, '')
    if (res?.data) {
      let { data } = res
      toast.success(res.data.message)
      dispatch({
        type: DELETE_LEVERAGE,
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

export const getLeverageByCurrency = (id) => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/leverage/currency/${id}`, '')
    if (res?.data) {
      let { data } = res
      dispatch({
        type: DISPLAY_LEVERAGE,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}