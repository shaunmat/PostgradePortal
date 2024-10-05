// State Initialization
const [role, setRole] = useState(null);
const [SupervisorID, setSupervisorID] = useState(null);
const [StudentID, setStudentID] = useState(null);
const [ExaminerID, setExaminerID] = useState(null);
const [AdminID, setAdminID] = useState(null);
const [adminDetails, setAdminDetails] = useState([]);
const [examinerDetails, setExaminerDetails] = useState([]);
const [studentDetails, setStudentDetails] = useState([]);
const [supervisorDetails, setSupervisorDetails] = useState([]);

// Authentication and Role Setting
useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (user) {
            const userId = user.email.substring(0, 9);
            console.log("Here is the userId:", userId);

            try {
                // Supervisor Query
                const supervisorQuery = query(
                    collection(db, 'Supervisor'),
                    where('ID', '==', Math.floor(userId))
                );
                const supervisorSnapshot = await getDocs(supervisorQuery);

                if (!supervisorSnapshot.empty) {
                    setRole('Supervisor');
                    setSupervisorID(userId);
                    console.log("Supervisor found and role set.");
                } else {
                    // Student Query
                    const studentQuery = query(
                        collection(db, 'Student'),
                        where('ID', '==', Math.floor(userId))
                    );
                    const studentSnapshot = await getDocs(studentQuery);

                    if (!studentSnapshot.empty) {
                        setRole('Student');
                        setStudentID(userId);
                        console.log("Student found and role set.");
                    } else if (userId === '220143805') {
                        // Admin Query
                        const adminQuery = query(
                            collection(db, 'Admin'),
                            where('AdminID', '==', Math.floor(userId))
                        );
                        const adminSnapshot = await getDocs(adminQuery);

                        if (!adminSnapshot.empty) {
                            setRole('Admin');
                            setAdminDetails(userId);
                            setAdminID(userId);
                            console.log("Admin found and role set.");
                        }
                    } else if (user.email === "anelemabuza@externalexaminer.co.za") {
                        // Examiner Query
                        console.log('This is true here is the user email:', user.email);
                        const examinerId = user.email.substring(0, 11);
                        console.log('Examiners id', examinerId);
                        const examinerQuery = query(
                            collection(db, 'Examiner'),
                            where('ExaminerID', '==', examinerId)
                        );
                        const examinerSnapshot = await getDocs(examinerQuery);
                        console.log('the examinerSnapshot', examinerSnapshot);
                        if (!examinerSnapshot.empty) {
                            const examinerData = examinerSnapshot.docs[0].data(); // Extract examiner data
                            setRole('Examiner');
                            setExaminerDetails(examinerId);
                            setExaminerID(examinerId);
                            setAdminID(examinerData.AdminID); // **Set AdminID here**
                            console.log("Examiner found and role set:", examinerData);
                        } else {
                            console.log('No Examiner found');
                        }
                    }
                }
            } catch (error) {
                console.error("Error querying Firestore:", error);
            }
        } else {
            // No user logged in, clear state
            setSupervisorID(null);
            setStudentID(null);
            setRole(null);
            setExaminerID(null);
            setAdminID(null);
            console.log("No user is logged in");
        }
    });

    return () => unsubscribe();
}, []);

// Track changes to Admin Details
useEffect(() => {
    console.log('Updated Admin Details:', adminDetails);
}, [adminDetails]);

// Track changes to Examiner Details
useEffect(() => {
    console.log('Updated Examiner Details:', examinerDetails);
}, [examinerDetails]);

