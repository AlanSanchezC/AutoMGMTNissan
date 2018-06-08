var express = require('express')
var router = express.Router();
//var app = express()
 
var path = require('path');
const VIEWS = path.join(__dirname, 'views');


// SHOW LIST
router.get('/(:id_office_manager)', function(req, res, next) {
    req.getConnection(function(error, conn) {
        conn.query("SELECT offices_managers.id_office_manager, " +
                        "offices.id_office, offices.id_office_manager, "+
                        "stocks.id_vehicle, stocks.id_office, " +
                        "vehicles.*, vehicles_status.*, vehicles_models.*" +
                        "count(*) as cantidad"+
                    "FROM offices_managers" +
                    "INNER JOIN offices ON offices_managers.id_office_manager = offices.id_office_manager " +
                    "INNER JOIN stocks ON offices.id_office = stocks.id_office " +
                    "INNER JOIN vehicles ON stocks.id_vehicle = vehicles.id_vehicle "+
                    "INNER JOIN vehicles_status ON vehicles.id_vehicle_status = vehicles_status.id_vehicle_status " +
                    "INNER JOIN vehicles_models ON vehicles.id_vehicle_model = vehicles_models.id_vehicle_model "+
                    "WHERE offices_managers.id_office_manager = " + req.params.id_office_manager + ";", function(err, rows, fields) {
            if (err) {
                req.flash('error', err)
                res.render('vehicle/list', {
                    title: 'Vehicle List', 
                    stock: ''
                })
            } else {
                
                console.log(JSON.stringify(rows))
                res.redirect('/session')
            }
        })
    })
})
 
// SHOW ADD customer FORM user
router.get('/s/add', function(req, res, next){    
    res.render('vehicle/add', {
        modelo: '',
        detalles: '',
        costo: '',
        cantidad: ''
    })
})
 
// ADD NEW customer POST ACTION
router.post('/s/add', function(req, res, next){    
    req.assert('modelo', 'Se requiere un modelo').notEmpty()           //Validate name
    req.assert('detalles', 'Detalles requeridos').notEmpty()   //Validate lastname
    req.assert('costo', 'Costo requerido').notEmpty()   //Validate
    req.assert('cantidad', 'Cantidad requerida').notEmpty()   //Validate
    
    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
        var vehicle_model = {
            model: unescape(req.body.modelo),
            details: req.sanitize('detalles').escape().trim(),
            cost: req.sanitize('costo').escape().trim()
        }
        req.getConnection(function(error, conn) {
            conn.query('INSERT INTO vehicles_models SET ?', vehicle_model, function(err, result) {
                var vehicle = {
                        name: vehicle_model.model,
                        details: vehicle_model.details,
                        id_vehicle_status: 1,
                        id_vehicle_model: result.insertId,
                        cantidadTotal: req.sanitize('cantidad').escape().trim()
                }
                conn.query('INSERT INTO vehicles SET ?', vehicle, function(err2, result2) {
                    if (err || err2) {
                        req.flash('error', err)
                        
                        res.render('vehicle/add', {
                            modelo: vehicle_model.model,
                            detalles: vehicle_model.details,
                            costo: vehicle_model.cost,
                            cantidadTotal: vehicle.cantidadTotal
                        })
                    } else {                
                        req.flash('success', 'Vehículo agregado exitosamente!')
                        
                        res.render('vehicle/add', {
                            modelo: '',
                            detalles: '',
                            costo: '',
                            cantidad: ''
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
        res.render('vehicle/add', { 
            model: '',
            detalles: '',
            costo: '',
            cantidad: ''
        })
    }
})
 
// SHOW EDIT USER FORM
router.get('/edit/(:id_vehicle_model)', function(req, res, next){
    req.getConnection(function(error, conn) {
        conn.query("SELECT vehicles.id_vehicle, vehicles.cantidadTotal, vehicles_models.model as model, vehicles_models.details as model_details, vehicles_models.cost, vehicles.id_vehicle_model " + 
                    "FROM vehicles INNER JOIN vehicles_models " + 
                    "ON vehicles.id_vehicle_model = vehicles_models.id_vehicle_model " +
                    "WHERE vehicles.id_vehicle_model = " + req.params.id_vehicle_model, function(err, rows, fields) {
            if(err) throw err
            
            // if  not found 
            if (rows.length <= 0) {
                req.flash('error', 'Vehicle not found with id = ' + req.params.id_vehicle)
                res.redirect('/vehicle')
            }
            else { // if  found
                res.render("vehicle/edit", {
                    title: 'Edit vehicle', 
                    id_vehicle_model: req.params.id_vehicle_model,
                    model: rows[0].model,
                    model_details: rows[0].model_details,
                    cost: rows[0].cost,
                    cantidadTotal: rows[0].cantidadTotal
                })
            }            
        })
    })
})
 
// EDIT USER POST ACTION
router.put('/edit/(:id_vehicle_model)', function(req, res, next) {
    req.assert('model', 'Modelo requerido').notEmpty()   //Validate
    req.assert('model_details', 'Descripción requerida').notEmpty()   //Validate
    req.assert('cost', 'Costo requerido').notEmpty()   //Validate 
    req.assert('cantidadTotal', 'Cantidad requerida').notEmpty()   //Validate 

    var errors = req.validationErrors()
    
    if( !errors ) {
        var vehicle_model = {
            model: unescape(req.body.model),
            details: req.sanitize('model_details').escape().trim(),
            cost: req.sanitize('cost').escape().trim()
        }
        

        req.getConnection(function(error, conn) {
            conn.query('UPDATE vehicles_models SET ? WHERE id_vehicle_model = ' + req.params.id_vehicle_model, vehicle_model, function(err, result) {
                var vehicle = {
                        name: vehicle_model.model,
                        details: vehicle_model.details,
                        id_vehicle_status: 1,
                        id_vehicle_model: req.params.id_vehicle_model,
                        cantidadTotal: req.sanitize('cantidadTotal').escape().trim()
                }
                console.log(vehicle)
                conn.query('UPDATE vehicles SET ? WHERE id_vehicle_model = ' + req.params.id_vehicle_model, vehicle, function(err2, result2) {
                    if (err) {
                        req.flash('error', err)
                        
                        res.render('vehicle/edit', {
                            title: 'Edit vehicle',
                            id_vehicle_model: req.params.id_vehicle_model,
                            model: req.body.model,
                            model_details: req.body.model_details,
                            cost: req.body.cost,
                            cantidadTotal: req.body.cantidadTotal
                        })
                    } else {
                        req.flash('success', 'Data updated successfully!')
                        
                        res.render('vehicle/edit', {
                            title: 'Edit vehicle',
                            id_vehicle_model: req.params.id_vehicle_model,
                            model: req.body.model,
                            model_details: req.body.model_details,
                            cost: req.body.cost,
                            cantidadTotal: req.body.cantidadTotal
                        })
                    }
                })
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