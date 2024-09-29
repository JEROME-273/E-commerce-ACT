const main = {
    index:(req , res ) =>{
        res.render('index');
    },
    accounts:(req , res ) =>{
        res.render('accounts');
    },
    message:(req , res ) =>{
        res.render('message');
    },
    orders:(req , res ) =>{
        res.render('orders');
    },
    products:(req , res ) =>{
        res.render('products');
    },
}

module.exports = main;