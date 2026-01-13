const express = require('express');
const router = express.Router();

router.get('/adoption', (req, res) => {
  res.render('adoption', { user: req.session.user || null });
});

module.exports = router;
