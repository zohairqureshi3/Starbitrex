import { GET_ORDER, ADD_ORDER, CLEAR_ORDER } from "./internalOrderTypes";
import { apiHelper } from "../apiHelper"
import { toast } from "react-toastify";

export const getInternalOrders = (id) => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/internalOrderHistory/${id}`, '')
    if (res?.data) {
      let { data } = res
      // toast.success(res.data.message)
      dispatch({
        type: GET_ORDER,
        payload: data
      })
    }
  } catch (error) {
    toast.error(error.response.message)
  }
}

export const addInternalOrder = (data) => async (dispatch) => {
  try {
    let res = await apiHelper("post", `/api/internalOrderHistory/add`, data)
    if (res?.data) {
      let { data } = res
      toast.success(res.data.message)
      dispatch({
        type: ADD_ORDER,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const ClearData = () => async (dispatch) => {
  try {
    dispatch({
      type: CLEAR_ORDER
    })
  } catch (error) {
    // console.log(error.response.message)
    toast.error(error.response.message)
  }
}