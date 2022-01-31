// Main Module Required..
const express = require('express');

// Created Require Files..
const controller = require('../controller/discussion');
const checkAuth = require('../middileware/check-user-auth');
const checkAdminAuth = require('../middileware/check-admin-auth');

const router = express.Router();

/**
 * /discussion
 * http://localhost:9999/api/discussion
 */

router.post('/add-discussion', controller.addDiscussion);
router.post('/get-all-discussion-by-query', controller.getAllDiscussionsByQuery);
router.get('/get-all-discussion', checkAdminAuth, controller.getAllDiscussions);
router.get('/get-discussion-by-discussion-id/:discussionId', controller.getDiscussionByDiscussionId);
router.put('/edit-discussion', controller.editDiscussion);
router.post('/add-discussion-reply-lv1', controller.addDiscussionReplyLv1);
router.post('/add-discussion-reply-lv2', controller.addDiscussionReplyLv2);
router.delete('/delete-discussion-by-id/:discussionId', controller.deleteDiscussionByDiscussionId);

// Export All router..
module.exports = router;
