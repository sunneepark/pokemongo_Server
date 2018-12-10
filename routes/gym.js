var express = require('express');
var router = express.Router();

var gym = require('../controller/gym');

/* GET /gym/:gym_id/*/
router.get('/:gym_id', function(req, res, next) {
    var gymid = req.params['gym_id'];
    gym.gymPokemons(gymid, function (err, results) {
        gym.gymname(gymid, function (err, name) {
            if (err) return res.status(500).send(err);
            if (results.length==0) return res.send({
                'name':name[0].title,
                'messages' : "상주 포켓몬이 없습니다"
            });
            return res.send({
                'name':name[0].title,
                results
            });
        });
    });
  });

  module.exports = router;  

router.get('/nearby', function (req, res, next) {
    gym.nearbyGyms(function (err, gyms) {
        if (err) return res.status(500).send(err);
        return res.send(gyms);
    });
});

module.exports = router;
