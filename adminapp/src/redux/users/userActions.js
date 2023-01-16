import {
  SHOW_ALL_USERS, GET_USER, ADD_USER, EDIT_USER, DELETE_USER, CHANGE_PASS, REFERRALS_PER_ID, SUCCESS_MESSAGE, ADD_BALANCE, GET_USER_DETAILS,
  SET_WALLET, SHOW_SUB_ADMINS, SINGLE_SUB_ADMIN, SHOW_SALES_AGENTS, SHOW_RETENTION_AGENTS, SINGLE_RETENTION_AGENT, SINGLE_SALES_AGENT, DELETED_RETENTION_AGENTS, DELETED_SALES_AGENTS, DELETED_USERS, DELETED_SUB_ADMINS, RECOVER_USER, DISCONNECT_WALLET, CONNECT_WALLET,
  SHOW_ADMIN_BALANCE, GET_SENT_BALANCE_TO_USER, TOGGLE_STATE, GET_COUNTRIES, ADD_CURRENCY_AMOUNT, REMOVE_CURRENCY_AMOUNT, RESOLVE_USER_TRANSACTION, REVERT_USER_TRANSACTION, NEW_START_PRICE, DELETE_USERS, SHOW_SUPERVISORS, SINGLE_SUPERVISOR, DELETED_SUPERVISORS, SHOW_SALES_TEAMLEADS, SINGLE_SALES_TEAMLEAD, DELETED_SALES_TEAMLEADS,
  SHOW_RETENTION_TEAMLEADS, SINGLE_RETENTION_TEAMLEAD, DELETED_RETENTION_TEAMLEADS, GET_MANAGERS, UPDATE_AFFILIATE_TOKEN, CSV_FILE_IMPORTED,SHOW_AGENTS,SHOW_AGENT_ROLES,DELETED_AGENT
} from "./userTypes";
import { apiHelper } from "../apiHelper"
import { toast } from "react-toastify";
import { ENV } from "./../../config/config";

export const userDirectLogin = (user) => async (dispatch) => {
  try {
    let res = await apiHelper("post", `/api/auth/user-login-byadmin`, user)
    if (res?.data) {
      let { data } = res;

      if (data?.success && data?.user) {
        localStorage.setItem('userInfo', JSON.stringify(data?.user));
        localStorage.setItem('uId', JSON.stringify(data.user[0]?.userId));
        localStorage.setItem('uToken', JSON.stringify(data?.token));
        setTimeout(() => {
          window.open('/portfolio', '_blank');
        }, 500);

      }
      else {
        toast.error('Unable to login user.')
      }
    }
  } catch (error) {
    toast.error(error.response.message)
  }
}

