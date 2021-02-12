import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Card, Col, Rate } from 'antd';
import { isValid, format } from 'date-fns';
import { truncate, rateClass } from '../../services/helpers';
import './MovieCard.css';


class MovieCard extends Component {
  state = {
    rate: 0,
  };

  componentDidMount() {
    const { movie } = this.props;
    const rateValue = this.getRateFromStorage(movie.id);
    // if (rateValue !== 0) console.log(rateValue, typeof rateValue);
    if (rateValue !== 0) {
      this.setState({ rate: rateValue });
    }
  }

  saveRateToStorage = (id, value) => {
    localStorage.setItem(`movie${id}-rate`, value);
  };

  getRateFromStorage = (id) => {
    const movieRate = localStorage.getItem(`movie${id}-rate`);
    return parseFloat(movieRate) || 0;
  };

  nameGenre = (id) => {
    const { genres } = this.props;
    const gobj = genres.find((elem) => elem.id === id);
    return gobj ? gobj.name : '';
  };

  buildImg = (pp, bp) => {
    const noposter = './noposter.svg';
    return pp || bp ? `https://image.tmdb.org/t/p/w185${pp || bp}` : noposter;
  };

  buildCard = (data) => ({
    id: data.id,
    title: data.title,
    originalTitle: data.original_title,
    overview: data.overview,
    genres: data.genre_ids.map((elem) => <li key={`g${data.id}-${elem}`}>{this.nameGenre(elem)}</li>),
    posterSrc: this.buildImg(data.poster_path, data.backdrop_path),
    releaseDate: isValid(new Date(data.release_date)) ? new Date(data.release_date) : new Date(),
    voteAverage: data.vote_average,
  });

  handleRateChange = (id, value) => {
    const { onRate } = this.props;
    this.setState({ rate: value });
    this.saveRateToStorage(id, value);
    onRate(id, value);
  };

  render() {
    const { movie } = this.props;
    const { rate } = this.state;
    const { id, title, originalTitle, overview, genres, posterSrc, releaseDate, voteAverage } = this.buildCard(movie);
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
          <div className={`movie--vote-average ${rateClass(voteAverage)}`} title={id}>
            {voteAverage}
          </div>
          <div className="movie--rate">
            <Rate count="10" allowHalf value={rate} onChange={(value) => this.handleRateChange(id, value)} />
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
    posterSrc: './noposter.svg',
    releaseDate: new Date(),
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
    posterSrc: PropTypes.string,
    releaseDate: PropTypes.instanceOf(Date),
    genres: PropTypes.arrayOf(PropTypes.node),
    overview: PropTypes.string,
    voteAverage: PropTypes.number,
  }),
  genres: PropTypes.arrayOf(PropTypes.object),
  onRate: PropTypes.func.isRequired,
};

export default MovieCard;
