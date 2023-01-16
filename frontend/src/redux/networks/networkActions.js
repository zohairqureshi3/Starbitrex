import { GET_Networks } from "./networkTypes";
import { apiHelper } from "../apiHelper"
import { toast } from "react-toastify";

export const getNetwork = () => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/Network/`, '')
    if (res?.data) {
      let { data } = res
      // toast.success(res.data.message)
      dispatch({
        type: GET_Networks,
        payload: data.allNetworks
      })
    }
  } catch (error) {
    toast.error(error.response.message)
  }
}