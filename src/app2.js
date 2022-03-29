'use strict';

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

module.exports = (db) => {
    app.get('/health', (req, res) => res.send('Healthy'));
    
    app.get('/user/:id', jsonParser, (req, res) => {
    	db.all('SELECT * FROM user WHERE userID = ?', req.params.id, function (err, rows) {
                if (err) {
                    return res.send({
                        error_code: 'SERVER_ERROR',
                        message: err.message
                    });
                }

                res.send(rows);
            });
    
    })
    
    app.put('/user/:id', jsonParser, (req, res) => {
    	const firstname = req.body.firstname
    	const lastname = req.body.lastname
    	const bdate = req.body.bdate
    	const location = req.body.location
    	var values = [firstname,lastname,bdate,location,req.params.id];
    	
    	const result = db.run('update user set firstname = ?,lastname = ?,bdate = ?,location = ? where userID=?', values, function 	(err) {
            if (err) {
                return res.send({
                    error_code: 'SERVER_ERROR',
                    message: err.message
                });
            }

            db.all('SELECT * FROM user WHERE userID = ?', req.params.id, function (err, rows) {
                if (err) {
                    return res.send({
                        error_code: 'SERVER_ERROR',
                        message: err.message
                    });
                }

                res.send(rows);
            });
        });
    
    })

    
    app.delete('/user/:id', jsonParser, (req, res) => {
    	db.run(`DELETE FROM user WHERE userID=?`, req.params.id, function(err) {
	    	if (err) {	    	
		    	return res.send({
		    		error_code: 'SERVER_ERROR',
			       message: err.message
		    	});
	  	}
	  	res.send(`Row(s) deleted ${this.changes}`);
	});
    
    })
    
    app.post('/user', jsonParser, (req, res) => {
    	const firstname = req.body.firstname
    	const lastname = req.body.lastname
    	const bdate = req.body.bdate
    	const location = req.body.location
    	var values = [firstname,lastname,bdate,location];
    	
    	const result = db.run('INSERT INTO user(firstname,lastname,bdate,location) VALUES (?, ?, ?, ?)', values, function (err) {
            if (err) {
                return res.send({
                    error_code: 'SERVER_ERROR',
                    message: err.message
                });
            }

            db.all('SELECT * FROM user WHERE userID = ?', this.lastID, function (err, rows) {
                if (err) {
                    return res.send({
                        error_code: 'SERVER_ERROR',
                        message: err.message
                    });
                }

                res.send(rows);
            });
        });
    
    })

    

    return app;
};
