// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
const fs = require('fs');
const path = require('path');

const readSubDirSync = (folderPath : string) => {
	let result :string = "";
	
    const readTopDirSync = ((folderPath : string) => {
      let items = fs.readdirSync(folderPath);
      items = items.map((itemName : string) => {
        return path.join(folderPath, itemName);
      });
      items.forEach((itemPath : string) => {
        result = result + itemPath + "\n";
        if (fs.statSync(itemPath).isDirectory()) {
          readTopDirSync(itemPath);
        }
      });
    });
    readTopDirSync(folderPath);
    return result;
};

export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('extension.get-tree', () => {

		// get editor
		let editor = vscode.window.activeTextEditor; 
		if(!editor){
			return;
		}

		// get document
		let doc = editor.document;
		// get selection
		let cur_selection = editor.selection;

		// if select area is empty, selection is set all area
		if(editor.selection.isEmpty){         
			let startPos  = new vscode.Position(0, 0);
			let endPos    = new vscode.Position(doc.lineCount - 1, 10000);
			cur_selection = new vscode.Selection(startPos, endPos);
		}

		// e.g C:\tmp
		let text = doc.getText(cur_selection);

		// get file and folder path
		var items = readSubDirSync(text);

		// the text will be reflected on the editor
		editor.edit(edit => {
			edit.replace(cur_selection, items + "");
		});
	});
	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
