import { GET_ORDER, CLEAR_ORDER, GET_USER_ORDER, ORDER_ERROR, STOP_ORDER, ADD_ORDER, REVERT_ORDER, EDIT_HISTORY_ORDER, UPDATE_ORDER, START_ORDER } from "./leverageOrderTypes";
import { apiHelper } from "../apiHelper"
import { toast } from "react-toastify";

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

export const updateLeverageOrder = (dataBody, userId) => async (dispatch) => {
  try {
    let res = await apiHelper("put", `/api/leverageOrder/update`, dataBody)
    if (res?.data) {
      await dispatch(getUserLeverageOrders(userId));
      toast.success(res.data.message)
      let { data } = res;

      if (userId)
        localStorage.setItem('userLeaverageOrderUpdate', JSON.stringify({ userId: userId, leverageId: dataBody?._id }));
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

export const revertLeverageOrder = (id, userId) => async (dispatch) => {
  try {
    let res = await apiHelper("put", `/api/leverageOrder/revert-order/${id}`, '')
    if (res?.data) {
      let { data } = res
      await dispatch(getUserLeverageOrders(userId));
      toast.success(res.data.message)
      dispatch({
        type: REVERT_ORDER,
        payload: data?.leverageOrder
      })
    }
  } catch (error) {
    console.log('error', error)
    toast.error(error.response.message)
  }
}

export const editLeverageHistoryOrder = (id, data) => async (dispatch) => {
  try {
    let res = await apiHelper("put", `/api/leverageOrder/edit-history-order/${id}`, data)
    if (res?.data) {
      let { data } = res

      await dispatch(getUserLeverageOrders(data?.currentUserId));
      toast.success(res.data.message)
      dispatch({
        type: EDIT_HISTORY_ORDER
      })
    }
  } catch (error) {
    console.log('error', error)
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