import { DISPLAY_TRANSACTIONS,DISPLAY_ALL_ADMIN_DEPOSITS } from './transactionTypes';
import { apiHelper } from "../apiHelper";
import { toast } from "react-toastify";

export const displayTransactions = () => async (dispatch) => {
  try {
    let res
    res = await apiHelper("get", `/api/transaction`, '')
    if (res?.data) {
      let { data } = res
      // toast.success(res.data.message)
      dispatch({
        type: DISPLAY_TRANSACTIONS,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const displayAllDeposits = () => async (dispatch) => {
  try {
    let res
    res = await apiHelper("get", `/api/transaction/all-admin-deposits`, '')
    if (res?.data) {
      let { data } = res
      // toast.success(res.data.message)
      dispatch({
        type: DISPLAY_ALL_ADMIN_DEPOSITS,
        payload: data?.adminDeposits ? data?.adminDeposits : []
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}
