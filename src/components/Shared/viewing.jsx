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
            } else if (role === 'Admin') {
                // Fetch examiners for the admin
                const examinerQuery = query(collection(db, 'Examiner'), where('AdminID', '==', AdminID));
                const examinerSnapshot = await getDocs(examinerQuery);
                examinerSnapshot.forEach((doc) => {
                    const data = doc.data();
                    examinerArray.push({
                        ExaminerID: data.ExaminerID,
                        Title: data.Title,
                        ExaninerName: data.ExaninerName,
                        ExaminerSurname: data.ExaminerSurname
                    });
                });
                setExaminerDetails(examinerArray);
            } else if (role === 'Examiner') {
                // Fetch admin details for the examiner
                if (ExaminerID) {
                    const examinerDocs = await getDocs(query(collection(db, 'Examiner'), where('ExaminerID', '==', ExaminerID)));
                    if (!examinerDocs.empty) {
                        const examinerData = examinerDocs.docs[0].data();
                        const adminID = examinerData.AdminID;
                        const adminQuery = query(collection(db, 'Admin'), where('AdminID', '==', adminID));
                        const adminSnapshot = await getDocs(adminQuery);
                        adminSnapshot.forEach(doc => {
                            const data = doc.data();
                            adminArray.push({
                                AdminID: data.AdminID,
                                Department: data.Department,
                                ProfilePicture: data.ProfilePicture || 'default-profile.jpg'
                            });
                        });
                        setAdminDetails(adminArray);
                    }
                }
            }
            // Update the state with fetched details
            setStudentDetails(studentdetsArray);
            setSupervisorDetails(supervisorsArray);
            setCourseOptions(courseIdArray);
            setExaminerDetails(examinerArray);
        } catch (error) {
            console.error("Error fetching details:", error);
        }
    };

    fetchDetails();
}, [StudentID, SupervisorID, ExaminerID, AdminID, role, filterCourseID]);
