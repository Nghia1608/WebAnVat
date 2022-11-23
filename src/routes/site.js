const express = require('express');
const router = express.Router();
const {
    verifyToken,
    verifyTokenAndAdmin,
    verifyTokenAndUserAuthorization,
  } = require("../app/controllers/Middleware");
const siteController = require('../app/controllers/SiteController');

router.get('/contact',siteController.contact);

router.get('/admin',verifyTokenAndAdmin,siteController.admin);
router.get('/',siteController.index);


module.exports = router;