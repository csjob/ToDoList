const sendMail = require('@sendgrid/mail');
const KEYS = require('../config/keys');


sendMail.setApiKey(KEYS.MAIL_API);

module.exports = {
sendEmail : async (link, email) => {
    const msg = {
        to: email,
        // from: KEYS.FROM,
        from: {
            name: 'TODO LIST Web Team',
            email: KEYS.FROM,
        },
        subject: 'TODO LIST Web Team',
        text: 'Forgot Password Link' + link,
        html: '<h2 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;">You have requested to reset your password</h2> </br> <p style="color:#455056; font-size:15px;line-height:24px;"> A unique link to reset your password has been generated for you. To reset your password, click the following link and follow the instructions.</p>  <a href=" ' + link + '" style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; margin-botton:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset Password</a> </br> </br> <p style="color:#455056; font-size:15px;line-height:24px; "> Click on the below link if the button is not working </p> </br>' + link + ' <p>If you did not request a password reset, please ignore this email or reply to let us know.</p> <p>Thanks,</p> <p>The ToDo Web Team</p>',
    };
    try {
        const result = await sendMail.send(msg);
        return result;
    } catch (err) {
        console.log(err);
    }
}

}

//sendEmail('https://www.google.com', '@gmail.com').then((result) => console.log('Email sent successfully.....', result));