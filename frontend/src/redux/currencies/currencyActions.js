import { GET_CURRENCY, TOGGLE_STATE } from "./currencyTypes";
import { apiHelper } from "../apiHelper"
import { toast } from "react-toastify";

export const getCurrency = () => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/currency/`, '')
    if (res?.data) {
      let { data } = res
      // toast.success(res.data.message)
      await dispatch({
        type: GET_CURRENCY,
        payload: data
      })
      // await dispatch({
      //   type: TOGGLE_STATE
      // })
    }
  } catch (error) {
    toast.error(error.response.message)
  }
}

export const updateCurrencyState = () => async (dispatch) => {
  try {
    dispatch({
      type: TOGGLE_STATE
    })
  } catch (error) {
    console.log(error.response.message)
  }
}