const generateBlog = require("./scripts/generateBlog");
const getBlogImage = require("./scripts/getBlogImg");
const getYoutubeLink = require("./scripts/getYoutubeLink");
const getAmazonProducts = require("./scripts/getAmazonProducts");
const Blog = require("./db/models/blog");
const Product = require("./db/models/product");
const delay = require("./helpers/delay");
const mongoose = require("mongoose");

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

const generateBlogWithProducts = async (searchTerm) => {
  console.log("start");
  const obj = {};
  let blog;
  try {
    blog = await generateBlog(searchTerm);
  } catch (e) {
    delay(600);
    blog = await generateBlog(searchTerm);
  }
  const image = await getBlogImage(searchTerm);
  const youtubeLink = await getYoutubeLink(searchTerm);
  let products;
  try {
    products = await getAmazonProducts(searchTerm);
  } catch (e) {
    products = await getAmazonProducts(searchTerm);
  }
  await delay(3);

  obj.blog = blog;
  obj.blog.mainImage = image;
  obj.blog.youtubeLink = youtubeLink;
  /**manual data will be changed later  */
  obj.blog.category = "hair product";
  // upload to db ;
  const newBlog = new Blog(obj.blog);
  await newBlog.save();

  obj.products = products;
  let newProduct;
  if (obj.products.length > 0) {
    for (let i = 0; i < obj.products.length; i++) {
      newProduct = new Product(obj.products[i]);
      await newProduct.save();
      await delay(2);
      newBlog.products.push(newProduct._id);
      await newBlog.save();
    }
  }

  await delay(30);
  return { newBlog, newProduct };
};
var hairProducts = [
  "Shampoo",
  "Conditioner",
  "Leave-in Conditioner",
  "Deep Conditioner",
  "Hair Oil",
  "Hair Mask",
  "Hair Serum",
  "Dry Shampoo",
  "Hair Spray",
  "Hair Gel",
  "Mousse",
  "Hair Wax",
  "Hair Cream",
  "Hair Pomade",
  "Heat Protectant Spray",
  "Hair Detangler",
  "Hair Brush",
  "Hair Dryer",
  "Flat Iron",
  "Curling Iron",
  "Hot Rollers",
  "Hair Ties",
  "Bobby Pins",
  "Hair Clips",
  "Hair Color",
  "Hair Growth Serum",
  "Hair Growth Shampoo",
  "Hair Growth Conditioner",
  "Beard Oil",
  "Beard Balm",
  "Beard Shampoo",
  "Beard Conditioner",
  "Beard Trimmer",
  "Hair Removal Cream",
  "Eyebrow Gel",
  "Lash Serum",
  "False Lashes",
  "Mascara",
  "Lipstick",
  "Lip Balm",
  "Blush",
  "Bronzer",
  "Highlighter",
  "Setting Powder",
  "Setting Spray",
  "Foundation",
  "Concealer",
  "Pressed Powder",
  "Loose Powder",
  "Makeup Remover",
  "Nail Polish",
  "Nail Polish Remover",
  "Cuticle Oil",
  "Hand Cream",
  "Foot Cream",
  "Body Lotion",
  "Body Wash",
];

(async () => {
  for (let i = 18; i < hairProducts.length; i++) {
    try {
      await generateBlogWithProducts(`${hairProducts[i]}`);
    } catch (e) {
      console.log(e);
    }
    console.log(`done index :${i}`);
  }
})();
