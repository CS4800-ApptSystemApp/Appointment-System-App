// PACKAGES
const express = require("express"),
  router = express.Router(),
  mtg = require("mtgsdk"),
  Card = require("../models/card"),
  Group = require("../models/card_group"),
  mongoose = require("mongoose"),
  db_keys = require("../config/db_keys");

var addedCards = [], 
  searchResults = [], 
  currentCollection = [],
  groups = []; //contains card groups

Card.find({}, (err, cards) => {
  if (err) {
    console.log(err);
    res.status(500).send();
  } else {
    currentCollection = cards.slice();
  }
});

// FOR READING TESTING DATA //
var fs = require("fs");
var data = fs.readFileSync("./temp/data.json");
var decks = JSON.parse(data);

// CONNECT TO MONGODB ATLAS //
mongoose.connect(db_keys.mongo_uri_users, { useNewUrlParser: true, useUnifiedTopology: true });

// GET REQUESTS //
router
  .get("/", (req, res) => {
    //render available groupings
    searchResults = []; //initialize searchResults
    addedCards = []; //initialize addedCards
    // get decks
    res.render("dashboard");
  })
  .get("/editCollection", (req, res, next) => {    

    //GROUP TEST DATA SET//
    groups = [];
    let start=0;
    for(let i = 0; i < 10; i++) {
      groups.push({deckName:"Group# " + i, cards:[]})
      for(let j = start; j < start+60; j++) {
        groups[i].cards.push(currentCollection[j]);
      }
      start += 60;
    } //GROUP TEST DATA SET//
    
    res.render("editCollection", {
      groups:groups,
      currentCollection: currentCollection,
      searchResults: searchResults,
      addedCards: addedCards
    })
  })
  .get("/allCards", (req, res) => {
    Card.find((err, cards) => {
      if (err) {
        console.log(err);
      } else {
        currentCollection = cards.slice();
        res.render("dashboard", { cards: cards });
      }
    });
  })
  .get("/userDecks", function(req, res) {
    res.render("userDecks", { decks: decks });
  })
  .get("/testCollection", (req, res) => {
    res.render("testCollection");
  });

// POST REQUESTS //
router
  .post("/editCollection/addGroup", (req,res,next)=> {
    console.log("Ready to add groups");
    res.redirect("/editCollection")
  })

  .post("/editCollection/searchCards", (req, res, next) => {
    searchCards(req.body.searchKey, res);
  })
  .post("/editCollection/addCards", (req, res, next) => {
    let id = req.body.id;
    let card = searchResults.find(card => {
      return id.localeCompare(card.id) === 0;
    });
    addedCards.push(card);
    res.send({ card: card }); //TODO: refactor? no need to send back. access card object from client
  })
  .post("/editCollection/removeCards", (req, res, next) => {
    let id = req.body.id;
    addedCards = addedCards.filter(card => {
      return id.localeCompare(card.id) !== 0;
    });
    res.redirect("/editCollection")
  })
  .post("/testCollection", (req, res, next) => {
    let query = req.body.searchkey;
    mtg.card.where({ supertypes: query }).then(cards => {});
  });

  // TEMPORARY ROUTE(S) //
  router.post("/populate", (req, res)=> {
    mtg.card.where({ name: req.body.searchKey }).then(birds => {
      birds.map((card)=> {
        Card.create(
          {
            id: card.id,
            name: card.name,
            manaCost: card.cmc,
            rarity: card.rarity,
            imageUrl: card.imageUrl,
            text: card.text
          }
        )
      })
    });
    res.redirect("/dashboard");
  });
  
// FUNCTIONS : NEEDS REFACTORING //
async function searchCards(key, res) {
  let promise = mtg.card.where({ name: key }).then(cards => {
    return cards;
  });
  searchResults = await promise;
  searchResults = searchResults.map(card => {
    return {
      id: card.id,
      name: card.name,
      convertedManaCost: card.cmc,
      rarity: card.rarity,
      imageUrl: card.imageUrl,
      text: card.text
    };
  });
  res.redirect("/dashboard/editCollection");
}

module.exports = router;
