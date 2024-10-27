import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import '../styles/Microphone.css';

const Microphone = ({ onTranscriptionUpdate }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [mode, setMode] = useState(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);
  const socketRef = useRef(null);
  const [recordedAudioBlob, setRecordedAudioBlob] = useState(null);

  useEffect(() => {
    const checkMicrophoneAccess = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (error) {
        alert('Error accessing microphone: ' + error.message);
      }
    };
    checkMicrophoneAccess();

    return () => {
      if (isRecording) stopRecording();
      if (socketRef.current) {
        socketRef.current.close(); // Clean up WebSocket on unmount
      }
    };
  }, [isRecording]);

  const startRecording = async (selectedMode) => {
    if (isRecording) return;
    setMode(selectedMode);
    setIsRecording(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm; codecs=opus' });

      if (selectedMode === 'live') {
        startLiveTranscription(stream);
      } else if (selectedMode === 'record') {
        startRecordedTranscription();
      }
    } catch (error) {
      alert('Failed to access microphone: ' + error.message);
    }
  };

  const startLiveTranscription = (stream) => {
    socketRef.current = new WebSocket(
      'wss://api.deepgram.com/v1/listen',
      ['token', process.env.REACT_APP_DEEPGRAM_API_KEY]
    );

    socketRef.current.onopen = () => {
      mediaRecorderRef.current.start(100);
    };

    socketRef.current.onmessage = (event) => {
      const receivedData = JSON.parse(event.data);
      const alternatives = receivedData.channel?.alternatives || [];
      if (alternatives.length > 0) {
        const transcript = alternatives[0].transcript;
        if (transcript) onTranscriptionUpdate(transcript, 'live');
      }
    };

    socketRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      alert('An error occurred with the live transcription connection.');
      stopRecording(); // Stop recording on error
    };

    mediaRecorderRef.current.ondataavailable = (e) => {
      if (socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(e.data);
      }
    };

    mediaRecorderRef.current.onstop = () => {
      stream.getTracks().forEach((track) => track.stop());
      if (socketRef.current) socketRef.current.close();
      setIsRecording(false);
      setMode(null);
    };
  };

  const startRecordedTranscription = () => {
    audioChunks.current = [];
    mediaRecorderRef.current.start();

    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunks.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
      await processRecordedAudio(audioBlob);
      setRecordedAudioBlob(audioBlob); // Save the recorded audio blob
      setIsRecording(false);
      setMode(null);
    };
  };

  const processRecordedAudio = async (audioBlob) => {
    try {
      setIsTranscribing(true); // Show loading state
      const transcript = await getRecordedTranscription(audioBlob);
      onTranscriptionUpdate(transcript, 'record');
    } catch (error) {
      console.error('Recorded transcription error:', error);
      alert('An error occurred during recorded transcription.');
    } finally {
      setIsTranscribing(false); // Remove loading state
    }
  };

  const getRecordedTranscription = async (audioBlob) => {
    const apiEndpoint = 'https://api.deepgram.com/v1/listen';
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          Authorization: `Token ${process.env.REACT_APP_DEEPGRAM_API_KEY}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to fetch transcription');
      const data = await response.json();
      return data.results.channels[0].alternatives[0].transcript || 'Transcription unavailable';
    } catch (error) {
      console.error('Error fetching recorded transcription:', error);
      return 'Error in transcription';
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  const handleDownload = () => {
    if (recordedAudioBlob) {
      const url = URL.createObjectURL(recordedAudioBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'recording.webm';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url); // Clean up the URL
    }
  };

  const waveVariant = {
    hidden: {
      y: 20,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  };

  const textArray = ["Voice", "Recorder"];

  return (
    <motion.div className="flex flex-col items-center p-8 bg-gray-900 bg-opacity-40 backdrop-blur-md rounded-lg shadow-lg">
      <h2 className="text-white text-3xl font-semibold mb-6 flex">
        {textArray.map((text, index) => (
          <motion.span
            key={index}
            variants={waveVariant}
            initial="hidden"
            animate="visible"
            style={{ display: 'inline-block', marginRight: '4px' }}
            transition={{ delay: index * 0.1 }} // Stagger the animations
          >
            {text}
          </motion.span>
        ))}
      </h2>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <motion.button
          onClick={() => startRecording('live')}
          className={`${
            isRecording && mode === 'live' ? 'bg-red-500' : 'bg-blue-500'
          } text-white text-lg font-medium px-6 py-3 rounded-full shadow-md transition duration-300 hover:bg-opacity-80`}
          disabled={isRecording || isTranscribing}
        >
          Live Transcription
        </motion.button>
        <motion.button
          onClick={() => startRecording('record')}
          className={`${
            isRecording && mode === 'record' ? 'bg-red-500' : 'bg-green-500'
          } text-white text-lg font-medium px-6 py-3 rounded-full shadow-md transition duration-300 hover:bg-opacity-80`}
          disabled={isRecording || isTranscribing}
        >
          Record Transcription
        </motion.button>
      </div>
      {isRecording && (
        <motion.button
          onClick={stopRecording}
          className="bg-red-500 text-white mt-6 px-6 py-3 rounded-full shadow-md transition duration-300 hover:bg-opacity-80"
        >
          Stop Recording
        </motion.button>
      )}
      {isTranscribing && <p className="text-white mt-4 text-lg italic">Transcribing...</p>}
      {recordedAudioBlob && (
        <button
          onClick={handleDownload}
          className="mt-6 inline-block bg-blue-500 text-white px-6 py-3 rounded-full shadow-md transition duration-300 hover:bg-opacity-80"
        >
          Download Recording
        </button>
      )}
    </motion.div>
  );
};

export default Microphone;
