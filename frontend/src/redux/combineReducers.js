import authReducer from "./auth/authReducer";
import { applyMiddleware, combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from 'redux-thunk'
import currencyReducer from "./currencies/currencyReducer";
import fiatCurrencyReducer from "./fiatCurrencies/fiatCurrencyReducer";
import walletReducer from "./wallet/walletReducer"
import userReducer from "./users/userReducer";
import roleReducer from "./roles/roleReducer";
import NetworkReducer from "./networks/networkReducer";
import externalWalletReducer from "./addresses/externalWalletReducer";
import creditCardReducer from "./cards/creditCardReducer";
import AccountReducer from "./account/accountReducer";
import withdrawFeeReducer from "./withdrawFee/withdrawFeeReducer";
import InternalOrderReducer from "./internalOrder/internalOrderReducer";
import ExternalTransactionReducer from "./externalTransactions/externalTransactionReducer";
import ExternalFiatTransactionReducer from "./externalFiatTransactions/externalFiatTransactionReducer";
import transactionFeeReducer from "./transactionFee/transactionFeeReducer";
import LeverageOrderReducer from "./leverageOrder/leverageOrderReducer";
import SpotOrderReducer from "./spotOrder/spotOrderReducer";
import marketReducer from "./market/marketReducer";
import CronReducer from "./cron/cronReducer";
import leverageReducer from "./leverage/leverageReducer";
import bankAccountReducer from "./bankAccounts/bankAccountReducer";
import ExternalBankTransactionReducer from "./externalBankTransactions/externalBankTransactionReducer";
import transactionReducer from "./transactions/transactionReducer";

const middleware = [thunk]
const reducer = combineReducers({
  auth: authReducer,
  currency: currencyReducer,
  fiatCurrency: fiatCurrencyReducer,
  networks: NetworkReducer,
  wallet: walletReducer,
  user: userReducer,
  role: roleReducer,
  externalWallets: externalWalletReducer,
  creditCards: creditCardReducer,
  bankAccounts: bankAccountReducer,
  accounts: AccountReducer,
  withdrawFee: withdrawFeeReducer,
  internalOrders: InternalOrderReducer,
  externalTransactions: ExternalTransactionReducer,
  externalFiatTransactions: ExternalFiatTransactionReducer,
  externalBankTransactions: ExternalBankTransactionReducer,
  transactionFee: transactionFeeReducer,
  LeverageOrders: LeverageOrderReducer,
  market: marketReducer,
  spotOrder: SpotOrderReducer,
  portfolioCurrencies: CronReducer,
  leverages: leverageReducer,
  adminTransactions: transactionReducer,
});

const rootReducer = (state, action) => {
  if (action.type === 'LOGOUT_USER') {
    return reducer(undefined, action)
  }

  return reducer(state, action)
}

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(...middleware))
)

export default store