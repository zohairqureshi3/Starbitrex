import {
  SHOW_ALL_FIAT_CURRENCIES, GET_FIAT_CURRENCY, ADD_FIAT_CURRENCY, DELETE_FIAT_CURRENCY, EDIT_FIAT_CURRENCY, TOGGLE_STATE, ERROR_STATE
} from "./fiatCurrencyTypes";
import { apiHelper } from "../apiHelper"
import { toast } from "react-toastify";

export const showAllFiatCurrencies = () => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/fiat-currency`, '');
    if (res?.data) {
      let { data } = res;
      await dispatch({
        type: SHOW_ALL_FIAT_CURRENCIES,
        payload: data
      });
      await dispatch({
        type: TOGGLE_STATE
      });
    }
  } catch (error) {
    console.log(error.response.message);
    toast.error(error.response.message);
  }
}

export const getFiatCurrency = (id) => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/fiat-currency/${id}`, '');
    if (res?.data) {
      let { data } = res;

      dispatch({
        type: GET_FIAT_CURRENCY,
        payload: data
      });
    }
  } catch (error) {
    console.log(error.response.message);
    toast.error(error.response.message);
  }
}

export const addFiatCurrency = (data) => async (dispatch) => {
  try {
    let res = await apiHelper("post", `/api/fiat-currency/add`, data);

    if (res?.data) {
      let { data } = res;
      toast.success(res.data.message);
      dispatch({
        type: ADD_FIAT_CURRENCY,
        payload: data
      });
    }
    else {
      dispatch({
        type: ERROR_STATE
      });
    }
  } catch (error) {
    console.log(error.message);
    toast.error(error.message);
  }
}

export const editFiatCurrency = (id, data) => async (dispatch) => {
  try {
    let res = await apiHelper("put", `/api/fiat-currency/${id}`, data);
    if (res?.data) {
      let { data } = res;
      toast.success(res.data.message);
      dispatch({
        type: EDIT_FIAT_CURRENCY,
        payload: data
      });
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const deleteFiatCurrency = (id) => async (dispatch) => {
  try {
    let res = await apiHelper("delete", `/api/fiat-currency/${id}`, '');
    if (res?.data) {
      let { data } = res;
      toast.success(res.data.message);
      dispatch({
        type: DELETE_FIAT_CURRENCY,
        payload: data
      });
    }
  } catch (error) {
    console.log(error.response.message);
    toast.error(error.response.message);
  }
}

export const updateState = () => async (dispatch) => {
  try {
    dispatch({
      type: TOGGLE_STATE
    });
  } catch (error) {
    console.log(error.response.message);
  }
}