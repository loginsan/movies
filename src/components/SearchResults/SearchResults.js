import React, { Component } from 'react';
import { PropTypes}  from 'prop-types';
import { Card, Col, Row } from 'antd';
import { format, isValid } from 'date-fns';


function truncate(limit){
    if (this.length <= limit) {
      return this;
    }
    const short = this.substr(0, limit - 1);
    return `${short.substr(0, short.lastIndexOf(' '))}…`;
}

class SearchResults extends Component {
  
  nameGenre = (id) => {
    const { genres } = this.props;
    const gobj = genres.find(elem => elem.id === id);
    return gobj ? gobj.name : '';
  }

  buildImg = (pp, bp) => {
    const noposter = './noposter.svg';
    return pp || bp ? `https://image.tmdb.org/t/p/w185${pp || bp}` : noposter;
  }

  buildCard = (data) => {
    const rdate = isValid(new Date(data.release_date)) ? new Date(data.release_date) : Date.now();
      const movie = {
        backdropPath: data.backdrop_path,
        genres: data.genre_ids.map(elem => <li key={`g${data.id}-${elem}`}>{this.nameGenre(elem)}</li>),
        id: data.id,
        originalLanguage: data.original_language,
        originalTitle: data.original_title,
        overview: data.overview,
        popularity: data.popularity,
        posterPath: data.poster_path,
        releaseDate: format(rdate, 'LLLL d, yyy'),
        title: data.title,
        video: data.video,
        voteAverage: data.vote_average,
        voteCount: data.vote_count,
      };
    
    return (
      <Col span={12} xs={24} sm={12} lg={12} xl={12} key={`m${movie.id}`}>
        <Card title="" bordered={false} className="movie-card">
          <img
            className="movie--poster"
            alt={movie.title}
            title={`${movie.posterPath} __ ${movie.backdropPath}`}
            src={this.buildImg(movie.posterPath, movie.backdropPath)}
          />
          <h5 className="movie--title" title={movie.title}>
            {movie.title}
          </h5>
          <span className="movie--release-date">{movie.releaseDate}</span>
          <ul className="movie--genres">{movie.genres}</ul>
          <div className="movie--overview" title={movie.overview}>
            <p>{ truncate.call(movie.overview, 150) }</p>
          </div>
          <div className="movie--vote-average" title={movie.id}>
            {movie.voteAverage}
          </div>
        </Card>
      </Col>
    );
  };

  render() {
    const { items } = this.props;
    return (
      <Row gutter={[36, 36]} justify="space-around" className="movies-list">
        { items.map(elem => this.buildCard(elem)) }
      </Row>
    );
  }
}

SearchResults.defaultProps = {
  items: [],
  genres: [],
};

SearchResults.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object),
  genres: PropTypes.arrayOf(PropTypes.object),
};

export default SearchResults;