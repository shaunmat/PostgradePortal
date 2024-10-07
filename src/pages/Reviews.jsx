// components/Review.jsx
import { Card, Button, Badge } from "flowbite-react";
import { Footer } from "../components/Footer";
import { Modal } from "flowbite-react";
import { db, storage } from "../backend/config";
import { auth } from "../backend/config";
import { useAuth } from "../backend/authcontext";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";


export const Review = () => {
    const { Loading, UserData } = useAuth();
    const [role, setRole] = useState("");
    const [ExaminerID, setSExaminerID] = useState("");
    const [ExaminerName, setExaminerName] = useState("");
    const [ExaminerSurname, setExaminerSurname] = useState("");
    const [ExaminerEmail, setExaminerEmail] = useState("");
    const [ExaminerDepartment, setExaminerDepartment] = useState("");
    const [ExaminerImage, setExaminerImage] = useState("");
    const [Modules, setModules] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedPdf, setSelectedPdf] = useState("");
    const [courseDetails, setCourseDetails] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [submissions, setSubmissions] = useState([]); // Store submissions for each assignment
    const [selectedSubmission, setSelectedSubmission] = useState(null); // For feedback
    const [feedbackFile, setFeedbackFile] = useState(null);
    const [marks, setMarks] = useState('');
    const [comments, setComments] = useState('');
    const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
    const [isFeedbackModalOpen, setFeedbackModalOpen] = useState(false);
    const [isFeedbackSuccess, setFeedbackSuccess] = useState(false);
    const [isFeedbackError, setFeedbackError] = useState(false);
    const [supervisorDetails, setSupervisorDetails] = useState(null);

    useEffect(() => {
        if (!Loading && UserData) {
            setRole(UserData.UserRole);
            setSExaminerID(UserData.ID);
        }

        // console.log('UserData:', UserData);
        // console.log('ExaminerID:', ExaminerID);

        const fetchExaminerDetails = async () => {
            try {
                const examinerQuery = query(collection(db, 'Examiner'), where('ExaminerID', '==', Math.floor(ExaminerID)));
                const examinerSnapshot = await getDocs(examinerQuery);
                examinerSnapshot.forEach((doc) => {
                    const data = doc.data();
                    setExaminerName(data.Name);
                    setExaminerSurname(data.Surname);
                    setExaminerEmail(data.Email);
                    setExaminerDepartment(data.Department);
                    setExaminerImage(data.ProfilePicture);
                });
            } catch (error) {
                console.error('Error fetching examiner details:', error);
            }
        }

        const fetchSupervisor = async () => {
            try {
                const supervisorQuery = query(collection(db, 'Supervisor'));
                const supervisorSnapshot = await getDocs(supervisorQuery);
                supervisorSnapshot.forEach((doc) => {
                    const data = doc.data();
                    setSupervisorDetails(data);
                });
            } catch (error) {
                console.error('Error fetching supervisor details:', error);
            }
        }

        const fetchModules = async () => {
            try {
                const moduleRef = collection(db, 'Module');
                const moduleSnapshot = await getDocs(moduleRef);
                const moduleData = [];
                moduleSnapshot.forEach((doc) => {
                    const data = doc.data();
                    moduleData.push(data);
                });
                setModules(moduleData);
            } catch (error) {
                console.error('Error fetching modules:', error);
            }

            console.log('Modules:', Modules);

            // // Fetch course details
            // if (UserData && UserData.CourseID) {
            //     fetchCourseDetails(UserData.CourseID);
            // }

        }





        fetchSupervisor();
        fetchExaminerDetails();
        fetchModules();

    }, [Loading, UserData]);
  
  
  return (
    <div className="p-4 sm:ml-6 sm:mr-6 lg:ml-72 lg:mr-72">
      <div className="p-4 border-2 border-gray-200  rounded-lg dark:border-gray-700 dark:bg-gray-800">        
        {/* Review Section Header */}
        <section className="mb-6">
          <h1 className="text-3xl font-extrabold tracking-wider text-gray-800 dark:text-gray-200">
            Review Submissions
          </h1>
          <p className="text-lg font-normal mt-2 text-gray-700 dark:text-gray-400">
            Pending thesis submissions for your review.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card>
            <h2 className="font-bold mb-4 text-lg text-gray-800">PhD Thesis List</h2>
            <div className="mb-4 p-2 border rounded-lg flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-800">Student: John Doe</p>
                <p className="text-sm text-gray-600">Thesis Title: Machine Learning in Healthcare</p>
                <p className="text-sm text-gray-600">Submission Time: 23:59</p>
                <Badge color="warning" className="mt-1">Pending Review</Badge>
              </div>
              <div className="flex gap-2">
                  <Button
                  gradientDuoTone="orangeToPink"
                >
                  View
                </Button>
                <Button gradientDuoTone="orangeToPink">Download</Button>
              </div>
            </div>
            <div className="p-2 border rounded-lg flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-800">Student: Jane Smith</p>
                <p className="text-sm text-gray-600">Thesis Title: AI in Financial Modeling</p>
                <p className="text-sm text-gray-600">Submission Time: 18:30</p>
                <Badge color="warning" className="mt-1">Pending Review</Badge>
              </div>
              <div className="flex gap-2">
                <Button gradientDuoTone="orangeToPink">View</Button>
                <Button gradientDuoTone="orangeToPink">Download</Button>
              </div>
            </div>
            <div className="p-2 border rounded-lg flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-800">Student: Michael Brown</p>
                <p className="text-sm text-gray-600">Thesis Title: Data Science in Education</p>
                <p className="text-sm text-gray-600">Submission Time: 14:45</p>
                <Badge color="warning" className="mt-1">Pending Review</Badge>
              </div>
              <div className="flex gap-2">
                <Button gradientDuoTone="orangeToPink">View</Button>
                <Button gradientDuoTone="orangeToPink">Download</Button>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="font-bold mb-4 text-lg text-gray-800">Masters Thesis List</h2>
            <div className="mb-4 p-2 border rounded-lg flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-800">Student: Alice Johnson</p>
                <p className="text-sm text-gray-600">Thesis Title: Sustainable Energy Systems</p>
                <p className="text-sm text-gray-600">Submission Time: 12:00</p>
                <Badge color="warning" className="mt-1">Pending Review</Badge>
              </div>
              <div className="flex gap-2">
                <Button gradientDuoTone="orangeToPink">View</Button>
                <Button gradientDuoTone="orangeToPink">Download</Button>
              </div>
            </div>
            <div className="p-2 border rounded-lg flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-800">Student: Michael Brown</p>
                <p className="text-sm text-gray-600">Thesis Title: Data Science in Education</p>
                <p className="text-sm text-gray-600">Submission Time: 14:45</p>
                <Badge color="warning" className="mt-1">Pending Review</Badge>
              </div>
              <div className="flex gap-2">
                <Button gradientDuoTone="orangeToPink">View</Button>
                <Button gradientDuoTone="orangeToPink">Download</Button>
              </div>
            </div>
            <div className="p-2 border rounded-lg flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-800">Student: Michael Brown</p>
                <p className="text-sm text-gray-600">Thesis Title: Data Science in Education</p>
                <p className="text-sm text-gray-600">Submission Time: 14:45</p>
                <Badge color="warning" className="mt-1">Pending Review</Badge>
              </div>
              <div className="flex gap-2">
                <Button gradientDuoTone="orangeToPink" 

                >View</Button>
                <Button gradientDuoTone="orangeToPink">Download</Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Placeholder section for additional content */}
        <Card className="flex items-center justify-center bg-white dark:bg-gray-800 p-4" style={{display: "none"}}>
          <p className="text-gray-500">Additional resources and feedback tools can be added here.</p>
        </Card>

        

        {/* PDF Review Modal */}
        {/* <ViewPopupModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          pdfUrl={selectedPdf}
        /> */}
      </div>
    </div>
  );
};

