useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (user) {
            const userId = user.email.substring(0, 9);  // Assuming this is how you identify users
            console.log("Here is the userId:", userId);

            try {
                // Supervisor Query
                const supervisorQuery = query(collection(db, 'Supervisor'), where('ID', '==', userId));
                const supervisorSnapshot = await getDocs(supervisorQuery);
                console.log("Supervisor query executed, document snapshot:", supervisorSnapshot);

                if (!supervisorSnapshot.empty) {
                    setRole('Supervisor');
                    setSupervisorID(userId);
                    console.log("Supervisor found and role set.");
                } else {
                    // Student Query
                    const studentQuery = query(collection(db, 'Student'), where('ID', '==', userId));
                    const studentSnapshot = await getDocs(studentQuery);
                    console.log("Student query executed, document snapshot:", studentSnapshot);

                    if (!studentSnapshot.empty) {
                        setRole('Student');
                        setStudentID(userId);
                        console.log("Student found and role set.");
                    } else if (userId === '220143805') {
                        // Admin Query
                        const adminQuery = query(collection(db, 'Admin'), where('adminId', '==', userId));
                        const adminSnapshot = await getDocs(adminQuery);
                        console.log("Admin query executed, document snapshot:", adminSnapshot);

                        if (!adminSnapshot.empty) {
                            setRole('Admin');
                            setAdminDetails(userId);
                            console.log("Admin found and role set.");
                        }
                    } else if (user.email === "anelemabuza@externalexaminer.co.za") {
                        // Examiner Query
                        const examinerQuery = query(collection(db, 'Examiner'), where('ExaminerID', '==', user.email));
                        const examinerSnapshot = await getDocs(examinerQuery);
                        console.log("Examiner query executed, document snapshot:", examinerSnapshot);

                        if (!examinerSnapshot.empty) {
                            setRole('Examiner');
                            setExaminerID(user.email);
                            console.log("Examiner found and role set.");
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
