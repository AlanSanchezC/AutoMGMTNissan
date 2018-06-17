var express = require('express')
var router = express.Router();
var path = require('path');
const VIEWS = path.join(__dirname, 'views');
const TITLE = "AutoMGMT Nissan"

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
                    /*
                            Vendedores
                    */
                        //Query para catalogo de clientes
            			conn.query("SELECT customers.*, \n" + 
            							"sellers.id_seller as idseller, sellers.name as sellername, sellers.lastname as sellerlastname, sellers.id_user as usr, sellers.id_office_manager, sellers.country \n" + 
                                    "FROM sellers \n" + 
            						"INNER JOIN customers ON sellers.id_seller = customers.id_seller \n" +
            						"WHERE sellers.id_user = ? " +
                                    "ORDER BY customers.name ASC;", u, function(err, rows, fields) {
                            //Query para todas las oficinas del área
                            conn.query("SELECT id_office, name_office, city, state FROM offices " + 
                                        "WHERE country = ? ", rows[0].country, function(err2, rows2, fields2) {
                                //Query para obtener los datos de la oficina a cargo
                                conn.query("SELECT offices.id_office, offices.name_office, sellers.name " +
                                            "FROM sellers " +
                                            "INNER JOIN offices_managers ON sellers.id_office_manager = offices_managers.id_office_manager " +
                                            "INNER JOIN offices ON offices_managers.id_office_manager = offices.id_office_manager " +
                                            "WHERE sellers.id_seller = ? ;", rows[0].idseller, function(err3, rows3, fields3){
                                    if (rows.length === 0){
                                        conn.query("SELECT sellers.name, sellers.lastname, sellers.id_seller, sellers.id_office_manager from sellers WHERE sellers.id_user = '" + u +"';", function (err4, rows4, fields4){
                                            res.render('seller/index', {
                                                title: TITLE,
                                                data: rows3,
                                                sellerfullname: rows[0].name + " " + rows[0].lastname,
                                                id_seller: rows[0].id_seller,
                                                sucursales: rows2,
                                                nombre_sucursal: rows3[0].name_office,
                                                id_office: rows3[0].id_office,
                                                cmd: ''
                                            })
                                        })
                                    } else {
                                        res.render('seller/index', {
                                            title: TITLE,
                                            data: rows,
                                            sellerfullname: rows[0].sellername + " " + rows[0].sellerlastname,
                                            id_seller: rows[0].id_seller,
                                            sucursales: rows2,
                                            nombre_sucursal: rows3[0].name_office,
                                            id_office: rows3[0].id_office,
                                            cmd: ''
                                        })
                                    }


                                })
                                    
                            })
		                })
            		break;
                    case 'o':
                    /*
                            Gerentes de sucursal
                    */
                        conn.query("SELECT offices_managers.*, offices.id_office, offices.id_office_manager " +
                                    "FROM offices_managers " +
                                    "INNER JOIN offices ON offices.id_office_manager = offices_managers.id_office_manager "+
                                    "WHERE offices_managers.id_user = ?", u, function(err, rows, fields){
                            if (rows.length === 0) {
                                    req.flash('error', err)
                                    res.render('office_manager/index', {
                                        title: TITLE, 
                                        stock: '',
                                        officemanfullname: '',
                                        id_office: '',
                                        id_office_manager: ''
                                    })
                            } else {
                                conn.query("SELECT sum(stocks.cantidad) as cantidadStock, stocks.*, offices.id_office, vehicles.id_vehicle, vehicles.id_vehicle_model, vehicles_models.* " +
                                            "FROM stocks " +
                                            "INNER JOIN vehicles ON stocks.id_vehicle = vehicles.id_vehicle " +
                                            "INNER JOIN vehicles_models ON vehicles.id_vehicle_model = vehicles_models.id_vehicle_model " +
                                            "INNER JOIN offices ON stocks.id_office = offices.id_office "+
                                            "WHERE stocks.id_office = ? " + 
                                            "GROUP BY vehicles_models.id_vehicle_model "+
                                            "HAVING cantidadStock > 0 "+
                                            "ORDER BY cantidadStock DESC, vehicles_models.model ;", rows[0].id_office ,function(err2, rows2, fields) {
                                    if (err2 || rows2 === 0) {
                                        res.render('office_manager/index', {
                                            title: TITLE, 
                                            stock: '',
                                            officemanfullname: rows[0].name + " " + rows[0].lastname,
                                            id_office_manager: rows[0].id_office_manager,
                                            id_office: rows[0].id_office
                                        })
                                    } else {
                                        res.render('office_manager/index', {
                                            title: TITLE, 
                                            stock: rows2,
                                            officemanfullname: rows[0].name + " " + rows[0].lastname,
                                            id_office_manager: rows[0].id_office_manager,
                                            id_office: rows[0].id_office
                                        })
                                    }
                                })
                            }
                        })
                    break;
                    case 'g':
                    /*
                            Gerentes globales
                    */
                        conn.query("SELECT globals_managers.* FROM globals_managers WHERE globals_managers.id_user = ? ;", u , function (err, rows, fields){
                            conn.query("SELECT offices.id_office, offices.name_office, offices.phone as Ophone, offices.address as Oaddress, offices.city as Ocity, offices.state as Ostate, offices.postal_code as Opc, offices_managers.* " +
                                        "FROM offices "+
                                        "INNER JOIN offices_managers ON offices.id_office_manager = offices_managers.id_office_manager " +
                                        "WHERE offices.id_global_manager = ? " +
                                        "ORDER BY offices.state DESC;", rows[0].id_global_manager, function(err, rows2, fields) {

                                
                                conn.query("SELECT vehicles.id_vehicle, vehicles.cantidadTotal, vehicles_models.model, vehicles_models.cost, vehicles_models.details, vehicles_models.id_vehicle_model " +
                                            "from vehicles "+
                                            "INNER JOIN vehicles_models ON vehicles_models.id_vehicle_model = vehicles.id_vehicle_model " +
                                            "GROUP BY vehicles.id_vehicle "+
                                            "ORDER BY vehicles.cantidadTotal DESC, vehicles_models.model ;", rows[0].id_global_manager ,function (err, rows3, fields){
                                    if(rows.length === 0){
                                        res.render('',{
                                            title: TITLE,
                                            stockGlobal: rows3,
                                            globalmanfullname: rows[0].name + " " + rows[0].lastname,
                                            id_global_manager: rows[0].id_global_manager
                                        })
                                    } else {
                                        console.log("aqui")
                                        console.log(rows3)
                                        res.render('global_manager/index', {
                                            title: TITLE,
                                            data: rows2,
                                            stockGlobal: rows3,
                                            globalmanfullname: rows[0].name + " " + rows[0].lastname,
                                            id_global_manager: rows[0].id_global_manager,
                                            state: rows2[0].Ostate
                                        })
                                    }
                                })
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