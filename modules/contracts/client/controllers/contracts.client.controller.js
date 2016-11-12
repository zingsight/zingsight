(function () {
  'use strict';

  // Contracts controller
  angular
    .module('contracts')
    .controller('ContractsController', ContractsController);

  ContractsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'contractResolve'];

  function ContractsController ($scope, $state, $window, Authentication, contract) {
    var vm = this;

    vm.authentication = Authentication;
    vm.contract = contract;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Contract
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.contract.$remove($state.go('contracts.list'));
      }
    }

    // Save Contract
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.contractForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.contract._id) {
        vm.contract.$update(successCallback, errorCallback);
      } else {
        vm.contract.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('contracts.view', {
          contractId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
