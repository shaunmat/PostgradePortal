import { useEffect, useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import * as Diff2Html from 'diff2html';
import * as JsDiff from 'diff';
import 'diff2html/bundles/css/diff2html.min.css';

// export const SubmissionModal = ({ isOpen, onClose, onSave, setPreviewUrl }) => {
//     const [files, setFiles] = useState([]);
//     const [isChecked, setIsChecked] = useState(false);

//     const onDrop = useCallback((acceptedFiles) => {
//         setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
//         const fileUrl = URL.createObjectURL(acceptedFiles[0]);
//         setPreviewUrl(fileUrl);
//     }, [setPreviewUrl]);

//     const handleFileUpload = (e) => {
//         const uploadedFiles = Array.from(e.target.files);
//         setFiles((prevFiles) => [...prevFiles, ...uploadedFiles]);
//         const fileUrl = URL.createObjectURL(uploadedFiles[0]);
//         setPreviewUrl(fileUrl);
//     };

//     const handleButtonClick = () => {
//         document.getElementById('fileInput').click();
//     };

//     const handleCheckboxChange = (e) => {
//         setIsChecked(e.target.checked);
//     };

//     const handleSubmit = () => {
//         // Handle file submission logic here
//         console.log('Files submitted:', files);
//         onSave(files); // Call onSave with the files if provided
//         onClose(); // Close the modal after submission
//     };

//     if (!isOpen) return null;

//     return (
//         <div id="static-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//             <div className="relative w-full max-w-3xl max-h-full bg-white rounded-lg shadow-lg dark:bg-gray-700 p-6">
//                 <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Submit Assignment</h2>
//                 <form>
//                     <div className="mb-4">
//                         <label className="block text-gray-700 dark:text-gray-200">Submission</label>
//                         <Dropzone onDrop={onDrop} />
//                         <input
//                             id="fileInput"
//                             type="file"
//                             className="hidden focus:outline-none"
//                             onChange={handleFileUpload}
//                         />

//                         {/* display file name */}
//                         {files.length > 0 && (
//                             <p className="mt-2 text-gray-700 dark:text-gray-300">
//                                 {files.map((file, index) => (
//                                     <span key={index}>{file.name}</span>
//                                 ))}
//                             </p>
//                         )}
                        
//                         <button
//                             type="button"
//                             className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg focus:outline-none"
//                             onClick={handleButtonClick}
//                         >
//                             Upload File
//                         </button>
//                     </div>
//                     <div className="mb-4">
//                         <label className="block text-gray-700 dark:text-gray-200">
//                             <input
//                                 type="checkbox"
//                                 checked={isChecked}
//                                 onChange={handleCheckboxChange}
//                                 className="mr-2 rounded-full focus:ring-2 focus:ring-blue-500"
//                             />
//                             By submitting, I acknowledge that this is my own work and I have not plagiarized.
//                         </label>
//                     </div>
//                     <div className="flex justify-end">
//                         <button
//                             type="button"
//                             className="px-4 py-2 bg-blue-500 text-white rounded-lg focus:outline-none"
//                             onClick={onClose}
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             type="button"
//                             className="ml-2 px-4 py-2 bg-green-500 text-white rounded-lg focus:outline-none"
//                             onClick={handleSubmit}
//                             disabled={!isChecked}
//                         >
//                             Submit
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

export const SubmissionModal = ({ isOpen, onClose, onSave, setPreviewUrl }) => {
    const [files, setFiles] = useState([]);
    const [isChecked, setIsChecked] = useState(false);

    const onDrop = useCallback((acceptedFiles) => {
        setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
        const fileUrl = URL.createObjectURL(acceptedFiles[0]);
        setPreviewUrl(fileUrl);

        // Read file content
        const reader = new FileReader();
        reader.onload = (e) => {
            // Pass file content to parent component
            onSave(acceptedFiles[0], e.target.result);
        };
        reader.readAsText(acceptedFiles[0]);
    }, [onSave, setPreviewUrl]);

    const handleFileUpload = (e) => {
        const uploadedFiles = Array.from(e.target.files);
        setFiles((prevFiles) => [...prevFiles, ...uploadedFiles]);
        const fileUrl = URL.createObjectURL(uploadedFiles[0]);
        setPreviewUrl(fileUrl);

        // Read file content
        const reader = new FileReader();
        reader.onload = (e) => {
            // Pass file content to parent component
            onSave(uploadedFiles[0], e.target.result);
        };
        reader.readAsText(uploadedFiles[0]);
    };

    const handleButtonClick = () => {
        document.getElementById('fileInput').click();
    };

    const handleCheckboxChange = (e) => {
        setIsChecked(e.target.checked);
    };

    const handleSubmit = () => {
        onSave(files[0]); // Only save the first file
        onClose(); // Close the modal after submission
    };

    if (!isOpen) return null;

    return (
        <div id="static-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative w-full max-w-3xl max-h-full bg-white rounded-lg shadow-lg dark:bg-gray-700 p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Submit Assignment</h2>
                <form>
                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-200">Submission</label>
                        <Dropzone onDrop={onDrop} />
                        <input
                            id="fileInput"
                            type="file"
                            className="hidden focus:outline-none"
                            onChange={handleFileUpload}
                        />

                        {/* display file name */}
                        {files.length > 0 && (
                            <p className="mt-2 text-gray-700 dark:text-gray-300">
                                {files.map((file, index) => (
                                    <span key={index}>{file.name}</span>
                                ))}
                            </p>
                        )}
                        
                        <button
                            type="button"
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg focus:outline-none"
                            onClick={handleButtonClick}
                        >
                            Upload File
                        </button>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-200">
                            <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={handleCheckboxChange}
                                className="mr-2 rounded-full focus:ring-2 focus:ring-blue-500"
                            />
                            By submitting, I acknowledge that this is my own work and I have not plagiarized.
                        </label>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg focus:outline-none"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="ml-2 px-4 py-2 bg-green-500 text-white rounded-lg focus:outline-none"
                            onClick={handleSubmit}
                            disabled={!isChecked}
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const Dropzone = ({ onDrop }) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <div
            {...getRootProps({
                className: 'dropzone flex items-center justify-center p-6 border-2  border-gray-400 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:text-gray-300 dark:bg-gray-700',
            })}
        >
            <input {...getInputProps()} />
            {isDragActive ? (
                <p className="text-blue-500 dark:text-blue-400">Drop the files here...</p>
            ) : (
                <p className="text-gray-500 dark:text-gray-400">
                    Drag & drop some files here, or click to select files
                </p>
            )}
        </div>
    );
};


export const ReviewSubmission = ({ isOpen, onClose, oldText, newText }) => {
    const [diffHtml, setDiffHtml] = useState('');

    useEffect(() => {
        if (oldText && newText) {
            // Create diff patch
            const diff = JsDiff.createPatch('Document', oldText, newText);
            // Generate HTML diff
            const diffHtml = Diff2Html.html(diff, {
                drawFileList: false,
                matching: 'lines', // Match lines for side-by-side view
                outputFormat: 'side-by-side' // Ensure side-by-side diff
            });
            setDiffHtml(diffHtml);
        }
    }, [oldText, newText]);

    if (!isOpen) return null;

    return (
        <div id="static-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative w-full max-w-5xl max-h-full bg-white rounded-lg shadow-lg dark:bg-gray-700 p-6 overflow-y-auto">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Review Submission</h2>
                
                {/* Diff output */}
                <div
                    className="diff-output"
                    dangerouslySetInnerHTML={{ __html: diffHtml }}
                />

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="mt-4 px-4 py-2 justify-center items-center bg-blue-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export const CreateSubmission = ({ isOpen, onClose, onSave }) => {
    const [submissionDate, setSubmissionDate] = useState('');
    const [submissionTime, setSubmissionTime] = useState('');
    const [submissionContent, setSubmissionContent] = useState('');
    const [assignmentFiles, setAssignmentFiles] = useState([]);

    const handleSave = () => {
        onSave({
            date: submissionDate,
            time: submissionTime,
            content: submissionContent
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div id="static-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative w-full max-w-3xl bg-white rounded-lg shadow-lg dark:bg-gray-700 p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Create Submission</h2>
                <form>
                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-200">Submission Date</label>
                        <input
                            type="date"
                            value={submissionDate}
                            onChange={(e) => setSubmissionDate(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-200">Submission Time</label>
                        <input
                            type="time"
                            value={submissionTime}
                            onChange={(e) => setSubmissionTime(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-200">Submission Content</label>
                        <textarea
                            value={submissionContent}
                            onChange={(e) => setSubmissionContent(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-200">Submission Files</label>
                        <Dropzone onDrop={(acceptedFiles) => setAssignmentFiles(acceptedFiles)} />
                        <input
                            id="fileInput"
                            type="file"
                            className="hidden focus:outline-none"
                            onChange={(e) => setAssignmentFiles(Array.from(e.target.files))}
                        />

                        {/* display file name */}
                        {assignmentFiles.length > 0 && (
                            <p className="mt-2 text-gray-700 dark:text-gray-300">
                                {assignmentFiles.map((file, index) => (
                                    <span key={index}>{file.name}</span>
                                ))}
                            </p>
                        )}
                        
                        <button
                            type="button"
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg focus:outline-none"
                            onClick={() => document.getElementById('fileInput').click()}
                        >
                            Upload File
                        </button>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg focus:outline-none"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="ml-2 px-4 py-2 bg-green-500 text-white rounded-lg focus:outline-none"
                            onClick={handleSave}
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};