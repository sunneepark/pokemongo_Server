var express = require('express');
var router = express.Router();

var pokemon = require('../controller/pokemon');

router.get('/', function (req, res, next) {
    pokemon.allPokemons(function (err, pokemons) {
        if (err) return res.send(err);
        return res.send(pokemons);
    })
})

module.exports = router;