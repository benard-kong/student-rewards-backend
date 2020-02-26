import nodemailer from 'nodemailer'

const authDetails = {
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
}

export const sendResetPasswordEmail = async (token, userEmail) => {
  const { host, port, auth } = authDetails
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for port 465, false for other ports
    auth,
  })

  await transporter.sendMail({
    from: auth.user,
    to: userEmail,
    subject: 'Generic Website - Reset Your Password',
    text: `Please reset your password. Have your frontend go to a link and\n1) Validate the token given in the email, and \n2) Pass the token to resetForgottenPassword appropriately.\n The token will expire in 3 minutes by default. You can change that time as you see fit. Here is the token:\n${token}`,
    // html: `<h1>Use in-line styled HTML for styled emails</h1>`,
  })
}
