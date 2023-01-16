import {
   SHOW_ALL_USERS, GET_USER, ADD_USER, EDIT_USER, DELETE_USER, FORGET_PASSWORD, CHANGE_PASS, REFERRALS_PER_ID, ADD_BALANCE, GET_USER_DETAILS,
   CONNECT_WALLET, DISCONNECT_WALLET, SHOW_SUB_ADMINS, SHOW_SALES_AGENTS, SINGLE_SALES_AGENT, SINGLE_SUB_ADMIN, SHOW_RETENTION_AGENTS, SINGLE_RETENTION_AGENT, DELETED_RETENTION_AGENTS, DELETED_USERS, DELETED_SUB_ADMINS, DELETED_SALES_AGENTS, RECOVER_USER, SUCCESS_MESSAGE, SHOW_ADMIN_BALANCE,
   GET_SENT_BALANCE_TO_USER, TOGGLE_STATE, GET_COUNTRIES, ADD_CURRENCY_AMOUNT, REMOVE_CURRENCY_AMOUNT, RESOLVE_USER_TRANSACTION,
   REVERT_USER_TRANSACTION, NEW_START_PRICE, DELETE_USERS, SHOW_SUPERVISORS, SINGLE_SUPERVISOR, DELETED_SUPERVISORS, SHOW_SALES_TEAMLEADS, SINGLE_SALES_TEAMLEAD, DELETED_SALES_TEAMLEADS,
   SHOW_RETENTION_TEAMLEADS, SINGLE_RETENTION_TEAMLEAD, DELETED_RETENTION_TEAMLEADS, GET_MANAGERS, UPDATE_AFFILIATE_TOKEN, CSV_FILE_IMPORTED,SHOW_AGENTS,SHOW_AGENT_ROLES,DELETED_AGENT
} from './userTypes';


let initialState = {
   user: [],
   users: [],
   subAdmins: [],
   subAdmin: {},
   salesAgents: [],
   retenAgents: [],
   supervisors: [],
   delSupervisors: [],
   salesTeamleads: [],
   delSalesTeamleads: [],
   retenTeamleads: [],
   delRetenTeamleads: [],
   delUsers: [],
   delSubAdmins: [],
   delRetenAgents: [],
   balance: [],
   passChanged: false,
   walletAddress: null,
   isDeleted: false,
   success: false,
   fetched: false,
   balanceAdded: false,
   adminBalance: [],
   sentAmountToUser: [],
   pagination: "",
   userEditted: false,
   userDeleted: false,
   countries: [],
   countriesFetched: false,
   managers: [],
   managersFetched: false,
   updatedAffiliateToken: '',
   allAgents: [],
   agentRoles: [],
   deleteAgent: []
}

