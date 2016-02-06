"use strict";

module.exports = function(getItemsFromBackend, createItem) {

  var items = [];

  var refresh = function() {
    getItemsFromBackend().then(function(records) {
      // create objects
      items = records.map(createItem);
    });
  };

  // on loading the service, populate the items array
  refresh();

  return {
    getAll: function() {
      refresh();
      return items;
    },
    add: function(item) { items.push(item); },
    del: function(item) { items.splice(indexOf(item), 1); }
  };
};
