import { REGISTER_USER, LOGIN_ADMIN, REGISTER_SUB_ADMIN, TOGGLE_STATE, ERROR_STATE } from "./authTypes";
import { toast } from "react-toastify";
import { ENV } from "./../../config/config";
import { apiHelper } from "../apiHelper"

export const RegisterUser = (user) => async (dispatch) => {
  try {
    let res = await apiHelper("post", `/api/auth/register`, user)
    if (res?.data) {
      let { data } = res
      toast.success("User created successfully")
      dispatch({
        type: REGISTER_USER,
        payload: data
      })
    }
    else {
      dispatch({
        type: ERROR_STATE
      })
    }
  } catch (error) {
    toast.error(error.response.message)
  }
}

export const RegisterSubAdmin = (data) => async (dispatch) => {
  try {
    let res = await apiHelper("post", `/api/auth/register-subadmin`, data)
    if (res?.data) {
      let { data } = res
      toast.success("Sub Admin created successfully")
      dispatch({
        type: REGISTER_SUB_ADMIN,
        payload: data
      })
    }
    else {
      dispatch({
        type: ERROR_STATE
      })
    }
  } catch (error) {
    toast.error(error.response.message)
  }
}

export const adminLogin = (user) => async (dispatch) => {
  try {
    let res = await apiHelper("post", `/api/auth/admin-login`, user)
    if (res?.data) {
      let { data } = res
      ENV.encryptUserData(data.user, data.token, data.user._id)
      dispatch({
        type: LOGIN_ADMIN,
        payload: data
      })
      window.location.href = "/admin/"
    }
  } catch (error) {
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

