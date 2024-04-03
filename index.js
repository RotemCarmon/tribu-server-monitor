require('dotenv').config();
const http = require('http');
const schedule = require('node-schedule');
const config = require('./config');
const mailService = require('./services/mail.service');

const url = process.env.HEALTH_CHECK_URL;

// Function to check URL
function checkUrl() {
  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.status !== 'success' || data.status_code !== 200) {
        const msg = 'URL check failed. Sending email...';
        console.log(msg);
        sendEmailsToAdmins();
        return msg;
      } else {
        const msg = 'URL check passed.';
        console.log(msg);
        return msg;
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

const server = http.createServer(async (req, res) => {
  if (req.url === '/check-url' && req.method === 'GET') {
    const resp = await checkUrl();
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('checkUrl function triggered: ' + resp + '\n');
  } else {
    res.statusCode = 404;
    res.end('Not Found\n');
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});

console.log('App started...');
