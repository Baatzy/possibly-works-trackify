'use strict';

const bcrypt = require('bcrypt-as-promised');
const express = require('express');
const knex = require('../knex');

const router = express.Router();

router.post('/users', (req, res, next) => {
  bcrypt.hash(req.body.password, 12)
    .then((hashed_password) => {
      return knex('users').insert({
        email: req.body.email,
        hashed_password: hashed_password
      }, '*');
    })
    .then((users) => {
      const user = users[0];

      delete user.hashed_password;

      res.send(user);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
