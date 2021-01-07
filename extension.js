// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

function convertSelection(conversionFn) {
  return () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

    let textRange;
    if (!editor.selection.isEmpty) {
      textRange = new vscode.Range(
          editor.selection.start,
          editor.selection.end
      );
    }
    const text = editor.document.getText(textRange);
    conversionFn(text, (err, stacktrace) => {
      if (err) {
        console.error(err);
        return;
      }
      editor.edit(edit => {
        if (!textRange) {
          textRange = new vscode.Range(
              editor.document.positionAt(0),
              editor.document.positionAt(text.length)
          );
        }
        edit.replace(textRange, stacktrace);
      });
    });
  };
}

function getJavaName(className) {
  let ret = className.split("@");
  if (ret && ret.length > 0) {
    ret = ret[0].split(".")
    return ret[ret.length - 1] + ".java";
  } else {
    return className;
  }
}

const toStackTrace = (text, callback) => {
  try {
    let json = JSON.parse(text);
    if (json["_source"] && json["_source"]["json.exception"]) {
      json = json["_source"]["json.exception"];
    } else
    if (json.exception) {
    	json = json.exception;
		}
    let ret = json.message + ": " + json.exceptionType + "\n";
    json.frames.forEach(element => {
      let javafile = getJavaName(element.class);
      ret += "at " +
					element.class + "." +
					element.method +
					"(" + javafile + ":" + element.line + ")\n";
    });
    callback(null, ret);
  } catch (e) {
    vscode.window.showErrorMessage("Could not parse the selection as JSON.");
    console.error(e);
    return;
  }
};

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  context.subscriptions.push(
      vscode.commands.registerCommand("json-to-java-stack-trace.toStackTrace",
          convertSelection(toStackTrace))
  );
}

exports.toStackTrace = toStackTrace;
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}

module.exports = {
  toStackTrace,
  activate,
  deactivate
}
