var express = require('express')
var router = express.Router();
//var app = express()
 
var path = require('path');
const VIEWS = path.join(__dirname, 'views');
const TITLE = "AutoMGMT Nissan®";


// SHOW LIST OF USERS
router.get('/', function(req, res, next) {
    req.getConnection(function(error, conn) {
        conn.query('SELECT * FROM customers ORDER BY id_customer DESC',function(err, rows, fields) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                res.render('customer/list', {
                    title: 'Customer List', 
                    data: ''
                })
            } else {
                // render to /customer/list.ejs template file id
                res.render('customer/list', {
                    title: 'Customer List', 
                    data: rows
                })
            }
        })
    })
})
 
// SHOW ADD customer FORM user
router.get('/add/(:id_seller)', function(req, res, next){    
    // render to views/customer/add.ejs
    res.render('customer/add', {
        title: 'Add New customer',
        name: '',
        lastname: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        postal_code: '',
        country: '',
        id_seller: req.params.id_seller
    })
})
 
// ADD NEW customer POST ACTION
router.post('/add/(:id_seller)', function(req, res, next){    
    req.assert('name', 'Name is required').notEmpty()           //Validate name
    req.assert('lastname', 'Lastname is required').notEmpty()   //Validate lastname
    req.assert('phone', 'A valid phone is required').notEmpty()   //Validate
    req.assert('address', 'A valid address is required').notEmpty()   //Validate
    req.assert('city', 'A valid city is required').notEmpty()   //Validate city
    req.assert('state', 'A valid state is required').notEmpty()   //Validate state
    req.assert('postal_code', 'A valid postal code is required').notEmpty()   //Validate
    req.assert('country', 'A valid country is required').notEmpty()   //Validate
    
    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
        
        /********************************************
         * Express-validator module
         
        req.body.comment = 'a <span>comment</span>';
        req.body.username = '   a user    ';
 
        req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
        req.sanitize('username').trim(); // returns 'a user'
        ********************************************/

        var customer = {
            name: req.sanitize('name').escape().trim(),
            lastname: req.sanitize('lastname').escape().trim(),
            phone: req.sanitize('phone').escape().trim(),
            address: req.sanitize('address').escape().trim(),
            city: req.sanitize('city').escape().trim(),
            state: req.sanitize('state').escape().trim(),
            postal_code: req.sanitize('postal_code').escape().trim(),
            country: req.sanitize('country').escape().trim(),
            id_seller: req.params.id_seller
        }
        
        req.getConnection(function(error, conn) {
            conn.query('INSERT INTO customers SET ?', customer, function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash('error', err)
                    
                    // render to views/customer/add.ejs
                    res.render('customer/add', {
                        title: 'Add New customer',
                        name: customer.name,
                        lastname: customer.lastname,
                        phone: customer.phone,
                        address: customer.address,
                        city: customer.city,
                        state: customer.lastname,
                        postal_code: customer.postal_code,
                        country: customer.country,
                        id_seller: customer.id_seller
                    })
                } else {                
                    req.flash('success', 'Cliente agregado exitosamente!')
                    
                    // render to views/customer/add.ejs
                    res.render('customer/add', {
                        title: 'Add New customer',
                        name: '',
                        lastname: '',
                        phone: '',
                        address: '',
                        city: '',
                        state: '',
                        postal_code: '',
                        country: '',
                        id_seller: ''
                    })
                }
            })
        })
    }
    else {   //Display errors to customer
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })                
        req.flash('error', error_msg)        
        
        /**
         * Using req.body.name 
         * because req.param('name') is deprecated
         */ 
        res.render('customer/add', { 
            title: 'Add New Customer',
            name: req.body.name,
            lastname: req.body.lastname,
            phone: req.body.phone,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            postal_code: req.body.postal_code,
            country: req.body.country,
            id_seller: req.body.id_seller
        })
    }
})
 
