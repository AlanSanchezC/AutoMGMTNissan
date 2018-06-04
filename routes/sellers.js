var express = require('express')
var router = express.Router();
//var app = express()
 
var path = require('path');
const VIEWS = path.join(__dirname, 'views');



// SHOW LIST OF USERS
router.get('/', function(req, res, next) {
    req.getConnection(function(error, conn) {
        conn.query('SELECT * FROM sellers ORDER BY id_seller DESC',function(err, rows, fields) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                res.render('seller/list', {
                    title: 'Seller List', 
                    data: ''
                })
            } else {
                // render to views/seller/list.ejs template file id
                res.render('seller/list', {
                    title: 'Seller List', 
                    data: rows
                })
            }
        })
    })
})
 
// SHOW ADD Seller FORM user
router.get('/add', function(req, res, next){    
    // render to views/seller/add.ejs
    res.render('seller/add', {
        title: 'Add New Seller',
        name: '',
        lastname: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        postal_code: '',
        country: '',
        id_office_manager: ''
    })
})
 
// ADD NEW Seller POST ACTION
router.post('/add', function(req, res, next){    
    req.assert('name', 'Name is required').notEmpty()           //Validate name
    req.assert('lastname', 'Lastname is required').notEmpty()   //Validate lastname
    req.assert('phone', 'A valid city is required').notEmpty()   //Validate
    req.assert('address', 'A valid city is required').notEmpty()   //Validate
    req.assert('city', 'A valid city is required').notEmpty()   //Validate city
    req.assert('state', 'A valid state is required').notEmpty()   //Validate state
    req.assert('postal_code', 'A valid city is required').notEmpty()   //Validate
    req.assert('country', 'A valid city is required').notEmpty()   //Validate
    req.assert('id_office_manager', 'A valid city is required').notEmpty()   //Validate
 
    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
        
        /********************************************
         * Express-validator module
         
        req.body.comment = 'a <span>comment</span>';
        req.body.username = '   a user    ';
 
        req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
        req.sanitize('username').trim(); // returns 'a user'
        ********************************************/

        var seller = {
            name: req.sanitize('name').escape().trim(),
            lastname: req.sanitize('lastname').escape().trim(),
            phone: req.sanitize('phone').escape().trim(),
            address: req.sanitize('address').escape().trim(),
            city: req.sanitize('city').escape().trim(),
            state: req.sanitize('state').escape().trim(),
            postal_code: req.sanitize('postal_code').escape().trim(),
            country: req.sanitize('country').escape().trim(),
            id_office_manager: req.sanitize('id_office_manager').escape().trim(),
        }
        
        req.getConnection(function(error, conn) {
            conn.query('INSERT INTO sellers SET ?', seller, function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash('error', err)
                    
                    // render to views/seller/add.ejs
                    res.render('seller/add', {
                        title: 'Add New Seller',
                        name: seller.name,
                        lastname: seller.lastname,
                        phone: seller.phone,
                        address: seller.address,
                        city: seller.city,
                        state: seller.state,
                        postal_code: seller.postal_code,
                        country: seller.country,
                        id_office_manager: seller.id_office_manager
                    })
                } else {                
                    req.flash('success', 'Data added successfully!')
                    
                    // render to views/seller/add.ejs
                    res.render('seller/add', {
                        title: 'Add New Seller',
                        name: '',
                        lastname: '',
                        phone: '',
                        address: '',
                        city: '',
                        state: '',
                        postal_code: '',
                        country: '',
                        id_office_manager: ''
                    })
                }
            })
        })
    }
    else {   //Display errors to seller
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })                
        req.flash('error', error_msg)        
        
        /**
         * Using req.body.name 
         * because req.param('name') is deprecated
         */ 
        res.render('seller/add', { 
            title: 'Add New Seller',
            name: req.body.name,
            lastname: req.body.lastname,
            phone: req.body.phone,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            postal_code: req.body.postal_code,
            country: req.body.country,
            id_office_manager: req.body.id_office_manager
        })
    }
})
 
// SHOW EDIT USER FORM
router.get('/edit/(:id_seller)', function(req, res, next){
    req.getConnection(function(error, conn) {
        conn.query('SELECT * FROM sellers WHERE id_seller = ' + req.params.id_seller, function(err, rows, fields) {
            if(err) throw err
            
            // if user not found
            if (rows.length <= 0) {
                req.flash('error', 'User not found with id = ' + req.params.id_seller)
                res.redirect('/seller')
            }
            else { // if user found
                // render to views/user/edit.ejs template file
                res.render("seller/edit", {
                    title: 'Edit Seller', 
                    //data: rows[0],
                    id_seller: rows[0].id_seller,
                    name: rows[0].name,
                    lastname: rows[0].lastname,
                    city: rows[0].city,
                    state: rows[0].state
                })
            }            
        })
    })
})
 
// EDIT USER POST ACTION
router.put('/edit/(:id_seller)', function(req, res, next) {
    req.assert('name', 'Name is required').notEmpty()           //Validate name
    req.assert('lastname', 'Lastname is required').notEmpty()   //Validate lastname
    req.assert('city', 'A valid city is required').notEmpty()   //Validate city
    req.assert('state', 'A valid state is required').notEmpty()   //Validate state

    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
        
        /********************************************
         * Express-validator module
         
        req.body.comment = 'a <span>comment</span>';
        req.body.username = '   a user    ';
 
        req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
        req.sanitize('username').trim(); // returns 'a user'
        ********************************************/
        var seller = {
            name: req.sanitize('name').escape().trim(),
            lastname: req.sanitize('lastname').escape().trim(),
            city: req.sanitize('city').escape().trim(),
            state: req.sanitize('state').escape().trim()
        }
        
        req.getConnection(function(error, conn) {
            conn.query('UPDATE sellers SET ? WHERE id_seller = ' + req.params.id_seller, seller, function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash('error', err)
                    
                    // render to views/user/add.ejs
                    res.render('seller/edit', {
                        title: 'Edit Seller',
                        name: req.body.name,
                        lastname: req.body.lastname,
                        city: req.body.city,
                        state: req.body.state
                    })
                } else {
                    req.flash('success', 'Data updated successfully!')
                    
                    // render to views/seller/add.ejs
                    res.render('seller/edit', {
                        title: 'Edit Seller',
                        id_seller: req.params.id_seller,
                        name: req.body.name,
                        lastname: req.body.lastname,
                        city: req.body.city,
                        state: req.body.state
                    })
                }
            })
        })
    }
    else {   //Display errors to seller
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)
        
        /**
         * Using req.body.name 
         * because req.param('name') is deprecated
         */ 
        res.render('seller/edit', { 
            title: 'Edit Seller',            
            id_seller: req.params.id_seller, 
            name: req.body.name,
            lastname: req.body.lastname,
            city: req.body.city,
            state: req.body.state
        })
    }
})
 
// DELETE USER
router.delete('/delete/(:id_seller)', function(req, res, next) {
    var seller = { id: req.params.id }
    
    req.getConnection(function(error, conn) {
        conn.query('DELETE FROM sellers WHERE id_seller = ' + req.params.id_seller, seller, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                // redirect to users list page
                res.redirect('/sellers')
            } else {
                req.flash('success', 'Seller deleted successfully! id = ' + req.params.id_seller)
                // redirect to seller list page
                res.redirect('/sellers')
            }
        })
    })
})
 
module.exports = router