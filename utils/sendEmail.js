const nodemailer = require('nodemailer')

const sendEmail =async(options)=>{
 // 1 - create transporter (service that will send email like "email","mailgun","mailtrap","sendGrid" )
const transporter = nodemailer.createTransport({
host : process.env.EMAIL_HOST,
port :process.env.EMAIL_PORT, //if secure true : port = 465 ,  if secure false : port = 587
secure: true,
auth:{
    user:process.env.EMAIL_USER,
    pass:process.env.EMAIL_PASSWORD,
},
});

 // 2 - Define email options (like from , to , subject , email content)
 const mailOptions ={
    from: "E-shop App <test9tttt@gmail.com>",
    to : options.email,
    subject : options.subject,
    text : options.message,
 };
 // 3 - send email
 await transporter.sendMail(mailOptions);
};


module.exports = sendEmail ;