const router = require('express').Router();

const apiRoutes = require('./api');
const homeRoute = require('./homeRoutes')

router.use('/', homeRoutes);
router.use('/api', apiRoutes);

module.exports = router;
