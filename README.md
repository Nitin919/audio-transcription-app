# Voice Recorder Application

A simple web application that allows users to record audio, transcribe it using the Deepgram API, and display the transcriptions in a user-friendly interface.

## Features

- Record audio using the microphone.
- Live transcription of audio using the Deepgram API.
- Display live and recorded transcriptions on the UI.
- Save and display past transcriptions.
- Download recorded audio and transcriptions as text files.
- Responsive design using Tailwind CSS.

## Technologies Used

- React
- Deepgram API
- Tailwind CSS
- Framer Motion (for animations)

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine.
- A Deepgram API key (sign up for a free account at [Deepgram](https://deepgram.com/)).

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Nitin919/audio-transcription-app
   cd voice-recorder-app




Install dependencies:

bash
Copy code
npm install
Create a .env file in the root directory and add your Deepgram API key:

bash
Copy code
REACT_APP_DEEPGRAM_API_KEY=your_api_key_here
Start the application:

bash
Copy code
npm start
Open your browser and go to http://localhost:3000.

Usage
Click the microphone button to start recording audio.
Speak clearly into your microphone.
Stop the recording to see the transcription displayed in real-time.
You can save or download the transcriptions for later use.
Error Handling
If there are issues with the transcription process, error messages will be displayed to inform the user.

Future Improvements
Implement unit tests for components.
Improve error handling and user feedback.
Enhance the UI with additional features and visual elements.