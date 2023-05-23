import * as vscode from "vscode";
import { puppeteerInit } from "./puppeteer";
import { TranslateHover } from "./provide/hoveProvide";

const puppeteerSource = puppeteerInit();

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerHoverProvider(
      "*",
      new TranslateHover(puppeteerSource)
    )
  );
  context.subscriptions.push(
    vscode.workspace.registerTextDocumentContentProvider("translate", {
      async provideTextDocumentContent(uri: vscode.Uri): Promise<string> {
        const data = await (await puppeteerSource).translate(uri.path);
        return  data.map(i=>i.dst).join("\n");
      },
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("translate.text", async function () {
      const editor = vscode.window.activeTextEditor!;
      const allSelection = editor.selection;
      const activeText = editor.document.getText(allSelection);
      const uri = vscode.Uri.parse("translate:" + activeText);
      const doc = await vscode.workspace.openTextDocument(uri);
      await vscode.window.showTextDocument(doc, { preview: false });
    })
  );
}

export async function deactivate() {
  (await puppeteerSource).page[0].close();
}
