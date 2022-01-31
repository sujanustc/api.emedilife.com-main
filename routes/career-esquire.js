// Main Module Required..
const express = require('express');

// Created Require Files..
const controller = require('../controller/career-esquire');
const checkAdminAuth = require('../middileware/check-admin-auth');
const checkIpWhitelist = require('../middileware/check-ip-whitelist');

const router = express.Router();

/**
 * /career-esquire
 * http://localhost:9999/api/career-esquire
 */


router.post('/add-career-esquire',checkIpWhitelist,checkAdminAuth, controller.addCareerEsquire);
router.get('/get-all-career-esquire', controller.getAllCareerEsquire);
router.get('/get-career-esquire-by-career-esquire-id/:careerEsquireId', controller.getCareerEsquireById);
router.get('/get-single-career-esquire-by-slug/:slug', controller.getCareerEsquireBySlug);
router.put('/edit-career-esquire-by-career-esquire',checkIpWhitelist,checkAdminAuth, controller.editCareerEsquireData);
router.delete('/delete-career-esquire-by-id/:careerEsquireId',checkIpWhitelist,checkAdminAuth, controller.deleteCareerEsquireById);

// Export All router..
module.exports = router;