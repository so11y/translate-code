import * as vscode from "vscode";
import axios from "axios";
import {TranslateOptions } from "./types";

interface TranslateSource {
  basic:{
    explains:Array<string>
  },
  translation:Array<string>
}

export default function remoteTranslate():TranslateOptions{
  return {
    async translate(text: string){
      const {data}=  await axios.get<TranslateSource>(`https://aidemo.youdao.com/trans?q=${text}&&from=Auto&&to=Auto`);
      // ### ${data.translation.join(",")}
      // ${data.basic.explains.map(item=>`<div>${item}</div>`)}
      return data.translation.join(",");
    }
  };
}

