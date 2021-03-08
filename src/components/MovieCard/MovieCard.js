import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Card, Col, Rate } from 'antd';
import { isValid, format } from 'date-fns';
import { truncate, rateClass } from '../../helpers';
import './MovieCard.css';


export default class MovieCard extends Component {

  getGenreList = (id, genreIds) => {
    const { genres } = this.props;
    const uGenresIds = [...new Set(genreIds)];
    return uGenresIds.map((gid) => {
      const key = `g${id}-${gid}`;
      const gobj = genres.find((elem) => elem.id === gid);
      return <li key={key}>{gobj && gobj.name}</li>;
    });
  };

  getImgPath = (img) => {
    const nop = './noposter.svg';
    return img ? `${process.env.REACT_APP_IMG_SRC}${img}` : nop;
  };

  readData = (data) => {
    const rDate = new Date(data.release_date);
    return {
      id: data.id,
      title: data.title,
      lang: data.original_language,
      overview: data.overview,
      genres: this.getGenreList(data.id, data.genre_ids),
      poster: this.getImgPath(data.poster_path || data.backdrop_path),
      release: isValid(rDate) ? rDate : new Date(),
      vote: data.vote_average,
      rating: data.rating ? data.rating : 0,
    };
  };

  changeRate = (id, value) => {
    const { onRate } = this.props;
    onRate(id, value);
  };

  deleteRate = (id, rating) => {
    const { onUnrate } = this.props;
    if (rating > 0) {
      onUnrate(id);
    }
  };

  render() {
    const { movie } = this.props;
    const { id, title, overview, genres, poster, release, vote, rating, lang } = this.readData(movie);
    return (
      <Col span={12} xs={24} sm={12} lg={12} xl={12}>
        <Card
          title=""
          bordered={false}
          className="movie"
          onClick={() => {
            this.deleteRate(id, rating);
          }}
        >
          <img className="movie--poster" alt={title} title={`${id}: ${title}`} src={poster} />
          <h5 className="movie--title" title={title}>
            {title}
          </h5>
          <time className="movie--date" dateTime={release}>
            {format(release, 'LLLL d, yyy')} {`(${lang})`}
          </time>
          <ul className="movie--genres">{genres}</ul>
          <article className="movie--overview" title={overview}>
            <p>{truncate.call(overview, 150)}</p>
          </article>
          <div className={`movie--vote ${rateClass(vote)}`}>{vote}</div>
          <div className="movie--rate">
            <Rate
              count="10"
              allowHalf
              value={rating}
              disabled={rating}
              onChange={(value) => this.changeRate(id, value)}
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
    original_language: '',
    poster_path: '',
    backdrop_path: '',
    release_date: new Date(),
    genre_ids: [<li key="g0-0">noname</li>],
    overview: 'Some overview text here',
    vote_average: 0,
    rating: 0,
  },
  genres: [],
};

MovieCard.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    original_language: PropTypes.string,
    poster_path: PropTypes.string,
    backdrop_path: PropTypes.string,
    release_date: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
    genre_ids: PropTypes.arrayOf(PropTypes.node),
    overview: PropTypes.string,
    vote_average: PropTypes.number,
    rating: PropTypes.number,
  }),
  genres: PropTypes.arrayOf(PropTypes.object),
  onRate: PropTypes.func.isRequired,
  onUnrate: PropTypes.func.isRequired,
};
