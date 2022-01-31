const fs = require("fs");
const os = require("os");
const AboutUs = require("../models/about-us");
const Address = require("../models/address");
const Admin = require("../models/admin");
const Banner = require("../models/banner");
const Blog = require("../models/blog");
const CareerEsquire = require("../models/career-esquire");
const Carousel = require("../models/carousel");
const Cart = require("../models/cart");
const CategoryMenu = require("../models/category-menu");
const ContactUs = require("../models/contact-us");
const Coupon = require("../models/coupon");
const DealOnPlay = require("../models/deal-on-play");
const DealerInfo = require("../models/dealer-info");
const DealsOfTheDay = require("../models/deals-of-the-day");
const Discussion = require("../models/discussion");
const Faq = require("../models/faq");
const FeaturedCategory = require("../models/featured-category");
const FeaturedProduct = require("../models/featured-product");
const FlashSale = require("../models/flash-sale");
const FooterData = require("../models/footer-data");
const Gallery = require("../models/gallery");
const HomepageLists = require("../models/homepage-lists");
const ImageFolder = require("../models/image-folder");
const InstallationRepairType = require("../models/installation-repair-type");
const InstallationRepair = require("../models/installation-repair");
const Newsletter = require("../models/newsletter");

const OfferBanner = require("../models/offer-banner");
const OfferProduct = require("../models/offer-product");
const OrderPaymentInfo = require("../models/order-payment-info");
const OrderTemporary = require("../models/order-temporary");
const Order = require("../models/order");
const PageInfo = require("../models/page-info");

const ProductAttribute = require("../models/product-attribute");
const ProductAuthenticator = require("../models/product-authenticator");
const ProductBrand = require("../models/product-brand");
const ProductCategory = require("../models/product-category");
const ProductExtraData = require("../models/product-extra-data");
const ProductParentCategory = require("../models/product-parent-category");
const ProductRatingReview = require("../models/product-rating-review");
const ProductSubCategory = require("../models/product-sub-category");
const Tag = require("../models/product-tag");
const ProductVariation = require("../models/product-variation");
const Product = require("../models/product");
const PromoPage = require("../models/promo-page");
const PromotionalBanner = require("../models/promotional-banner");
const PromotionalOffer = require("../models/promotional-offer");
const Review = require("../models/review-control");
const Role = require("../models/role");
const ExtraData = require("../models/shippng-charge");
const ShopInfo = require("../models/shop-info");
const StoreInfo = require("../models/store-info");
const UniqueId = require("../models/unique-id");
const User = require("../models/user");
const Vendor = require("../models/vendor");
const Warranty = require("../models/warranty");
const Wishlist = require("../models/wishlist");
const UnitType = require("../models/product-unit-type");
const Generic = require("../models/product-generic");
const AppVersion = require("../models/appVersion")
const Area = require("../models/area")
const CronJob = require("../models/cronJob")
const DeliveryAddress = require("../models/deliveryAddress")
const District = require("../models/district")
const HeaderMenu = require("../models/headerMenu")
const MinimumAmount = require("../models/minimumAmount")
const Notification = require("../models/notification")
const PrescriptionOrder = require("../models/prescription-order")
const Prescription = require("../models/prescription")
const FooterLinkHeader = require("../models/footerLinkHeader")
const FooterLink = require("../models/footerLink")


const STATIC_DIR = `./database/backup/`;
const STATIC_DIR_PATH = `/database/backup/`;

