const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js"); //exporting the module
const mongoose = require("mongoose");
var _ = require('lodash');
const app = express();
app.set('view engine', 'ejs'); //sets view engine to ejs.
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

let new_item = [];
// var workList=[];

mongoose.connect("mongodb+srv://admin-saksham:test123@cluster0.avz9t.mongodb.net/toDoListDB?retryWrites=true&w=majority");

const itemsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});
const Item = mongoose.model("Item", itemsSchema);

const code = new Item({
  name: "code"
});

const eat = new Item({
  name: "eat"
});

const sleep = new Item({
  name: "sleep"
});
let defaultArray = [code, eat, sleep];

const listsSchema = new mongoose.Schema({
  name: String,
  list: [itemsSchema]
});

const List = mongoose.model("List", listsSchema);



app.get("/", function(req, res) {
  Item.find(function(err, items) {
    if (err) {
      console.log(err);
            }
    else {

      if (items.length === 0) {
        Item.insertMany(defaultArray, function(err) {
          if (err) {
            console.log(err);
          } else {
            console.log("success");
          }
        });
        res.redirect("/");
      }
      else {
        let dayType = date.getDay();
        //in response we render a html template named index.ejs and replace a marker named day with daytype
        //ejs looks for index file in a folder named views
        res.render("index", {
          listTitle: dayType,
          item: items
        });
      }
    }
  });

})



app.get("/:listTitle", function(req, res) {
  const newListTitle =_.capitalize(req.params.listTitle);
  List.findOne({
    name: newListTitle
  }, function(err, item) {
    if (err) {
      console.log(err);
    } else {
      // items.forEach(function(item){
      //   new_item.push(item.name);
      // });
      if (!item) {
        const newList = new List({
          name: newListTitle,
          list: defaultArray
        });

        newList.save();
        res.redirect("/" + newListTitle);
      } else {

        res.render("index", {
          listTitle: item.name,
          item: item.list
        });
      }
    }
  });

});

app.post("/", function(req, res) {
  let dayType = date.getDay();
  const curr_item = req.body.list_item;
  const listName=req.body.button;
  const item = new Item({
    name: curr_item
  });
  if (req.body.button === dayType) {
     item.save();
     res.redirect("/");

  } else {
    const curr_item = req.body.list_item;

    // const item = new Item({
    //   name: curr_item
    // });

    List.findOneAndUpdate({name:listName},{$push:{list:item}},function(err){
      if(err){
        console.log(err);
      }
      else{
        console.log("adding done");
        res.redirect("/"+listName);

      }
    });



  }

});
app.post("/delete", function(req, res) {
  const itemChecked = req.body.checkbox;
  const listName=req.body.listName;
  // console.log(listName);
let dayType = date.getDay();

if(listName===dayType)
{
  Item.findByIdAndRemove({
    _id: itemChecked
  }, function(err) {
    if (err) {
      console.log(err);
    } else {

      console.log("successfully deleted");
      res.redirect("/");
    }
  });
}

else
{
  List.findOneAndUpdate({name:listName},{$pull:{list:{_id:itemChecked}}},function(err){
    if(err){
      console.log(err);
    }
    else{
      console.log("delete done");
      res.redirect("/"+listName);

    }
  });
}


});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}


app.listen(port, function() {
  console.log("server is up n runnig");
})
