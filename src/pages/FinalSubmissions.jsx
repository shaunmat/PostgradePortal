import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../backend/config';
import { Footer } from '../components/Footer';
import { motion } from 'framer-motion';
import BannerImage from "../assets/images/BannerImage2.jpg"

export const FinalSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Final Submissions'));
        const fetchedSubmissions = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedSubmissions.push({ id: doc.id, ...data });
        });
        setSubmissions(fetchedSubmissions);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching submissions:', error);
      }
    };

    fetchSubmissions();
  }, []);

  if (loading) {
    return <div>Loading submissions...</div>;
  }

  return (
    <div className="p-4 sm:ml-64 pt-16">

      {/* Banner Section */}
      <div className="relative h-80 w-full rounded-xl overflow-hidden shadow-lg mb-6">
        <img
          src="https://th.bing.com/th/id/OIP.QyusN-TuDAg2X2Tbx7URBgHaE8?w=1600&h=1067&rs=1&pid=ImgDetMain"
          alt="Banner"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <h1 className="text-4xl font-bold text-white">Final Submissions</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 border-2 border-gray-200 rounded-lg dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-200 mb-4">
          Review Submissions
        </h1>
        <p className="text-md text-gray-500 dark:text-gray-400 mb-6">
          Here you can review the final submissions from students. Click on any card to view detailed information.
        </p>

        {/* Grid of Submission Cards */}
        <div className="flex flex-col gap-7">
          {submissions.map((submission) => (
            <Link 
              to={`/Details/${submission.id}`}
              key={submission.id}
              className="block w-full"
            >
              <motion.div 
                className="flex flex-col justify-between rounded-xl bg-white dark:bg-gray-700 p-6 shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                whileHover={{ scale: 1.05, boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)" }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-extrabold text-gray-800 dark:text-gray-200">
                      {submission.StudentName} {submission.StudentSurname}
                    </h2>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      ID: {submission.id}
                    </span>
                  </div>
                  <p className="text-md text-gray-500 dark:text-gray-300">
                    Course: {submission.CourseName}
                  </p>
                </div>

                <span className="mt-4 inline-block text-[#FF8503] dark:text-blue-500 font-medium">
                  View Details →
                </span>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};
