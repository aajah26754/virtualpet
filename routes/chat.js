const express = require('express');
const router = express.Router();

router.get('/chat', (req, res) => {
  res.render('chat', { user: req.session.user || null });
});

module.exports = router;
