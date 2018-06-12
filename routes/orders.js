var express = require('express')
var router = express.Router();
const TITLE = "AutoMGMT Nissan®";
var moment = require('moment');
 
var path = require('path');
const VIEWS = path.join(__dirname, 'views');

// SHOW LIST 
router.get('/(:id_customer)/(:id_office)/(:id_seller)', function(req, res, next) {    
    req.getConnection(function(error, conn) {
        conn.query("SELECT orders_details.id_order, orders_details.id_vehicle, " +
                    "orders.amount, orders.date_at, orders_types.order_type, "+
                    "payments.deposit_amount, payments.rest_amount, "+
                    "payments_status.payment_status, payments_status.details, "+
                    "vehicles.name "+
                    "FROM orders_details "+
                    "INNER JOIN orders_types ON orders_details.id_order_type = orders_types.id_order_type "+
                    "INNER JOIN orders ON orders.id_order = orders_details.id_order "+
                    "INNER JOIN payments ON orders.id_order = payments.id_order "+
                    "INNER JOIN payments_status ON payments.id_payment_status = payments_status.id_payment_status "+
                    "INNER JOIN vehicles ON orders_details.id_vehicle = vehicles.id_vehicle "+
                    "INNER JOIN customers ON orders_details.id_customer = customers.id_customer "+
                    "WHERE orders_details.id_customer = ? "+ 
                    "ORDER BY orders_details.id_order, payments.rest_amount ASC; ", req.params.id_customer, function(err, rows, fields) {
            console.log(rows)
            if (err || rows.length === 0) {
                req.flash('error', err)
                res.render('order/list', {
                    title: 'Historial de pagos', 
                    data: '',
                    id_office: req.params.id_office,
                    id_customer: req.params.id_customer,
                    id_seller: req.params.id_seller,
                    comments: '',
                })
            } else {
                res.render('order/list', {
                    title: 'Historial de pagos', 
                    data: rows,
                    id_office: req.params.id_office,
                    id_customer: req.params.id_customer,
                    id_seller: req.params.id_seller,
                    comments: rows[0].coments
                })
            }
        })
    })
})
 
// SHOW ADD x FORM 
router.get('/a/add/(:id_office)/(:id_customer)/(:id_seller)', function(req, res, next){  
    
    req.getConnection(function(error, conn) {
        conn.query("SELECT vehicles.id_vehicle, vehicles.name, vehicles_models.cost " +
                    "FROM stocks "+
                    "INNER JOIN vehicles ON stocks.id_vehicle = vehicles.id_vehicle "+
                    "INNER JOIN vehicles_models ON vehicles.id_vehicle_model = vehicles_models.id_vehicle_model "+ 
                    "INNER JOIN offices ON offices.id_office = stocks.id_office "+
                    "WHERE stocks.id_office = ? AND stocks.cantidad > 0 "+
                    "GROUP BY stocks.id_vehicle " +
                    "ORDER BY vehicles.name DESC;", req.params.id_office, function(err, rows, fields) {
            res.render('order/add', {
                vehiculos: rows,
                id_customer: req.params.id_customer,
                id_seller: req.params.id_seller,
                id_office: req.id_office
            })
        })
    }) 
})

// ADD NEW x POST ACTION
router.post('/b/add/(:id_vehicle)/(:id_customer)/(:id_seller)/(:id_office)', function(req, res, next){    
    var time = moment();
    var fecha = time.format('DD[/]MM[/]YYYY h:mm:ss a');
    var order = {
        date_at: fecha,
        amount: req.sanitize('costo').escape().trim(),
        coments: req.sanitize('comentarios').escape().trim()
    }
    var idorden = ""

    req.getConnection(function(error, conn) {
        conn.query('INSERT INTO orders SET ?', order, function(err, result) {
            idorden = result.insertId;
        
            var order_details = {
                id_order: idorden,
                id_vehicle: req.params.id_vehicle,
                id_customer: req.params.id_customer,
                id_seller: req.params.id_seller,
                id_order_type: req.body.order_type
            }

            conn.query('INSERT INTO orders_details SET ?', order_details, function(err2, result2) {

                var dep = req.sanitize('deposito_inicial').escape().trim()

                var payment = {
                    deposit_amount: req.sanitize('deposito_inicial').escape().trim(),
                    rest_amount: (order.amount - dep),
                    id_order: idorden,
                    id_payment_status: 3
                }

                if(payment.rest_amount === 0){
                    payment.id_payment_status = 1
                }

                conn.query('INSERT INTO payments SET ?', payment, function(err3, result3) {
                    conn.query("UPDATE stocks SET cantidad = cantidad-1 " + 
                                "WHERE id_vehicle = '"+ req.params.id_vehicle + "' AND id_office = '"+ req.params.id_office +"' " + 
                                "AND cantidad > 0 LIMIT 1;", function(err4, result4){
                        console.log(result4)
                        res.render('office/success')
                    })
                })
            })
        })
    })
})
 
// SHOW EDIT FORM
router.get('/edit/(:id_order)', function(req, res, next){
    req.getConnection(function(error, conn) {
        conn.query('SELECT * FROM globals_managers WHERE id_order = ' + req.params.id_order, function(err, rows, fields) {
            if(err) throw err
            
            // if user not found
            if (rows.length <= 0) {
                req.flash('error', 'User not found with id = ' + req.params.id_order)
                res.redirect('/order')
            }
            else { // if user found
                res.render("order/edit", {
                    title: 'Edit Global manager', 
                    id_order: rows[0].id_order,
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
router.put('/edit/(:id_order)', function(req, res, next) {
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
        
        var order = {
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
            conn.query('UPDATE globals_managers SET ? WHERE id_order = ' + req.params.id_order, order, function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash('error', err)
                    
                    res.render('order/edit', {
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
                    
                    res.render('order/edit', {
                        title: 'Edit Global manager',
                        id_order: req.params.id_order,
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
        
        res.render('order/edit', { 
            title: 'Edit Global manager',            
            id_order: req.params.id_order, 
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
router.delete('/delete/(:id_order)', function(req, res, next) {
    var gl = { id: req.params.id }
    
    req.getConnection(function(error, conn) {
        conn.query('DELETE FROM globals_managers WHERE id_order = ' + req.params.id_order, gl, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                // redirect to users list page
                res.redirect('/orders')
            } else {
                req.flash('success', 'global manager deleted successfully! id = ' + req.params.id_order)
                // redirect to gl list page
                res.redirect('/orders')
            }
        })
    })
})
 
module.exports = router