exports.backupCollection = async (req, res, next) => {
    try {
        const collectionName = req.body.collectionName.trim();
        const hasCollection = getModelData(collectionName);

        if (hasCollection) {
            const model = hasCollection.model;
            const fileName = hasCollection.fileName;

            var data = await model.find();
            // console.log("before:", hasCollection);

            var newData = [];

            data.forEach(item => {
                if (fileName == "product.json") {
                    var prices = item.prices;
                    var newPrices = [];
                    prices.forEach(item1 => {
                        newPrices.push({
                            ...item1._doc,
                            _id: { "$oid": item1._id },
                            unit: { "$oid": item1.unit }
                        })
                    });
                    newData.push({
                        ...item._doc,
                        _id: { "$oid": item._id },
                        createdAt: { "$date": item.createdAt },
                        updatedAt: { "$date": item.updatedAt },
                        brand: item.brand ? { "$oid": item.brand } : null,
                        category: item.category ? { "$oid": item.category } : null,
                        subCategory: item.subCategory ? { "$oid": item.subCategory } : null,
                        generic: item.generic ? { "$oid": item.generic } : null,
                        prices: item.prices ? newPrices : null,
                    })
                }
                else if (fileName == "product-sub-category.json") {
                    newData.push({
                        ...item._doc,
                        _id: { "$oid": item._id },
                        createdAt: { "$date": item.createdAt },
                        updatedAt: { "$date": item.updatedAt },
                        category: item.category ? { "$oid": item.category } : null,
                    })
                }
                else {
                    newData.push({
                        ...item._doc,
                        _id: { "$oid": item._id },
                        createdAt: { "$date": item.createdAt },
                        updatedAt: { "$date": item.updatedAt }
                    })
                }


            });

            data = newData;
            // console.log("after newData :", data);


            if (!fs.existsSync(STATIC_DIR)) {
                fs.mkdir(STATIC_DIR, () => {
                    fs.writeFileSync(STATIC_DIR + fileName, JSON.stringify(data));
                    // fs.writeFileSync(STATIC_DIR + fileName, data);
                });

                res.status(200).json({
                    success: true,
                    message: `${collectionName} model backup successfully`,
                });
            } else {
                fs.writeFileSync(STATIC_DIR + fileName, JSON.stringify(data));
                // fs.writeFileSync(STATIC_DIR + fileName, data);

                res.status(200).json({
                    success: true,
                    message: `${collectionName} model backup successfully`,
                });
            }
        } else {
            res.status(200).json({
                success: false,
                message: `${collectionName} model has not exists`,
            });
        }
    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = "Something went wrong on database operation!";
        }
        next(err);
    }
};

exports.backupAll = async (req, res) => {
    const { Models } = require("../helpers/modelName")
    // console.log(Models.length);
    for (let index = 0; index < Models.length; index++) {
        var collectionName = Models[index].trim();
        console.log(collectionName);
        try {
            // const collectionName = req.body.collectionName.trim();
            const hasCollection = getModelData(collectionName);

            if (hasCollection && hasCollection.model != Product) {
                const model = hasCollection.model;
                const fileName = hasCollection.fileName;

                var data = await model.find();
                // console.log("before:", hasCollection);

                var newData = [];

                data.forEach(item => {
                    if (fileName == "product.json") {
                        var prices = item.prices;
                        var newPrices = [];
                        prices.forEach(item1 => {
                            newPrices.push({
                                ...item1._doc,
                                _id: { "$oid": item1._id },
                                unit: { "$oid": item1.unit }
                            })
                        });
                        newData.push({
                            ...item._doc,
                            _id: { "$oid": item._id },
                            createdAt: { "$date": item.createdAt },
                            updatedAt: { "$date": item.updatedAt },
                            brand: item.brand ? { "$oid": item.brand } : null,
                            category: item.category ? { "$oid": item.category } : null,
                            subCategory: item.subCategory ? { "$oid": item.subCategory } : null,
                            generic: item.generic ? { "$oid": item.generic } : null,
                            prices: item.prices ? newPrices : null,
                        })
                    }
                    else if (fileName == "product-sub-category.json") {
                        newData.push({
                            ...item._doc,
                            _id: { "$oid": item._id },
                            createdAt: { "$date": item.createdAt },
                            updatedAt: { "$date": item.updatedAt },
                            category: item.category ? { "$oid": item.category } : null,
                        })
                    }
                    else {
                        newData.push({
                            ...item._doc,
                            _id: { "$oid": item._id },
                            createdAt: { "$date": item.createdAt },
                            updatedAt: { "$date": item.updatedAt }
                        })
                    }


                });

                data = newData;
                // console.log("after newData :", data);
                if (!fs.existsSync(STATIC_DIR)) {
                    fs.mkdir(STATIC_DIR, () => {
                        fs.writeFileSync(STATIC_DIR + fileName, JSON.stringify(data));
                        // fs.writeFileSync(STATIC_DIR + fileName, data);
                    });
                    const message = `${collectionName} model backup successfully`
                    console.log(message);
                } else {
                    fs.writeFileSync(STATIC_DIR + fileName, JSON.stringify(data));
                    // fs.writeFileSync(STATIC_DIR + fileName, data);
                    const message = `${collectionName} model backup successfully`
                    console.log(message);
                }
            } else {
                const message = `${collectionName} model has not exists`
                console.log(message);
            }
        } catch (err) {
            console.log(err);
            if (!err.statusCode) {
                err.statusCode = 500;
                err.message = "Something went wrong on database operation!";
            }
            next(err);
        }
    }

    res.json({ status: true })
}

