import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/starbitrex.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage/LandingPage';
import LoginPage from './components/Login/LoginPage';
import RegisterPage from './components/Register/RegisterPage';
import WithdrawCryptoPage from './components/WithdrawCrypto/WithdrawCryptoPage';
import TransectionHistoryPage from './components/TransectionHistory/TransectionHistoryPage';
import ReceiveAmountPage from './components/ReceiveAmount/ReceiveAmountPage';
import PersonalPage from './components/PersonalInfo/PersonalPage';
import OverviewPage from './components/Overview/OverviewPage';
import IdentityVerificationPage from './components/IdentityVerification/IdentityVerificationPage';
import IdentityVerificationPage2 from './components/IdentityVerification2/IdentityVerificationPage2';
import DepositPage from './components/Deposit/DepositPage';
import DepositFiatPage from './components/DepositFiat/DepositFiatPage';
import DepositFiat2Page from './components/DepositFiat2/DepositFiat2Page';
import AdditionalInformationPage from './components/AdditionalInformation/AdditionalInformationPage';
import AccountCreatedPage from './components/AccountCreated/AccountCreatedPage';
import ConvertHistoryPage from './components/ConvertHistory/ConvertHistoryPage';
import MarketPage from './components/Market/MarketInfo';
import TradePage from './components/Trade/TradePage';
import EarnPage from './components/Earn/EarnPage';
import AccountStatement from './components/AccountStatement/AccountStatement';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import ForgotPassword2 from './components/ForgotPassword2/ForgotPassword2';
import Dashboard from './components/Dashboard/Dashboard';
import Setting from './components/Setting/Setting';
import ChangePassword from './components/ChangePassword/ChangePassword';
import ReferredPage from './components/Referral/Referred';
import ManageAddressPage from './components/ManageAddress/ManageAddressPage';
import Header from './components/Header/Header';
import SideBar from './components/SideBar/SideBar';
import Convert from './components/Convert/Convert';
import { useState, useEffect } from 'react';

function App() {

  const [showSidebar, setShowSidebar] = useState(false);
  const [path, setPath] = useState('');
  const token = localStorage.getItem('uToken');

  useEffect(() => {
    handleSidebar()
  }, [path]);

  const handleSidebar = () => {
    const path = window.location.pathname;
    if (path == '/overview' || path == '/transaction-history' || path == '/account-statement' || path == '/convert-history') {
      setShowSidebar(true)
    }
    setPath(path)
  }

  return (
    <div className="App">
      <div className='wrapper'>

        <BrowserRouter>
          <Header />
          {/* {showSidebar == true ? ( <SideBar /> ) : ''} */}

          {token ?
            <Routes>

              <Route path="/" element={<LandingPage />} />
              <Route path="manage-address" element={<ManageAddressPage />} />
              <Route path="withdraw-crypto" element={<WithdrawCryptoPage />} />
              <Route path="transaction-history" element={<TransectionHistoryPage />} />
              <Route path="receive-amount" element={<ReceiveAmountPage />} />
              <Route path="personal-info" element={<PersonalPage />} />
              <Route path="overview" element={<OverviewPage />} />
              <Route path="identity-verification" element={<IdentityVerificationPage />} />
              <Route path="identity-verification2" element={<IdentityVerificationPage2 />} />
              <Route path="deposit" element={<DepositPage />} />
              <Route path="deposit-fiat" element={<DepositFiatPage />} />
              <Route path="deposit-fiat2" element={<DepositFiat2Page />} />
              <Route path="additional-info" element={<AdditionalInformationPage />} />
              <Route path="account-created" element={<AccountCreatedPage />} />
              <Route path="convert-history" element={<ConvertHistoryPage />} />
              <Route path="market" element={<MarketPage />} />
              <Route path="trade/:coins" element={<TradePage />} />
              <Route path="futures" element={<EarnPage />} />
              <Route path="account-statement" element={<AccountStatement />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="forgot-password2" element={<ForgotPassword2 />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="settings" element={<Setting />} />
              <Route path="change-password" element={<ChangePassword />} />
              <Route path="convert" element={<Convert />} />
              <Route path="*" element={<OverviewPage />} />
            </Routes>
            :
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="referred/:code" element={<ReferredPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="market" element={<MarketPage />} />
              <Route path="trade/:coins" element={<TradePage />} />
              <Route path="futures" element={<EarnPage />} />
              <Route path="*" element={<LoginPage />} />
            </Routes>
          }
        </BrowserRouter>
      </div>
    </div>
  );
}
export default App;
