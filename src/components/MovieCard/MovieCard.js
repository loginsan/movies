import React from 'react';
import { PropTypes } from 'prop-types';
import { Card, Col, Rate } from 'antd';
import { format } from 'date-fns';
import { truncate, rateClass } from '../../services/helpers';
import './MovieCard.css';


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
        <div className={`movie--vote-average ${rateClass(voteAverage)}`} title={id}>
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
    genres: [<li key="g0-0">noname</li>],
    overview: 'Some text here',
    voteAverage: 2.5,
  },
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

export default MovieCard;