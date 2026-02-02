const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/isAuthenticated');

router.get('/', isAuthenticated, async (req, res) => {
  const user = req.session.user;
  
  res.render('profile', {user});
});


router.use(express.static('public'));



module.exports = router;
