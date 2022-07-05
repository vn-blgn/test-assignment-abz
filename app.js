const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const exphbs = require('express-handlebars');
const multer = require('multer');
require('dotenv').config();
const helpers = require('./lib/helpers');
const auth = require('./lib/auth');

const indexRouter = require('./routes/index');
const apiRouter = require('./routes/apiRouter');
// const testRouter = require('./routes/testRouter');

const app = express();

const hbs = exphbs.create({
    defaultLayout: "layout",
    helpers: helpers,
    extname: '.hbs',
    partialsDir: path.join(__dirname, 'views/partials/'),
});
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set('views', path.join(__dirname, 'views'));

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/images");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(multer({ storage: storageConfig }).single("photo"));

app.use('/', indexRouter);
app.use('/api', auth.checkToken, apiRouter);
// app.use('/test', testRouter);

app.use(function(req, res, next) {
    next(createError(404));
});

app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');

    console.log(err.message);
});

module.exports = app;