"use strict";

module.exports = function(getItemsFromBackend) {

  var items = [];

  var refresh = function() {
    getItemsFromBackend().then(function(records) {
      angular.copy(records, items);
    });
  };

  // on loading the service, populate the items array
  // refresh();

  return {
    getAll: function() {
      refresh();
      return items;
    },
    add: function(item) { items.push(item); },
    del: function(item) { items.splice(items.indexOf(item), 1); }
  };
};
