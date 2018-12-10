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