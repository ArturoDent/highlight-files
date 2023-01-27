const vscode = require('vscode');


async function activate(context) {
  
  let enabled = await vscode.workspace.getConfiguration().get('highlight-files.enable');
  let decClass;   // fileDecorator Class
  
  if (enabled) {
    const workspaceFiles = await vscode.workspace.findFiles('**');
    decClass = await createDecoratorClass(workspaceFiles);
  }
  
  context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(async (event) => {
    if (event.affectsConfiguration("highlight-files.enable")) {
      enabled = await vscode.workspace.getConfiguration().get('highlight-files.enable');
      console.log("changed configuration");
      if (enabled) {
        const workspaceFiles = await vscode.workspace.findFiles('**');
        decClass = await createDecoratorClass(workspaceFiles);
      }
      else {
        decClass.dispose();
      }
    }    
  }));
}

/**
 *
 *
//  * @param {vscode.Uri[]} workspaceFiles
 * @returns FileDecorationProvider
 **/
async function createDecoratorClass(workspaceFiles) {
// async function createDecoratorClass(enabled) {
  
  class FileDecorationProvider {
    
    // workspaceFiles = await getWorkspaceFiles();
    
    constructor() {
      this.disposables = [];
      this.disposables.push(vscode.window.registerFileDecorationProvider(this));
      // if (!enabled) this.dispose();
    }
    
    // async getWorkspaceFiles() {
    //   this.workspaceFiles = await vscode.workspace.findFiles('**');
    // }
    
    /**
     *
     *
     * @param {vscode.Uri} uri
     * @returns vscode.FileDecoration
     * @memberof FileDecorationProvider
     **/
    async provideFileDecoration(uri) {
      
      // if (!enabled) this.dispose();
      
      if (uri.scheme === 'vscode-userdata') return;  // ignore settings.json and keybindings.json

      const isFile = await vscode.workspace.fs.stat(uri);
      
      const result = workspaceFiles.findIndex(file => file.fsPath === uri.fsPath);
      
      if (isFile.type === 1 && result < 0)    // is a file, not a directory
        // if (!enabled) return {};
        return {
          badge: "!!",
          color: new vscode.ThemeColor("highlightFiles.nonWorkspaceFiles"),
          tooltip: "File not in workspace"
        };
    }

    dispose () {
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
