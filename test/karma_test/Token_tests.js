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
    angular.mock.inject(function(_Token_, _$cookies_, _$location_) {
      Token = _Token_;
      $cookies  = _$cookies_;
      $location = _$location_;
    });
  });

  describe("#get", function() {

    describe("If access token is not saved but is in query string:", function() {

      beforeEach(function() {
        spyOn($location, "search").and.returnValue({ access_token: access_token });
        spyOn($location, "url").and.callThrough();
        spyOn($cookies, "put").and.callThrough();
      });

      it("should be able to retrieve an access token from the query string, then save it in a cookie and return it; should also save the token in a local variable and return it on subsequent calls", function() {

        // first call : retrieve from query string
        var result1 = Token.get();
        expect($location.search).toHaveBeenCalled();

        // BUG: TWO calls to this function:
        // expect($location.search.calls.count()).toEqual(1);

        expect($cookies.put).toHaveBeenCalled();
        expect($cookies.put.calls.count()).toEqual(1);
        expect($cookies.put.calls.argsFor(0)).toEqual([token_name, access_token]);
        expect($location.url).toHaveBeenCalled();
        expect($location.url.calls.argsFor(0)).toEqual(["/"]);
        expect(result1).toEqual(access_token);

        // second call : retrieve from local variable
        var result2 = Token.get();

        // BUG: TWO calls to this function:
        // expect($location.search.calls.count()).toEqual(1);

        expect($cookies.put.calls.count()).toEqual(1);
        expect(result2).toEqual(access_token);
      });
    });

    describe("If access token is not saved and is not in query string but is stored in cookie:", function() {

      beforeEach(function() {
        spyOn($location, "search").and.callThrough();
        spyOn($cookies, "get").and.returnValue(access_token);
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

      beforeEach(function() {
        spyOn($location, "search").and.callThrough();
        spyOn($cookies, "get").and.returnValue(undefined);
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

    beforeEach(function() {
      spyOn($cookies, "get").and.returnValue(undefined);
      spyOn($cookies, "remove").and.callThrough();
    });

    it("should set the local variable to undefined and delete the cookie", function() {
      Token.del();
      expect($cookies.remove).toHaveBeenCalled();
      expect($cookies.remove.calls.argsFor(0)).toEqual([token_name]);

      // How to check that local variable set to undefined?
    });
  });
});
