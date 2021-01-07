const assert = require("assert");

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
// const vscode = require('vscode');
const myExtension = require("../../extension.js");

// Defines a Mocha test suite to group tests of similar kind together
suite("Extension Tests", function () {
  test("Should convert to java file", () => {
    const line = "io.reactivex.internal.operators.flowable.FlowableFlatMapCompletableCompletable$FlatMapCompletableMainSubscriber";
    const javaFile = myExtension.getJavaName(line);
    assert.equal("FlowableFlatMapCompletableCompletable.java", javaFile);
  });

  test("Should convert JSON to Stacktrace", () => {
    const json = '{' +
        '"refId": 1,' +
        '"exceptionType": "java.time.format.DateTimeParseException",' +
        '"message": "Text 400-01-02T03:53:00+00:00 could not be parsed at index 0",'
        +
        '"frames": [' +
        '	{' +
        '			"class": "java.time.format.DateTimeFormatter",' +
        '		"method": "parseResolved0",' +
        '		"line": 2046' +
        '	}]}';
    myExtension.toStackTrace(json, (err, stacktrace) => {
      assert.ok(stacktrace);
      assert.equal(stacktrace,
          'Text 400-01-02T03:53:00+00:00 could not be parsed at index 0: java.time.format.DateTimeParseException\n'
          +
          'at java.time.format.DateTimeFormatter.parseResolved0(DateTimeFormatter.java:2046)\n');

    });
  });
  test("Should convert JSON to Stacktrace", () => {
    const json = '{"exception":{' +
        '"refId": 1,' +
        '"exceptionType": "java.time.format.DateTimeParseException",' +
        '"message": "Text 400-01-02T03:53:00+00:00 could not be parsed at index 0",'
        +
        '"frames": [' +
        '	{' +
        '			"class": "java.time.format.DateTimeFormatter",' +
        '		"method": "parseResolved0",' +
        '		"line": 2046' +
        '	}]}}';
    myExtension.toStackTrace(json, (err, stacktrace) => {
      assert.ok(stacktrace);
      assert.equal(stacktrace,
          'Text 400-01-02T03:53:00+00:00 could not be parsed at index 0: java.time.format.DateTimeParseException\n'
          +
          'at java.time.format.DateTimeFormatter.parseResolved0(DateTimeFormatter.java:2046)\n');
    });
  });
  test("Should convert JSON to Stacktrace", () => {
    const json = '{"_source": {"json.exception":{' +
        '"refId": 1,' +
        '"exceptionType": "java.time.format.DateTimeParseException",' +
        '"message": "Text 400-01-02T03:53:00+00:00 ' +
        'could not be parsed at index 0",' +
        '"frames": [' +
        '	{' +
        '			"class": "java.time.format.DateTimeFormatter",' +
        '		"method": "parseResolved0",' +
        '		"line": 2046' +
        '	}]}}}';
    myExtension.toStackTrace(json, (err, stacktrace) => {
      assert.ok(stacktrace);
      assert.equal(stacktrace,
          'Text 400-01-02T03:53:00+00:00 could not be parsed at index 0: java.time.format.DateTimeParseException\n'
          +
          'at java.time.format.DateTimeFormatter.parseResolved0(DateTimeFormatter.java:2046)\n');

    });
  });
  test("Should convert JSON to Stacktrace", () => {
    const json = '{\n'
        + '  "_source": {\n'
        + '    "json.exception": {\n'
        + '      "refId": 1,\n'
        + '      "causedBy": {\n'
        + '        "exception": {\n'
        + '          "refId": 2,\n'
        + '          "exceptionType": "java.io.IOException",\n'
        + '          "frames": [\n'
        + '            {\n'
        + '              "method": "encodeBinary",\n'
        + '              "class": "jdk.internal.net.http.websocket.MessageEncoder",\n'
        + '              "line": 224\n'
        + '            },\n'
        + '            {\n'
        + '              "method": "onBinary",\n'
        + '              "class": "jdk.internal.net.http.websocket.TransportImpl",\n'
        + '              "line": 376\n'
        + '            }\n'
        + '          ],\n'
        + '          "message": "Output closed"\n'
        + '        }\n'
        + '      },\n'
        + '      "exceptionType": "java.util.concurrent.ExecutionException",\n'
        + '      "frames": [\n'
        + '        {\n'
        + '          "method": "reportGet",\n'
        + '          "class": "java.util.concurrent.CompletableFuture",\n'
        + '          "line": 395\n'
        + '        },\n'
        + '        {\n'
        + '          "method": "get",\n'
        + '          "class": "java.util.concurrent.CompletableFuture",\n'
        + '          "line": 1999\n'
        + '        }\n'
        + '      ],\n'
        + '      "message": "java.io.IOException: Output closed"\n'
        + '    }\n'
        + '  }\n'
        + '}';
    myExtension.toStackTrace(json, (err, stacktrace) => {
      assert.ok(stacktrace);
      assert.equal(stacktrace,
          'java.io.IOException: Output closed: java.util.concurrent.ExecutionException\n'
          +
          'at java.util.concurrent.CompletableFuture.reportGet(CompletableFuture.java:395)\n'
          +
          'at java.util.concurrent.CompletableFuture.get(CompletableFuture.java:1999)\n'
          +
          'causedBy: \n' +
          'Output closed: java.io.IOException\n' +
          'at jdk.internal.net.http.websocket.MessageEncoder.encodeBinary(MessageEncoder.java:224)\n'
          +
          'at'
          + ' jdk.internal.net.http.websocket.TransportImpl.onBinary(TransportImpl.java:376)\n');
    });
  });
});