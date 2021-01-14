import React from 'react';
import TMDBService from './services/TMDBService';
import './App.css';

function App() {
  const tmdbService = new TMDBService();
  tmdbService.getMovies('return');
  return (
    <div className="App">
      <header className="App-header">
        
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
