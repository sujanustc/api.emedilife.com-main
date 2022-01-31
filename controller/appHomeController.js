const Carousel = require('../models/carousel');
const Brand = require('../models/product-brand');
const ProductCategory = require('../models/product-category');
const Banner = require('../models/banner')
const FeaturedCategory = require('../models/featured-category')
const FeaturedProduct = require('../models/featured-product')
const Product = require('../models/product');
const { shuffle } = require('../utils/utils');

const homePage1 = async (req, res) => {
    try {
        const carosols = await Carousel.find()
        const shopByCategories = await ProductCategory.find({ isFeatured: "1" }).select('categoryName categorySlug image').limit(8).sort({ createdAt: -1 })
        const shopByBrands = await Brand.find({ isFeatured: "1" }).select('brandName brandSlug image').limit(15).sort({ createdAt: -1 })
        const banner = await Banner.findOne({ bannerType: "bigBanner" }).sort({ createdAt: -1 })
        return res.json({
            status: true,
            data: {
                slider: carosols,
                shopByCategories: shopByCategories,
                shopByBrands: shopByBrands,
                banner: banner
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, error: error.message })
    }
}
const homePage2 = async (req, res) => {
    try {
        const featuredCategories = await FeaturedCategory.find().populate({
            path: "products", populate: [{
                path: 'brand',
                model: 'ProductBrand',
                select: 'brandName'
            },
            {
                path: 'generic',
                model: 'Generic',
                select: 'name'
            },
            {
                path: "prices.unit",
                model: "UnitType"
            }]
        }).sort({ createdAt: -1 });
        var newFeaturedCategoies = []
        for (let index = 0; index < featuredCategories.length; index++) {
            newFeaturedCategoies[index] = featuredCategories[index];
            newFeaturedCategoies[index].products = shuffle(newFeaturedCategoies[index].products)
        }

        const featuredProducts = await FeaturedProduct.find().populate({
            path: "products", populate: [{
                path: 'brand',
                model: 'ProductBrand',
                select: 'brandName'
            },
            {
                path: 'generic',
                model: 'Generic',
                select: 'name'
            },
            {
                path: "prices.unit",
                model: "UnitType"
            }]
        }).sort({ createdAt: -1 });
        var newFeaturedProducts = []
        for (let index = 0; index < featuredProducts.length; index++) {
            newFeaturedProducts[index] = featuredProducts[index];
            newFeaturedProducts[index].products = shuffle(newFeaturedProducts[index].products)
        }
        return res.json({
            status: true,
            data: {
                featuredCategories: newFeaturedCategoies,
                featuredProducts: newFeaturedProducts
            }
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, error: error.message })
    }
}

const homePage3 = async (req, res) => {
    try {
        const products = await Product.aggregate([{ $sample: { size: 50 } }])
        await Product.populate(products, [{
            path: 'brand',
            model: 'ProductBrand',
            select: 'brandName'
        },
        {
            path: 'generic',
            model: 'Generic',
            select: 'name'
        },
        {
            path: "prices.unit",
            model: "UnitType"
        }]);
        return res.json({
            status: true,
            data: {
                products: products
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, error: error.message })
    }
}
module.exports = { homePage1, homePage2, homePage3 }