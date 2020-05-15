const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/helpmeDB",{useNewUrlParser: true, useUnifiedTopology: true});

const answerSchema = new mongoose.Schema({
  name: String,
  content: String
});

const Answer = new mongoose.model("Answer", answerSchema);

const questionSchema = new mongoose.Schema({
  title: String,
  content: String,
  answers: [answerSchema]
});

const Question = new mongoose.model("Question", questionSchema);


const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

app.get("/", function(req,res){

  Question.find({}, function(err,foundQuestions){
    if (err){
      console.log(err);
    }else {
        res.render("home", {questions: foundQuestions});
    }
  });

});

app.get("/question/:questionId", function(req,res){
  const questionId = req.params.questionId;

  Question.findOne({_id : questionId}, function(err, foundQuestion){
    if (err){
      console.log(err);
    } else {
      res.render("question", {
        question: foundQuestion,
      });
    }
  });
});

app.post("/startDiscussion", function(req,res){
  res.render("newDiscussion");
});

app.post("/saveQuestion", function(req,res){
  const question = new Question({
    title: req.body.title,
    content: req.body.content
  });

  question.save(function(err){
    if (err){
      console.log(err);
    } else {
      console.log("Successfully created the question");
    }
  });
  res.redirect("/");
});

app.post("/updateQuestion/:questionId", function(req,res){

  const questionId = req.params.questionId;
  const answer = new Answer({
    name: "newUser",
    content: req.body.answer
  });

  Question.findOne({_id: questionId}, function(err, foundQuestion){
    if (err){
      console.log(err);
    } else {
      foundQuestion.answers.unshift(answer);
      foundQuestion.save(function(err){
        if(err){
          console.log(err);
        } else {
            console.log("Record updated Successfully");
        }
      });
    }
  });

  res.redirect("/question/"+questionId);
});

app.listen(3000,function(){
  console.log("Server running on the port 3000...");
});
