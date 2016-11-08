'use strict';

describe('Contracts E2E Tests:', function () {
  describe('Test Contracts page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/contracts');
      expect(element.all(by.repeater('contract in contracts')).count()).toEqual(0);
    });
  });
});
