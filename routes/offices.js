var express = require('express')
var router = express.Router();
//var app = express()
 
var path = require('path');
const VIEWS = path.join(__dirname, 'views');

// SHOW LIST 
router.get('/(:id_manager)', function(req, res, next) {    
    req.getConnection(function(error, conn) {
        conn.query("SELECT offices.*, offices_managers.* " +
                    "FROM offices "+
                    "INNER JOIN offices_managers ON offices.id_office_manager = offices_managers.id_office_manager " +
                    "WHERE offices.id_global_manager = ?" +
                    " ORDER BY offices.state DESC;", req.params.id_manager, function(err, rows, fields) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                res.render('office/list', {
                    title: 'Office List', 
                    data: ''
                })
            } else {
                res.render('office/list', {
                    title: 'Lista de sucursales', 
                    data: rows,
                    id_global_manager: req.params.id_manager
                })
            }
        })
    })
})
 
// SHOW ADD FORM name
router.get('/add/(:id_global_manager)/(:state)', function(req, res, next){
    req.getConnection(function(error, conn) {
        conn.query("SELECT id_office_manager, name, lastname, city, state FROM offices_managers " +
                        "WHERE job = 'S/A'",function(err, rows, fields) {
            if (rows.length === 0){
                rows = ''
            }
            res.render('office/add', {
                title: 'Add New Office',
                name_office: '',
                phone: '',
                address: '',
                city: '',
                state: '',
                postal_code: '',
                country: '',
                data: rows,
                id_office_manager: rows[0].id_office_manager,
                id_global_manager: req.params.id_global_manager
            })
        })
    })
})
 
// ADD NEW x POST ACTION
router.post('/addnew/(:id_office_manager)/(:id_global_manager)', function(req, res, next){    
    req.assert('name_office', 'Office name is required').notEmpty()   //Validate 
    req.assert('phone', 'A valid phone is required').notEmpty()   //Validate
    req.assert('address', 'A valid address is required').notEmpty()   //Validate
    req.assert('city', 'A valid city is required').notEmpty()   //Validate city
    req.assert('state', 'A valid state is required').notEmpty()   //Validate state
    req.assert('postal_code', 'A valid postal code is required').notEmpty()   //Validate
    req.assert('country', 'A valid country is required').notEmpty()   //Validate
    
    var errors = req.validationErrors()
    
    if( !errors ) {

        var office = {
            name_office: req.sanitize('name_office').escape().trim(),
            phone: req.sanitize('phone').escape().trim(),
            address: req.sanitize('address').escape().trim(),
            city: req.sanitize('city').escape().trim(),
            state: req.sanitize('state').escape().trim(),
            postal_code: req.sanitize('postal_code').escape().trim(),
            country: req.sanitize('country').escape().trim(),
            id_office_manager: req.params.id_office_manager,
            id_global_manager: req.params.id_global_manager
        }

        req.getConnection(function(error, conn) {
            conn.query('INSERT INTO offices SET ?', office, function(err, result) {
                
                conn.query("UPDATE offices_managers SET job = 'Office Manager' WHERE id_office_manager = ?", office.id_office_manager, function(err, result) {
                    res.render('office/success')
                })
            
            })
        })
    }
    else {   //Display errors 
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })                
        req.flash('error', error_msg)        
        
        res.render('office/add', { 
            title: 'Add New Office',
            name_office: req.body.name_office,
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
 
// SHOW EDIT FORM
router.get('/edit/(:id_office)', function(req, res, next){
    req.getConnection(function(error, conn) {
        conn.query('SELECT * FROM offices WHERE id_office = ' + req.params.id_office, function(err, rows, fields) {
            if(err) throw err
            
            // if not found
            if (rows.length <= 0) {
                req.flash('error', 'Office not found with id = ' + req.params.id_office)
                res.redirect('/office')
            }
            else { // if found
            console.log(rows)
                res.render("office/edit", {
                    title: 'Edit Office', 
                    id_office: rows[0].id_office,
                    name_office: rows[0].name_office,
                    phone: rows[0].phone,
                    address: rows[0].address,
                    city: rows[0].city,
                    state: rows[0].state,
                    postal_code: rows[0].postal_code,
                    country: rows[0].country,
                    id_office_manager: rows[0].id_office_manager
                })
            }            
        })
    })
})
 
// EDIT POST ACTION
router.put('/edit/(:id_office)', function(req, res, next) {
    req.assert('name_office', 'Office name is required').notEmpty()   //Validate 
    req.assert('phone', 'A phone is required').notEmpty()   //Validate 
    req.assert('address', 'A address is required').notEmpty()   //Validate 
    req.assert('city', 'A valid city is required').notEmpty()   //Validate city
    req.assert('state', 'A valid state is required').notEmpty()   //Validate 
    req.assert('postal_code', 'A valid postal code is required').notEmpty()   //Validate 
    req.assert('country', 'A valid country is required').notEmpty()   //Validate 
    req.assert('id_office_manager', 'A valid id_office_manager is required').notEmpty()   //Validate 

    var errors = req.validationErrors()
    
    if( !errors ) {
        var office = {
            name_office: req.sanitize('name_office').escape().trim(),
            phone: req.sanitize('phone').escape().trim(),
            address: req.sanitize('address').escape().trim(),
            city: req.sanitize('city').escape().trim(),
            state: req.sanitize('state').escape().trim(),
            postal_code: req.sanitize('postal_code').escape().trim(),
            country: req.sanitize('country').escape().trim(),
            id_office_manager: req.sanitize('id_office_manager').escape().trim()
        }
        
        req.getConnection(function(error, conn) {
            conn.query('UPDATE offices SET ? WHERE id_office = ' + req.params.id_office, office, function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash('error', err)
                    
                    res.render('office/edit', {
                        title: 'Edit office',
                        id_office: req.params.id_office,
                        name_office: req.body.name_office,
                        phone: req.body.phone,
                        address: req.body.address,
                        city: req.body.city,
                        state: req.body.state,
                        postal_code: req.body.postal_code,
                        country: req.body.country,
                        id_office_manager: req.body.id_office_manager
                    })
                } else {
                    req.flash('success', '¡Datos actualizados!')
                    
                    res.render('office/edit', {
                        title: 'Edit Office',
                        id_office: req.params.id_office,
                        name_office: req.body.name_office,
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
        })
    }
    else {   //Display errors to office
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)
        
        res.render('office/edit', { 
            title: 'Edit Office',            
            name_office: req.body.name_office,
            phone: req.body.phone,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            postal_code: req.body.postal_code,
            country: req.body.country,
            id_office_manager: req.body.id_office_manager,
            id_office: req.params.id_office
        })
    }
})
 
// DELETE
router.delete('/delete/(:id_office)', function(req, res, next) {
    var office = { id: req.params.id }
    
    req.getConnection(function(error, conn) {
        conn.query('DELETE FROM offices WHERE id_office = ' + req.params.id_office, office, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                // redirect to  list page
                res.redirect('/offices')
            } else {
                req.flash('success', 'Office deleted successfully! id = ' + req.params.id_office)
                // redirect to list page
                res.redirect('/offices')
            }
        })
    })
})
 
module.exports = router