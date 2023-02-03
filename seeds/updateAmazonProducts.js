require("dotenv").config();
const delay = require("../helpers/delay");
const puppeteer = require("puppeteer");
const mongoose = require("mongoose");
const Product = require("../db/models/product");

(async () => {
  mongoose.set("strictQuery", false);
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("mongo db is connected");
  } catch (e) {
    console.log(e);
  }
})();

const updateProducts = async () => {
  const browser = await puppeteer.launch({
    headless: false,
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
  await delay(10);

  let allProducts = await Product.find({});
  allProducts = allProducts.filter((p) => p.country !== "Malaysia");
  await delay(4);
  for (let i = 138; i < allProducts.length; i++) {
    console.log(i);
    await page.goto(allProducts[i].affiliateLink);
    await page.click('span[data-action="amzn-ss-show-text-image-popover"]');
    await delay(2);
    let productUrl = await page.evaluate(() => {
      return document
        .querySelector("#amzn-ss-text-image-textarea")
        .textContent.split("src=")[1]
        .replaceAll("></a><img", "")
        .replaceAll('"', "")
        .trim();
    });
    await delay(2);
    await Product.findByIdAndUpdate(allProducts[i]._id, {
      affiliateLink: productUrl,
    });
    await delay(2);
  }
};
updateProducts();
