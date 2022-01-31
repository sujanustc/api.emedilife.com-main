// Require Main Modules..
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// Require Post Schema from Model..
const Admin = require("../models/admin");
const Role = require("../models/role");
const ProductBrand = require("../models/product-brand");
// const ProductParentCategory = require('../models/product-parent-category');
const ProductCategory = require("../models/product-category");
const ProductSubCategory = require("../models/product-sub-category");
const ImageFolder = require("../models/image-folder");
const User = require("../models/user");
const ProductGeneric = require("../models/product-generic");
const Product = require("../models/product");
const ProductUnitTypes = require("../models/product-unit-type");
const Order = require("../models/order");
const enumObj = require("../helpers/enum-obj");
const utils = require("../helpers/utils");
const moment = require("moment-timezone");

/**
 * Admin Registration
 * Admin Login
 */

exports.insertDefaultDocuments = async (req, res, next) => {
  try {
    const data = req.body;

    const admin = data.admin;
    const brand = data.brand;
    const category = data.category;
    const subCategory = data.subCategory;
    const image_folder = data.imageFolder;

    const hashedPass = bcrypt.hashSync(admin.password, 8);
    admin.password = hashedPass;
    const newAdmin = new Admin(admin);
    await newAdmin.save();

    const newBrand = new ProductBrand(brand);
    await newBrand.save();

    const newCategory = new ProductCategory(category);
    const resultCategory = await newCategory.save();

    // subCategory.parentCategory = resultParentCategory._id;
    subCategory.category = resultCategory._id;
    const newSubCategory = new ProductSubCategory(subCategory);
    await newSubCategory.save();

    const imageFolder = new ImageFolder(image_folder);
    await imageFolder.save();

    res.status(200).json({
      message: "Data deleted Successfully!",
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

exports.adminSignUp = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error(
      "Input Validation Error! Please complete required information."
    );
    error.statusCode = 422;
    error.data = errors.array();
    next(error);
    return;
  }

  try {
    const bodyData = req.body;

    delete bodyData.confirmPassword;

    const password = bodyData.password;
    const hashedPass = bcrypt.hashSync(password, 8);

    // const user = new Admin({...bodyData, ...{password: hashedPass}});
    const user = new Admin({ ...bodyData, ...{ password: hashedPass } });

    const usernameExists = await Admin.findOne({
      username: bodyData.username,
    }).lean();

    if (usernameExists) {
      res.status(200).json({
        message: "A admin with this username already registered!",
        success: false,
      });
    } else {
      const emailExists = await Admin.findOne({ email: bodyData.email }).lean();
      if (emailExists) {
        res.status(200).json({
          message: "A admin with this phone number already registered!",
          success: false,
        });
      } else {
        const newUser = await user.save();
        res.status(200).json({
          success: true,
          message: "Admin Registration Success!",
          userId: newUser._id,
        });
      }
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

// Login Admin..
exports.adminLogin = async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  let loadedAdmin;
  let token;

  // console.log(req.body);
  try {
    const admin = await Admin.findOne({ username: username, deletedAt: null });

    if (!admin) {
      res.status(200).json({
        message: "A Admin with this username could not be found!",
        success: false,
      });
    } else if (admin.hasAccess === false) {
      res.status(200).json({
        message: "Permission Denied. Please contact higher authorize person.",
        success: false,
      });
    } else {
      loadedAdmin = admin;
      const isEqual = bcrypt.compareSync(password, admin.password);

      if (!isEqual) {
        res.status(200).json({
          message: "You entered a wrong password!",
          success: false,
        });
      } else {
        // For Json Token Generate..
        token = jwt.sign(
          {
            username: loadedAdmin.username,
            userId: loadedAdmin._id,
          },
          process.env.JWT_PRIVATE_KEY_ADMIN,
          {
            
          }
        );

        const data = await Admin.findOne({ _id: loadedAdmin._id }).select(
          "role"
        );

        // Final Response
        res.status(200).json({
          message: "Login Success",
          success: true,
          token: token,
          role: data.role,
          expiredIn: 86400,
        });
      }
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Something went wrong on database operation!";
    }
    console.log(err);
    next(err);
  }
};

exports.getLoginAdminInfo = async (req, res, next) => {
  try {
    // User Shop ID from check-user-auth token..
    const loginUserId = req.adminData.userId;
    const selectString = req.query.select;

    let user;

    if (selectString) {
      user = Admin.findById(loginUserId).select(selectString);
    } else {
      user = Admin.findById(loginUserId).select("-password");
    }
    const result = await user;

    res.status(200).json({
      data: result,
      message: "Successfully Get Admin info.",
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

exports.getLoginAdminRole = async (req, res, next) => {
  try {
    // User Shop ID from check-user-auth token..
    const loginUserId = req.adminData.userId;
    const data = await Admin.findOne({ _id: loginUserId }).select(
      "username role"
    );
    let mData;
    if (data) {
      mData = {
        _id: data._id,
        username: data.username,
        role: data.role,
      };
    } else {
      mData = null;
    }

    res.status(200).json({
      data: mData,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Something went wrong on database operation!";
    }
    next(err);
  }
};

exports.getAdminLists = async (req, res, next) => {
  try {
    const result = await Admin.find({deletedAt: null}).select("-password");

    res.status(200).json({
      data: result,
      message: "Successfully Get Admin info.",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Something went wrong on database operation!";
    }
    next(err);
  }
};

exports.getSingleAdminById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const query = { _id: id, deletedAt: null };
    const data = await Admin.findOne(query);

    res.status(200).json({
      data: data,
      message: "Data fetch Successfully!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Something went wrong on database operation!";
    }
    next(err);
  }
};

exports.editAdminOwnProfileInfo = async (req, res, next) => {
  try {
    const bodyData = req.body;
    const userId = req.adminData.userId;

    await Admin.updateOne({ _id: userId }, { $set: bodyData });
    res.status(200).json({
      message: "Profile info updated Successfully!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Something went wrong on database operation!";
    }
    next(err);
  }
};

exports.changeAdminOwnPassword = async (req, res, next) => {
  try {
    const bodyData = req.body;
    const userId = req.adminData.userId;
    const admin = await Admin.findOne({ _id: userId });

    const isEqual = bcrypt.compareSync(bodyData.oldPassword, admin.password);

    if (!isEqual) {
      const error = new Error("You entered a wrong password!");
      error.statusCode = 401;
      next(error);
    } else {
      const hashedPass = bcrypt.hashSync(bodyData.newPassword, 8);
      await Admin.updateOne(
        { _id: userId },
        { $set: { password: hashedPass } }
      );
      res.status(200).json({
        message: "Password changed Successfully!",
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Something went wrong on database operation!";
    }
    next(err);
  }
};

exports.editAdmin = async (req, res, next) => {
  try {
    const bodyData = req.body;
    const userId = req.params.id;
    let finalData;
    if (bodyData.newPassword) {
      const password = bodyData.newPassword;
      const hashedPass = bcrypt.hashSync(password, 8);
      finalData = { ...bodyData, ...{ password: hashedPass } };
    } else {
      finalData = req.body;
      delete finalData["password"];
    }

    await Admin.updateOne({ _id: userId }, { $set: finalData });
    res.status(200).json({
      message: "Admin info updated Successfully!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Something went wrong on database operation!";
    }
    next(err);
  }
};

exports.updateAdminImageField = async (req, res, next) => {
  try {
    const id = req.body.id;
    const query = req.body.query;

    await Admin.findOneAndUpdate(
      { _id: id },
      {
        $set: query,
      }
    );
    res.status(200).json({
      message: "Image Field Updated Successfully!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Something went wrong on database operation!";
    }
    next(err);
  }
};

exports.deleteAdminById = async (req, res, next) => {
  const itemId = req.params.id;

  try {
    const query = { _id: itemId };
    await Admin.updateOne(query, {deletedAt: moment()});

    res.status(200).json({
      message: "Data deleted Successfully!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Something went wrong on database operation!";
    }
    next(err);
  }
};

/**
 * ROLE
 */

exports.addAdminRole = async (req, res, next) => {
  try {
    const data = new Role(req.body);
    await data.save();

    res.status(200).json({
      message: "Data Added Successfully!",
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

exports.getRolesData = async (req, res, next) => {
  try {
    const result = await Role.find();

    res.status(200).json({
      data: result,
      message: "Successfully Get Data",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Something went wrong on database operation!";
    }
    next(err);
  }
};

exports.getSingleRoleById = async (req, res, next) => {
  try {
    const itemId = req.params.id;
    const query = { _id: itemId };
    const data = await Role.findOne(query);

    res.status(200).json({
      data: data,
      message: "Data fetched Successfully!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Something went wrong on database operation!";
    }
    next(err);
  }
};

exports.editAdminRole = async (req, res, next) => {
  try {
    const id = req.body._id;

    await Role.findOneAndUpdate(
      { _id: id },
      {
        $set: req.body,
      }
    );
    res.status(200).json({
      message: "Data edited Successfully!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Something went wrong on database operation!";
    }
    next(err);
  }
};

exports.deleteAdminRoleById = async (req, res, next) => {
  try {
    const itemId = req.params.id;
    const query = { _id: itemId };
    await Role.deleteOne(query);

    res.status(200).json({
      message: "Data deleted Successfully!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Something went wrong on database operation!";
    }
    next(err);
  }
};

exports.getDashboardData = async (req, res, next) => {
  try {
    const countAllGeneric = await ProductGeneric.countDocuments();

    //product counters
    const countAllProduct = await Product.countDocuments();
    const countAllFeaturedProduct = await Product.countDocuments({
      isFeatured: "1",
    });
    const countALLNonFeaturedProduct = await Product.countDocuments({
      isFeatured: { $ne: "1" },
    });
    const countAllProductInStock = await Product.countDocuments({
      stockVisibility: "1",
    });
    const countAllProductOutStock = await Product.countDocuments({
      stockVisibility: { $ne: "1" },
    });
    const countAllVisibleProduct = await Product.countDocuments({
      productVisibility: "1",
    });
    const countAllNotVisibleProduct = await Product.countDocuments({
      productVisibility: { $ne: "1" },
    });

    //brand counters
    const countAllBrands = await ProductBrand.countDocuments();
    const countALLFeatureBrand = await ProductBrand.countDocuments({
      isFeatured: "1",
    });
    const countALLNotFeatureBrand = await ProductBrand.countDocuments({
      isFeatured: { $ne: "1" },
    });

    //category counters
    const countAllProductCategory = await ProductCategory.countDocuments();
    const countAllFeaturedProductCategory =
      await ProductCategory.countDocuments({ isFeatured: "1" });
    const countAllNotFeaturedProductCategory =
      await ProductCategory.countDocuments({ isFeatured: { $ne: "1" } });

    const countAllProductSubCategory =
      await ProductSubCategory.countDocuments();

    const countAllProductUnitTypes = await ProductUnitTypes.countDocuments();

    //orders total counters
    const countAllOrders = await Order.countDocuments();
    const countPendingOrders = await Order.countDocuments({
      deliveryStatus: enumObj.Order.PENDING,
    });
    const countConfirmOrders = await Order.countDocuments({
      deliveryStatus: enumObj.Order.CONFIRM,
    });
    const countProcessingOrders = await Order.countDocuments({
      deliveryStatus: enumObj.Order.PROCESSING,
    });
    const countShippingOrders = await Order.countDocuments({
      deliveryStatus: enumObj.Order.SHIPPING,
    });
    const countDeliveredOrders = await Order.countDocuments({
      deliveryStatus: enumObj.Order.DELIVERED,
    });
    const countCancelOrders = await Order.countDocuments({
      deliveryStatus: enumObj.Order.CANCEL,
    });
    const countRefundOrders = await Order.countDocuments({
      deliveryStatus: enumObj.Order.REFUND,
    });

    //orders today counters
    var start = moment().startOf("day"); // set to 12:00 am today
    var end = moment().endOf("day"); // set to 23:59 pm today
    // var start = new Date()
    // start.setHours(0,0,0,0);

    // var end = new Date()
    // end.setHours(23,59,59,999);
    // console.log(start, end);

    // const nDate = new Date().toLocaleString('en-US', {
    //     timeZone: 'Asia/Dhaka'
    //   });
    //   console.log(nDate);
    //const countOrderToday = await Order.countDocuments({createdAt: {$gte: start, $lt: end}})
    // const countOrderThisMonth = await Order.countDocuments({createdAt: {"$lte": utils.convertToDateTime()}})
    // console.log(utils.getDateString());
    // console.log(utils.convertToDateTime());
    //moment().subtract(30, 'days').calendar()
    const countAllOrdersToday = await Order.countDocuments({
      createdAt: { $gte: start, $lt: end },
    });
    const countPendingOrdersToday = await Order.countDocuments({
      createdAt: { $gte: start, $lt: end },
      deliveryStatus: enumObj.Order.PENDING,
    });
    const countConfirmOrdersToday = await Order.countDocuments({
      createdAt: { $gte: start, $lt: end },
      deliveryStatus: enumObj.Order.CONFIRM,
    });
    const countProcessingOrdersToday = await Order.countDocuments({
      createdAt: { $gte: start, $lt: end },
      deliveryStatus: enumObj.Order.PROCESSING,
    });
    const countShippingOrdersToday = await Order.countDocuments({
      createdAt: { $gte: start, $lt: end },
      deliveryStatus: enumObj.Order.SHIPPING,
    });
    const countDeliveredOrdersToday = await Order.countDocuments({
      createdAt: { $gte: start, $lt: end },
      deliveryStatus: enumObj.Order.DELIVERED,
    });
    const countCancelOrdersToday = await Order.countDocuments({
      createdAt: { $gte: start, $lt: end },
      deliveryStatus: enumObj.Order.CANCEL,
    });
    const countRefundOrdersToday = await Order.countDocuments({
      createdAt: { $gte: start, $lt: end },
      deliveryStatus: enumObj.Order.REFUND,
    });

    //Recent Section
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(20);
    const recentTransactions = await Order.find({
      $or: [
        { deliveryStatus: enumObj.Order.DELIVERED },
        { paymentStatus: "paid" },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      status: true,
      statusCode: 200,
      message: "Successfully fatch data!",
      data: {
        counts: {
          generic: {
            allGeneric: countAllGeneric,
          },
          brand: {
            allBrands: countAllBrands,
            allFeatureBrands: countALLFeatureBrand,
            allNonFeaturedBrands: countALLNotFeatureBrand,
          },
          category: {
            allCategory: countAllProductCategory,
            allFeatureCategory: countAllFeaturedProductCategory,
            allNonFeatureCategory: countAllNotFeaturedProductCategory,
          },
          subCategory: {
            allSubCategory: countAllProductSubCategory,
          },
          unitTypes: {
            allUnitTypes: countAllProductUnitTypes,
          },
          product: {
            allProduct: countAllProduct,
            allFeaturedProduct: countAllFeaturedProduct,
            allNonFeaturedProduct: countALLNonFeaturedProduct,
            allProductInStock: countAllProductInStock,
            allProductOutStock: countAllProductOutStock,
            allVisibleProduct: countAllVisibleProduct,
            allNotVisibleProduct: countAllNotVisibleProduct,
          },
          orders: {
            allOrder: countAllOrders,
            allPendingOrder: countPendingOrders,
            allConfirmOrders: countConfirmOrders,
            allProcessingOrder: countProcessingOrders,
            allShippingOrder: countShippingOrders,
            allDeliveredOrder: countDeliveredOrders,
            allCancelOrder: countCancelOrders,
            allRefundOrder: countRefundOrders,
            today: {
              allOrderToday: countAllOrdersToday,
              allPendingOrderToday: countPendingOrdersToday,
              allConfirmOrdersToday: countConfirmOrdersToday,
              allProcessingOrderToday: countProcessingOrdersToday,
              allShippingOrderToday: countShippingOrdersToday,
              allDeliveredOrderToday: countDeliveredOrdersToday,
              allCancelOrderToday: countCancelOrdersToday,
              allRefundOrderToday: countRefundOrdersToday,
            },
          },
        },
        recents: {
          orders: recentOrders,
          transactions: recentTransactions,
        },
      },
    });
  } catch (error) {
    console.log(error);
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = "Something went wrong on database operation!";
    }
    next(error);
  }
};

/**
 COUNTER
 **/

// exports.countsCollectionsDocuments= async (req, res, next) => {
//
//     try {
//         const courseCount = await Course.countDocuments();
//         const serviceCount = await Service.countDocuments();
//         const contactUsCount = await ContactUs.countDocuments();
//         const countsAdmin = await Admin.countDocuments();
//         const countsCourseApplication= await CourseApplication.countDocuments();
//         const countsInternApplication = await InternApplication.countDocuments();
//
//         res.status(200).json({
//             data : {
//                 courses: courseCount,
//                 services: serviceCount,
//                 contacts: contactUsCount,
//                 admins: countsAdmin,
//                 courseApplication: countsCourseApplication,
//                 internApplication: countsInternApplication,
//             }
//         });
//     } catch (err) {
//         if (!err.statusCode) {
//             err.statusCode = 500;
//             err.message = 'Something went wrong on database operation!'
//         }
//         next(err);
//     }
//
// }
