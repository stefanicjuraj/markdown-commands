# markdown-commands

An extension for enhanced Markdown format editing with utility commands.

## Features

- Create and insert [tables](#tables) with a simple command
- Create and insert [ordered lists](#ordered-lists) with a specified number of items
- Create and insert [unordered lists](#unordered-lists) with a specified number of items

## Usage

### Tables

1. Use the slash command: `/table <columns> <rows>`. For example: `/table 3 5`
   - You can also use the `Ctrl+Shift+T` (Windows/Linux) / `Cmd+Shift+T` (macOS) shortcuts, or run the command `Markdown: Create Table` from the command palette.
2. A formatted Markdown table will be inserted at cursor position.

```
| Column 1 | Column 2 | Column 3 |
| -------- | -------- | -------- |
|          |          |          |
|          |          |          |
|          |          |          |
|          |          |          |
|          |          |          |
```

### Ordered Lists

1. Use the slash command: `/olist <items>`. For example: `/olist 3`
   - You can also use the `Ctrl+Shift+O` (Windows/Linux) / `Cmd+Shift+O` (macOS) shortcuts, or run the command `Markdown: Create Ordered List` from the command palette.
2. An ordered list will be inserted at cursor position.

```
1. Item 1
2. Item 2
3. Item 3
```

### Unordered Lists

1. Use the slash command: `/ulist <items>`. For example: `/ulist 3`
   - You can also use the `Ctrl+Shift+U` (Windows/Linux) / `Cmd+Shift+U` (macOS) shortcuts, or run the command `Markdown: Create Unordered List` from the command palette.
2. An unordered list will be inserted at cursor position.

```
- Item 1
- Item 2
- Item 3
```

## Installation

- Install from [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=jurajstefanic.md-commands)
