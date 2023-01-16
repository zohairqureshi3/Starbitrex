import { ADD_PERMISSIONS_MODULE, DISPLAY_PERMISSIONS_MODULES, DISPLAY_MODULES_WITH_PERMISSIONS, DELETE_PERMISSIONS_MODULE, TOGGLE_STATE, ERROR_STATE } from './permissionsModuleTypes';
import { apiHelper } from "../apiHelper";
import { toast } from "react-toastify";

export const displayPermissionsModules = () => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/permissionsModule`, '')
    if (res?.data) {
      let { data } = res;
      dispatch({
        type: DISPLAY_PERMISSIONS_MODULES,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.message)
    toast.error(error.message)
  }
}

export const displayModulesWithPermissions = () => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/permissionsModule/get-module-with-permissions`, '')
    if (res?.data) {
      let { data } = res;
      dispatch({
        type: DISPLAY_MODULES_WITH_PERMISSIONS,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.message)
    toast.error(error.message)
  }
}

export const addPermissionsModule = (data) => async (dispatch) => {
  try {
    let res = await apiHelper("post", `/api/permissionsModule/add`, data)
    if (res?.data) {
      let { data } = res
      toast.success(res.data.message)
      dispatch({
        type: ADD_PERMISSIONS_MODULE,
        payload: data
      })
    }
    else {
      dispatch({
        type: ERROR_STATE
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const deletePermissionsModule = (id) => async (dispatch) => {
  try {
    let res = await apiHelper("delete", `/api/permissionsModule/${id}`, '')
    if (res?.data) {
      let { data } = res
      toast.success(res.data.message)
      dispatch({
        type: DELETE_PERMISSIONS_MODULE,
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