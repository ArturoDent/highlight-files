const vscode = require('vscode');

const messages = {
  tabColors: "Non-workspace tab colors are enabled but editor tab colors are disabled via the setting: 'workbench.editor.decorations.colors'.",
  tabBadges: "Non-workspace tab badges are enabled but editor tab badges are disabled via the setting: 'workbench.editor.decorations.badges'.",
  explorerColors: "Non-workspace tab colors are enabled but Explorer tab colors are disabled via the setting: 'explorer.decorations.colors'.",
  explorerBadges: "Non-workspace tab badges are enabled but Explorer tab badges are disabled via the setting: 'explorer.decorations.badges'.",
}


async function activate(context) {
  
  let coloredEnabled = await vscode.workspace.getConfiguration().get('highlightFiles.decorations.enable.color');
  let badgedEnabled = await vscode.workspace.getConfiguration().get('highlightFiles.decorations.enable.badges');
  let badge = await vscode.workspace.getConfiguration().get('highlightFiles.decorations.badge');
  
  let decClass;   // fileDecorator Class
  
  if (coloredEnabled) {
    // const dSettings = await getGeneralDecoratorsSettings();
    const workspaceFiles = await vscode.workspace.findFiles('**');
    decClass = await createDecoratorClass(workspaceFiles, badgedEnabled, badge);
  }
  
  // what if change editor/workbench configuration?
  context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(async (event) => {
    if (event.affectsConfiguration("highlightFiles.decorations.enable.color")) {
      
      const workspaceFiles = await vscode.workspace.findFiles('**');
      
      coloredEnabled = await vscode.workspace.getConfiguration().get('highlightFiles.decorations.enable.color');
      
      if (coloredEnabled) {
        const dSettings = await getGeneralDecoratorsSettings();
        if (!dSettings.tabColors) await notifyNoColorsOrBadges(messages.tabColors);
        const workspaceFiles = await vscode.workspace.findFiles('**');
        decClass = await createDecoratorClass(workspaceFiles, badgedEnabled, badge);
      }
      else {
        decClass.dispose();
      }
    }
    
    else if (event.affectsConfiguration("highlightFiles.decorations.enable.badges")) {
      const workspaceFiles = await vscode.workspace.findFiles('**');
      badgedEnabled = await vscode.workspace.getConfiguration().get('highlightFiles.decorations.enable.badges');
      decClass = await createDecoratorClass(workspaceFiles, badgedEnabled, badge);
    }
      
    else if (event.affectsConfiguration("highlightFiles.decorations.badge")) {
      const workspaceFiles = await vscode.workspace.findFiles('**');
      badge = await vscode.workspace.getConfiguration().get('highlightFiles.decorations.badge');
      if (badgedEnabled) {
        
        decClass.dispose();  // fixed it but at what cost?  
                            //  update the correct decClass rather than re-creating
        decClass = await createDecoratorClass(workspaceFiles, badgedEnabled, badge);
      }
      else decClass = await createDecoratorClass(workspaceFiles, badgedEnabled, badge);
    }
  }));
}

/**
 * create and return a FileDecorationProvider
 *
 * @param {vscode.Uri[]} workspaceFiles
 * @returns FileDecorationProvider
 **/
async function createDecoratorClass(workspaceFiles, badgeEnabled, newBadge) {
// async function createDecoratorClass(enabled) {
  
  class FileDecorationProvider {
    
    constructor() {
      this.disposables = [];
      this.disposables.push(vscode.window.registerFileDecorationProvider(this));
    }
    
    // updateFileDecorationProvider() {
      
      
    // }
    
    /**
     * Checks for non-workspace files
     *
     * @param {vscode.Uri} uri
     * @returns vscode.FileDecoration
     * @memberof FileDecorationProvider
     **/
    async provideFileDecoration(uri) {
      
      if (uri.scheme === 'vscode-userdata') return;  // ignore settings.json and keybindings.json

      const isFile = await vscode.workspace.fs.stat(uri);
      
      const result = workspaceFiles.findIndex(file => file.fsPath === uri.fsPath);
      
      if (isFile.type === 1 && result < 0)    // is a file, not a directory && not in workspace
        if (badgeEnabled) {
          return {
            badge: newBadge,
            // badge: "\u26D6",  // ⛖
            color: new vscode.ThemeColor("highlightFiles.nonWorkspaceFiles"),
            tooltip: "File not in workspace"
          };
        }
        else {
          return {
            // badge: "",
            color: new vscode.ThemeColor("highlightFiles.nonWorkspaceFiles"),
            tooltip: "File not in workspace"
          };
        }
    }

    dispose () {
      this.disposables.forEach((d) => d.dispose());
    }
  }
  
  return new FileDecorationProvider();
}

/**
 * get the decorations and badges settings for the editor tabs and the Explorer
 * @returns {Promise<Object>} the four settings, all booleans
 */
async function getGeneralDecoratorsSettings() {
  
  // "search.decorations.badges" ?
  // "search.decorations.colors" ?
  
  // editor tabs
  const tabColors = await vscode.workspace.getConfiguration().get('workbench.editor.decorations.colors');
  const tabBadges = await vscode.workspace.getConfiguration().get('workbench.editor.decorations.badges');
  
  // in the Explorer
  const explorerColors = await vscode.workspace.getConfiguration().get('explorer.decorations.colors');
  const explorerBadges = await vscode.workspace.getConfiguration().get('explorer.decorations.badges');
  
  return {
    tabColors,
    tabBadges,
    explorerColors,
    explorerBadges
  };
}

async function notifyNoColorsOrBadges(message) {
  
  await vscode.window.showWarningMessage(message);
}



// exports.activate = activate;

function deactivate() {

}

module.exports = {
	activate,
	deactivate
}
