import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ExaminerChat = ({ examinerDetails, adminDetails }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [chatId, setChatId] = useState(null);
    const [selectedAdmin, setSelectedAdmin] = useState(null);

    const handleAdminClick = (admin) => {
        setChatId(admin.AdminID); // Set chat ID based on selected admin
        setSelectedAdmin(admin);  // Store selected admin details
        setIsModalOpen(true);     // Open modal
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setChatId(null); // Only reset chatId when closing the modal
        // Do NOT reset adminDetails or selectedAdmin here
    };

    return (
        <div>
            {role === 'Examiner' && adminDetails?.length > 0 ? (
                <div className="flex flex-wrap gap-2 max-w-full">
                    {adminDetails.map((admin, index) => (
                        <motion.div
                            key={admin.AdminID}
                            className={`flex items-center p-4 mb-4 bg-white dark:bg-gray-900 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 w-full rounded-lg shadow-md ${borderColors[index % borderColors.length]} border-2`}
                            onClick={() => handleAdminClick(admin)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            whileHover={{ scale: 1.05 }}
                        >
                            <img
                                src={admin.ProfilePicture}
                                alt={admin.AdminID}
                                className="w-12 h-12 mr-4 rounded-full"
                            />
                            <div className="flex flex-row flex-1 justify-items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                                    {admin.Department}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Office Hours: 24hr
                                </p>
                                <p className="text-gray-600 dark:text-gray-400">
                                    AdminID: {admin.AdminID}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : null}

            {isModalOpen && selectedAdmin && (
                <div className="modal">
                    <div className="modal-content">
                        {/* Modal content displaying chat with selected admin */}
                        <h2>Chat with {selectedAdmin.Department}</h2>
                        {/* Your chat component here */}
                        <button onClick={closeModal}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExaminerChat;





















// useEffect(() => {
//     const fetchDetails = async () => {
//         const studentdetsArray = [];
//         const supervisorsArray = [];
//         const adminArray = [];
//         const examinerArray = [];
//         const courseIdArray = [];
        
//         try {
//             if (role === 'Supervisor') {
//                 // Fetch students supervised by the supervisor
//                 const q = query(collection(db, 'Student'), where('SupervisorID', 'array-contains', Math.floor(SupervisorID)));
//                 const querySnapshot = await getDocs(q);
//                 querySnapshot.forEach((doc) => {
//                     const data = doc.data();
//                     studentdetsArray.push({
//                         ProfilePicture: data.ProfilePicture,
//                         StudentID: data.ID,
//                         StudentName: data.Name,
//                         StudentSurname: data.Surname,
//                         lastInteraction: "Just now",
//                         StudentType: data.StudentType
//                     });
//                     courseIdArray.push({ CourseID: data.StudentType });
//                 });
//             } else if (role === 'Student' && StudentID) {
//                 // Fetch supervisors for the student
//                 const studentDocs = await getDocs(query(collection(db, 'Student'), where('ID', '==', Math.floor(StudentID))));
//                 if (!studentDocs.empty) {
//                     const studentData = studentDocs.docs[0].data();
//                     const supervisorIDs = studentData.SupervisorID;
//                     const supervisorDocs = await getDocs(query(collection(db, 'Supervisor'), where('ID', 'in', supervisorIDs)));
//                     supervisorDocs.forEach((doc) => {
//                         const data = doc.data();
//                         supervisorsArray.push({
//                             SupervisorID: data.ID,
//                             SupervisorName: data.Name,
//                             SupervisorSurname: data.Surname,
//                             ProfilePicture: data.ProfilePicture,
//                             Title: data.Title
//                         });
//                     });
//                 }
//             } else if (role === 'Admin') {
//                 // Fetch examiners for the admin
//                 const examinerQuery = query(collection(db, 'Examiner'), where('AdminID', '==', AdminID));
//                 const examinerSnapshot = await getDocs(examinerQuery);
//                 examinerSnapshot.forEach((doc) => {
//                     const data = doc.data();
//                     examinerArray.push({
//                         ExaminerID: data.ExaminerID,
//                         Title: data.Title,
//                         ExaninerName: data.ExaninerName,
//                         ExaminerSurname: data.ExaminerSurname
//                     });
//                 });
//                 setExaminerDetails(examinerArray);
//             } else if (role === 'Examiner') {
//                 // Fetch admin details for the examiner
//                 if (ExaminerID) {
//                     const examinerDocs = await getDocs(query(collection(db, 'Examiner'), where('ExaminerID', '==', ExaminerID)));
//                     if (!examinerDocs.empty) {
//                         const examinerData = examinerDocs.docs[0].data();
//                         const adminID = examinerData.AdminID;
//                         const adminQuery = query(collection(db, 'Admin'), where('AdminID', '==', adminID));
//                         const adminSnapshot = await getDocs(adminQuery);
//                         adminSnapshot.forEach(doc => {
//                             const data = doc.data();
//                             adminArray.push({
//                                 AdminID: data.AdminID,
//                                 Department: data.Department,
//                                 ProfilePicture: data.ProfilePicture || 'default-profile.jpg'
//                             });
//                         });
//                         setAdminDetails(adminArray);
//                     }
//                 }
//             }
//             // Update the state with fetched details
//             setStudentDetails(studentdetsArray);
//             setSupervisorDetails(supervisorsArray);
//             setCourseOptions(courseIdArray);
//             setExaminerDetails(examinerArray);
//         } catch (error) {
//             console.error("Error fetching details:", error);
//         }
//     };

//     fetchDetails();
// }, [StudentID, SupervisorID, ExaminerID, AdminID, role, filterCourseID]);
