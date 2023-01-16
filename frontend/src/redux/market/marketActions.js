import { GET_LIVE_CURRENCIES } from "./marketTypes";
import { apiHelper } from "../apiHelper"
import { toast } from "react-toastify";

export const getLiveCurrencies = () => async (dispatch) => {
  try {
    console.log("ressssssssssssssssse");
    let res = await apiHelper("get", `/api/cronjob/get-market-data`, '')
    if (res?.data) {
      let { data } = res
      dispatch({
        type: GET_LIVE_CURRENCIES,
        payload: data
      })
    }
  } catch (error) {
    toast.error(error.response.message)
  }
}
