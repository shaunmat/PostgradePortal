import nodemailer from 'nodemailer';

const sendEmail = async (supervisorId, studentId, subject, html) => {
  // Ensure supervisorId and studentId are provided and valid
  if (!supervisorId || !studentId || !subject || !html) {
    throw new Error('Missing required parameters: supervisorId, studentId, subject, or email content.');
  }

  // Create the transporter configuration with Mailtrap credentials
  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "31d9ac22ed23c9", // Your Mailtrap username
      pass: "00e4d1fc1c354c"  // Your Mailtrap password
    }
  });

  // Format supervisor and student email addresses
  const senderEmail = `${supervisorId}@uj.ac.za`; // Supervisor email
  const recipientEmail = `${studentId}@student.uj.ac.za`; // Student email

  // Ensure email addresses are formatted correctly
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(senderEmail) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail)) {
    throw new Error('Invalid email format for supervisor or student.');
  }

  // Define mail options including both HTML and plain text versions
  const mailOptions = {
    from: `PostGrade Portal Support <${senderEmail}>`, // Sender's display name
    to: recipientEmail, // Receiver's email
    subject, // Email subject
    text: 'You have received a new meeting notification.', // Fallback text for email clients that do not support HTML
    html // HTML content of the email
  };

  try {
    // Send email and log the result
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent successfully: %s', info.messageId); // Log the message ID
    return info; // Return the sent email information
  } catch (error) {
    // Log and rethrow the error for higher-level handling
    console.error('Error occurred while sending email: ' + error.message);
    throw error;
  }
};

export default sendEmail;