exports.restoreCollection = async (req, res, next) => {
    try {
        const collectionName = req.body.collectionName.trim();
        const force = req.body.force;
        const hasCollection = getModelData(collectionName);

        if (hasCollection) {
            // Model Data
            const model = hasCollection.model;
            const fileName = hasCollection.fileName;

            if (fs.existsSync(STATIC_DIR + fileName)) {
                const data = fs.readFileSync(STATIC_DIR + fileName);
                const docs = JSON.parse(data.toString());
                const backupLength = docs && docs.length ? docs.length : 0;
                const documentsLength = await model.countDocuments();

                if (!force) {
                    if (backupLength < documentsLength) {
                        res.status(200).json({
                            success: false,
                            message: `${collectionName} model length is ${documentsLength} but backup data length is ${backupLength}`,
                        });
                    } else {
                        await model.deleteMany({});
                        await model.insertMany(docs);

                        res.status(200).json({
                            success: true,
                            message: `${collectionName} model restore successfully`,
                        });
                    }
                } else {
                    await model.deleteMany({});
                    await model.insertMany(docs);

                    res.status(200).json({
                        success: true,
                        message: `${collectionName} model restore successfully`,
                    });
                }
            } else {
                res.status(200).json({
                    success: false,
                    message: "No Backup file found!",
                });
            }
        } else {
            res.status(200).json({
                success: false,
                data: `${collectionName} model has not exists`,
            });
        }
    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = "Something went wrong on database operation!";
        }
        next(err);
    }
};

exports.getCollectionList = async (req, res, next) => {
    try {
        const collections = getModelWithFileData();

        res.status(200).json({
            success: true,
            data: collections,
        });
    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = "Something went wrong on database operation!";
        }
        next(err);
    }
};

