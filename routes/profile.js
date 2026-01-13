const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/isAuthenticated');

router.get('/', isAuthenticated, async (req, res) => {
  const user = req.session.user;
  
  res.render('profile', { user});
});
let hungerLevel = 100;
const hungerDecrementAmount = 3;
const hungerDecrementInterval = 2000;

router.use(express.static('public'));

router.get('/hunger', (req, res) => {
    res.json({ hunger: hungerLevel });
});

router.post('/feed', (req, res) => {
    hungerLevel = 100;
    res.json({ hunger: hungerLevel });
});

function decrementHunger() {
    hungerLevel -= hungerDecrementAmount;
    if (hungerLevel < 0) {
        hungerLevel = 0;
    }
    console.log(`Hunger level: ${hungerLevel}`);
}

setInterval(decrementHunger, hungerDecrementInterval);


module.exports = router;
