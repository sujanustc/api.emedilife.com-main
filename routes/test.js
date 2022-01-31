const express = require("express");
const router = express.Router();
// http://localhost:9999/test

const { sendMail } = require("../utils/smtp")
const Product = require("../models/product");
const { getOffset } = require("../utils/utils");
const { seoMaker } = require("../utils/seoMaker");
const User = require("../models/user");
router.post("/seo-update", async (req, res, next) => {
    try {
        var pLimit = parseInt(req.body.pageSize);
        var page = req.body.page;
        let { offset, limit } = getOffset(page, pLimit);
        var products = await Product.find().skip(offset).limit(limit);
        const count = await Product.countDocuments();

        for (let index = 0; index < products.length; index++) {

            console.log("Starting Serial No: ", offset + index + 1, "      _id", products[index]._id);
            var product = products[index];

            var seoData = await seoMaker(product.productName, product.description)

            // var seoTitle, seoDescription, seoTags = [];

            // //SEO Description Part
            // var description;
            // if (product.description) {
            //     description = product.description.length >= 200 ?
            //         product.description.substring(0, 200).replace(/<\/?[^>]+(>|$)/g, "")
            //         : product.description.replace(/<\/?[^>]+(>|$)/g, "")
            //     if (description.length > 150)
            //         seoDescription = description.substring(0, 150)
            //     else
            //         seoDescription = description
            // } else { seoDescription = product.productName }


            // //SEO Title Part
            // seoTitle = product.productName + " - Emedilife";
            // // seoTitle = product.seoTitle;

            // //SEO Tags Part
            // var string = product.productName;
            // string = string.replace(/[^a-zA-Z0-9 ]/g, " ");
            // string = string.replace(/  /g, " ")
            // var items = string.split(' ');
            // items = (items.filter(item => {
            //     if (item) return item
            // }));
            // for (let i = 0; i < items.length; i++) {
            //     for (let j = 1; j <= items.length; j++) {
            //         const slice = items.slice(i, j);
            //         if (slice.length)
            //             seoTags.push(slice.join(' '));
            //     }
            // }
            // var count2 = 1;
            // seoTags = ((seoTags.filter(item => {
            //     if ((parseInt(item) != item) && (item.match(/(\w+)/g).length <= 4) && (count2 <= 5) && item.length > 1) {
            //         count2++
            //         return item
            //     }
            // })).sort(function (a, b) {
            //     return a.length - b.length;
            // }));

            //Product Update Section
            await Product.updateOne({ _id: product._id }, {
                seoTitle: seoData.seoTitle,
                seoDescription: seoData.seoDescription,
                seoTags: seoData.seoTags
            })
            console.log("Completed:", offset + index + 1, "     _id:", product._id);
        }
        res.json({
            status: true,
            nowUpdated: limit,
            startingFrom: offset + 1,
            endindAt: offset + limit,
            totalCompleted: offset + limit,
            totalRemaining: count - (offset + limit),
            pageNo: page,
            pageSize: pLimit,
            message: "Do Not change Page Size, and maintain page sequence"
        });
    } catch (error) {
        console.log(error);
        res.json({ error: error })
    }

});

router.post("/delete-all-old-customer", async (req, res) => {
    try {
        const updated = await User.updateOne({ phoneNo: "8801840536343" }, { phoneNo: "01840536343", username: "01840536343" })
        console.log(updated);
        const oldUser = await User.deleteMany({ phoneNo: /^88/ })
        return res.json({ oldUser })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, error: error.message })
    }
})

const FeaturedProduct = require("../models/featured-product")
const FeaturedCategory = require("../models/featured-category")
const { shuffle, convertToSlug } = require("../utils/utils");
const ProductCategory = require("../models/product-category")
router.post("/make-featured-items-slug", async (req, res) => {
    try {
        const featuredProduct = await FeaturedProduct.find({ slug: null })
        featuredProduct.forEach(async element => {
            var slug = convertToSlug(element.name)
            await FeaturedProduct.updateOne({ _id: element._id }, { slug: slug })
        });
        return res.json({ status: true, message: "Successful" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, error: error.message })
    }
})


const app = express();
const useragent = require('express-useragent');
app.use(useragent.express());
router.get("/useragent", async (req, res) => {
    console.log(req.headers["user-agent"]);

    var source = req.headers['user-agent'],
  ua = useragent.parse(source);
    return res.json({
        browser: ua.browser,
        os: ua.os,
        // version: req.useragent.version,
        // os: req.useragent.os,
        // platform: req.useragent.platform
        data: ua
    })
})
module.exports = router;
