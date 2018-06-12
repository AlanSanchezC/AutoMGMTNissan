var express = require('express')
var router = express.Router();
//var app = express()
 
var path = require('path');
const VIEWS = path.join(__dirname, 'views');

router.get('/p/add/(:id_order)/(:x)', function(req, res, next){
	console.log(req.params.id_order)
	req.getConnection(function(error, conn) {
		res.render('payment/add', {
			deposit_amount: '',
			id_order: req.params.id_order
		})	
    })
})

router.post('/p/add/(:id_order)', function(req, res, next){
	req.getConnection(function(error, conn) {
		var deposito = req.body.deposit_amount;
		

		conn.query("SELECT rest_amount FROM payments WHERE id_order = ? " + 
					"ORDER BY rest_amount ASC LIMIT 1;", req.params.id_order, function(err, rows, fields) {
			console.log(rows)
			var payment = {
				deposit_amount: deposito,
				rest_amount: rows[0].rest_amount - deposito,
				id_order: req.params.id_order,
				id_payment_status: 3
			}

			if (payment.rest_amount <= 0)
				payment.id_payment_status = 1;
			
			console.log(payment)
			conn.query("INSERT INTO payments SET ? ;", payment,function(err, result) {
				res.render('office/success')
        	})
        })

    })
})

module.exports = router