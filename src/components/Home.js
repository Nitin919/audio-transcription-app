import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Microphone from './Microphone';
import Transcription from './Transcription';
import { FaMicrophone, FaFileAudio, FaDownload } from 'react-icons/fa';

const Home = () => {
  const [pastTranscriptions, setPastTranscriptions] = useState([]);
  const [liveTranscription, setLiveTranscription] = useState('');
  const [recordTranscription, setRecordTranscription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Update transcription based on recording mode (live or recorded)
  const handleTranscriptionUpdate = (transcription, mode) => {
    setError(null); // Clear any previous errors
    setIsLoading(false); // Stop loading when transcript is received

    if (mode === 'live') {
      setLiveTranscription(transcription);
    } else if (mode === 'record') {
      setRecordTranscription(transcription);
      setPastTranscriptions((prev) => [...prev, transcription]); // Save recorded transcription
    }
  };

  // Manage loading state
  const handleLoadingState = (loading) => {
    setIsLoading(loading);
  };

  // Handle transcription errors
  const handleError = (errorMessage) => {
    setError(errorMessage);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-400 text-white p-6" style={{ backgroundImage: 'url(/bgg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="mb-8 text-center">
        <h1 className="text-5xl font-bold">Voice Recorder</h1>
        <p className="text-lg mt-2">Try Recording Your Sounds Now</p>
      </div>

      {/* Microphone Component for Recording */}
      <Microphone 
        onTranscriptionUpdate={handleTranscriptionUpdate} 
        onLoading={handleLoadingState} 
        onError={handleError} 
      />

      {/* Transcription Component for Displaying Results */}
      <Transcription 
        liveTranscription={liveTranscription}
        recordTranscription={recordTranscription}
        pastTranscriptions={pastTranscriptions}
        isLoading={isLoading}
        error={error}
      />

      {/* Feature Cards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
        <FeatureCard
          icon={<FaMicrophone className="text-blue-400 text-4xl mb-2" />}
          title="100% Free to Use"
          description="This tool is 100% free to use. Simply record your audio and download it for no cost."
        />
        <FeatureCard
          icon={<FaFileAudio className="text-green-400 text-4xl mb-2" />}
          title="Download Your Recordings"
          description="You can download the audio file to save and use it on your device for free."
        />
        <FeatureCard
          icon={<FaDownload className="text-yellow-400 text-4xl mb-2" />}
          title="Easy-to-Use Interface"
          description="A simple and clean UI makes this application easy to use for anyone."
        />
      </div>
    </div>
  );
};

// Feature Card Component with animation effect
const FeatureCard = ({ icon, title, description }) => (
  <motion.div
    className="bg-black bg-opacity-50 p-6 rounded-lg shadow-lg text-center flex flex-col items-center" // Adjusted for transparency
    whileHover={{ scale: 1.05 }} // Animate scale on hover
    whileTap={{ scale: 0.95 }} // Animate scale on tap
  >
    {icon}
    <h2 className="text-xl font-semibold mb-2 text-white">{title}</h2> {/* Changed text color to white */}
    <p className="text-center text-white">{description}</p> {/* Changed text color to white */}
  </motion.div>
);

export default Home;
