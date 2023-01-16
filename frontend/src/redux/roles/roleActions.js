import { DISPLAY_ROLES, GET_ROLE } from './roleTypes';
import { apiHelper } from "../apiHelper";
import { toast } from "react-toastify";

export const displayRoles = () => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/role`, '')
    if (res?.data) {
      let { data } = res
      // console.log("calling")
      // toast.success(res.data.message)
      dispatch({
        type: DISPLAY_ROLES,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response)
    toast.error(error.response)
  }
}

export const getRole = (id) => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/role/${id}`, '')
    if (res?.data) {
      let { data } = res
      // toast.success(res.data.message)
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

