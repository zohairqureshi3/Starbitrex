import { DISPLAY_NOTIFICATIONS,DISPLAY_UNREAD_NOTIFICATIONS } from './notificationTypes';
import { apiHelper } from "../apiHelper";
import { toast } from "react-toastify";

export const displayUnreadNotifications = () => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/notification/unread`, '')
    if (res?.data) {
      let { data } = res
      dispatch({
        type: DISPLAY_UNREAD_NOTIFICATIONS,
        payload: data
      })
    }
  } catch (error) {
    toast.error(error.message)
  }
}

export const displayNotifications = () => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/notification/all`, '')
    if (res?.data) {
      let { data } = res
      dispatch({
        type: DISPLAY_NOTIFICATIONS,
        payload: data
      })
    }
  } catch (error) {
    toast.error(error.message)
  }
}

export const readNotification = (id) => async (dispatch) => {
  try {
    await apiHelper("put", `/api/notification/${id}`)
  } catch (error) {
    toast.error(error.message)
  }
}