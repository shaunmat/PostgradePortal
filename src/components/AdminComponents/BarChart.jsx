import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import {db} from '../../backend/config'
//import { db } from '../../backend/config'; // Firebase setup
import { collection, getDocs } from "firebase/firestore"; 

export const BarChart = () => {
    const [studentCounts, setStudentCounts] = useState(new Array(12).fill(0)); // Total students per month
    const [studentCountsHonours,setStudentCountsHonours]=useState(new Array(12).fill(0));
    const [studentCountsMasters,setStudentCountsMasters]=useState(new Array(12).fill(0));
    const [studentCountsPhD,setStudentCountsPhD]=useState(new Array(12).fill(0));
    const [supervisorCounts, setSupervisorCounts] = useState(new Array(12).fill(0)); // Total supervisors per month
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Initialize student and supervisor counts for each month (12 months)
                let studentMonthlyCounts = new Array(12).fill(0);
                let studentMonthlyCountsHonours=new Array(12).fill(0);
                let studentMonthlyCountsMasters=new Array(12).fill(0);
                let studentMonthlyPhd=new Array(12).fill(0);
                let supervisorMonthlyCounts = new Array(12).fill(0);
                const supervisorSet = new Array(12).fill().map(() => new Set()); // To track unique supervisors per month
                // Fetch all students and count them by StartDate and EndDate
                const studentsSnapshot = await getDocs(collection(db, "Student"));
                studentsSnapshot.forEach(doc => {
                    const student = doc.data();
                    console.log(student)

                        if(student.StartDate&&student.StartDate.seconds){
                            const startDate = new Date(student.StartDate.seconds*1000);
                            const endDate = student.EndDate ? new Date(student.EndDate.seconds*1000) : new Date(); // If no EndDate, assume active till now
                            // Iterate over all months of 2024
                            for (let i = 0; i < 12; i++) {
                                const monthStart = new Date(2024, i, 1);
                                const monthEnd = new Date(2024, i + 1, 0); // Last day of the month
        
                                // Check if student is active in this month
                                if (startDate <= monthEnd && endDate >= monthStart) {
                                    studentMonthlyCounts[i] += 1; // Increment student count for this month
                                    if(student.StudentType=="Honours"){
                                        studentMonthlyCountsHonours[i] +=1;
                                    }
                                    else if(student.StudentType=="Masters"){
                                        studentMonthlyCountsMasters[i]+=1;
                                    }
                                    else if(student.StudentType=="PhD"){
                                        studentMonthlyPhd[i]+=1;
                                    }
                                    // Track supervisors for this month
                                    student.SupervisorID.forEach(supervisorID => {
                                        supervisorSet[i].add(supervisorID); // Add supervisor ID to the set for unique tracking
                                    });
                                    // Check if Student for that degree is active in this month
                                }
                             
                            }
                        }
                        else{
                            console.log("Missing or invalid StartDate for student:",student)
                        }
                    


                });

                // Convert supervisor sets into counts
                for (let i = 0; i < 12; i++) {
                    supervisorMonthlyCounts[i] = supervisorSet[i].size;
                }

                // Set the final counts in state
                setStudentCountsHonours(studentMonthlyCountsHonours)
                setStudentCountsMasters( studentMonthlyCountsMasters)
                setStudentCountsPhD(studentMonthlyPhd)
                //setStudentCounts(studentMonthlyCounts);
                setSupervisorCounts(supervisorMonthlyCounts);
            } catch (error) {
                console.error('Error fetching data from Firebase:', error);
            }
        };

        fetchData();
    }, []);

    const options = {
        chart: {
            id: "basic-bar",
            toolbar: {
                show: false,
            },
        },
        xaxis: {
            categories: months, // Use months as x-axis
            labels: {
                style: {
                    fontWeight: 'bold',
                },
            },
        },
        yaxis: {
            labels: {
                style: {
                    fontWeight: 'bold',
                },
            },
        },
        dataLabels: {
            enabled: false,
        },
        grid: {
            show: true,
        },
        colors: ["#FF8503", "#00E396","#5C1082","#F60002"] // Different colors for students and supervisors
    };

    const series = [
        {
            name: "Supervisors",
            data: supervisorCounts, // Fetched supervisor counts by month
        },
        {
            name: "Honours",
            data: studentCountsHonours, // Fetched student counts by month
        },
        {
            name:"Master",
            data:studentCountsMasters,
        },
        {
            name:"PhD",
            data:studentCountsPhD,
        }
    ];

    return (
        <div className="bg-white dark:bg-gray-1000 p-6 rounded-lg">
            {studentCounts.some(count => count > 0) || supervisorCounts.some(count => count > 0) ? (
            <Chart options={options} series={series} type="bar" height="400" width={800} />
        ) : (
            <p>Loading data...</p>
        )}
        </div>
    );
};
