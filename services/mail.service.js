const nodemailer = require('nodemailer');
const config = require('../config');

const mailTransport = {
  host: config.email.host,
  port: config.email.port,
  secure: true,
  auth: {
    user: config.email.user,
    pass: config.email.password,
  },
  tls: {
    rejectUnauthorized: false,
  },
};

const transport = nodemailer.createTransport(mailTransport);

async function send(receiver) {
  try {
    console.log(`Sending email to ${receiver}`);

    return transport.sendMail({
      from: mailTransport.auth.user,
      to: receiver,
      subject: 'URL Check Failed',
      text: 'The attempt to connect to the URL failed or did not return the expected response.',
    });
  } catch (err) {
    console.log(`Could not send email to ${receiver}. Error: ${err}`);
  }
}

module.exports = {
  send,
};
