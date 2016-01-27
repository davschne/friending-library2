'use strict';

require('../../app/js/client.js'); // load app (the source code version)
require('angular-mocks');

describe("http_service.js", function() {

  var $httpBackend;
  var http;
  var callback;
  var token = "asdlfkJOWEIFJN485fvnj";

  beforeEach(angular.mock.module("friendingLibrary"));

  beforeEach(angular.mock.inject(function(_$httpBackend_, httpService) {
    $httpBackend = _$httpBackend_;
    http         = httpService;
  }));

  beforeEach(function() {
    callback = jasmine.createSpy("callback");
  })

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it("should make a DELETE request at /api/self that includes an access token", function() {
    $httpBackend.expect(
      "DELETE",
      "/api/self",
      {},
      function(headers) {
        return headers.Authorization == "Bearer " + token;
      }
    ).respond(200, { message: "user deleted" });
    http.deleteUser(token, callback);
    $httpBackend.flush();
    expect(callback).toHaveBeenCalled();
    expect(callback.calls.count()).toEqual(1);
    expect(callback.calls.argsFor(0)).toEqual([{message: "user deleted"}]);
  });
});
