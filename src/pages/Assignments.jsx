import { useState, useEffect } from 'react'; 
import { collection, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import { db, storage } from '../backend/config'; // Import your Firebase configuration
import { Footer } from '../components/Footer';
import BannerImage from '../assets/images/research_banner.jpg';
import { useParams } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // For handling file uploads

export const Assignments = () => {
    const { courseId, assignmentId } = useParams();
    const [courseDetails, setCourseDetails] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [submissions, setSubmissions] = useState([]); // Store submissions for each assignment
    const [selectedSubmission, setSelectedSubmission] = useState(null); // For feedback
    const [feedbackFile, setFeedbackFile] = useState(null);
    const [marks, setMarks] = useState('');
    const [comments, setComments] = useState('');
    const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

    useEffect(() => {
        console.log("Fetching data for courseId:", courseId, "and assignmentId:", assignmentId);

        const fetchCourseAndSubmissions = async () => {
            if (!courseId || !assignmentId) {
                console.error("CourseID or AssignmentID is missing");
                return;
            }

            try {
                // Fetch course details
                const courseRef = doc(db, 'Module', courseId);
                const courseSnap = await getDoc(courseRef);
                if (courseSnap.exists()) {
                    setCourseDetails(courseSnap.data());
                } else {
                    console.log('No course data found');
                }

                // Fetch assignments for the specific course
                const assignmentRef = collection(db, `Module/${courseId}/Assignments`);
                const assignmentSnap = await getDocs(assignmentRef);
                if (!assignmentSnap.empty) {
                    const assignmentData = assignmentSnap.docs.map(doc => ({
                        ...doc.data(),
                        id: doc.id // Include document ID for assignmentId
                    }));

                    // Filter to get the specific assignment
                    const filteredAssignments = assignmentData.filter(assignment => assignment.id === assignmentId);
                    setAssignments(filteredAssignments);
                } else {
                    console.log('No assignments available');
                }

                // Fetch submissions for the specific assignment
                const submissionRef = collection(db, `Module/${courseId}/Assignments/${assignmentId}/StudentID`);
                const submissionSnap = await getDocs(submissionRef);
                if (!submissionSnap.empty) {
                    const studentSubmissions = submissionSnap.docs.map(sub => ({
                        ...sub.data(),
                        studentID: sub.id
                    }));
                    setSubmissions(studentSubmissions);
                } else {
                    console.log('No submissions available');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchCourseAndSubmissions();
    }, [courseId, assignmentId]);

    const handleFeedbackSubmit = async (submission) => {
        if (!marks || !comments || !feedbackFile) {
            alert('Please provide marks, comments, and a PDF feedback file.');
            return;
        }

        setIsSubmittingFeedback(true);

        try {
            // Upload the feedback file to Firebase Storage
            const feedbackRef = ref(storage, `feedback/${submission.studentID}/${assignmentId}.pdf`);
            await uploadBytes(feedbackRef, feedbackFile);

            // Get the download URL for the uploaded file
            const feedbackURL = await getDownloadURL(feedbackRef);

            // Update the Firestore database with marks, comments, and feedback link
            const feedbackDocRef = doc(db, `Module/${courseId}/Assignments/${assignmentId}/StudentID/${submission.studentID}`);
            await setDoc(feedbackDocRef, {
                marks,
                comments,
                feedbackURL,
                feedbackAvailable: true, // Mark feedback as available
            }, { merge: true });

            // Clear the form after submission
            setMarks('');
            setComments('');
            setFeedbackFile(null);
            alert('Feedback provided successfully!');

        } catch (error) {
            console.error('Error submitting feedback:', error);
        } finally {
            setIsSubmittingFeedback(false);
        }
    };

    const handleFileChange = (e) => {
        setFeedbackFile(e.target.files[0]);
    };

    if (!courseDetails) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-4 sm:ml-6 sm:mr-6 lg:ml-72 lg:mr-72">
            <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 dark:bg-gray-800">
                {/* Stretch Banner Image with Course Name */}
                <section className="max-h-80 flex items-center justify-center w-full overflow-hidden rounded-lg relative">
                    <img src={BannerImage} alt="Banner" className="w-full h-full object-cover" />
                    <h1 className="absolute text-4xl font-bold tracking-wider text-white dark:text-gray-200">
                        {courseDetails.name}
                    </h1>
                </section>

                {/* Course Details */}
                <section className="mt-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                        Current Submission
                    </h2>
                </section>

                {/* Assignments */}
                <section className="mt-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Assignments</h2>
                    <ul className="mt-4 space-y-4">
                    {assignments.length > 0 ? assignments.map((assignment, index) => {
                        const dueDate = new Date(assignment.AssignmentDueDate.seconds * 1000);

                        return (
                            <li key={index} className="border p-4 rounded-lg shadow dark:bg-gray-900 dark:border-gray-700">
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{assignment.AssignmentTitle}</h3>
                                <p>{assignment.AssignmentDescription}</p>
                                <p>Due Date: {dueDate.toLocaleString()}</p>
                                <p>Created On: {new Date(assignment.AssignmentCreation.seconds * 1000).toLocaleString()}</p>

                                {/* Display Submissions */}
                                <section className="mt-4">
                                    <h4 className="text-lg font-bold">Submissions</h4>
                                    {submissions.length > 0 ? (
                                        <ul className="space-y-2">
                                            {submissions.map((submission, subIndex) => (
                                                <li key={subIndex} className="p-2 border rounded bg-gray-100 dark:bg-gray-800 dark:border-gray-700">
                                                    <p>Student ID: {submission.studentID}</p>
                                                    <p>File Name: {submission.fileName}</p>
                                                    <p>Submitted At: {new Date(submission.submittedAt.seconds * 1000).toLocaleString()}</p>
                                                    <br/>
                                                    <a 
                                                        href={submission.downloadURL} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer" 
                                                        className="text-blue-500 underline"
                                                    >
                                                        Download Submission 
                                                    </a>
                                                    <br/>

                                                    {/* Provide Feedback Section */}
                                                    <button 
                                                        onClick={() => setSelectedSubmission(submission)} 
                                                        className="text-blue-500 underline"
                                                    >
                                                        Provide Feedback
                                                    </button>

                                                    {/* Feedback Form (Shown when a submission is selected) */}
                                                    {selectedSubmission?.studentID === submission.studentID && (
                                                        <div className="mt-4">
                                                            <label className="block text-gray-800 dark:text-gray-200">
                                                                Marks:
                                                                <input 
                                                                    type="number" 
                                                                    className="block w-full mt-2 p-2 border rounded" 
                                                                    value={marks} 
                                                                    onChange={(e) => setMarks(e.target.value)} 
                                                                />
                                                            </label>
                                                            <label className="block text-gray-800 dark:text-gray-200 mt-4">
                                                                Comments:
                                                                <textarea 
                                                                    className="block w-full mt-2 p-2 border rounded" 
                                                                    value={comments} 
                                                                    onChange={(e) => setComments(e.target.value)} 
                                                                />
                                                            </label>
                                                            <label className="block text-gray-800 dark:text-gray-200 mt-4">
                                                                Upload Feedback (PDF):
                                                                <input 
                                                                    type="file" 
                                                                    accept="application/pdf" 
                                                                    className="block w-full mt-2" 
                                                                    onChange={handleFileChange}
                                                                />
                                                            </label>
                                                            <button 
                                                                onClick={() => handleFeedbackSubmit(submission)} 
                                                                className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
                                                                disabled={isSubmittingFeedback}
                                                            >
                                                                {isSubmittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                                                            </button>
                                                        </div>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>No submissions available.</p>
                                    )}
                                </section>
                            </li>
                        );
                    }) : (
                        <p>No assignments available.</p>
                    )}
                    </ul>
                </section>

                <Footer />
            </div>
        </div>
    );
};

