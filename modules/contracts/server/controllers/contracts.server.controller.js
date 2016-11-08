'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Contract = mongoose.model('Contract'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Contract
 */
exports.create = function(req, res) {
  var contract = new Contract(req.body);
  contract.user = req.user;

  contract.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(contract);
    }
  });
};

/**
 * Show the current Contract
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var contract = req.contract ? req.contract.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  contract.isCurrentUserOwner = req.user && contract.user && contract.user._id.toString() === req.user._id.toString();

  res.jsonp(contract);
};

/**
 * Update a Contract
 */
exports.update = function(req, res) {
  var contract = req.contract;

  contract = _.extend(contract, req.body);

  contract.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(contract);
    }
  });
};

/**
 * Delete an Contract
 */
exports.delete = function(req, res) {
  var contract = req.contract;

  contract.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(contract);
    }
  });
};

/**
 * List of Contracts
 */
exports.list = function(req, res) {
  Contract.find().sort('-created').populate('user', 'displayName').exec(function(err, contracts) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(contracts);
    }
  });
};

/**
 * Contract middleware
 */
exports.contractByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Contract is invalid'
    });
  }

  Contract.findById(id).populate('user', 'displayName').exec(function (err, contract) {
    if (err) {
      return next(err);
    } else if (!contract) {
      return res.status(404).send({
        message: 'No Contract with that identifier has been found'
      });
    }
    req.contract = contract;
    next();
  });
};
