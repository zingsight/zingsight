'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Serviceprovider = mongoose.model('Serviceprovider'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Serviceprovider
 */
exports.create = function(req, res) {
  var serviceprovider = new Serviceprovider(req.body);
  serviceprovider.user = req.user;

  serviceprovider.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(serviceprovider);
    }
  });
};

/**
 * Show the current Serviceprovider
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var serviceprovider = req.serviceprovider ? req.serviceprovider.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  serviceprovider.isCurrentUserOwner = req.user && serviceprovider.user && serviceprovider.user._id.toString() === req.user._id.toString();

  res.jsonp(serviceprovider);
};

/**
 * Update a Serviceprovider
 */
exports.update = function(req, res) {
  var serviceprovider = req.serviceprovider;

  serviceprovider = _.extend(serviceprovider, req.body);

  serviceprovider.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(serviceprovider);
    }
  });
};

/**
 * Delete an Serviceprovider
 */
exports.delete = function(req, res) {
  var serviceprovider = req.serviceprovider;

  serviceprovider.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(serviceprovider);
    }
  });
};

/**
 * List of Serviceproviders
 */
exports.list = function(req, res) {
  Serviceprovider.find().sort('-created').populate('user', 'displayName').exec(function(err, serviceproviders) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(serviceproviders);
    }
  });
};

/**
 * Serviceprovider middleware
 */
exports.serviceproviderByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Serviceprovider is invalid'
    });
  }

  Serviceprovider.findById(id).populate('user', 'displayName').exec(function (err, serviceprovider) {
    if (err) {
      return next(err);
    } else if (!serviceprovider) {
      return res.status(404).send({
        message: 'No Serviceprovider with that identifier has been found'
      });
    }
    req.serviceprovider = serviceprovider;
    next();
  });
};
