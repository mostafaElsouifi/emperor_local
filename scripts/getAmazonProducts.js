const puppeteer = require("puppeteer");
//const getTextFromImage = require("../helpers/getTextFromImage");
const delay = require("../helpers/delay");

module.exports = getAmazonProducts = async (searchTerm) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      slowMo: 100, // slow down actions by 100ms
      // args: ["--incognito"],
    });
    const page = await browser.newPage();

    // navigate to Amazon website
    await page.goto("https://www.amazon.com/");
    await page.click("#nav-link-accountList");
    await delay(3);
    await page.type("#ap_email", process.env.AMAZON_EMAIL);
    await page.click("#continue");
    await delay(3);
    await page.type("#ap_password", process.env.AMAZON_PASSWORD);
    await page.click("#signInSubmit");
    await delay(5);

    // check if there is a captcha
    // let reqCaptcha = await page.evaluate(() => {
    //   if (
    //     document.querySelector("h4").textContent ===
    //     "Enter the characters you see below"
    //   )
    //     return true;
    //   return false;
    // });

    // enter search term and submit form

    await page.type("#twotabsearchtextbox", searchTerm);
    await page.keyboard.press("Enter");
    await page.waitForNavigation();
    // select 'Sort by' dropdown and choose 'Avg. Customer Review' option
    await page.select("select#s-result-sort-select", "review-rank");
    await delay(4);
    await page.waitForSelector("div.s-result-item");

    // extract product information
    const productData = await page.evaluate(() => {
      let products = document.querySelectorAll("div.s-result-item");
      products = Array.from(products).filter(
        (e, i) => i !== 0 && i < products.length - 20
      );

      return products.map((product) => {
        let name, price, productLink;
        try {
          name = product.querySelector(
            "span.a-size-base-plus.a-color-base.a-text-norma"
          ).textContent;
        } catch (e) {
          console.log(e);
        }

        try {
          if (product.querySelector("span.a-price-whole")) {
            price = product
              .querySelector("span.a-price-whole")
              .textContent.replace(".", "");
          }
        } catch (e) {
          console.log(e);
        }

        try {
          productLink = product.querySelector(
            ".a-link-normal.s-underline-text"
          ).href;
        } catch (e) {
          console.log(e);
        }

        return {
          name,
          price,
          productLink,
          store: "amazon",
          country: "USA",
          type: "product",
        };
      });
    });

    // get first 5 products
    let selectedProducts = productData.filter(
      (p, i) => p.name && p.price && p.productLink && p.name !== ""
    );
    selectedProducts = productData.filter((p, i) => i < 5);
    console.log(selectedProducts);
    try {
      for (let i = 0; i < selectedProducts.length; i++) {
        await page.goto(selectedProducts[i].productLink);
        //await page.click('span[data-action="amzn-ss-show-text-popover"]');
        await delay(3);

        await page.click('span[data-action="amzn-ss-show-text-image-popover"]');
        await delay(2);
        const affiliateLink = await page.evaluate(() => {
          return document
            .querySelector("#amzn-ss-text-image-textarea")
            .textContent.split("src=")[1]
            .replaceAll("></a><img", "")
            .replace("></iframe>", "")
            .replaceAll('"', "")
            .trim();
        });
        await delay(1);
        await page.click('span[data-action="amzn-ss-show-image-popover"]');
        await delay(3);
        await page.click("#amzn-ss-large-image-radio-button");
        await delay(3);

        let image = await page.evaluate(() => {
          return document
            .querySelector("#amzn-ss-image-textarea")
            .textContent.split("src=")[1]
            .replaceAll("></a><img", "")
            .replaceAll('"', "")
            .trim();
        });
        await delay(3);
        selectedProducts[i].affiliateLink = affiliateLink;
        selectedProducts[i].image = image;
        delete selectedProducts[i].productLink;
      }
      await browser.close();
    } catch (e) {
      console.log(e);
    }

    return selectedProducts;
  } catch (e) {
    console.log(e);
  }
};
