import {
  SHOW_ALL_ADMIN_COMMENTS, GET_ADMIN_COMMENTS, ADD_ADMIN_COMMENT, EDIT_ADMIN_COMMENT, DELETE_ADMIN_COMMENT, TOGGLE_STATE,
  ERROR_STATE
} from "./adminCommentTypes";
import { apiHelper } from "../apiHelper"
import { toast } from "react-toastify";

export const showAllAdminComments = () => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/admin-comment`, '')
    if (res?.data) {
      let { data } = res
      dispatch({
        type: SHOW_ALL_ADMIN_COMMENTS,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const getAdminComments = (id) => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/admin-comment/get-comments/${id}`, '')
    if (res?.data) {
      let { data } = res
      dispatch({
        type: GET_ADMIN_COMMENTS,
        payload: data?.adminComments
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const addAdminComment = (data) => async (dispatch) => {
  try {
    let res = await apiHelper("post", `/api/admin-comment/add`, data)

    if (res?.data) {
      let { data } = res
      toast.success(res.data.message)
      dispatch({
        type: ADD_ADMIN_COMMENT,
        payload: data?.adminComment_
      })
    }
    else {
      dispatch({
        type: ERROR_STATE
      })
    }
  } catch (error) {
    console.log(error.message)
    toast.error(error.message)
  }
}

export const editAdminComment = (id, data) => async (dispatch) => {
  try {
    let res = await apiHelper("put", `/api/admin-comment/${id}`, data)
    if (res?.data) {
      let { data } = res
      toast.success(res.data.message)
      dispatch({
        type: EDIT_ADMIN_COMMENT,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const deleteAdminComment = (id) => async (dispatch) => {
  try {
    let res = await apiHelper("delete", `/api/admin-comment/${id}`, '')
    if (res?.data) {
      let { data } = res
      toast.success(res.data.message)
      dispatch({
        type: DELETE_ADMIN_COMMENT,
        payload: data?.adminComment_._id
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const deleteAdminComments = (apiData) => async (dispatch) => {
  try {
    let res = await apiHelper("delete", `/api/admin-comment/delete-comments`, apiData)
    if (res?.data) {
      toast.success(res.data.message)
      dispatch(getAdminComments(apiData.userId))
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const updateAdminCommentState = () => async (dispatch) => {
  try {
    dispatch({
      type: TOGGLE_STATE
    })
  } catch (error) {
    console.log(error.response.message)
  }
}