function getModelData(collectionName) {
    let model;
    let fileName;

    switch (collectionName) {
        case "Admin":
        case "admin":
            model = Admin;
            fileName = `admin.json`;
            break;
        case "AboutUs":
        case "about-us":
            model = AboutUs;
            fileName = `about-us.json`;
            break;
        case "Address":
        case "address":
            model = Address;
            fileName = `address.json`;
            break;
        case "AppVersion":
        case "app-version":
            model = AppVersion;
            fileName = `app-version.json`;
            break;
        case "Area":
        case "area":
            model = Area;
            fileName = `area.json`;
            break;
        case "Banner":
        case "banner":
            model = Banner;
            fileName = `banner.json`;
            break;
        case "Blog":
        case "blog":
            model = Blog;
            fileName = `blog.json`;
            break;
        case "CareerEsquire":
        case "career-esquire":
            model = CareerEsquire;
            fileName = `career-esquire.json`;
            break;
        case "Carousel":
        case "carousel":
            model = Carousel;
            fileName = `carousel.json`;
            break;
        case "Cart":
        case "cart":
            model = Cart;
            fileName = `cart.json`;
            break;
        case "CategoryMenu":
        case "category-menu":
            model = CategoryMenu;
            fileName = `category-menu.json`;
            break;
        case "ContactUs":
        case "contact-us":
            model = ContactUs;
            fileName = `contact-us.json`;
            break;
        case "Coupon":
        case "coupon":
            model = Coupon;
            fileName = `coupon.json`;
            break;
        case "CronJob":
        case "cron-job":
            model = CronJob;
            fileName = `cron-job.json`;
            break;
        case "DealOnPlay":
        case "deal-on-play":
            model = DealOnPlay;
            fileName = `deal-on-play.json`;
            break;
        case "DealerInfo":
        case "dealer-info":
            model = DealerInfo;
            fileName = `dealer-info.json`;
            break;
        case "DealsOfTheDay":
        case "deals-of-the-play":
            model = DealsOfTheDay;
            fileName = `deals-of-the-play.json`;
            break;
        case "DeliveryAddress":
        case "delivery-address":
            model = DeliveryAddress;
            fileName = `delivery-address.json`;
            break;
        case "Discussion":
        case "discussiony":
            model = Discussion;
            fileName = `discussion.json`;
            break;
        case "District":
        case "district":
            model = District;
            fileName = `district.json`;
            break;
        case "Faq":
        case "faq":
            model = Faq;
            fileName = `faq.json`;
            break;
        case "FeaturedCategory":
        case "featured-category":
            model = FeaturedCategory;
            fileName = `featured-category.json`;
            break;
        case "FeaturedProduct":
        case "featured-producty":
            model = FeaturedProduct;
            fileName = `featured-product.json`;
            break;
        case "FlashSale":
        case "flash-sale":
            model = FlashSale;
            fileName = `flash-sale.json`;
            break;
        case "FooterData":
        case "footer-data":
            model = FooterData;
            fileName = `footer-data.json`;
            break;
        case "FooterLinkHeader":
        case "footer-link-header":
            model = FooterLinkHeader;
            fileName = `footer-link-header.json`;
            break;
        case "FooterLink":
        case "footer-link":
            model = FooterLink;
            fileName = `footer-link.json`;
            break;
        case "Gallery":
        case "gallery":
            model = Gallery;
            fileName = `gallery.json`;
            break;
        case "HeaderMenu":
        case "header-menu":
            model = HeaderMenu;
            fileName = `header-menu.json`;
            break;
        case "HomepageLists":
        case "homepage-list":
            model = HomepageLists;
            fileName = `homepage-list.json`;
            break;
        case "ImageFolder":
        case "image-folder":
            model = ImageFolder;
            fileName = `image-folder.json`;
            break;
        case "InstallationRepairType":
        case "installation-repair-type":
            model = InstallationRepairType;
            fileName = `installation-repair-type.json`;
            break;
        case "InstallationRepair":
        case "installation-repair":
            model = InstallationRepair;
            fileName = `installation-repair.json`;
            break;
        case "MinimumAmount":
        case "minimum-amount":
            model = MinimumAmount;
            fileName = `minimum-amount.json`;
            break;
        case "Newsletter":
        case "newsletter":
            model = Newsletter;
            fileName = `newsletter.json`;
            break;
        case "Notification":
        case "notification":
            model = Notification;
            fileName = `notification.json`;
            break;
        case "OfferBanner":
        case "offer-banner":
            model = OfferBanner;
            fileName = `offer-banner.json`;
            break;
        case "OfferProduct":
        case "offer-product":
            model = OfferProduct;
            fileName = `offer-product.json`;
            break;
        case "OrderPaymentInfo":
        case "order-payment-info":
            model = OrderPaymentInfo;
            fileName = `order-payment-info.json`;
            break;
        case "OrderTemporary":
        case "order-temporary":
            model = OrderTemporary;
            fileName = `order-temporary.json`;
            break;
        case "Order":
        case "order":
            model = Order;
            fileName = `order.json`;
            break;
        case "PageInfo":
        case "page-info":
            model = PageInfo;
            fileName = `page-info.json`;
            break;
        case "PrescriptionOrder":
        case "prescription-order":
            model = PrescriptionOrder;
            fileName = `prescription-order.json`;
            break;
        case "Prescription":
        case "prescription":
            model = Prescription;
            fileName = `prescription.json`;
            break;
        case "ProductAttribute":
        case "product-attribute":
            model = ProductAttribute;
            fileName = `product-attribute.json`;
            break;
        case "ProductAuthenticator":
        case "product-authenticator":
            model = ProductAuthenticator;
            fileName = `product-authenticator.json`;
            break;
        case "ProductBrand":
        case "product-brand":
            model = ProductBrand;
            fileName = `product-brand.json`;
            break;
        case "ProductCategory":
        case "product-category":
            model = ProductCategory;
            fileName = `product-category.json`;
            break;
        case "ProductExtraData":
        case "product-extra-data":
            model = ProductExtraData;
            fileName = `product-extra-data.json`;
            break;
        case "ProductParentCategory":
        case "product-parent-category":
            model = ProductParentCategory;
            fileName = `product-parent-category.json`;
            break;
        case "ProductRatingReview":
        case "product-rating-review":
            model = ProductRatingReview;
            fileName = `product-rating-review.json`;
            break;
        case "ProductSubCategory":
        case "product-sub-category":
            model = ProductSubCategory;
            fileName = `product-sub-category.json`;
            break;
        case "Tag":
        case "product-tag":
            model = Tag;
            fileName = `product-tag.json`;
            break;
        case "ProductVariation":
        case "product-variation":
            model = ProductVariation;
            fileName = `product-variation.json`;
            break;
        case "Product":
        case "product":
            model = Product;
            fileName = `product.json`;
            break;
        case "PromoPage":
        case "promo-page":
            model = PromoPage;
            fileName = `promo-page.json`;
            break;
        case "PromotionalBanner":
        case "promotional-banner":
            model = PromotionalBanner;
            fileName = `promotional-banner.json`;
            break;
        case "PromotionalOffer":
        case "promotional-offer":
            model = PromotionalOffer;
            fileName = `promotional-offer.json`;
            break;

        case "Review":
        case "review":
            model = Review;
            fileName = `review-control.json`;
            break;
        case "Role":
        case "role":
            model = Role;
            fileName = `role.json`;
            break;
        case "ExtraData":
        case "shipping-charge":
            model = ExtraData;
            fileName = `shipping-charge.json`;
            break;
        case "ShopInfo":
        case "shop-info":
            model = ShopInfo;
            fileName = `shop-info.json`;
            break;
        case "StoreInfo":
        case "store-info":
            model = StoreInfo;
            fileName = `store-info.json`;
            break;
        case "UniqueId":
        case "unique-id":
            model = UniqueId;
            fileName = `unique-id.json`;
            break;
        case "User":
        case "user":
            model = User;
            fileName = `user.json`;
            break;
        case "Vendor":
        case "vendor":
            model = Vendor;
            fileName = `vendor.json`;
            break;
        case "Warranty":
        case "warranty":
            model = Warranty;
            fileName = `warranty.json`;
            break;
        case "Wishlist":
        case "wishlist":
            model = Wishlist;
            fileName = `wishlist.json`;
            break;
        case "UnitType":
        case "product-unit-type":
            model = UnitType;
            fileName = `product-unit-type.json`;
            break;
        case "Generic":
        case "product-generic":
            model = Generic;
            fileName = `product-generic.json`;
            break;
        default:
            console.log(`Sorry, we are out of ${collectionName}.`);
    }

    if (model && fileName) {
        return { model, fileName };
    } else {
        return null;
    }
}

