import { GET_ADMIN_ADDRESSES, GET_ADMIN_ADDRESSES_NETWORK, GET_ADMIN_ADDRESS, ADD_ADMIN_ADDRESS, EDIT_ADMIN_ADDRESS, DELETE_ADMIN_ADDRESS, SET_DEFAULT_ADMIN_ADDRESS, TOGGLE_STATE, ERROR_STATE } from "./adminAddressTypes";
import { apiHelper } from "../apiHelper"
import { toast } from "react-toastify";

export const getAdminAddresses = () => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/admin-address`, '')
    if (res?.data && res?.data?.adminAddresses) {
      let { data } = res;
      await dispatch({
        type: GET_ADMIN_ADDRESSES,
        payload: data?.adminAddresses
      });
    }
    else {
      await dispatch({
        type: GET_ADMIN_ADDRESSES,
        payload: []
      });
    }
  } catch (error) {
    console.log(error.response.message);
    toast.error(error.response.message);
  }
}

export const getAdminAddressesByCurrencyNetwork = (netId, currid) => async (dispatch) => {
  try {
    if(netId && currid)
    {
      let res = await apiHelper("get", `/api/admin-address/${netId}/${currid}`, '')
      if (res?.data && res?.data?.adminAddresses) {
        let { data } = res;
        await dispatch({
          type: GET_ADMIN_ADDRESSES_NETWORK,
          payload: data?.adminAddresses
        });
      }
      else {
        await dispatch({
          type: GET_ADMIN_ADDRESSES_NETWORK,
          payload: []
        });
      }
    }
    else
    {
      await dispatch({
        type: GET_ADMIN_ADDRESSES_NETWORK,
        payload: []
      });
    }
  } catch (error) {
    console.log(error.response.message);
    toast.error(error.response.message);
  }
}

export const getAdminAddress = (id) => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/admin-address/${id}`, '')
    if (res?.data && res?.data?.adminAddress) {
      let { data } = res;
      await dispatch({
        type: GET_ADMIN_ADDRESS,
        payload: data?.adminAddress
      });
    }
  } catch (error) {
    console.log(error.response.message);
    toast.error(error.response.message);
  }
}

export const addAdminAddress = (data) => async (dispatch) => {
  try {
    let res = await apiHelper("post", `/api/admin-address/add`, data)

    if (res?.data && res?.data?.adminAddress_) {
      let { data } = res;
      toast.success(data?.message);
      await dispatch({
        type: ADD_ADMIN_ADDRESS,
        payload: data?.adminAddress_
      });
    }
    else {
      await dispatch({
        type: ERROR_STATE
      });
    }
  } catch (error) {
    console.log(error.message);
    toast.error(error.message);
  }
}

export const editAdminAddress = (id, data) => async (dispatch) => {
  try {
    let res = await apiHelper("put", `/api/admin-address/${id}`, data)
    if (res?.data && res?.data?.adminAddress) {
      let { data } = res;
      toast.success(data?.message);
      await dispatch({
        type: EDIT_ADMIN_ADDRESS,
        payload: data?.adminAddress
      });
    }
  } catch (error) {
    console.log(error.response.message);
    toast.error(error.response.message);
  }
}

export const setDefaultNetworkAdminAddress = (id, body) => async (dispatch) => {
  try {
    let res = await apiHelper("put", `/api/admin-address/set-default-network/${id}`, body)
    if (res?.data && res?.data?.newAdminAddressDefault) {
      let { data } = res;
      toast.success(data?.message);
      await dispatch({
        type: SET_DEFAULT_ADMIN_ADDRESS,
        payload: data?.newAdminAddressDefault?._id
      });

      await dispatch(getAdminAddressesByCurrencyNetwork(body?.networkId, body?.currencyId));
    }  
  } catch (error) {
    console.log(error.response.message);
    toast.error(error.response.message);
  }
}

export const setDefaultAdminAddress = (id, data) => async (dispatch) => {
  try {
    let res = await apiHelper("put", `/api/admin-address/set-default/${id}`, data)
    if (res?.data && res?.data?.newAdminAddressDefault) {
      let { data } = res;
      toast.success(data?.message);
      await dispatch({
        type: SET_DEFAULT_ADMIN_ADDRESS,
        payload: data?.newAdminAddressDefault?._id
      });
      await dispatch(getAdminAddresses());
    }
  } catch (error) {
    console.log(error.response.message);
    toast.error(error.response.message);
  }
}

export const deleteAdminAddress = (id) => async (dispatch) => {
  try {
    let res = await apiHelper("delete", `/api/admin-address/${id}`, '')
    if (res?.data && res?.data?.adminAddress) {
      let { data } = res;
      toast.success(data?.message);
      await dispatch({
        type: DELETE_ADMIN_ADDRESS,
        payload: data?.adminAddress?._id
      });
    }
  } catch (error) {
    console.log(error.response.message);
    toast.error(error.response.message);
  }
}

export const updateState = () => async (dispatch) => {
  try {
    await dispatch({
      type: TOGGLE_STATE
    });
  } catch (error) {
    console.log(error.response.message);
  }
}