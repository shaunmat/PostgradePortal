import { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../backend/config'; // Import your Firebase configuration
import { Footer } from '../components/Footer';
import BannerImage from '../assets/images/research_banner.jpg';
import { useParams } from 'react-router-dom';
import { useAuth } from "../backend/AuthContext";

export const ResearchCourse = () => {
    const { UserData } = useAuth();
    const { researchId } = useParams();
    const [courseDetails, setCourseDetails] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [FileForUpload, setFileForUpload] = useState(null);

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

                    // Fetch assignments
                    const assignmentsRef = collection(db, 'Module', researchId, 'Assignments');
                    const assignmentsSnap = await getDocs(assignmentsRef);
                    const assignmentsArray = assignmentsSnap.docs.map(doc => ({
                        ...doc.data(),
                        AssignmentID: doc.id // Capture the assignment ID
                    }));
                    setAssignments(assignmentsArray);
                } else {
                    console.error('No such module!');
                }
            } catch (error) {
                console.error('Error fetching course details:', error);
            }
        };

        fetchCourseDetails();
    }, [researchId]);

    const handleFileChange = (event) => {
        setFileForUpload(event.target.files[0]);
    };

    const UploadDocument = async (assignmentID) => {
        if (!FileForUpload) {
            alert("Please select a file to upload");
            return;
        }
    
        try {
            // Step 1: Upload the file to Firebase Storage with the correct file name
            const storageRef = ref(storage, `Submissions/${researchId}/Assignments/${assignmentID}/StudentID/${UserData.ID}/${FileForUpload.name}`);
            const uploadTask = await uploadBytes(storageRef, FileForUpload);
            const downloadURL = await getDownloadURL(uploadTask.ref);
    
            // Step 2: Store the download URL in Firestore under the correct path
            const submissionDocRef = doc(db, `Module/${researchId}/Assignments/${assignmentID}/StudentID/${UserData.ID}`);
            await setDoc(submissionDocRef, {
                downloadURL: downloadURL,
                submittedAt: new Date(),
                fileName: FileForUpload.name
            });
    
            alert('File uploaded successfully and submission saved!');
        } catch (error) {
            console.error('Error uploading file and saving submission:', error);
            alert('Error uploading file or saving submission. Please try again later.');
        }
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
                        Welcome to {courseDetails.name}
                    </h2>
                    <p className="mt-2 text-lg font-normal text-gray-700 dark:text-gray-400">
                        {courseDetails.description}
                    </p>
                    <p className="mt-2 text-lg font-normal text-gray-700 dark:text-gray-400">
                        Instructor: {courseDetails.instructor}
                    </p>
                </section>

                {/* Assignments */}
                <section className="mt-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Assignments</h2>
                    <ul className="mt-4 space-y-4">
                    {assignments.length > 0 ? assignments.map((assignment, index) => {
                        const dueDate = new Date(assignment.AssignmentDueDate.seconds * 1000);
                        const isPastDue = dueDate < new Date(); // Check if the due date is in the past

                        return (
                            <li key={index} className="border p-4 rounded-lg shadow dark:bg-gray-900 dark:border-gray-700">
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{assignment.AssignmentTitle}</h3>
                                <p>{assignment.AssignmentDescription}</p>
                                <p>Due Date: {dueDate.toLocaleString()}</p>
                                <p>Created On: {new Date(assignment.AssignmentCreation.seconds * 1000).toLocaleString()}</p>

                                {!isPastDue ? (
                                    <>
                                        <input type="file" onChange={handleFileChange} />
                                        <button
                                            className="mt-2 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                                            onClick={() => UploadDocument(assignment.AssignmentID)}
                                        >
                                            Submit
                                        </button>
                                    </>
                                ) : (
                                    <p className="text-red-600">Submission Closed</p>
                                )}
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
