// Serviceproviders service used to communicate Serviceproviders REST endpoints
(function () {
  'use strict';

  angular
    .module('serviceproviders')
    .factory('ServiceprovidersService', ServiceprovidersService);

  ServiceprovidersService.$inject = ['$resource'];

  function ServiceprovidersService($resource) {
    return $resource('api/serviceproviders/:serviceproviderId', {
      serviceproviderId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
