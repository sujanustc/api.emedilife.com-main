const express = require('express');
const router = express.Router();
const { homePage1, homePage2, homePage3 } = require('../../../controller/appHomeController')

// http://localhost:9999/api/app/home
router.get('/', homePage1)
router.get('/featured-section', homePage2)
router.get('/recommended-product', homePage3)
module.exports = router