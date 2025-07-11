// server.js
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// POST route to handle form submission
app.post('/send', async (req, res) => {
  const { firstName, lastName, email, phone } = req.body;

  // Setup transporter (use your real SMTP info here)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,     // your Gmail
      pass: process.env.MAIL_PASS      // app password
    }
  });

  const mailOptions = {
    from: `"KONASAL Form" <${process.env.MAIL_USER}>`,
    to: process.env.MAIL_RECEIVER, // company email
    subject: 'New Agent Form Submission',
    html: `
      <h3>New Agent Signup</h3>
      <p><strong>First Name:</strong> ${firstName}</p>
      <p><strong>Last Name:</strong> ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
    `
  };

  try {
  const info = await transporter.sendMail(mailOptions);
  console.log('Email sent: ', info.response); // log full response
  res.status(200).json({ message: 'Email sent successfully!' });
} catch (error) {
  console.error('Email error:', error);
  res.status(500).json({ error: 'Failed to send email' });
}

});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
