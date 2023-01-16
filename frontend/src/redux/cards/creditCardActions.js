import { ADD_CARD, GET_CARDS, DELETE_CARD } from "./creditCardTypes";
import { apiHelper } from "../apiHelper"
import { toast } from "react-toastify";

export const addCard = (data) => async (dispatch) => {
  try {
    let res = await apiHelper("post", `/api/credit-card/add`, data)
    if (res?.data) {
      let { data } = res
      toast.success(res.data.message)
      dispatch({
        type: ADD_CARD,
        payload: data
      })
    }
  } catch (error) {
    toast.error(error.response.message)
  }
}

export const getCards = (userId) => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/credit-card/${userId}`, '')
    if (res?.data) {
      let { data } = res
      // toast.success(res.data.message)
      dispatch({
        type: GET_CARDS,
        payload: data
      })
    }
  } catch (error) {
    toast.error(error.response.message)
  }
}

export const deleteCard = (id) => async (dispatch) => {
  try {
    let res = await apiHelper("delete", `/api/credit-card/${id}`, '')
    if (res?.data) {
      let { data } = res
      toast.success(res.data.message)
      dispatch({
        type: DELETE_CARD,
        payload: data
      })
    }
  } catch (error) {
    toast.error(error.response.message)
  }
}