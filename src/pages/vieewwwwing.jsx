Please this code according to what you said above
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                const userId = user.email.substring(0, 9);  // Assuming this is how you identify users
                console.log("Here is the userId:", userId);
    
                try {
                    // Supervisor Query
                    const supervisorQuery = query(collection(db, 'Supervisor'), where('ID', '==', Math.floor(userId)));
                    const supervisorSnapshot = await getDocs(supervisorQuery);
                    console.log("Supervisor query executed, document snapshot:", supervisorSnapshot);
    
                    if (!supervisorSnapshot.empty) {
                        setRole('Supervisor');
                        setSupervisorID(userId);
                        console.log("Supervisor found and role set.");
                    } else {
                        // Student Query
                        const studentQuery = query(collection(db, 'Student'), where('ID', '==', Math.floor(userId)));
                        const studentSnapshot = await getDocs(studentQuery);
                        console.log("Student query executed, document snapshot:", studentSnapshot);
    
                        if (!studentSnapshot.empty) {
                            setRole('Student');
                            setStudentID(userId);
                            console.log("Student found and role set.");
                        } else if (userId === '220143805') {
                            // Admin Query
                            console.log('Its true',userId)
                            const adminQuery = query(collection(db, 'Admin'), where('AdminID', '==', Math.floor(userId)));
                            const adminSnapshot = await getDocs(adminQuery);
                            console.log("Admin query executed, document snapshot:", adminSnapshot);
    
                            if (!adminSnapshot.empty) {
                                setRole('Admin');
                                setAdminDetails(userId);
                                setAdminID(userId);
                                console.log('adminSnapshot not empty',role,'user id',userId)
                                console.log("Admin found and role set.",role);
                            }
                        } else if (user.email === "anelemabuza@externalexaminer.co.za") {
                            // Examiner Query
                            const examinerId=user.email.substring(0,11);
                            console.log(examinerId,'here is the examier id substring')
                            const examinerQuery = query(collection(db, 'Examiner'), where('ExaminerID', '==', examinerId));
                            const examinerSnapshot = await getDocs(examinerQuery);
                            console.log("Examiner query executed, document snapshot:", examinerSnapshot);
    
                            if (!examinerSnapshot.empty) {
                                setRole('Examiner');
                                setExaminerID(examinerId);
                                console.log("Examiner found and role set.",examinerId);
                            } else {
                                console.log('No Examiner found');
                            }
                        }
                    }
                    console.log("Role set to:", role);
    
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
    
    useEffect(() => {
        console.log('Updated Examiner Details:', examinerDetails);
    }, [examinerDetails]);
    useEffect(() => {
        console.log('Updated admin  Details:', adminDetails);
    }, [adminDetails]);1

    useEffect(() => {
        const fetchDetails = async () => {
            const studentdetsArray = [];
            const supervisorsArray = [];
            const adminArray = [];
            const examinerArray = [];
            const courseIdArray = [];
            
            try {
                if (role === 'Supervisor') {
                    // Fetch students supervised by the supervisor
                    const q = query(collection(db, 'Student'), where('SupervisorID', 'array-contains', Math.floor(SupervisorID)));
                    const querySnapshot = await getDocs(q);
                    querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        studentdetsArray.push({
                            ProfilePicture: data.ProfilePicture,
                            StudentID: data.ID,
                            StudentName: data.Name,
                            StudentSurname: data.Surname,
                            lastInteraction: "Just now",
                            StudentType: data.StudentType
                        });
                        courseIdArray.push({ CourseID: data.StudentType });
                    });
                } else if (role === 'Student' && StudentID) {
                    // Fetch supervisors for the student
                    const studentDocs = await getDocs(query(collection(db, 'Student'), where('ID', '==', Math.floor(StudentID))));
                    if (!studentDocs.empty) {
                        const studentData = studentDocs.docs[0].data();
                        const supervisorIDs = studentData.SupervisorID;
                        const supervisorDocs = await getDocs(query(collection(db, 'Supervisor'), where('ID', 'in', supervisorIDs)));
                        supervisorDocs.forEach((doc) => {
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
                    // Fetch examiners for the admin
                    console.log('this the admin id under the role checking', role,'admin:',AdminID);
                    const examinerQuery = query(collection(db, 'Examiner'), where('AdminID', '==', Math.floor(AdminID)));
                    const examinerSnapshot = await getDocs(examinerQuery);
                    console.log('this is examinerSnapshot', examinerSnapshot);
                    console.log('here is the admin id after examinerShot', AdminID);
                    examinerSnapshot.forEach((doc) => {
                        const data = doc.data();
                        examinerArray.push({
                            ExaminerID: data.ExaminerID,
                            Title: data.Title,
                            ExaminerName: data.ExaminerName,
                            ExaminerSurname: data.ExaminerSurname
                        });
                    });
                    setExaminerDetails(examinerArray);
                    console.log('examinersArray',examinerDetails)

                } else if (role === 'Examiner' && ExaminerID) {
                // Fetch admin details for the examiner
                    const examinerDocs = await getDocs(query(collection(db, 'Examiner'), where('ExaminerID', '==', ExaminerID)));
                if (!examinerDocs.empty) {
                    const examinerData = examinerDocs.docs[0].data();
                    const adminID = examinerData.AdminID;  // Ensure AdminID is fetched
                    const adminQuery = query(collection(db, 'Admin'), where('AdminID', '==', adminID));
                    const adminSnapshot = await getDocs(adminQuery);
                    adminSnapshot.forEach((doc) => {
                        const data = doc.data();
                        adminArray.push({
                            AdminID: data.AdminID,
                            Department: data.Department,
                            ProfilePicture: data.ProfilePicture || 'default-profile.jpg'
                        });
                    });
                    setAdminDetails(adminArray);  // Ensure admin details are set correctly
                    console.log('Admin details set:', adminArray);  // Logging to check data
                } else {
                    console.log('No admin found for this examiner.');
                }
                }
                // Update the state with fetched details
                setStudentDetails(studentdetsArray);
                setSupervisorDetails(supervisorsArray);
                setCourseOptions(courseIdArray);
                setExaminerDetails(examinerArray);
                setAdminDetails(adminArray);       // Set admin details
            } catch (error) {
                console.error("Error fetching details:", error);
            }
        };
        fetchDetails();
    }, [StudentID, SupervisorID, ExaminerID, AdminID, role, filterCourseID]);
    const createOrGetChat = async (user1, user2) => {
        // Create a consistent chat ID by ordering user IDs
        const chatId = user1 < user2 ? `${user1}_${user2}` : `${user2}_${user1}`;
        const chatRef = doc(db, 'chats', chatId);

        const chatDoc = await getDoc(chatRef);
        if (!chatDoc.exists()) {
            // Create a new chat document
            await setDoc(chatRef, {
                users: [user1, user2],
                createdAt: serverTimestamp(),
            });
            console.log("New chat document created with ID:", chatId);
        } else {
            console.log("Chat document already exists with ID:", chatId);
        }

        return chatId;
    };

    const handleLecturerClick = async (lecturer) => {
        setSelectedLecturer(lecturer);

        const currentUserId = role === 'Supervisor' ? SupervisorID : StudentID;


        // Create or get chat between the current user and the selected lecturer
        const newchatId = await createOrGetChat(currentUserId, lecturer.SupervisorID);

        // You can now use this chatId to load or send messages
        setChatId(newchatId);
        setIsModalOpen(true);
    };

    const handleStudentClick = async (student) => {
        setSelectedStudent(student);
        const currentUserId = role === 'Supervisor' ? SupervisorID : StudentID;

        // Create or get chat between the current user and the selected student
        const newChatId = await createOrGetChat(currentUserId, student.StudentID);

        setChatId(newChatId);
        // You can now use this chatId to load or send messages
        setIsModalOpen(true);
    };
    const handleAdminClick = async (admin) => {
        setAdminDetails(admin);
        const currentUserId = role === 'Admin' ? AdminID : ExaminerID;
        const newchatId = await createOrGetChat(currentUserId, admin.AdminID);
        setChatId(newchatId)
        setIsModalOpen(true);
    }

    const handleExaminerClick = async (examiner) => {
        setAdminDetails(examiner);
        const currentUserId = role === 'Examiner' ? ExaminerID : AdminID;
        const newchatId = await createOrGetChat(currentUserId, examiner.ExaminerID);
        setChatId(newchatId)
        setIsModalOpen(true);
    }
    const closeModal = () => {
        setIsModalOpen(false);
        setChatId(null); // Reset chatId when closing the modal
    };

    const handleFilterByStudentType = (studentType) => {
        setSelectedStudentType(studentType); // Set the selected student type

    };

    const filteredStudents = studentDetails.filter(student => {
        if (!selectedStudentType) return true;
        return student.StudentType == selectedStudentType;
    })

    const borderColors = ['border-[#00ad43]', 'border-[#00bfff]', 'border-[#590098]', 'border-[#FF8503]'];

    return (
        <div className="p-4 sm:ml-6 sm:mr-6 lg:ml-72 lg:mr-72">
            <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 dark:bg-gray-800">
                <section className="mb-6">
                    <h1 className="text-3xl font-extrabold tracking-wider text-gray-800 dark:text-gray-200">
                        {role === 'Student' ? 'Your Inbox' : 
                        role === 'Supervisor' ? 'Supervisor Inbox' : 
                        role === 'Examiner' ? 'Examiner Inbox' : 
                        role==='Admin' ? 'Admin Inbox':null}
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mt-6">
                        {role === 'Student' ? 'Here is your messages from supervisors' :
                         role === 'Supervisor' ? 'Here is your messages from Students' : 
                         role === 'Examiner' ? 'Here is your messages from admins' :
                          role ==='Admin'? 'Here is your messages from examiners':'Cant read'}
                    </p>
                </section>
                {/* Display lecturers */}
                {role === 'Student' ? (
                    <div className="flex flex-wrap gap-2 max-w-full">
                        {supervisorDetails &&
                            supervisorDetails.map((lecturer, index) => (
                                <motion.div
                                    key={lecturer.SupervisorID}
                                    className={`flex items-center p-4 mb-4 bg-white dark:bg-gray-900 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 w-full rounded-lg shadow-md ${borderColors[index % borderColors.length]} border-2`}
                                    onClick={() => handleLecturerClick(lecturer)}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <img
                                        src={lecturer.ProfilePicture}
                                        alt={lecturer.SupervisorName}
                                        className="w-12 h-12 mr-4 rounded-full"
                                    />
                                    <div className="flex flex-row flex-1 justify-items-center justify-between">
                                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                                            {lecturer.Title} {lecturer.SupervisorName} {lecturer.SupervisorSurname}
                                        </h2>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Office Hours: 24hr
                                        </p>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Supervisor ID: {lecturer.SupervisorID}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                    </div>
                ) : role === 'Supervisor' ? (
                    <div className="flex flex-wrap gap-2 max-w-full">
                        <DropdownButton id="dropdown-basic-button" title="Student Courses" style={{ backgroundColor: 'orange', borderColor: 'orange' }}>
                            <Dropdown.Item onClick={() => handleFilterByStudentType('Honours')}>Honours</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleFilterByStudentType('Masters')}>Masters</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleFilterByStudentType('PhD')}>PhD</Dropdown.Item>
                        </DropdownButton>

                        {/* </div> */}
                        {filteredStudents.map((student, index) => (
                            <motion.div
                                key={student.StudentID}
                                className={`flex items-center p-4 mb-4 bg-white dark:bg-gray-900 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 w-full rounded-lg shadow-md ${borderColors[index % borderColors.length]} border-2`}
                                onClick={() => handleStudentClick(student)}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                whileHover={{ scale: 1.05 }}
                            >
                                <img
                                    src={student.ProfilePicture}
                                    alt={student.StudentName}
                                    className="w-12 h-12 mr-4 rounded-full"
                                />
                                <div className="flex flex-row flex-1 justify-items-center justify-between">
                                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                                        {student.StudentName} {student.StudentSurname}
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Student Type: {student.StudentType}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Stu No.: {student.StudentID}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : role === 'Examiner'  && adminDetails?.length > 0 ? (
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
                ) : role === 'Admin' && examinerDetails ?.length > 0 ? (
                    <div className="flex flex-wrap gap-2 max-w-full">
                        {examinerDetails.map((examiner, index) => (
                                <motion.div
                                    key={examiner.ExaminerID}
                                    className={`flex items-center p-4 mb-4 bg-white dark:bg-gray-900 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 w-full rounded-lg shadow-md ${borderColors[index % borderColors.length]} border-2`}
                                    onClick={() => handleExaminerClick(examiner)}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <img
                                        src={examiner.ProfilePicture}
                                        alt={examiner.ExaminerID}
                                        className="w-12 h-12 mr-4 rounded-full"
                                    />
                                    <div className="flex flex-row flex-1 justify-items-center justify-between">
                                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                                            {examiner.Title}  {examiner.ExaminerName} {examiner.ExaminerSurname}
                                        </h2>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Office Hours: 24hr
                                        </p>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            ExaminerID: {examiner.ExaminerID}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                    </div>
                ) : null}
                <Footer />
            </div>
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                data={
                    role === 'Student' ? selectedLecturer : 
                    role=== 'Supervisor ' ? selectedStudent :
                    role==='Admin'?  selectedExaminer: 
                    role==='Examiner'? selectedAdmin: null}
                role={role}
                chatId={chatId}
            />
        </div>
    );
};