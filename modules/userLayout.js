function layoutUser(req) {
  const u = req && req.session && req.session.user ? req.session.user : null;
  return {
    loggedIn: !!u,
    username: u ? u.username : null,
    id: u ? u.id : null,
    nav: [
      { href: '/', label: 'Home' },
      { href: '/chat', label: 'chat' },
      { href: '/profile', label: 'Profile' }
    ]
  };
}
module.exports = layoutUser;
