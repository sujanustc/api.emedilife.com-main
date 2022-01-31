// Main Module Required..
const express = require('express');

// Created Require Files..
const controller = require('../controller/user');
const inputValidator = require('../validation/user');
const checkAuth = require('../middileware/check-user-auth');
const checkAdminAuth = require('../middileware/check-admin-auth');

const router = express.Router();

/**
 * /api/user
 * http://localhost:9999/api/admin/user
 * http://localhost:9999/api/web/user
 */


router.post('/registration', controller.userRegistrationDefault);
router.put('/login', controller.userLoginDefault);
router.post('/firebase-login', controller.userFirebaseAuth);
router.get('/logged-in-user-data', checkAuth, controller.getLoginUserInfo);
router.put('/edit-logged-in-user-data', checkAuth, controller.editLoginUserInfo);
router.post('/get-all-user-lists', checkAdminAuth, controller.getUserLists);
router.get('/check-user-by-phone/:phoneNo', controller.checkUserByPhone);
router.get('/get-user-by-user-id/:userId', checkAdminAuth, controller.getUserByUserId);

// Password
router.post('/edit-password',checkAuth, controller.editPassword);
router.post('/update-password', checkAuth, controller.updatePassword);

// ADDRESS
router.post('/add-address',checkAuth, checkAuth, controller.addAddress);
router.put('/edit-address', checkAuth, controller.editUserAddress);
router.get('/get-addresses', checkAuth, controller.getAddresses);
router.delete('/delete-address-by-id/:id', checkAuth, controller.deleteUserAddress);

// ADMIN
router.put('/edit-user-access/:id',checkAdminAuth, controller.editUserAccess);

// SEARCH
router.post('/get-users-by-search', controller.getUsersBySearch);


//App
// http://localhost:9999/api/app/user
router.post('/send-login-otp', controller.sendLoginOtp)
router.post('/check-login-otp', controller.checkLoginOtp)
router.get('/get-user-info', checkAuth, controller.getUserInfo)


// Export All router..
module.exports = router;
