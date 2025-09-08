

import React from 'react';
import { Dashboard } from './components/Dashboard';

/**
 * Root App component that renders the main dashboard
 * Demonstrates clean component hierarchy and separation of concerns
 */
function App() {
  return (
    <div className="App">
      <Dashboard />
    </div>
  );
}

export default App;