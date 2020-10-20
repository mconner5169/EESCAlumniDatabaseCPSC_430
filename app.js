const express = require("express")
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000



//Load .env file
require('dotenv').config()

app.use(cors())
app.use(bodyParser.json())
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

const alumniRouter = require('./routes/crud_routes');
app.use('/alumni', alumniRouter);

const alumniFormRouter = require('./routes/alumni_form_info');
app.use('/alumnus', alumniFormRouter);

app.get('/', (req, res) => {
    res.render('index.html');
});

//catches 404 error
app.use(function(req, res, next) {
	next(createError(404));
});

//error handler
app.use(function(err, req, res, next) {
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	res.status(err.status || 500);
	res.render('error');
});

app.listen(port,
    () => console.log(`Server is running on port ${port}`))
