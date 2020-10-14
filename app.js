const express = require("express")
const app = express()
const mongoose = require('mongoose')
const passport = require("passport")
const cors = require('cors')
const bodyParser = require('body-parser')
const LocalStrategy = require("passport-local"), 
passportLocalMongoose = require("passport-local-mongoose"), 
User = require("./models/user.model");
const port = process.env.PORT || 3000

//Load .env file
require('dotenv').config()

app.use(cors())
app.use(bodyParser.json())

app.use(express.static("public"))

const uri = process.env.ATLAS_URI
mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,

})

const connection = mongoose.connection
connection.once('open', () => {
    console.log("Connection to MongoDB successful")
})

const usersRouter = require('./routes/users');
app.use('/users', usersRouter);

/*
app.get('/', (req, res) => {
    res.render('index.html');
});
*/


app.set("view engine", "ejs"); 
app.use(bodyParser.urlencoded({ extended: true })); 
  
app.use(require("express-session")({ 
    secret: "Rusty is a dog", 
    resave: false, 
    saveUninitialized: false
})); 
  
app.use(passport.initialize()); 
app.use(passport.session()); 
  
passport.use(new LocalStrategy(User.authenticate())); 
passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser()); 
  
//===================== 
// ROUTES 
//===================== 
  
// Showing home page 
app.get("/home", function (req, res) { 
    res.render("home"); 
}); 
  
// Showing secret page 
app.get("/secret", isLoggedIn, function (req, res) { 
    res.render("secret"); 
}); 
  

  
// Handling user signup 

app.post("/register", function (req, res) { 
    var username = admin
    var password = EarthScience
    User.register(new User({ username: admin }), 
            EarthScience55, function (err, user) { 
      
  
        passport.authenticate("local")( 
            req, res, function () { 
            res.render("secret"); 
        }); 
    }); 
}); 

  
//Showing login form 
app.get("/login", function (req, res) { 
    res.render("login"); 
}); 
  
//Handling user login 
app.post("/login", passport.authenticate("local", { 
    successRedirect: "/secret", 
    failureRedirect: "/login"
}), function (req, res) { 
}); 
  
//Handling user logout  
app.get("/logout", function (req, res) { 
    req.logout(); 
    res.redirect("/home"); 
}); 
  
function isLoggedIn(req, res, next) { 
    if (req.isAuthenticated()) return next(); 
    res.redirect("/login"); 
} 
  
app.listen(port,
    () => console.log(`Server is running on port ${port}`))