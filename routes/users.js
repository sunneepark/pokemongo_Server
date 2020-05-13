var express = require('express');
var router = express.Router();

var user = require('../controller/user');

/* GET /users/?username=?&password=? */
router.get('/', function(req, res, next) {
  var username = req.query['username'];
  var password = req.query['password'];
  user.findOne(username, password, function (err, user) {
    if (err) return res.status(500).send(err);
    if (!user) return res.status(400).send({
      'code' : 400,
      'message' : '사용자가 없습니다. ID / PW를 확인해주세요.'
    });
    return res.send({
      'code':200,
      'message':'로그인 성공',
      user
    });
  });
});

/* GET /users/:user_id/bag */
router.get('/:user_id/bag', function (req, res, next) {
  var userId = req.params['user_id'];
  user.getItems(userId, function (err, items) {
    if (err) return res.status(500).send(err);
    return res.send({items:items});
  });
});

/* GET /users/:user_id/pokemons */
router.get('/:user_id/pokemons', function(req, res, next) {
  var userId = req.params['user_id'];
  user.getPokemons(userId, function (err, pokemons) {
    if (err) return res.status(500).send(err);
    return res.send({pokemons:pokemons});
  });
});

module.exports = router;
