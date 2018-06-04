var express = require('express')
var router = express.Router();
//var app = express()
 
var path = require('path');
const VIEWS = path.join(__dirname, 'views');


// SHOW LIST 
router.get('/', function(req, res, next) {
    req.getConnection(function(error, conn) {
        
        conn.query("SELECT vehicles.name, vehicles.details, vehicles_models.model as model, vehicles_models.details as model_details, vehicles_models.cost " + 
                    "FROM vehicles INNER JOIN vehicles_models " + 
                    "ON vehicles.id_vehicle = vehicles_models.id_vehicle_model", function(err, rows, fields) {

            if (err) {
                req.flash('error', err)
                res.render('vehicle/list', {
                    title: 'Vehicle List', 
                    data: ''
                })
            } else {
                res.render('vehicle/list', {
                    title: 'Vehicle List', 
                    data: rows
                })
            }
        })
    })
})
 
// SHOW ADD 
router.get('/add', function(req, res, next){    
    res.render('vehicle/add', {
        title: 'Add New vehicle',
        name: '',
        details: '',
        model: '',
        model_details: '',
        cost: ''
    })
})
 
// ADD NEW x POST ACTION
router.post('/add', function(req, res, next){    
    req.assert('name', 'Name is required').notEmpty()           //Validate name
    req.assert('details', 'Details are required').notEmpty()   //Validate 
    req.assert('model', 'A valid model is required').notEmpty()   //Validate
    req.assert('model_details', 'Model details are required').notEmpty()   //Validate
    req.assert('cost', 'A valid cost is required').notEmpty()   //Validate 
    
 
    var errors = req.validationErrors()
    
    if( !errors ) {
        var vehicle = {
            name: req.sanitize('name').escape().trim(),
            details: req.sanitize('details').escape().trim(),
            model: req.sanitize('model').escape().trim(),
            model_details: req.sanitize('model_details').escape().trim(),
            cost: req.sanitize('cost').escape().trim()
        }
        
        req.getConnection(function(error, conn) {
            /*

                ///////////////////  Insert into multiple tables at once

            */
            conn.query('INSERT INTO vehicles SET ?', vehicle, function(err, result) {
                if (err) {
                    req.flash('error', err)
                    res.render('vehicle/add', {
                        title: 'Add New vehicle',
                        name: vehicle.name,
                        lastname: vehicle.lastname,
                        phone: vehicle.phone,
                        address: vehicle.address,
                        city: vehicle.city,
                        state: vehicle.lastname,
                        postal_code: vehicle.postal_code,
                        country: vehicle.country,
                        id_seller: vehicle.id_seller
                    })
                } else {                
                    req.flash('success', 'Data added successfully!')
                    
                    res.render('vehicle/add', {
                        title: 'Add New vehicle',
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
    else {   
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })                
        req.flash('error', error_msg)        
        
        res.render('vehicle/add', { 
            title: 'Add New Vehicle',
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
router.get('/edit/(:id_vehicle)', function(req, res, next){
    req.getConnection(function(error, conn) {
        conn.query("SELECT vehicles.name, vehicles.details, vehicles_models.model as model, vehicles_models.details as model_details, vehicles_models.cost " + 
                    "FROM vehicles INNER JOIN vehicles_models " + 
                    "ON vehicles.id_vehicle = vehicles_models.id_vehicle_model" +
                    "WHERE id_vehicle = " + req.params.id_vehicle, function(err, rows, fields) {
            if(err) throw err
            
            // if  not found 
            if (rows.length <= 0) {
                req.flash('error', 'Vehicle not found with id = ' + req.params.id_vehicle)
                res.redirect('/vehicle')
            }
            else { // if  found
                res.render("vehicle/edit", {
                    title: 'Edit vehicle', 
                    id_vehicle: rows[0].id_vehicle,
                    name: rows[0].name,
                    details: rows[0].details,
                    model: rows[0].model,
                    model_details: rows[0].model_details,
                    cost: rows[0].cost
                })
            }            
        })
    })
})
 
// EDIT USER POST ACTION
router.put('/edit/(:id_vehicle)', function(req, res, next) {
    req.assert('name', 'Name is required').notEmpty()           //Validate name
    req.assert('details', 'Details are required').notEmpty()   //Validate 
    req.assert('model', 'A valid model is required').notEmpty()   //Validate
    req.assert('model_details', 'Model details are required').notEmpty()   //Validate
    req.assert('cost', 'A valid cost is required').notEmpty()   //Validate 

    var errors = req.validationErrors()
    
    if( !errors ) {
        var vehicle = {
            name: req.sanitize('name').escape().trim(),
            details: req.sanitize('details').escape().trim(),
            model: req.sanitize('model').escape().trim(),
            model_details: req.sanitize('model_details').escape().trim(),
            cost: req.sanitize('cost').escape().trim()
        }
        
        /*

                ///////////////////  Update multiple tables at once

        */

        req.getConnection(function(error, conn) {
            conn.query('UPDATE vehicles SET ? WHERE id_vehicle = ' + req.params.id_vehicle, vehicle, function(err, result) {
                if (err) {
                    req.flash('error', err)
                    
                    res.render('vehicle/edit', {
                        title: 'Edit vehicle',
                        name: req.body.name,
                        details: req.body.details,
                        model: req.body.model,
                        model_details: req.body.model_details,
                        cost: req.body.cost
                    })
                } else {
                    req.flash('success', 'Data updated successfully!')
                    
                    res.render('vehicle/edit', {
                        title: 'Edit vehicle',
                        id_vehicle: req.params.id_vehicle,
                        name: req.body.name,
                        details: req.body.details,
                        model: req.body.model,
                        model_details: req.body.model_details,
                        cost: req.body.cost
                    })
                }
            })
        })
    }
    else { 
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)
        
        res.render('customer/edit', { 
            title: 'Edit customer',            
            id_vehicle: req.params.id_vehicle, 
            name: req.body.name,
            details: req.body.details,
            model: req.body.model,
            model_details: req.body.model_details,
            cost: req.body.cost
        })
    }
})
 
// DELETE USER

 /*

                ///////////////////  Delete - multiple tables at once

*/
router.delete('/delete/(:id_vehicle)', function(req, res, next) {
    var customer = { id: req.params.id_vehicle }
    
    req.getConnection(function(error, conn) {
        conn.query('DELETE FROM vehicles WHERE id_vehicle = ' + req.params.id_vehicle, customer, function(err, result) {
            if (err) {
                req.flash('error', err)
                res.redirect('/vehicles')
            } else {
                req.flash('success', 'vehicle deleted successfully! id = ' + req.params.id_vehicle)
                res.redirect('/vehicles')
            }
        })
    })
})
 
module.exports = router