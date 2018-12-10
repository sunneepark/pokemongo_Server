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

/* 포켓몬 진화 */
router.get('/evolve', function (req, res, next) {
    var userId = req.query['user_id'];
    var pokemonSeq = req.query['pokemon_seq'];
    pokemon.evolve(userId, pokemonSeq, function (err, resultCode) {
        if (err) return res.status(500).send(err);
        if (resultCode == 1) return res.status(400).send({ code : 400, message : '최종 진화 상태 포켓몬입니다.' });
        return res.send({ code : 200, message : '성공적으로 진화를 했습니다.' });
    });
});

module.exports = router;