// Fetch Additional Details Based on Role and IDs
useEffect(() => {
    const fetchDetails = async () => {
        const studentdetsArray = [];
        const supervisorsArray = [];
        const adminArray = [];
        const examinerArray = [];
        const courseIdArray = [];

        try {
            if (role === 'Supervisor') {
                const q = query(
                    collection(db, 'Student'),
                    where('SupervisorID', 'array-contains', Math.floor(SupervisorID))
                );
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach(doc => {
                    const data = doc.data();
                    studentdetsArray.push({
                        ProfilePicture: data.ProfilePicture,
                        StudentID: data.ID,
                        StudentName: data.Name,
                        StudentSurname: data.Surname,
                        lastInteraction: "Just now",
                        StudentType: data.StudentType
                    });
                    courseIdArray.push({
                        CourseID: data.StudentType
                    });
                });

            } else if (role === 'Student' && StudentID) {
                const studentDocs = await getDocs(
                    query(collection(db, 'Student'), where('ID', '==', Math.floor(StudentID)))
                );
                if (!studentDocs.empty) {
                    const studentData = studentDocs.docs[0].data();
                    const supervisorIDs = studentData.SupervisorID;

                    // Query supervisor collection based on SupervisorIDs
                    const supervisorDocs = await getDocs(
                        query(collection(db, 'Supervisor'), where('ID', 'in', supervisorIDs))
                    );
                    supervisorDocs.forEach(doc => {
                        const data = doc.data();
                        supervisorsArray.push({
                            SupervisorID: data.ID,
                            SupervisorName: data.Name,
                            SupervisorSurname: data.Surname,
                            ProfilePicture: data.ProfilePicture,
                            Title: data.Title
                        });
                    });
                }
            } else if (role === 'Admin' && AdminID) {
                console.log('Fetching examiners for AdminID:', AdminID);
                const examinerQuery = query(
                    collection(db, 'Examiner'),
                    where('AdminID', '==', Math.floor(AdminID))
                );
                const examinerSnapshot = await getDocs(examinerQuery);
                examinerSnapshot.forEach(doc => {
                    const data = doc.data();
                    examinerArray.push({
                        ExaminerID: data.ExaminerID,
                        Title: data.Title,
                        ExaminerName: data.ExaminerName,  // Corrected typo
                        ExaminerSurname: data.ExaminerSurname
                    });
                });
                setExaminerDetails(examinerArray);
            } else if (role === 'Examiner' && ExaminerID) {
                console.log('Fetching admin details for ExaminerID:', ExaminerID);
                const examinerDocs = await getDocs(
                    query(collection(db, 'Examiner'), where('ExaminerID', '==', ExaminerID))
                );
                console.log('this examinerDocs', examinerDocs);
                if (!examinerDocs.empty) {
                    const examinerData = examinerDocs.docs[0].data();
                    const fetchedAdminID = examinerData.AdminID; // Use a different variable to avoid shadowing
                    // Now, fetch the admin details based on the fetched AdminID
                    const adminQuery = query(
                        collection(db, 'Admin'),
                        where('AdminID', '==', Math.floor(fetchedAdminID))
                    );
                    const adminSnapshot = await getDocs(adminQuery);
                    adminSnapshot.forEach(doc => {
                        const data = doc.data();
                        adminArray.push({
                            AdminID: data.AdminID,
                            Department: data.Department
                        });
                    });
                    setAdminDetails(adminArray);
                    console.log('Admin Details:', adminArray);
                } else {
                    console.log('No Admin found for this Examiner');
                }
            } else {
                console.log('No matching role or IDs found for fetching details.');
            }

            // Update state with fetched details
            setStudentDetails(studentdetsArray);
            setSupervisorDetails(supervisorsArray);
            // setAdminDetails(adminArray); // Already set within each role condition
            // setExaminerDetails(examinerArray); // Already set within each role condition
            console.log('Updated Examiner Details:', examinerArray);
            console.log('Admin Details:', adminArray);

        } catch (error) {
            console.error("Error fetching details:", error);
        }
    };

    if (role && AdminID) { // Now AdminID is set for Examiners
        fetchDetails();
    }
}, [StudentID, SupervisorID, ExaminerID, AdminID, role]);











// import { useEffect, useState } from "react";
// import { Footer } from "../components/Footer";
// import { Modal } from "../components/Modal";
// import { motion } from "framer-motion";
// import avatar from "../assets/images/avatar.png";
// import { auth, db } from "../backend/config"; // Import your firebase config
// import { getDocs, query, collection, where } from "firebase/firestore";
// import { useAuth } from "../backend/authcontext";
// import Dropdown from 'react-bootstrap/Dropdown';
// import DropdownButton from 'react-bootstrap/DropdownButton';
// import { doc, getDoc, setDoc, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore";
// export const Inbox = () => {
//     const { CurrentUser } = useAuth();
//     const [studentDetails, setStudentDetails] = useState([]);
//     const [selectedLecturer, setSelectedLecturer] = useState(null);
//     const [selectedAdmin, setSelectedAdmin] = useState(null);
//     const [selectedExaminer, setSelectedExaminer] = useState(null);
//     const [supervisorDetails, setSupervisorDetails] = useState([]);
//     const [adminDetails, setAdminDetails] = useState([]);
//     const [examinerDetails, setExaminerDetails] = useState([])
//     const [SupervisorID, setSupervisorID] = useState(null);
//     const [StudentID, setStudentID] = useState(null);
//     const [AdminID, setAdminID] = useState(null);
//     const [ExaminerID, setExaminerID] = useState(null);
//     const [selectedStudent, setSelectedStudent] = useState(null);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [courseOptions, setCourseOptions] = useState([]);
//     const [role, setRole] = useState(null);
//     const [filterCourseID, setFilterCourseID] = useState(null);
//     const [selectedStudentType, setSelectedStudentType] = useState(null);
//     const [chatId, setChatId] = useState(null);

