var express = require('express')
var router = express.Router();
//var app = express()
var moment = require('moment');

var path = require('path');
const VIEWS = path.join(__dirname, 'views');
const TITLE = "AutoMGMT Nissan®";


// SHOW LIST OF USERS
router.get('/(:id_office)', function(req, res, next) {
    req.getConnection(function(error, conn) {
        conn.query("SELECT sum(stocks.cantidad) as cant, offices.*, vehicles.id_vehicle, vehicles.id_vehicle_model, vehicles_models.* " +
                    "FROM stocks " +
                    "INNER JOIN vehicles ON stocks.id_vehicle = vehicles.id_vehicle " +
                    "INNER JOIN vehicles_models ON vehicles.id_vehicle_model = vehicles_models.id_vehicle_model " +
                    "INNER JOIN offices ON offices.id_office = stocks.id_office " +
                    "WHERE stocks.id_office = ? " + 
                    "GROUP BY stocks.id_vehicle "+
                    "ORDER BY cant DESC;", req.params.id_office, function(err, rows, fields) {
            conn.query("SELECT vehicles.id_vehicle, vehicles.id_vehicle_model, vehicles.cantidadTotal, vehicles_models.id_vehicle_model, vehicles_models.model, vehicles_models.cost, vehicles_models.details " +
                        "from vehicles "+
                        "INNER JOIN vehicles_models ON vehicles_models.id_vehicle_model = vehicles.id_vehicle_model " +
                        "GROUP BY vehicles.id_vehicle "+
                        "ORDER BY vehicles.cantidadTotal, vehicles_models.model DESC;",function(err2, rows2, fields2) {
                if (err || rows.length === 0) {
                    req.flash('error', err)
                    res.render('stock/list', {
                        title: 'Customer List', 
                        data: '',
                        stockGlobal: rows2
                    })
                } else {
                    res.render('stock/list', {
                        title: 'Customer List', 
                        data: rows,
                        stockGlobal: rows2,
                        id_stock: rows[0].id_stock,
                        id_vehicle_model: rows[0].id_vehicle_model
                    })
                }
            })
        })
    })
})

 
// SHOW ADD customer FORM user
router.get('/add/(:id_vehicle)/(:cantidadTotal)/(:id_office)', function(req, res, next){    
    req.getConnection(function(error, conn){
        conn.query("SELECT IFNULL(sum(stocks.cantidad),0) as enSucursales, " +
                         "IFNULL(vehicles.name, (SELECT vehicles_models.model from vehicles_models " +
                                               "INNER JOIN vehicles ON vehicles_models.id_vehicle_model = vehicles.id_vehicle_model " +
                                                "WHERE vehicles.id_vehicle = ? ) "+ 
                                ") as name, " +
                         "IFNULL(vehicles.id_vehicle, ? ) as id_vehicle " +
                    "FROM stocks INNER JOIN vehicles ON vehicles.id_vehicle = stocks.id_vehicle " +
                    "WHERE stocks.id_vehicle = ?;", [req.params.id_vehicle, req.params.id_vehicle, req.params.id_vehicle ], function(err, cantidadEnSucursales, fields) {
            
            res.render('stock/add', {
                modelo: cantidadEnSucursales[0].name,
                maximo: (req.params.cantidadTotal - cantidadEnSucursales[0].enSucursales),
                cantidad: '',
                id_vehicle: req.params.id_vehicle,
                cantidadTotal: req.params.cantidadTotal,
                id_office: req.params.id_office
            })
        })
    })
        
})

// ADD NEW customer POST ACTION
router.post('/add/(:id_vehicle)/(:cantidadTotal)/(:id_office)', function(req, res, next){    
    req.assert('cantidad', 'Cantidad requerida').notEmpty()   //Validate
    
    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
        var cantidadStock = req.sanitize('cantidad').escape().trim()

        var vehiculoActualizado = {
            cantidadTotal: (req.params.cantidadTotal - cantidadStock)
        }

        req.getConnection(function(error, conn) {
            conn.query('UPDATE vehicles SET ? WHERE id_vehicle = ' + req.params.id_vehicle, vehiculoActualizado, function(err, result) {
                console.log("Total actualizado")
                var time = moment();
                var fecha = time.format('DD[/]MM[/]YYYY h:mm:ss a');
                
                var stockNuevo = {
                    id_office: req.params.id_office,
                    id_vehicle: req.params.id_vehicle,
                    cantidad: cantidadStock,
                    data_at: fecha
                }
                console.log(stockNuevo)
                conn.query('INSERT INTO stocks SET ?', stockNuevo, function(err2, result2) {
                    if (err || err2) {
                        req.flash('error', err)
                    } else {                
                        res.render('office/success')
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
        
        
        res.render('stocks/add', { 
            model: '',
            detalles: '',
            costo: '',
            cantidad: ''
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
            model: unescape(req.body.model),
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