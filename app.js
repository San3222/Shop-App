require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('./conn');

// import routes file
const authRoutes =  require('./routes/auth');
const userRoutes = require('./routes/user');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/order');

//PORT
const port = process.env.PORT 

//MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use('/api/auth',authRoutes)
app.use('/api/user',userRoutes)
app.use('/api/products',productRoutes)
app.use('/api/carts',cartRoutes)
app.use('/api/orders',orderRoutes)




app.listen(port,()=>{
    console.log('Backend server is running')
})