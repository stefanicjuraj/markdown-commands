import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  console.log("markdown-commands is now active!");

  const tableCommand = vscode.commands.registerCommand(
    "markdown-commands.createTable",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No active editor found");
        return;
      }

      const columns = await vscode.window.showInputBox({
        prompt: "Enter number of columns",
        placeHolder: "e.g., 3",
      });

      if (!columns) return;

      const rows = await vscode.window.showInputBox({
        prompt: "Enter number of rows",
        placeHolder: "e.g., 4",
      });

      if (!rows) return;

      const numColumns = parseInt(columns);
      const numRows = parseInt(rows);

      if (
        isNaN(numColumns) ||
        isNaN(numRows) ||
        numColumns <= 0 ||
        numRows <= 0
      ) {
        vscode.window.showErrorMessage(
          "Please enter valid positive numbers for columns and rows"
        );
        return;
      }

      const table = generateMarkdownTable(numColumns, numRows);

      editor.edit((editBuilder) => {
        editBuilder.insert(editor.selection.active, table);
      });
    }
  );

  const orderedListCommand = vscode.commands.registerCommand(
    "markdown-commands.createOrderedList",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No active editor found");
        return;
      }

      const items = await vscode.window.showInputBox({
        prompt: "Enter number of items",
        placeHolder: "e.g., 5",
      });

      if (!items) return;

      const numItems = parseInt(items);

      if (isNaN(numItems) || numItems <= 0) {
        vscode.window.showErrorMessage(
          "Please enter a valid positive number for items"
        );
        return;
      }

      const list = generateOrderedList(numItems);

      editor.edit((editBuilder) => {
        editBuilder.insert(editor.selection.active, list);
      });
    }
  );

  const unorderedListCommand = vscode.commands.registerCommand(
    "markdown-commands.createUnorderedList",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No active editor found");
        return;
      }

      const items = await vscode.window.showInputBox({
        prompt: "Enter number of items",
        placeHolder: "e.g., 5",
      });

      if (!items) return;

      const numItems = parseInt(items);

      if (isNaN(numItems) || numItems <= 0) {
        vscode.window.showErrorMessage(
          "Please enter a valid positive number for items"
        );
        return;
      }

      const list = generateUnorderedList(numItems);

      editor.edit((editBuilder) => {
        editBuilder.insert(editor.selection.active, list);
      });
    }
  );

  const horizontalRuleCommand = vscode.commands.registerCommand(
    "markdown-commands.createHorizontalRule",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No active editor found");
        return;
      }

      const hr = generateHorizontalRule();

      editor.edit((editBuilder) => {
        editBuilder.insert(editor.selection.active, hr);
      });
    }
  );

  const hyperlinkCommand = vscode.commands.registerCommand(
    "markdown-commands.createHyperlink",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No active editor found");
        return;
      }

      const title = await vscode.window.showInputBox({
        prompt: "Enter link title",
        placeHolder: "e.g., Google",
      });

      if (!title) return;

      const url = await vscode.window.showInputBox({
        prompt: "Enter URL",
        placeHolder: "e.g., https://www.example.com",
      });

      if (!url) return;

      const link = generateHyperlink(title, url);

      editor.edit((editBuilder) => {
        editBuilder.insert(editor.selection.active, link);
      });
    }
  );

  const imageCommand = vscode.commands.registerCommand(
    "markdown-commands.createImage",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No active editor found");
        return;
      }

      const altText = await vscode.window.showInputBox({
        prompt: "Enter image alt text",
        placeHolder: "e.g., A beautiful sunset",
      });

      if (!altText) return;

      const imageUrl = await vscode.window.showInputBox({
        prompt: "Enter image URL",
        placeHolder: "e.g., https://example.com/image.jpg",
      });

      if (!imageUrl) return;

      const image = generateImage(altText, imageUrl);

      editor.edit((editBuilder) => {
        editBuilder.insert(editor.selection.active, image);
      });
    }
  );

  const inlineCommandProcessor = vscode.commands.registerTextEditorCommand(
    "markdown-commands.inlineCommandProcessor",
    (textEditor, edit) => {
      const document = textEditor.document;

      if (document.languageId !== "markdown") {
        return;
      }

      const text = document.getText();
      const lines = text.split("\n");

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const tableMatch = line.match(/^\/table\s+(\d+)\s+(\d+)$/);
        const olistMatch = line.match(/^\/olist\s+(\d+)$/);
        const ulistMatch = line.match(/^\/ulist\s+(\d+)$/);
        const hrMatch = line.match(/^\/hr$/);
        const linkMatch = line.match(/^\/link$/);
        const imgMatch = line.match(/^\/img$/);

        if (tableMatch) {
          const numColumns = parseInt(tableMatch[1]);
          const numRows = parseInt(tableMatch[2]);

          if (
            !isNaN(numColumns) &&
            !isNaN(numRows) &&
            numColumns > 0 &&
            numRows > 0
          ) {
            const table = generateMarkdownTable(numColumns, numRows);
            const position = new vscode.Position(i, 0);
            const endPosition = new vscode.Position(i, line.length);
            const range = new vscode.Range(position, endPosition);

            edit.replace(range, table);
          }
        } else if (olistMatch) {
          const numItems = parseInt(olistMatch[1]);

          if (!isNaN(numItems) && numItems > 0) {
            const list = generateOrderedList(numItems);
            const position = new vscode.Position(i, 0);
            const endPosition = new vscode.Position(i, line.length);
            const range = new vscode.Range(position, endPosition);

            edit.replace(range, list);
          }
        } else if (ulistMatch) {
          const numItems = parseInt(ulistMatch[1]);

          if (!isNaN(numItems) && numItems > 0) {
            const list = generateUnorderedList(numItems);
            const position = new vscode.Position(i, 0);
            const endPosition = new vscode.Position(i, line.length);
            const range = new vscode.Range(position, endPosition);

            edit.replace(range, list);
          }
        } else if (hrMatch) {
          const hr = generateHorizontalRule();
          const position = new vscode.Position(i, 0);
          const endPosition = new vscode.Position(i, line.length);
          const range = new vscode.Range(position, endPosition);

          edit.replace(range, hr);
        } else if (linkMatch) {
          const link = generateHyperlink("Link Text", "https://example.com");
          const position = new vscode.Position(i, 0);
          const endPosition = new vscode.Position(i, line.length);
          const range = new vscode.Range(position, endPosition);

          edit.replace(range, link);
        } else if (imgMatch) {
          const image = generateImage("Image", "https://example.com/image.jpg");
          const position = new vscode.Position(i, 0);
          const endPosition = new vscode.Position(i, line.length);
          const range = new vscode.Range(position, endPosition);

          edit.replace(range, image);
        }
      }
    }
  );

  function generateMarkdownTable(columns: number, rows: number): string {
    let table = "";

    table += "| ";
    for (let col = 0; col < columns; col++) {
      table += `Column ${col + 1} | `;
    }
    table += "\n";

    table += "| ";
    for (let col = 0; col < columns; col++) {
      table += "--- | ";
    }
    table += "\n";

    for (let row = 0; row < rows; row++) {
      table += "| ";
      for (let col = 0; col < columns; col++) {
        table += `   | `;
      }
      table += "\n";
    }

    return table;
  }

  function generateOrderedList(items: number): string {
    let list = "";
    for (let i = 1; i <= items; i++) {
      list += `${i}. Item ${i}\n`;
    }
    return list;
  }

  function generateUnorderedList(items: number): string {
    let list = "";
    for (let i = 1; i <= items; i++) {
      list += `- Item ${i}\n`;
    }
    return list;
  }

  function generateHorizontalRule(): string {
    return "---\n";
  }

  function generateHyperlink(title: string, url: string): string {
    return `[${title}](${url})`;
  }

  function generateImage(altText: string, imageUrl: string): string {
    return `![${altText}](${imageUrl})`;
  }

  const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(
    (event) => {
      if (event.document.languageId === "markdown") {
        vscode.commands.executeCommand(
          "markdown-commands.inlineCommandProcessor"
        );
      }
    }
  );

  context.subscriptions.push(
    tableCommand,
    orderedListCommand,
    unorderedListCommand,
    horizontalRuleCommand,
    hyperlinkCommand,
    imageCommand,
    inlineCommandProcessor,
    changeDocumentSubscription
  );
}

export function deactivate() {}
