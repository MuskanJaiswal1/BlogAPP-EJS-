// let posts = [];

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const homeStartingContent =
  "Welcome to our online daily journal, where you have the power to shape the narrative. Here, you're not just a reader but an active participant in the exchange of ideas and perspectives. Whether you're here to stay updated on the latest news, delve into thought-provoking opinion pieces, or contribute your own insights, this platform is your canvas. With the ability to add your own posts and engage with others' content, you become an integral part of our vibrant community. We believe in the freedom of expression and encourage diverse voices to be heard. Feel empowered to share your stories, spark discussions, and challenge prevailing norms. Together, let's create a space where dialogue thrives, ideas flourish, and connections are forged.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

mongoose.connect("mongodb://127.0.0.1:27017/blogDB");

const postSchema = {
  title: String,
  content: String,
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function (req, res) {
  (async () => {
    const posts = await Post.find();
    res.render("home", { homeStarting: homeStartingContent, posts: posts });
  })();
});

app.get("/about", function (req, res) {
  res.render("about", { about: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contact: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
  });
  // posts.push(post);
  (async () => {
    await post.save();
  })();
  res.redirect("/");
});

// app.post("/delete", function(req,res){
//   console.log(req.body.deletePost);
// });
app.post("/posts/:postId/delete", async (req, res) => {
  const postId = req.params.postId;

  try {
    await Post.findByIdAndDelete(postId);
    res.redirect("/");
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).send("Internal Server Error");
  }
});

// express routing parameters
app.get("/posts/:postName", function (req, res) {
  (async () => {
    const posts = await Post.find();
    posts.forEach(function (post) {
      if (_.kebabCase(post.title) === _.kebabCase(req.params.postName)) {
        res.render("post", {
          postTitle: post.title,
          postContent: post.content,
          postId: post._id
        });
      }
    });
  })();
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
