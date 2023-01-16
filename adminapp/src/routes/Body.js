import Layout from '../layout/MainLayout'
import Dashboard from '../pages/Dashboard/index'
import NotFound from '../components/NotFound'
import LoginPage from '../pages/Authentication/Login'
import ChangePassword from '../pages/ChangePassword/index'
import ForgetPassEmail from "../pages/ForgetPassEmail/index"
import { Switch, Route, Redirect, BrowserRouter as Router } from 'react-router-dom';
import Users from '../pages/Users/Users'
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
import { useEffect } from 'react'
import PermissionsModules from '../pages/PermissionsModule/PermissionsModules'
import AddPermissionsModule from '../pages/PermissionsModule/AddPermissionsModule'
import Leads from '../pages/Users/Leads'
import Affiliate from '../pages/Users/Affiliate'
// import RegisterPage from '../pages/Authentication/Registration'

const MainRoutes = (props) => {
    // const { token, setToken } = useToken()
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')

    const history = useHistory()
    useEffect(() => {
        console.log("token is ====>", token);
        if (!token) {
            history.push("/admin/login")
        }
    }, [])

    return (
        <Router>
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
                    <Route exact path={'/admin/roles'} component={Roles} />
                    <Route exact path={'/admin/add-role'} component={AddRole} />
                    <Route exact path={'/admin/edit-role/:id'} component={EditRole} />
                    <Route exact path={'/admin/permissions'} component={Permissions} />
                    <Route exact path={'/admin/add-permission'} component={AddPermission} />
                    <Route exact path={'/admin/permissions-modules'} component={PermissionsModules} />
                    <Route exact path={'/admin/add-permissions-module'} component={AddPermissionsModule} />
                    <Route exact path={'/admin/transactions'} component={Transactions} />
                    <Route exact path={'/admin/currency'} component={Currency} />
                    <Route exact path={'/admin/add-currency'} component={AddCurrency} />
                    <Route exact path={'/admin/edit-currency/:id'} component={EditCurrency} />
                    <Route exact path={'/admin/conversion-fee'} component={TransactionFee} />
                    <Route exact path={'/admin/set-conversion-fee'} component={SetTransactionFee} />
                    <Route exact path={'/admin/edit-conversion-fee/:id'} component={EditTransactionFee} />
                    <Route exact path={'/admin/change-password'} component={ChangePassword} />
                    <Route exact path={'/admin/permission-per-role/:id'} component={PermissionPerRole} />
                    <Route exact path={'/admin/settings'} component={Settings} />
                    {/* {/ <Route path='*' component={NotFound} / > /} */}
                    {/* <Route path="*" component={() => {
                                return (
                                    history.push('/')
                                )
                            }} /> */}
                </Switch>
            </Layout>

        </Router>
    )
}

export default MainRoutes;