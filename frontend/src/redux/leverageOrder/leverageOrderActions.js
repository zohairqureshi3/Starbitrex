import { GET_ORDER, ADD_ORDER, CLEAR_ORDER, GET_USER_ORDER, ORDER_ERROR, STOP_ORDER, START_ORDER, ORDER_PNL } from "./leverageOrderTypes";
import { apiHelper } from "../apiHelper"
import { toast } from "react-toastify";


export const getPnL = (pnl) => async (dispatch) => {
  try {
    dispatch({
      type: ORDER_PNL,
      payload: pnl
    })
  } catch (error) {
    toast.error(error.response.message)
  }
}

export const getLeverageOrders = () => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/leverageOrder/`, '')
    if (res?.data) {
      let { data } = res
      dispatch({
        type: GET_ORDER,
        payload: data
      })
    } else {
      dispatch({
        type: ORDER_ERROR,
      })
    }
  } catch (error) {
    toast.error(error.response.message)
  }
}

export const getUserLeverageOrders = (id) => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/leverageOrder/${id}`, '')
    if (res?.data) {
      let { data } = res
      dispatch({
        type: GET_USER_ORDER,
        payload: data
      })
    } else {
      dispatch({
        type: ORDER_ERROR,
      })
    }
  } catch (error) {
    toast.error(error.response.message)
  }
}

export const addLeverageOrder = (data) => async (dispatch) => {
  try {
    let res = await apiHelper("post", `/api/leverageOrder/add`, data)
    if (res?.data) {
      toast.success(res.data.message)
      let { data } = res
      dispatch({
        type: ADD_ORDER,
        payload: data
      })
    } else {
      dispatch({
        type: ORDER_ERROR,
      })
    }
  } catch (error) {
    toast.error(error.response.message)
  }
}

export const updateLeverageOrder = (data) => async (dispatch) => {
  try {
    let res = await apiHelper("put", `/api/leverageOrder/update`, data)
    if (res?.data) {
      toast.success(res.data.message)
      let { data } = res
      // console.log(data);
      dispatch({
        type: ADD_ORDER,
        payload: data
      })
    } else {
      dispatch({
        type: ORDER_ERROR,
      })
    }
  } catch (error) {
    toast.error(error.response.message)
  }
}

export const clearLeverageOrder = () => async (dispatch) => {
  try {
    dispatch({
      type: CLEAR_ORDER
    })
  } catch (error) {
    toast.error(error.response.message)
  }
}

export const stopLeverageOrder = (id, rate, auto) => async (dispatch) => {
  try {
    let res = await apiHelper("put", `/api/leverageOrder/stop/${id}`, { stopRate: rate, autoStop: auto })
    if (res?.data) {
      let { data } = res
      toast.success(res.data.message)
      dispatch({
        type: STOP_ORDER,
        payload: data
      })
    }
  } catch (error) {
    toast.error(error.response.message)
  }
}

export const startLeverageOrder = (order) => async (dispatch) => {
  try {
    let res = await apiHelper("put", `/api/leverageOrder/start`, order)
    if (res?.data) {
      let { data } = res
      toast.success(res.data.message)
      dispatch({
        type: START_ORDER,
        payload: data
      })
    }
  } catch (error) {
    toast.error(error.response.message)
  }
}