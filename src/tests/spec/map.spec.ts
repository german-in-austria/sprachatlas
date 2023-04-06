require('ts-mocha');
const { By, Builder, Browser } = require('selenium-webdriver');
// import suite from require('selenium-webdriver/testing');
import suite from 'selenium-webdriver/testing';
const assert = require('assert');

suite.suite(
  function (env: any) {
    describe('First script', function () {
      let driver: any;

      before(async function () {
        driver = await new Builder().forBrowser('chrome').build();
      });

      after(async () => await driver.quit());

      it('Test empty map', async function () {
        await driver.get('https://sprachatlas-test.dioe.at');

        let title = await driver.getTitle();
        assert.equal('sprachatlas', title);

        await driver.manage().setTimeouts({ implicit: 3000 });
        const legButton = await driver.findElement(
          By.css('div.map-overlay[style*="top: 75%"] > button.drawer-right')
        );
        legButton.click();

        const legBox = await driver.findElement(By.css('div.box.legend'));
        const legTitle = await driver.findElement(
          By.css('div.box.legend div.v-card__title')
        );
        let boxTitle = await legTitle.getText();
        assert.equal('Legende', boxTitle);

        const minLegButton = await driver.findElement(
          By.css('div.box.legend div.v-card__actions button:first-child')
        );
        await minLegButton.click();
        boxTitle = await legBox.getText();
        console.log(boxTitle);
        /*

        let textBox = await driver.findElement(By.name('my-text'));
        let submitButton = await driver.findElement(By.css('button'));

        await textBox.sendKeys('Selenium');
        await submitButton.click();

        let message = await driver.findElement(By.id('message'));
        let value = await message.getText();
        assert.equal('Received!', value);*/
      });
    });
  },
  { browsers: [Browser.FIREFOX, Browser.CHROME] }
);
