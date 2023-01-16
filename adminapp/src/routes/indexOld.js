import Layout from '../layout/MainLayout'
import Dashboard from '../pages/Dashboard/index'
import NotFound from '../components/NotFound'
import LoginPage from '../pages/Authentication/Login'
import ChangePassword from '../pages/ChangePassword/index'
import ForgetPassEmail from "../pages/ForgetPassEmail/index"
import { Switch, Route, Redirect, BrowserRouter as Router } from 'react-router-dom';
import Users from '../pages/Users/Users'
import Leads from '../pages/Users/Leads'
import AddUser from '../pages/Users/AddUser'
import UserProfile from '../pages/Users/UserProfile'
import Roles from '../pages/Roles/Roles'
import AddRole from '../pages/Roles/AddRole'
import Permissions from '../pages/Permissions/Permissions'
import AddPermission from '../pages/Permissions/AddPermission'
import EditUser from '../pages/Users/EditUser'
import useToken from '../hooks/useToken';
import { useHistory } from 'react-router-dom';
import PermissionPerRole from '../pages/Roles/PermissionPerRole'
import EditRole from '../pages/Roles/EditRole'
import ForgetPasswords from "../pages/ForgetPasswords/index"
import Transactions from '../pages/Transactions/Transactions'
// import SendCurrency from "../pages/metamask/sendFosets"
import ReferedPage from "../pages/Referal/Referred"
import TransactionFee from '../pages/Transactions/TransactionFee'
import Currency from '../pages/Currency/Currency'
import AddCurrency from '../pages/Currency/AddCurrency'
import EditCurrency from '../pages/Currency/EditCurrency'
import Settings from '../pages/Settings/Settings'
import SetTransactionFee from '../pages/Transactions/SetTransactionFee'
import EditTransactionFee from '../pages/Transactions/EditTransactionFee'
import SubAdmins from '../pages/SubAdmin/SubAdmins'
import AddSubAdmin from '../pages/SubAdmin/AddSubAdmin'
import EditSubAdmin from '../pages/SubAdmin/EditSubAdmin'
import DeletedUsers from '../pages/Users/DeletedUsers'
import DeletedSubAdmins from '../pages/SubAdmin/DeletedSubAdmins'
import UserDetail from '../pages/Users/UserDetail'
import CommissionHistory from '../pages/Commission/CommsionHistory'
import CommissionStatistics from '../pages/Commission/CommissionStatistics'
import PartnerList from '../pages/Partner/PartnerList'
import Network from '../pages/Network/Network'
import AddNetwork from '../pages/Network/AddNetwork'
import EditNetwork from '../pages/Network/EditNetwork'
import WithdrawFee from '../pages/WithdrawFees/WithdrawFee'
import SetWithdrawFee from '../pages/WithdrawFees/SetWithdrawFee'
import EditWithdrawFee from '../pages/WithdrawFees/EditWithdrawFee'
import Leverage from '../pages/Leverage/Leverage'
import SetLeverage from '../pages/Leverage/SetLeverage'
import EditLeverage from '../pages/Leverage/EditLeverage'
import Affiliate from '../pages/Users/Affiliate'
import AffiliateDetails from '../pages/Users/AffiliateDetails'
// import RegisterPage from '../pages/Authentication/Registration'

