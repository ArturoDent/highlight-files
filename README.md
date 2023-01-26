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

After installing the extension, you may have to reload vscode to activate this extension.  

## Release Notes

### 0.0.1

Initial release.