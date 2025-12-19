import React from 'react';
import { createRoot } from 'react-dom/client';
import App1 from './App1';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App1 />
  </React.StrictMode>
);