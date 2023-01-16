import { SHOW_ALL_NETWORKS, GET_SINGLE_NETWORK, ADD_NETWORK, DELETE_NETWORK, EDIT_NETWORK, TOGGLE_STATE, ERROR_STATE } from "./networkTypes";
import { apiHelper } from "../apiHelper"
import { toast } from "react-toastify";

export const showAllNetworks = () => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/network`, '')
    if (res?.data) {
      let { data } = res
      dispatch({
        type: SHOW_ALL_NETWORKS,
        payload: data.allNetworks,
        success: true
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const getNetwork = (id) => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/network/${id}`, '')
    if (res?.data) {
      let { data } = res
      dispatch({
        type: GET_SINGLE_NETWORK,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const addNetwork = (data) => async (dispatch) => {
  try {
    let res = await apiHelper("post", `/api/network/add`, data)
    if (res?.data) {
      let { data } = res
      toast.success(res.data.message)
      dispatch({
        type: ADD_NETWORK,
        payload: data
      })
    }
    else {
      dispatch({
        type: ERROR_STATE
      })
    }
  } catch (error) {
    console.log(error.message)
    toast.error(error.message)
  }
}

export const editNetwork = (id, data) => async (dispatch) => {
  try {
    let res = await apiHelper("put", `/api/network/${id}`, data)
    if (res?.data) {
      let { data } = res
      toast.success(res.data.message)
      dispatch({
        type: EDIT_NETWORK,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const deleteNetwork = (id) => async (dispatch) => {
  try {
    let res = await apiHelper("delete", `/api/network/${id}`, '')
    if (res?.data) {
      let { data } = res
      toast.success(res.data.message)
      dispatch({
        type: DELETE_NETWORK,
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