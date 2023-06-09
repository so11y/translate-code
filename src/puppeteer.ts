import puppeteer from "puppeteer";

export async function puppeteerInit() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto("https://fanyi.baidu.com/?aldtype=16047#auto/zh");
  await Promise.all([
    page.$eval("#app-guide", (el) => el.remove()),
    page.$eval("#desktop-guide-wrapper", (el) => el.remove()),
  ]);
  return {
    page: [page, browser],
    async translate(text: string): Promise<Array<Record<string, any>>> {
      const baiduTranslateInput = await page.$("#baidu_translate_input");
      const transApiResult = page
        .waitForResponse((response) =>
          response.url().includes("https://fanyi.baidu.com/v2transapi")
        )
        .then((e) => e.json());
      await baiduTranslateInput?.evaluate((el, value) => {
        return (el.value = value);
      }, text);
      (await page.$("#translate-button"))?.click();
      const { trans_result } = await transApiResult;
      return trans_result.data;
    },
  };
}
