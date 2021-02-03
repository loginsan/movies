import React, { Component } from 'react';
import { PropTypes}  from 'prop-types';
import { Card, Col, Row, Rate, Spin, Alert } from 'antd';
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
        dateTime: rdate,
        releaseDate: format(rdate, 'LLLL d, yyy'),
        title: data.title,
        video: data.video,
        voteAverage: data.vote_average,
        voteCount: data.vote_count,
      };
    
    return (
      <Col span={12} xs={24} sm={12} lg={12} xl={12} key={`m${movie.id}`}>
        <Card title="" bordered={false} className="movie">
          <img
            className="movie--poster"
            alt={movie.title}
            title={`${movie.popularity}`}
            src={this.buildImg(movie.posterPath, movie.backdropPath)}
          />
          <h5 className="movie--title" title={movie.title}>
            {movie.title}
          </h5>
          <time className="movie--release-date" dateTime={movie.dateTime}>
            {movie.releaseDate}
          </time>
          <ul className="movie--genres">{movie.genres}</ul>
          <article className="movie--overview" title={movie.overview}>
            <p>{truncate.call(movie.overview, 150)}</p>
          </article>
          <div className="movie--vote-average" title={movie.id}>
            {movie.voteAverage}
          </div>
          <div className="movie--rate">
            <Rate count="10" allowHalf defaultValue={2.5} />
          </div>
        </Card>
      </Col>
    );
  };

  render() {
    const { items, isLoading, error } = this.props;
    const dataOrNot = error ? (
      <Alert className="alert-box" message={`Error: ${error}`} type="error" showIcon />
    ) : items.map(elem => this.buildCard(elem));
    const moviesBox = isLoading ? <Spin size="large" /> : dataOrNot;

    return (
      <Row gutter={[36, 36]} justify="space-around" className="movies-list">
        { moviesBox }  
      </Row>
    );
  }
}

SearchResults.defaultProps = {
  items: [],
  genres: [],
  isLoading: true,
  error: false,
};

SearchResults.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object),
  genres: PropTypes.arrayOf(PropTypes.object),
  isLoading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};

export default SearchResults;