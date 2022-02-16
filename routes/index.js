var express = require('express');
var router = express.Router();
var MailHelper = require('../MailHelper/sendMail');
// var alert = require('alert');


//taking database connection
var db = require('../config/connection');
//taking collections
var collections = require('../config/collections');

//require bycrypt
const bcrypt = require('bcrypt');
const {
  response
} = require('express');

//create jwt token
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'secret';

//object Id
const ObjectId = require('mongodb').ObjectID;
const {
  ObjectID
} = require('bson');
const { tasks } = require('googleapis/build/src/apis/tasks');

//login middleware
const verifyLogin = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    res.redirect('/signup-in');
  }
}


/* GET home page. */
router.get('/', function (req, res, next) {

  res.render('index', {
    title: 'TODO LIST'
  });
});

//for getting the signup page
router.get('/signup-in', function (req, res) {
  if (req.session.loggedIn) {
    res.redirect('/dashboard');
  } else {
    res.render('signup-in', {
      title: 'TODO LIST'
    });
  }

});

//for signup page functionality
router.post('/signup', (req, res) => {

  function doSignup(userData) {
    return new Promise(async (resolve, reject) => {
      userData.password = await bcrypt.hash(userData.password, 10);
      db.getDb().collection(collections.USER_COLLECTION).insertOne(userData, (err, result) => {
        if (err) {
          reject(err);
        } else {

          req.session.message = {
            type: 'success',
            intro: 'Hurrah! ',
            text: 'User Registration Successful. Please Sign In to continue.'
          }
          res.redirect('/signup-in');
          resolve(result);
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

//for validating login credentials
router.post('/login', (req, res) => {

  function doLogin(userData) {
    return new Promise(async (resolve, reject) => {
      let loginStatus = false;
      let response = {};
      let user = await db.getDb().collection(collections.USER_COLLECTION).findOne({
        email: userData.email
      })
      if (user) {
        bcrypt.compare(userData.password, user.password).then((status) => {
          if (status) {
            console.log('login success');
            loginStatus = true;
            response.user = user;
            response.status = true;
            resolve(response);

          } else {
            console.log('login failed');
            loginStatus = false;
            response.status = false;
            resolve(response);

          }
        })
      } else {
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
    if (result.status) {
      req.session.user = result.user;
      req.session.loggedIn = true;
      res.redirect('/dashboard');
    } else {

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

router.get('/dashboard', verifyLogin, (req, res) => {
  if (req.session.loggedIn) {
    // res.render('dashboard', {
    //   title: 'TODO LIST',
    //   user: req.session.user
    // });

    //displaying tasks taking from todolist collection
     function getTasks() {
      return new Promise(async (resolve, reject) => {
        let tasks = await db.getDb().collection(collections.TODOLIST_COLLECTION).find({
          user: req.session.user._id
        }).toArray();
        resolve(tasks);
      })
    }
    getTasks().then((result) => {
      console.log(result);
      res.render('dashboard', {
        title: 'TODO LIST',
        user: req.session.user,
        tasks: result,
      });
     
    }).catch((err) => {
      console.log(err);
    })

  } else {
    res.redirect('/signup-in');
  }
})

// router.get('/dashboard',  (req, res) => {

//     res.render('dashboard', {
//       title: 'TODO LIST',
//     });

// })

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
})

//for getting the reset password page
router.get('/forgot-password', (req, res) => {
  res.render('forgot-password', {
    title: 'TODO LIST'
  });
})

//for setting the new password
router.post('/forgot-password', (req, res) => {
  function doForgotPassword(userData) {
    return new Promise(async (resolve, reject) => {
      let response = {};
      let user = await db.getDb().collection(collections.USER_COLLECTION).findOne({
        email: userData.email
      })
      if (user) {

        response.status = true;

        //email exists and send the reset password link
        const secret = JWT_SECRET + user.password;
        const payload = {
          email: user.email,
          _id: user._id
        };

        const token = jwt.sign(payload, secret, {
          expiresIn: '5m'
        });

        const link = `http://localhost:3000/reset-password/${user._id}/${token}`;

        // console.log(link);
        //console.log('Ema'+user.email);
       //mail1.mail1(link, user.email);

       //calling the mail function
       //MailHelper.mail1(link, user.email);
       MailHelper.sendEmail(link, user.email).then((result) => {
        console.log(result);
        response.status = true;
      }).catch((err) => {
        console.log(err);
        result.status = false;
      });

        resolve(response);
        
      } else {
        response.status = false;
        resolve(response);
      }
    })
  }

  doForgotPassword(req.body).then((result) => {

    if (result.status) {
      console.log(result);


      req.session.message = {
        type: 'success',
        intro: 'Hurrah! ',
        text: 'Please check your email for reset password link.'
      }
      res.redirect('/signup-in');

    } else {
      console.log(result);
      req.session.message = {
        type: 'danger',
        intro: 'Sorry! ',
        text: 'Invalid Email'
      }
      res.redirect('/forgot-password');
    }

  }).catch((err) => {
    console.log(err);
  })

})

//for resetting the password
router.get('/reset-password/:id/:token', (req, res) => {
  const {
    id,
    token
  } = req.params;
  // res.send(req.params);

  //check if the id and token is valid
  function doResetPassword(userData) {
    return new Promise(async (resolve, reject) => {
      let response = {};
      let user = await db.getDb().collection(collections.USER_COLLECTION).findOne({
        _id: ObjectID(userData.id)
      })

      if (user) {

        // console.log(ObjectID(userData.id).toString() );
        // console.log(ObjectID( user._id));
        if (user._id.toString() === ObjectID(userData.id).toString()) {
          console.log('id matched');
          // response.status = true;
          // resolve(response);
          const secret = JWT_SECRET + user.password;
          try {
            const payload = jwt.verify(token, secret);
            console.log('token verified');
            response.user = user;
            response.status = true;
            resolve(response);
          } catch (err) {
            response.status = false;
            console.log(err + "token not verified");
            resolve(response);
          }

        } else {
          console.log('id not matched');
          response.status = false;
          resolve(response);

        }

        //  
      }

    })
  }

  doResetPassword({
    id,
    token
  }).then((result) => {
    if (result.status) {
      res.render('reset-password', {
        title: 'TODO LIST',
        name: result.user.name.toUpperCase(),
      });

      // console.log(result.user.email);
      // console.log("result");
    } else {

      res.redirect('/signup-in');
    }
  }).catch((err) => {
    console.log(err);
  })

})

//for setting the new password after reset link is clicked - POST method
router.post('/reset-password/:id/:token', (req, res) => {
  const {
    id,
    token
  } = req.params;
  // res.send(req.params);

  //check if the id and token is valid
  function doResetPassword(userData) {
    return new Promise(async (resolve, reject) => {
      let response = {};

      let user = await db.getDb().collection(collections.USER_COLLECTION).findOne({
        _id: ObjectID(userData.id)
      })

      if (user) {

        // console.log(ObjectID(userData.id).toString() );
        // console.log(ObjectID( user._id));
        if (user._id.toString() === ObjectID(userData.id).toString()) {
          console.log('id matched in reset password');
          // response.status = true;
          // resolve(response);
          const secret = JWT_SECRET + user.password;
          try {
            const payload = jwt.verify(token, secret);
            console.log('token verified in reset password');

            //update the password
            //validate the password and confirm password
            if (req.body.password === req.body.conpassword) {

              console.log('password matched');
              //update the password

              return new Promise(async (resolve, reject) => {
                req.body.password = await bcrypt.hash(req.body.password, 10);


                db.getDb().collection(collections.USER_COLLECTION).updateOne({
                  _id: ObjectID(userData.id)
                }, {
                  $set: {
                    password: req.body.password
                  }
                }, (err, result) => {
                  if (err) {
                    console.log(err);
                    response.status = false;
                    resolve(response);
                  } else {
                    response.status = true;
                    resolve(response);
                    req.session.message = {
                      type: 'success',
                      intro: 'Hurrah! ',
                      text: 'Password updated successfully'
                    }
                    res.redirect('/signup-in');
                  }
                })
                resolve(response);

              });

            } else {
              console.log('password not matched');
              req.session.message = {
                type: 'danger',
                intro: 'Sorry! ',
                text: 'Password and Confirm Password does not match'
              }
              res.redirect('/reset-password/' + id + '/' + token);
              resolve(response);
            }
            response.user = user;
            response.status = true;
            resolve(response);



          } catch (err) {
            response.status = false;
            console.log(err + "token not verified");
            resolve(response);
          }

        } else {
          console.log('id not matched');
          response.status = false;
          resolve(response);

        }

        //
      }
    })
  }

  doResetPassword({
    id,
    token
  }).then((result) => {
    if (result.status) {
      console.log(result + "result success");


    } else {
      console.log(result + "result failed");
      // res.redirect('/signup-in');
    }

  }).catch((err) => {
    console.log(err);
  })
  // res.redirect('/signup-in');
})


//add todo
router.post('/add-todo', (req, res) => {
  //console.log(req.body.tasks);
  //console.log(req.session.user);
  const todo = req.body.tasks;
  // console.log("todo : " + todo);
  const userId = req.session.user._id;
  const userName = req.session.user.name;
  const userEmail = req.session.user.email;
  //console.log(userId, userName, userEmail);

  //check if the todo is valid
  function doAddTodo(todoData) {
    return new Promise(async (resolve, reject) => {
      // let response = {};

      // console.log(todoData);
      let todoObj = {
        user: userId,
        tasks: todoData.todo,
        check: 'N'
      }
      //console.log(todoObj);
      //console.log("user:"+todoData.userId);
      //check for the user
      let user = await db.getDb().collection(collections.USER_COLLECTION).findOne({
        _id: ObjectID(todoData.userId)
      })

      if (user) {
        db.getDb().collection(collections.TODOLIST_COLLECTION).insertOne(todoObj, (err, result) => {
          if (err) {
            console.log(err);
            // response.status = false;
            // resolve(response);
          } else {
            // response.status = true;
            // resolve(response);
            // req.session.message = {
            //   type: 'success',
            //   intro: 'Hurrah! ',
            //   text: 'Todo added successfully'
            // }
            console.log("todo added successfully");
            resolve(response);
            res.redirect('/dashboard');
            
          }
        });
      } else {
        console.log('user not found');
        // response.status = false;
        // resolve(response);
      }

    })

  }
  doAddTodo({
    todo,
    userId,
  }).then((result) => {
    if (result.status) {
     // console.log(result + "result success");
    } else {
     // console.log(result + "result failed");

    }

  }).catch((err) => {
    console.log(err);
  })

  //console.log("todoo : " + todo);

});


//delete todo
router.post('/delete-todo', (req, res) => {
  const taskId = req.body.taskId;
  console.log(taskId);

  //check if the todo is valid
  function doDeleteTodo(todoData) {
    return new Promise(async (resolve, reject) => {
      // let response = {};

      // console.log(todoData);
      //check for the user
      let user = await db.getDb().collection(collections.USER_COLLECTION).findOne({
        _id: ObjectID(todoData.userId)
      })

      if (user) {
        db.getDb().collection(collections.TODOLIST_COLLECTION).deleteOne({
          _id: ObjectID(todoData.taskId)
        }, (err, result) => {
          if (err) {
            console.log(err);
            // response.status = false;
            // resolve(response);
          } else {
            // response.status = true;
            // resolve(response);
            // req.session.message = {
            //   type: 'success',
            //   intro: 'Hurrah! ',
            //   text: 'Todo deleted successfully'
            // }
            console.log("todo deleted successfully");
            resolve(response);
            res.redirect('/dashboard');
            
          }
        });
      } else {
        console.log('user not found');
        // response.status = false;
        // resolve(response);
      }

    })

  }
  doDeleteTodo({
    taskId,
    userId: req.session.user._id,
  }).then((result) => {
    if (result.status) {
     // console.log(result + "result success");
    } else {
     // console.log(result + "result failed");

    }

  }).catch((err) => {
    console.log(err);
  });
  
});


module.exports = router;