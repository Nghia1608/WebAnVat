const express = require('express');
const router = express.Router();

const siteController = require('../app/controllers/SiteController');

router.post('/search',siteController.search);
router.get('/contact',siteController.contact);

router.get('/',siteController.index);

module.exports = router;