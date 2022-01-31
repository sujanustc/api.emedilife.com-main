const express = require("express");
const router = express.Router();
const checkAdminAuth = require("../middileware/check-admin-auth");
const { addNotification,
    adminDeleteNotificationById,
    adminEditNotificationById,
    adminGetAllNotification,
    adminGetNotificationById,
    userGetAllNotificationByUserId,
    userDeleteNotificationById,
    userDeleteAllNotification,
    userGetNotificationById } = require("../controller/notificationController")


/* Admin 
http://localhost:9999/api/admin/notification
*/

router.post("/add-notification",checkAdminAuth, addNotification);
router.delete("/admin-delete-notification-by-id",checkAdminAuth, adminDeleteNotificationById);
router.post("/edit-notification-by-id",checkAdminAuth, adminEditNotificationById)
router.get('/admin-get-all-notification',checkAdminAuth, adminGetAllNotification)
router.get('/admin-get-notificaiton-by-id',checkAdminAuth, adminGetNotificationById)



//User
// router.get("/user-get-all-notificaiton-by-user-id", userGetAllNotificationByUserId)
// router.delete("/user-delete-notification-by-id", userDeleteNotificationById)
// router.delete("/user-delete-all-notification", userDeleteAllNotification)
// router.get('/user-get-notification-by-id', userGetNotificationById)


module.exports = router;