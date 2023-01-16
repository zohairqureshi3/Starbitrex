import { GET_ACCOUNT, UPDATE_ACCOUNT, TRANSFER, CLEAR } from "./accountTypes";
import { apiHelper } from "../apiHelper"
import { toast } from "react-toastify";

export const getAccount = (Id) => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/account/` + Id, '')
    if (res?.data) {
      let { data } = res
      // toast.success(res.data.message)
      await dispatch({
        type: GET_ACCOUNT,
        payload: data.account
      })

      // await dispatch({
      //   type: CLEAR
      // })
    }
  } catch (error) {
    // toast.error(error.response.message)
  }
}

export const updateAccount = (id, data) => async (dispatch) => {
  try {
    let res = await apiHelper("put", `/api/account/update-prev-amount/` + id, data)
    if (res?.data) {
      let { data } = res
      dispatch({
        type: UPDATE_ACCOUNT
      })
    }
  } catch (error) {
    // toast.error(error.response.message)
  }
}


export const transferAmounts = (apiData) => async (dispatch) => {
  try {
    let res = await apiHelper("post", `/api/account/transferAmounts`, apiData)
    if (res?.data) {
      let { data } = res;
      toast.success("Funds Transferred Successfully");
      dispatch({
        type: TRANSFER,
        payload: data
      });
      dispatch(getAccount(apiData.userId));
      dispatch(clearTransfer());
    }
  } catch (error) {
    // toast.error(error.response.message)
  }
}

export const clearTransfer = () => async (dispatch) => {
  try {
    dispatch({
      type: CLEAR
    })
  } catch (error) {
    // toast.error(error.response.message)
  }
}