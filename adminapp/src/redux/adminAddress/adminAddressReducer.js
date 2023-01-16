import { GET_ADMIN_ADDRESSES, GET_ADMIN_ADDRESSES_NETWORK, GET_ADMIN_ADDRESS, ADD_ADMIN_ADDRESS, EDIT_ADMIN_ADDRESS, DELETE_ADMIN_ADDRESS, SET_DEFAULT_ADMIN_ADDRESS, TOGGLE_STATE, ERROR_STATE } from "./adminAddressTypes";

const initialState = {
    adminAddresses: [],
    adminAddressesNetwork: [],
    adminAddress: {},
    adminAddressesfetched: false,
    adminAddressAdded: false,
    adminAddressfetched: false,
    adminAddressesNetworkfetched: false,
    adminAddressEditted: false,
    adminAddressDeleted: false,
    adminAddressDefaultSet: false,
    error: false
 }

 const adminAddressReducer = (state = initialState, action) => {
    switch (action.type) {
       case GET_ADMIN_ADDRESSES:
          return {
             ...state,
             adminAddresses: action.payload,
             adminAddressesfetched: true
          }
       case GET_ADMIN_ADDRESSES_NETWORK:
            return {
               ...state,
               adminAddressesNetwork: action.payload,
               adminAddressesNetworkfetched: true
            }
       case GET_ADMIN_ADDRESS:
          return {
             ...state,
             adminAddress: action.payload,
             adminAddressfetched: true
          }
       case ADD_ADMIN_ADDRESS:
          return {
             ...state,
             adminAddresses: [state.adminAddresses, action.payload],
             adminAddressAdded: true
          }
       case EDIT_ADMIN_ADDRESS:
          return {
             ...state,
             adminAddress: action.payload,
             adminAddressEditted: true
          }
       case DELETE_ADMIN_ADDRESS:
          return {
             ...state,
             adminAddressesNetwork: state.adminAddressesNetwork.filter(item => item._id !== action.payload),
             adminAddressDeleted: true
          }
       case SET_DEFAULT_ADMIN_ADDRESS:
          return {
             ...state,
             adminAddressDefaultSet: true
          }
       case TOGGLE_STATE:
          return {
             ...state,
             adminAddressesfetched: false,
             adminAddressAdded: false,
             adminAddressfetched: false,
             adminAddressEditted: false,
             adminAddressDeleted: false,
             adminAddressDefaultSet: false,
             adminAddressesNetworkfetched: false,
             error: false
          }
       case ERROR_STATE:
          return {
             ...state,
             error: true
          }
       default:
          return state
    }
 }
 
 export default adminAddressReducer;