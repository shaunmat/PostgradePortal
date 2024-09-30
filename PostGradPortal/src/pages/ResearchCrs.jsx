import { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../backend/config'; // Import your Firebase configuration
import { Footer } from '../components/Footer';
import BannerImage from '../assets/images/research_banner.jpg';
import { useParams } from 'react-router-dom';
import { useAuth } from "../backend/authcontext";
import FinalSubmissionModal from "../components/FinalSubmissionModal" 

export const ResearchCourse = () => {
    const { UserData } = useAuth();
    const { researchId } = useParams();
    const [courseDetails, setCourseDetails] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [FinalSubmission, setFinalSubmission] = useState([]);
    const [FileForUpload, setFileForUpload] = useState(null);
    const [topics, setTopics] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState(null); // Track selected topic
    const [feedback, setFeedback] = useState({}); // Store feedback per assignment
    const [submittedAssignments, setSubmittedAssignments] = useState({}); 
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                if (!researchId) {
                    throw new Error('Course ID is undefined or null');
                }

                const moduleRef = doc(db, 'Module', researchId);
                const moduleSnap = await getDoc(moduleRef);

                const FinalSubmissionRef = doc(db, `Module/${researchId}/Final Submission/${UserData.ID}`);
                const FinalSubmissionSnap = await getDoc(FinalSubmissionRef);

                if (moduleSnap.exists()) {
                    const moduleData = moduleSnap.data();
                    setCourseDetails({
                        id: researchId,
                        name: moduleData.ModuleTitle || 'Sample Course',
                        instructor: 'Dr. Placeholder',
                        description: moduleData.ModuleDescription || 'Description not available',
                    });
                    
                    if(FinalSubmissionSnap.exists()){
                        setFinalSubmission(FinalSubmissionSnap.data())
                    } else {
                        setFinalSubmission({
                            SubmissionPermission: false
                        })
                    }

                    // Fetch assignments
                    const assignmentsRef = collection(db, 'Module', researchId, 'Assignments');
                    const assignmentsSnap = await getDocs(assignmentsRef);
                    const assignmentsArray = assignmentsSnap.docs.map(doc => ({
                        ...doc.data(),
                        AssignmentID: doc.id
                    }));
                    setAssignments(assignmentsArray);

                    // Fetch feedback and submission status for each assignment
                    for (let assignment of assignmentsArray) {
                        const studentRef = doc(db, `Module/${researchId}/Assignments/${assignment.AssignmentID}/StudentID/${UserData.ID}`);
                        const studentSnap = await getDoc(studentRef);

                        if (studentSnap.exists()) {
                            const studentData = studentSnap.data();

                            // Set feedback if available
                            setFeedback(prevFeedback => ({
                                ...prevFeedback,
                                [assignment.AssignmentID]: studentData
                            }));

                            // Set submission status
                            setSubmittedAssignments(prevState => ({
                                ...prevState,
                                [assignment.AssignmentID]: studentData.submitted || false // Check if the assignment was submitted
                            }));
                        }
                    }
                } else {
                    console.error('No such module!');
                }
            } catch (error) {
                console.error('Error fetching course details:', error);
            }
        };

        const fetchTopics = async () => {
            try {
                const storageRef = ref(storage, 'r_topics/topics.json');
                const url = await getDownloadURL(storageRef);
                const response = await fetch(url);
                const data = await response.json();
                setTopics(data);
            } catch (error) {
                console.error('Error fetching topics:', error);
            }
        };

        fetchCourseDetails();
        fetchTopics();
    }, [researchId, UserData.ID]);

    const handleFileChange = (event) => {
        setFileForUpload(event.target.files[0]);
    };

    const handleFinalSubmission = async (files) => {
        for (const file of files) {
            try {
                const assignmentID = 'your_assignment_id'; // Update to get the correct assignment ID
                const storageRef = ref(storage, `Submissions/${researchId}/Assignments/${assignmentID}/StudentID/${UserData.ID}/${file.name}`);
                const uploadTask = await uploadBytes(storageRef, file);
                const downloadURL = await getDownloadURL(uploadTask.ref);
    
                const submissionDocRef = doc(db, `Module/${researchId}/Assignments/${assignmentID}/StudentID/${UserData.ID}`);
                await setDoc(submissionDocRef, {
                    downloadURL: downloadURL,
                    submittedAt: new Date(),
                    fileName: file.name,
                    submitted: true // Add the submitted flag
                });
    
                // Mark assignment as submitted in local state
                setSubmittedAssignments(prevState => ({
                    ...prevState,
                    [assignmentID]: true // Set this assignment as submitted
                }));
    
                alert(`File ${file.name} uploaded successfully!`);
            } catch (error) {
                console.error(`Error uploading file ${file.name}:`, error);
                alert(`Error uploading file ${file.name}. Please try again later.`);
            }
        }
    };

    const UploadDocument = async (assignmentID) => {
        if (!FileForUpload) {
            alert("Please select a file to upload");
            return;
        }

        try {
            const storageRef = ref(storage, `Submissions/${researchId}/Assignments/${assignmentID}/StudentID/${UserData.ID}/${FileForUpload.name}`);
            const uploadTask = await uploadBytes(storageRef, FileForUpload);
            const downloadURL = await getDownloadURL(uploadTask.ref);

            const submissionDocRef = doc(db, `Module/${researchId}/Assignments/${assignmentID}/StudentID/${UserData.ID}`);
            await setDoc(submissionDocRef, {
                downloadURL: downloadURL,
                submittedAt: new Date(),
                fileName: FileForUpload.name,
                submitted: true // Add the submitted flag
            });

            // Mark assignment as submitted in local state
            setSubmittedAssignments(prevState => ({
                ...prevState,
                [assignmentID]: true // Set this assignment as submitted
            }));

            alert('File uploaded successfully and submission saved!');
        } catch (error) {
            console.error('Error uploading file and saving submission:', error);
            alert('Error uploading file or saving submission. Please try again later.');
        }
    };

    const handleSelectTopic = async (topic) => {
        if (topic.isSelected) {
            alert('This topic has already been selected by another student.');
            return;
        }

        if (selectedTopic) {
            alert('You have already selected a topic.');
            return;
        }

        try {
            // Mark the topic as selected
            const updatedTopics = topics.map(t => 
                t.topicName === topic.topicName ? { ...t, isSelected: true, selectedBy: UserData.ID } : t
            );

            // Upload the updated topics file to Firebase Storage
            const topicsBlob = new Blob([JSON.stringify(updatedTopics)], { type: 'application/json' });
            const topicsRef = ref(storage, 'r_topics/topics.json');
            await uploadBytes(topicsRef, topicsBlob);

            // Update local state
            setTopics(updatedTopics);
            setSelectedTopic(topic);

            alert(`You have successfully selected the topic: ${topic.topicName}`);
        } catch (error) {
            console.error('Error selecting topic:', error);
            alert('Error selecting topic. Please try again later.');
        }
    };

    if (!courseDetails) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-4 sm:ml-6 sm:mr-6 lg:ml-72 lg:mr-72">
            <div className="p-4 border-2 border-gray-200  rounded-lg dark:border-gray-700 dark:bg-gray-800">                <section className="max-h-80 flex items-center justify-center w-full overflow-hidden rounded-lg relative">
                    <img src={BannerImage} alt="Banner" className="w-full h-full object-cover" />
                    <h1 className="absolute text-4xl font-bold tracking-wider text-white dark:text-gray-200">
                         {courseDetails.name}
                    </h1>
                </section>

                <section className="mt-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                        Welcome to {courseDetails.name}
                    </h2>
                    <p className="mt-2 text-lg font-normal text-gray-700 dark:text-gray-400">
                        {courseDetails.description}
                    </p>
                    <p className="mt-2 text-lg font-normal text-gray-700 dark:text-gray-400">
                        Instructor: {courseDetails.instructor}
                    </p>
                </section>

                <section className="mt-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Final Submission</h2>
                    <div className="border p-4 rounded-lg shadow dark:bg-gray-900 dark:border-gray-700">
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">This is For Your Final Submission</h3>
                            <p>After a long year of research and drafts, this is where you submit your final work for external moderation. Please keep in mind that the following will be needed from you:</p>
                            <p>- A copy of your Affidavit (Stamped by a Commissioner of Oaths)</p>
                            <p>- Your Declaration</p>
                            <p>- Your Final Turnitin Report</p>
                            <p>- Signed Letter as Proof of Language Editing by a Language Editor</p>
                            <p>- A soft Copy of the Research Project/Minor Dissertation/Dissertation/Thesis (Word/PDF only)</p>
                            <br/>
                            {FinalSubmission.SubmissionPermission ? (
                                <button
                                    className="mt-2 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    Begin Submission Process
                                </button>
                            ) : (
                                <p><strong>It seems you are not allowed to make your final submission just yet.</strong></p>
                            )}
                        </div>
                </section>

                <section className="mt-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Available Topics</h2>
                    <ul className="mt-4 space-y-4">
                        {topics.length > 0 ? topics.map((topic, index) => (
                            <li key={index} className="border p-4 rounded-lg shadow dark:bg-gray-900 dark:border-gray-700">
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{topic.topicName}</h3>
                                <p>{topic.description}</p>
                                <p>Status: {topic.isSelected ? "Selected" : "Available"}</p>
                                {!topic.isSelected && !selectedTopic && (
                                    <button
                                        className="mt-2 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                                        onClick={() => handleSelectTopic(topic)}
                                    >
                                        Select Topic
                                    </button>
                                )}
                                {selectedTopic === topic && <p className="text-green-600">You have selected this topic.</p>}
                            </li>
                        )) : (
                            <p>No topics available.</p>
                        )}
                    </ul>
                </section>

                {/* Assignments Section */}
                <section className="mt-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Assignments</h2>
                    <ul className="mt-4 space-y-4">
                    {assignments.length > 0 ? assignments.map((assignment, index) => {
                        const dueDate = assignment?.AssignmentDueDate?.seconds 
                                        ? new Date(assignment.AssignmentDueDate.seconds * 1000)
                                        : null;
                        const isPastDue = dueDate ? dueDate < new Date() : false;
                        const assignmentFeedback = feedback[assignment.AssignmentID]; // Get feedback for assignment
                        return (
                            <li key={index} className="border p-4 rounded-lg shadow dark:bg-gray-900 dark:border-gray-700">
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{assignment.AssignmentTitle}</h3>
                                <p>{assignment.AssignmentDescription}</p>

                                {dueDate ? (
                                    <p>Due Date: {dueDate.toLocaleString()}</p>
                                ) : (
                                    <p>No Due Date Available</p>
                                )}

                                {assignment?.AssignmentCreation?.seconds ? (
                                    <p>Created On: {new Date(assignment.AssignmentCreation.seconds * 1000).toLocaleString()}</p>
                                ) : (
                                    <p>No Creation Date Available</p>
                                )}

                                {!isPastDue && !submittedAssignments[assignment.AssignmentID] ? (
                                    <>
                                        <input type="file" onChange={handleFileChange} />
                                        <button
                                            className="mt-2 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                                            onClick={() => UploadDocument(assignment.AssignmentID)}
                                        >
                                            Submit
                                        </button>
                                    </>
                                ) : isPastDue ? (
                                    <p className="text-red-600">Submission Closed</p>
                                ) : (
                                    <p className="text-green-600">Submitted</p>
                                )}

                                {assignmentFeedback && assignmentFeedback.marks && (
                                    <div className="mt-4 bg-green-100 p-4 rounded-lg">
                                        <h4 className="font-semibold">Feedback:</h4>
                                        <p><strong>Marks:</strong> {assignmentFeedback.marks}</p>
                                        <p><strong>Comments:</strong> {assignmentFeedback.comments}</p>
                                        {assignmentFeedback.downloadURL && (
                                            <a
                                                href={assignmentFeedback.downloadURL}
                                                className="mt-2 inline-block text-blue-600"
                                                target="_blank" rel="noopener noreferrer"
                                            >
                                                Download Feedback
                                            </a>
                                        )}
                                    </div>
                                )}
                            </li>
                        );
                    }) : (
                        <p>No assignments available.</p>
                    )}
                    </ul>
                </section>
            </div>
            <FinalSubmissionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleFinalSubmission} // Updated to handle multiple files
                ResearchID={researchId}
                UserID={UserData.ID}
            />
            <Footer />
        </div>
    );
};
