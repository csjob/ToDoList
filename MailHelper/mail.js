var keys=require('../config/keys');

exports.mail1 = function(link,email){
  

//const nodemailer=require('nodemailer') 

//const {google} = require('googleapis');

const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { OAuth2Client } = require("googleapis-common");
const OAuth2 = google.auth.OAuth2;

const CLIENT_ID=keys.CLIENT_ID;
const CLIENT_SECRET=keys.CLIENT_SECRET;
const REDIRECT_URI=keys.REDIRECT_URI;
const REFRESH_TOKEN=keys.REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID,CLIENT_SECRET,REDIRECT_URI);
oAuth2Client.setCredentials({refresh_token : REFRESH_TOKEN})
// oAuth2Client.credentials = credentials; 
console.log(oAuth2Client);

async function sendMail(link,email)
{
  
  try {
    const accessToken= await oAuth2Client.getAccessToken()
    
    const transport=nodemailer.createTransport({
      service:'gmail',
      auth: {
        type :'OAuth2',
        user:keys.USER,
        clientId:CLIENT_ID,
        clientSecret:CLIENT_SECRET,
        refreshToken:REFRESH_TOKEN,
        accessToken:accessToken,
      }
    }
    )
    console.log(link)
    const mailOptions={
      from:keys.FROM,
      to:email,
      subject:'Forgot Password Link',
      text:'This link is valid only for 5 minutes...',
      html: '<h2 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;">You have requested to reset your password</h2> </br> <p style="color:#455056; font-size:15px;line-height:24px;"> A unique link to reset your password has been generated for you. To reset your password, click the following link and follow the instructions.</p>  <a href=" ' + link + '" style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; margin-botton:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset Password</a> </br> </br> <p style="color:#455056; font-size:15px;line-height:24px; "> Click on the below link if the button is not working </p> </br>' + link + ' <p>If you did not request a password reset, please ignore this email or reply to let us know.</p> <p>Thanks,</p> <p>The ToDo Web Team</p>',
    };

    const result=await transport.sendMail(mailOptions)
    return result
    

  } catch (error) {
    console.log(error.message)
    return error.message    
    
  }

  
}

sendMail(link,email)
.then((result) => console.log('Email sent successfully.....',result))
.catch((error) => console.log(error.message));


};


// exports.sendEmailExport = function(link,email){

// //sending email 
// var keys=require('../config/keys')
// const nodemailer = require("nodemailer");
// const { google } = require("googleapis");


// const CLIENT_ID=keys.CLIENT_ID;
// const CLIENT_SECRET=keys.CLIENT_SECRET;
// const REDIRECT_URI=keys.REDIRECT_URI;
// const REFRESH_TOKEN=keys.REFRESH_TOKEN;

// const oAuth2Client = new google.auth.OAuth2(CLIENT_ID,CLIENT_SECRET,REDIRECT_URI);
// oAuth2Client.setCredentials({refresh_token : REFRESH_TOKEN})

// //function for sending email
// async function sendEmail(link, email){
//   try{
//     const accessToken = await oAuth2Client.getAccessToken()
//     const smtpTransport = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         type: "OAuth2",
//         user: keys.USER,
//         clientId: CLIENT_ID,
//         clientSecret: CLIENT_SECRET,
//         refreshToken: REFRESH_TOKEN,
//         accessToken: accessToken
//       }
//     });
//     const mailOptions = {
//       from: keys.FROM,
//       to: email,
//       subject:'Forgot Password Link',
//       text:'This link is valid only for 5 minutes...' + link,
//       html: '<h2 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;">You have requested to reset your password</h2> </br> <p style="color:#455056; font-size:15px;line-height:24px;"> A unique link to reset your password has been generated for you. To reset your password, click the following link and follow the instructions.</p>  <a href=" ' + link + '" style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; margin-botton:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset Password</a> </br> </br> <p style="color:#455056; font-size:15px;line-height:24px; "> Click on the below link if the button is not working </p> </br>' + link + ' <p>If you did not request a password reset, please ignore this email or reply to let us know.</p> <p>Thanks,</p> <p>The ToDo Web Team</p>',
//     };
    
//     const info = await smtpTransport.sendMail(mailOptions);
//     console.log("Message sent: %s", info.messageId);
//     console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
//     return info;
            
//   }catch(err){
//     console.log(err)
//   }

// }
// sendEmail(link,email).then((result) => console.log('Email sent successfully.....',info))
// .catch((error) => console.log(error.message));

// }

//****************//****************//**********************************************************************************//
//node mailer mail sending

// exports.mail1 = function(link,email){
  

// //const nodemailer=require('nodemailer') 
// var keys=require('../config/keys')
// //const {google} = require('googleapis');

// const nodemailer = require("nodemailer");
// const { google } = require("googleapis");
// const { OAuth2Client } = require("googleapis-common");
// const OAuth2 = google.auth.OAuth2;

// const CLIENT_ID=keys.CLIENT_ID;
// const CLIENT_SECRET=keys.CLIENT_SECRET;
// const REDIRECT_URI=keys.REDIRECT_URI;
// const REFRESH_TOKEN=keys.REFRESH_TOKEN;

// const oAuth2Client = new google.auth.OAuth2(CLIENT_ID,CLIENT_SECRET,REDIRECT_URI);
// oAuth2Client.setCredentials({refresh_token : REFRESH_TOKEN})
// // oAuth2Client.credentials = credentials; 
// console.log(oAuth2Client);

// async function sendMail(link,email)
// {
  
//   try {
//     const accessToken= await oAuth2Client.getAccessToken()
    
//     const transport=nodemailer.createTransport({
//       service:'gmail',
//       auth: {
//         type :'OAuth2',
//         user:keys.user,
//         clientId:CLIENT_ID,
//         clientSecret:CLIENT_SECRET,
//         refreshToken:REFRESH_TOKEN,
//         accessToken:accessToken,
//       }
//     }
//     )
//     console.log(link)
//     const mailOptions={
//       from:keys.from,
//       to:email,
//       subject:'Forgot Password Link',
//       text:'This link is valid only for 5 minutes...',
//      // html: '<h3>This link is valid only for 5 minutes...</h3>'+link,

//       html: '<h2 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;">You have requested to reset your password</h2> </br> <p style="color:#455056; font-size:15px;line-height:24px;"> A unique link to reset your password has been generated for you. To reset your password, click the following link and follow the instructions.</p>  <a href=" ' + link + '" style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; margin-botton:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset Password</a> </br> </br> <p style="color:#455056; font-size:15px;line-height:24px; "> Click on the below link if the button is not working </p> </br>' + link + ' <p>If you did not request a password reset, please ignore this email or reply to let us know.</p> <p>Thanks,</p> <p>The ToDo Web Team</p>',

      
//     };

//     const result=await transport.sendMail(mailOptions)
//     return result
    

//   } catch (error) {
//     console.log(error.message)
//     return error.message    
    
//   }

  
// }

// sendMail(link,email)
// .then((result) => console.log('Email sent successfully.....',result))
// .catch((error) => console.log(error.message));


// };
//****************//****************//**********************************************************************************//
