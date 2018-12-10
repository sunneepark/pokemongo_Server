var db = require('./db');

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
}