import * as vscode from "vscode";
import { puppeteerInit } from "../puppeteer";
export class TranslateHover implements vscode.HoverProvider {
  constructor(public context: ReturnType<typeof puppeteerInit>) {}

  async provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): Promise<vscode.Hover | null | undefined> {
    const text = document.getText(document.getWordRangeAtPosition(position));
    const getTranslateText = await (await this.context).translate(text);
    return new vscode.Hover(getTranslateText[0].dst);
  }
}
