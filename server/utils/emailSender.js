const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail', 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  } 
});


exports.sendContactNotification = async ({ name, email, subject, message }) => {
  const mailOptions = {
    from: `"Contact Form" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL, 
    subject: `New Contact Submission: ${subject || 'General Inquiry'}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject || 'General Inquiry'}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
      <hr>
      <p>Received at: ${new Date().toLocaleString()}</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Contact notification email sent');
  } catch (error) {
    console.error('Error sending contact email:', error);
  }
};

exports.sendAutoReply = async (userEmail) => {
    const mailOptions = {
      from: `"Support Team" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: 'We received your message!',
      html: `
        <h2>Thank you for contacting us!</h2>
        <p>We've received your message and our team will get back to you within 24-48 hours.</p>
        <p><strong>Our business hours:</strong> Mon-Fri, 8AM-8PM</p>
        <p>For urgent matters, please call our support line.</p>
        <hr>
        <p><small>This is an automated message. Please do not reply.</small></p>
      `
    };
  
    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending auto-reply:', error);
    }
};