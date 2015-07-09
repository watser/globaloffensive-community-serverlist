var express = require('express');
var router = express.Router();

var basicAuth = require('basic-auth');

var auth = function (req, res, next) {
  function unauthorized(res) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.send(401);
  };

  var user = basicAuth(req);

  if (!user || !user.name || !user.pass) {
    return unauthorized(res);
  };

  if (user.name === 'admin' && user.pass === 'password') {
    return next();
  } else {
    return unauthorized(res);
  };
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET Hello World page. */
router.get('/admin', function(req, res) {
    res.render('admin', { title: 'Hello, World!' });
});

/* GET New User page. */
router.get('/addserver', auth, function(req, res) {
    res.render('addserver', { title: 'Add New Server Info' });
});

/* GET Userlist page. */
router.get('/serverlist', function(req, res) {
    var db = req.db;
    var collection = db.get('servercollection');
    collection.find({},{},function(e,docs){
        res.render('serverlist', {
            "serverlist" : docs,
            title: '/r/GlobalOffensive Community Server List',
            credits: '/u/Johnny_Pone'
        });
    });
});

/* POST to Add User Service */
router.post('/addsrv', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var gameType = req.body.gametype;
    var serverName = req.body.servername;
    var serverLocation = req.body.serverlocation;
    var serverAddress = req.body.serveraddress;
    var redditLink = req.body.redditlink;

    // Set our collection
    var collection = db.get('servercollection');

    // Submit to the DB
    collection.insert({
        "gametype" : gameType,
        "servername" : serverName,
        "serverlocation" : serverLocation,
        "serveraddress" : serverAddress,
        "redditlink" : redditLink
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And forward to success page
            res.redirect("serverlist");
        }
    });
});

module.exports = router;
