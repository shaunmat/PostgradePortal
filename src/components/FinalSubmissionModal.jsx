import React, { useState } from 'react';
import { storage } from '../backend/config';
import { ref, uploadBytes } from 'firebase/storage';
import { HiOutlinePencilAlt, HiOutlineXCircle } from "react-icons/hi"; // Updated icons
import { toast } from 'react-toastify';
export const FinalSubmissionModal = ({ isOpen, onClose, onSave, ResearchID, UserID }) => {
    const [files, setFiles] = useState(Array(5).fill(null));
    const [isChecked, setIsChecked] = useState(false);

    if (!isOpen) return null;

    const handleFileChange = (index, event) => {
        const newFiles = [...files];
        newFiles[index] = event.target.files[0];
        setFiles(newFiles);
    };

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
    };

    const handleSave = async () => {
        try {
            const uploadPromises = files.map((file, index) => {
                if (!file) return Promise.resolve(); 
                const fileRef = ref(storage, `Final Submission/${ResearchID}/${UserID}/${file.name}`); 
                return uploadBytes(fileRef, file); 
            });

            // Wait for all uploads to complete
            await Promise.all(uploadPromises);
            toast.success('Files uploaded successfully!');
            onSave(files);
        } catch (error) {
            console.error('Error uploading files:', error);
        } finally {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            {/* Multiple submissions, need grid */}
            <div className="relative bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
                <button 
                    onClick={onClose} 
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                    <HiOutlineXCircle className="w-6 h-6" />
                </button>
                <h2 className="text-xl font-bold mb-4">Final Submission</h2>
    
                <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="affidavit" className="text-sm text-gray-700 font-medium">
                            A copy of your Affidavit (Stamped by a Commissioner of Oaths)
                        </label>
                        <input 
                            type="file" 
                            id="affidavit"
                            accept="application/pdf" // Accepts only PDF files
                            onChange={(e) => handleFileChange(0, e)} 
                            className="file:border file:border-gray-300 file:rounded file:py-2 file:px-4 file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-200"
                        />
                    </div>
    
                    <div className="flex flex-col gap-2">
                        <label htmlFor="declaration" className="text-sm text-gray-700 font-medium">
                            Your Declaration of Authenticity (Signed and Dated)
                        </label>
                        <input 
                            type="file" 
                            id="declaration"
                            accept="application/pdf" // Accepts only PDF files
                            onChange={(e) => handleFileChange(1, e)} 
                            className="file:border file:border-gray-300 file:rounded file:py-2 file:px-4 file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-200"
                        />
                    </div>
    
                    <div className="flex flex-col gap-2">
                        <label htmlFor="turnitinReport" className="text-sm text-gray-700 font-medium">
                            Your Final Turnitin Report (PDF)
                            <br />
                            <span className="text-xs text-gray-500 font-normal">
                                (Ensure that the Similarity Index is below 20%)
                            </span>
                        </label>
                        <input 
                            type="file" 
                            id="turnitinReport"
                            accept="application/pdf" // Accepts only PDF files
                            onChange={(e) => handleFileChange(2, e)} 
                            className="file:border file:border-gray-300 file:rounded file:py-2 file:px-4 file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-200"
                        />
                    </div>
    
                    <div className="flex flex-col gap-2">
                        <label htmlFor="languageEditingLetter" className="text-sm text-gray-700 font-medium">
                            Signed Letter as Proof of Language Editing by a Language Editor
                        </label>
                        <input 
                            type="file" 
                            id="languageEditingLetter"
                            accept="application/pdf" // Accepts only PDF files
                            onChange={(e) => handleFileChange(3, e)} 
                            className="file:border file:border-gray-300 file:rounded file:py-2 file:px-4 file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-200 mb-2"
                        />
                    </div>
    
                    <div className="flex flex-col gap-2">
                        <label htmlFor="softCopy" className="text-sm text-gray-700 font-medium">
                            A soft Copy of the Research Project / Minor Dissertation / Dissertation/Thesis 
                            <br />
                            <span className="text-xs text-gray-500 font-normal">
                                (Word/PDF format)
                            </span> 
                        </label>
                        <input 
                            type="file" 
                            id="softCopy"
                            accept="application/pdf" // Accepts only PDF files
                            onChange={(e) => handleFileChange(4, e)} 
                            className="file:border file:border-gray-300 file:rounded file:py-2 file:px-4 file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-200 mb-2"
                        />
                    </div>
                </div>
    
                <div className="flex items-center gap-2 mt-4">
                    <input 
                        type="checkbox" 
                        id="declarationCheckbox" 
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                        className="form-checkbox h-5 w-5 rounded-full text-blue-500 ring-0 focus:ring-0"
                    />
                    <label htmlFor="declarationCheckbox" className="text-sm text-gray-700 font-medium">
                        I hereby declare that the information provided is accurate and true.
                    </label>
                </div>
    
                <div className="flex justify-end mt-4 gap-2">
                    <button
                        onClick={onClose}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded ml-2"
                    >
                        Close
                    </button>
                    <button 
                        onClick={handleSave} 
                        disabled={!isChecked}
                        className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded ${!isChecked ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );

}