
const express = require("express");
const app = express();
const crossUnblocker = require("../middileware/cros-unblocker");
const path = require("path");
require("dotenv").config();
// process.env.TZ="Africa/Accra"

// Cross Unblocked File..
const cors = require("cors");
const errorHandler = require("../middileware/error-handler");
const middlewareRoot = require("../middileware/middlewareRoot");

// app.use(crossUnblocker.allowCross)
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
const port = process.env.PORT || 9999;


app.use(middlewareRoot);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/", require("../routes"))

app.use((req, res) => {
    res.status(404).json({status: false, error: "No Routes Found!"})
})

app.use(errorHandler.route);
app.use(errorHandler.next);





app.listen(port, () => console.log(`Server is running at http://localhost:${port}`));