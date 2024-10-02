import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Select, Spinner } from 'flowbite-react';
import { collection, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../backend/config'; // Import your Firebase configuration
import { Footer } from '../components/Footer';
import BannerImage from '../assets/images/research_banner.jpg';
import BannerImage2 from '../assets/images/banner.jpg';
import { useParams } from 'react-router-dom';
import { useAuth } from '../backend/authcontext'
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { HiChevronLeft, HiChevronDown, HiChevronUp } from 'react-icons/hi';

export const ResearchCourse = () => {
    const navigate = useNavigate();
    const { UserData } = useAuth();
    const { researchId } = useParams();
    const [courseDetails, setCourseDetails] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [FileForUpload, setFileForUpload] = useState(null);
    const [topics, setTopics] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState(null); // Track selected topic
    const [feedback, setFeedback] = useState({}); // Store feedback per assignment
    const [submittedAssignments, setSubmittedAssignments] = useState({}); // Track submitted assignments
    const [isConfirmed, setIsConfirmed] = useState(false); // Track whether a topic selection has been confirmed
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMilestone, setSelectedMilestone] = useState(null);
    const [assignmentFeedback, setAssignmentFeedback] = useState({}); // Store feedback for the modal
    const [isSubmitModalOpen, setSubmitModalOpen] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [selectedAssignmentID, setSelectedAssignmentID] = useState(null);
    const [bannerImage, setBannerImage] = useState(BannerImage); // State for banner image

    const handleOpenModal = () => {
        setSubmitModalOpen(true);
    };
    
    const openModal = (milestone, feedback) => {
        setSelectedMilestone(milestone);
        setAssignmentFeedback(feedback); // Store feedback to pass to the modal
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedMilestone(null);
        setAssignmentFeedback({}); // Clear feedback when closing
    };

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                if (!researchId) {
                    throw new Error('Course ID is undefined or null');
                }

                const moduleRef = doc(db, 'Module', researchId);
                const moduleSnap = await getDoc(moduleRef);

                if (moduleSnap.exists()) {
                    const moduleData = moduleSnap.data();
                    setCourseDetails({
                        id: researchId,
                        name: moduleData.ModuleTitle || 'Sample Course',
                        instructor: 'Dr. Placeholder',
                        description: moduleData.ModuleDescription || 'Description not available',
                    });
                    if (moduleData.bannerImageUrl) {
                        setBannerImage(moduleData.bannerImageUrl); // Update banner image URL
                    } else {
                        // Randomly select an image from the images array
                        const randomImage = images[Math.floor(Math.random() * images.length)];
                        setBannerImage(randomImage);
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
        
                // Filter topics based on courseId
                const courseTopics = data.filter(topic => topic.courseId === researchId);
                setTopics(courseTopics);
        
                // Check if the student has already chosen a topic
                const chosenTopic = courseTopics.find(topic => topic.selectedBy === UserData.ID);
                if (chosenTopic) {
                    setSelectedTopic(chosenTopic);
                    setIsConfirmed(true);
                }
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

            // alert('File uploaded successfully and submission saved!');
            Swal.fire("Success!", 'File uploaded successfully and submission saved!', "success");

            Swal.fire
        } catch (error) {
            console.error('Error uploading file and saving submission:', error);
            // alert('Error uploading file or saving submission. Please try again later.');
            Swal.fire("Error!", "Error uploading file or saving submission. Please try again later.", "error");
         
        }
    };
    
    const handleConfirmSelection = async () => {
        if (!selectedTopic) {
            Swal.fire("Error!", "Please select a topic first.", "error");
            return;
        }
    
        if (selectedTopic.isSelected) {
            Swal.fire("Error!", "This topic has already been selected by another student.", "error");
            return;
        }
    
        if (isConfirmed) {
            Swal.fire("Error!", "You have already confirmed a topic selection.", "error");
            return;
        }
    
        try {
            // Mark the topic as selected
            const updatedTopics = topics.map((t) =>
                t.topicName === selectedTopic.topicName
                    ? { ...t, isSelected: true, selectedBy: UserData.ID }
                    : t
            );
    
            // Upload the updated topics file to Firebase Storage
            const topicsBlob = new Blob([JSON.stringify(updatedTopics)], { type: 'application/json' });
            const topicsRef = ref(storage, 'r_topics/topics.json');
            await uploadBytes(topicsRef, topicsBlob);
    
            // Update local state
            setTopics(updatedTopics);
            setIsConfirmed(true); // Mark the topic as confirmed
    
            Swal.fire("Success!", `You have successfully selected the topic: ${selectedTopic.topicName}`, "success");
        } catch (error) {
            console.error('Error selecting topic:', error);
            Swal.fire("Error!", "Error selecting topic. Please try again later.", "error");
        }
    };

    // Banner images 
    const images = [
        BannerImage,
        BannerImage2
    ];
    

    if (!courseDetails) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spinner size="xl" color="warning" />
            </div>
        );
    }

    return (
        <div className="p-4 sm:ml-6 sm:mr-6 lg:ml-72 lg:mr-72">
            <div className="p-4 border-2 border-gray-200 rounded-lg dark:border-gray-700 dark:bg-gray-800">
                <section className="max-h-80 flex items-center justify-center w-full overflow-hidden rounded-lg relative">
                    <img src={bannerImage} alt="Banner" className="w-full h-full object-cover" />
                    <h1 className="absolute text-4xl font-bold tracking-wider text-white dark:text-gray-200">
                         {courseDetails.name}
                    </h1>
                    {/* Add back button */}
                    <button
                        className="absolute top-3 left-3 flex items-center px-4 py-2 bg-[#FF8503] text-white rounded-lg"
                        onClick={() => navigate(-1)}
                    >
                        <HiChevronLeft className="mr-2" />
                        Back
                    </button>
                </section>

                <section className="mt-6 border-2 border-[#FF8503] rounded-lg p-4">
                    <h2 className="text-3xl font-extrabold text-gray-800 dark:text-gray-200">
                        Welcome to <span className="text-[#FF8503] dark:text-[#FF8503]">{courseDetails.name}</span>
                    </h2>
                    <p className="mt-2 text-lg font-semibold text-gray-700 dark:text-gray-400">
                        {courseDetails.description}
                    </p>
                    <p className="mt-2 text-lg font-normal text-gray-700 dark:text-gray-400" style={{display: 'none'}} >
                        Instructor: {courseDetails.instructor}
                    </p>
                    <div className="mt-6">
                        <h2 className="text-2xl font-extrabold text-gray-800 dark:text-gray-200">Course Overview</h2>
                        <p className="mt-2 text-lg font-normal text-gray-700 dark:text-gray-400">
                            This honours research course aims to equip students with the necessary skills to conduct independent research.
                            The course covers various methodologies, research ethics, and techniques for effective data analysis. 
                            Students will be required to select a relevant topic, engage with their supervisors, and submit regular drafts for feedback.
                        </p>
                        <p className="mt-2 text-lg font-normal text-gray-700 dark:text-gray-400" style={{display: 'none'}}>
                            Key components include:
                        </p>
                        <ul className="list-disc list-inside" style={{display: 'none'}}>
                            <li className="mt-1">Understanding research methodologies</li>
                            <li className="mt-1">Data collection and analysis techniques</li>
                            <li className="mt-1">Research ethics and compliance</li>
                            <li className="mt-1">Thesis writing and presentation skills</li>
                        </ul>

                    </div>
                </section>

                <section className="mt-6" style={{display: 'none'}}>
                    <h2 className="text-2xl font-extrabold text-gray-800 dark:text-gray-200">
                        Select a Thesis Topic
                    </h2>

                    {/* Show the dropdown only when no topic is confirmed */}
                    {!isConfirmed && (
                        <select
                            className="mt-4 p-2 rounded w-full"
                            onChange={(e) => {
                                const selected = topics.find((t) => t.topicName === e.target.value);
                                if (selected) setSelectedTopic(selected); // Set selected topic without marking it as confirmed
                            }}
                            value={selectedTopic ? selectedTopic.topicName : ''}
                        >
                            <option value="" disabled>
                                Select a topic
                            </option>
                            {topics.map((topic, index) => (
                                <option
                                    key={index}
                                    value={topic.topicName}
                                    disabled={topic.isSelected}
                                    style={{
                                        color: topic.isSelected ? 'red' : 'green',
                                    }}
                                    className='font-medium text-sm'
                                >
                                    {topic.topicName} - {topic.isSelected ? 'Unavailable' : 'Available'}
                                </option>
                            ))}
                        </select>
                    )}

                    {/* Show selected topic details when available */}
                    {selectedTopic && (
                        <div className="mt-4">
                            <input
                                type="text"
                                value={selectedTopic.topicName}
                                readOnly
                                className="border p-2 rounded w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400"
                            />
                            <p
                                className={`mt-2 ${
                                    selectedTopic.isSelected ? 'text-red-600' : 'text-green-600'
                                }`}
                            >
                                Status: {selectedTopic.isSelected ? 'Unavailable' : 'Available'}
                            </p>
                        </div>
                    )}

                    {/* Submit button to confirm topic selection, hidden after confirmation */}
                    {!isConfirmed && (
                        <button
                            onClick={handleConfirmSelection}
                            className={`mt-4 px-4 py-2 font-semibold rounded ${
                                selectedTopic ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
                            } text-white`}
                            disabled={!selectedTopic}
                        >
                            Submit Topic Choice
                        </button>
                    )}
                </section>

                <section className="mt-4 border-2 border-[#590098] rounded-lg p-4">
                    {/* Show selected topic details when available */}
                    {isConfirmed && selectedTopic ? (
                        <div>
                            <h2 className="text-2xl font-extrabold text-gray-800 dark:text-gray-200">
                                Chosen topic
                            </h2>
                            <input
                                type="text"
                                value={selectedTopic.topicName}
                                readOnly
                                className="mt-3 border p-2 rounded w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400"
                            />
                            <p className={`mt-2 ${selectedTopic.isSelected ? 'text-red-600' : 'text-green-600'}`}>
                                Status: {selectedTopic.isSelected ? 'Unavailable' : 'Available'}
                            </p>
                        </div>
                    ) : (
                        <div>
                            <h2 className="text-2xl font-extrabold text-gray-800 dark:text-gray-200">
                                Select a Thesis Topic
                            </h2>
                            <select
                                className="mt-4 p-2 rounded w-full"
                                onChange={(e) => {
                                    const selected = topics.find((t) => t.topicName === e.target.value);
                                    if (selected) setSelectedTopic(selected);
                                }}
                                value={selectedTopic ? selectedTopic.topicName : ''}
                            >
                                <option value="" disabled>
                                    Select a topic
                                </option>
                                {topics.map((topic, index) => (
                                    <option
                                        key={index}
                                        value={topic.topicName}
                                        disabled={topic.isSelected}
                                        style={{
                                            color: topic.isSelected ? 'red' : 'green',
                                        }}
                                        className='font-medium text-sm'
                                    >
                                        {topic.topicName} - {topic.isSelected ? 'Unavailable' : 'Available'}
                                    </option>
                                ))}
                            </select>

                            {/* Submit button to confirm topic selection */}
                            <button
                                onClick={handleConfirmSelection}
                                className={`mt-4 px-4 py-2 font-semibold rounded ${
                                    selectedTopic ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
                                } text-white`}
                                disabled={!selectedTopic}
                            >
                                Submit Topic Choice
                            </button>
                        </div>
                    )}
                </section>


                {/* <section className="mt-6">
                    <h2 className="text-2xl font-extrabold text-gray-800 dark:text-gray-200">
                        Deadlines & Submissions
                    </h2>

                    <div className="mt-4">
                    {assignments.length > 0 ? (
                    <Timeline 
                        tasks={assignments.map((assignment) => {
                            // Convert timestamp to a valid Date object
                            const dueDateTimestamp = assignment.AssignmentDueDate?.seconds * 1000;
                            const dueDate = new Date(dueDateTimestamp);

                            // Check if the due date is valid
                            const isPastDue = !isNaN(dueDate) && dueDate < new Date();

                            return {
                                title: assignment.AssignmentTitle,
                                dueDate, 
                                description: assignment.AssignmentDescription,
                                module: courseDetails.name,
                                submissionOpen: !isPastDue && !submittedAssignments[assignment.AssignmentID], // Check if submission is open
                                submitted: !!submittedAssignments[assignment.AssignmentID], // Check if submitted
                                assignmentID: assignment.AssignmentID // Add AssignmentID for use in openModal
                            };
                        })} 
                        onViewDetails={(milestone) => {
                            const feedbackForMilestone = feedback[milestone.assignmentID]; 
                            openModal(milestone, feedbackForMilestone);
                            setSelectedAssignmentID(milestone.assignmentID); // Set the selected assignment ID
                        }}
                        handleOpenModal={handleOpenModal} // Pass down the modal open handler
                    />
                ) : (
                    <p className="mt-4 text-gray-500 dark:text-gray-400">
                        No deadlines or submissions available.
                    </p>
                )}

                    </div>
                </section> */}


                {/* Timeline Section, only appears after topic is confirmed */}
                {isConfirmed && (
                    <section className="border-2 mt-4 border-[#FF8503] rounded-lg p-4">
                        <h2 className="text-2xl font-extrabold text-gray-800 dark:text-gray-200">
                            Deadlines & Milestones
                        </h2>

                        <div className="mt-4">
                            {assignments.length > 0 ? (
                                <>
                                    {/* Check if it's the first submission */}
                                    {Object.keys(submittedAssignments).length === 0 ? (
                                        <p className="mt-4 mb-4 text-green-600 dark:text-green-400">
                                            This is your first milestone. Please review the deadlines carefully and submit on time.
                                        </p>
                                    ) : null}

                                    <Timeline 
                                        tasks={assignments.map((assignment) => {
                                            const dueDateTimestamp = assignment.AssignmentDueDate?.seconds * 1000;
                                            const dueDate = new Date(dueDateTimestamp);
                                            const isPastDue = !isNaN(dueDate) && dueDate < new Date();

                                            return {
                                                title: assignment.AssignmentTitle,
                                                dueDate, 
                                                description: assignment.AssignmentDescription,
                                                module: courseDetails.name,
                                                submissionOpen: !isPastDue && !submittedAssignments[assignment.AssignmentID],
                                                submitted: !!submittedAssignments[assignment.AssignmentID],
                                                assignmentID: assignment.AssignmentID
                                            };
                                        })} 
                                        onViewDetails={(milestone) => {
                                            console.log("Milestone:", milestone); // Log milestone
                                            const feedbackForMilestone = feedback[milestone.assignmentID]; 
                                            console.log("Feedback for Milestone:", feedbackForMilestone); // Log feedback for milestone
                                            if (!feedbackForMilestone) {
                                                console.error(`No feedback found for assignmentID: ${milestone.assignmentID}`);
                                            }
                                            openModal(milestone, feedbackForMilestone);
                                            setSelectedAssignmentID(milestone.assignmentID);
                                        }}
                                        handleOpenModal={handleOpenModal}
                                    />

                                    {/* Check if all milestones are submitted */}
                                    {assignments.every(assignment => submittedAssignments[assignment.AssignmentID]) && (
                                        <p className="mt-4 text-blue-600 dark:text-blue-400">
                                            More milestones coming soon.
                                        </p>
                                    )}
                                </>
                            ) : (
                                <p className="mt-4 text-gray-500 dark:text-gray-400">
                                    No deadlines or submissions available.
                                </p>
                            )}
                        </div>
                    </section>
                )}



                {/* <section className="mt-6" style={{display: 'none'}} >
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
                </section> */}

                {/* Assignments Section */}
                <section className="mt-6" style={{display: 'none'}}>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Assignments</h2>
                    <ul className="mt-4 space-y-4">
                        {assignments.length > 0 ? assignments.map((assignment, index) => {
                            const dueDate = new Date(assignment.AssignmentDueDate.seconds * 1000);
                            const isPastDue = dueDate < new Date();
                            const assignmentFeedback = feedback[assignment.AssignmentID]; // Get feedback for assignment

                            return (
                                <li key={index} className="border p-4 rounded-lg shadow dark:bg-gray-900 dark:border-gray-700">
                                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{assignment.AssignmentTitle}</h3>
                                    <p>{assignment.AssignmentDescription}</p>
                                    <p>Due Date: {dueDate.toLocaleString()}</p>
                                    <p>Created On: {new Date(assignment.AssignmentCreation.seconds * 1000).toLocaleString()}</p>

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
            {/* Modals */}
            <ViewMilestoneModal 
                isOpen={isModalOpen} 
                onClose={closeModal} 
                milestone={selectedMilestone} 
                feedback={assignmentFeedback}
            />

            <SubmissionModal 
                isOpen={isSubmitModalOpen} 
                onClose={() => setSubmitModalOpen(false)} 
                assignmentID={selectedAssignmentID} // Pass the selected assignment ID
                researchId={researchId} // Pass researchId if needed
                UserData={UserData} 
                storage={storage} 
                db={db} 
            />


            <Footer />
        </div>
    );
};

import { useDropzone } from 'react-dropzone';

const SubmissionModal = ({ isOpen, onClose, assignmentID, researchId, UserData, storage, db }) => {
  const [files, setFiles] = useState([]);
  const [isChecked, setIsChecked] = useState(false);

  // Handle file change and set the file for upload
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFiles([selectedFile]); // Store selected file in the files state
    }
  };

  // Handle file upload and document submission
  const UploadDocument = async () => {
    if (files.length === 0) {
      Swal.fire('Error', 'Please select a file to upload', 'error');
      return;
    }

    const FileForUpload = files[0]; // Get the first file from the files array

    // Debugging output
    // console.log('Uploading file:', FileForUpload);
    // console.log('researchId:', researchId);
    // console.log('assignmentID:', assignmentID);
    // console.log('UserData.ID:', UserData.ID);


    try {
      const storageRef = ref(storage, `Submissions/${researchId}/Assignments/${assignmentID}/StudentID/${UserData.ID}/${FileForUpload.name}`);
      const uploadTask = await uploadBytes(storageRef, FileForUpload);
      const downloadURL = await getDownloadURL(uploadTask.ref);

      const submissionDocRef = doc(db, `Module/${researchId}/Assignments/${assignmentID}/StudentID/${UserData.ID}`);
      await setDoc(submissionDocRef, {
        downloadURL: downloadURL,
        submittedAt: new Date(),
        fileName: FileForUpload.name,
        submitted: true, // Set the submission status
      });

      // Display success message
      toast.success('File uploaded successfully and submission saved!');
      // Close the modal after successful submission
      onClose();
    } catch (error) {
      console.error('Error uploading file and saving submission:', error);
      // Display error message
      toast.error('Error uploading file or saving submission. Please try again later.');
    }
  };

  // Handles checkbox state change
  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  // Render nothing if modal is closed
  if (!isOpen) return null;

  return (
    <div id="static-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-3xl max-h-full bg-white rounded-lg shadow-lg dark:bg-gray-700 p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Submit Assignment</h2>
        <form>
          <div className="mb-4">
            <Dropzone onDrop={(acceptedFiles) => setFiles(acceptedFiles)} />
            <input
              id="fileInput"
              type="file"
              className="hidden focus:outline-none"
              onChange={handleFileChange}
            />
            {files.length > 0 && (
              <p className="mt-2 text-gray-700 dark:text-gray-300">
                {files.map((file, index) => (
                  <span key={index}>{file.name}</span>
                ))}
              </p>
            )}
            <button
              type="button"
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg focus:outline-none"
              onClick={() => document.getElementById('fileInput').click()}
            >
              Upload File
            </button>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-200">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={handleCheckboxChange}
                className="mr-2 rounded-full"
              />
              By submitting, I acknowledge that this is my own work and I have not plagiarized.
            </label>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg focus:outline-none"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="ml-2 px-4 py-2 bg-[#FF8503] text-white rounded-lg focus:outline-none"
              onClick={UploadDocument}
              disabled={!isChecked}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Dropzone = ({ onDrop }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps({
        className:
          'dropzone flex items-center justify-center p-6 border-2 border-gray-400 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:text-gray-300 dark:bg-gray-700',
      })}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className="text-blue-500 dark:text-blue-400">Drop the files here...</p>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">
          Drag & drop some files here, or click to select files
        </p>
      )}
    </div>
  );
};

