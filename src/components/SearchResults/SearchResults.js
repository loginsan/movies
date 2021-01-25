import React from 'react';
import { Card, Col, Row } from 'antd';
import TMDBService from '../../services/TMDBService';



const buildCard = (data) => {
  const parsed = {
    backdropPath: data.backdrop_path,
    genres: data.genre_ids,
    id: data.id, 
    originalLanguage: data.original_language,
    originalTitle: data.original_title,
    overview: data.overview,
    popularity: data.popularity,
    posterPath: data.poster_path,
    releaseDate: data.release_date,
    title: data.title,
    video: data.video,
    voteAverage: data.vote_average,
    voteCount: data.vote_count,
  };
  
  return (
    <Col span={12} key={`m${parsed.id}`}>
      <Card title="" bordered={false}>
        { parsed.toString() }
      </Card>
    </Col>);
}

const SearchResults = () => {
  const searchResultsList = [];
  const mdb = new TMDBService();

  mdb.getMovies('future').then((body) => {
    body.results.forEach((element) => {
      searchResultsList.push( buildCard(element) );
    });
  });

  return (<Row gutter={16}>
    {searchResultsList}
  </Row>)
}

export default SearchResults;