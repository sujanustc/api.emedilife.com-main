// Main Module Required..
const express = require('express');

// Created Require Files..
const controller = require('../controller/about-us');
const checkAdminAuth = require('../middileware/check-admin-auth');
const checkIpWhitelist = require('../middileware/check-ip-whitelist');

const router = express.Router();

/**
 * /about-us
 * http://localhost:9999/api/about-us
 */


router.post('/add-about-us', checkIpWhitelist, checkAdminAuth, controller.addAboutUs);
router.get('/get-all-about-us-pages', controller.getAboutUsPages);
router.get('/get-about-us-by-about-us-id/:aboutUsId', controller.getAboutUsByAboutUsId);
router.get('/get-single-about-us-by-slug/:slug', controller.getSingleAboutUsBySlug);
router.put('/edit-about-us-by-about-us', checkIpWhitelist, checkAdminAuth, controller.editAboutUsData);
router.delete('/delete-about-us-by-id/:aboutUsId', checkIpWhitelist, checkAdminAuth, controller.deleteAboutUsByAboutUsId);

// Export All router..
module.exports = router;