import { ADD_WALLET, GET_WALLETS, DELETE_WALLET } from "./externalWalletTypes";
import { apiHelper } from "../apiHelper"
import { toast } from "react-toastify";

export const addWallet = (data) => async (dispatch) => {
  try {
    let res = await apiHelper("post", `/api/external-wallet/add`, data)
    if (res?.data) {
      let { data } = res
      toast.success(res.data.message)
      dispatch({
        type: ADD_WALLET,
        payload: data
      })
    }
  } catch (error) {
    toast.error(error.response.message)
  }
}

export const getWallets = (userId) => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/external-wallet/${userId}`, '')
    if (res?.data) {
      let { data } = res
      // toast.success(res.data.message)
      dispatch({
        type: GET_WALLETS,
        payload: data
      })
    }
  } catch (error) {
    toast.error(error.response.message)
  }
}

export const deleteWallet = (id) => async (dispatch) => {
  try {
    let res = await apiHelper("delete", `/api/external-wallet/${id}`, '')
    if (res?.data) {
      let { data } = res
      toast.success(res.data.message)
      dispatch({
        type: DELETE_WALLET,
        payload: data
      })
    }
  } catch (error) {
    toast.error(error.response.message)
  }
}