const newsRouter = require('./news');
const siteRouter = require('./site');
const productsRouter = require('./products');
const usersRouter = require('./users');
const AdminRouter = require('./admin');
const bodyParser = require('body-parser');

function route(app){

    app.use('/news',newsRouter);
    app.use('/products',productsRouter);
    app.use('/users',usersRouter);
    app.use('/admin',AdminRouter);

    app.use('/',siteRouter);  //trang chu,luon de duoi 
    

}

module.exports = route;
