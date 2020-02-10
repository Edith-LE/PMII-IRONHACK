const express = require("express");
const router = express.Router();
const passport = require ('../config/passport')

const User = require ('../models/User')

router
.get('/signup',  (req, res) =>{
  res.render ('auth/signup')
});

router
.post('/signup',async (req, res) =>{
  const { name, email, password} = req.body
  if ( email === '' || password === "") {
    return res.render ('auth/signup', { 
      message: "Por favor indica el email y contraseña"})
  }

  const userOnDB =  await User.findOne({ email });
  if (userOnDB !== null) {
    res.render ('auth/signup', {message: "El correo  ya fue registrado"})
  }
  await User.register({ name, email }, password)
  res.redirect('/login')
}); 

router
.get ('/login', (req, res) =>{
  res.render('auth/login', { "message": req.flash ("error")})
});

router
.post('/login',
passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

function ensureLogin(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.redirect('/login');
  }
}

router
.get('/private-page', ensureLogin, (req, res, next)=>{
  res.render('/private', {user: req.user});
});



router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email"
    ]
  })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/profile",
    failureRedirect: "/login"
  })
);

router
.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

module.exports = router;