import { ADD_ROLE, DISPLAY_ROLES, GET_ROLE, EDIT_ROLE, DELETE_ROLE, GET_PER_ROLE, TOGGLE_STATE, ERROR_STATE, GET_PERMISSIONS_PER_ROLE } from './roleTypes';
import { apiHelper } from "../apiHelper";
import { toast } from "react-toastify";

export const displayRoles = () => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/role`, '')
    if (res?.data) {
      let { data } = res
      dispatch({
        type: DISPLAY_ROLES,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const getRole = (id) => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/role/${id}`, '')
    if (res?.data) {
      let { data } = res
      dispatch({
        type: GET_ROLE,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const getPerRole = (id) => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/role/${id}`, '')
    if (res?.data) {
      let { data } = res
      dispatch({
        type: GET_PER_ROLE,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const addRole = (data) => async (dispatch) => {
  try {
    let res = await apiHelper("post", `/api/role/add`, data)
    if (res?.data) {
      let { data } = res
      toast.success(res.data.message)
      dispatch({
        type: ADD_ROLE,
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

export const editRole = (data) => async (dispatch) => {
  try {
    let res = await apiHelper("put", `/api/role/${data.id}`, data)
    if (res?.data) {
      let { data } = res
      toast.success(res.data.message)
      dispatch({
        type: EDIT_ROLE,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const deleteRole = (id) => async (dispatch) => {
  try {
    let res = await apiHelper("delete", `/api/role/${id}`, '')
    if (res?.data) {
      let { data } = res
      toast.success(res.data.message)
      dispatch({
        type: DELETE_ROLE,
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