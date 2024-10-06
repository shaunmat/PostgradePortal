// components/Review.jsx
import { Card, Button, Badge } from "flowbite-react";
import { Footer } from "../components/Footer";
import { Modal } from "flowbite-react";
// import { Worker, Viewer } from "@react-pdf-viewer/core"; // PDF rendering engine
// import "@react-pdf-viewer/core/lib/styles/index.css";
// import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { useState } from "react";


export const Review = () => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedPdf, setSelectedPdf] = useState("");
  
    // Example of setting a test URL to ensure the PDF viewer is functioning
    const handleViewClick = () => {
        setSelectedPdf("https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf");
        setModalOpen(true);
    };
  
  return (
    <div className="p-4 sm:ml-6 sm:mr-6 lg:ml-72 lg:mr-72">
      <div className="p-4 border-2 border-gray-200  rounded-lg dark:border-gray-700 dark:bg-gray-800">        {/* Review Section Header */}
        <section className="mb-6">
          <h1 className="text-3xl font-extrabold tracking-wider text-gray-800 dark:text-gray-200">
            Review Submissions
          </h1>
          <p className="text-lg font-normal mt-2 text-gray-700 dark:text-gray-400">
            Pending thesis submissions for your review.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card>
            <h2 className="font-bold mb-4 text-lg text-gray-800">PhD Thesis List</h2>
            <div className="mb-4 p-2 border rounded-lg flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-800">Student: John Doe</p>
                <p className="text-sm text-gray-600">Thesis Title: Machine Learning in Healthcare</p>
                <p className="text-sm text-gray-600">Submission Time: 23:59</p>
                <Badge color="warning" className="mt-1">Pending Review</Badge>
              </div>
              <div className="flex gap-2">
                  <Button
                  gradientDuoTone="orangeToPink"
                  onClick={() =>
                    handleViewClick("https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf")
                  }
                >
                  View
                </Button>
                <Button gradientDuoTone="orangeToPink">Download</Button>
              </div>
            </div>
            <div className="p-2 border rounded-lg flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-800">Student: Jane Smith</p>
                <p className="text-sm text-gray-600">Thesis Title: AI in Financial Modeling</p>
                <p className="text-sm text-gray-600">Submission Time: 18:30</p>
                <Badge color="warning" className="mt-1">Pending Review</Badge>
              </div>
              <div className="flex gap-2">
                <Button gradientDuoTone="orangeToPink">View</Button>
                <Button gradientDuoTone="orangeToPink">Download</Button>
              </div>
            </div>
            <div className="p-2 border rounded-lg flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-800">Student: Michael Brown</p>
                <p className="text-sm text-gray-600">Thesis Title: Data Science in Education</p>
                <p className="text-sm text-gray-600">Submission Time: 14:45</p>
                <Badge color="warning" className="mt-1">Pending Review</Badge>
              </div>
              <div className="flex gap-2">
                <Button gradientDuoTone="orangeToPink">View</Button>
                <Button gradientDuoTone="orangeToPink">Download</Button>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="font-bold mb-4 text-lg text-gray-800">Masters Thesis List</h2>
            <div className="mb-4 p-2 border rounded-lg flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-800">Student: Alice Johnson</p>
                <p className="text-sm text-gray-600">Thesis Title: Sustainable Energy Systems</p>
                <p className="text-sm text-gray-600">Submission Time: 12:00</p>
                <Badge color="warning" className="mt-1">Pending Review</Badge>
              </div>
              <div className="flex gap-2">
                <Button gradientDuoTone="orangeToPink">View</Button>
                <Button gradientDuoTone="orangeToPink">Download</Button>
              </div>
            </div>
            <div className="p-2 border rounded-lg flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-800">Student: Michael Brown</p>
                <p className="text-sm text-gray-600">Thesis Title: Data Science in Education</p>
                <p className="text-sm text-gray-600">Submission Time: 14:45</p>
                <Badge color="warning" className="mt-1">Pending Review</Badge>
              </div>
              <div className="flex gap-2">
                <Button gradientDuoTone="orangeToPink">View</Button>
                <Button gradientDuoTone="orangeToPink">Download</Button>
              </div>
            </div>
            <div className="p-2 border rounded-lg flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-800">Student: Michael Brown</p>
                <p className="text-sm text-gray-600">Thesis Title: Data Science in Education</p>
                <p className="text-sm text-gray-600">Submission Time: 14:45</p>
                <Badge color="warning" className="mt-1">Pending Review</Badge>
              </div>
              <div className="flex gap-2">
                <Button gradientDuoTone="orangeToPink" 
                    onClick={() =>
                    handleViewClick("https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf")
                    }
                >View</Button>
                <Button gradientDuoTone="orangeToPink">Download</Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Placeholder section for additional content */}
        <Card className="flex items-center justify-center bg-white dark:bg-gray-800 p-4" style={{display: "none"}}>
          <p className="text-gray-500">Additional resources and feedback tools can be added here.</p>
        </Card>

        <Footer />

        {/* PDF Review Modal */}
        {/* <ViewPopupModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          pdfUrl={selectedPdf}
        /> */}
      </div>
    </div>
  );
};

// const ViewPopupModal = ({ isOpen, onClose, pdfUrl }) => {
//     return (
//       <Modal show={isOpen} onClose={onClose} size="7xl">
//         <Modal.Header>View Thesis Submission</Modal.Header>
//         <Modal.Body>
//           <div className="h-[75vh] overflow-y-auto">
//             {/* Worker component for rendering PDFs */}
//             <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.7.107/build/pdf.worker.min.js">
//               <Viewer
//                 fileUrl={pdfUrl}
//                 renderError={() => (
//                   <div className="text-center text-red-500">
//                     Unable to load the document. Please check the URL or try again later.
//                   </div>
//                 )}
//               />
//             </Worker>
//           </div>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button onClick={onClose} gradientDuoTone="purpleToBlue">
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     );
//   };