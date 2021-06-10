const express = require("express");
const app = express();  
const db = require("./models")
const bodyParser = require("body-parser")
const cors = require('cors')
const http = require('http')
const socketio = require('socket.io')

const server = http.createServer(app)
const io = socketio(server, { cors: {origin: '*'} })

// Run when client connects
io.on('connection', socket => {
    socket.on('toast', (data) => {
        socket.broadcast.emit('toast', data)
    })

    socket.on('disconnect', () => {
        return null
    })
})

// const PORT = process.env.PORT || 5000

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors())

app.use(express.static('uploads'))

const productRoutes = require('./routes/productRoutes')
app.use('/product', productRoutes)

const categoryRoutes = require('./routes/categoryRoutes')
app.use('/category', categoryRoutes)

const reviewRoutes = require('./routes/reviewRoutes')
app.use('/review', reviewRoutes)

const usersRoutes = require('./routes/usersRoutes')
app.use('/users', usersRoutes)

const orderRoutes = require('./routes/orderRoutes')
app.use('/order', orderRoutes)

const orderItemRoutes = require('./routes/orderItemRoutes')
app.use('/orderitem', orderItemRoutes)

const notificationRoutes = require('./routes/notificationRoutes')
app.use('/notification', notificationRoutes)


const aboutusRoutes = require('./routes/aboutusRoutes')
app.use('/aboutus', aboutusRoutes)

const heroimagesRoutes = require('./routes/heroimagesRoutes')
app.use('/heroimages', heroimagesRoutes)

const topimagesRoutes = require('./routes/topimagesRoutes')
app.use('/topimages', topimagesRoutes )

const serviceRoutes = require('./routes/serviceRoutes')
app.use('/service', serviceRoutes )

const offerRoutes = require('./routes/offerRoutes')
app.use('/offer', offerRoutes)

const adminRoutes = require('./routes/adminRoutes')
app.use('/admin', adminRoutes)


const pushnotifyRoutes = require('./routes/pushnotifyRoutes')
app.use('/pushnotify', pushnotifyRoutes)

db.sequelize.sync().then(() => {
    app.listen(process.env.PORT || 5000, () => {
        // console.log(`Listening on: http://localhost:${process.env.PORT}`)
        console.log('Server has Started')
    })
})
.catch(err => {
    console.log('there was a connection error')
})