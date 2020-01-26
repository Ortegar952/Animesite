const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//load user Model
const user = require('../models/User');


module.exports = function(passport){
    passport.use(
        new localStrategy({ usernameField: 'email'}, (email, password, done)=>{
            //match user 
            user.findOne({email: email })
                .then(user =>{
                    if(!user){
                      return done(null,false, {message: 'that email is not registered'})
                    }

                    //Match password
                    bcrypt.compare(password,user.password, (err, isMatch)=>{
                        if(err) throw err;

                        if(isMatch){
                            return done(null,user);
                        }else{
                            return done(null, false, {message: 'Password Incorrect'});
                        }
                    });
                })
                .catch(err => console.log(err));
        })
    );

    passport.serializeUser((user, done)=>{
        done(null, user.id);
    });

    passport.deserializeUser((id, done)=>{
        user.findById(id, function(err,user){
            done(err,user);
        });
    });

}