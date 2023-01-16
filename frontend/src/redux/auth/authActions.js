import { REGISTER_USER, LOGIN_USER, TOGGLE_STATE, LOGOUT_USER } from "./authTypes";
import { toast } from "react-toastify";
import { ENV } from "./../../config/config";
import { apiHelper } from "../apiHelper";

export const RegisterUser = (user) => async (dispatch) => {
  try {
    let res = await apiHelper("post", `/api/auth/register`, user)
    if (res?.data) {
      let { data } = res
      ENV.removeItem("code")
      ENV.encryptUserData(data)

      dispatch({
        type: REGISTER_USER,
        payload: data
      })
      window.location.href = `/login?status=200&resend=${user.email}&message=A verification Email has been sent to ${user.email}. Please verify Email address to log in.`
    }
  } catch (error) {
    console.log(error)
    toast.error(error.response?.message)
  }
}

export const LoginUser = (user) => async (dispatch) => {
  try {
    let res = await apiHelper("post", `/api/auth/login`, user)
    if (res?.data) {
      let { data } = res

      if (data.type == 'not-verified') {
        window.location.href = data.url;
      }
      else {
        dispatch({
          type: LOGIN_USER,
          payload: data
        })
        if (data.success) {
          ENV.encryptUserData(data.user, data.token, data.user[0]?.userId)
          window.location.href = '/portfolio'
        }
      }
    }
  } catch (error) {
    console.log(error.message)
  }
}

export const resendVerification = (email) => async (dispatch) => {
  try {
    let res = await apiHelper("post", `/api/auth/resend`, { email: email })
    console.log(res);
    if (res)
      toast.success(res.data.message)
  } catch (error) {
    console.log(error.message)
  }
}

export const forgotPassword = (email) => async (dispatch) => {
  try {
    let res = await apiHelper("post", `/api/auth/recover`, { email: email })
    console.log(res);
    if (res) {
      // toast.success(res.data.message)
      return true
    }
  } catch (error) {
    // console.log(error.message)
    return false
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

export const LogoutUser = (id) => async (dispatch) => {
  try {
    let userId = id.split('"').join('')
    await apiHelper("post", `/api/auth/update-logout-activity/${userId}`, '')
    dispatch({
      type: LOGOUT_USER
    })
  } catch (error) {
    console.log(error.response.message)
  }
}