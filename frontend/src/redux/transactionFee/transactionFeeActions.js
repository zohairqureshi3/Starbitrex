import { GET_TRANSACTION_FEE, RESET_TRANSACTION_FEE } from './transactionFeeTypes';
import { apiHelper } from "../apiHelper";
import { toast } from "react-toastify";

export const getTransactionFee = (postData) => async (dispatch) => {
  try {
    let res = await apiHelper("post", `/api/transactionManagement/get-fee`, postData)
    if (res?.data) {
      let { data } = res
      dispatch({
        type: GET_TRANSACTION_FEE,
        payload: data?.transactionFee
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const resetTransactionFee = () => async (dispatch) => {
  try {
    dispatch({
      type: RESET_TRANSACTION_FEE,
    })
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}