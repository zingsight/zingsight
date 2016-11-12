// Contracts service used to communicate Contracts REST endpoints
(function () {
  'use strict';

  angular
    .module('contracts')
    .factory('ContractsService', ContractsService);

  ContractsService.$inject = ['$resource'];

  function ContractsService($resource) {
    return $resource('api/contracts/:contractId', {
      contractId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
