(function () {
  'use strict';

  angular
    .module('contracts')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('contracts', {
        abstract: true,
        url: '/contracts',
        template: '<ui-view/>'
      })
      .state('contracts.list', {
        url: '',
        templateUrl: 'modules/contracts/client/views/list-contracts.client.view.html',
        controller: 'ContractsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Contracts List'
        }
      })
      .state('contracts.create', {
        url: '/create',
        templateUrl: 'modules/contracts/client/views/form-contract.client.view.html',
        controller: 'ContractsController',
        controllerAs: 'vm',
        resolve: {
          contractResolve: newContract
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Contracts Create'
        }
      })
      .state('contracts.edit', {
        url: '/:contractId/edit',
        templateUrl: 'modules/contracts/client/views/form-contract.client.view.html',
        controller: 'ContractsController',
        controllerAs: 'vm',
        resolve: {
          contractResolve: getContract
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Contract {{ contractResolve.name }}'
        }
      })
      .state('contracts.view', {
        url: '/:contractId',
        templateUrl: 'modules/contracts/client/views/view-contract.client.view.html',
        controller: 'ContractsController',
        controllerAs: 'vm',
        resolve: {
          contractResolve: getContract
        },
        data: {
          pageTitle: 'Contract {{ contractResolve.name }}'
        }
      });
  }

  getContract.$inject = ['$stateParams', 'ContractsService'];

  function getContract($stateParams, ContractsService) {
    return ContractsService.get({
      contractId: $stateParams.contractId
    }).$promise;
  }

  newContract.$inject = ['ContractsService'];

  function newContract(ContractsService) {
    return new ContractsService();
  }
}());
