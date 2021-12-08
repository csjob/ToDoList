//****************//****************//**********************************************************************************//
//node mailer mail sending

exports.mail1 = function(link,email){
  

//const nodemailer=require('nodemailer') 
var keys=require('../config/keys')
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
//oAuth2Client.credentials = credentials; 


async function sendMail(link,email)
{
  try {
    const accessToken= await oAuth2Client.getAccessToken()

    const transport=nodemailer.createTransport({
      service:'gmail',
      auth: {
        type :'OAuth2',
        user:keys.user,
        clientId:CLIENT_ID,
        clientSecret:CLIENT_SECRET,
        refreshToken:REFRESH_TOKEN,
        accessToken:accessToken
      }
    }
    )
    //console.log(link)
    const mailOptions={
      from:keys.from,
      to:email,
      subject:'Forgot Password Link',
      text:'This link is valid only for 5 minutes...',
      html: '<h3>This link is valid only for 5 minutes...</h3>'+link,
    };

    const result=await transport.sendMail(mailOptions)
    return result
    

  } catch (error) {
    return error.message    
  }

  
}

sendMail(link,email)
.then((result) => console.log('Email sent successfully.....',result))
.catch((error) => console.log(error.message));


};
//****************//****************//**********************************************************************************//
