const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");
const mocha = require("mocha");
const { before, after, beforeEach, describe, it } = mocha;
require("chromedriver");
require("edgedriver");

const chrome = require("selenium-webdriver/chrome");
const edge = require("selenium-webdriver/edge");

const BROWSERS = ["chrome", "MicrosoftEdge"];

BROWSERS.forEach((browser) => {
  describe(`SauceDemo Tests on ${browser}`, function () {
    this.timeout(120000);
    let driver;

    before(async function () {
      console.log(` Memulai browser: ${browser}`);
      let options;
      if (browser === "chrome") {
        options = new chrome.Options().addArguments("--headless");
        driver = await new Builder().forBrowser(browser).setChromeOptions(options).build();
      } else if (browser === "MicrosoftEdge") {
        options = new edge.Options().addArguments("--headless");
        driver = await new Builder().forBrowser(browser).setEdgeOptions(options).build();
      }
    });

    after(async function () {
      if (driver) {
        console.log(` Menutup browser: ${browser}`);
        await driver.quit();
      }
    });

    beforeEach(async function () {
      console.log(` Membuka halaman SauceDemo di ${browser}`);
      await driver.get("https://www.saucedemo.com/");
    });

    it("User berhasil login dan masuk ke dashboard", async function () {
      console.log(` Login dengan standard_user di ${browser}`);
      await driver.findElement(By.id("user-name")).sendKeys("standard_user");
      await driver.findElement(By.id("password")).sendKeys("secret_sauce");
      await driver.findElement(By.id("login-button")).click();

      await driver.wait(until.urlContains("inventory.html"), 20000);
      let currentUrl = await driver.getCurrentUrl();
      assert.strictEqual(currentUrl.includes("inventory.html"), true);
      console.log(` Login berhasil di ${browser}`);
    });

    it("Menambahkan item ke cart", async function () {
      console.log(` Menambahkan item ke cart di ${browser}`);
      await driver.findElement(By.id("user-name")).sendKeys("standard_user");
      await driver.findElement(By.id("password")).sendKeys("secret_sauce");
      await driver.findElement(By.id("login-button")).click();
      await driver.wait(until.urlContains("inventory.html"), 20000);

      let firstItem = await driver.findElement(By.css(".inventory_item button"));
      await firstItem.click();

      await driver.wait(until.elementLocated(By.css(".shopping_cart_badge")), 20000);
      let cartBadge = await driver.findElement(By.css(".shopping_cart_badge")).getText();
      assert.strictEqual(cartBadge, "1");
      console.log(` Item sukses ditambahkan ke cart di ${browser}`);
    });
  });
});
