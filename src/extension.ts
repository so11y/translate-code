import * as vscode from "vscode";
import remoteTranslate from "./remoteTranslate";
import { TranslateHover } from "./provide/hoveProvide";


export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerHoverProvider(
      "*",
      new TranslateHover(remoteTranslate())
    )
  );
  context.subscriptions.push(
    vscode.workspace.registerTextDocumentContentProvider("translate", {
      async provideTextDocumentContent(uri: vscode.Uri): Promise<string> {

        console.log(uri.path,'---');
        const data = await remoteTranslate().translate(uri.path);
        return  data;
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
}