const MainRoutes = (props) => {
    // const { token, setToken } = useToken()
    const token = localStorage.getItem('token')

    return (
        <Router>
            {
                token ?
                    <Layout>
                        <Switch>
                            <Route exact path={'/admin/'} component={Dashboard} />
                            <Route exact path={'/admin/dashboard'} component={Dashboard} />
                            <Route exact path={'/admin/users'} component={Users} />
                            <Route exact path={'/admin/leads'} component={Leads} />
                            <Route exact path={'/admin/affiliate'} component={Affiliate} />
                            <Route exact path={'/admin/add-user'} component={AddUser} />
                            <Route exact path={'/admin/edit-user/:id'} component={EditUser} />
                            <Route exact path={'/admin/user-profile'} component={UserProfile} />
                            <Route exact path={'/admin/user-detail/:id'} component={UserDetail} />
                            <Route exact path={'/admin/affiliate-detail/:id'} component={AffiliateDetails} />
                            <Route exact path={'/admin/roles'} component={Roles} />
                            <Route exact path={'/admin/add-role'} component={AddRole} />
                            <Route exact path={'/admin/edit-role/:id'} component={EditRole} />
                            <Route exact path={'/admin/permissions'} component={Permissions} />
                            <Route exact path={'/admin/add-permission'} component={AddPermission} />
                            <Route exact path={'/admin/transactions'} component={Transactions} />
                            <Route exact path={'/admin/networks'} component={Network} />
                            <Route exact path={'/admin/add-network'} component={AddNetwork} />
                            <Route exact path={'/admin/edit-network/:id'} component={EditNetwork} />
                            <Route exact path={'/admin/currency'} component={Currency} />
                            <Route exact path={'/admin/add-currency'} component={AddCurrency} />
                            <Route exact path={'/admin/edit-currency/:id'} component={EditCurrency} />
                            <Route exact path={'/admin/conversion-fee'} component={TransactionFee} />
                            <Route exact path={'/admin/set-conversion-fee'} component={SetTransactionFee} />
                            <Route exact path={'/admin/edit-conversion-fee/:id'} component={EditTransactionFee} />
                            <Route exact path={'/admin/withdraw-fee'} component={WithdrawFee} />
                            <Route exact path={'/admin/set-withdraw-fee'} component={SetWithdrawFee} />
                            <Route exact path={'/admin/edit-withdraw-fee/:id'} component={EditWithdrawFee} />
                            <Route exact path={'/admin/leverage'} component={Leverage} />
                            <Route exact path={'/admin/set-leverage'} component={SetLeverage} />
                            <Route exact path={'/admin/edit-leverage/:id'} component={EditLeverage} />
                            <Route exact path={'/admin/sub-admins'} component={SubAdmins} />
                            <Route exact path={'/admin/add-sub-admin'} component={AddSubAdmin} />
                            <Route exact path={'/admin/edit-sub-admin/:id'} component={EditSubAdmin} />
                            <Route exact path={'/admin/partner-list'} component={PartnerList} />
                            <Route exact path={'/admin/trade-history'} component={CommissionHistory} />
                            <Route exact path={'/admin/commission-statistics'} component={CommissionStatistics} />
                            <Route exact path={'/admin/deleted-users'} component={DeletedUsers} />
                            <Route exact path={'/admin/deleted-sub-admins'} component={DeletedSubAdmins} />
                            <Route exact path={'/admin/change-password'} component={ChangePassword} />
                            <Route exact path={'/admin/permission-per-role/:id'} component={PermissionPerRole} />
                            <Route exact path={'/admin/settings'} component={Settings} />
                            {/* <Route path='*' component={NotFound} /> */}
                            {/* <Route path="*" component={() => {
                                return (
                                    history.push('/')
                                )
                            }} /> */}
                        </Switch>
                    </Layout>
                    :
                    <Switch>
                        <Route exact path={'/admin/change-password'} component={ChangePassword} />
                        <Route exact path={'/admin/forget-password/:token'} component={ForgetPasswords} />
                        <Route exact path={'/admin/referred/:code'} component={ReferedPage} />

                        <Route exact path={'/admin/forget-password-email'} component={ForgetPassEmail} />
                        {/* <Route exact path={'/admin/register'} component={RegisterPage} /> */}
                        {/* <Route component={NotFound} /> */}
                        <Route exact path="/admin/login" component={LoginPage} />
                        <Route path="/admin/" component={LoginPage} />
                        {/* <Route path="*" component={
                            history.push('/login')
                        } /> */}
                    </Switch>
            }
        </Router>
    )
}

export default MainRoutes;
