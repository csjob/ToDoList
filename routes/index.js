var express = require('express');
var router = express.Router();

// var alert = require('alert');


//taking database connection
var db = require('../config/connection');
//taking collections
var collections = require('../config/collections');

//require bycrypt
const bcrypt = require('bcrypt');

/* GET home page. */
router.get('/', function(req, res, next) {
  
  res.render('index', { title: 'TODO LIST' });
});


router.get('/signup-in', function(req, res, next) {
  
  res.render('signup-in', { title: 'TODO LIST' });
});

//for getting the signup page
router.post('/signup', (req, res) => {

  function doSignup(userData){
    return new Promise( async (resolve, reject) => {
    userData.password = await bcrypt.hash(userData.password, 10);
    db.getDb().collection(collections.USER_COLLECTION).insertOne(userData, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
        req.session.message = {
          type: 'success',
          intro: 'Hurrah! ',
          text: 'User Registration Successful. Please Sign In to continue.'
        }
        res.redirect('/signup-in');
      }
    })
  })
  }

  doSignup(req.body).then((result) => {
    console.log(result);
  }).catch((err) => {
    console.log(err);
  })

})

//for getting the login page
router.post('/login', (req, res) => {

  function doLogin(userData){
    return new Promise( async (resolve, reject) => {
      let loginStatus = false;
      let response = {};
      let user = await db.getDb().collection(collections.USER_COLLECTION).findOne({email: userData.email})
      if(user){
        bcrypt.compare(userData.password, user.password).then((status)=>{
          if(status){
            console.log('login success');
            loginStatus = true;
            response.user = user;
            response.status = true;
            resolve(response);
           
          }else{
            console.log('login failed');
            loginStatus = false;
            response.status = false;
            resolve(response);
           
          }
        })
      }else{
        console.log('login failed');
        loginStatus = false;
        response.status = false;
        resolve(response);
        // alert("Invalid Email");
      }
    })
  }

  doLogin(req.body).then((result) => {
    console.log(result);
    if(result.status){
      req.session.user = result.user;
      req.session.loggedIn = true;
      res.redirect('/dashboard');
    }else{
      
      req.session.message = {
        type: 'danger',
        intro: 'Sorry! ',
        text: 'Invalid Email or Password'
      }
      res.redirect('/signup-in');
    }
  }).catch((err) => {
    console.log(err);
  })
})

router.get('/dashboard', (req, res) => {
  if(req.session.loggedIn){ 
    res.render('dashboard', { title: 'TODO LIST', user: req.session.user });
    console.log(req.session.user);
  }else{
    res.redirect('/signup-in');
  }
})

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
})

module.exports = router;
