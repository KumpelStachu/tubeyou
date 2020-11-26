const expressLayouts = require('express-ejs-layouts')
const express = require('express')
const morgan = require('morgan')

const PORT = process.env.PORT || 3000
const app = express()


app.set('view engine', 'ejs')

app.use(morgan('dev'))
app.use(express.static('./public'))
app.use(expressLayouts)
app.use(require('./routes/routes.js'))

const server = app.listen(PORT, () => console.log(`Listening on port ${PORT}`))

process.on('exit', () => server.close())
process.on('uncaughtException', (e) => {console.log(e);server.close()})
process.on('unhandledRejection', (e) => {console.log(e);server.close()})
