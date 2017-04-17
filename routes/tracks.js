'use strict';

const express = require('express');
const knex = require('../knex');

const router = express.Router();

router.get('/tracks', (_req, res, next) => {
  knex('tracks')
    .orderBy('title')
    .then((tracks) => {
      res.send(tracks);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/tracks/:id', (req, res, next) => {
    knex('tracks')
    .where('id', req.params.id)
    .first()
    .then((track) => {
      if (!track) {
        throw {
          status: 404,
          message: 'Not Found'
        };
      }

      res.send(track);
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/tracks', (req, res, next) => {
  const { title, artist, likes } = req.body;

  if (!title || !title.trim()) {
    return next({
      status: 400,
      message: 'Title must not be blank'
    });
  }

  if (!artist || !artist.trim()) {
    return next({
      status: 400,
      message: 'Artist must not be blank'
    });
  }

  if (!Number.isInteger(likes)) {
    return next({
      status: 400,
      message: 'Likes must be an integer'
    });
  }

  const insertTrack = { title, artist, likes };

  knex('tracks')
    .insert(insertTrack, '*')
    .then((rows) => {
      const track = rows[0];

      res.send(track);
    })
    .catch((err) => {
      next(err);
    });
});

router.patch('/tracks/:id', (req, res, next) => {
  knex('tracks')
    .where('id', req.params.id)
    .first()
    .then((track) => {
      if (!track) {
        throw {
          status: 404,
          message: 'Not Found'
        };
      }

      const { title, artist } = req.body;
      const updateTrack = {};

      if (title) {
        updateTrack.title = title;
      }

      if (artist) {
        updateTrack.artist = artist;
      }

      return knex('tracks')
        .update(updateTrack, '*')
        .where('id', req.params.id);
    })
    .then((rows) => {
      const track = rows[0];

      res.send(track);
    })
    .catch((err) => {
      next(err);
    });
});

router.delete('/tracks/:id', (req, res, next) => {
  let track;

  knex('tracks')
    .where('id', req.params.id)
    .first()
    .then((row) => {
      if (!row) {
        throw {
          status: 404,
          message: 'Not Found'
        };
      }

      track = row;

      return knex('tracks')
        .del()
        .where('id', req.params.id);
    })
    .then(() => {
      delete track.id;

      res.send(track);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
