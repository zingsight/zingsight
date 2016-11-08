'use strict';

describe('Serviceproviders E2E Tests:', function () {
  describe('Test Serviceproviders page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/serviceproviders');
      expect(element.all(by.repeater('serviceprovider in serviceproviders')).count()).toEqual(0);
    });
  });
});
