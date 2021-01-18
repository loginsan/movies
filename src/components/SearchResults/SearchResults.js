import React from 'react';
import TMDBService from '../../services/TMDBService';
import TEST from '../../services/test';


const SearchResults = () => {
  const searchResultsList = [<li key='m1'>{TEST}</li>];

  const mdb = new TMDBService();
  mdb.getMovies('future').then((body) => {
    console.log(body.results);
  });

  return (<ul className="searchResults">
    {searchResultsList}
  </ul>)
}

export default SearchResults;
