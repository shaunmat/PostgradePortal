useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (user) {
            const userId = user.email.substring(0, 9);
            const userDoc = await getDocs(query(collection(db, 'Supervisor'), where('SupervisorID', '==', Math.floor(userId))));
            
            let currentRole = null;
            if (!userDoc.empty) {
                currentRole = 'Supervisor';
            } else {
                const studentDoc = await getDocs(query(collection(db, 'Student'), where('StudentID', '==', userId)));
                if (!studentDoc.empty) {
                    currentRole = 'Student';
                }
            }
            setRole(currentRole);

            if (currentRole) {
                fetchEvents(userId, currentRole); // Fetch events after determining the role
            }
        } else {
            setSupervisorID(null);
            setRole(null);
            setEvents([]); // Clear events on logout
        }
    });
    return () => unsubscribe();
}, []);
