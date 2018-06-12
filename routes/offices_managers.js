var express = require('express')
var router = express.Router();
//var app = express()
 
var path = require('path');
const VIEWS = path.join(__dirname, 'views');

// SHOW LIST 
router.get('/(:id_manager)', function(req, res, next) {
    req.getConnection(function(error, conn) {
        
        conn.query("SELECT offices_managers.id_office_manager as idOfficeManager, offices_managers.name as nameOM, offices_managers.lastname as lastnameOM " + 
                          "offices.*, globals_managers.id_global_manager " +
                    "FROM offices " +
                    "INNER JOIN offices_managers ON offices.id_office_manager = offices_managers.id_office_manager " +
                    "INNER JOIN globals_managers ON offices.id_global_manager = globals_managers.id_global_manager "+
                    "WHERE offices.id_global_manager = ? ;", req.params.id_manager ,function(err, rows, fields) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                res.render('office_manager/list', {
                    title: 'Lista de gerentes de sucursal', 
                    data: '',
                    id_global_manager: req.params.id_manager
                })
            } else {
                
                res.render('office_manager/list', {
                    title: 'Lista de gerentes de sucursal', 
                    data: rows,
                    id_global_manager: req.params.id_manager
                })
            }
        })
    })
})
 
// SHOW ADD x FORM 
router.get('/add/(:id_manager)', function(req, res, next){    
    res.render('office_manager/add', {
        name: '',
        lastname: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        postal_code: '',
        country: '',
        id_global_manager: req.params.id_manager,
        email: '',
        username: '',
        password: ''
    })
})
 
// ADD NEW x POST ACTION
router.post('/add/(:id_global_manager)', function(req, res, next){  
      
    req.assert('name', 'Name is required').notEmpty()           //Validate name
    req.assert('lastname', 'Lastname is required').notEmpty()   //Validate lastname
    req.assert('phone', 'A valid phone is required').notEmpty()   //Validate
    req.assert('address', 'A valid address is required').notEmpty()   //Validate
    req.assert('city', 'A valid city is required').notEmpty()   //Validate city
    req.assert('state', 'A valid state is required').notEmpty()   //Validate state
    req.assert('postal_code', 'A valid postal code is required').notEmpty()   //Validate
    req.assert('country', 'A valid country is required').notEmpty()   //Validate
    req.assert('email', 'A valid email is required').notEmpty()   //Validate state
    req.assert('username', 'A valid username is required').notEmpty()   //Validate
    req.assert('password', 'A password is required').notEmpty()   //Validate

    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
        
        
        var usuario = {
            email: req.sanitize('email').escape().trim(),
            username: req.sanitize('username').escape().trim(),
            password: req.sanitize('password').escape().trim(),
            typeUser: 'o'
        }

        req.getConnection(function(error, conn) {
            conn.query('INSERT INTO users SET ?', usuario, function(err, result) {
                var offices_manager = {
                    name: req.sanitize('name').escape().trim(),
                    lastname: req.sanitize('lastname').escape().trim(),
                    phone: req.sanitize('phone').escape().trim(),
                    address: req.sanitize('address').escape().trim(),
                    city: req.sanitize('city').escape().trim(),
                    state: req.sanitize('state').escape().trim(),
                    postal_code: req.sanitize('postal_code').escape().trim(),
                    country: req.sanitize('country').escape().trim(),
                    id_user: result.insertId
                }
               
                conn.query('INSERT INTO offices_managers SET ?', offices_manager, function(err2, result) {
                //query2
                if (err2) {
                    req.flash('error', err2)
                    res.render('office_manager/add', {
                        title: 'Add New Office manager',
                        name: offices_manager.name,
                        lastname: offices_manager.lastname,
                        phone: offices_manager.phone,
                        address: offices_manager.address,
                        city: offices_manager.city,
                        state: offices_manager.state,
                        postal_code: offices_manager.postal_code,
                        country: offices_manager.country,
                        id_global_manager: offices_manager.id_global_manager,
                        email: usuario.email,
                        username: usuario.username,
                        password: usuario.password
                    })
                } else {                
                    req.flash('success', 'Data added successfully!')
                    res.render('office_manager/add', {
                        title: 'Add New Seller',
                        name: '',
                        lastname: '',
                        phone: '',
                        address: '',
                        city: '',
                        state: '',
                        postal_code: '',
                        country: '',
                        id_global_manager: '',
                        email: '',
                        username: '',
                        password: ''
                    })
                }
                })
                // query1
            })
        })
    }
    else {   //Display errors to seller
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })                
        req.flash('error', error_msg)        
        
        res.render('office_manager/add', { 
            title: 'Add New Office manager',
            name: req.body.name,
            lastname: req.body.lastname,
            phone: req.body.phone,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            postal_code: req.body.postal_code,
            country: req.body.country,
            id_global_manager: req.params.id_global_manager
        })
    }
})
 
// SHOW EDIT FORM
router.get('/edit/(:id_office_manager)', function(req, res, next){
    req.getConnection(function(error, conn) {
        conn.query('SELECT * FROM offices_managers WHERE id_office_manager = ' + req.params.id_office_manager, function(err, rows, fields) {
            if(err) throw err
            
            // if user not found
            if (rows.length <= 0) {
                req.flash('error', 'User not found with id = ' + req.params.id_office_manager)
                res.redirect('/office_manager')
            }
            else { // if user found
                res.render("office_manager/edit", {
                    id_office_manager: rows[0].id_office_manager,
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
router.put('/edit/(:id_office_manager)', function(req, res, next) {
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
        
        var office_manager = {
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
            conn.query('UPDATE offices_managers SET ? WHERE id_office_manager = ' + req.params.id_office_manager, office_manager, function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash('error', err)
                    
                    res.render('office_manager/edit', {
                        title: 'Edit Seller',
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
                    
                    res.render('office_manager/edit', {
                        title: 'Edit Seller',
                        id_office_manager: req.params.id_office_manager,
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
    else {   //Display errors to seller
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)
        
        res.render('office_manager/edit', { 
            title: 'Edit Office manager',            
            id_office_manager: req.params.id_office_manager, 
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
router.delete('/delete/(:id_office_manager)', function(req, res, next) {
    var seller = { id: req.params.id }
    
    req.getConnection(function(error, conn) {
        conn.query('DELETE FROM offices_managers WHERE id_office_manager = ' + req.params.id_office_manager, seller, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                // redirect to users list page
                res.redirect('/offices_managers')
            } else {
                req.flash('success', 'Office manager deleted successfully! id = ' + req.params.id_office_manager)
                // redirect to seller list page
                res.redirect('/offices_managers')
            }
        })
    })
})
 
module.exports = router