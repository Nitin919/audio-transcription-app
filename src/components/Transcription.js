import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import '../styles/Transcription.css'; // Import the CSS file for animations

const Transcription = ({ liveTranscription, recordTranscription, pastTranscriptions, isLoading, error }) => {
  const [savedTranscriptions, setSavedTranscriptions] = useState([]);

  // Load saved transcriptions from local storage on component mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedTranscriptions')) || [];
    setSavedTranscriptions(saved);
  }, []);

  // Save transcription to local storage
  const handleSaveTranscription = (transcription, type) => {
    const newSavedTranscriptions = [...savedTranscriptions, { text: transcription, type }];
    setSavedTranscriptions(newSavedTranscriptions);
    localStorage.setItem('savedTranscriptions', JSON.stringify(newSavedTranscriptions));
  };

  // Function to handle file download
  const handleDownloadTextFile = (text, filename) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  // Download the live transcription as a text file
  const handleDownloadLiveTranscription = () => {
    handleDownloadTextFile(liveTranscription, 'live_transcription.txt');
  };

  // Download the recorded transcription as a text file
  const handleDownloadRecordedTranscription = () => {
    handleDownloadTextFile(recordTranscription, 'recorded_transcription.txt');
  };

  // Download all past transcriptions as a single text file
  const handleDownloadPastTranscriptions = () => {
    const allTranscriptions = pastTranscriptions.join('\n');
    handleDownloadTextFile(allTranscriptions, 'past_transcriptions.txt');
  };

  // Delete a saved transcription from local storage
  const handleDeleteSavedTranscription = (index) => {
    const newSavedTranscriptions = savedTranscriptions.filter((_, i) => i !== index);
    setSavedTranscriptions(newSavedTranscriptions);
    localStorage.setItem('savedTranscriptions', JSON.stringify(newSavedTranscriptions));
  };

  return (
    <motion.div className="flex flex-col items-center text-white p-8 bg-transparent backdrop-blur-md rounded-lg shadow-lg">
      {isLoading && (
        <motion.div className="p-6 bg-white bg-opacity-20 backdrop-blur-lg shadow-lg rounded-lg w-full max-w-md">
          <h2 className="text-3xl font-semibold mb-4 animate-pulse">Loading...</h2>
        </motion.div>
      )}
      {error && (
        <motion.div className="p-6 bg-red-600 bg-opacity-20 backdrop-blur-lg shadow-lg rounded-lg w-full max-w-md">
          <h2 className="text-3xl font-semibold mb-2">Error:</h2>
          <p className="text-lg">{error}</p>
        </motion.div>
      )}
      {/* Live Transcription Section */}
      {liveTranscription && (
        <motion.div className="p-6 bg-white bg-opacity-20 backdrop-blur-lg shadow-lg rounded-lg w-full max-w-md">
          <h2 className="text-3xl font-semibold mb-4">Live Transcription:</h2>
          <p className={`text-lg wave-effect`}>{liveTranscription}</p>
          <div className="flex space-x-2 mt-3">
            <button
              onClick={() => handleSaveTranscription(liveTranscription, 'live')}
              className="bg-green-600 bg-opacity-60 text-white px-5 py-3 rounded-lg hover:bg-green-700 transition duration-300"
            >
              Save Live
            </button>
            <button
              onClick={handleDownloadLiveTranscription}
              className="bg-blue-600 bg-opacity-60 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Download Live
            </button>
          </div>
        </motion.div>
      )}
      {/* Recorded Transcription Section */}
      {recordTranscription && (
        <motion.div className="mt-4 p-6 bg-white bg-opacity-20 backdrop-blur-lg shadow-lg rounded-lg w-full max-w-md">
          <h2 className="text-3xl font-semibold mb-4">Recorded Transcription:</h2>
          <p className="text-lg">{recordTranscription}</p>
          <div className="flex space-x-2 mt-3">
            <button
              onClick={() => handleSaveTranscription(recordTranscription, 'recorded')}
              className="bg-green-600 bg-opacity-60 text-white px-5 py-3 rounded-lg hover:bg-green-700 transition duration-300"
            >
              Save Recorded
            </button>
            <button
              onClick={handleDownloadRecordedTranscription}
              className="bg-blue-600 bg-opacity-60 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Download Recorded
            </button>
          </div>
        </motion.div>
      )}
      {/* Past Transcriptions Section */}
      {pastTranscriptions.length > 0 && (
        <motion.div className="mt-4 p-6 bg-white bg-opacity-20 backdrop-blur-lg shadow-lg rounded-lg w-full max-w-md">
          <h2 className="text-3xl font-semibold mb-4">Past Transcriptions:</h2>
          <ul className="list-disc pl-5">
            {pastTranscriptions.map((transcript, index) => (
              <motion.li key={index} className="text-lg">{transcript}</motion.li>
            ))}
          </ul>
          <button
            onClick={handleDownloadPastTranscriptions}
            className="mt-3 bg-blue-600 bg-opacity-60 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Download Past Transcriptions
          </button>
        </motion.div>
      )}
      {/* Saved Transcriptions Section */}
      {savedTranscriptions.length > 0 && (
        <motion.div className="mt-4 p-6 bg-white bg-opacity-20 backdrop-blur-lg shadow-lg rounded-lg w-full max-w-md">
          <h2 className="text-3xl font-semibold mb-4">Saved Transcriptions:</h2>
          <ul className="list-disc pl-5">
            {savedTranscriptions.map((saved, index) => (
              <li key={index} className="flex justify-between text-lg">
                <span>{saved.text}</span>
                <button
                  onClick={() => handleDeleteSavedTranscription(index)}
                  className="text-red-500 ml-2 hover:underline"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Transcription;
