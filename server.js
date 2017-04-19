'use strict';

const express = require('express');
const app = express();
const users = require('./routes/users');

app.disable('x-powered-by');

const bodyParser = require('body-parser');
const morgan = require('morgan');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(users);

const tracks = require('./routes/tracks');

app.use(tracks);

app.use((_req, res) => {
  res.sendStatus(404);
});

app.use((err, _req, res, _next) => {
  if (err.status) {
    return res
      .status(err.status)
      .set('Content-Type', 'text/plain')
      .send(err.message);
  }

  console.error(err.stack);
  res.sendStatus(500);
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log('Listening on port', port);
});
