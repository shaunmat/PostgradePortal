import express from 'express';
import cors from 'cors';
import sendEmail from './smtp.js'; // Ensure the .js extension is included

const app = express();
const PORT = 3000; // Set the port to 3000

// Middleware
app.use(cors({
    origin: 'http://localhost:5173' // Adjust this to match your frontend port
}));
app.use(express.json());

// Endpoint to get a quote
app.get('/api/quote', async (req, res) => {
    try {
        const response = await fetch('https://zenquotes.io/api/today');
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching quote:', error);
        res.status(500).send('Error fetching quote');
    }
});

// Endpoint to handle meeting requests
app.post('/request-meeting', async (req, res) => {
    console.log('Received meeting request:', req.body);
    const { supervisorId, studentId, subject, meetingDate, meetingTime } = req.body;

    // Email content for supervisor
    const supervisorHtml = `
        <p>Good day Supervisor,</p>
        <p>You have a new meeting request from student ${studentId}.</p>
        <p>Meeting details:</p>
        <p>Date: ${meetingDate}</p>
        <p>Time: ${meetingTime}</p>
        <p>Accept or decline the meeting <a href="https://teams.microsoft.com/l/meetup-join/your-meeting-link">here</a></p>
        <p>Kind regards,</p>
        <p>PostGrade Portal</p>
    `;

    try {
        // Send meeting request email to supervisor
        const supervisorInfo = await sendEmail(supervisorId, studentId, subject, supervisorHtml);
        console.log('Supervisor email sent successfully:', supervisorInfo.messageId);
        res.status(200).json({ success: true, info: supervisorInfo });
    } catch (error) {
        console.error('Error sending meeting request email:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Endpoint for confirming meeting requests
app.post('/confirm-meeting', async (req, res) => {
    console.log('Received meeting confirmation:', req.body);
    const { supervisorId, studentId, subject, meetingDate, meetingTime, supervisorTitle, supervisorSurname, status } = req.body;

    let studentHtml;
    if (status === 'accepted') {
        // Email content for accepted meeting
        studentHtml = `
            <p>Good day Student,</p>
            <p>Your meeting request has been accepted by ${supervisorTitle} ${supervisorSurname}.</p>
            <p>Meeting details:</p>
            <p>Date: ${meetingDate}</p>
            <p>Time: ${meetingTime}</p>
            <p>Join the meeting <a href="https://teams.microsoft.com/l/meetup-join/your-meeting-link">here</a></p>
            <p>Kind regards,</p>
            <p>PostGrade Portal Support</p>
        `;
    } else if (status === 'declined') {
        // Email content for declined meeting
        studentHtml = `
            <p>Good day Student,</p>
            <p>Unfortunately, your meeting request with ${supervisorTitle} ${supervisorSurname} has been declined.</p>
            <p>Kindly choose another date and time for your meeting.</p>
            <p>Kind regards,</p>
            <p>PostGrade Portal Support</p>
        `;
    }

    try {
        // Send confirmation email to student
        const studentInfo = await sendEmail(supervisorId, studentId, subject, studentHtml);
        console.log('Student confirmation email sent successfully:', studentInfo.messageId);
        res.status(200).json({ success: true, info: studentInfo });
    } catch (error) {
        console.error('Error sending confirmation email:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});


// Endpoint to send reminder email to student
app.post('/send-email', async (req, res) => {
    console.log('Received reminder request:', req.body);
    const { supervisorId, studentId, subject, meetingDate, meetingTime, supervisorTitle, supervisorSurname } = req.body;

    // Email content for student
    const studentHtml = `
        <p>Good day Student,</p>
        <p>This is a reminder of your upcoming meeting with ${supervisorTitle} ${supervisorSurname}.</p>
        <p>Meeting details:</p>
        <p>Date: ${meetingDate}</p>
        <p>Time: ${meetingTime}</p>
        <p>Join the meeting <a href="https://teams.microsoft.com/l/meetup-join/your-meeting-link">here</a></p>
        <p>Kind regards,</p>
        <p>${supervisorTitle} ${supervisorSurname}</p>
    `;

    try {
        // Send reminder email to student
        const studentInfo = await sendEmail(supervisorId, studentId, subject, studentHtml);
        console.log('Student reminder email sent successfully:', studentInfo.messageId);
        res.status(200).json({ success: true, info: studentInfo });
    } catch (error) {
        console.error('Error sending reminder email:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});