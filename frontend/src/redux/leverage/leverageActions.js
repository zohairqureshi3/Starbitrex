import { DISPLAY_LEVERAGE } from './leverageTypes';
import { apiHelper } from "../apiHelper";
import { toast } from "react-toastify";

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
    console.log('error', error)
    toast.error(error.response.message)
  }
}