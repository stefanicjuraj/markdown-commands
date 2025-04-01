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

  const tableInlineCommand = vscode.commands.registerTextEditorCommand(
    "markdown-commands.createTableInline",
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

  const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(
    (event) => {
      if (event.document.languageId === "markdown") {
        vscode.commands.executeCommand("markdown-commands.createTableInline");
      }
    }
  );

  context.subscriptions.push(
    tableCommand,
    tableInlineCommand,
    changeDocumentSubscription
  );
}

export function deactivate() {}
