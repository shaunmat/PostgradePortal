import nodemailer from 'nodemailer';

const sendEmail = async (supervisorId, studentId, subject, html) => {
  const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
          user: "31d9ac22ed23c9",
          pass: "00e4d1fc1c354c"
      }
  });

  const senderEmail = `${supervisorId}@uj.ac.za`;
  const recipientEmail = `${studentId}@student.uj.ac.za`;

  const mailOptions = {
      from: `PostGrade Portal Support <${senderEmail}>`,
      to: recipientEmail,
      subject,
      text: 'You have received a new meeting notification.', // Fallback text version
      html // Use the HTML content
  };

  try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Message sent: %s', info.messageId);
      return info; // Return the info object to use in server.js
  } catch (error) {
      console.error('Error occurred: ' + error.message);
      throw error; // Throw the error to be caught in server.js
  }
};

export default sendEmail;
