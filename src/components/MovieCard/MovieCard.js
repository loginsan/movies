import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Card, Col, Rate } from 'antd';
import { isValid, format } from 'date-fns';
import { truncate, rateClass } from '../../helpers';
import { GenresConsumer } from '../../genres-context';
import './MovieCard.css';


export default class MovieCard extends Component {
  
  imgRef = React.createRef();
  
  componentDidMount() {
    this.loadPoster();
  }

  loadPoster = () => {
    const { movie } = this.props;
    const src = this.getImgPath(movie.poster_path || movie.backdrop_path);
    const buffer = document.createElement('img');
    buffer.onload = () => {
      this.imgRef.current.src = src;
    };
    buffer.src = src;
  }

  getGenreList = (genreIds, names) =>
    genreIds.map((gid) => {
      const key = `g${gid}`;
      const gobj = names.find((elem) => elem.id === gid);
      return <li key={key}>{gobj && gobj.name}</li>;
    });

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
      genreIds: [...new Set(data.genre_ids)],
      poster: this.getImgPath(data.poster_path || data.backdrop_path),
      release: isValid(rDate) ? rDate : new Date(),
      vote: data.vote_average,
      rating: data.rating ? data.rating : 0,
    };
  };

  rateMovie = (id, value) => {
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
    const { id, title, overview, genreIds, release, vote, rating, lang } = this.readData(movie);
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
          <img className="movie--poster" ref={this.imgRef} alt={title} title={`${id}: ${title}`} src='./noposter.svg' />
          <h5 className="movie--title" title={title}>
            {title}
          </h5>
          <time className="movie--date" dateTime={release}>
            {format(release, 'LLLL d, yyy')} {`(${lang})`}
          </time>
          <ul className="movie--genres">
            <GenresConsumer>{(genres) => this.getGenreList(genreIds, genres)}</GenresConsumer>
          </ul>
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
              onChange={(value) => this.rateMovie(id, value)}
            />
          </div>
        </Card>
      </Col>
    );
  }
}

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
  }).isRequired,
  onRate: PropTypes.func.isRequired,
  onUnrate: PropTypes.func.isRequired,
};
