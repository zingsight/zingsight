(function () {
  'use strict';

  describe('Contracts Route Tests', function () {
    // Initialize global variables
    var $scope,
      ContractsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ContractsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ContractsService = _ContractsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('contracts');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/contracts');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          ContractsController,
          mockContract;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('contracts.view');
          $templateCache.put('modules/contracts/client/views/view-contract.client.view.html', '');

          // create mock Contract
          mockContract = new ContractsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Contract Name'
          });

          // Initialize Controller
          ContractsController = $controller('ContractsController as vm', {
            $scope: $scope,
            contractResolve: mockContract
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:contractId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.contractResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            contractId: 1
          })).toEqual('/contracts/1');
        }));

        it('should attach an Contract to the controller scope', function () {
          expect($scope.vm.contract._id).toBe(mockContract._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/contracts/client/views/view-contract.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ContractsController,
          mockContract;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('contracts.create');
          $templateCache.put('modules/contracts/client/views/form-contract.client.view.html', '');

          // create mock Contract
          mockContract = new ContractsService();

          // Initialize Controller
          ContractsController = $controller('ContractsController as vm', {
            $scope: $scope,
            contractResolve: mockContract
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.contractResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/contracts/create');
        }));

        it('should attach an Contract to the controller scope', function () {
          expect($scope.vm.contract._id).toBe(mockContract._id);
          expect($scope.vm.contract._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/contracts/client/views/form-contract.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ContractsController,
          mockContract;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('contracts.edit');
          $templateCache.put('modules/contracts/client/views/form-contract.client.view.html', '');

          // create mock Contract
          mockContract = new ContractsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Contract Name'
          });

          // Initialize Controller
          ContractsController = $controller('ContractsController as vm', {
            $scope: $scope,
            contractResolve: mockContract
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:contractId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.contractResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            contractId: 1
          })).toEqual('/contracts/1/edit');
        }));

        it('should attach an Contract to the controller scope', function () {
          expect($scope.vm.contract._id).toBe(mockContract._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/contracts/client/views/form-contract.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
