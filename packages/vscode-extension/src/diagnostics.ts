import * as vscode from "vscode";

export function refreshDiagnostics(
  doc: vscode.TextDocument,
  customDiagnostics: vscode.DiagnosticCollection
): void {
  if (!doc.fileName.endsWith("manifest.json")) {
    return;
  }

  const diagnostics: vscode.Diagnostic[] = [];

  for (let lineIndex = 0; lineIndex < doc.lineCount; lineIndex++) {
    const lineOfText = doc.lineAt(lineIndex);
    if (lineOfText.text.includes("listReparis")) {
      diagnostics.push(createDiagnostic(doc, lineOfText, lineIndex));
    }
  }

  customDiagnostics.set(doc.uri, diagnostics);
}

function createDiagnostic(
  doc: vscode.TextDocument,
  lineOfText: vscode.TextLine,
  lineIndex: number
): vscode.Diagnostic {
  // find where in the line of that the 'emoji' is mentioned
  const index = lineOfText.text.indexOf("listReparis");

  // create range that represents, where in the document the word is
  const range = new vscode.Range(lineIndex, index, lineIndex, index + "listReparis".length);

  const diagnostic = new vscode.Diagnostic(
    range,
    "This command id cannot be found from api spec.",
    vscode.DiagnosticSeverity.Information
  );
  return diagnostic;
}
