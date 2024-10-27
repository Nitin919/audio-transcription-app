import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App'; // Ensure it imports `App` instead of `VoiceRecorderApp`
import './index.css';

// Select the root element
const rootElement = document.getElementById('root');

// Use createRoot to render the application
const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App /> {/* Render App instead of VoiceRecorderApp */}
  </React.StrictMode>
);
