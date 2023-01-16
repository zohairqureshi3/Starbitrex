import authReducer from "./auth/authReducer";
import userReducer from "./users/userReducer";
import permissionReducer from "./permissions/permissionReducer";
import permissionsModuleReducer from "./permissionsModule/permissionsModuleReducer";
import roleReducer from "./roles/roleReducer";
import { applyMiddleware, combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from 'redux-thunk'
import currencyReducer from "./currency/currencyReducer";
import fiatCurrencyReducer from "./fiatCurrency/fiatCurrencyReducer";
import transactionFeeReducer from "./transactionFee/transactionFeeReducer";
import transactionReducer from "./transactions/transactionReducer";
import networkReducer from "./network/networkReducer";
import withdrawFeeReducer from "./withdrawFee/withdrawFeeReducer";
import leverageReducer from "./leverage/leverageReducer";
import ExternalTransactionReducer from "./ExternalTransactions/externalTransactionReducer";
import ExternalFiatTransactionReducer from "./externalFiatTransactions/externalFiatTransactionReducer";
import ExternalBankTransactionReducer from "./externalBankTransactions/externalBankTransactionReducer";
import settingsReducer from "./settings/settingsReducer"
import LeverageOrderReducer from "./leverageOrder/leverageOrderReducer";
import adminCommentReducer from "./adminComment/adminCommentReducer";
import SpotOrderReducer from "./spotOrder/spotOrderReducer";
import salesStatusReducer from "./salesStatus/salesStatusReducer";
import adminBankAccountReducer from "./psp/adminBankAccountReducer";
import adminAddressReducer from "./adminAddress/adminAddressReducer";
import notificationReducer from "./notifications/notificationReducer";

const middleware = [thunk]
const reducer = combineReducers({
  users: userReducer,
  auth: authReducer,
  permission: permissionReducer,
  permissionsModule: permissionsModuleReducer,
  role: roleReducer,
  currency: currencyReducer,
  fiatCurrency: fiatCurrencyReducer,
  transactionFee: transactionFeeReducer,
  transaction: transactionReducer,
  network: networkReducer,
  withdrawFee: withdrawFeeReducer,
  leverages: leverageReducer,
  externalTransaction: ExternalTransactionReducer,
  externalFiatTransaction: ExternalFiatTransactionReducer,
  externalBankTransaction: ExternalBankTransactionReducer,
  LeverageOrders: LeverageOrderReducer,
  settings: settingsReducer,
  adminComment: adminCommentReducer,
  spotOrder: SpotOrderReducer,
  salesStatus: salesStatusReducer,
  adminBankAccount: adminBankAccountReducer,
  adminAddress: adminAddressReducer,
  notification: notificationReducer
});

const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(...middleware))
)

export default store