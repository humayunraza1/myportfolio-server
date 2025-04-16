// server.js
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors( {
  origin: ['https://humayunraza.vercel.app', 'http://localhost:5173'],
}));
app.use(express.json());

// Contact form endpoint
app.post('/api/send-email', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate request data
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Email content with styling
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'humayunraza.dev@gmail.com',
      subject: `Portfolio Contact: ${name}`,
      text: `
Name: ${name}
Email: ${email}

Message:
${message}
      `,
      html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #121212; color: #e0e0e0; border-radius: 8px;">
  <h2 style="color: #4ADE80; border-bottom: 1px solid #333; padding-bottom: 10px;">New Contact from Portfolio Website</h2>
  
  <div style="margin: 20px 0;">
    <p style="margin: 5px 0;"><strong style="color: #4ADE80;">Name:</strong> ${name}</p>
    <p style="margin: 5px 0;"><strong style="color: #4ADE80;">Email:</strong> <a href="mailto:${email}" style="color: #e0e0e0; text-decoration: underline;">${email}</a></p>
  </div>
  
  <div style="background-color: #1a1a1a; padding: 15px; border-radius: 4px; margin: 20px 0;">
    <h3 style="color: #4ADE80; margin-top: 0;">Message:</h3>
    <p style="white-space: pre-line; line-height: 1.5;">${message}</p>
  </div>
  
  <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #333; font-size: 12px; color: #999;">
    <p>This message was sent from the contact form on your portfolio website.</p>
    <p>Date: ${new Date().toLocaleString()}</p>
  </div>
</div>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Return success response
    res.status(200).json({ message: 'Message sent successfully' });
    
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: error.message || 'Error sending message' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});