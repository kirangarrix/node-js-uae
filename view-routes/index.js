var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res) {
  res.render('login', { title: 'Express' });

});   
router.get('/forgot-password', function(req, res) {
  res.render('forgot-password', { title: 'Express' });

});
router.get("/reset-password",function(req,res){
   res.render('reset-password');
})

module.exports = router;
