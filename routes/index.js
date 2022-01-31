const express = require("express");
const router = express.Router();

router.use("/api", require("./api"));
router.use("/test", require("./test"));

router.get("/", (req, res, next) => {
    res.json({ message: "Testing Api Emedilife Home" });
});

module.exports = router;
