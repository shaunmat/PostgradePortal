import React, { useEffect, useState, useRef } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { DataTable } from 'simple-datatables'; // Ensure correct import path

const db = getFirestore();

export const SupervisorCount = () => {
  const [selectedDegree, setSelectedDegree] = useState('Honours');
  const [data, setData] = useState({
    //headings: ["Supervisors Name", "Overall Students", "Degree Types", `Number of students in ${selectedDegree}`], // Updated headings
    headings:[],
    data: []
  });
  const [loading, setLoading] = useState(true);
  const tableRef = useRef(null);
  let dataTableInstance = useRef(null);

  useEffect(() => {
    const fetchAndProcessData = async () => {
      try {
        setLoading(true);
        // Fetch all supervisors
        const supervisorsSnapshot = await getDocs(collection(db, 'Supervisor'));
        const supervisors = {};
        supervisorsSnapshot.forEach(doc => {
          const { Title, Name, Surname } = doc.data();
          supervisors[doc.id] = `${Title} ${Name} ${Surname}`;
        });

        // Fetch all students and categorize by degree
        const studentsSnapshot = await getDocs(collection(db, 'Student'));
        const studentCounts = {};
        const degreeCounts = { Honours: {}, Masters: {}, PhD: {} };

        studentsSnapshot.forEach(doc => {
          const { SupervisorID, StudentType } = doc.data();
          if (SupervisorID && StudentType in degreeCounts) {
            SupervisorID.forEach(supervisorId => {
              degreeCounts[StudentType][supervisorId] = (degreeCounts[StudentType][supervisorId] || 0) + 1;
              studentCounts[supervisorId] = (studentCounts[supervisorId] || 0) + 1; // Total count of students under supervisor
            });
          }
        });
        // Update the headings dynamically based on the selected degree
        const newHeadings = ["Supervisors Name", "Overall Students", "Degree Types", `Number of students in ${selectedDegree}`];
        // Prepare the data by swapping the "Overall Students" and "Number of students in selectedDegree"
        const filteredData = Object.entries(supervisors).map(([id, name]) => [
          name,
          studentCounts[id] || 0,          // Overall Students (previously Number of students in selectedDegree)
          selectedDegree,                  // Degree Type
          degreeCounts[selectedDegree][id] || 0 // Number of students in selectedDegree (previously Overall Students)
        ]);
        setData({
          headings: newHeadings,
          data: filteredData
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching or processing data: ', error);
        setLoading(false);
      }
    };

    fetchAndProcessData();
  }, [selectedDegree]);

  useEffect(() => {
    if (data.headings.length && data.data.length) {
      if (dataTableInstance.current) {
        dataTableInstance.current.destroy();
      }
      dataTableInstance.current = new DataTable("#supervisor-table", {
        data: data,
        searchable: false,
        sortable: false,
        perPageSelect: false,
        perPage: 5,

        
      });
    }
  }, [data]);

  return (
    <div className='p-4'>
      <div className="mb-2">
        <label htmlFor="degreeFilter" className="block font-medium text-gray-700 dark:text-gray-200">Select Degree Type:</label>
        <select
          id="degreeFilter"
          className="border border-gray-300 rounded-md mt-3 w-36 p-2 dark:bg-gray-700 dark:text-gray-200"
          value={selectedDegree}
          onChange={(e) => setSelectedDegree(e.target.value)}
        >
          <option value="Honours">Honours</option>
          <option value="Masters">Masters</option>
          <option value="PhD">PhD</option>   
        </select>
      </div>

      <table id="supervisor-table" className="table-auto w-full">
        <thead>
          <tr>
            {data.headings.map((heading, index) => (
              <th key={index} className="px-4 py-2">{heading}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="border px-4 py-2">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
