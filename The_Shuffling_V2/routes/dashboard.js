// PACKAGES
const express = require("express"),
      router = express.Router(),
      mtg = require("mtgsdk"),
      Card = require("../models/card"),
      mongoose = require("mongoose"),
      db = require("../config/db_keys");

global.cards = {};

// FOR READING TESTING DATA //
var fs = require("fs");
var data = fs.readFileSync("./test/data.json");
var decks = JSON.parse(data);
// CONNECT TO MONGODB ATLAS //
mongoose.connect(db.mongo_uri_users, { useNewUrlParser: true, useUnifiedTopology:true });

router.get("/userDecks", function (req, res) {
  res.render("userDecks", { decks: decks });
});

router.get("/testCollection", (req, res) => {
  res.render("testCollection");
}).post("/testCollection", (req, res) => {
  let query = req.body.searchkey;
   mtg.card.where({ supertypes: query }).then(cards => {
    console.log(cards);
  });
})

function searchCards(searchKey, res) {
  mtg.card.where({ supertypes: searchKey})
  .then(cards => {
    var userName = "Fuh"
    res.render("dashboard", {userName: userName , cards:cards});
  });
}
router.get("/", (req, res) => {
  var userName = "Fuh"
  res.render("dashboard",{userName: userName});
}).post("/", (req, res, next) => {
  searchCards(req.body.searchKey, res);
})

module.exports = router;

// cards.map((card) => {
// Card.create(
//   {
//     name: card.name,
//     manaCost: card.manaCost,
//     rarity: card.rarity,
//     imageUrl: card.imageUrl,
//     text: text
//   }
// )
// })