import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import TMDBService from './services/TMDBService';


const tmdbService = new TMDBService();
tmdbService
  .getMovies('return')
  .then((res) => res.results.forEach(movie => console.log(movie.original_title)))
  .catch((err) => console.error(err));

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);