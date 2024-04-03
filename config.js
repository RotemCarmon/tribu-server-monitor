module.exports = {
  email: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_TRANSPORT_PASSWORD,
  },
  healthCheckUrl: process.env.HEALTH_CHECK_URL,
  adminEmails: process.env.ADMIN_EMAILS?.split(','), // Split the string into an array
};
