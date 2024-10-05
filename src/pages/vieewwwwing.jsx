
const fetchRoleDetails = async (userId) => {
    try {
        // Supervisor Query
        const supervisorQuery = query(collection(db, 'Supervisor'), where('ID', '==', Math.floor(userId)));
        const supervisorSnapshot = await getDocs(supervisorQuery);

        if (!supervisorSnapshot.empty) {
            return { role: 'Supervisor', id: userId };
        }

        // Student Query
        const studentQuery = query(collection(db, 'Student'), where('ID', '==', Math.floor(userId)));
        const studentSnapshot = await getDocs(studentQuery);

        if (!studentSnapshot.empty) {
            return { role: 'Student', id: userId };
        }

        // Admin Query
        if (userId === '220143805') {
            const adminQuery = query(collection(db, 'Admin'), where('AdminID', '==', Math.floor(userId)));
            const adminSnapshot = await getDocs(adminQuery);
            if (!adminSnapshot.empty) {
                return { role: 'Admin', id: userId };
            }
        }

        // Examiner Query
        if (user.email === "anelemabuza@externalexaminer.co.za") {
            const examinerId = user.email.substring(0, 11);
            const examinerQuery = query(collection(db, 'Examiner'), where('ExaminerID', '==', examinerId));
            const examinerSnapshot = await getDocs(examinerQuery);
            if (!examinerSnapshot.empty) {
                return { role: 'Examiner', id: examinerId };
            }
        }
    } catch (error) {
        console.error("Error querying Firestore:", error);
    }
    return null;
};

useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (user) {
            const userId = user.email.substring(0, 9);
            const userRoleDetails = await fetchRoleDetails(userId);
            if (userRoleDetails) {
                setRole(userRoleDetails.role);
                if (userRoleDetails.role === 'Supervisor') setSupervisorID(userId);
                if (userRoleDetails.role === 'Student') setStudentID(userId);
                if (userRoleDetails.role === 'Admin') setAdminID(userId);
                if (userRoleDetails.role === 'Examiner') setExaminerID(userId);
            }
        } else {
            // Clear state
            setSupervisorID(null);
            setStudentID(null);
            setRole(null);
            setExaminerID(null);
            setAdminID(null);
        }
    });

    return () => unsubscribe();
}, []);


