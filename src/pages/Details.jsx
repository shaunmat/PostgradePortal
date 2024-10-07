import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from '../backend/config';
import { Footer } from '../components/Footer';
import { FaFileAlt } from 'react-icons/fa';
import BannerImage from "../assets/images/BannerImage.jpg";

export const Details = () => {
  const { UserID } = useParams();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [marks, setMarks] = useState('');
  const [comments, setComments] = useState('');
  const [feedbackFile, setFeedbackFile] = useState(null);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const submissionRef = doc(db, 'Final Submissions', UserID);
        const submissionSnap = await getDoc(submissionRef);

        if (submissionSnap.exists()) {
          setSubmission(submissionSnap.data());
        } else {
          setError('No such submission found');
        }
      } catch (error) {
        console.error('Error fetching submission:', error);
        setError('Failed to fetch submission');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmission();
  }, [UserID]);

  const handleFeedbackSubmit = async () => {
    if (!marks || !comments || !feedbackFile) {
      alert('Please provide marks, comments, and a feedback file.');
      return;
    }

    setIsSubmittingFeedback(true);

    try {
      // Upload feedback file to Firebase Storage
      const feedbackRef = ref(storage, `feedback/${UserID}.pdf`);
      await uploadBytes(feedbackRef, feedbackFile);

      // Get the download URL of the uploaded feedback file
      const feedbackURL = await getDownloadURL(feedbackRef);

      // Update Firestore with marks, comments, and feedback URL
      const feedbackDocRef = doc(db, `Final Submissions/${UserID}`);
      await setDoc(feedbackDocRef, {
        marks,
        comments,
        feedbackURL,
        feedbackAvailable: true, // Mark feedback as available
      }, { merge: true });

      // Clear form fields after submission
      setMarks('');
      setComments('');
      setFeedbackFile(null);
      alert('Feedback provided successfully!');
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handleFileChange = (e) => {
    setFeedbackFile(e.target.files[0]);
  };

  if (loading) {
    return <div className="p-4 sm:ml-64 pt-16 text-lg">Loading submission details...</div>;
  }

  if (error) {
    return <div className="p-4 sm:ml-64 pt-16 text-lg text-red-500">{error}</div>;
  }

  if (!submission) {
    return <div className="p-4 sm:ml-64 pt-16 text-lg">No submission data available</div>;
  }

  return (
    <div className="p-4 sm:ml-64 pt-16">
      {/* Banner Image */}
      <div className="relative h-60 w-full rounded-xl overflow-hidden shadow-lg mb-6">
        <img
          src={BannerImage} 
          alt="Banner"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <h1 className="text-4xl font-bold text-white">
            Student Submission Details
          </h1>
        </div>
      </div>

      <div className="p-6 border-2 border-gray-200 rounded-lg dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800">
        <h2 className="text-4xl font-extrabold text-gray-800 dark:text-white">
          {submission.StudentName} {submission.StudentSurname}
        </h2>
        <p className="text-lg text-gray-600 mt-2 dark:text-gray-300">Course: {submission.CourseName}</p>

        <div className="mt-6">
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-white border-b-2 border-gray-300 pb-2 mb-4">
            Submitted Files
          </h3>
          <ul className="space-y-3">
            {submission.files && submission.files.length > 0 ? (
              submission.files.map((file, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <FaFileAlt className="text-xl text-gray-500 dark:text-gray-300" />
                  <a
                    href={file.downloadURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {file.fileName}
                  </a>
                </li>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-300">No files submitted.</p>
            )}
          </ul>
        </div>

        {/* Feedback Section */}
        <div className="mt-8">
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">Provide Feedback</h3>
          <label className="block text-gray-800 dark:text-gray-200 mt-4">
            Marks:
            <input
              type="number"
              className="block w-full mt-2 p-2 border rounded"
              value={marks}
              onChange={(e) => setMarks(e.target.value)}
            />
          </label>
          <label className="block text-gray-800 dark:text-gray-200 mt-4">
            Comments:
            <textarea
              className="block w-full mt-2 p-2 border rounded"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </label>
          <label className="block text-gray-800 dark:text-gray-200 mt-4">
            Upload Feedback (PDF):
            <input
              type="file"
              accept="application/pdf"
              className="block w-full mt-2"
              onChange={handleFileChange}
            />
          </label>
          <button
            onClick={handleFeedbackSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
            disabled={isSubmittingFeedback}
          >
            {isSubmittingFeedback ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};
