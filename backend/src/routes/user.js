const express = require('express');
const { check } = require('express-validator');
const multer = require('multer');
const { access } = require('../../_helpers/authorize')
const User = require('../controllers/user');
const validate = require('../middlewares/validate');

const router = express.Router();

var upload = multer({ dest: "./upload" });

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./upload");
    },
    filename: function (req, file, cb) {
        var fileExtension = file.mimetype.split("/")[1];
        cb(null, "1" + Date.now() + "." + fileExtension);
    },
});

var upload = multer({ storage: storage });

// const upload = multer().single('profileImage');


/////////////////////////////////////////////////////////////////////////////////////////////////////////////

//                                ADMIN ROUTES

/////////////////////////////////////////////////////////////////////////////////////////////////////////////



//INDEX
router.get('/', User.index);

//STORE
router.post('/add', [
    check('email').isEmail().withMessage('Enter a valid email address'),
    check('username').not().isEmpty().withMessage('You username is required'),
    check('firstName').not().isEmpty().withMessage('You first name is required'),
    check('lastName').not().isEmpty().withMessage('You last name is required')
], validate, User.store);

router.get('/single-subadmin/:id', User.singleSubAdmin)

// Post CSV file
router.post('/csv/leads', upload.single('csvFile'), User.importDataFromCSV);

// Post CSV file
router.post('/export/leads', User.exportDataToFile);

// Get User's Analytics 
router.get('/analytics/:id', User.analytics)

// Get Managers (Admin, Sub Admin, Supervisor)
router.get('/managers', User.managers)

// Add client Type with existing users
router.put('/client-types', User.addClientTypes)

// Add Affiliate token
router.put('/update-affiliate-token/:id', User.updateAffiliateToken)

// Soft Delete Multiple Users
router.put('/delete-multiple-users', User.deleteMultipleUsers)

// Update multiple users
router.put('/update-multiple-users', User.updateMultipleUsers)

// Add affiliate leads      
router.post('/affiliate/leads', User.createAffiliateLeads)

// Get affiliate leads      
router.get('/affiliate/leads', User.getAffiliateLeads)

// Change Password
router.put('/change-password/:id', User.changePassword);

// subadmins list

router.get('/sub-admins-listing', User.subadminsListing)
router.get('/deleted-sub-admins', User.deletedSubadmins)
router.get('/deleted-users', User.deletedUsers)

// sales agents list
router.get('/sales-agents-listing', User.salesagentsListing)
router.get('/deleted-sales-agents', User.deletedSalesAgents)

// reten agents list
router.get('/reten-agents-listing', User.retenagentsListing)
router.get('/deleted-reten-agents', User.deletedRetenAgents)

// Supervisors list
router.get('/supervisors-listing', User.supervisorsListing)
router.get('/deleted-supervisors', User.deletedSupervisors)

//Sales-Teamlead
router.get('/sales-teamleads-listing', User.salesTeamleadsListing)
router.get('/deleted-sales-teamleads', User.deletedSalesTeamleads)

// Reten Teamlead
router.get('/retention-teamleads-listing', User.retenTeamleadsListing)
router.get('/deleted-retention-teamleads', User.deletedRetenTeamleads)

// List all agents
router.get('/agents/:roleId?', User.listAgents)
router.get('/agent-role', User.listAgentRoles)
router.get('/delete-agent/:id', User.deletedAgent)



// Forget Password Email
router.put('/forget-passsword-email', User.forgetPasswordEmail);
router.put('/recover/:id', User.recover);

router.put('/delete-user/:id', User.destroy);
router.put('/hard-delete-user/:id', User.hard_destroy);

// Forget Password
router.put('/forget-passsword', User.forgetPassword);

//SHOW
router.post('/users', User.usersAgainstRole);

router.get('/:id', User.show);
router.get('/user-details/:id', User.userDetails);

router.get('/referralsAgainstId/:id', User.referralsAgainstId)

// OPT authentication
router.post('/send-otp', User.sendOTP);
router.post('/verify-otp', User.verifyOTP);
router.post('/verify-tfa', User.verifyTFA);

//UPDATE
router.put('/:id', upload.single('image'), User.update);

//DELETE
// router.delete('/:id', User.destroy);


// Get Current Balance and Convert it into USDT

router.get('/convert-user-balance/:id', User.getUserConvertBalance);
router.get('/convert-all-users-balance/', User.getAllUsersConvertBalance);

// Add currency amount to user's account
router.post('/add-currency-amount-to-account', User.addCurrencyAmountToAccount);

// Remove currency amount from user's account
router.post('/remove-currency-amount-from-account', User.removeCurrencyAmountFromUserAccount);

// Resolve withdraw transaction (Accept or decline)
router.post('/resolve-withdraw-transaction/:id', User.resolveWithDrawTransaction);

// Resolve deposit transaction (Accept or decline)
router.post('/resolve-deposit-transaction/:id', User.resolveDepositTransaction);

// REVERT A Transaction
router.put('/revert-transaction/:id', User.revertTransaction);

// Change Features Start price
router.post('/change-leverage-start-price/', User.changeLeverageStartPrice);

router.post('/track-last-activity/:userId', User.userLastActivity);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

//                                USER ROUTES

/////////////////////////////////////////////////////////////////////////////////////////////////////////////




module.exports = router;