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
            'CALL CATCH_POKEMON(?, ?, ?)',
            [userId, pokemonId, ballType],
            function (err, results) {
                if (err) return next(err);
                return next(null, results);
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
                return next(null, [results[getRandomInt(0, results.length)], results[getRandomInt(0, results.length)]]);
            }
        );
    });
};

exports.evolve = function (userId, pokemonSeq, next) {
    db.connection(function (err, connection) {
        if (err) return next(err);
        connection.query(
            'SELECT EVOLVE_POKEMON(?, ?) AS `code`',
            [userId, pokemonSeq],
            function (err, results) {
                if (err) return next(err);
                return next(null, results[0]['code']);
            }
        );
    });
};