//     useEffect(() => {
//         const unsubscribe = auth.onAuthStateChanged(async (user) => {
//             if (user) {
//                 const userId = user.email.substring(0, 9);
//                 console.log("Here is the userId", userId)
//                 try {
//                     const supervisorDoc = await getDocs(query(collection(db, 'Supervisor'), where('ID', '==', Math.floor(userId))));
//                     console.log("Supervisor query executed, document snapshot:", supervisorDoc);
//                     if (!supervisorDoc.empty) {
//                         setRole('Supervisor');
//                         setSupervisorID(userId);
//                         console.log("Its supervisors not inbox empty")
//                         console.log("Role This is the role in the if statement ", role);

//                     } else {
//                         const studentDoc = await getDocs(query(collection(db, 'Student'), where('ID', '==', Math.floor(userId))));
//                         console.log("Student query executed, document snapshot:", studentDoc);
//                         if (!studentDoc.empty) {
//                             setRole('Student');
//                             setStudentID(userId);
//                             console.log("The student inbox is not empty")
//                         }
//                         else if (userId == '220143805') {
//                             const adminDoc = await getDoc(query(collection(db, 'Admin')));
//                             if (!adminDoc) {
//                                 setRole('Admin');
//                                 setAdminDetails(userId);
//                                 console.log("admin collection");
//                             }
//                         }
//                         else if (user.email == "anelemabuza@externalexaminer.co.za") {
//                             const stringEmail = user.email.substring(0, 11)
//                             console.log('The examiner', stringEmail)
//                             const ExaminerDoc = await getDoc(query(collection(db, 'Examiner')));
//                             if (!ExaminerDoc) {
//                                 setRole('Examiner');
//                                 setExaminerID(stringEmail);
//                                 console.log("examiner collection view");
//                             }
//                             else {
//                                 console.log('This is not running')
//                             }

//                         }
//                     }
//                     console.log("Role set to", role);

//                 }
//                 catch (error) {
//                     console.error("Error querying Firestore:", error);
//                     console.log('the role thou', role)
//                 }
//             } else {    
//                 setSupervisorID(null);
//                 setStudentID(null);
//                 setRole(null);
//                 setExaminerID(null);
//                 setAdminID(null);

//                 console.log("No user is logged in");

//             }

//         });
//         return () => unsubscribe();
//     }, []);

//     useEffect(() => {
//         const fetchDetails = async () => {
//             const studentdetsArray = [];
//             const supervisorsArray = [];
//             const adminArray = [];
//             const examinerArray = [];
//             const courseIdArray = [];
//             try {
//                 let q;
//                 if (role === 'Supervisor') {
//                     q = query(collection(db, 'Student'), where('SupervisorID', 'array-contains', Math.floor(SupervisorID)));
//                     try {
//                         const querySnapshot = await getDocs(q);
//                         querySnapshot.forEach((doc) => {
//                             const data = doc.data();
//                             studentdetsArray.push({
//                                 ProfilePicture: data.ProfilePicture,
//                                 StudentID: data.ID,
//                                 StudentName: data.Name,
//                                 StudentSurname: data.Surname,
//                                 lastInteraction: "Just now",
//                                 StudentType: data.StudentType
//                             });
//                             courseIdArray.push({
//                                 CourseID: data.StudentType
//                             });
//                         });
//                     } catch (error) {
//                         console.error("Error fetching students:", error);
//                     }