// SHOW EDIT USER FORM
router.get('/edit/(:id_customer)', function(req, res, next){
    req.getConnection(function(error, conn) {
        conn.query('SELECT * FROM customers WHERE id_customer = ' + req.params.id_customer, function(err, rows, fields) {
            if(err) throw err
            
            // if user not found 
            if (rows.length <= 0) {
                req.flash('error', 'User not found with id = ' + req.params.id_customer)
                res.redirect('/customer')
            }
            else { // if user found
                res.render("customer/edit", {
                    title: TITLE, 
                    id_customer: rows[0].id_customer,
                    name: rows[0].name,
                    lastname: rows[0].lastname,
                    phone: rows[0].phone,
                    address: rows[0].address,
                    city: rows[0].city,
                    state: rows[0].state,
                    postal_code: rows[0].postal_code,
                    country: rows[0].country,
                    id_seller: rows[0].id_seller
                })
            }            
        })
    })
})
/*
// SHOW EDIT USER FORM
router.get('/edit/(:id_customer)/(:id_seller)', function(req, res, next){
    req.getConnection(function(error, conn) {
        conn.query("SELECT orders_details.*, orders.*, orders_types.*, payments.*, payments_status.*, vehicles.*, vehicles_models.*, customers.* " +
                   "FROM orders_details " +
                    "INNER JOIN orders ON orders.id_order = orders_details.id_order " +
                    "INNER JOIN orders_types ON orders_details.id_order_type = orders_types.id_order_type "+
                    "INNER JOIN payments ON orders.id_order = payments.id_order "+
                    "INNER JOIN payments_status ON payments.id_payment_status = payments_status.id_payment_status " +
                    "INNER JOIN vehicles ON orders_details.id_vehicle = vehicles.id_vehicle " +
                    "INNER JOIN vehicles_models ON vehicles.id_vehicle_model = vehicles_models.id_vehicle_model " +
                    "INNER JOIN customers ON orders_details.id_customer = customers.id_customer " +
                    "WHERE orders_details.id_seller = "+  req.params.id_seller +" AND orders_details.id_customer = "+ req.params.id_customer +"; ",function(err, rows, fields) {
            //if(err) throw err
            
            if (err || rows.length === 0) {
                conn.query('SELECT * FROM customers WHERE id_customer = ' + req.params.id_customer, function(err, rows2, fields) {
                    res.render("customer/edit", {
                        title: TITLE, 
                        id_customer: rows2[0].id_customer,
                        name: rows2[0].name,
                        lastname: rows2[0].lastname,
                        phone: rows2[0].phone,
                        address: rows2[0].address,
                        city: rows2[0].city,
                        state: rows2[0].state,
                        postal_code: rows2[0].postal_code,
                        country: rows2[0].country,
                        id_seller: rows2[0].id_seller,
                        data: ''
                    })
                })
            } else {
                var cookie;
                res.cookie('pedidos', rows)
                console.log(res.cookie)
                res.render("customer/edit", {
                    title: TITLE,
                    id_customer: req.params.id_customer,
                    id_seller: req.params.id_seller,
                    name: rows[0].name,
                    lastname: rows[0].lastname,
                    phone: rows[0].phone,
                    address: rows[0].address,
                    city: rows[0].city,
                    state: rows[0].state,
                    postal_code: rows[0].postal_code,
                    country: rows[0].country,
                    data: rows
                })

            }
        })
    })
}) */
 
// EDIT USER POST ACTION
router.put('/edit/(:id_customer)', function(req, res, next) {
    req.assert('name', 'Name is required').notEmpty()           //Validate name
    req.assert('lastname', 'Lastname is required').notEmpty()   //Validate lastname
    req.assert('phone', 'A valid phone is required').notEmpty()   //Validate
    req.assert('address', 'A valid address is required').notEmpty()   //Validate
    req.assert('city', 'A valid city is required').notEmpty()   //Validate city
    req.assert('state', 'A valid state is required').notEmpty()   //Validate state
    req.assert('postal_code', 'A valid postal_code is required').notEmpty()   //Validate
    req.assert('country', 'A valid country is required').notEmpty()   //Validate
    
    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
        
        var customer = {
            name: req.sanitize('name').escape().trim(),
            lastname: req.sanitize('lastname').escape().trim(),
            phone: req.sanitize('phone').escape().trim(),
            address: req.sanitize('address').escape().trim(),
            city: req.sanitize('city').escape().trim(),
            state: req.sanitize('state').escape().trim(),
            postal_code: req.sanitize('postal_code').escape().trim(),
            country: req.sanitize('country').escape().trim()
        }
        req.getConnection(function(error, conn) {
            conn.query('UPDATE customers SET ? WHERE id_customer = ' + req.params.id_customer, customer, function(err, result) {
                //if(err) throw err

                if (err) {
                    req.flash('error', err)
                    
                    // render to views/user/add.ejs
                    res.render('customer/edit', {
                        title: 'Edit customer',
                        id_seller: req.params.id_seller,
                        name: req.body.name,
                        lastname: req.body.lastname,
                        phone: req.body.phone,
                        address: req.body.address,
                        city: req.body.city,
                        state: req.body.state,
                        postal_code: req.body.postal_code,
                        country: req.body.country,
                        id_seller: req.body.id_seller   
                    })
                } else {
                    req.flash('success', 'Data updated successfully!')
                    // render to views/customer/add.ejs
                    res.render('customer/edit', {
                        title: 'Edit customer',
                        id_seller: req.params.id_seller,
                        id_customer: req.params.id_customer,
                        name: req.body.name,
                        lastname: req.body.lastname,
                        phone: req.body.phone,
                        address: req.body.address,
                        city: req.body.city,
                        state: req.body.state,
                        postal_code: req.body.postal_code,
                        country: req.body.country,
                        id_seller: req.body.id_seller,
                        data: ''
                    })
                }
            })
        })
    }
    else {   //Display errors to customer
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)
        
        /**
         * Using req.body.name 
         * because req.param('name') is deprecated
         */ 
        res.render('customer/edit', { 
            title: 'Edit customer',  
            id_seller: req.params.id_seller,          
            id_customer: req.params.id_customer, 
            name: req.body.name,
            lastname: req.body.lastname,
            phone: req.body.phone,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            postal_code: req.body.postal_code,
            country: req.body.country,
            id_seller: req.body.id_seller,
            data: ''
        })
    }
})
 
// DELETE USER
router.delete('/delete/(:id_customer)', function(req, res, next) {
    var customer = { 
        id: req.params.id_customer,
        idseller: req.params.idseller
    }

    req.getConnection(function(error, conn) {

        conn.query("DELETE FROM customers WHERE id_customer = '"+ customer.id + "';", function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                // redirect to users list page
            } else {
                req.flash('success', 'Cliente eliminado exitosamente!')
                // redirect to customer list page
                req.flash('back') 
            }
        })
    })
})
 
module.exports = router