const express = require('express')
const router = express.Router()


const index = require('./index')
const watch = require('./watch')
const results = require('./results')


router.use('/', index)
router.use('/watch', watch)
router.use('/results', results)


module.exports = router