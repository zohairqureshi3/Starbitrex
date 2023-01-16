import { GET_SPOT_ORDER, GET_USER_SPOT_ORDER, ADD_SPOT_ORDER, STOP_SPOT_ORDER, CLEAR_SPOT_ORDER, SPOT_ORDER_ERROR, COMPLETE_ORDER } from "./spotOrderTypes";
import { apiHelper } from "../apiHelper"
import { toast } from "react-toastify";

export const getSpotOrders = () => async (dispatch) => {
  try {
    console.log("I am getting spot orders")
    let res = await apiHelper("get", `/api/spotOrder/`, '')
    console.log("Get Spot Order Response ", res)
    if (res?.data) {
      let { data } = res
      dispatch({
        type: GET_SPOT_ORDER,
        payload: data
      })
    } else {
      dispatch({
        type: SPOT_ORDER_ERROR,
      })
    }
  } catch (error) {
    toast.error(error.response.message)
  }
}

export const getUserSpotOrders = (id) => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/spotOrder/${id}`, '')
    if (res?.data) {
      let { data } = res
      dispatch({
        type: GET_USER_SPOT_ORDER,
        payload: data
      })
    } else {
      dispatch({
        type: SPOT_ORDER_ERROR,
      })
    }
  } catch (error) {
    toast.error(error.response.message)
  }
}

export const addSpotOrder = (data) => async (dispatch) => {
  try {
    // console.log("Here I am in spotOderActions.js");
    let res = await apiHelper("post", `/api/spotOrder/add`, data)
    if (res?.data) {
      toast.success(res.data.message)
      let { data } = res
      dispatch({
        type: ADD_SPOT_ORDER,
        payload: data
      })
    } else {
      dispatch({
        type: SPOT_ORDER_ERROR,
      })
    }
  } catch (error) {
    toast.error(error.response.message)
  }
}

export const updateSpotOrder = (data) => async (dispatch) => {
  try {
    let res = await apiHelper("put", `/api/spotOrder/update`, data)
    if (res?.data) {
      toast.success(res.data.message)
      let { data } = res
      // console.log(data);
      dispatch({
        type: ADD_SPOT_ORDER,
        payload: data
      })
    } else {
      dispatch({
        type: SPOT_ORDER_ERROR,
      })
    }
  } catch (error) {
    toast.error(error.response.message)
  }
}

export const clearSpotOrder = () => async (dispatch) => {
  try {
    dispatch({
      type: CLEAR_SPOT_ORDER
    })
  } catch (error) {
    toast.error(error.response.message)
  }
}

export const stopSpotOrder = (id) => async (dispatch) => {
  try {
    let res = await apiHelper("put", `/api/spotOrder/stop/${id}`, '')
    if (res?.data) {
      let { data } = res
      toast.success(res.data.message)
      dispatch({
        type: STOP_SPOT_ORDER,
        payload: data
      })
    }
  } catch (error) {
    toast.error(error.response.message)
  }
}

export const completeSpotOrder = (id) => async (dispatch) => {
  try {
    let res = await apiHelper("put", `/api/spotOrder/complete/${id}`, '')
    if (res?.data) {
      let { data } = res
      toast.success(res.data.message)
      dispatch({
        type: COMPLETE_ORDER,
        payload: data
      })
    }
  } catch (error) {
    toast.error(error.response.message)
  }
}