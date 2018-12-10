var express = require('express');
var router = express.Router();

var pokemon = require('../controller/pokemon');

router.get('/', function (req, res, next) {
    pokemon.allPokemons(function (err, pokemons) {
        if (err) return res.status(500).send(err);
        return res.send(pokemons);
    });
});

/* 포켓몬 포획 */
router.get('/catch', function (req, res, next) {
    var userId = req.query['user_id'];
    var pokemonId = req.query['pokemon_id'];
    var ballType = req.query['ball_type'] ? req.query['ball_type'] : 1;
    pokemon.catch(userId, pokemonId, ballType, function (err, pokemons) {
        if (err) return res.status(500).send(err);
        return res.send({ 'code' : 200, 'message' : '성공적으로 포켓몬을 잡았습니다.' });
    });
});

/* 주변 포켓몬 목록 */
router.get('/nearby', function (req, res, next) {
    pokemon.nearbyPokemons(function (err, pokemons) {
        if (err) return res.status(500).send(err);
        return res.send(pokemons);
    });
});

module.exports = router;