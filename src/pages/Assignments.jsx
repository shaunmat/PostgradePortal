import { useState, useEffect } from 'react'; 
import { collection, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import { db, storage } from '../backend/config'; // Import your Firebase configuration
import { Footer } from '../components/Footer';
import BannerImg from '../assets/images/BannerImg.jpg';
import { useParams } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // For handling file uploads
import { HiChevronLeft } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Card, Button, Badge } from "flowbite-react";
import { Modal, Spinner } from "flowbite-react";

export const Assignments = () => {
    const navigate = useNavigate();
    const { courseId, assignmentId } = useParams();
    const [courseDetails, setCourseDetails] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [submissions, setSubmissions] = useState([]); // Store submissions for each assignment
    const [selectedSubmission, setSelectedSubmission] = useState(null); // For feedback
    const [feedbackFile, setFeedbackFile] = useState(null);
    const [marks, setMarks] = useState('');
    const [comments, setComments] = useState('');
    const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

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
            handleCloseModal();
            toast.success('Feedback uploaded successfully');

        } catch (error) {
            console.error('Error submitting feedback:', error);
        } finally {
            setIsSubmittingFeedback(false);
        }
    };

    const handleFileChange = (e) => {
        setFeedbackFile(e.target.files[0]);
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // const handleSubmitFeedback = () => {
    //     // Handle feedback submission
    // };

    if (!courseDetails) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spinner size="xl" color="warning" />
            </div>
        );
    }

    return (
        <div className="p-4 sm:ml-6 sm:mr-6 lg:ml-72 lg:mr-72">
            <div className="p-4 border-2 min-h-screen border-gray-200  rounded-lg dark:border-gray-700 dark:bg-gray-800">                {/* Stretch Banner Image with Course Name */}
                <section className="max-h-80 flex items-center justify-center w-full overflow-hidden rounded-lg relative">
                    <img src={BannerImg} alt="Banner" className="w-full h-full object-cover" />
                    <h1 className="absolute text-4xl font-bold tracking-wider text-white dark:text-gray-200">
                        {courseDetails.ModuleTitle}
                    </h1>
                    <button
                        className="absolute top-3 left-3 flex items-center px-4 py-2 bg-[#FF8503] text-white rounded-lg"
                        onClick={() => navigate(-1)}
                    >
                        <HiChevronLeft className="mr-2" />
                        Back
                    </button>
                </section>

                {/* Assignments */}
                <section className="mt-4" style={{display: 'none'}}>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Submissions</h2>
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
                                                        onClick={handleOpenModal}
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

                <section className="mt-6 border-2 border-[#FF8503] rounded-lg p-4">
                    <h3 className="text-xl font-bold text-[#FF8503] dark:text-[#FF8503]">Current Milestone</h3>
                    <p className="mt-2 text-gray-800 dark:text-gray-200">
                        This is the current milestone. 
                        You can view the submissions and provide feedback to the students.
                    </p>

                    <div className="mt-4">
                        {assignments.length > 0 ? assignments.map((assignment, index) => (
                            <div key={index} className=" dark:bg-gray-800 dark:shadow-lg">
                                {/* <h4 className="text-xl mt-1 font-bold text-gray-800 dark:text-gray-200">Milestone Title: <span>{assignment.AssignmentTitle}</span></h4>
                                <p className="text-lg text-gray-600 dark:text-gray-400">Milestone Description: {assignment.AssignmentDescription}</p>
                                <p className="text-lg text-gray-600 dark:text-gray-400">Due Date: <span className="font-semibold">{new Date(assignment.AssignmentDueDate.seconds * 1000).toLocaleString()}</span></p>
                                <p className="text-lg text-gray-600 dark:text-gray-400">Created On: <span className="font-semibold">{new Date(assignment.AssignmentCreation.seconds * 1000).toLocaleString()}</span></p> */}

                                <div className="mt-4 border-t border-gray-200 dark:border-gray-600 pt-4">
                                    <h4 className="mb-2 font-bold text-xl text-gray-800 dark:text-gray-200">Submissions</h4>
                                        {submissions.length > 0 ? (
                                            submissions.map((submission, subIndex) => (
                                                <div key={subIndex} className="mb-4 p-2 border rounded-lg flex justify-between items-center bg-gray-50 dark:bg-gray-900 dark:border-gray-700 hover:shadow hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-200">
                                                    <div>
                                                        <p className="text-sm mt-1 text-gray-800 dark:text-gray-200">Student ID: <span className="font-semibold">{submission.studentID}</span></p>
                                                        <p className="text-sm mt-1 text-gray-800 dark:text-gray-200">Submitted At: <span className="font-semibold">{new Date(submission.submittedAt.seconds * 1000).toLocaleString()}</span></p>
                                                        {submission.feedbackAvailable ? (
                                                            <Badge color="success" className="mt-2">Reviewed</Badge>
                                                        ) : (
                                                            <Badge color="warning" className="mt-2">Pending Review</Badge>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <Button gradientDuoTone="blueToIndigo" onClick={() => window.open(submission.downloadURL, '_blank')}>
                                                            Download
                                                        </Button>
                                                        <Button gradientDuoTone="blueToIndigo" onClick={() => { setSelectedSubmission(submission); handleOpenModal(); }}>
                                                            Provide Feedback
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-600 dark:text-gray-400">No submissions available.</p>
                                        )}
                                    </div>

                                </div>
                        )) : (
                            <p className="text-gray-600 dark:text-gray-400">No assignments available.</p>
                        )}
                    </div>

                </section>
                <ProvideFeedbackModal 
                    isOpen={isModalOpen} 
                    onClose={handleCloseModal} 
                    onSubmit={() => handleFeedbackSubmit(selectedSubmission)} 
                    marks={marks} 
                    setMarks={setMarks} 
                    comments={comments} 
                    setComments={setComments} 
                    feedbackFile={feedbackFile} 
                    setFeedbackFile={setFeedbackFile} 
                    isSubmittingFeedback={isSubmittingFeedback}
                />

                <Footer />
            </div>
        </div>
    );
};


const ProvideFeedbackModal = ({
    isOpen,
    onClose,
    onSubmit,
    marks,
    setMarks,
    comments,
    setComments,
    isSubmittingFeedback,
    setFeedbackFile
}) => {
    if (!isOpen) return null;

    const handleFileChange = (e) => {
        setFeedbackFile(e.target.files[0]);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
        >
            <div className="relative w-full max-w-xl p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
                {/* Modal Header */}
                <div className="flex items-start justify-between border-b border-gray-200 pb-4 dark:border-gray-600">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                        Provide Feedback
                    </h2>
                    <button
                        onClick={onClose}
                        type="button"
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
                    >
                        <span className="sr-only">Close</span>
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            ></path>
                        </svg>
                    </button>
                </div>

                {/* Modal Body */}
                <div className="mt-4 space-y-6">
                    {/* Marks Input */}
                    <label className="block">
                        <span className="text-gray-800 dark:text-gray-200 font-medium">Marks:</span>
                        <input
                            type="number"
                            className="block w-full mt-2 p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            value={marks}
                            onChange={(e) => setMarks(e.target.value)}
                            placeholder="Enter marks"
                        />
                    </label>

                    {/* Comments Textarea */}
                    <label className="block">
                        <span className="text-gray-800 dark:text-gray-200 font-medium">Comments:</span>
                        <textarea
                            className="block w-full mt-2 p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            placeholder="Enter comments"
                            rows="4"
                        />
                    </label>

                    {/* File Upload */}
                    <label className="block">
                        <span className="text-gray-800 dark:text-gray-200 font-medium">Upload Feedback (PDF):</span>
                        <input
                            type="file"
                            accept="application/pdf"
                            className="block w-full mt-2 p-2 text-gray-800 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:focus:ring-blue-700"
                            onChange={handleFileChange}
                        />
                    </label>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end mt-6">
                    {/* Cancel Button */}
                    <button
                        onClick={onClose}
                        type="button"
                        className="px-4 py-2 mr-3 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                    >
                        Cancel
                    </button>
                    {/* Submit Feedback Button */}
                    <button
                        onClick={onSubmit}
                        type="button"
                        disabled={isSubmittingFeedback}
                        className={`px-5 py-2.5 text-sm font-medium text-white rounded-lg ${
                            isSubmittingFeedback
                                ? 'bg-blue-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800'
                        }`}
                    >
                        {isSubmittingFeedback ? (
                            <svg
                                className="w-5 h-5 text-white animate-spin"
                                fill="none"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z"
                                ></path>
                            </svg>
                        ) : (
                            'Submit Feedback'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};