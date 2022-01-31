const { validationResult } = require("express-validator");

// Require Post Schema from Model..
const Banner = require("../models/banner");
const { errorResponse } = require("../utils/utils");

/**
 * Add Gallery
 * Get Gallery List
 */

exports.addNewBanner = async (req, res, next) => {
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
    const data = req.body;
    const dataSchema = new Banner(data);
    await dataSchema.save();

    res.status(200).json({
      message: "Banner Added Successfully!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Something went wrong on database operation!";
    }
    next(err);
  }
};

exports.getAllBanner = async (req, res, next) => {
  try {
    let pageSize = req.query.pageSize;
    let currentPage = req.query.page;
    let select = req.query.select;
    // let bannerType = req.query.bannerType;
    // console.log(req.query);

    let queryData;
    queryData = Banner.find()
      .sort({ createdAt: -1 })
      .select(select ? select : "");

    if (pageSize && currentPage) {
      queryData
        .skip(Number(pageSize) * (Number(currentPage) - 1))
        .limit(Number(pageSize));
    }

    const data = await queryData;
    const dataCount = await Banner.countDocuments();
    // console.log(data);
    res.status(200).json({
      data: data,
      count: dataCount,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Something went wrong on database operation!";
    }
    next(err);
  }
};

exports.getBannerByType = async (req, res, next) => {
  try {
    
    let bannerType = req.query.bannerType;
    if(bannerType == "home"){
      const bigBanner = await Banner.findOne({ bannerType: "bigBanner" }).sort({ createdAt: -1 })
      const footerBanner = await Banner.findOne({ bannerType: "footerBanner" }).sort({ createdAt: -1 })
      
      return res.json({
        status: true,
        error: null,
        bigBanner: bigBanner,
        footerBanner: footerBanner
      })
    }
    else{
      const banner = await Banner.findOne({ bannerType: bannerType  }).sort({ createdAt: -1 })

      return res.json({
        status: true,
        error: null,
        banner: banner
      })

      
    }
  } catch (err) {
    res.status(500).json({status: false, error: err.message})
  }
}

exports.getSingleBannerById = async (req, res, next) => {
  const id = req.params.id;
  const query = { _id: id };
  const select = req.query.select;

  try {
    const data = await Banner.findOne(query).populate(
      "products",
      select ? select : ""
    );
    res.status(200).json({
      data: data,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Something went wrong on database operation!";
    }
    next(err);
  }
};

exports.deleteBannerById = async (req, res, next) => {
  const id = req.params.id;
  const query = { _id: id };

  try {
    await Banner.deleteOne(query);

    res.status(200).json({
      message: "Banner delete Successfully!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Something went wrong on database operation!";
    }
    next(err);
  }
};

exports.editBanner = (req, res, next) => {
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

  const updatedData = req.body;
  const query = { _id: updatedData._id };
  const push = { $set: updatedData };

  Banner.findOneAndUpdate(query, push)
    .then(() => {
      res.status(200).json({
        message: "Banner Updated Successfully!",
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
