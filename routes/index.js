var express = require('express')
var router = express.Router();
var path = require('path');
const VIEWS = path.join(__dirname, 'views');
const TITLE = "AutoMGMT Nissan®"

//al iniciar la app se muestra el login
router.get('/', function(req, res) {
    res.render('login', { 
    	title: TITLE,
    	data: ''
	})
})

//al llenar el login se redirecciona al tipo de usuario
router.post('/session', function(req, res, next){
    req.session.usr = req.body.usr
    req.session.psw = req.body.psw
    req.getConnection(function(error, conn) {
        conn.query("SELECT username, password, typeUser, id_user FROM users WHERE username = '" + req.session.usr + "' AND password = '" + req.session.psw + "' ;", function(err, rows, fields) {
            if (err || rows.length <= 0) {
                res.render('login', {
                    title: TITLE, 
                    data: 'Datos incorrectos'
                })
            } else {
            	var u = rows[0].id_user
            	switch(rows[0].typeUser){
            		case 's':
                        //Query para catalogo de clientes
            			conn.query("SELECT customers.*, \n" + 
            							"sellers.id_seller as idseller, sellers.name as sellername, sellers.lastname as sellerlastname, sellers.id_user as usr, sellers.id_office_manager \n" + 
                                    "FROM sellers \n" + 
            						"INNER JOIN customers ON sellers.id_seller = customers.id_seller \n" +
            						"WHERE sellers.id_user = '" + u +"';", function(err, rows, fields) {
                            //Query para catálogo de vehiculos
                            conn.query("SELECT offices_managers.id_office_manager, " +
                                            "offices.id_office, offices.id_office_manager, "+
                                            "stocks.id_vehicle, stocks.id_office, " +
                                            "vehicles.*, vehicles_status.*, vehicles_models.*, " +
                                            "count(*) as cantidad "+
                                        "FROM offices_managers " +
                                        "INNER JOIN offices ON offices_managers.id_office_manager = offices.id_office_manager " +
                                        "INNER JOIN stocks ON offices.id_office = stocks.id_office " +
                                        "INNER JOIN vehicles ON stocks.id_vehicle = vehicles.id_vehicle "+
                                        "INNER JOIN vehicles_status ON vehicles.id_vehicle_status = vehicles_status.id_vehicle_status " +
                                        "INNER JOIN vehicles_models ON vehicles.id_vehicle_model = vehicles_models.id_vehicle_model "+
                                        "WHERE offices_managers.id_office_manager = '" + rows[0].id_office_manager + "' " +
                                        "GROUP BY vehicles_models.model " + 
                                        "ORDER BY vehicles_status.status DESC;", function(err, rows2, fields) {
                                
                                if (rows.length === 0){
                                    conn.query("SELECT sellers.name, sellers.lastname, sellers.id_seller, sellers.id_office_manager from sellers WHERE sellers.id_user = '" + u +"';", function (err, rows, fields){
                                        res.render('seller/index', {
                                            title: TITLE,
                                            data: rows,
                                            sellerfullname: rows[0].name + " " + rows[0].lastname,
                                            id_seller: rows[0].id_seller,
                                            stock: rows2
                                        })
                                    })
                                } else {
    								res.render('seller/index', {
    									title: TITLE,
    		                			data: rows,
                                        sellerfullname: rows[0].sellername + " " + rows[0].sellerlastname,
                                        id_seller: rows[0].id_seller,
                                        stock: rows2
    		                		})
    		                	}
                            })
		                })
            		break;
                    case 'g':
                        conn.query("SELECT globals_managers.* FROM globals_managers WHERE globals_managers.id_user = '" + u +"';", function (err, rows, fields){
                            res.render('global_manager/index', {
                                title: TITLE,
                                data: rows,
                                globalmanfullname: rows[0].name + " " + rows[0].lastname,
                                id_global_manager: rows[0].id_global_manager
                            })
                        })
                    break;
            	}

            }
        })
    })
})
/** 
 * We assign app object to module.exports
 * 
 * module.exports exposes the app object as a module
 * 
 * module.exports should be used to return the object 
 * when this file is required in another module like app.js
 */ 
module.exports = router;