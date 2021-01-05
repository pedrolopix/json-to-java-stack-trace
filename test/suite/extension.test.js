const assert = require("assert");

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
// const vscode = require('vscode');
const myExtension = require("../../extension.js");

// Defines a Mocha test suite to group tests of similar kind together
suite("Extension Tests", function() {
  test("Should convert JSON to CSV", () => {
    const json = '{'+
		'"refId": 1,'+
		'"exceptionType": "java.time.format.DateTimeParseException",'+
		'"message": "Text 400-01-02T03:53:00+00:00 could not be parsed at index 0",'+
		'"frames": ['+
		'	{'+
	    '			"class": "java.time.format.DateTimeFormatter",'+
		'		"method": "parseResolved0",'+
		'		"line": 2046'+
		'	}]}';
    myExtension.toStackTrace(json, (err, stacktrace) => {
      assert.ok(stacktrace);
      assert.equal(stacktrace, 'Text 400-01-02T03:53:00+00:00 could not be parsed at index 0: java.time.format.DateTimeParseException\n'+
	  'at java.time.format.DateTimeFormatter.parseResolved0(DateTimeFormatter.java:2046)\n');
	  
    });
  });
});