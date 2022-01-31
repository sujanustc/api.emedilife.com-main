const express = require("express");
const router = express.Router();

const { setGlobalDiscount,
    editGlobalDiscount,
    checkGlobalDiscountByUserId } = require("../controller/globalDiscountController")


// http://localhost:9999/api/admin/global-discount
router.post('/set-global-discount', setGlobalDiscount)
router.post('/edit-global-discount', editGlobalDiscount)

// http://localhost:9999/api/web/global-discount
router.get('/check-global-discount-by-userid', checkGlobalDiscountByUserId)

module.exports = router