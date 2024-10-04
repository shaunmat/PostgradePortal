import React, { useState } from 'react';
import { storage } from '../backend/config';
import { ref, uploadBytes } from 'firebase/storage';

const FinalSubmissionModal = ({ isOpen, onClose, onSave, ResearchID, UserID }) => {
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
            alert('All files uploaded successfully!');
            onSave(files);
        } catch (error) {
            console.error('Error uploading files:', error);
        } finally {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Final Submission</h2>
                <div className="mb-4">
                    <p>- A copy of your Affidavit (Stamped by a Commissioner of Oaths)</p>
                    <input 
                        type="file" 
                        onChange={(e) => handleFileChange(0, e)} 
                        className="w-full p-2 mb-2 border border-gray-300 rounded"
                    />
                </div>

                <div className="mb-4">
                    <p>- Your Declaration</p>
                    <input 
                        type="file" 
                        onChange={(e) => handleFileChange(1, e)} 
                        className="w-full p-2 mb-2 border border-gray-300 rounded"
                    />
                </div>

                <div className="mb-4">
                    <p>- Your Final Turnitin Report</p>
                    <input 
                        type="file" 
                        onChange={(e) => handleFileChange(2, e)} 
                        className="w-full p-2 mb-2 border border-gray-300 rounded"
                    />
                </div>

                <div className="mb-4">
                    <p>- Signed Letter as Proof of Language Editing by a Language Editor</p>
                    <input 
                        type="file" 
                        onChange={(e) => handleFileChange(3, e)} 
                        className="w-full p-2 mb-2 border border-gray-300 rounded"
                    />
                </div>

                <div className="mb-4">
                    <p>- A soft Copy of the Research Project/Minor Dissertation/Dissertation/Thesis (Word/PDF only)</p>
                    <input 
                        type="file" 
                        onChange={(e) => handleFileChange(4, e)} 
                        className="w-full p-2 mb-2 border border-gray-300 rounded"
                    />
                </div>

                <div className="flex items-center mb-4">
                    <input 
                        type="checkbox" 
                        id="accuracyCheckbox" 
                        checked={isChecked} 
                        onChange={handleCheckboxChange} 
                    />
                    <label htmlFor="accuracyCheckbox" className="ml-2">I am sure the information I am submitting is accurate</label>
                </div>
                
                <div className="flex justify-end">
                    <button onClick={onClose} className="mr-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
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
};

export default FinalSubmissionModal;
