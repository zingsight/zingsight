(function () {
  'use strict';

  angular
    .module('contracts')
    .controller('ContractsListController', ContractsListController);

  ContractsListController.$inject = ['ContractsService'];

  function ContractsListController(ContractsService) {
    var vm = this;

    vm.contracts = ContractsService.query();
  }
}());