import { AnimatePresence, motion } from 'framer-motion';
import { HiOutlineClipboardList, HiOutlineXCircle, HiOutlineCalendar, HiOutlineDocumentText, HiOutlineChatAlt } from 'react-icons/hi';

const ViewMilestoneModal = ({ isOpen, onClose, milestone, feedback }) => {
    if (!isOpen || !milestone) return null;

    const moduleColors = {
        'Database Structuring': '#00bfff',
        'Software Testing': '#590098',
        'Game Development': '#FF8503',
        'Development Software': '#00ad43',
    };

    const outlineColor = moduleColors[milestone.module] || 'bg-gray-200';

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-50 overflow-y-auto bg-gray-800 bg-opacity-50 flex justify-center items-center"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="bg-white dark:bg-gray-800 w-11/12 md:max-w-lg mx-auto rounded-xl shadow-lg z-50 overflow-y-auto p-6"
                        style={{ border: `4px solid ${outlineColor}` }}
                    >
                        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 mb-4">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                                Milestone Details
                            </h2>
                            <button
                                onClick={onClose}
                                className="text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200"
                            >
                                <HiOutlineXCircle className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="text-gray-800 dark:text-gray-200">
                                <div className="flex items-center space-x-2">
                                    <HiOutlineClipboardList className="h-5 w-5 text-blue-500" />
                                    <p className="font-bold text-lg">Milestone Title:</p>
                                </div>
                                <p className="font-normal text-md mt-1 text-gray-800 dark:text-gray-200">
                                    {milestone.title}
                                </p>
                            </div>
                            <div className="text-gray-800 dark:text-gray-200">
                                <div className="flex items-center space-x-2">
                                    <HiOutlineCalendar className="h-5 w-5 text-green-500" />
                                    <p className="font-bold text-lg">Due Date:</p>
                                </div>
                                <p className="font-normal text-md mt-1">{new Date(milestone.dueDate).toLocaleString()}</p>
                            </div>
                            <div className="text-gray-800 dark:text-gray-200">
                                <div className="flex items-center space-x-2">
                                    <HiOutlineDocumentText className="h-5 w-5 text-yellow-500" />
                                    <p className="font-bold text-lg">Description:</p>
                                </div>
                                <p className="font-normal text-md mt-1">{milestone.description}</p>
                            </div>

                            {/* Feedback Section */}
                            {feedback && feedback.marks ? (
                                <div className="mt-4 bg-green-100 p-4 rounded-lg">
                                    <div className="flex items-center space-x-2">
                                        <h4 className="font-extrabold text-lg mb-2">Feedback</h4>
                                    </div>
                                    <p className="text-sm font-medium mt-1">
                                        <strong>Marks:</strong> {feedback.marks !== undefined ? feedback.marks : 'Not Available'}
                                    </p>
                                    <p className="text-sm font-medium mt-1">
                                        <strong>Comments:</strong> {feedback.comments || 'Not Available'}
                                    </p>
                                    {feedback.downloadURL && (
                                        <a
                                            href={feedback.downloadURL}
                                            className="mt-2 inline-block text-blue-600"
                                            target="_blank" rel="noopener noreferrer"
                                        >
                                            Download Feedback
                                        </a>
                                    )}
                                </div>
                            ) : (
                                <p className="mt-4 text-gray-500">No feedback available.</p>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ViewMilestoneModal;


export const Timeline = ({ tasks, onViewDetails, handleOpenModal }) => {
    const sortedTasks = [...tasks].sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
    const latestTask = sortedTasks[0]; // First task in the sorted list is the latest

    const [isExpanded, setIsExpanded] = useState(false);

    const moduleColors = {
        'Development Software': 'bg-[#00ad43]',
        'Game Development': 'bg-[#FF8503]',
        // Add other module colors as needed
    };

    const handleToggle = () => {
        setIsExpanded((prev) => !prev);
    };

    return (
        <section className="relative border-l ml-8 border-gray-200 dark:border-gray-700">
            {sortedTasks.slice(0, isExpanded ? sortedTasks.length : 3).map((task, index) => {
                const isLatest = task === latestTask; // Check if the current task is the latest

                return (
                    <div key={index} className="mb-8 pl-5 relative">
                        <span
                            className={`absolute flex items-center justify-center w-6 h-6 ${
                                moduleColors[task.module] || 'bg-blue-100'
                            } rounded-full -left-3 ring-8 ring-white dark:ring-gray-900`}
                        >
                            <svg
                                className="w-2.5 h-2.5 text-white dark:text-blue-300"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                            </svg>
                        </span>
                        <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                            {task.title}
                            {isLatest && (
                                <span className="bg-blue-100 text-blue-800 text-sm font-medium mx-3 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                                    Latest
                                </span>
                            )}
                        </h3>
                        <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                            Due Date: {new Date(task.dueDate).toLocaleString()}
                        </time>
                        <p className="mb-2 text-base font-normal text-gray-500 dark:text-gray-400">
                            {task.description}
                        </p>
                        <p className="mb-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                            {task.module}
                        </p>

                        <p
                            className={`mb-2 text-sm font-medium ${
                                task.submissionOpen
                                    ? 'text-green-600 dark:text-green-400'
                                    : 'text-red-600 dark:text-red-400'
                            }`}
                        >
                            Submission Status: {task.submissionOpen ? 'Open' : 'Closed'}
                        </p>

                        {task.submitted ? (
                            <p onClick={handleOpenModal} className="text-green-600 text-sm font-medium dark:text-green-400 mb-2">
                                Submitted
                            </p>
                        ) : (
                            <p className="text-red-600 text-sm font-medium dark:text-red-400 mb-2">
                                Not Submitted
                            </p>
                        )}

                        <button
                            onClick={() => onViewDetails(task)}
                            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
                        >
                            View Details
                        </button>

                        {task.submissionOpen ? (
                            <button
                                onClick={() => handleOpenModal()}
                                className="mt-2 ml-2 px-4 py-2 bg-[#FF8503] text-white rounded"
                            >
                                Submit
                            </button>
                        ) : (
                            <button
                                disabled
                                className="mt-2 ml-2 px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed"
                            >
                                Submission Closed
                            </button>
                        )}
                    </div>
                );
            })}

            {sortedTasks.length > 3 && (
                <button
                    onClick={handleToggle}
                    className="mt-2 px-3 py-3 bg-blue-600 text-white rounded-full absolute bottom-0 right-0"
                >
                    {isExpanded ? (
                        <>
                            <HiChevronUp />
                        </>
                    ) : (
                        <>
                            <HiChevronDown />
                        </>
                    )}
                </button>
            )}
        </section>
    );
};