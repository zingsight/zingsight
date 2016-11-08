(function () {
  'use strict';

  // Serviceproviders controller
  angular
    .module('serviceproviders')
    .controller('ServiceprovidersController', ServiceprovidersController);

  ServiceprovidersController.$inject = ['$scope', '$state', '$window', 'Authentication', 'serviceproviderResolve'];

  function ServiceprovidersController ($scope, $state, $window, Authentication, serviceprovider) {
    var vm = this;

    vm.authentication = Authentication;
    vm.serviceprovider = serviceprovider;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Serviceprovider
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.serviceprovider.$remove($state.go('serviceproviders.list'));
      }
    }

    // Save Serviceprovider
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.serviceproviderForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.serviceprovider._id) {
        vm.serviceprovider.$update(successCallback, errorCallback);
      } else {
        vm.serviceprovider.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('serviceproviders.view', {
          serviceproviderId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
