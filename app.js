//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb://127.0.0.1:27017/blogDB",{useNewUrlParser: true,useUnifiedTopology: true,});

const postSchema = {
  titleInput:String,
  postInput:String
}

const Post = mongoose.model("Post",postSchema);


// home
app.get("/",function(req,res){
  Post.find().then(function(postArray){
    res.render("home",{homeStartingContent:homeStartingContent,postArray:postArray});
  }).catch(function(err){
    console.log(err);
  });
});
// about
app.get("/about",function(req,res){
  res.render("about",{aboutContent:aboutContent});
});
// contact
app.get("/contact",function(req,res){
  res.render("contact",{contactContent:contactContent});
});

app.get("/compose",function(req,res){
  res.render("compose");
})

app.post("/compose",function(req,res){
  const post = new Post ({
    titleInput:req.body.titleInput,
    postInput:req.body.postInput
  });

  post.save().then(function(){
    console.log("Post added to DB");
    res.redirect("/");
  }).catch(function(err){
    res.status(400).send("Unable to save post to database");
  });
})

app.get("/posts/:postId",function(req,res){
  // req.params.postId
  const requestedPostId =(req.params.postId);

  Post.findOne({_id:requestedPostId}).then(function(postArray){
      res.render("post",{titleOfPost:postArray.titleInput,contentOfPost:postArray.postInput})
  });

   
  // or without any lodash case using (but you have to prefer lodash one)

  // for(i=0;i<postArray.length;i++){
  //   if(postArray[i].titleInput === req.params.postingUrl){
  //     console.log("Matched");
  //   }else{
  //     console.log("check your code");
  //   }
  // }
    /* OR
          postArray.forEach(function(post){
            const storedTitle = post.titleInput;

            if (storedTitle === req.params.posingUrl){
              console.log("Mathced");
            }
          })
    */

})


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
