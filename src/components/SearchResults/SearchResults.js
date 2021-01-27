import React, { Component } from 'react';
import { Card, Col, Row } from 'antd';
import { format } from 'date-fns';
import TMDBService from '../../services/TMDBService';


class SearchResults extends Component {
  state = {
    movies: [],
    genres: [],
  };

  componentDidMount() {
    const mdb = new TMDBService();
    mdb
      .getMovies('future')
      .then((body) => Array.from(body.results))
      .then((list) => {
        this.setState({
          movies: list,
        });
      });
    mdb.getGenresList().then((res) => {
      this.setState({
        genres: res.genres,
      });
    });
  }

  nameGenre = (id) => {
    const { genres } = this.state;
    const gobj = genres.find((elem) => elem.id === id);
    return gobj ? gobj.name : '';
  }

  buildImg = (pp, bp) => {
    const noposter =
      'https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg';
    return pp || bp ? `https://image.tmdb.org/t/p/w185${pp || bp}` : noposter;
  }

  buildCard = (data) => {
    const parsed = {
      backdropPath: data.backdrop_path,
      genres: data.genre_ids.map((elem) => <li key={`g${data.id}-${elem}`}>{this.nameGenre(elem)}</li>),
      id: data.id,
      originalLanguage: data.original_language,
      originalTitle: data.original_title,
      overview: data.overview,
      popularity: data.popularity,
      posterPath: data.poster_path,
      releaseDate: format(new Date(data.release_date), 'LLLL d, yyy'),
      title: data.title,
      video: data.video,
      voteAverage: data.vote_average,
      voteCount: data.vote_count,
    };

    return (
      <Col span={12} xs={24} sm={12} lg={12} xl={12} key={`m${parsed.id}`}>
        <Card title="" bordered={false} className="movie-card">
          <img
            className="movie--poster"
            alt={parsed.title}
            title={`${parsed.posterPath} __ ${parsed.backdropPath}`}
            src={this.buildImg(parsed.posterPath, parsed.backdropPath)}
          />
          <h5 className="movie--title" title={parsed.title}>
            {parsed.title}
          </h5>
          <span className="movie--release-date">{parsed.releaseDate}</span>
          <ul className="movie--genres">{parsed.genres}</ul>
          <div className="movie--overview" title={parsed.overview}>
            <p>{parsed.overview}</p>
          </div>
          <div className="movie--vote-average" title={parsed.id}>
            {parsed.voteAverage}
          </div>
        </Card>
      </Col>
    );
  };

  render() {
    const { movies } = this.state;
    return (
      <Row gutter={[36, 36]} justify="space-around" className="movies-list">
        {movies.map((elem) => this.buildCard(elem))}
      </Row>
    );
  }
}

export default SearchResults;