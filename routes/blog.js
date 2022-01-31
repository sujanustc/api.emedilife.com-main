// Main Module Required..
const express = require('express');

// Created Require Files..
const controller = require('../controller/blog');
const checkAdminAuth = require('../middileware/check-admin-auth');
const checkIpWhitelist = require('../middileware/check-ip-whitelist');

const router = express.Router();

/**
 * /blog
 * http://localhost:9999/api/blog
 */


router.post('/add-blog',checkIpWhitelist,checkAdminAuth, controller.addBlog);
router.get('/get-all-blogs', controller.getAllBlogs);
router.get('/get-blog-by-blog-id/:blogId', controller.getBlogByBlogId);
router.get('/get-single-blog-by-slug/:slug', controller.getSingleBlogBySlug);
router.put('/edit-blog-by-blog',checkIpWhitelist,checkAdminAuth, controller.editBlogData);
router.delete('/delete-blog-by-id/:blogId',checkIpWhitelist,checkAdminAuth, controller.deleteBlogByBlogId);

// Export All router..
module.exports = router;