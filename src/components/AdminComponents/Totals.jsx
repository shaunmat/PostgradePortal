import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const db = getFirestore();

export const Totals = ({Type}) => {
  const [count, setCount] = useState(0); // Initialize state for storing the student count

  // Function to count the documents in the 'Students' collection
  async function countDocumentsInCollection() {
    try {
      const querySnapshot = await getDocs(collection(db, Type));
      setCount(querySnapshot.size); // Update the student count in state
    } catch (error) {
      console.error('Error counting documents: ', error);
    }
  }

  // useEffect to count the documents when the component is mounted
  useEffect(() => {
    countDocumentsInCollection();
  }, [Type]); // Empty dependency array means this will only run once when the component is mounted

  // Display the student count in the component
  return (
    <div>
      <h3>{count}</h3>
    </div>
  );
};
