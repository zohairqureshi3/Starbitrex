// Auth Components
import LoginPage from '../pages/Authentication/Login'
import ForgetPassEmail from "../pages/ForgetPassEmail";
import ForgetPasswords from "../pages/ForgetPasswords";

// Private Components
import ChangePassword from "../pages/ChangePassword";
import Dashboard from "../pages/Dashboard";
import Users from "../pages/Users/Users";
import AddUser from "../pages/Users/AddUser";
import EditUser from "../pages/Users/EditUser";
import UserProfile from "../pages/Users/UserProfile";
import UserDetail from "../pages/Users/UserDetail";
import Roles from "../pages/Roles/Roles";
import AddRole from "../pages/Roles/AddRole";
import EditRole from "../pages/Roles/EditRole";
import AddPermission from "../pages/Permissions/AddPermission";
import Permissions from "../pages/Permissions/Permissions";
import Transactions from "../pages/Transactions/Transactions";
import ExternalTransactions from "../pages/Transactions/ExternalTransactions";
import Network from "../pages/Network/Network";
import AddNetwork from "../pages/Network/AddNetwork";
import EditNetwork from "../pages/Network/EditNetwork";
import Currency from "../pages/Currency/Currency";
import AddCurrency from "../pages/Currency/AddCurrency";
import EditCurrency from "../pages/Currency/EditCurrency";
import TransactionFee from "../pages/Transactions/TransactionFee";
import SetTransactionFee from "../pages/Transactions/SetTransactionFee";
import EditTransactionFee from "../pages/Transactions/EditTransactionFee";
import WithdrawFee from "../pages/WithdrawFees/WithdrawFee";
import SetWithdrawFee from "../pages/WithdrawFees/SetWithdrawFee";
import EditWithdrawFee from "../pages/WithdrawFees/EditWithdrawFee";
import Leverage from "../pages/Leverage/Leverage";
import SetLeverage from "../pages/Leverage/SetLeverage";
import EditLeverage from "../pages/Leverage/EditLeverage";
import SubAdmins from "../pages/SubAdmin/SubAdmins";
import SalesAgents from '../pages/SubAdmin/SalesAgents';
import AddSubAdmin from "../pages/SubAdmin/AddSubAdmin";
import EditSubAdmin from "../pages/SubAdmin/EditSubAdmin";
import PartnerList from "../pages/Partner/PartnerList";
import CommissionHistory from "../pages/Commission/CommsionHistory";
import CommissionStatistics from "../pages/Commission/CommissionStatistics";
import DeletedUsers from "../pages/Users/DeletedUsers";
import DeletedSubAdmins from "../pages/SubAdmin/DeletedSubAdmins";
import PermissionPerRole from "../pages/Roles/PermissionPerRole";
import Settings from "../pages/Settings/Settings";
import PendingWithdraws from '../pages/PendingWithdraws/PendingWithdraws';
import WithdrawCurrency from '../pages/WithdrawCurrency/WithdrawCurrency';
import PermissionsModules from '../pages/PermissionsModule/PermissionsModules';
import AddPermissionsModule from '../pages/PermissionsModule/AddPermissionsModule';
import OpenOrders from '../pages/OpenOrders';
import OrderHistory from '../pages/OrdersHistory';
import Leads from '../pages/Users/Leads';
import Affiliate from '../pages/Users/Affiliate';
import AffiliateDetails from '../pages/Users/AffiliateDetails';
import FiatCurrency from '../pages/FiatCurrency/FiatCurrency';
import AddFiatCurrency from '../pages/FiatCurrency/AddFiatCurrency';
import EditFiatCurrency from '../pages/FiatCurrency/EditFiatCurrency';
import RetenAgents from '../pages/SubAdmin/RetenAgents';
import Supervisors from '../pages/SubAdmin/Supervisors';
import SalesTeamleads from '../pages/SubAdmin/SalesTeamleads';
import RetenTeamleads from '../pages/SubAdmin/RetenTeamleads';
import AffUserDetail from '../pages/AffiliateMonitor/AffUserDetail';
import AffDeposit from '../pages/AffiliateMonitor/AffDeposit';
import SalesStatus from '../pages/SalesStatus/SalesStatus';
import AddSalesStatus from '../pages/SalesStatus/AddSalesStatus';
import EditSalesStatus from '../pages/SalesStatus/EditSalesStatus';
import AdminBankAccount from '../pages/PSP/AdminBankAccount';
import AddAdminBankAccount from '../pages/PSP/AddAdminBankAccount';
import EditAdminBankAccount from '../pages/PSP/EditAdminBankAccount';
import AddAdminAddress from '../pages/PSP/AddAdminAddress';
import AdminAddress from '../pages/PSP/AdminAddress';
import EditAdminAddress from '../pages/PSP/EditAdminAddress';
import Notifications from '../pages/notifications/notifications';
import CRMUsers from '../pages/SubAdmin/CRMUsers';
import ChatBox from '../pages/ChatBox';

