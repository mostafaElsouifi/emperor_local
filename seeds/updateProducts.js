require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../db/models/product");
const Blog = require("../db/models/blog");
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

const deleteNotAffProducts = async () => {
  let allProducts = await Product.find({});
  // filter all products without affiliate links
  allProducts = allProducts.filter((p) => !p.affiliateLink);
  // return array with all products to be removed

  let productsIds = allProducts.map((p) => p._id);
  await Product.deleteMany().where("_id").in(productsIds).exec();
};

const deleteProductsWithoutNames = async () => {
  let allProducts = await Product.find({});
  // filter all products without affiliate links
  allProducts = allProducts.filter((p) => !p.name);
  // return array with all products to be removed

  let productsIds = allProducts.map((p) => p._id);
  console.log(productsIds);
  await Product.deleteMany().where("_id").in(productsIds).exec();
};

const deleteBlogs = async () => {
  let allBlogs = await Blog.find({ category: "shose" });
  // filter all products without affiliate links
  // allBlogs = allBlogs.filter((b) => b.products.length === 0);
  // return array with all products to be removed

  let blogsIds = allBlogs.map((b) => b._id);
  await Blog.deleteMany().where("_id").in(blogsIds).exec();
};
deleteNotAffProducts();
