const puppeteer = require('puppeteer')
const { JSDOM } = require('jsdom')
const fs = require('fs')
const { file } = require('googleapis/build/src/apis/file')

let browser, page, useCache = true

async function init() {
    if (!browser || !page) {
        browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
            ]
        })
        page = await browser.newPage()
        await page.setViewport({
            width: 1920,
            height: 1080
        })
    }
}

async function getBody(url) {
    if(!fs.existsSync('cache'))
        fs.mkdirSync('cache')

    const filename = 'cache/'+url.split(/\?.+=/).pop()

    if(!useCache || !fs.existsSync(filename)) {
        await init()
        await page.goto(url, { waitUntil: 'networkidle0' })
        const html = await page.content()
        fs.writeFileSync(filename, html, { encoding: 'utf-8' })
    }
    // console.log('url', url)
    try {
        return fs.readFileSync(filename, { encoding: 'utf-8' })
    } catch {
        return null
    }
}


async function video(id) {
    const body = await getBody(`https://youtube.com/watch?v=${id}`)
    if(!body) return null;
    const { document } = new JSDOM(body).window
    
    const title = document.querySelector('h1.title').textContent
    const viewCount = document.querySelector('span.view-count').textContent
    const date = document.querySelector('#date yt-formatted-string').textContent
    const likes = document.querySelector('#top-level-buttons > ytd-toggle-button-renderer:nth-child(1) > a #text').textContent
    const dislikes = document.querySelector('#top-level-buttons > ytd-toggle-button-renderer:nth-child(2) > a #text').textContent
    const description = document.querySelector('#description').textContent

    const channelId = document.querySelector('#channel-name a').href.split('/').pop()
    const channelName = document.querySelector('#channel-name a').textContent
    const channelAvatar = document.querySelector('#avatar #img').src
    const channelSubscribers = document.querySelector('#owner-sub-count').textContent

    // const videoUrl = document.querySelector('.html5-video-container video').src
    // const comments = []

    const watchNext = [...document.querySelectorAll('#items .ytd-watch-next-secondary-results-renderer #dismissable')].map(video => {
        const videoId = video.querySelector('a').href.split('?v=').pop()
        const videoThumbnail = video.querySelector('img').src
        const videoLength = video.querySelector('span').textContent.trim()
        const videoTitle = video.querySelector('#video-title').textContent.trim()
        const videoAuthor = video.querySelector('.ytd-channel-name #text').textContent.trim()
        const videoViews = video.querySelector('#metadata-line').textContent.trim().split('\n')[0].trim()
        const videoUploaded = video.querySelector('#metadata-line').textContent.trim().split('\n').pop().trim()
        
        return (videoId && videoThumbnail && videoLength && videoTitle && videoAuthor && videoViews && videoUploaded) ? {
            id: videoId,
            thumbnail: videoThumbnail,
            length: videoLength,
            title: videoTitle,
            author: videoAuthor,
            views: videoViews,
            uploaded: videoUploaded
        } : null
    }).filter(value => value != null)

    
    return {
        info: {
            id: id,
            title: title,
            viewCount: viewCount,
            date: date,
            likes: likes,
            dislikes: dislikes,
            description: description,
            channel: {
                id: channelId,
                name: channelName,
                avatar: channelAvatar,
                subscribers :channelSubscribers
            }
        },
        // videoUrl: videoUrl,
        // comments: comments,
        watchNext: watchNext
    }
}


module.exports = {
    useCache,
    video
}