export const affUserMonitor = (userId) => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/auth/aff-user-monitor/${userId}`, '')
    if (res?.data) {
      let { data } = res;

      if (data?.success && data?.user) {
        ENV.encryptAffUserData(data?.user, data?.token, data?.user?._id);

        setTimeout(() => {
          window.location.href = `/admin/aff/user-detail/${userId}`;
        }, 500);
      }
      else {
        toast.error(data?.message)
      }
    }
    else {
      window.location.href = '/';
    }
  } catch (error) {
    toast.error(error.response.message)
  }
}

export const getUser = (id) => async (dispatch) => {
  id = id || '';
  try {
    let res = await apiHelper("get", `/api/user/${id}`, '')
    if (res?.data) {
      let { data } = res
      dispatch({
        type: GET_USER,
        payload: data.user
      })
    }
  } catch (error) {
  }
}

export const getUserDetails = (id) => async (dispatch) => {
  id = id || '';
  try {
    let res = await apiHelper("get", `/api/user/user-details/${id}`, '')
    if (res?.data) {
      let { data } = res
      dispatch({
        type: GET_USER_DETAILS,
        payload: data.user
      })
    }
  } catch (error) {
  }
}

export const showAllUsers = (type, roleId, userId, clientType) => async (dispatch) => {
  try {
    let res = await apiHelper("post", `/api/user/users`, { 'userType': type, 'role_id': roleId, 'user_id': userId, 'clientType': clientType })
    if (res?.data) {
      let { data } = res
      dispatch({
        type: SHOW_ALL_USERS,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const showSubAdmins = () => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/user/sub-admins-listing`, '')
    if (res?.data) {
      let { data } = res
      dispatch({
        type: SHOW_SUB_ADMINS,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const showAgents = (roleId) => async (dispatch) => {
  try {
    let url
    if (roleId !== undefined) {
      url = `/api/user/agents/${roleId}`;
    } else {
      url = `/api/user/agents`;
    }
    
    let res = await apiHelper("get", url, '')
    if (res?.data) {
      let { data } = res
      dispatch({
        type: SHOW_AGENTS,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const showAgentRoles = () => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/user/agent-role`, '')
    if (res?.data) {
      let { data } = res
      dispatch({
        type: SHOW_AGENT_ROLES,
        payload: data.getAgentRole
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const deleteAgent = (id) => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/user/delete-agent/${id}`, '')
    if (res?.data) {
      let { data } = res
      dispatch({
        type: DELETED_AGENT,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}


export const showSalesAgents = () => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/user/sales-agents-listing`, '')
    if (res?.data) {
      let { data } = res
      console.log(data,"Sales Agent");
      dispatch({
        type: SHOW_SALES_AGENTS,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}


export const showSalesTeamleads = () => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/user/sales-teamleads-listing`, '')
    if (res?.data) {
      let { data } = res
      dispatch({
        type: SHOW_SALES_TEAMLEADS,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const showRetenAgents = () => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/user/reten-agents-listing`, '')
    if (res?.data) {
      let { data } = res
      dispatch({
        type: SHOW_RETENTION_AGENTS,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const showSupervisors = () => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/user/supervisors-listing`, '')
    if (res?.data) {
      let { data } = res
      dispatch({
        type: SHOW_SUPERVISORS,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const showRetenTeamleads = () => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/user/retention-teamleads-listing`, '')
    if (res?.data) {
      let { data } = res
      dispatch({
        type: SHOW_RETENTION_TEAMLEADS,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const singleSubAdmin = (id) => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/user/single-subadmin/${id}`, '')
    if (res?.data && res?.data?.user ) {
      let { data } = res
      dispatch({
        type: SINGLE_SUB_ADMIN,
        payload: data?.user
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const singleSalesTeamlead = (id) => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/user/single-sales-teamlead/${id}`, '')
    if (res?.data) {
      let { data } = res
      dispatch({
        type: SINGLE_SALES_TEAMLEAD,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const singleRetenTeamlead = (id) => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/user/single-retention-teamlead/${id}`, '')
    if (res?.data) {
      let { data } = res
      dispatch({
        type: SINGLE_RETENTION_TEAMLEAD,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const singleSalesAgent = (id) => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/user/single-salesagent/${id}`, '')
    if (res?.data) {
      let { data } = res
      dispatch({
        type: SINGLE_SALES_AGENT,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const singleRetenAgent = (id) => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/user/single-retenagent/${id}`, '')
    if (res?.data) {
      let { data } = res
      dispatch({
        type: SINGLE_RETENTION_AGENT,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const singleSupervisor = (id) => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/user/single-supervisor/${id}`, '')
    if (res?.data) {
      let { data } = res
      dispatch({
        type: SINGLE_SUPERVISOR,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const deletedUsers = () => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/user/deleted-users`, '')
    if (res?.data) {
      let { data } = res
      dispatch({
        type: DELETED_USERS,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const deletedSubAdmins = () => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/user/deleted-sub-admins`, '')
    if (res?.data) {
      let { data } = res
      dispatch({
        type: DELETED_SUB_ADMINS,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const deletedSalesAgents = () => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/user/deleted-sales-agents`, '')
    if (res?.data) {
      let { data } = res
      dispatch({
        type: DELETED_SALES_AGENTS,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const deletedSalesTeamleads = () => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/user/deleted-sales-teamleads`, '')
    if (res?.data) {
      let { data } = res
      dispatch({
        type: DELETED_SALES_TEAMLEADS,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const deletedRetenTeamleads = () => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/user/deleted-retention-teamleads`, '')
    if (res?.data) {
      let { data } = res
      dispatch({
        type: DELETED_RETENTION_TEAMLEADS,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const deletedRetenAgents = () => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/user/deleted-reten-agents`, '')
    if (res?.data) {
      let { data } = res
      dispatch({
        type: DELETED_RETENTION_AGENTS,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const deletedSupervisors = () => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/user/deleted-supervisors`, '')
    if (res?.data) {
      let { data } = res
      dispatch({
        type: DELETED_SUPERVISORS,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const recoverUser = (id) => async (dispatch) => {
  try {
    let res = await apiHelper("put", `/api/user/recover/${id}`, '')
    if (res?.data) {
      let { data } = res
      toast.success(res.data.message)
      dispatch({
        type: RECOVER_USER,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const referralsPerId = (data) => async (dispatch) => {
  try {

    let res = await apiHelper("get", `/api/user/referralsAgainstId/${data.id}`, '')
    if (res?.data) {
      let { data } = res
      dispatch({
        type: REFERRALS_PER_ID,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const addUser = (user) => async (dispatch) => {
  try {
    let res = await apiHelper("post", `/api/user/add`, user)
    if (res?.data) {
      let { data } = res
      toast.success(res.data.message)
      dispatch({
        type: ADD_USER,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const editUser = (id, data, shouldDispatchType = true, showUserDetails = true) => async (dispatch) => {
  try {
    let res = await apiHelper("put", `/api/user/${id}`, data)
    if (res?.data) {
      let { data } = res;
      if (showUserDetails)
        await dispatch(getUserDetails(id));
      toast.success(res?.data?.message);

      if (shouldDispatchType)
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

export const editUsers = (data) => async (dispatch) => {
  try {
    let res = await apiHelper("put", `/api/user/update-multiple-users`, data)
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

export const addCurrencyAmountToUserAccount = (data) => async (dispatch) => {
  try {
    let res = await apiHelper("post", `/api/user/add-currency-amount-to-account`, data);
    if (res?.data) {
      await dispatch(getUserDetails(data?.userId));
      toast.success(res?.data?.message);

      dispatch({
        type: ADD_CURRENCY_AMOUNT
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const changeLeverageStartPrice = (data) => async (dispatch) => {
  try {
    let res = await apiHelper("post", `/api/user/change-leverage-start-price`, data);
    if (res?.data) {
      toast.success(res?.data?.message)
      dispatch({
        type: NEW_START_PRICE
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const removeCurrencyAmountFromUserAccount = (data) => async (dispatch) => {
  try {
    let res = await apiHelper("post", `/api/user/remove-currency-amount-from-account`, data);
    if (res?.data && res?.data?.status === 1) {
      await dispatch(getUserDetails(data?.userId));
      toast.success(res?.data?.message);

      await dispatch({
        type: REMOVE_CURRENCY_AMOUNT
      })
    }
    else {
      toast.error(res?.data?.message);
      await dispatch({
        type: REMOVE_CURRENCY_AMOUNT
      });
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const resolveWithDrawTransaction = (id, data, fetchUserDetails=true) => async (dispatch) => {
  try {
    let res = await apiHelper("post", `/api/user/resolve-withdraw-transaction/${id}`, data);
    if (res?.data && res?.data?.status === 1) {
      if(fetchUserDetails)
        await dispatch(getUserDetails(data?.userId));
      toast.success(res?.data?.message);

      await dispatch({
        type: RESOLVE_USER_TRANSACTION
      })
    }
    else {
      toast.error(res?.data?.message);
      await dispatch({
        type: RESOLVE_USER_TRANSACTION
      });
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const resolveDepositTransaction = (id, data, fetchUserDetails=true) => async (dispatch) => {
  try {
    let res = await apiHelper("post", `/api/user/resolve-deposit-transaction/${id}`, data);
    if (res?.data && res?.data?.status === 1) {
      if(fetchUserDetails)
        await dispatch(getUserDetails(data?.userId));
      toast.success(res?.data?.message);

      await dispatch({
        type: RESOLVE_USER_TRANSACTION
      })
    }
    else {
      toast.error(res?.data?.message);
      await dispatch({
        type: RESOLVE_USER_TRANSACTION
      });
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const revertTransaction = (id, data, fetchUserDetails=true) => async (dispatch) => {
  try {
    let res = await apiHelper("put", `/api/user/revert-transaction/${id}`, data);
    if (res?.data && res?.data?.status === 1) {
      if(fetchUserDetails)
        await dispatch(getUserDetails(data?.userId));
      toast.success(res?.data?.message);

      await dispatch({
        type: REVERT_USER_TRANSACTION
      })
    }
    else {
      toast.error(res?.data?.message);
      await dispatch({
        type: REVERT_USER_TRANSACTION
      });
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
    let res = await apiHelper("put", `/api/user/forget-password`, data)
    if (res?.data) {
      let { data } = res
      toast.success(data.message)
    }
  } catch (error) {
    toast.error(error.response.message)
  }
}

export const changePassword = (id, data) => async (dispatch) => {
  try {
    let res = await apiHelper("put", `/api/user/change-password/${id}`, data)
    if (res?.data) {
      let { data } = res
      toast.success(data.message)
      dispatch({
        type: CHANGE_PASS
      })
      window.location.href = "/admin/login"
    }
  } catch (error) {
    toast.error(error.response.message)
  }
}

export const sendTransactionDataToDB = (data) => async (dispatch) => {
  try {
    let res = await apiHelper("post", `/api/transaction/add`, data)
    if (res?.data) {
      let { data } = res
      toast.success(data.message)
      dispatch({
        type: SUCCESS_MESSAGE,
        payload: data
      })
    }
  } catch (error) {
    toast.error(error.response.message)
  }
}

export const addBalance = (data) => async (dispatch) => {
  try {
    let res = await apiHelper("put", `/api/account/update`, data)
    if (res?.data) {
      let { data } = res
      toast.success(res.data.message)
      dispatch({
        type: ADD_BALANCE,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const deleteUser = (id) => async (dispatch) => {
  try {
    let res = await apiHelper("put", `/api/user/delete-user/${id}`, '')
    if (res?.data) {
      let { data } = res
      toast.success(res.data.message)
      dispatch({
        type: DELETE_USER,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const deleteUsers = (data) => async (dispatch) => {
  try {
    let res = await apiHelper("put", `/api/user/delete-multiple-users`, data)
    if (res?.data) {
      let { data } = res
      toast.success(res.data.message)
      dispatch({
        type: DELETE_USERS,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const setUserWallet = (data) => async (dispatch) => {
  try {
    dispatch({
      type: SET_WALLET,
      payload: data
    })

  } catch (error) {
    toast.error(error.response.message)
  }
}

export const connectUserWallet = (data) => (dispatch) => {
  try {
    dispatch({
      type: CONNECT_WALLET,
      payload: data
    })

  } catch (error) {
    toast.error(error.response.message)
    console.log(error.message)
  }
}

export const disConnectWallet = (data) => (dispatch) => {
  try {
    dispatch({
      type: DISCONNECT_WALLET
    })

  } catch (error) {
    toast.error(error.response.message)
    console.log(error.message)
  }
}

export const showAdminBalance = (id) => async (dispatch) => {
  id = id || '';
  try {
    let res = await apiHelper("get", `/api/dashboard/get-admin-balance`, '')
    if (res?.data) {
      let { data } = res
      dispatch({
        type: SHOW_ADMIN_BALANCE,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.message)
  }
}

export const getSentAmountToUser = (id) => async (dispatch) => {
  id = id || '';
  try {
    let res = await apiHelper("get", `/api/dashboard/admin-sent-amount-to-user`, '')
    if (res?.data) {
      let { data } = res
      dispatch({
        type: GET_SENT_BALANCE_TO_USER,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.message)
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

export const getManagers = () => async (dispatch) => {
  try {
    let res = await apiHelper("get", `/api/user/managers`, '')
    if (res?.data) {
      let { data } = res;
      if (data?.managers) {
        dispatch({
          type: GET_MANAGERS,
          payload: data.managers
        })
      }
    }
  } catch (error) {
    console.log(error.response.message)
  }
}

export const updateAffiliateToken = (id) => async (dispatch) => {
  try {
    let res = await apiHelper("put", `/api/user/update-affiliate-token/${id}`, '')
    if (res?.data) {
      let { data } = res
      toast.success(res.data.message);
      if (data?.token) {
        dispatch({
          type: UPDATE_AFFILIATE_TOKEN,
          payload: data?.token
        })
      }
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const importCSVFile = (data, type, roleId, userId, clientType) => async (dispatch) => {
  try {
    let res = await apiHelper("post", `/api/user/csv/leads`, data)
    if (res?.data) {
      let { data } = res
      toast.success(res.data.message);
      if (res?.data?.userDetails?.valid?.length > 0) {
        dispatch(showAllUsers(type, roleId, userId, clientType));
      }
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
  }
}

export const exportLeadsToFile = (type, roleId, userId, clientType) => async (dispatch) => {
  try {
    let res = await apiHelper("post", `/api/user/export/leads`, { 'userType': type, 'role_id': roleId, 'user_id': userId, 'clientType': clientType })
    if (res?.data) {
      let { data } = res
      // toast.success(res.data.message);
      if (data?.csvFile) {
        window.open(data?.csvFile);
      }
      if (data?.xslxFile) {
        window.open(data?.xslxFile);
      }
    }
  } catch (error) {
    console.log(error.response.message)
    toast.error(error.response.message)
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