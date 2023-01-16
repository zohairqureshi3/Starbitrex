import { GET_FIAT_TRANSACTION, GET_FIAT_WITHDRAWS, ADD_FIAT_TRANSACTION, CLEAR_FIAT_TRANSACTION, TRANSACTION_FIAT_ERROR } from "./externalFiatTransactionTypes";
import { apiHelper } from "../apiHelper"
import { toast } from "react-toastify";

export const getExternalFiatTransactions = (id) => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/externalFiatTransaction/user-fiat-transactions/${id}`, '')
    if (res?.data) {
      let { data } = res
      // toast.success(res.data.message)
      dispatch({
        type: GET_FIAT_TRANSACTION,
        payload: data
      })
    } else {
      dispatch({
        type: TRANSACTION_FIAT_ERROR,
      })
    }
  } catch (error) {
    toast.error(error.response.message)
  }
}

// export const getDeposits = (id) => async (dispatch) => {
//   try {
//     let res = await apiHelper("get", `/api/externalTransaction/user-deposits/${id}`, '')
//     if (res?.data) {
//       let { data } = res
//       // toast.success(res.data.message)
//       dispatch({
//         type: GET_DEPOSITS,
//         payload: data
//       })
//     } else {
//       dispatch({
//         type: TRANSACTION_ERROR,
//       })
//     }
//   } catch (error) {
//     toast.error(error.response.message)
//   }
// }

export const getFiatWithdraws = (id) => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/externalFiatTransaction/user-fiat-withdraws/${id}`, '')
    if (res?.data) {
      let { data } = res
      // toast.success(res.data.message)
      dispatch({
        type: GET_FIAT_WITHDRAWS,
        payload: data
      })
    } else {
      dispatch({
        type: TRANSACTION_FIAT_ERROR,
      })
    }
  } catch (error) {
    toast.error(error.response.message)
  }
}

export const submitFiatWithdraw = (postData) => async (dispatch) => {
  try {
    let res = await apiHelper("post", `/api/externalFiatTransaction/withdraw-fiat-coins`, postData)
    if (res?.data) {
      let { data } = res
      dispatch({
        type: ADD_FIAT_TRANSACTION,
        payload: data
      })
    } else {
      dispatch({
        type: TRANSACTION_FIAT_ERROR,
      })
    }
  } catch (error) {
    toast.error(error.response.message)
  }
}


export const clearFiatWithdraw = () => async (dispatch) => {
  try {
    dispatch({
      type: CLEAR_FIAT_TRANSACTION,
    })
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}