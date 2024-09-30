import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

export const SubmissionModal = ({ isOpen, onClose, setPreviewUrl }) => {
  const [files, setFiles] = useState([]);
  const [isChecked, setIsChecked] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles) => {
      handleFileProcessing(acceptedFiles);
    },
    [onSave, setPreviewUrl]
  );

  const handleFileUpload = (e) => {
    const uploadedFiles = Array.from(e.target.files);
    handleFileProcessing(uploadedFiles);
  };

  const handleFileProcessing = (fileList) => {
    const newFiles = fileList.map((file) => {
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
      readAndSaveFile(file);
      return file;
    });
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const readAndSaveFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      onSave(file, e.target.result);
    };
    reader.onerror = () => {
      console.error('Error reading file');
    };
    reader.readAsText(file);
  };

  const handleButtonClick = () => {
    document.getElementById('fileInput').click();
  };

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const handleSubmit = () => {
    if (files.length > 0) {
      onSave(files[0]);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="static-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div className="relative w-full max-w-3xl max-h-full bg-white rounded-lg shadow-lg dark:bg-gray-700 p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          Submit Assignment
        </h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-200">
              Submission
            </label>
            <Dropzone onDrop={onDrop} />
            <input
              id="fileInput"
              type="file"
              className="hidden focus:outline-none"
              onChange={handleFileUpload}
            />

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
              By submitting, I acknowledge that this is my own work and I have
              not plagiarized.
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
        className:
          'dropzone flex items-center justify-center p-6 border-2 border-gray-400 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:text-gray-300 dark:bg-gray-700',
      })}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className="text-blue-500 dark:text-blue-400">
          Drop the files here...
        </p>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">
          Drag & drop some files here, or click to select files
        </p>
      )}
    </div>
  );
};
