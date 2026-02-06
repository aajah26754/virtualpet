const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/isAuthenticated');
const inventory = require('modules/inventory.js');

router.get('/', isAuthenticated, async (req, res) => {
  const pets = await inventory.getInventoryForUser(req.session.user.username);
  
  res.render('profile', {
    user: req.session.user,
    pets
  });
});


router.use(express.static('public'));



module.exports = router;
