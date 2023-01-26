const vscode = require('vscode');


/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
  
  const workspaceFiles = await vscode.workspace.findFiles('**');
  await createDecoratorClass(workspaceFiles);  // runs on start-up
}

/**
 *
 *
 * @param {vscode.Uri[]} workspaceFiles
 * @returns FileDecorationProvider
 **/
async function createDecoratorClass(workspaceFiles) {
  
  class FileDecorationProvider {
    constructor() {
      this.disposables = [];
      this.disposables.push(vscode.window.registerFileDecorationProvider(this));
    }
    
    async provideFileDecoration(uri) {
      
      const isFile = await vscode.workspace.fs.stat(uri);
      
      const result = workspaceFiles.findIndex(file => file.fsPath === uri.fsPath);
      
      if (isFile.type === 1 && result < 0) return {
        badge: "!!",
        color: new vscode.ThemeColor("highlightFiles.nonWorkspaceFiles"),
        tooltip: "File not in workspace"
      };
    }

    dispose() {
      this.disposables.forEach((d) => d.dispose());
    }
  }
  
  return new FileDecorationProvider();
}

// exports.activate = activate;

function deactivate() {

}

module.exports = {
	activate,
	deactivate
}
