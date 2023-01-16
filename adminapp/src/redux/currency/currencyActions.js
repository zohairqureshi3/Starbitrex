import {
  SHOW_ALL_CURRENCIES, GET_CURRENCY, ADD_CURRENCY, DELETE_CURRENCY, EDIT_CURRENCY, WALLET_CURRENCIES,
  TOGGLE_STATE, ERROR_STATE
} from "./currencyTypes";
import { apiHelper } from "../apiHelper"
import { toast } from "react-toastify";

export const showAllCurrencies = () => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/currency`, '')
    if (res?.data) {
      let { data } = res
      await dispatch({
        type: SHOW_ALL_CURRENCIES,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const getCurrency = (id) => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/currency/${id}`, '')
    if (res?.data) {
      let { data } = res
      await dispatch({
        type: GET_CURRENCY,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const addCurrency = (data) => async (dispatch) => {
  try {
    let res = await apiHelper("post", `/api/currency/add`, data)

    if (res?.data) {
      let { data } = res
      toast.success(res.data.message)
      await dispatch({
        type: ADD_CURRENCY,
        payload: data
      })
    }
    else {
      await dispatch({
        type: ERROR_STATE
      })
    }
  } catch (error) {
    console.log(error.message)
    toast.error(error.message)
  }
}

export const editCurrency = (id, data) => async (dispatch) => {
  try {
    let res = await apiHelper("put", `/api/currency/${id}`, data)
    if (res?.data) {
      let { data } = res
      toast.success(res.data.message)
      await dispatch({
        type: EDIT_CURRENCY,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const deleteCurrency = (id) => async (dispatch) => {
  try {
    let res = await apiHelper("delete", `/api/currency/${id}`, '')
    if (res?.data) {
      let { data } = res
      toast.success(res.data.message)
      await dispatch({
        type: DELETE_CURRENCY,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const walletCurrencies = (data) => async (dispatch) => {
  try {
    if (data) {
      toast.success(data.message)
      await dispatch({
        type: WALLET_CURRENCIES,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const updateState = () => async (dispatch) => {
  try {
    await dispatch({
      type: TOGGLE_STATE
    })
  } catch (error) {
    console.log(error.response.message)
  }
}