'use strict';

/**
 * Module dependencies
 */
var serviceprovidersPolicy = require('../policies/serviceproviders.server.policy'),
  serviceproviders = require('../controllers/serviceproviders.server.controller');

module.exports = function(app) {
  // Serviceproviders Routes
  app.route('/api/serviceproviders').all(serviceprovidersPolicy.isAllowed)
    .get(serviceproviders.list)
    .post(serviceproviders.create);

  app.route('/api/serviceproviders/:serviceproviderId').all(serviceprovidersPolicy.isAllowed)
    .get(serviceproviders.read)
    .put(serviceproviders.update)
    .delete(serviceproviders.delete);

  // Finish by binding the Serviceprovider middleware
  app.param('serviceproviderId', serviceproviders.serviceproviderByID);
};
