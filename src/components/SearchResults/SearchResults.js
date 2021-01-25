import React, { Component } from 'react';
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
    <Col span={12} xs={24} sm={12} lg={12} xl={12} key={`m${parsed.id}`}>
      <Card title="" bordered={false}>
        <h5>{parsed.title}</h5>
        <span className="movie--release-date">{parsed.releaseDate}</span><br />
        <span className="movie--genres">{parsed.genres}</span><br />
        <p className="movie--overview">{parsed.overview}</p>
        <div className="movie--popularity">{parsed.popularity} / {parsed.voteAverage}</div>
      </Card>
    </Col>
  );
}

class SearchResults extends Component {
  state = {
    movies: [],
  }

  componentDidMount() {
    const mdb = new TMDBService();
      mdb.getMovies('future')
      .then((body) => Array.from(body.results))
      .then((list) => {
        this.setState({
          movies: list,
        });
      });
  }

  render() {
    const { movies } = this.state;
    return (<Row gutter={[36, 36]}>
      { movies.map(elem => buildCard(elem)) }
    </Row>)
  }
}

export default SearchResults;