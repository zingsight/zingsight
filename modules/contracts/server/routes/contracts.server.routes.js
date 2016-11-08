'use strict';

/**
 * Module dependencies
 */
var contractsPolicy = require('../policies/contracts.server.policy'),
  contracts = require('../controllers/contracts.server.controller');

module.exports = function(app) {
  // Contracts Routes
  app.route('/api/contracts').all(contractsPolicy.isAllowed)
    .get(contracts.list)
    .post(contracts.create);

  app.route('/api/contracts/:contractId').all(contractsPolicy.isAllowed)
    .get(contracts.read)
    .put(contracts.update)
    .delete(contracts.delete);

  // Finish by binding the Contract middleware
  app.param('contractId', contracts.contractByID);
};
