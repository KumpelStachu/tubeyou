const youtube = require('../youtube')
const express = require('express')
const router = express.Router()

router.get('/', async(req, res) => {
    const videoId = req.query.v
    const video = await youtube.video(videoId)

    res.render('pages/watch', {
        video: video.info,
        watchNext: video.watchNext
    })
})

module.exports = router