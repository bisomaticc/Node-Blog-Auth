const express = require('express');
const router= express.Router();
const bcrypt= require('bcryptjs')
const passport = require('passport')
const User = require('../models/User')
const  {forwardAuthenticated}= require('..config/auth.js')

router.get('/login',forwardAuthenticated,(req,res)=>res.render('login'))

router.get('/register',forwardAuthenticated,(req,res)=> res.render('register'))

router.get('/register',(req,res)=>{
    const { name,email,password, password2}= req.body;
    let errors=[];

    if (!name || !email || !password || !password2){
        errors.push({msg: 'enter all fields'})
    }
    if(password!=password2){
        errors.push({msg: 'Passwords don not match'})
    }
    if(password.lenght<6){
        errors.push({msg: 'password should be longer then 6 characters'})
    }

    if(errors.lenght>0){
        res.render('register',{
            errors,name,email,password,password2
        })
    }else{
        User.findOne({email:email}).then(user=>{
            if(user){
                errors.push({msg:'Email already registered'})
                res.render('register',{
                    errors,name,email,password,password2
                })
            }else{
                const newUser = new User({
                    name,email,password
                })
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                      if (err) throw err;
                      newUser.password = hash;
                      newUser
                        .save()
                        .then(user => {
                          req.flash(
                            'success_msg',
                            'You are now registered and can log in'
                          );
                          res.redirect('/users/login');
                        })
                        .catch(err => console.log(err));
                    });

                })
            }
        })
    }
})

router.post('/createNew',ensureAuthenticated,(req,res)=>{
    res.render('blog')
    const{title,content}=req.body
    const newblog= new blog({
        title,content
    })
    newblog.save().then(()=>{
        res.send('Post created')
    })
.catch((error)=>{
    console.error('Error creating blog post:', error);
    res.status(500).send('Internal server error');
})
})
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/dashboard',
      failureRedirect: '/users/login',
      failureFlash: true
    })(req, res, next);
  });
  
  // Logout
  router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
  });
  
  module.exports = router;