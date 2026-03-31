import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Scanner from './pages/Scanner';
import CyberHelp from './pages/CyberHelp';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/analyze" element={<Scanner />} />
      <Route path="/cyber-help" element={<CyberHelp />} />
    </Routes>
  );
}
