"use strict";
require('dotenv').config();
const express = require('express');
const DB = require('./db');
const config = require('./config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const async = require('async');
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const cors = require("cors");

const db = new DB("sqlitedb")
const app = express();
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// CORS middleware
app.use(cors());


router.post('/register', function(req, res) {
  db.insert([
    req.body.name,
    req.body.email,
    bcrypt.hashSync(req.body.password, 8)
  ],
  function (err) {
    if (err) return res.status(500).send("There was a problem registering the user.")
    db.selectByEmail(req.body.email, (err,user) => {
      if (err) return res.status(500).send("There was a problem getting user")
      let token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // expires in 24 hours
      });
      res.status(200).send({ auth: true, token: token, user: user });
    }); 
  }); 
});

router.post('/register-admin', function(req, res) {
  db.insertAdmin([
    req.body.name,
    req.body.email,
    bcrypt.hashSync(req.body.password, 8),
    1
  ],
  function (err) {
    if (err) return res.status(500).send("There was a problem registering the user.")
    db.selectByEmail(req.body.email, (err,user) => {
      if (err) return res.status(500).send("There was a problem getting user")
      let token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // expires in 24 hours
      });
      res.status(200).send({ auth: true, token: token, user: user });
    }); 
  }); 
});

router.get('/me', function(req, res) {
  let token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    
    res.status(200).send(decoded);
  });
});

router.post('/login', (req, res) => {
  db.selectByEmail(req.body.email, (err, user) => {
    if (err) return res.status(500).send('Error on the server.');
    if (!user) return res.status(404).send('No user found.');
    let passwordIsValid = bcrypt.compareSync(req.body.password, user.user_pass);
    if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
    let token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400 // expires in 24 hours
    });
    res.status(200).send({ auth: true, token: token, user: user });
  });
})

router.post('/get-collections', (req, res) => {
  db.selectCollections(req.body.id, (err, coll) => {
    if (err) return res.status(500).send('Error on the server.');
    res.status(200).send(coll)
  })
})

router.post('/get-items', (req, res) => {
  db.selectItems(req.body.id, (err, items) => {
    if (err) return res.status(500).send('Error on the server.')
    res.status(200).send(items)
  })
})

router.post('/insert-collection', (req, res) => {
  db.insertCollection([
    req.body.name,
    req.body.total,
    req.body.owner
  ],
  function (err) {
    if (err) return res.status(500).send("There was a problem registering the collection.");
  })
  res.status(200).send('Collection successfuly inserted')
})

router.post('/insert-item', (req, res) => {
  db.insertItem([
    req.body.order,
    req.body.name,
    req.body.collection
  ],
  function (err) {
    if (err) return res.status(500).send("There was a problem registering the item.")
  })
  res.status(200).send('Item successfuly inserted')
})

router.delete('/delete-item', (req, res) => {
  db.deleteItem(req.body.id, function (err) {
    if (err) return res.status(500).send("There was a problem deleting the item.")
  })
  res.status(200).send('Item successfuly deleted')
})

router.post('/get-collection', (req, res) => {
  db.selectCollection(req.body.id, function (err,collection) {
    if (err) return res.status(500).send("There was a problem getting the item");
    res.status(200).send(collection)
  })
})

router.delete('/delete-collection', (req, res) => {
  db.deleteCollection(req.body.id, function (err) {
    if (err) return res.status(500).send("There was a problem deleting the collection.")
  })
  res.status(200).send('Item successfuly deleted')
})

router.put('/update-status', (req, res) => {
  db.updateStatus([req.body.status, req.body.id], (err) => {
    if (err) return res.status(500).send("There was a problem updating the collection status.")
  })
  res.status(200).send('Item successfuly updated')
})

router.post('/forgot', (req, res) => {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, (err, buf) => {
        var token = buf.toString('hex');
        done(err, token);
      })
    },
    function(token, done) {
      db.selectByEmail(req.body.email, (err, user) => {
        if (err) return res.status(500).send('Error on the server.');
        if (!user) return res.status(404).send('No user found.');

        db.updateToken([token, req.body.email], (err) => {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        host: 'smtp.mail.yahoo.com',
        port: 587,
        service: 'yahoo',
        auth: {
          user: 'deividamadeus@yahoo.com',
          pass: 'qfedceujtlxkccew'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'deividamadeus@yahoo.com',
        subject: 'Node.js Password Reset',
        text: `
        You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link or paste this into your browser to complete the process:\n\n
        http://localhost:8080/reset/${token} \n\n
        If you did not request this, please ignore this email and your password will remain unchanged.`
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        done(err, user);
      })
    }
  ], function(err, user) {
    if (err) return res.status(500).send(err);
    res.status(200).send(`Um email foi enviado para '${user.email}' com mais instruções.`)
  });
});

router.post('/reset/:token', (req, res) => {
  async.waterfall([
    function(done) {
      db.selectToken(req.params.token, (err, user) => {
        if (err) return res.status(500).send('Error on the server.');
        if (!user) return res.status(404).send('No token found.');
        done(err, user);
      });
    },
    function(user, done) {
      db.updatePass([
        bcrypt.hashSync(req.body.password, 8),
        user.id
      ], (err) => {
        if (err) return res.status(500).send('Error updating password');
        done(err, user)
      })
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        host: 'smtp.mail.yahoo.com',
        port: 587,
        service: 'yahoo',
        auth: {
          user: 'deividamadeus@yahoo.com',
          pass: 'qfedceujtlxkccew'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'deividamadeus@yahoo.com',
        subject: 'Sua senha foi alterada',
        text: `This is a confirmation that the password for your account ${user.email} has just been changed.`
      }
      smtpTransport.sendMail(mailOptions, function(err) {
        done(err, user);
      })
    }
  ], (err, user) => {
    if (err) return res.status(500).send(err);
    res.status(200).send(`Um email foi enviado para '${user.email}'.`)
  })
})

router.post('/update-profile', (req, res) => {
  db.updateProfile([req.body.name, req.body.email, req.body.id], (err) => {
    if (err) return res.status(500).send('Error on the server.');
    res.status(200).send('Perfil atualizado')
  })
})

app.use(router)

let port = process.env.PORT || 3000;

let server = app.listen(port, function() {
  console.log('Express server listening on port ' + port)
});
