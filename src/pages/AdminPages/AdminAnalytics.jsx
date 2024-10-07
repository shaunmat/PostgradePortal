import { Footer } from "../../components/AdminComponents/Footer";
import Chart from "react-apexcharts";

export const AdminAnalytics = () => {
    return (
        <div className="p-4 sm:ml-6 sm:mr-6 lg:ml-72 lg:mr-72">
            <div className="p-4 min-h-screen border-2 border-gray-200 rounded-lg dark:border-gray-700 dark:bg-gray-800">
            <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white">Analytics</h1>
            <p className="text-gray-600 mt-2 dark:text-gray-300">
                View the analytics for students per supervisor
            </p>
            <div className="mt-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between"></div>
            </div>

            <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
                <div className="bg-white dark:bg-gray-1000 p-6 rounded-lg">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Student Activity Heatmap</h2>   
                    <HeatmapChart />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
                <div className="bg-white dark:bg-gray-1000 p-6 rounded-lg">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Student Milestone Timeline</h2>
                    <StudentMilestoneTimeline />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
                <div className="bg-white dark:bg-gray-1000 p-6 rounded-lg">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Student to Supervisor Ratio</h2>
                    <SupervisorStudentGauge />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
                <div className="bg-white dark:bg-gray-1000 p-6 rounded-lg">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Combined Chart</h2>
                    <CombinedChart />
                </div>
            </div>

            {/*  */}
        </div>
        </div>
    )
};



import React, { useState, useEffect } from "react";
// import Chart from "react-apexcharts";
import { db } from '../../backend/config';
import { collection, getDocs } from "firebase/firestore";

export const HeatmapChart = () => {
    const [activityCounts, setActivityCounts] = useState(new Array(12).fill(0));

    useEffect(() => {
        const fetchData = async () => {
            try {
                let monthlyCounts = new Array(12).fill(0);
                const assignmentsSnapshot = await getDocs(collection(db, "Assignments"));
                assignmentsSnapshot.forEach(doc => {
                    const assignment = doc.data();
                    if (assignment.date && assignment.date.seconds) {
                        const date = new Date(assignment.date.seconds * 1000);
                        monthlyCounts[date.getMonth()] += 1;
                    }
                });
                setActivityCounts(monthlyCounts);
            } catch (error) {
                console.error('Error fetching data from Firebase:', error);
            }
        };

        fetchData();
    }, []);

    const options = {
        chart: {
            id: "activity-heatmap",
            toolbar: {
                show: false,
            },
        },
        xaxis: {
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        },
        dataLabels: {
            enabled: false,
        },
        colors: ["#008FFB"],
    };

    const series = [
        {
            name: "Student Activity",
            data: activityCounts,
        },
    ];

    return (
        <div className="bg-white dark:bg-gray-1000 p-6 rounded-lg">
            <Chart options={options} series={series} type="heatmap" height="400" />
        </div>
    );
};

export const StudentMilestoneTimeline = () => {
    const [milestones, setMilestones] = useState([]);

    useEffect(() => {
        const fetchMilestones = async () => {
            try {
                const milestonesSnapshot = await getDocs(collection(db, "Milestones"));
                const milestoneData = [];

                milestonesSnapshot.forEach(doc => {
                    const milestone = doc.data();
                    milestoneData.push({
                        x: milestone.milestoneName,
                        y: [new Date(milestone.startDate.seconds * 1000), new Date(milestone.endDate.seconds * 1000)],
                        studentId: milestone.studentId,
                    });
                });

                setMilestones(milestoneData);
            } catch (error) {
                console.error('Error fetching milestones:', error);
            }
        };

        fetchMilestones();
    }, []);

    const options = {
        chart: {
            type: "rangeBar",
        },
        plotOptions: {
            bar: {
                horizontal: true,
            },
        },
        xaxis: {
            type: "datetime",
        },
        colors: ["#00E396"],
    };

    return (
        <div className="bg-white dark:bg-gray-1000 p-6 rounded-lg">
            <Chart options={options} series={[{ data: milestones }]} type="rangeBar" height="500" />
        </div>
    );
};


export const SupervisorStudentGauge = () => {
    const [supervisorCount, setSupervisorCount] = useState(0);
    const [studentCount, setStudentCount] = useState(0);

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const supervisorSnapshot = await getDocs(collection(db, "Supervisor"));
                const studentSnapshot = await getDocs(collection(db, "Student"));
                setSupervisorCount(supervisorSnapshot.size);
                setStudentCount(studentSnapshot.size);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchCounts();
    }, []);

    const ratio = studentCount / supervisorCount;
    const options = {
        chart: {
            type: "radialBar",
        },
        labels: ["Student to Supervisor Ratio"],
        colors: ["#FF8503"],
    };

    return (
        <div className="bg-white dark:bg-gray-1000 p-6 rounded-lg">
            <Chart options={options} series={[ratio]} type="radialBar" height="350" />
        </div>
    );
};

export const CombinedChart = () => {
    const [studentCounts, setStudentCounts] = useState(new Array(12).fill(0));
    const [studentCountsHonours, setStudentCountsHonours] = useState(new Array(12).fill(0));
    const [studentCountsMasters, setStudentCountsMasters] = useState(new Array(12).fill(0));
    const [studentCountsPhD, setStudentCountsPhD] = useState(new Array(12).fill(0));
    const [supervisorCounts, setSupervisorCounts] = useState(new Array(12).fill(0));
    const [chartType, setChartType] = useState('line'); // State for chart type
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Initialize counts...
                // (Fetching logic as in your current implementation)
                
                // After fetching, set state for counts...
            } catch (error) {
                console.error('Error fetching data from Firebase:', error);
            }
        };

        fetchData();
    }, []);

    const options = {
        chart: {
            id: chartType === 'line' ? "basic-line" : "basic-bar",
            toolbar: {
                show: false,
            },
        },
        xaxis: {
            categories: months,
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
        colors: ["#FF8503", "#00E396", "#5C1082", "#F60002"],
    };

    const series = chartType === 'line' ? [
        { name: "Students", data: studentCounts },
        { name: "Supervisors", data: supervisorCounts },
    ] : [
        { name: "Supervisors", data: supervisorCounts },
        { name: "Honours", data: studentCountsHonours },
        { name: "Masters", data: studentCountsMasters },
        { name: "PhD", data: studentCountsPhD },
    ];

    return (
        <div className="bg-white dark:bg-gray-1000 p-6 rounded-lg">
            <div>
                <button onClick={() => setChartType('line')}>Line Chart</button>
                <button onClick={() => setChartType('bar')}>Bar Chart</button>
            </div>
            {studentCounts.some(count => count > 0) || supervisorCounts.some(count => count > 0) ? (
                <Chart options={options} series={series} type={chartType} height="400" width={800} />
            ) : (
                <p>Loading data...</p>
            )}
        </div>
    );
};
