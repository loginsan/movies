import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Card, Col, Rate } from 'antd';
import { isValid, format } from 'date-fns';
import { truncate, rateClass } from '../../helpers';
import './MovieCard.css';


class MovieCard extends Component {
  state = {
    rate: 0,
  };

  nameGenre = (id) => {
    const { genres } = this.props;
    const gobj = genres.find((elem) => elem.id === id);
    return gobj ? gobj.name : '';
  };

  buildImg = (img) => {
    const nop = './noposter.svg';
    return img ? `https://image.tmdb.org/t/p/w185${img}` : nop;
  };

  buildCard = (data) => ({
    id: data.id,
    title: data.title,
    originalTitle: data.original_title,
    lang: data.original_language,
    overview: data.overview,
    genres: data.genre_ids.map((elem) => <li key={`g${data.id}-${elem}`}>{this.nameGenre(elem)}</li>),
    poster: this.buildImg(data.poster_path || data.backdrop_path),
    release: isValid(new Date(data.release_date)) ? new Date(data.release_date) : new Date(),
    voteAverage: data.vote_average,
    rating: data.rating ? data.rating : 0,
    adult: data.adult,
  });

  handleRateChange = (id, value) => {
    const { onRate } = this.props;
    const success = onRate(id, value);
    if (success) {
      this.setState(() => ({ rate: value }));
    }
  };

  handleUnrate = (id, rating) => {
    const { onUnrate } = this.props;
    if (rating > 0) {
      onUnrate(id);
    }
  };

  render() {
    const { movie } = this.props;
    const { rate } = this.state;
    const { id, title, originalTitle, overview, genres, poster, release, voteAverage, rating, lang, adult } = this.buildCard(movie);
    return (
      <Col span={12} xs={24} sm={12} lg={12} xl={12}>
        <Card
          title=""
          bordered={false}
          className="movie"
          onClick={() => {
            this.handleUnrate(id, rating);
          }}
        >
          <img className="movie--poster" alt={title} title={`${id}: ${originalTitle}`} src={poster} />
          <h5 className="movie--title" title={title}>
            {title}
          </h5>
          <time className="movie--release-date" dateTime={release}>
            {format(release, 'LLLL d, yyy')} {`(${lang})`}
          </time>
          <ul className="movie--genres">{genres}</ul>
          <article className="movie--overview" title={overview}>
            <p>{truncate.call(overview, 150)}</p>
          </article>
          <div
            className={`movie--vote-average ${rateClass(voteAverage)}`}
            title={adult ? 'for adults' : 'for everyone'}
          >
            {voteAverage}
          </div>
          <div className="movie--rate">
            <Rate
              count="10"
              allowHalf
              value={rating || rate}
              disabled={rating || rate}
              onChange={(value) => this.handleRateChange(id, value)}
            />
          </div>
        </Card>
      </Col>
    );
  }
};

MovieCard.defaultProps = {
  movie: {
    id: 0,
    title: 'Working Title',
    originalTitle: 'Working Title',
    poster: './noposter.svg',
    release: new Date(),
    genres: [<li key="g0-0">noname</li>],
    overview: 'Some movie overview text here',
    voteAverage: 0,
  },
  genres: [],
};

MovieCard.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    originalTitle: PropTypes.string,
    poster: PropTypes.string,
    release: PropTypes.instanceOf(Date),
    genres: PropTypes.arrayOf(PropTypes.node),
    overview: PropTypes.string,
    voteAverage: PropTypes.number,
  }),
  genres: PropTypes.arrayOf(PropTypes.object),
  onRate: PropTypes.func.isRequired,
  onUnrate: PropTypes.func.isRequired,
};

export default MovieCard;
