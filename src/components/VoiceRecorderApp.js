import React, { useState } from 'react';
import Microphone from './Microphone';
import Transcription from './Transcription';

const VoiceRecorderApp = () => {
  const [liveTranscription, setLiveTranscription] = useState('');
  const [recordTranscription, setRecordTranscription] = useState('');
  const [pastTranscriptions, setPastTranscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle transcription updates from the Microphone component
  const handleTranscriptionUpdate = (transcript, mode) => {
    setError(null); // Clear any previous errors
    setIsLoading(false); // Stop loading when transcript is received

    if (mode === 'live') {
      setLiveTranscription(transcript);
    } else if (mode === 'record') {
      setRecordTranscription(transcript);
      setPastTranscriptions((prev) => [...prev, transcript]);
    }
  };

  // Handle loading state during transcription
  const handleLoadingState = (loading) => {
    setIsLoading(loading);
  };

  // Handle any errors during transcription
  const handleError = (errorMessage) => {
    setError(errorMessage);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center">
      <Microphone 
        onTranscriptionUpdate={handleTranscriptionUpdate} 
        onLoading={handleLoadingState} 
        onError={handleError} 
      />
      <Transcription 
        liveTranscription={liveTranscription} 
        recordTranscription={recordTranscription} 
        pastTranscriptions={pastTranscriptions} 
        isLoading={isLoading} 
        error={error} 
      />
    </div>
  );
};

export default VoiceRecorderApp;
