//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var _ = require("lodash");
const mongoose = require("mongoose");
const dotenv = require('dotenv').config();

const homeStartingContent = "Welcome to DAILY JOURNAL, the digital realm where words dance, ideas soar, and creativity knows no bounds. Here, we believe that every person has a unique story to tell and a distinctive voice to share with the world. Whether you're an aspiring writer, a seasoned wordsmith, or simply a curious soul seeking inspiration, this is the place where imagination thrives.";
const aboutContent = {
  aboutWhat:"Title: Welcome to DAILY JOURNAL",
  aboutIntro:"Introduction: Welcome to DAILY JOURNAL, the digital realm where words dance, ideas soar, and creativity knows no bounds. Here, we believe that every person has a unique story to tell and a distinctive voice to share with the world. Whether you're an aspiring writer, a seasoned wordsmith, or simply a curious soul seeking inspiration, this is the place where imagination thrives."
};
const contactContent = {
  Address:"Address:Shahibaugh,Ahmedabad,Gujarat-380004",
  Email:"Email:sahildutt148@gmail.com"
}
const mongoUrl=process.env.MONGODB_CONNECT;
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect(mongoUrl,{useNewUrlParser: true,useUnifiedTopology: true,});

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

const PORT = process.env.PORT;
if(PORT == "" || PORT == "3000"){
  PORT=3000
}
app.listen(PORT, function() {
  console.log("Server started on port " + PORT);
});
