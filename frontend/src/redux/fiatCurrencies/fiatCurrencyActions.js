import { GET_FIAT_CURRENCY } from "./fiatCurrencyTypes";
import { apiHelper } from "../apiHelper"
import { toast } from "react-toastify";

export const getFiatCurrency = () => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/fiat-currency/`, '')
    if (res?.data) {
      let { data } = res
      // toast.success(res.data.message)
      dispatch({
        type: GET_FIAT_CURRENCY,
        payload: data
      })
    }
  } catch (error) {
    toast.error(error.response.message)
  }
}