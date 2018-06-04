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
    req.getConnection(function(error, conn) {
        conn.query("SELECT username, password, typeUser, id_user FROM users WHERE username = '" + req.body.usr + "' AND password = '" + req.body.psw + "' ;", function(err, rows, fields) {
            if (err || rows.length <= 0) {
                res.render('login', {
                    title: TITLE, 
                    data: 'Datos incorrectos'
                })
            } else {
            	var u = rows[0].id_user
            	switch(rows[0].typeUser){
            		case 's':
            			conn.query("SELECT customers.*, \n" + 
            							"sellers.id_seller as idseller, sellers.name as sellername, sellers.lastname as sellerlastname, sellers.id_user as usr FROM sellers \n" + 
            						"INNER JOIN customers ON sellers.id_seller = customers.id_seller \n" +
            						"WHERE sellers.id_user = '" + u +"';", function(err, rows, fields) {
		                	if (err || rows.length <= 0){
								res.render('seller/index', {
									title: TITLE,
		                			data: ''
		                		})
		                	} else {
								res.render('seller/index', {
									title: TITLE,
		                			data: rows,
                                    sellerfullname: rows[0].sellername + " " + rows[0].sellerlastname,
                                    idseller: rows[0].idseller,
                                    id_customer: rows[0].id_customer
		                		})
		                	}
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