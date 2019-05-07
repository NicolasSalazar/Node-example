const express = require('express');
const router = express.Router();

const User = require('../models/user');

const passport = require('passport');
 
router.get('/user/singin', (req, res)=>{
    res.render('user/singin');
});

router.post('/user/singin', passport.authenticate('local',{
    successRedirect: '/notes',
    failureRedirect: '/user/singin',
    failureFlash: true
    
}));

router.get('/user/singup', (req, res) =>{
    res.render('user/singup');
})

router.post('/user/singup',async (req, res) =>{
    const { name,email, password, confirm_password } = req.body;
    const errors = [];
    if(name.length <= 0){
        errors.push({text: 'Ingrese el nombre de usuario'});
    }
    if(email.length <= 0){
        errors.push({text: 'Ingrese el email'});
    }
    if(password.length <= 0){
        errors.push({text: 'Ingrese la cotraseña'});
    }
    if(confirm_password.length <= 0){
        errors.push({text: 'Ingrese la confirmacion de la contraseña'});
    }
    if(password != confirm_password){
        errors.push({text: 'Contraseña incorrecta'});
    }
    if(password.length < 4){
        errors.push({text:'La contraseña deveria ser mayor a 4 caracteres'});
    }
    if(errors.length > 0){
        res.render('user/singup',{errors,name,email,password,confirm_password});
    }else{
        const emailUser = await User.findOne({email: email});
        if(emailUser){
            req.flash('error_msg','El correo ya esta registrado');
            res.redirect('/user/singup');
        }
        const newUser = new User({name, email, password});
       newUser.password = await newUser.encryptPassword(password);
        await newUser.save();
        req.flash('success_msg', 'Estas registrado');
        res.redirect('/user/singin')
    }   
});

router.get('/user/logout', (req,res)=>{
    req.logout();
    res.redirect('/');
})

module.exports = router;