function getModelWithFileData() {
    return [
        {
            name: "Admin",
            size: fileInfo(STATIC_DIR + "admin.json").size,
            lastModified: fileInfo(STATIC_DIR + "admin.json").mtime,
        },
        {
            name: "AboutUs",
            size: fileInfo(STATIC_DIR + "about-us.json").size,
            lastModified: fileInfo(STATIC_DIR + "about-us.json").mtime,
        },
        {
            name: "Address",
            size: fileInfo(STATIC_DIR + "address.json").size,
            lastModified: fileInfo(STATIC_DIR + "address.json").mtime,
        },
        {
            name: "Banner",
            size: fileInfo(STATIC_DIR + "banner.json").size,
            lastModified: fileInfo(STATIC_DIR + "banner.json").mtime,
        },
        {
            name: "Blog",
            size: fileInfo(STATIC_DIR + "blog.json").size,
            lastModified: fileInfo(STATIC_DIR + "blog.json").mtime,
        },
        {
            name: "CareerEsquire",
            size: fileInfo(STATIC_DIR + "career-esquire.json").size,
            lastModified: fileInfo(STATIC_DIR + "career-esquire.json").mtime,
        },
        {
            name: "Carousel",
            size: fileInfo(STATIC_DIR + "carousel.json").size,
            lastModified: fileInfo(STATIC_DIR + "carousel.json").mtime,
        },
        {
            name: "Cart",
            size: fileInfo(STATIC_DIR + "cart.json").size,
            lastModified: fileInfo(STATIC_DIR + "cart.json").mtime,
        },
        {
            name: "CategoryMenu",
            size: fileInfo(STATIC_DIR + "category-menu.json").size,
            lastModified: fileInfo(STATIC_DIR + "category-menu.json").mtime,
        },
        {
            name: "ContactUs",
            size: fileInfo(STATIC_DIR + "contact-us.json").size,
            lastModified: fileInfo(STATIC_DIR + "contact-us.json").mtime,
        },
        {
            name: "Coupon",
            size: fileInfo(STATIC_DIR + "coupon.json").size,
            lastModified: fileInfo(STATIC_DIR + "coupon.json").mtime,
        },

        {
            name: "DealOnPlay",
            size: fileInfo(STATIC_DIR + "deal-on-play.json").size,
            lastModified: fileInfo(STATIC_DIR + "deal-on-play.json").mtime,
        },
        {
            name: "DealerInfo",
            size: fileInfo(STATIC_DIR + "dealer-info.json").size,
            lastModified: fileInfo(STATIC_DIR + "dealer-info.json").mtime,
        },
        {
            name: "DealsOfTheDay",
            size: fileInfo(STATIC_DIR + "deals-of-the-play.json").size,
            lastModified: fileInfo(STATIC_DIR + "deals-of-the-play.json").mtime,
        },
        {
            name: "Discussion",
            size: fileInfo(STATIC_DIR + "discussion.json").size,
            lastModified: fileInfo(STATIC_DIR + "discussion.json").mtime,
        },
        {
            name: "Faq",
            size: fileInfo(STATIC_DIR + "faq.json").size,
            lastModified: fileInfo(STATIC_DIR + "faq.json").mtime,
        },
        {
            name: "FeaturedCategory",
            size: fileInfo(STATIC_DIR + "featured-category.json").size,
            lastModified: fileInfo(STATIC_DIR + "featured-category.json").mtime,
        },
        {
            name: "FeaturedProduct",
            size: fileInfo(STATIC_DIR + "featured-product.json").size,
            lastModified: fileInfo(STATIC_DIR + "featured-product.json").mtime,
        },
        {
            name: "FlashSale",
            size: fileInfo(STATIC_DIR + "flash-sale.json").size,
            lastModified: fileInfo(STATIC_DIR + "flash-sale.json").mtime,
        },
        {
            name: "FooterData",
            size: fileInfo(STATIC_DIR + "footer-data.json").size,
            lastModified: fileInfo(STATIC_DIR + "footer-data.json").mtime,
        },
        {
            name: "FooterLinkHeader",
            size: fileInfo(STATIC_DIR + "footer-link-header.json").size,
            lastModified: fileInfo(STATIC_DIR + "footer-link-header.json").mtime,
        },
        {
            name: "FooterLink",
            size: fileInfo(STATIC_DIR + "footer-link.json").size,
            lastModified: fileInfo(STATIC_DIR + "footer-link.json").mtime,
        },
        {
            name: "Gallery",
            size: fileInfo(STATIC_DIR + "gallery.json").size,
            lastModified: fileInfo(STATIC_DIR + "gallery.json").mtime,
        },
        {
            name: "HomepageLists",
            size: fileInfo(STATIC_DIR + "homepage-list.json").size,
            lastModified: fileInfo(STATIC_DIR + "homepage-list.json").mtime,
        },
        {
            name: "ImageFolder",
            size: fileInfo(STATIC_DIR + "image-folder.json").size,
            lastModified: fileInfo(STATIC_DIR + "image-folder.json").mtime,
        },
        {
            name: "InstallationRepairType",
            size: fileInfo(STATIC_DIR + "installation-repair-type.json").size,
            lastModified: fileInfo(STATIC_DIR + "installation-repair-type.json").mtime,
        },
        {
            name: "InstallationRepair",
            size: fileInfo(STATIC_DIR + "installation-repair.json").size,
            lastModified: fileInfo(STATIC_DIR + "installation-repair.json").mtime,
        },
        {
            name: "Newsletter",
            size: fileInfo(STATIC_DIR + "newsletter.json").size,
            lastModified: fileInfo(STATIC_DIR + "newsletter.json").mtime,
        },
        {
            name: "OfferBanner",
            size: fileInfo(STATIC_DIR + "offer-banner.json").size,
            lastModified: fileInfo(STATIC_DIR + "offer-banner.json").mtime,
        },
        {
            name: "OfferProduct",
            size: fileInfo(STATIC_DIR + "offer-product.json").size,
            lastModified: fileInfo(STATIC_DIR + "offer-product.json").mtime,
        },
        {
            name: "OrderPaymentInfo",
            size: fileInfo(STATIC_DIR + "order-payment-info.json").size,
            lastModified: fileInfo(STATIC_DIR + "order-payment-info.json").mtime,
        },
        {
            name: "OrderTemporary",
            size: fileInfo(STATIC_DIR + "order-temporary.json").size,
            lastModified: fileInfo(STATIC_DIR + "order-temporary.json").mtime,
        },
        {
            name: "Order",
            size: fileInfo(STATIC_DIR + "order.json").size,
            lastModified: fileInfo(STATIC_DIR + "order.json").mtime,
        },
        {
            name: "PageInfo",
            size: fileInfo(STATIC_DIR + "page-info.json").size,
            lastModified: fileInfo(STATIC_DIR + "page-info.json").mtime,
        },

        {
            name: "ProductAttribute",
            size: fileInfo(STATIC_DIR + "product-attribute.json").size,
            lastModified: fileInfo(STATIC_DIR + "product-attribute.json").mtime,
        },
        {
            name: "ProductAuthenticator",
            size: fileInfo(STATIC_DIR + "product-authenticator.json").size,
            lastModified: fileInfo(STATIC_DIR + "product-authenticator.json").mtime,
        },
        {
            name: "ProductBrand",
            size: fileInfo(STATIC_DIR + "product-brand.json").size,
            lastModified: fileInfo(STATIC_DIR + "product-brand.json").mtime,
        },
        {
            name: "ProductCategory",
            size: fileInfo(STATIC_DIR + "product-category.json").size,
            lastModified: fileInfo(STATIC_DIR + "product-category.json").mtime,
        },
        {
            name: "ProductExtraData",
            size: fileInfo(STATIC_DIR + "product-extra-data.json").size,
            lastModified: fileInfo(STATIC_DIR + "product-extra-data.json").mtime,
        },
        {
            name: "ProductParentCategory",
            size: fileInfo(STATIC_DIR + "product-parent-category.json").size,
            lastModified: fileInfo(STATIC_DIR + "product-parent-category.json").mtime,
        },
        {
            name: "ProductRatingReview",
            size: fileInfo(STATIC_DIR + "product-rating-review.json").size,
            lastModified: fileInfo(STATIC_DIR + "product-rating-review.json").mtime,
        },
        {
            name: "ProductSubCategory",
            size: fileInfo(STATIC_DIR + "product-sub-category.json").size,
            lastModified: fileInfo(STATIC_DIR + "product-sub-category.json").mtime,
        },
        {
            name: "Tag",
            size: fileInfo(STATIC_DIR + "product-tag.json").size,
            lastModified: fileInfo(STATIC_DIR + "product-tag.json").mtime,
        },
        {
            name: "ProductVariation",
            size: fileInfo(STATIC_DIR + "product-variation.json").size,
            lastModified: fileInfo(STATIC_DIR + "product-variation.json").mtime,
        },
        {
            name: "Product",
            size: fileInfo(STATIC_DIR + "product.json").size,
            lastModified: fileInfo(STATIC_DIR + "product.json").mtime,
        },
        {
            name: "PromoPage",
            size: fileInfo(STATIC_DIR + "promo-page.json").size,
            lastModified: fileInfo(STATIC_DIR + "promo-page.json").mtime,
        },
        {
            name: "PromotionalBanner",
            size: fileInfo(STATIC_DIR + "promotional-banner.json").size,
            lastModified: fileInfo(STATIC_DIR + "promotional-banner.json").mtime,
        },
        {
            name: "PromotionalOffer",
            size: fileInfo(STATIC_DIR + "promotional-offer.json").size,
            lastModified: fileInfo(STATIC_DIR + "promotional-offer.json").mtime,
        },
        {
            name: "ReviewControl",
            size: fileInfo(STATIC_DIR + "review-control.json").size,
            lastModified: fileInfo(STATIC_DIR + "review-control.json").mtime,
        },
        {
            name: "Role",
            size: fileInfo(STATIC_DIR + "role.json").size,
            lastModified: fileInfo(STATIC_DIR + "role.json").mtime,
        },
        {
            name: "ExtraData",
            size: fileInfo(STATIC_DIR + "shipping-charge.json").size,
            lastModified: fileInfo(STATIC_DIR + "shipping-charge.json").mtime,
        },
        {
            name: "ShopInfo",
            size: fileInfo(STATIC_DIR + "shop-info.json").size,
            lastModified: fileInfo(STATIC_DIR + "shop-info.json").mtime,
        },
        {
            name: "StoreInfo",
            size: fileInfo(STATIC_DIR + "store-info.json").size,
            lastModified: fileInfo(STATIC_DIR + "store-info.json").mtime,
        },
        {
            name: "UniqueId",
            size: fileInfo(STATIC_DIR + "unique-id.json").size,
            lastModified: fileInfo(STATIC_DIR + "unique-id.json").mtime,
        },
        {
            name: "User",
            size: fileInfo(STATIC_DIR + "user.json").size,
            lastModified: fileInfo(STATIC_DIR + "user.json").mtime,
        },
        {
            name: "Vendor",
            size: fileInfo(STATIC_DIR + "vendor.json").size,
            lastModified: fileInfo(STATIC_DIR + "vendor.json").mtime,
        },
        {
            name: "Warranty",
            size: fileInfo(STATIC_DIR + "warranty.json").size,
            lastModified: fileInfo(STATIC_DIR + "warranty.json").mtime,
        },
        {
            name: "Wishlist",
            size: fileInfo(STATIC_DIR + "wishlist.json").size,
            lastModified: fileInfo(STATIC_DIR + "wishlist.json").mtime,
        },
        {
            name: "UnitType",
            size: fileInfo(STATIC_DIR + "product-unit-type.json").size,
            lastModified: fileInfo(STATIC_DIR + "product-unit-type.json").mtime,
        },
        {
            name: "Generic",
            size: fileInfo(STATIC_DIR + "product-generic.json").size,
            lastModified: fileInfo(STATIC_DIR + "product-generic.json").mtime,
        },
    ];
}

function fileInfo(path) {
    if (fs.existsSync(path)) {
        const { size, mtime, ctime } = fs.statSync(path);
        return { mtime, size, ctime };
    } else {
        return { mtime: null, size: null, ctime: null };
    }
}

function downloadUrl(req, path, fileName) {
    if (fs.existsSync(path)) {
        const baseurl = req.protocol + `${process.env.PRODUCTION_BUILD === "true" ? "s://" : "://"}` + req.get("host");
        return baseurl + STATIC_DIR_PATH + fileName;
    } else {
        return null;
    }
}
