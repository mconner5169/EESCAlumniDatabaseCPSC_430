const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const port = process.env.PORT || 5000

//Load .env file
require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

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

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

const adminRouter = require('./routes/admin_routes');
app.use('/admin', adminRouter);

const alumniRouter = require('./routes/alumni_routes');
app.use('/alumni', alumniRouter);

const apiRouter = require('./routes/api_routes');
app.use('/api', apiRouter);

app.get('/', (req, res) => {
    res.render('index.html');
});

app.listen(port,
    () => console.log(`Server is running on port ${port}`))
