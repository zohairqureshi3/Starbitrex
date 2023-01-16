import { EDIT_USER, SET_USER, CHANGE_PASS, GET_USER, CHANGE_2FA, CLEAR_2FA, GET_COUNTRIES, GET_USER_ANALYTICS } from "./userTypes";
import { apiHelper } from "../apiHelper"
import { toast } from "react-toastify";

export const getUser = (id) => async (dispatch) => {
  id = id || '';
  try {
    let res = await apiHelper("get", `/api/user/${id}`, '')
    if (res?.data) {
      let { data } = res
      dispatch({
        type: GET_USER,
        payload: data.user?.[0],
      })
      // toast.success(res.data.message)
    }
  } catch (error) {
    // console.log(error.response.message)
    // toast.error(error.response.message)
  }
}

export const getUserAnalytics = (id) => async (dispatch) => {
  id = id || '';
  try {
    let res = await apiHelper("get", `/api/user/analytics/${id}`, '')
    if (res?.data) {
      let { data } = res;
      dispatch({
        type: GET_USER_ANALYTICS,
        payload: data.userAnalytics,
      });
      // toast.success(res.data.message)
    }
  } catch (error) {
    // console.log(error.response.message)
    // toast.error(error.response.message)
  }
}

export const setUser = (user) => async (dispatch) => {
  try {
    let { users } = user
    dispatch({
      type: SET_USER,
      payload: users
    })
  } catch (error) {
    toast.error(error.response)
  }
}

export const editUser = (id, data) => async (dispatch) => {
  try {
    let res = await apiHelper("put", `/api/user/${id}`, data)
    if (res?.data) {
      let { data } = res
      toast.success(res.data.message)
      dispatch({
        type: EDIT_USER,
        payload: data.user
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const forgetPassEmail = (data) => async (dispatch) => {
  try {
    let res = await apiHelper("put", `/api/user/forget-passsword-email`, data)
    if (res?.data) {
      let { data } = res
      toast.success(data.message)
    }
  } catch (error) {
    toast.error(error.response.message)
  }
}

export const forgetPassword = (data) => async (dispatch) => {
  try {
    let res = await apiHelper("put", `/api/user/forget-passsword`, data)
    if (res?.data) {
      let { data } = res
      toast.success(data.message)
    }
  } catch (error) {
    toast.error(error.response.message)
  }
}

// export const changePassword = (data) => async (dispatch) => {
//   try {
//     let res = await apiHelper("put", `/api/user/change-passsword`, data)
//     if (res?.data) {
//       let { data } = res
//       toast.success(data.message)
//     }
//   } catch (error) {
//     toast.error(error.response.message)
//   }
// }

export const changePassword = (id, data) => async (dispatch) => {
  try {
    let res = await apiHelper("put", `/api/user/change-password/${id}`, data)
    console.log(data, "dd");
    if (res?.data) {
      let { data } = res
      toast.success(data.message)
      dispatch({
        type: CHANGE_PASS
      })
    }
  } catch (error) {
    toast.error(error.response.message)
  }
}

export const sendTransactionDataToDB = (data) => async (dispatch) => {
  try {
    let res = await apiHelper("post", `/api/wallet/add`, data)
    if (res?.data) {
      let { data } = res
      toast.success(data.message)
    }
  } catch (error) {
    toast.error(error.response.message)
  }
}

export const otpAuth = (data) => async (dispatch) => {
  try {
    let res = await apiHelper("post", `/api/user/send-otp`, data)
    if (res?.data) {
      let { data } = res
      toast.success(data.message)
    }
  } catch (error) {
    toast.error(error.response.message)
  }
}

export const verifyOTP = (data) => async (dispatch) => {
  try {
    let res = await apiHelper("post", `/api/user/verify-otp`, data)
    if (res?.data) {
      let { data } = res
      dispatch({
        type: CHANGE_2FA
      })
      toast.success(data.message)
    }
  } catch (error) {
    toast.error(error.response.message)
  }
}

export const verifyTFA = (data) => async (dispatch) => {
  try {
    let res = await apiHelper("post", `/api/user/verify-tfa`, data)
    if (res?.data) {
      let { data } = res
      dispatch({
        type: CHANGE_2FA
      })
      toast.success(data.message)
    }
  } catch (error) {
    toast.error(error.response.message)
  }
}

export const clearOTP = () => async (dispatch) => {
  try {
    dispatch({
      type: CLEAR_2FA
    })
  } catch (error) {
    toast.error(error.response.message)
  }
}

export const getCountries = () => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/country`, '')
    if (res?.data) {
      let { data } = res
      dispatch({
        type: GET_COUNTRIES,
        payload: data.countries,
      })
      // toast.success(res.data.message)
    }
  } catch (error) {
    // console.log(error.response.message)
    // toast.error(error.response.message)
  }
}

/**
* Check if user is online or offline 
*/
export const userLastActivity = (id) => async (dispatch) => {
  try {
    let res = await apiHelper("post", `/api/user/track-last-activity/${id}`, '')
    if (res?.data) {
      let { data } = res
      // dispatch({
      //   type: UPDATE_LAST_ACTIVITY,
      //   payload: data.countries,
      // })
      // toast.success(res.data.message)
    }
  } catch (error) {
    // console.log(error.response.message)
    // toast.error(error.response.message)
  }
}