import { createRoot } from 'react-dom/client';
import React from 'react';
import TestReact from './TestReact';

// Get the root element
const container = document.getElementById('app');
const root = createRoot(container);

// Render the TestReact component
root.render(
    <React.StrictMode>
        <TestReact />
    </React.StrictMode>
);