//                 } else if (role === 'Student' && StudentID) {
//                     try {
//                         const studentDocs = await getDocs(query(collection(db, 'Student'), where('ID', '==', Math.floor(StudentID))));
//                         if (!studentDocs.empty) {
//                             const studentData = studentDocs.docs[0].data();
//                             const supervisorIDs = studentData.SupervisorID;  // Retrieve SupervisorID array from student doc

//                             // Query supervisor collection based on SupervisorIDs
//                             const supervisorDocs = await getDocs(query(collection(db, 'Supervisor'), where('ID', 'in', supervisorIDs)));
//                             supervisorDocs.forEach((doc) => {
//                                 const data = doc.data();
//                                 supervisorsArray.push({
//                                     SupervisorID: data.ID,
//                                     SupervisorName: data.Name,
//                                     SupervisorSurname: data.Surname,
//                                     ProfilePicture: data.ProfilePicture,
//                                     Title: data.Title
//                                 });
//                             });
//                         }
//                     } catch (error) {
//                         console.error("Error fetching supervisors:", error);
//                     }
//                 } else if (role === 'Admin') {
//                     try {
//                         const stringEmail = user.email.substring(0, 11)
//                         const ExaminerDoc = await getDoc(query(collection(db, 'Examiner'), where('ExaminerID', '==', stringEmail)));
//                         ExaminerDoc.forEach((doc) => {
//                             const data = doc.data();
//                             examinerArray.push({
//                                 ExaminerID: data.ExaminerID,
//                                 Title: data.Title,
//                                 ExaninerName: data.ExaninerName,
//                                 ExaminerSurname: data.ExaminerSurname

//                             })
//                         })
//                     } catch (error) {

//                     }
//                 } else if (role === 'Examiner') {
//                     try {
//                         const adminDoc = await getDoc(query(collection(db, 'Admin'), where('adminId', '==', Math.floor(userId))));
//                         adminDoc.forEach((doc) => {
//                             const data = doc.data();
//                             adminArray.push({
//                                 adminID: data.adminID,
//                                 Department: data.Department
//                             })
//                         })
//                     } catch (error) {

//                     }
//                 }


//                 setStudentDetails(studentdetsArray);
//                 setSupervisorDetails(supervisorsArray);
//                 setCourseOptions(courseIdArray);
//                 setExaminerDetails(examinerArray)
//             } catch (error) {
//                 console.error("Error fetching details:", error);
//             }
//         };

//         fetchDetails();
//     }, [StudentID, SupervisorID, ExaminerID, AdminID, role, filterCourseID]);

//     // Function to create or get the chat document
//     const createOrGetChat = async (user1, user2) => {
//         // Create a consistent chat ID by ordering user IDs
//         const chatId = user1 < user2 ? `${user1}_${user2}` : `${user2}_${user1}`;
//         const chatRef = doc(db, 'chats', chatId);

//         const chatDoc = await getDoc(chatRef);
//         if (!chatDoc.exists()) {
//             // Create a new chat document
//             await setDoc(chatRef, {
//                 users: [user1, user2],
//                 createdAt: serverTimestamp(),
//             });
//             console.log("New chat document created with ID:", chatId);
//         } else {
//             console.log("Chat document already exists with ID:", chatId);
//         }

//         return chatId;
//     };

//     const handleLecturerClick = async (lecturer) => {
//         setSelectedLecturer(lecturer);

//         const currentUserId = role === 'Supervisor' ? SupervisorID : StudentID;


//         // Create or get chat between the current user and the selected lecturer
//         const newchatId = await createOrGetChat(currentUserId, lecturer.SupervisorID);

//         // You can now use this chatId to load or send messages
//         setChatId(newchatId);
//         setIsModalOpen(true);
//     };

//     const handleStudentClick = async (student) => {
//         setSelectedStudent(student);
//         const currentUserId = role === 'Supervisor' ? SupervisorID : StudentID;

//         // Create or get chat between the current user and the selected student
//         const newChatId = await createOrGetChat(currentUserId, student.StudentID);

//         setChatId(newChatId);
//         // You can now use this chatId to load or send messages
//         setIsModalOpen(true);
//     };
//     const handleAdminClick = async (admin) => {
//         setAdminDetails(admin);
//         const currentUserId = role === 'Admin' ? AdminID : ExaminerID;
//         const newchatId = await createOrGetChat(currentUserId, admin.AdminID);
//         setChatId(newchatId)
//         setIsModalOpen(true);
//     }

