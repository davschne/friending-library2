"use strict";

module.exports = function(getItemFromBackend, createItem) {

  var items = [];

  var refresh = function() {
    getItemFromBackend(function(records) {
      // create copy objects
      records.map(createItem);
      items = records;
    });
  };

  // utility to find the index of a copy in the array by its copyid
  // could speed this up to lg N if the array is sorted by copyid

  // var findIndexByID = function(copyid) {
  //   for (var i = 0; i < items.length; i++) {
  //     if (items[i].copyid === copyid) return i;
  //   }
  //   return null;
  // };

  // on loading the service, populate the items array
  refresh();

  return {
    getAll: function() {
      refresh();
      return items;
    },
    add: function(copy) { items.push(copy); },
    del: function(copy) { items.splice(indexOf(copy), 1); }
  };
};
