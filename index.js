require('dotenv').config();
const schedule = require('node-schedule');
const config = require('./config');
const mailService = require('./services/mail.service');

const url = process.env.HEALTH_CHECK_URL;

// Function to check URL
function checkUrl() {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.status !== 'success' || data.status_code !== 200) {
        console.log('URL check failed. Sending email...');
        sendEmailsToAdmins();
      } else {
        console.log('URL check passed.');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      sendEmailsToAdmins();
    });
}

function sendEmailsToAdmins() {
  config.adminEmails.forEach((email) => {
    mailService.send(email);
  });
}

// Schedule to check URL every 30 minutes
schedule.scheduleJob('*/30 * * * *', () => {
  console.log('Checking URL:', url);
  checkUrl();
});
