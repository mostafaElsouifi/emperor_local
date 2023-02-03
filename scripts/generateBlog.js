const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();
const OpenAIApiKey = process.env.OPENAI_API_KEY;
const configuration = new Configuration({
  apiKey: OpenAIApiKey,
});

const getArrayFromResult = require("../helpers/getArrayFromResult");
// instructions
const getBlogTitle = "Write blog title about ";
const getBlogIntro = "Write blog introduction about ";
const getBlogAdvantages = "write advantages of ";
const getBlogDisadvantages = "write disadvantages of ";

module.exports = generateBlog = async (blogTerm) => {
  let blogTitle = await getData(getBlogTitle + blogTerm);
  blogTitle = blogTitle.trim();
  let blogIntro = await getData(getBlogIntro + blogTerm);
  blogIntro = blogIntro.trim();
  let blogAdvantages = await getData(
    getBlogAdvantages +
      blogTerm +
      " and return the result only in  array structure elements starting from 0 index contain only the advantages"
  );
  blogAdvantages = getArrayFromResult(blogAdvantages);
  let blogDisadvantages = await getData(
    getBlogDisadvantages +
      blogTerm +
      " and return the result only in  array structure elements starting from 0 index contain only the disadvantages"
  );
  blogDisadvantages = getArrayFromResult(blogDisadvantages);
  return {
    title: blogTitle,
    intro: blogIntro,
    advantages: blogAdvantages,
    disadvantages: blogDisadvantages,
  };
};

async function getData(prompt) {
  const openai = new OpenAIApi(configuration);
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    max_tokens: 1000,
  });
  return response.data.choices[0].text;
}
