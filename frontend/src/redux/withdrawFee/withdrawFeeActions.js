import { GET_WITHDRAW_FEE, RESET_WITHDRAW_FEE } from './withdrawFeeTypes';
import { apiHelper } from "../apiHelper";
import { toast } from "react-toastify";

export const getWithdrawFee = (postData) => async (dispatch) => {
  try {
    let res = await apiHelper("post", `/api/withdrawManagement/get-fee`, postData)
    if (res?.data) {
      let { data } = res
      dispatch({
        type: GET_WITHDRAW_FEE,
        payload: data?.withdrawFee
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const resetWithdrawFee = () => async (dispatch) => {
  try {
    dispatch({
      type: RESET_WITHDRAW_FEE,
    })
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}