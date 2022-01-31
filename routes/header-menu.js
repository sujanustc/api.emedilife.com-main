const express = require("express");
const router = express.Router();
const checkAdminAuth = require("../middileware/check-admin-auth");
const {
    addHeaderMenu,
    editHeaderMenuById,
    getAllHeaderMenus,
    getAllHomeHeaderMenus,
    getHeaderMenuById,
    deleteMenuById,
} = require("../controller/headerMenuController");
// http://localhost:9999/api/admin/header-menu
//admin
router.post("/add-item", checkAdminAuth, addHeaderMenu);
router.post("/edit-by-id", checkAdminAuth, editHeaderMenuById);
router.get("/get-all-header-menu",checkAdminAuth, getAllHeaderMenus);
router.get("/get-header-menu-by-id", checkAdminAuth, getHeaderMenuById);
router.post("/delete-menu-by-id", checkAdminAuth, deleteMenuById);

//user
// http://localhost:9999/api/web/header-menu
router.get("/get-header-menus", getAllHomeHeaderMenus);
module.exports = router;
