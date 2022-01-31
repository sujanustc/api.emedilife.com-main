// Main Module Required..
const express = require('express');

// Created Require Files..
const controller = require('../controller/faq');
const checkAdminAuth = require('../middileware/check-admin-auth');
const checkIpWhitelist = require('../middileware/check-ip-whitelist');

const router = express.Router();

/**
 * /faq
 * http://localhost:9999/api/faq
 */


router.post('/add-faq',checkIpWhitelist,checkAdminAuth, controller.addFaq);
router.get('/get-all-faq', controller.getAllFaq);
router.get('/get-faq-by-faq-id/:faqId', controller.getFaqByFaqId);
router.get('/get-single-faq-by-slug/:slug', controller.getSingleFaqBySlug);
router.put('/edit-faq-by-faq',checkIpWhitelist,checkAdminAuth, controller.editFaqData);
router.delete('/delete-faq-by-id/:faqId',checkIpWhitelist,checkAdminAuth, controller.deleteFaqByFaqId);

// Export All router..
module.exports = router;