//     const handleExaminerClick = async (examiner) => {
//         setAdminDetails(examiner);
//         const currentUserId = role === 'Examiner' ? ExaminerID : AdminID;
//         const newchatId = await createOrGetChat(currentUserId, examiner.ExaminerID);
//         setChatId(newchatId)
//         setIsModalOpen(true);
//     }
//     const closeModal = () => {
//         setIsModalOpen(false);
//         setChatId(null); // Reset chatId when closing the modal
//     };

//     const handleFilterByStudentType = (studentType) => {
//         setSelectedStudentType(studentType); // Set the selected student type

//     };

//     const filteredStudents = studentDetails.filter(student => {
//         if (!selectedStudentType) return true;
//         return student.StudentType == selectedStudentType;
//     })

//     const borderColors = ['border-[#00ad43]', 'border-[#00bfff]', 'border-[#590098]', 'border-[#FF8503]'];

//     return (
//         <div className="p-4 sm:ml-6 sm:mr-6 lg:ml-72 lg:mr-72">
//             <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 dark:bg-gray-800">
//                 <section className="mb-6">
//                     <h1 className="text-3xl font-extrabold tracking-wider text-gray-800 dark:text-gray-200">
//                         {role === 'Student' ? 'Your Inbox' : role === 'Supervisor' ? 'Supervisor Inbox' : role === 'Examiner' ? 'Examiner Inbox' : role==='Admin' ? 'Admin Inbox':null}
//                     </h1>
//                     <p className="text-lg text-gray-600 dark:text-gray-300 mt-6">
//                         {role === 'Student' ? 'Here is your messages from supervisors' : role === 'Supervisor' ? 'Here is your messages from Students' : role === 'Examiner' ? 'Here is your messages from admins' : 'Here is your messages from examiners'}
//                     </p>
//                 </section>
//                 {/* Display lecturers */}
//                 {role === 'Student' ? (
//                     <div className="flex flex-wrap gap-2 max-w-full">
//                         {supervisorDetails &&
//                             supervisorDetails.map((lecturer, index) => (
//                                 <motion.div
//                                     key={lecturer.SupervisorID}
//                                     className={`flex items-center p-4 mb-4 bg-white dark:bg-gray-900 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 w-full rounded-lg shadow-md ${borderColors[index % borderColors.length]} border-2`}
//                                     onClick={() => handleLecturerClick(lecturer)}
//                                     initial={{ opacity: 0 }}
//                                     animate={{ opacity: 1 }}
//                                     transition={{ duration: 0.5 }}
//                                     whileHover={{ scale: 1.05 }}
//                                 >
//                                     <img
//                                         src={lecturer.ProfilePicture}
//                                         alt={lecturer.SupervisorName}
//                                         className="w-12 h-12 mr-4 rounded-full"
//                                     />
//                                     <div className="flex flex-row flex-1 justify-items-center justify-between">
//                                         <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
//                                             {lecturer.Title} {lecturer.SupervisorName} {lecturer.SupervisorSurname}
//                                         </h2>
//                                         <p className="text-gray-600 dark:text-gray-400">
//                                             Office Hours: 24hr
//                                         </p>
//                                         <p className="text-gray-600 dark:text-gray-400">
//                                             Supervisor ID: {lecturer.SupervisorID}
//                                         </p>
//                                     </div>
//                                 </motion.div>
//                             ))}
//                     </div>
//                 ) : role === 'Supervisor' ? (
//                     <div className="flex flex-wrap gap-2 max-w-full">
//                         <DropdownButton id="dropdown-basic-button" title="Student Courses" style={{ backgroundColor: 'orange', borderColor: 'orange' }}>
//                             <Dropdown.Item onClick={() => handleFilterByStudentType('Honours')}>Honours</Dropdown.Item>
//                             <Dropdown.Item onClick={() => handleFilterByStudentType('Masters')}>Masters</Dropdown.Item>
//                             <Dropdown.Item onClick={() => handleFilterByStudentType('PhD')}>PhD</Dropdown.Item>
//                         </DropdownButton>

