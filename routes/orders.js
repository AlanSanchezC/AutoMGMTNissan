var express = require('express')
var router = express.Router();
//var app = express()
 
var path = require('path');
const VIEWS = path.join(__dirname, 'views');

// SHOW LIST 
router.get('/(:id_seller)/(:id_customer)', function(req, res, next) {
    req.getConnection(function(error, conn) {
        conn.query("SELECT orders.id_order as idOrden, orders.*, orders_details.id_order as idDeposito, orders_details.*, orders_type.*"+
                    "FROM orders, orders_details, orders_type " + 
                    "WHERE orders_details.id_seller = ? AND orders_details.id_customer = ?", req.params.id_seller, req.params.id_customer ,function(err, rows, fields) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                res.render('order/list', {
                    title: 'Order list', 
                    data: ''
                })
            } else {
                res.render('order/list', {
                    title: 'Order list', 
                    data: rows
                })
            }
        })
    })
})
 
// SHOW ADD x FORM 
router.get('/add', function(req, res, next){    
    res.render('global_manager/add', {
        title: 'Add New Global manager',
        name: '',
        lastname: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        postal_code: '',
        country: ''
    })
})
 
// ADD NEW x POST ACTION
router.post('/add', function(req, res, next){    
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
        
        var global_manager = {
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
            conn.query('INSERT INTO globals_managers SET ?', global_managers, function(err, result) {
                if (err) {
                    req.flash('error', err)
                    
                    res.render('global_manager/add', {
                        title: 'Add New global manager',
                        name: global_manager.name,
                        lastname: global_manager.lastname,
                        phone: global_manager.phone,
                        address: global_manager.address,
                        city: global_manager.city,
                        state: global_manager.state,
                        postal_code: global_manager.postal_code,
                        country: global_manager.country
                    })
                } else {                
                    req.flash('success', 'Data added successfully!')
                    
                    res.render('global_manager/add', {
                        title: 'Add New Global manager',
                        name: '',
                        lastname: '',
                        phone: '',
                        address: '',
                        city: '',
                        state: '',
                        postal_code: '',
                        country: ''
                    })
                }
            })
        })
    }
    else {   //Display errors to gl
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })                
        req.flash('error', error_msg)        
        
        res.render('global_manager/add', { 
            title: 'Add New Global manager',
            name: req.body.name,
            lastname: req.body.lastname,
            phone: req.body.phone,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            postal_code: req.body.postal_code,
            country: req.body.country
        })
    }
})
 
// SHOW EDIT FORM
router.get('/edit/(:id_global_manager)', function(req, res, next){
    req.getConnection(function(error, conn) {
        conn.query('SELECT * FROM globals_managers WHERE id_global_manager = ' + req.params.id_global_manager, function(err, rows, fields) {
            if(err) throw err
            
            // if user not found
            if (rows.length <= 0) {
                req.flash('error', 'User not found with id = ' + req.params.id_global_manager)
                res.redirect('/global_manager')
            }
            else { // if user found
                res.render("global_manager/edit", {
                    title: 'Edit Global manager', 
                    id_global_manager: rows[0].id_global_manager,
                    name: rows[0].name,
                    lastname: rows[0].lastname,
                    phone: rows[0].phone,
                    address: rows[0].address,
                    city: rows[0].city,
                    state: rows[0].state,
                    postal_code: rows[0].postal_code,
                    country: rows[0].country
                })
            }            
        })
    })
})
 
// EDIT x POST ACTION
router.put('/edit/(:id_global_manager)', function(req, res, next) {
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
        
        var global_manager = {
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
            conn.query('UPDATE globals_managers SET ? WHERE id_global_manager = ' + req.params.id_global_manager, global_manager, function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash('error', err)
                    
                    res.render('global_manager/edit', {
                        title: 'Edit Global manager',
                        name: req.body.name,
                        lastname: req.body.lastname,
                        phone: req.body.phone,
                        address: req.body.address,
                        city: req.body.city,
                        state: req.body.state,
                        postal_code: req.body.postal_code,
                        country: req.body.country
                    })
                } else {
                    req.flash('success', 'Data updated successfully!')
                    
                    res.render('global_manager/edit', {
                        title: 'Edit Global manager',
                        id_global_manager: req.params.id_global_manager,
                        name: req.body.name,
                        lastname: req.body.lastname,
                        phone: req.body.phone,
                        address: req.body.address,
                        city: req.body.city,
                        state: req.body.state,
                        postal_code: req.body.postal_code,
                        country: req.body.country
                    })
                }
            })
        })
    }
    else {   //Display errors to gl
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)
        
        res.render('global_manager/edit', { 
            title: 'Edit Global manager',            
            id_global_manager: req.params.id_global_manager, 
            name: req.body.name,
            lastname: req.body.lastname,
            phone: req.body.phone,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            postal_code: req.body.postal_code,
            country: req.body.country
        })
    }
})
 
// DELETE USER
router.delete('/delete/(:id_global_manager)', function(req, res, next) {
    var gl = { id: req.params.id }
    
    req.getConnection(function(error, conn) {
        conn.query('DELETE FROM globals_managers WHERE id_global_manager = ' + req.params.id_global_manager, gl, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                // redirect to users list page
                res.redirect('/global_managers')
            } else {
                req.flash('success', 'global manager deleted successfully! id = ' + req.params.id_global_manager)
                // redirect to gl list page
                res.redirect('/global_managers')
            }
        })
    })
})
 
module.exports = router