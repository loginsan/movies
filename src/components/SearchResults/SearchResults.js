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
    const movie = {
      backdropPath: data.backdrop_path,
      genres: data.genre_ids.map(elem => <li key={`g${data.id}-${elem}`}>{this.nameGenre(elem)}</li>),
      id: data.id,
      originalLanguage: data.original_language,
      originalTitle: data.original_title,
      overview: data.overview,
      popularity: data.popularity,
      posterPath: data.poster_path,
      posterSrc: this.buildImg(data.poster_path, data.backdrop_path),
      releaseDate: isValid(new Date(data.release_date)) ? new Date(data.release_date) : new Date(),
      title: data.title,
      video: data.video,
      voteAverage: data.vote_average,
      voteCount: data.vote_count,
    };

    return <MovieCard movie={movie} key={`m${movie.id}`} />;
  };

  render() {
    const { items, isLoading, error } = this.props;

    const dataOrNot = error ? (
      <Alert className="alert-box" message={error} type="error" showIcon />
    ) : items.map(elem => this.buildCard(elem));
    const moviesBox = !isLoading ? dataOrNot : (
      <Spin size="large" tip="Loading..." />
    );

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


const MovieCard = ({ movie }) => {
  const { id, title, originalTitle, posterSrc, releaseDate, genres, overview, voteAverage } = movie;
  return (
    <Col span={12} xs={24} sm={12} lg={12} xl={12}>
      <Card title="" bordered={false} className="movie">
        <img className="movie--poster" alt={title} title={originalTitle} src={posterSrc} />
        <h5 className="movie--title" title={title}>
          {title}
        </h5>
        <time className="movie--release-date" dateTime={releaseDate}>
          {format(releaseDate, 'LLLL d, yyy')}
        </time>
        <ul className="movie--genres">{genres}</ul>
        <article className="movie--overview" title={overview}>
          <p>{truncate.call(overview, 150)}</p>
        </article>
        <div className="movie--vote-average" title={id}>
          {voteAverage}
        </div>
        <div className="movie--rate">
          <Rate count="10" allowHalf defaultValue={2.5} />
        </div>
      </Card>
    </Col>
  );
};

MovieCard.defaultProps = {
  movie: {
    id: 0,
    title: 'Working Title',
    originalTitle: 'Working Title',
    posterSrc: './noposter.svg',
    releaseDate: new Date(),
    genres: [<li key='g0-0'>noname</li>],
    overview: 'Some text here',
    voteAverage: 2.5,
  }
};

MovieCard.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    originalTitle: PropTypes.string,
    posterSrc: PropTypes.string,
    releaseDate: PropTypes.instanceOf(Date),
    genres: PropTypes.arrayOf(PropTypes.node),
    overview: PropTypes.string,
    voteAverage: PropTypes.number,
  }),
};

export default SearchResults;
