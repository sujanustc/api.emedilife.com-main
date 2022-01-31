const express = require('express')
const router = express.Router();

const {addFooterLinkHeader} = require("../controller/footerLinkHeaderController")

// http:localhost:9999/api/admin/footer-link-header
router.post('/add-footer-link-header', addFooterLinkHeader)

module.exports = router