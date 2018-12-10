var express = require('express');
var router = express.Router();

var user = require('../controller/user');

/* GET /users/?username=?&password=? */
router.get('/', function(req, res, next) {
  var username = req.query['username'];
  var password = req.query['password'];
  user.findOne(username, password, function (err, user) {
    if (err) return res.status(500).send(err);
    if (!user) return res.status(400).send('no user');
    return res.send(user);
  });
});

module.exports = router;
