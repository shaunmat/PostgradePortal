import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { DataTable } from 'simple-datatables'; // Ensure correct import path

const db = getFirestore();

export const SupervisorCount = () => {
  const [data, setData] = useState({ headings: [], data: [] });

  useEffect(() => {
    const fetchAndProcessData = async () => {
      try {
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
          if (SupervisorID) {
            SupervisorID.forEach(supervisorId => {
              if (!studentCounts[supervisorId]) {
                studentCounts[supervisorId] = { total: 0, Honours: 0, Masters: 0, PhD: 0 };
              }
              studentCounts[supervisorId].total++;
              if (StudentType in degreeCounts) {
                degreeCounts[StudentType][supervisorId] = (degreeCounts[StudentType][supervisorId] || 0) + 1;
                studentCounts[supervisorId][StudentType]++;
              }
            });
          }
        });

        // Prepare data for DataTable
        const data = Object.entries(supervisors).map(([id, name]) => [
          name,
          studentCounts[id]?.total || 0,
          studentCounts[id]?.Honours || 0,
          studentCounts[id]?.Masters || 0,
          studentCounts[id]?.PhD || 0,
        ]);

        const customData = {
          headings: ["Supervisor", "Students", "Honours", "Masters", "PhD"],
          data: data
        };

        setData(customData);
      } catch (error) {
        console.error('Error fetching or processing data: ', error);
      }
    };

    fetchAndProcessData();
  }, []);

  useEffect(() => {
    if (data.headings.length && data.data.length) {
      new DataTable("#supervisor-table", {
        data: data
      });
    }
  }, [data]);

  return (
    <div className="p-6">
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

