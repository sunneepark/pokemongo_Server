var db = require('./db');

/* min ~ max 사이의 임의의 정수 반환 */
var getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
};

exports.gymname = function (gym_id, next) {
    db.connection(function (err, connection) {
        if (err) return next(err);
        connection.query(
            'SELECT `title`\
             FROM `POKESTOP`\
              WHERE `pokestop_id`=?',
            [gym_id],
            function (err, name) {
                if (err) return next(err);
                return next(null, name);
            });
    });
};

exports.gymPokemons = function (gym_id, next) {
    db.connection(function (err, connection) {
        if (err) return next(err);
        connection.query(
            'SELECT `p`.`pokemon_name`, `b`.`combat_point`\
             FROM `POKEMON_BOX` `b`, `POKEMON` `p`\
              WHERE `p`.`pokemon_id`=`b`.`pokemon_id` and (`user_id`,`pokemon_seq`)\
               IN (SELECT `user_id`, `pokemon_seq` FROM `GYM_POKEMON` `g` where `g`.`gym_id`=?)',
            [gym_id],
            function (err, results) {
                if (err) return next(err);
                return next(null, results);
            }
        );
    });
};

exports.nearbyGyms = function (next) {
    db.connection(function (err, connection) {
        if (err) return next(err);
        connection.query(
            'SELECT `gym_id`, `title`\
            FROM `GYM`, `POKESTOP`\
            WHERE `POKESTOP`.`pokestop_type` = 2\
            AND `POKESTOP`.`pokestop_id` = `GYM`.`gym_id`',
            function (err, results) {
                if (err) return next(err);
                return next(null, results);
            });
    });  
};
