const express = require('express');
const { check } = require('express-validator');

const Auth = require('../controllers/auth');
const Password = require('../controllers/password');
const validate = require('../middlewares/validate');
const authenticate = require('../middlewares/authenticate');
const router = express.Router();



router.get('/', (req, res) => {
    res.status(200).json({ message: "Base route for auth called." });
});

//EMAIL Verification
router.get('/verify/:token', Auth.verify);
router.post('/resend', Auth.resendToken);

// Affiliate Monitoring
router.get('/aff-user-monitor/:otl', Auth.affUserMonitor);

router.post('/register', [
    check('email').isEmail().withMessage('Enter a valid email address'),
    check('password').not().isEmpty().isLength({ min: 6 }).withMessage('Must be at least 6 chars long'),
    check('firstName').not().isEmpty().withMessage('You first name is required'),
    check('lastName').not().isEmpty().withMessage('You last name is required')
], validate, Auth.register);


router.post("/login", [
    check('email').isEmail().withMessage('Enter a valid email address'),
    check('password').not().isEmpty(),
], validate, Auth.login);

router.post("/user-login-byadmin", [
    check('email').isEmail().withMessage('Enter a valid email address'),
], validate, Auth.userLogiByAdmin);

router.post('/update-logout-activity/:userId', Auth.userLogoutActivity);


/////////////////////////////////////////////////////////////////////////////////////////////////////////////

//                                ADMIN ROUTES

/////////////////////////////////////////////////////////////////////////////////////////////////////////////


router.post('/register-subadmin', [
    check('email').isEmail().withMessage('Enter a valid email address'),
    check('password').not().isEmpty().isLength({ min: 6 }).withMessage('Must be at least 6 chars long'),
    check('firstName').not().isEmpty().withMessage('You first name is required'),
    check('lastName').not().isEmpty().withMessage('You last name is required')
], validate, Auth.registerSubadmin);


router.post("/admin-login", [
    check('email').isEmail().withMessage('Enter a valid email address'),
    check('password').not().isEmpty(),
], validate, Auth.adminLogin);
router.post("/resetPassword", [
    check('email').isEmail().withMessage('Enter a valid email address'),
    check('password').not().isEmpty(),
    // check('newPassword').not().isEmpty()
], validate, Auth.resetPassword);



//Password RESET
router.post('/recover', [
    check('email').isEmail().withMessage('Enter a valid email address'),
], validate, Password.recover);

router.get('/reset/:token', Password.reset);

router.post('/reset/:token', [
    check('password').not().isEmpty().isLength({ min: 6 }).withMessage('Must be at least 6 chars long'),
    check('confirmPassword', 'Passwords do not match').custom((value, { req }) => (value == req.body.password)),
], validate, Password.resetPassword);


module.exports = router;