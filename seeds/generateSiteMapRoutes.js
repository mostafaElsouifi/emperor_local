require("dotenv").config();
const mongoose = require("mongoose");
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

const generateSiteMapIds = async () => {
  const blogs = await Blog.find({});
  const blogsRoutes = blogs.map((b) => `blogs/${b._id}`);
  return blogsRoutes;
};

generateSiteMapIds().then((d) => {
  console.log(d);
});
