const mongoose = require("mongoose");
const Product = require("./product");
const Schema = mongoose.Schema;
const blogSchema = new Schema({
  title: {
    type: String,
    require: true,
  },
  mainImage: {
    type: String,
    require: true,
  },
  intro: {
    type: String,
    require: true,
  },
  category: {
    type: String,
  },
  advantages: {
    type: Array,
    require: true,
  },
  disadvantages: {
    type: Array,
    require: true,
  },
  youtubeLink: String,
  products: [{ type: Schema.Types.ObjectId, ref: Product }],
});
module.exports = mongoose.model("Blog", blogSchema);
