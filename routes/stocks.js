var express = require('express')
var router = express.Router();
//var app = express()
 
var path = require('path');
const VIEWS = path.join(__dirname, 'views');
const TITLE = "AutoMGMT Nissan®";


// SHOW LIST OF USERS
router.get('/(:id_office)', function(req, res, next) {
    req.getConnection(function(error, conn) {
        conn.query("SELECT stocks.*, offices.*, vehicles.id_vehicle, vehicles.id_vehicle_model, vehicles_models.* " +
                    "FROM stocks " +
                    "INNER JOIN vehicles ON stocks.id_vehicle = vehicles.id_vehicle " +
                    "INNER JOIN vehicles_models ON vehicles.id_vehicle_model = vehicles_models.id_vehicle_model " +
                    "INNER JOIN offices ON offices.id_office = stocks.id_office " +
                    "WHERE stocks.id_office = ? " + 
                    "ORDER BY stocks.cantidad DESC;", req.params.id_office, function(err, rows, fields) {
            if (err) {
                req.flash('error', err)
                res.render('stock/list', {
                    title: 'Customer List', 
                    data: ''
                })
            } else {
                res.render('stock/list', {
                    title: 'Customer List', 
                    data: rows,
                    id_stock: rows[0].id_stock,
                    id_vehicle_model: rows[0].id_vehicle_model
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
            conn.query('INSERT INTO stocks SET ?', customer, function(err, result) {
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
router.get('/edit/(:id_stock)', function(req, res, next){
    req.getConnection(function(error, conn) {
        conn.query("SELECT stocks.*, vehicles.*, vehicles_models.* " +
                    "FROM stocks " +
                    "INNER JOIN vehicles ON stocks.id_vehicle = vehicles.id_vehicle " +
                    "INNER JOIN vehicles_models ON vehicles_models.id_vehicle_model = vehicles.id_vehicle_model " +
                    "WHERE stocks.id_stock = ? ;", req.params.id_stock, function(err, rows, fields) {
            if(err) throw err
            
            // if user not found 
            if (rows.length <= 0) {
                req.flash('error', 'User not found with id = ' + req.params.id_stock)
                res.redirect('/stock')
            }
            else { // if user found
                res.render("stock/edit", { 
                    id_stock: rows[0].id_stock,
                    cantidad: rows[0].cantidad,
                    model: rows[0].model,
                    details: rows[0].details,
                    cost: rows[0].cost,
                    id_vehicle_model: rows[0].id_vehicle_model
                })
            }            
        })
    })
})

 
// EDIT USER POST ACTION
router.put('/edit/(:id_stock)/(:id_vehicle_model)', function(req, res, next) {
    req.assert('cantidad', 'Se requiere una cantidad').notEmpty()           //Validate name
    req.assert('model', 'Se requiere un modelo').notEmpty()   //Validate lastname
    req.assert('details', 'Detalles requeridos').notEmpty()   //Validate
    req.assert('cost', 'Se requiere un costo').notEmpty()   //Validate
    
    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
        
        var cantidadStock = {
            cantidad: req.sanitize('cantidad').escape().trim(),
        }

        var modeloVehiculo = {
            model: req.sanitize('model').escape().trim(),
            details: req.sanitize('details').escape().trim(),
            cost: req.sanitize('cost').escape().trim()
        }

        req.getConnection(function(error, conn) {
            conn.query('UPDATE stocks SET ? WHERE id_stock = ' + req.params.id_stock, cantidadStock, function(err, result) {
                conn.query('UPDATE vehicles_models SET ? WHERE id_vehicle_model = ' + req.params.id_vehicle_model, modeloVehiculo, function(err2, result2) {                
                    if (err || err2) {
                        req.flash('error', err)
                        res.render('stock/edit', {
                            cantidad: req.body.cantidad,
                            model: req.body.model,
                            details: req.body.details,
                            cost: req.body.cost,
                            id_stock: req.params.id_stock,
                            id_vehicle_model: req.params.id_vehicle_model
                        })
                    } else {
                        req.flash('success', 'Data updated successfully!')
                        res.render('stock/edit', {
                            cantidad: req.body.cantidad,
                            model: req.body.model,
                            details: req.body.details,
                            cost: req.body.cost,
                            id_stock: req.params.id_stock,
                            id_vehicle_model: req.params.id_vehicle_model
                        })
                    }
                })
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
router.delete('/delete/(:id_stock)', function(req, res, next) {
    var customer = { 
        id: req.params.id_customer,
        idseller: req.params.idseller
    }
/*
        ///// BAD
*/
    req.getConnection(function(error, conn) {

        conn.query("DELETE FROM stocks WHERE id_customer = '"+ customer.id + "';", function(err, result) {
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