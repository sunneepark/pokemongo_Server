var db = require('./db');
var crypto = require('crypto');

/* username과 password로 유저 모델 하나를 불러오는 함수 */
exports.findOne = function (username, password, next) {
    var sha256 = crypto.createHash('sha256');
    sha256.update(password);
    password = sha256.digest('hex');
    db.connection(function (err, connection) {
        if (err) return next(err);
        connection.query(
            'SELECT * FROM `USER` WHERE `username` = ? AND `password` = ?',
            [username, password],
            function (err, results) {
                if (err) return next(err);
                var user = results.length ? results[0] : null;
                if (user && user['partner_pokemon_seq']) {
                    connection.query(
                        'SELECT `pokemon_name` AS `partner_pokemon_name`\
                        FROM `USER`, `POKEMON`, `POKEMON_BOX`\
                        WHERE `USER`.`user_id` = ?\
                        AND `USER`.`partner_pokemon_seq` = `POKEMON_BOX`.`pokemon_seq`\
                        AND `POKEMON_BOX`.`pokemon_id` = `POKEMON`.`pokemon_id`',
                        [user['user_id']],
                        function (err, partnerPokemons) {
                            if (err) return next(err);
                            delete user['partner_pokemon_seq'];
                            user['partner_pokemon'] = partnerPokemons.length ? partnerPokemons[0]['partner_pokemon_name'] : null;
                            return next(null, user);
                        }
                    );
                } else {
                    return next(null, user);
                }
            });
    });
};

/* 유저가 가진 아이템 리스트를 가져오는 함수 */
exports.getItems = function (userId, next) {
    db.connection(function (err, connection) {
        if (err) return next(err);
        connection.query(
            'SELECT `item_name`, `amount`\
            FROM `USER`, `BAG`, `ITEM`\
            WHERE `USER`.`user_id` = ?\
            AND `USER`.`user_id` = `BAG`.`user_id`\
            AND `BAG`.`item_id` = `ITEM`.`item_id`',
            [userId],
            function (err, results) {
                if (err) return next(err);
                return next(null, results.length ? results : []);
            }
        );
    });
};

/* 유저가 가진 포켓몬들 */
exports.getPokemons = function (userId, next) {
    db.connection(function (err, connection) {
        if (err) return next(err);
        connection.query(
            'SELECT `pokemon_name` AS `name`,\
            `combat_point` AS `cp`,\
            `health_point` AS `hp`,\
            `weight`, `height`,\
            `pokemon_level` AS `level`,\
            `created_at` AS `catched_at`,\
            (SELECT attack_name FROM `POKEMON_BOX`, `POKEMON_ATTACK_SPEC`\
            WHERE `POKEMON_ATTACK_SPEC`.`attack_id` = `POKEMON_BOX`.`normal_attack_id`)\
            AS normal_attack_name,\
            (SELECT attack_name AS special_attack_name FROM `POKEMON_BOX`, `POKEMON_ATTACK_SPEC`\
            WHERE `POKEMON_ATTACK_SPEC`.`attack_id` = `POKEMON_BOX`.`speical_attack_id`)\
            AS special_attack_name\
            FROM `POKEMON_BOX`, `POKEMON`\
            WHERE `POKEMON_BOX`.`user_id` = ?\
            AND `POKEMON_BOX`.`deletion_method` IS NULL\
            AND `POKEMON_BOX`.`pokemon_id` = `POKEMON`.`pokemon_id`',
            [userId],
            function (err, results) {
                if (err) return next(err);
                return next(null, results.length ? results : []);
            }
        );
    });
};