const userReducer = (state = initialState, action) => {
   switch (action.type) {
      case CONNECT_WALLET:
         return {
            ...state,
            mAddress: action.payload,
         }
      case DISCONNECT_WALLET:
         return {
            ...state,
            mAddress: "",
         }
      case SHOW_ALL_USERS:
         return {
            ...state,
            users: action.payload.referral,
            success: true,
            fetched: true,
            userEditted: false,
            userDeleted: false
         }
      case GET_MANAGERS:
         return {
            ...state,
            managers: action.payload,
            managersFetched: true
         }
      case UPDATE_AFFILIATE_TOKEN:
         return {
            ...state,
            updatedAffiliateToken: action.payload
         }
      case SHOW_SUB_ADMINS:
         return {
            ...state,
            subAdmins: action.payload.subAdmins,
            success: false,
            fetched: true
         }
      case SINGLE_SUB_ADMIN:
         return {
            ...state,
            subAdmin: action.payload
         }
      case SHOW_SALES_AGENTS:
         return {
            ...state,
            salesAgents: action.payload.salesAgents,
            success: false,
            fetched: true
         }
      case SINGLE_SALES_AGENT:
         return {
            ...state,
            salesAgents: action.payload
         }
      case SHOW_RETENTION_AGENTS:
         return {
            ...state,
            retenAgents: action.payload.retenAgents,
            success: false,
            fetched: true
         }
      case SINGLE_RETENTION_AGENT:
         return {
            ...state,
            retenAgents: action.payload
         }
      case SHOW_SUPERVISORS:
         return {
            ...state,
            supervisors: action.payload.supervisors,
            success: false,
            fetched: true
         }
      case SINGLE_SUPERVISOR:
         return {
            ...state,
            supervisors: action.payload,
         }
      case SHOW_SALES_TEAMLEADS:
         return {
            ...state,
            salesTeamleads: action.payload.salesTeamleads,
            success: false,
            fetched: true
         }
      case SINGLE_SALES_TEAMLEAD:
         return {
            ...state,
            salesTeamleads: action.payload
         }
      case SHOW_RETENTION_TEAMLEADS:
         return {
            ...state,
            retenTeamleads: action.payload.retenTeamleads,
            success: false,
            fetched: true,
         }
      case SINGLE_RETENTION_TEAMLEAD:
         return {
            ...state,
            retenTeamleads: action.payload
         }
      case DELETED_RETENTION_TEAMLEADS:
         return {
            ...state,
            delRetenTeamleads: action.payload,
            success: false
         }
      case DELETED_SALES_TEAMLEADS:
         return {
            ...state,
            delSalesTeamleads: action.payload,
            success: false
         }
      case DELETED_SUPERVISORS:
         return {
            ...state,
            delSupervisors: action.payload,
            success: false
         }
      case DELETED_USERS:
         return {
            ...state,
            delUsers: action.payload,
            success: false,
            fetched: true
         }
      case SUCCESS_MESSAGE:
         return {
            success: true
         }
      case DELETED_SUB_ADMINS:
         return {
            ...state,
            delSubAdmins: action.payload,
            success: false
         }
      case DELETED_RETENTION_AGENTS:
         return {
            ...state,
            delRetenAgents: action.payload,
            success: false
         }
      case DELETED_SALES_AGENTS:
         return {
            ...state,
            delSalesAgents: action.payload,
            success: false
         }
      case RECOVER_USER:
         return {
            ...state,
            delUsers: action.payload,
            success: true,
            fetched: true
         }
      case GET_USER:
         return {
            ...state,
            user: action.payload
         }
      case GET_USER_DETAILS:
         return {
            ...state,
            user: action.payload
         }
      case SHOW_ADMIN_BALANCE:
         return {
            ...state,
            adminBalance: action.payload
         }
      case GET_SENT_BALANCE_TO_USER:
         return {
            ...state,
            sentAmountToUser: action.payload
         }
      case REFERRALS_PER_ID:
         return {
            ...state,
            users: action.payload.referral
         }
      case ADD_USER:
         return {
            ...state,
            users: [...state.users, action.payload]
         }
      case EDIT_USER:
         return {
            ...state,
            // user: action.payload,
            success: true,
            userEditted: true
         }
      case ADD_CURRENCY_AMOUNT:
         return {
            ...state,
            userEditted: true
         }
      case NEW_START_PRICE:
         return {
            ...state,
            user: action.payload,
            success: true,
            userEditted: true
         }
      case REMOVE_CURRENCY_AMOUNT:
         return {
            ...state,
            userEditted: true
         }
      case RESOLVE_USER_TRANSACTION:
         return {
            ...state,
            userEditted: true
         }
      case REVERT_USER_TRANSACTION:
         return {
            ...state,
            userEditted: true
         }
      case DELETE_USER:
         return {
            ...state,
            user: action.payload,
            success: true,
            userDeleted: true
         }
      case DELETE_USERS:
         return {
            ...state,
            user: action.payload,
            success: true,
            userDeleted: true
         }
      case FORGET_PASSWORD:
         return {
            ...state,
            users: action.payload
         }
      case CHANGE_PASS:
         return {
            ...state,
            passChanged: true
         }
      case ADD_BALANCE:
         return {
            ...state,
            balance: action.payload,
            balanceAdded: true,
         }
      case TOGGLE_STATE:
         return {
            success: false
         }
      case GET_COUNTRIES:
         return {
            ...state,
            countries: action.payload,
            countriesFetched: true
         }

      case SHOW_AGENTS:
         return {
            ...state,
            allAgents: action.payload.agents,
            success: false,
            fetched: true
         }
      case SHOW_AGENT_ROLES:
         return {
            ...state,
            agentRoles: action.payload,
            success: false,
            fetched: true
         }
         
      case DELETED_AGENT:
         return {
            ...state,
            deleteAgent: action.payload,
            success: false,
            fetched: true
         }
      default:
         return {
            ...state,
         }
   }
}

export default userReducer