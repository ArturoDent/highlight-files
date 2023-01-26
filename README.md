# highlight-files

This vscode extension will highlight the editor tab of any file opened that is not part of the workspace.  The tab will be have a unique color which can configure.  Both the editor tab label and the filename in the Explorer will get this color.  

![demo](images/decorateNonWorkspaceFiles.gif)

The color used is a `ThemeColor` called `highlightFiles.nonWorkspaceFiles` and defaults to red or `#f00`.  That may not work in the theme you use for your editor so it is configurable.  In your `settings.json` add this `colorCustomiztion`:  

```jsonc
  "workbench.colorCustomizations": {
    
    "highlightFiles.nonWorkspaceFiles": "#91ff00"  // a wonderful lime green
  }
```

Any hex color can be used including those with opacity like `#91ff0060`: the last two digits are for opacity.  

## Known Issues

To enable the editor color and badges these settings must be enabled:  

```jsonc
  Workbench > Editor > Decorations: Badges  
  // Controls whether editor file decorations should use badges.  
  "workbench.editor.decorations.badges": true,

  Workbench > Editor > Decorations: Colors  
  // Controls whether editor file decorations should use colors.  
  "workbench.editor.decorations.colors": true,
```

To enable the file explorer color and badges these settings must be enabled:  
  
```jsonc
  Explorer > Decorations: Badges  
  // Controls whether file decorations should use badges.  
  "explorer.decorations.badges": true,

  Explorer > Decorations: Badges  
  // Controls whether file decorations should use colors.  
  "explorer.decorations.colors": true,
```
  
  ----------

After installing the extension, you may have to reload vscode to activate this extension.  

## Release Notes

### 0.0.3

Ignore uri.scheme === 'vscode-userdata' so `settings.json` and `keybindings.json` are not decorated.  
