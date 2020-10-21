const express = require("express")
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()

const port = process.env.PORT || 5000


app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static("public"))

const uri = process.env.ATLAS_URI
mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

const connection = mongoose.connection
connection.once('open', () => {
    console.log("Connection to MongoDB successful")
})

const usersRouter = require('./routes/users');
app.use('/users', usersRouter);

let alumniRouter = require('./routes/crud_routes');
app.use('/alumni', alumniRouter);

app.get('/', (req, res) => {
    res.render('index.html');
});

app.listen(port,
    () => console.log(`Server is running on port ${port}`))