//                         {/* </div> */}
//                         {filteredStudents.map((student, index) => (
//                             <motion.div
//                                 key={student.StudentID}
//                                 className={`flex items-center p-4 mb-4 bg-white dark:bg-gray-900 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 w-full rounded-lg shadow-md ${borderColors[index % borderColors.length]} border-2`}
//                                 onClick={() => handleStudentClick(student)}
//                                 initial={{ opacity: 0 }}
//                                 animate={{ opacity: 1 }}
//                                 transition={{ duration: 0.5 }}
//                                 whileHover={{ scale: 1.05 }}
//                             >
//                                 <img
//                                     src={student.ProfilePicture}
//                                     alt={student.StudentName}
//                                     className="w-12 h-12 mr-4 rounded-full"
//                                 />
//                                 <div className="flex flex-row flex-1 justify-items-center justify-between">
//                                     <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
//                                         {student.StudentName} {student.StudentSurname}
//                                     </h2>
//                                     <p className="text-gray-600 dark:text-gray-400">
//                                         Student Type: {student.StudentType}
//                                     </p>
//                                     <p className="text-gray-600 dark:text-gray-400">
//                                         Stu No.: {student.StudentID}
//                                     </p>
//                                 </div>
//                             </motion.div>
//                         ))}
//                     </div>
//                 ) : role === 'Examiner' ? (
//                     <div className="flex flex-wrap gap-2 max-w-full">
//                         {adminDetails &&
//                             adminDetails.map((admin, index) => (
//                                 <motion.div
//                                     key={lecturer.SupervisorID}
//                                     className={`flex items-center p-4 mb-4 bg-white dark:bg-gray-900 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 w-full rounded-lg shadow-md ${borderColors[index % borderColors.length]} border-2`}
//                                     onClick={() => handleLecturerClick(lecturer)}
//                                     initial={{ opacity: 0 }}
//                                     animate={{ opacity: 1 }}
//                                     transition={{ duration: 0.5 }}
//                                     whileHover={{ scale: 1.05 }}
//                                 >
//                                     <img
//                                         src={admin.ProfilePicture}
//                                         alt={admin.adminID}
//                                         className="w-12 h-12 mr-4 rounded-full"
//                                     />
//                                     <div className="flex flex-row flex-1 justify-items-center justify-between">
//                                         <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
//                                             Department: {admin.Department}
//                                         </h2>
//                                         <p className="text-gray-600 dark:text-gray-400">
//                                             Office Hours: 24hr
//                                         </p>
//                                         <p className="text-gray-600 dark:text-gray-400">
//                                             AdminID: {admin.adminID}
//                                         </p>
//                                     </div>
//                                 </motion.div>
//                             ))}
//                     </div>
//                 ) : role === 'Admin' ? (
//                     <div className="flex flex-wrap gap-2 max-w-full">
//                         {examinerDetails &&
//                             examinerDetails.map((examiner, index) => (
//                                 <motion.div
//                                     key={lecturer.SupervisorID}
//                                     className={`flex items-center p-4 mb-4 bg-white dark:bg-gray-900 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 w-full rounded-lg shadow-md ${borderColors[index % borderColors.length]} border-2`}
//                                     onClick={() => handleLecturerClick(lecturer)}
//                                     initial={{ opacity: 0 }}
//                                     animate={{ opacity: 1 }}
//                                     transition={{ duration: 0.5 }}
//                                     whileHover={{ scale: 1.05 }}
//                                 >
//                                     <img
//                                         src={examiner.ProfilePicture}
//                                         alt={examiner.adminID}
//                                         className="w-12 h-12 mr-4 rounded-full"
//                                     />
//                                     <div className="flex flex-row flex-1 justify-items-center justify-between">
//                                         <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
//                                             Title : {examiner.Title}        Name: {examiner.ExaninerName}   Surname : {examiner.ExaminerSurname}
//                                         </h2>
//                                         <p className="text-gray-600 dark:text-gray-400">
//                                             Office Hours: 24hr
//                                         </p>
//                                         <p className="text-gray-600 dark:text-gray-400">
//                                             ExaminerID: {examiner.ExaminerID}
//                                         </p>
//                                     </div>
//                                 </motion.div>
//                             ))}
//                     </div>
//                 ) : null}
//                 <Footer />
//             </div>

//             {/* Modal */}
//             {/* <Modal isOpen={isModalOpen} onClose={closeModal} lecturer={selectedLecturer} student={selectedStudent} /> */}
//             <Modal
//                 isOpen={isModalOpen}
//                 onClose={closeModal}
//                 data={role === 'Student' ? selectedLecturer : selectedStudent}
//                 role={role}
//                 chatId={chatId}
//             />
//         </div>
//     );
// };

