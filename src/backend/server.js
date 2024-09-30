import express from 'express';
import cors from 'cors';
import sendEmail from './smtp.js'; // Ensure the .js extension is included

const app = express();
const PORT = 3000; // Change port to 3000

// Middleware
app.use(cors({
    origin: 'http://localhost:5173' // Adjust this to match your frontend port
}));

app.use(express.json());

app.get('/api/quote', async (req, res) => {
    try {
        const response = await fetch('https://zenquotes.io/api/today');
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).send('Error fetching quote');
    }
});


app.post('/send-email', async (req, res) => {
    console.log('Received request:', req.body); // Log request body
    const { supervisorId, studentId, subject, meetingDate, meetingTime, supervisorTitle, supervisorSurname } = req.body; // Include new fields
    
    const html = `
        <p>Good day Student,</p>
        <p>This is a reminder of your upcoming meeting.</p>
        <p>Meeting details:</p>
        <p>Date: ${meetingDate}</p>
        <p>Time: ${meetingTime}</p>
        <p>Join the meeting <a href="https://teams.microsoft.com/l/meetup-join/your-meeting-link">here</a></p>
        <p>Kind regards,</p>
        <p>${supervisorTitle} ${supervisorSurname}</p> <!-- Use the passed supervisor details -->
    `;
    
    try {
        const info = await sendEmail(supervisorId, studentId, subject, html); // Pass HTML to the sendEmail function
        res.status(200).json({ success: true, info });
    } catch (error) {
        console.error('Error sending email:', error); // Log error
        res.status(500).json({ success: false, error: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});