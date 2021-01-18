import React from 'react';
import TMDBService from '../../services/TMDBService';
import TEST from '../../services/test';


const SearchResults = () => {
  const searchResultsList = [<li key='m1'>{TEST}</li>];
  const tmdbService = new TMDBService();
  const movies = tmdbService.getMov('return');
  movies.then(body => { console.log(body) });
  return (<ul className="SearchResults">
    {searchResultsList}
  </ul>)
}

export default SearchResults;