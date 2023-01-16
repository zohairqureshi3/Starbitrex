import {
  GET_SALES_STATUSES,
  GET_SALES_STATUS,
  ADD_SALES_STATUS,
  EDIT_SALES_STATUS,
  DELETE_SALES_STATUS,
  TOGGLE_STATE,
  ERROR_STATE
} from "./salesStatusTypes";
import { apiHelper } from "../apiHelper"
import { toast } from "react-toastify";

export const getSalesStatuses = () => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/sales-status`, '')
    if (res?.data && res?.data?.salesStatuses) {
      let { data } = res;
      await dispatch({
        type: GET_SALES_STATUSES,
        payload: data?.salesStatuses
      });
    }
    else {
      await dispatch({
        type: GET_SALES_STATUSES,
        payload: []
      });
    }
  } catch (error) {
    console.log(error.response.message);
    toast.error(error.response.message);
  }
}

export const getSalesStatus = (id) => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/sales-status/${id}`, '')
    if (res?.data && res?.data?.salesStatus) {
      let { data } = res;
      await dispatch({
        type: GET_SALES_STATUS,
        payload: data?.salesStatus
      });
    }
  } catch (error) {
    console.log(error.response.message);
    toast.error(error.response.message);
  }
}

export const addSalesStatus = (data) => async (dispatch) => {
  try {
    let res = await apiHelper("post", `/api/sales-status/add`, data)

    if (res?.data && res?.data?.salesStatus_) {
      let { data } = res;
      toast.success(data?.message);
      await dispatch({
        type: ADD_SALES_STATUS,
        payload: data?.salesStatus_
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

export const editSalesStatus = (id, data) => async (dispatch) => {
  try {
    let res = await apiHelper("put", `/api/sales-status/${id}`, data)
    if (res?.data && res?.data?.salesStatus) {
      let { data } = res;
      toast.success(data?.message);
      await dispatch({
        type: EDIT_SALES_STATUS,
        payload: data?.salesStatus
      });
    }
  } catch (error) {
    console.log(error.response.message);
    toast.error(error.response.message);
  }
}

export const deleteSalesStatus = (id) => async (dispatch) => {
  try {
    let res = await apiHelper("delete", `/api/sales-status/${id}`, '')
    if (res?.data && res?.data?.salesStatus) {
      let { data } = res;
      toast.success(data?.message);
      await dispatch({
        type: DELETE_SALES_STATUS,
        payload: data?.salesStatus?._id
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