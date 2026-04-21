<p align="center">
	<img align="center" src="src/public/Crochet_Banner.png">
</p>
<h1 align="center">v0.1.7 Alpha (LEGACY)</h1>

Crochet is a node-based dialogue editor forked from [YarnEditor](https://github.com/YarnSpinnerTool/YarnEditor). It is designed to output Yarn files using Yarn Script (specifically the upcoming 2.0 specification), a narrative scripting language for writing interactive dialogue in games. Yarn Script has been used in games such as [A Short Hike](https://adamgryu.itch.io/a-short-hike), [Far From Noise](https://www.georgebatchelor.com/farfromnoise), [Knights and Bikes](https://foamswordgames.com/#knights), and [Night In The Woods](http://www.nightinthewoods.com/). The Yarn language is designed to be simple and easy to understand, even if you don't have any programming experience. This makes it a great tool for both writers and programmers alike.

The 2.0 specification is currently in flux, which means that Crochet is also in flux and will remain in an alpha state until the specification is pinned down. You can read more about the new specification and keep up to date [here](https://github.com/YarnSpinnerTool/YarnSpinner/blob/yarn-spec/Documentation/Yarn-Spec.md) and [here](https://github.com/YarnSpinnerTool/YarnSpinner/pull/285).

<p align="center">
	<img src="doc/Crochet_App_Image.png">
</p>

# Desktop App
The latest release for Windows, Mac, & Linux can be [found here](https://github.com/FaultyFunctions/Crochet/releases/latest).

# Features

### Editor
- Spellcheck for multiple languages.
- Spelling suggestions via the right-click context-menu.
- Autocomplete suggestions.
- Auto close tags and brackets.
- Auto create nodes if a jump command doesn't link to an already existing node.
- Syntax hightlighting for Yarn Script.
- Color and emoji picker.
- Text-to-Speech button so you can hear text aloud.
- Editor can be split and snapped to the left or right side of the screen so you can edit nodes and move around the workspace at the same time.

### Workspace
- Snap to Grid functionality with adjustable grid size settings.
- Alignment options for organizing nodes quickly.
- Search through title, body, or tags to find the node you're looking for quickly.
- Undo & redo functionality.
- Arrows are drawn between nodes you have linked with a `<<jump Node_Name>>` command.
- Zoom with scroll wheel or with scroll buttons on the button panel.
- Change a node's title background color for better organization.
- Select and manipulate multiple nodes at the same time.

### Customization
- Multiple themes to choose from including [Dracula](https://draculatheme.com/).
- Change the editor's font size between 12-24px.
- Different arrow drawing styles.
- Invert colors option, just in case.

# Yarn Implementations
An implementation or runtime is a library that allows your game engine to parse the files that Crochet creates. Some implementations for game engines are listed below:

- [YarnSpinner](https://github.com/YarnSpinnerTool/YarnSpinner)<br>
A C# implementation created by the original team behind Yarn. It's a very popular choice for Unity devs, but it can be used by any other C# engine.

- [Chatterbox](https://github.com/JujuAdams/Chatterbox)<br>
A Yarn implementation for GameMaker Studio 2.3+ created by [JuJuAdams](http://www.jujuadams.com/).

If you are working on an implementation/runtime and you'd like to be added to this list just open an issue and I'll get it added!

# Roadmap
This is just a rough idea of what I want to implement in the future. No dates provided, since I work sporadically.
- Canvas labels to better organize and find relevant story sections at a glance within your yarn file.
- Custom markup editing. This will allow uses to implement their own markup buttons in the editor.
- Better file handling.
- Improvements to autocomplete suggestions.

# Running From Source
Install [Node.js](https://nodejs.org/en/), clone the repo, then:
### Web App
```console
$ npm install
$ npm start
```

### Electron
```console
$ cd electron
$ npm install
$ npm start
```

# Building From Source
Install [Node.js](https://nodejs.org/en/), clone the repo, then:
### Web App
```console
$ npm install
$ npm run build
```
### Electron App
```console
$ cd electron
$ npm install
$ npm run build-windows
```
You can also use `npm run build-linux` or `npm run build-mac`.
