(function () {
  'use strict';

  angular
    .module('serviceproviders')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('serviceproviders', {
        abstract: true,
        url: '/serviceproviders',
        template: '<ui-view/>'
      })
      .state('serviceproviders.list', {
        url: '',
        templateUrl: 'modules/serviceproviders/client/views/list-serviceproviders.client.view.html',
        controller: 'ServiceprovidersListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Serviceproviders List'
        }
      })
      .state('serviceproviders.create', {
        url: '/create',
        templateUrl: 'modules/serviceproviders/client/views/form-serviceprovider.client.view.html',
        controller: 'ServiceprovidersController',
        controllerAs: 'vm',
        resolve: {
          serviceproviderResolve: newServiceprovider
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Serviceproviders Create'
        }
      })
      .state('serviceproviders.edit', {
        url: '/:serviceproviderId/edit',
        templateUrl: 'modules/serviceproviders/client/views/form-serviceprovider.client.view.html',
        controller: 'ServiceprovidersController',
        controllerAs: 'vm',
        resolve: {
          serviceproviderResolve: getServiceprovider
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Serviceprovider {{ serviceproviderResolve.name }}'
        }
      })
      .state('serviceproviders.view', {
        url: '/:serviceproviderId',
        templateUrl: 'modules/serviceproviders/client/views/view-serviceprovider.client.view.html',
        controller: 'ServiceprovidersController',
        controllerAs: 'vm',
        resolve: {
          serviceproviderResolve: getServiceprovider
        },
        data: {
          pageTitle: 'Serviceprovider {{ serviceproviderResolve.name }}'
        }
      });
  }

  getServiceprovider.$inject = ['$stateParams', 'ServiceprovidersService'];

  function getServiceprovider($stateParams, ServiceprovidersService) {
    return ServiceprovidersService.get({
      serviceproviderId: $stateParams.serviceproviderId
    }).$promise;
  }

  newServiceprovider.$inject = ['ServiceprovidersService'];

  function newServiceprovider(ServiceprovidersService) {
    return new ServiceprovidersService();
  }
}());
