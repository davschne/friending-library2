"use strict";

describe("Token.js", function() {
  // service under test
  var Token;
  // dummy token
  var access_token = "akjsdhf3498tijnb";
  // name of token
  var token_name = "friendinglibrary.token";
  // mock dependencies
  var $cookies;
  var $location;

  beforeEach(function() {
    angular.mock.module("friendingLibrary");

    // substitute mock dependencies
    angular.mock.module(function($provide) {
      $provide.factory("$cookies", function() { return $cookies; });
      $provide.factory("$location", function() { return $location; });
    });
    angular.mock.inject(function(_Token_) {
      Token = _Token_;
    });
  });

  describe("#get", function() {

    describe("If access token is not saved but is in query string:", function() {

      beforeAll(function() {
        $location = {
          search: function() { return { access_token: access_token }; }
        };
        spyOn($location, "search").and.callThrough();

        $cookies = {
          put: jasmine.createSpy("$cookies.put")
        };
      });

      it("should be able to retrieve an access token from the query string, then save it in a cookie and return it; should also save the token in a local variable and return it on subsequent calls", function() {

        // first call : retrieve from query string
        var result1 = Token.get();
        expect($location.search).toHaveBeenCalled();
        expect($location.search.calls.count()).toEqual(1);
        expect($cookies.put).toHaveBeenCalled();
        expect($cookies.put.calls.count()).toEqual(1);
        expect($cookies.put.calls.argsFor(0)).toEqual([token_name, access_token]);
        expect(result1).toEqual(access_token);

        // second call : retrieve from local variable
        var result2 = Token.get();
        expect($location.search.calls.count()).toEqual(1);
        expect($cookies.put.calls.count()).toEqual(1);
        expect(result2).toEqual(access_token);
      });
    });

    describe("If access token is not saved and is not in query string but is stored in cookie:", function() {

      beforeAll(function() {
        $location = { search: function() { return {}; } };
        spyOn($location, "search").and.callThrough();
        $cookies = { get: function() { return access_token; } };
        spyOn($cookies, "get").and.callThrough();
      });

      it("should be able to retrieve an access token from the cookie and return it; should also save the token in a local variable and return it on subsequent calls", function() {

        // first call : retrieve from cookie
        var result1 = Token.get();
        expect($location.search).toHaveBeenCalled();
        expect($location.search.calls.count()).toEqual(1);
        expect($cookies.get).toHaveBeenCalled();
        expect($cookies.get.calls.count()).toEqual(1);
        expect($cookies.get.calls.argsFor(0)).toEqual([token_name]);
        expect(result1).toEqual(access_token);

        // second call : retrieve from local variable
        var result2 = Token.get();
        expect($location.search.calls.count()).toEqual(1);
        expect($cookies.get.calls.count()).toEqual(1);
        expect(result2).toEqual(access_token);
      });
    });

    describe("If access token is not saved, is not in query string, and is not stored in cookie:", function() {

      beforeAll(function() {
        $location = { search: function() { return {}; } };
        spyOn($location, "search").and.callThrough();

        // What does Angular return if cookie not found?

        $cookies = { get: function() { return undefined } };
        spyOn($cookies, "get").and.callThrough();
      });

      it("should return undefined", function() {
        var result = Token.get();
        expect($location.search).toHaveBeenCalled();
        expect($cookies.get).toHaveBeenCalled();
        expect(result).toBeUndefined();
      });
    });
  });

  describe("#del", function() {

    beforeAll(function() {
      $cookies = {
        // get   : function() { return undefined; },
        remove: jasmine.createSpy("$cookies.remove")
      };
      spyOn($cookies, "get").and.callThrough();
      // $location = { search: function() { return {}; } };
    });

    it("should set the local variable to undefined and delete the cookie", function() {
      Token.del();
      expect($cookies.remove).toHaveBeenCalled();
      expect($cookies.remove.calls.argsFor(0)).toEqual([token_name]);

      // How to check that local variable set to undefined?
    });
  });
});
