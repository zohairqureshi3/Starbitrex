import { ADD_PERMISSION, DISPLAY_PERMISSIONS, DELETE_PERMISSION, TOGGLE_STATE, ERROR_STATE } from './permissionTypes';
import { apiHelper } from "../apiHelper";
import { toast } from "react-toastify";

export const displayPermissions = () => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/permission`, '')
    if (res?.data) {
      let { data } = res
      dispatch({
        type: DISPLAY_PERMISSIONS,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.message)
    toast.error(error.message)
  }
}

export const addPermission = (data) => async (dispatch) => {
  try {
    let res = await apiHelper("post", `/api/permission/add`, data)
    if (res?.data) {
      let { data } = res
      toast.success(res.data.message)
      dispatch({
        type: ADD_PERMISSION,
        payload: data
      })
    }
    else {
      dispatch({
        type: ERROR_STATE
      })
    }
  } catch (error) {
    dispatch({
      type: ERROR_STATE
    })
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const deletePermission = (id) => async (dispatch) => {
  try {
    let res = await apiHelper("delete", `/api/permission/${id}`, '')
    if (res?.data) {
      let { data } = res
      toast.success(res.data.message)
      dispatch({
        type: DELETE_PERMISSION,
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
    dispatch({
      type: TOGGLE_STATE
    })
  } catch (error) {
    console.log(error.response.message)
  }
}