const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
//use model
const User = require('../models/User')


//login page
router.get('/login',(req,res) => res.render('login'));

//register
router.get('/register',(req,res) => res.render('register'));

//register handle
router.post('/register', (req, res) => {
    console.log('Users Information', req.body)
    // res.send('hello');
    const { name, email, password, password2 } = req.body;
    let errors = [];
    //check required fields
    if(!name || !email || !password || !password2){
        errors.push({mmsg: 'Please Fill in all Fields'});
    }

    //check password match
    if(password !== password2){
        errors.push({msg: 'Passwords Do Not Match'});
    }

    //check password length
    if(password.length < 6){
        errors.push({msg: 'Password must be at least 6 characters'});
    }

    if(errors.length > 0){
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        })
    }
    else{
        //validate passed
        User.findOne({email: email })
            .then(user => {
                if(user){
                    //user exists
                    errors.push({msg: 'Email is Already Registered'})
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    });
                    // console.log(newUser)
                    // res.send('hello');
                    //hash password
                    bcrypt.genSalt(10, (err, salt) => 
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        // set password to hashed
                        newUser.password = hash;
                        //save user
                        newUser.save()
                            .then(user =>{
                                req.flash('sucess_msg', 'You are now registered and can log in');
                                res.redirect('/users/login');
                            })
                            .catch(err => console.log('following error', err));

                    }))
                }
            });
    }
});

//login handle
router.post('/login', (req, res, next) =>{
    passport.authenticate('local',{
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

//logout handle
router.get('/logout', (req, res)=>{
    req.logout();
    req.flash('success_msg','You are logged out');
    res.redirect('/users/login')
})


module.exports = router;
