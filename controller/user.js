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
                return next(null, results.length ? results[0] : null);
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
        )
    })
}