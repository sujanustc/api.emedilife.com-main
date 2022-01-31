const express = require('express');
const router = express.Router();

const checkAdminAuth = require('../middileware/check-admin-auth');
const { addSavedNotification,
    editSavedNotificaton,
    deleteSavedNotificationById,
    getAllNotificaitonByPagination,
    getSavedNotificationById,
    getAllNotificaiton } = require('../controller/savedNotificationController')
/**
 * shipping-charge
 * http://localhost:9999/api/admin/saved-notification
 */

// Admin
router.post('/add-saved-notification', addSavedNotification);
router.post('/edit-saved-notification', editSavedNotificaton)
router.delete('/delete-saved-notificaiton-by-id', deleteSavedNotificationById)
router.get('/get-all-notificaiton-by-paginatin', getAllNotificaitonByPagination)
router.get('/get-all-notificaiton', getAllNotificaiton)
router.get('/get-notification-by-id', getSavedNotificationById)


// Export All router..
module.exports = router;