const routes = [
  { path: "/admin/login", exact: true, name: "Login", layout: "AuthLayoutRoute", component: LoginPage },
  { path: "/admin/forget-password-email", exact: true, name: "Forgot Password", layout: "AuthLayoutRoute", component: ForgetPassEmail },
  { path: "/admin/forget-password/:token", exact: true, name: "Forgot Password", layout: "AuthLayoutRoute", component: ForgetPasswords },
  { path: "/admin/change-password", exact: true, name: "Change Password", layout: "PrivateLayoutRoute", component: ChangePassword },
  { path: "/admin/", exact: true, name: "Dashboard", layout: "PrivateLayoutRoute", component: Dashboard },
  { path: "/admin/dashboard", exact: true, name: "Dashboard", layout: "PrivateLayoutRoute", component: Dashboard },
  { path: "/admin/notifications", exact: true, name: "Notifications", layout: "PrivateLayoutRoute", component: Notifications },
  { path: "/admin/users", exact: true, name: "Users", layout: "PrivateLayoutRoute", component: Users },
  { path: "/admin/leads", exact: true, name: "Leads", layout: "PrivateLayoutRoute", component: Leads },
  { path: "/admin/crm-users", exact: true, name: "CRMUsers", layout: "PrivateLayoutRoute", component: CRMUsers },
  { path: "/admin/affiliate", exact: true, name: "Leads", layout: "PrivateLayoutRoute", component: Affiliate },
  { path: "/admin/add-user", exact: true, name: "Add User", layout: "PrivateLayoutRoute", component: AddUser },
  { path: "/admin/edit-user/:id", exact: true, name: "Edit User", layout: "PrivateLayoutRoute", component: EditUser },
  { path: "/admin/user-profile", exact: true, name: "User Profile", layout: "PrivateLayoutRoute", component: UserProfile },
  { path: "/admin/user-detail/:id", exact: true, name: "User Detail", layout: "PrivateLayoutRoute", component: UserDetail },
  { path: "/admin/affiliate-detail/:id", exact: true, name: "User Detail", layout: "PrivateLayoutRoute", component: AffiliateDetails },
  { path: "/admin/roles", exact: true, name: "Roles", layout: "PrivateLayoutRoute", component: Roles },
  { path: "/admin/add-role", exact: true, name: "Add Role", layout: "PrivateLayoutRoute", component: AddRole },
  { path: "/admin/edit-role/:id", exact: true, name: "Edit Role", layout: "PrivateLayoutRoute", component: EditRole },
  { path: "/admin/permissions", exact: true, name: "Permissions", layout: "PrivateLayoutRoute", component: Permissions },
  { path: "/admin/add-permission", exact: true, name: "Add Permission", layout: "PrivateLayoutRoute", component: AddPermission },
  { path: "/admin/permissions-modules", exact: true, name: "Permissions Modules", layout: "PrivateLayoutRoute", component: PermissionsModules },
  { path: "/admin/add-permissions-module", exact: true, name: "Add Permissions Module", layout: "PrivateLayoutRoute", component: AddPermissionsModule },
  { path: "/admin/pending-withdraws", exact: true, name: "PendingWithdraws", layout: "PrivateLayoutRoute", component: PendingWithdraws },
  { path: "/admin/transactions", exact: true, name: "Transactions", layout: "PrivateLayoutRoute", component: Transactions },
  { path: "/admin/external-transactions", exact: true, name: "External Transactions", layout: "PrivateLayoutRoute", component: ExternalTransactions },
  // { path: "/admin/networks", exact: true, name: "Networks", layout: "PrivateLayoutRoute", component: Network },
  // { path: "/admin/add-network", exact: true, name: "Add Network", layout: "PrivateLayoutRoute", component: AddNetwork },
  { path: "/admin/edit-network/:id", exact: true, name: "Edit Network", layout: "PrivateLayoutRoute", component: EditNetwork },
  { path: "/admin/currency", exact: true, name: "Currencies", layout: "PrivateLayoutRoute", component: Currency },
  { path: "/admin/withdraw-currency", exact: true, name: "Withdraw Currency", layout: "PrivateLayoutRoute", component: WithdrawCurrency },
  // { path: "/admin/add-currency", exact: true, name: "Add Currency", layout: "PrivateLayoutRoute", component: AddCurrency },
  { path: "/admin/edit-currency/:id", exact: true, name: "Edit Currency", layout: "PrivateLayoutRoute", component: EditCurrency },
  { path: "/admin/conversion-fee", exact: true, name: "Conversion Fee", layout: "PrivateLayoutRoute", component: TransactionFee },
  { path: "/admin/set-conversion-fee", exact: true, name: "Set Conversion Fee", layout: "PrivateLayoutRoute", component: SetTransactionFee },
  { path: "/admin/edit-conversion-fee/:id", exact: true, name: "Edit Conversion Fee", layout: "PrivateLayoutRoute", component: EditTransactionFee },
  { path: "/admin/withdraw-fee", exact: true, name: "Withdraw Fees", layout: "PrivateLayoutRoute", component: WithdrawFee },
  { path: "/admin/set-withdraw-fee", exact: true, name: "Set Withdraw Fees", layout: "PrivateLayoutRoute", component: SetWithdrawFee },
  { path: "/admin/edit-withdraw-fee/:id", exact: true, name: "Edit Withdraw Fees", layout: "PrivateLayoutRoute", component: EditWithdrawFee },
  { path: "/admin/leverage", exact: true, name: "Leverages", layout: "PrivateLayoutRoute", component: Leverage },
  { path: "/admin/set-leverage", exact: true, name: "Set Leverage", layout: "PrivateLayoutRoute", component: SetLeverage },
  { path: "/admin/edit-leverage/:id", exact: true, name: "Edit Leverage", layout: "PrivateLayoutRoute", component: EditLeverage },
  { path: "/admin/sub-admins", exact: true, name: "Sub Admins", layout: "PrivateLayoutRoute", component: SubAdmins },
  { path: "/admin/sales-agents", exact: true, name: "Sales Agents", layout: "PrivateLayoutRoute", component: SalesAgents },
  { path: "/admin/sales-teamleads", exact: true, name: "Sales Teamleads", layout: "PrivateLayoutRoute", component: SalesTeamleads },
  { path: "/admin/reten-teamleads", exact: true, name: "Reten Teamleads", layout: "PrivateLayoutRoute", component: RetenTeamleads },
  { path: "/admin/reten-agents", exact: true, name: "Reten Agents", layout: "PrivateLayoutRoute", component: RetenAgents },
  { path: "/admin/supervisors", exact: true, name: "Supervisors", layout: "PrivateLayoutRoute", component: Supervisors },
  { path: "/admin/add-sub-admin", exact: true, name: "Add Sub Admin", layout: "PrivateLayoutRoute", component: AddSubAdmin },
  { path: "/admin/edit-sub-admin/:id", exact: true, name: "Edit Sub Admin", layout: "PrivateLayoutRoute", component: EditSubAdmin },
  { path: "/admin/partner-list", exact: true, name: "Partners", layout: "PrivateLayoutRoute", component: PartnerList },
  { path: "/admin/trade-history", exact: true, name: "Commision History", layout: "PrivateLayoutRoute", component: CommissionHistory },
  { path: "/admin/commission-statistics", exact: true, name: "Commision Statics", layout: "PrivateLayoutRoute", component: CommissionStatistics },
  { path: "/admin/deleted-users", exact: true, name: "Deleted Users", layout: "PrivateLayoutRoute", component: DeletedUsers },
  { path: "/admin/deleted-sub-admins", exact: true, name: "Deleted Sub Admins", layout: "PrivateLayoutRoute", component: DeletedSubAdmins },
  { path: "/admin/change-password", exact: true, name: "Change Password", layout: "PrivateLayoutRoute", component: ChangePassword },
  { path: "/admin/permission-per-role/:id", exact: true, name: "Role Permissions", layout: "PrivateLayoutRoute", component: PermissionPerRole },
  { path: "/admin/settings", exact: true, name: "Settings", layout: "PrivateLayoutRoute", component: Settings },
  { path: "/admin/open-orders", exact: true, name: "Open Order", layout: "PrivateLayoutRoute", component: OpenOrders },
  { path: "/admin/orders-history", exact: true, name: "Orders History", layout: "PrivateLayoutRoute", component: OrderHistory },
  { path: "/admin/fiat-currency", exact: true, name: "Currencies", layout: "PrivateLayoutRoute", component: FiatCurrency },
  // { path: "/admin/add-fiat-currency", exact: true, name: "Add Currency", layout: "PrivateLayoutRoute", component: AddFiatCurrency },
  { path: "/admin/edit-fiat-currency/:id", exact: true, name: "Edit Currency", layout: "PrivateLayoutRoute", component: EditFiatCurrency },
  { path: "/admin/aff/user-detail/:id", exact: true, name: "User Detail", layout: "AffiliateLayoutRoute", component: AffUserDetail },
  { path: "/admin/aff/deposit", exact: true, name: "Monitor Deposit", layout: "AffiliateAuthLayoutRoute", component: AffDeposit },
  { path: "/admin/statuses", exact: true, name: "Statuses", layout: "PrivateLayoutRoute", component: SalesStatus },
  { path: "/admin/add-status", exact: true, name: "Add Status", layout: "PrivateLayoutRoute", component: AddSalesStatus },
  { path: "/admin/edit-status/:id", exact: true, name: "Edit Status", layout: "PrivateLayoutRoute", component: EditSalesStatus },
  { path: "/admin/bank-accounts", exact: true, name: "Statuses", layout: "PrivateLayoutRoute", component: AdminBankAccount },
  { path: "/admin/add-bank-account", exact: true, name: "Add Status", layout: "PrivateLayoutRoute", component: AddAdminBankAccount },
  { path: "/admin/edit-bank-account/:id", exact: true, name: "Edit Status", layout: "PrivateLayoutRoute", component: EditAdminBankAccount },
  { path: "/admin/add-admin-address", exact: true, name: "Add Status", layout: "PrivateLayoutRoute", component: AddAdminAddress },
  { path: "/admin/admin-addresses", exact: true, name: "Statuses", layout: "PrivateLayoutRoute", component: AdminAddress },
  { path: "/admin/edit-admin-address/:id", exact: true, name: "Edit Status", layout: "PrivateLayoutRoute", component: EditAdminAddress },
  { path: "/admin/chatbox", exact: true, name: "Chat Box", layout: "PrivateLayoutRoute", component: ChatBox },
];

export default routes;
// { path: "/admin/referred/:code", exact: true, name: "Reffered", layout: PublicLayout, component: ReferedPage },