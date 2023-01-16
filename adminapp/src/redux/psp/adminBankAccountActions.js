import {
  GET_ADMIN_BANK_ACCOUNTS,
  GET_ADMIN_BANK_ACCOUNT,
  ADD_ADMIN_BANK_ACCOUNT,
  EDIT_ADMIN_BANK_ACCOUNT,
  DELETE_ADMIN_BANK_ACCOUNT,
  SET_DEFAULT_ADMIN_BANK_ACCOUNT,
  TOGGLE_STATE,
  ERROR_STATE
} from "./adminBankAccountTypes";
import { apiHelper } from "../apiHelper"
import { toast } from "react-toastify";

export const getAdminBankAccounts = () => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/admin-bank-account`, '')
    if (res?.data && res?.data?.adminBankAccounts) {
      let { data } = res;
      await dispatch({
        type: GET_ADMIN_BANK_ACCOUNTS,
        payload: data?.adminBankAccounts
      });
    }
    else {
      await dispatch({
        type: GET_ADMIN_BANK_ACCOUNTS,
        payload: []
      });
    }
  } catch (error) {
    console.log(error.response.message);
    toast.error(error.response.message);
  }
}

export const getAdminBankAccount = (id) => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/admin-bank-account/${id}`, '')
    if (res?.data && res?.data?.adminBankAccount) {
      let { data } = res;
      await dispatch({
        type: GET_ADMIN_BANK_ACCOUNT,
        payload: data?.adminBankAccount
      });
    }
  } catch (error) {
    console.log(error.response.message);
    toast.error(error.response.message);
  }
}

export const addAdminBankAccount = (data) => async (dispatch) => {
  try {
    let res = await apiHelper("post", `/api/admin-bank-account/add`, data)

    if (res?.data && res?.data?.adminBankAccount_) {
      let { data } = res;
      toast.success(data?.message);
      await dispatch({
        type: ADD_ADMIN_BANK_ACCOUNT,
        payload: data?.adminBankAccount_
      });
    }
    else {
      await dispatch({
        type: ERROR_STATE
      });
    }
  } catch (error) {
    console.log(error.message);
    toast.error(error.message);
  }
}

export const editAdminBankAccount = (id, data) => async (dispatch) => {
  try {
    let res = await apiHelper("put", `/api/admin-bank-account/${id}`, data)
    if (res?.data && res?.data?.adminBankAccount) {
      let { data } = res;
      toast.success(data?.message);
      await dispatch({
        type: EDIT_ADMIN_BANK_ACCOUNT,
        payload: data?.adminBankAccount
      });
    }
  } catch (error) {
    console.log(error.response.message);
    toast.error(error.response.message);
  }
}

export const setDefaultAdminBankAccount = (id, data) => async (dispatch) => {
  try {
    let res = await apiHelper("put", `/api/admin-bank-account/set-default/${id}`, data)
    if (res?.data && res?.data?.newAdminBankAccountDefault) {
      let { data } = res;
      toast.success(data?.message);
      await dispatch({
        type: SET_DEFAULT_ADMIN_BANK_ACCOUNT,
        payload: data?.newAdminBankAccountDefault?._id
      });
      await dispatch(getAdminBankAccounts());
    }
  } catch (error) {
    console.log(error.response.message);
    toast.error(error.response.message);
  }
}

export const deleteAdminBankAccount = (id) => async (dispatch) => {
  try {
    let res = await apiHelper("delete", `/api/admin-bank-account/${id}`, '')
    if (res?.data && res?.data?.adminBankAccount) {
      let { data } = res;
      toast.success(data?.message);
      await dispatch({
        type: DELETE_ADMIN_BANK_ACCOUNT,
        payload: data?.adminBankAccount?._id
      });
    }
  } catch (error) {
    console.log(error.response.message);
    toast.error(error.response.message);
  }
}

export const updateState = () => async (dispatch) => {
  try {
    await dispatch({
      type: TOGGLE_STATE
    });
  } catch (error) {
    console.log(error.response.message);
  }
}