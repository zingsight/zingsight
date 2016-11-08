'use strict';

// Configuring the Articles module
angular.module('contracts').run(['Menus',
  function (Menus) {
    // Add the articles dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Contracts',
      state: 'contracts',
      type: 'dropdown',
      roles: ['user', 'admin']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'contracts', {
      title: 'List Contracts',
      state: 'contracts.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'contracts', {
      title: 'Create Contract',
      state: 'contracts.create',
      roles: ['user']
    });
  }
]);
