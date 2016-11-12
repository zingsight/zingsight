(function () {
  'use strict';

  angular
    .module('serviceproviders')
    .controller('ServiceprovidersListController', ServiceprovidersListController);

  ServiceprovidersListController.$inject = ['ServiceprovidersService'];

  function ServiceprovidersListController(ServiceprovidersService) {
    var vm = this;

    vm.serviceproviders = ServiceprovidersService.query();
  }
}());
