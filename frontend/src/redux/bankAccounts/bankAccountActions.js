import { ADD_BANK_ACCOUNT, GET_BANK_ACCOUNTS, DELETE_BANK_ACCOUNT, GET_DEFAULT_BANK_ACCOUNT } from "./bankAccountTypes";
import { apiHelper } from "../apiHelper"
import { toast } from "react-toastify";

export const addBankAccount = (data) => async (dispatch) => {
  try {
    let res = await apiHelper("post", `/api/bank-account/add`, data)
    if (res?.data) {
      let { data } = res
      toast.success(res.data.message)
      dispatch({
        type: ADD_BANK_ACCOUNT,
        payload: data
      })
    }
  } catch (error) {
    toast.error(error.response.message)
  }
}

export const getBankAccounts = (userId) => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/bank-account/${userId}`, '')
    if (res?.data) {
      let { data } = res
      // toast.success(res.data.message)
      dispatch({
        type: GET_BANK_ACCOUNTS,
        payload: data
      })
    }
  } catch (error) {
    toast.error(error.response.message)
  }
}

export const deleteBankAccount = (id) => async (dispatch) => {
  try {
    let res = await apiHelper("delete", `/api/bank-account/${id}`, '')
    if (res?.data) {
      let { data } = res
      toast.success(res.data.message)
      dispatch({
        type: DELETE_BANK_ACCOUNT,
        payload: data
      })
    }
  } catch (error) {
    toast.error(error.response.message)
  }
}

export const getDefaultBankAccount = () => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/admin-bank-account/get-default`, '')
    if (res?.data && res?.data?.adminBankAccountDefault) {
      let { data } = res
      dispatch({
        type: GET_DEFAULT_BANK_ACCOUNT,
        payload: data?.adminBankAccountDefault
      })
    }
    else {
      dispatch({
        type: GET_DEFAULT_BANK_ACCOUNT,
        payload: {}
      })
    }
  } catch (error) {
    toast.error(error.response.message)
  }
}