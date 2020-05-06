const Differencify = require("differencify");
const differencify = new Differencify({ mismatchThreshold: 0 });
let urlToTest = "http://127.0.0.1:8080/";

describe("Zadanie", () => {
  const timeout = 30000;
  let page;

  beforeAll(async () => {
    await differencify.launchBrowser({
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const target = differencify.init({ chain: false });
    page = await target.newPage();
    await page.goto(urlToTest);
    await page.waitFor(1000);
  }, timeout);
  afterAll(async () => {
    await differencify.cleanup();
  });

  it("Sekcja zajmuje 100% viewportu", async () => {
    await page.setViewport({width: 1600, height: 600})
    const section = await page.$eval("section", elem => {
      return getComputedStyle(elem).width === "1600px"
        && getComputedStyle(elem).height === "600px";
    });
    expect(section).toBe(true);
  }, timeout);

  it("Sekcja ma flexa, który wyśrodkuje jej zawartość", async () => {
    const section = await page.$eval("section", elem => {
      return getComputedStyle(elem).display === "flex"
        && getComputedStyle(elem).alignItems === "center"
        && getComputedStyle(elem).justifyContent === "center";
    });
    expect(section).toBe(true);
  }, timeout);

  it("Div jest okrągły i zajmuje 50% wysokości i szerokości sekcji", async () => {
    const div = await page.$eval("div", elem => {
      return getComputedStyle(elem).width === "800px"
        && getComputedStyle(elem).height === "300px"
        && getComputedStyle(elem).borderRadius === "50%";
    });
    expect(div).toBe(true);
  }, timeout);
});
