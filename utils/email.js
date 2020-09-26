const nodemailer = require('nodemailer');

const sendEmail = async options => {
  const transportor = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
    //ACTIVATE LESS SECURE APP
  });

  //2) define the email options
  const mailOptions = {
    from: 'Ajay yadav <aju9617@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message
    //html
  };
  //3) actually send email
  await transportor.sendMail(mailOptions);
};

module.exports = sendEmail;
