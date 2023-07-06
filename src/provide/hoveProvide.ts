import * as vscode from "vscode";
import {TranslateOptions } from "../types";

export class TranslateHover implements vscode.HoverProvider {
  constructor(public context: TranslateOptions) {}

  async provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): Promise<vscode.Hover | null | undefined> {
    const text = document.getText(document.getWordRangeAtPosition(position));
    const translateText = await (await this.context).translate(text);
    const contents = new vscode.MarkdownString(translateText);
    contents.isTrusted = true; // 允许显示 Markdown 格式的内容
    return new vscode.Hover(contents);
  }
}
