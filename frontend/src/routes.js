// layouts
import PublicLayout from "./components/layouts/PublicLayout";
import AuthLayout from "./components/layouts/AuthLayout";
import PrivateLayout from "./components/layouts/PrivateLayout";

// Public Components
import LandingPageStarbitrex from "./components/LandingPageStarbitrex";
import WelcomeBackStarbitrex from './components/WelcomeBackStarbitrex'
import TradePage from "./components/Trade/TradePage";
import PortfolioStarbitrex from "./components/PortfolioStarbitrex";
import BackupStarbitrex from "./components/BackupStarbitrex";
import AdditionalSecurityStarbitrex from "./components/AdditionalSecurityStarbitrex";
import ConnectDevicesStarbitrex from "./components/ConnectDevicesStarbitrex";
import ExchangeStarbitrex from "./components/ExchangeStarbitrex";
import ExchangeFiatStarbitrex from "./components/ExchangeFiatStarbitrex";
import TransactionsStarbitrex from "./components/TransactionsStarbitrex";
import CoinAvtivityStarbitrex from "./components/CoinAvtivityStarbitrex";
import FiatCoinAvtivityStarbitrex from "./components/FiatCoinAvtivityStarbitrex";
import PersonalizeStarbitrex from "./components/PersonalizeStarbitrex";
import AssetsStarbitrex from "./components/AssetsStarbitrex";
import MarketPage from "./components/Market/MarketInfo";
import LeverageMargin from "./components/LeverageMargin";
// import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import ChangePassword from "./components/ChangePassword/ChangePassword";

// Auth Components
import LoginStarbitrex from "./components/LoginStarbitrex";
import RegisterStarbitres from "./components/RegisterStarbitrex";
import RestoreStarbitrex from './components/RestoreStarbitrex';
import CreatePasswordStarbitrex from "./components/CreatePasswordStarbitrex";
import TradeSpotStarbitrex from "./components/TradeSpotStarbitrex";
// import Referred from "./components/Referral/Referred";

// Private Components
import WithdrawCryptoPage from "./components/WithdrawCrypto/WithdrawCryptoPage";
import WithdrawFiatPage from "./components/WithdrawFiat/WithdrawFiatPage";
import DepositPage from "./components/Deposit/DepositPage";
import FiatDepositPage from "./components/FiatDeposit/FiatDepositPage";
import Setting from "./components/Setting/Setting";

const routes = [
  { path: "/", exact: true, name: "Home", layout: PublicLayout, component: LandingPageStarbitrex },

  { path: "/trade/:coins", exact: true, name: "Trade", layout: PublicLayout, component: TradePage },
  { path: "/trade-spot/:coins", exact: true, name: "Trade Spot", layout: PublicLayout, component: TradeSpotStarbitrex },
  { path: "/backup", exact: true, name: "Backup", layout: PublicLayout, component: BackupStarbitrex },
  { path: "/additional-security", exact: true, name: "Addition Security", layout: PublicLayout, component: AdditionalSecurityStarbitrex },
  { path: "/connect-device", exact: true, name: "Connect Device", layout: PublicLayout, component: ConnectDevicesStarbitrex },
  { path: "/personalize", exact: true, name: "Personalize", layout: PublicLayout, component: PersonalizeStarbitrex },
  { path: "/assets", exact: true, name: "Assets", layout: PublicLayout, component: AssetsStarbitrex },
  { path: "/market", exact: true, name: "Market", layout: PublicLayout, component: MarketPage },
  { path: "/leverage-margin", exact: true, name: "LeverageMargin", layout: PublicLayout, component: LeverageMargin },



  { path: "/register", exact: true, name: "Register", layout: AuthLayout, component: LoginStarbitrex },
  { path: "/login", exact: true, name: "Login", layout: AuthLayout, component: LoginStarbitrex },
  { path: "/restore", exact: true, name: "Restore", layout: AuthLayout, component: RestoreStarbitrex },
  { path: "/welcome-back", exact: true, name: "WelcomeBack", layout: AuthLayout, component: WelcomeBackStarbitrex },
  // { path: "/forgot-password", exact: true, name: "Forgot Password", layout: AuthLayout, component: ForgotPassword },
  { path: "/change-password", exact: true, name: "Change Password", layout: PrivateLayout, component: ChangePassword },
  // { path: "/referred/:code", exact: true, name: "Referred", layout: AuthLayout, component: Referred },

  { path: "/portfolio", exact: true, name: "Portfolio", layout: PrivateLayout, component: PortfolioStarbitrex },
  { path: "/exchange/:symbol", exact: true, name: "Exchange", layout: PrivateLayout, component: ExchangeStarbitrex },
  { path: "/fiat-exchange/:symbol", exact: true, name: "Exchange", layout: PrivateLayout, component: ExchangeFiatStarbitrex },
  { path: "/transactions", exact: true, name: "Transactions", layout: PrivateLayout, component: TransactionsStarbitrex },
  { path: "/activity/:coin", exact: true, name: "Coin Avtivity", layout: PrivateLayout, component: CoinAvtivityStarbitrex },
  { path: "/fiat-activity/:coin", exact: true, name: "Fiat Coin Avtivity", layout: PrivateLayout, component: FiatCoinAvtivityStarbitrex },
  { path: "/create-password", exact: true, name: "CreatePassword", layout: PrivateLayout, component: CreatePasswordStarbitrex },
  { path: "/withdraw-crypto/:symbol", exact: true, name: "Withdraw", layout: PrivateLayout, component: WithdrawCryptoPage },
  { path: "/withdraw-fiat/:symbol", exact: true, name: "Withdraw Fiat", layout: PrivateLayout, component: WithdrawFiatPage },
  { path: "/deposit/:symbol", exact: true, name: "Deposit", layout: PrivateLayout, component: DepositPage },
  { path: "/fiat-deposit/:symbol", exact: true, name: "Fiat Deposit", layout: PrivateLayout, component: FiatDepositPage },
  { path: "/profile-setting", exact: true, name: "Settings", layout: PrivateLayout, component: Setting },
];

export default routes;


// ===========
// EXTRA OLD ROUTES
// ===========

{/* <Route path="trade/:coins" element={<TradePage />} /> */ }
{/* <Route path="futures" element={<EarnPage />} /> */ }
{/* <Route path="market" element={<MarketPage />} /> */ }

{/* <Route path="deposit-fiat" element={<DepositFiatPage />} /> */ }
{/* <Route path="deposit-fiat2" element={<DepositFiat2Page />} /> */ }
{/* <Route path="convert-history" element={<ConvertHistoryPage />} /> */ }
{/* <Route path="forgot-password2" element={<ForgotPassword2 />} /> */ }
