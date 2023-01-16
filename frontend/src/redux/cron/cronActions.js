import { GET_PORTFOLIO } from "./cronTypes";
import { apiHelper } from "../apiHelper"

export const getPortfolioCurrencies = (Id) => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/cronjob/get-portfolio-data`, '')
    // console.log("res------------", res)
    if (res?.data) {
      let { data } = res
      // toast.success(res.data.message)
      dispatch({
        type: GET_PORTFOLIO,
        payload: data
      })
    }
  } catch (error) {
    // toast.error(error.response.message)
  }
}