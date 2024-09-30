import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Footer } from '../components/Footer';
import { LogoLoader } from '../components/LogoLoader';
import BannerImage from '../assets/images/banner.jpg';
import { SubmissionModal } from '../components/SubmissionModal';
// import { CreateSubmission } from '../components/SubmissionModal';  // Import the CreateSubmission component
// import { ReviewSubmission } from '../components/SubmissionModal';

const userRole = 'lecturer'; // Change this to 'student' or 'lecturer'

export const TopicContent = () => {
    const { courseId, topicId } = useParams();
    const [courseDetails, setCourseDetails] = useState(null);
    const [topicContent, setTopicContent] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [isCreateSubmissionOpen, setIsCreateSubmissionOpen] = useState(false);  // State for CreateSubmission modal
    const [previewUrl, setPreviewUrl] = useState('');
    const [originalDocumentText, setOriginalDocumentText] = useState('');
    const [newDocumentText, setNewDocumentText] = useState('');
    const [submittedDocumentText, setSubmittedDocumentText] = useState('');
    const [submissionDate, setSubmissionDate] = useState('');
    const [submissionTime, setSubmissionTime] = useState('');
    const [submissionContent, setSubmissionContent] = useState('');
    const [assignmentFiles, setAssignmentFiles] = useState([]);

    useEffect(() => {
        // Fetch course details based on courseId
        const fetchCourseDetails = async () => {
            // Replace with actual fetch call
            const data = {
                id: courseId,
                name: 'Sample Course',
                instructor: 'Dr. John Doe',
                description: 'This course covers various aspects of software engineering...',
                syllabus: [
                    { routeId: 'chapter-1', topic: "Introduction to Software Engineering", content: "This is the content for Introduction to Software Engineering", subtopics: ["Software Development Life Cycle", "Agile Methodology", "Waterfall Model"], subdate: ["10/10/2021", "10/20/2021", "10/30/2021"], assignmentDesc: "This is the assignment description for Introduction to Software Engineering" },
                    { routeId: 'chapter-2', topic: "Software Requirements", content: "This is the content for Software Requirements", subtopics: ["Requirements Elicitation", "Requirements Analysis", "Requirements Specification"], subdate: ["11/01/2021", "11/15/2021", "11/30/2021"] },
                    { routeId: 'chapter-3', topic: "Software Design", content: "This is the content for Software Design", subtopics: ["Design Principles", "Design Patterns", "UML Diagrams"], subdate: ["12/01/2021", "12/10/2021", "12/20/2021"] }
                ]
            };
            setCourseDetails(data);

            // Fetch topic content based on topicId
            const topic = data.syllabus.find((topic) => topic.routeId === topicId);
            setTopicContent(topic);

            // Fetch original and new document text
            const fetchOriginalAndNewText = async () => {
                setOriginalDocumentText(
                    'Text Document Text. This should be fetched from the server.'
                );
                setNewDocumentText(
                    'This is the new document text. It should be fetched from the server.'
                );
            };

            fetchOriginalAndNewText();
        };
        fetchCourseDetails();
    }, [courseId, topicId]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const openReviewModal = () => setIsReviewModalOpen(true);
    const closeReviewModal = () => setIsReviewModalOpen(false);

    const openCreateSubmissionModal = () => setIsCreateSubmissionOpen(true);
    const closeCreateSubmissionModal = () => setIsCreateSubmissionOpen(false);

    const handleFileSave = (file, content) => {
        setSubmittedDocumentText(content);
        setIsSubmitted(true);
        setPreviewUrl(URL.createObjectURL(file));
        console.log('File saved:', file);
    };

    const handleSave = () => {
        // setSubmissionDate();

        // Save submission details
        console.log('Submission Date:', submissionDate);
        console.log('Submission Time:', submissionTime);
        console.log('Submission Content:', submissionContent);
        console.log('Assignment Files:', assignmentFiles);
    }

    // If courseDetails or topicContent is not yet loaded, show a loading state
    if (!courseDetails || !topicContent) {
        return <LogoLoader />;
    }



    return (
        <div className="p-4 sm:ml-6 sm:mr-6 lg:ml-72 lg:mr-72">
            <div className="p-4 border-2 border-gray-200  rounded-lg dark:border-gray-700 dark:bg-gray-800">                {/* Stretch Banner Image with Course Name */}
                <section className="max-h-80 flex items-center justify-center w-full overflow-hidden rounded-lg relative">
                    <img src={BannerImage} alt="Banner" className="w-full h-full object-cover" />
                    <h1 className="absolute text-4xl font-bold tracking-wider text-white dark:text-gray-200">
                        {topicContent.topic}
                    </h1>
                </section>

                {/* Topic Content */}
                <section className="mt-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                        {topicContent.topic}
                    </h2>

                    <p className="mt-2 text-lg font-normal text-gray-700 dark:text-gray-400">
                        {topicContent.content}
                    </p>
                </section>

                <hr className="my-4 border-gray-200 dark:border-gray-600" />

                {/* Conditionally render content based on user role */}
                {userRole === 'student' ? (
                    <section className="mt-6">
                        <p className="mt-2 mb-2 text-base font-normal text-gray-700 dark:text-gray-400">
                            This course requires the following submissions:
                        </p>

                        {/* List of submissions with dates and submission buttons displayed in a column */}
                        <div className="flex flex-col items-start justify-start">
                            {topicContent.subtopics.map((subtopic, index) => (
                                <div key={index} className="w-full mb-4 p-4 border-2 border-gray-200  rounded-lg dark:border-gray-700 dark:bg-gray-800">
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                        {subtopic}
                                    </h3>
                                    <p className="mt-2 text-base font-normal text-gray-700 dark:text-gray-400">
                                        Due Date: {topicContent.subdate[index]}
                                    </p>
                                    <p className="mt-2 text-base font-normal text-gray-700 dark:text-gray-400">
                                        {topicContent.assignmentDesc}
                                    </p>

                                    {!isSubmitted && (
                                        <button
                                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            onClick={openModal}
                                        >
                                            Submit
                                        </button>
                                    )}

                                    {isSubmitted && (
                                        <div className="mt-2">
                                            <p className="mt-2 text-base font-normal text-gray-700 dark:text-gray-400">
                                                Status: Submitted
                                            </p>
                                            <button
                                                className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                                                onClick={openReviewModal}
                                            >
                                                Review Submission
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                ) : userRole === 'lecturer' ? (
                    <section className="mt-6">
                        <p className="mt-2 mb-4 text-base font-normal text-gray-700 dark:text-gray-400">
                            As the instructor for this course, you can manage the submissions and assignments.
                        </p>
                        {/* <button
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                            onClick={openCreateSubmissionModal}
                        >
                            Create Submission
                        </button> */}

                        <div className="flex flex-col items-start justify-start mt-4">
                            {topicContent.subtopics.map((subtopic, index) => (
                                <div key={index} className="w-full mb-4 p-4 border-2 border-gray-200  rounded-lg dark:border-gray-700 dark:bg-gray-800">
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                        {subtopic}
                                    </h3>
                                    <p className="mt-2 text-base font-normal text-gray-700 dark:text-gray-400">
                                        Due Date: {topicContent.subdate[index]}
                                    </p>
                                    <p className="mt-2 text-base font-normal text-gray-700 dark:text-gray-400">
                                        {topicContent.assignmentDesc}
                                    </p>
                                    <div className="mt-2 flex items-center justify-start space-x-4">
                                        <button
                                            className="px-4 py-2 bg-blue-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            onClick={openCreateSubmissionModal}
                                        >
                                            Open Submissions
                                        </button>
                                        <button
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                                        >
                                            Close Submissions
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                ) : null}

                <div className="mt-6 flex items-center justify-between">
                    <Link
                        to={`/courses/course/${courseId}`}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                        Back to Course
                    </Link>
                    <Link
                        to={`/courses/course/${courseId}`}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                        Next Topic
                    </Link>
                </div>

                <Footer />
            </div>

            {/* Submission Modal */}
            <SubmissionModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSave={handleFileSave}
                setPreviewUrl={setPreviewUrl}
            />

            {/* Review Submission Modal */}
            <ReviewSubmission
                isOpen={isReviewModalOpen}
                onClose={closeReviewModal}
                previewUrl={previewUrl}
                oldText={originalDocumentText}
                newText={submittedDocumentText}
            />

            {/* Create Submission Modal */}
            <CreateSubmission
                isOpen={isCreateSubmissionOpen}
                onClose={closeCreateSubmissionModal}
                onSave={handleSave}
            />
        </div>
    );
};
