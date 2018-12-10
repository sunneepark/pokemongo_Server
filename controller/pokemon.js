var db = require('./db');

/* min ~ max 사이의 임의의 정수 반환 */
var getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

exports.allPokemons = function (next) {
    db.connection(function (err, connection) {
        if (err) return next(err);
        connection.query(
            'SELECT * FROM `POKEMON`',
            function (err, results) {
                if (err) return next(err);
                return next(null, results);
            });
    });
};

exports.catch = function (userId, pokemonId, ballType, next) {
    db.connection(function (err, connection) {
        if (err) return next(err);
        connection.query(
            'CATCH_POKEMON(?, ?, ?)',
            [userId, pokemonId, ballType],
            function (err, results) {
                if (err) return next(err);
            }
        );
    });
};

exports.nearbyPokemons = function (next) {
    db.connection(function (err, connection) {
        if (err) return next(err);
        connection.query(
            'SELECT `pokemon_id`, `pokemon_name` FROM `POKEMON`',
            function (err, results) {
                if (err) return next(err);
                return next([results[getRandomInt(0, results.length)], results[getRandomInt(0, results.length)]]);
            }
        );
    })
};