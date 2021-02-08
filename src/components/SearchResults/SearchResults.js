import React, { Component } from 'react';
import { PropTypes}  from 'prop-types';
import { Row, Spin, Alert, Pagination } from 'antd';
import { isValid } from 'date-fns';
import MovieCard from '../MovieCard';
import { debounce } from '../../services/helpers';
import TMDBService from '../../services/TMDBService';


class SearchResults extends Component {
  state = {
    isLoading: false,
    errorSearch: false,
    founded: 0,
    movies: [],
    page: 1,
    onboard: true,
  };

  mdb = new TMDBService();

  componentDidMount() {
    this.handleSearch = debounce(this.handleSearchFunc, 200);
    // this.setState({query: 'return'});
  }

  componentDidUpdate(prevProps) {
    const { query } = this.props;
    if (prevProps.query !== query) {
      this.handleSearch(1);
    }
  }

  handleSearchFunc = (pageNum) => {
    const { query } = this.props;
    if (query.length < 2) {
      this.setState({
        isLoading: false,
        errorSearch: false,
        onboard: true,
      });
      return;
    }
    this.setState({
      isLoading: true,
      errorSearch: false,
      onboard: false,
      page: pageNum,
    });
    this.mdb
      .getMoviesPage(query, pageNum)
      .then((res) => ({ movies: Array.from(res.results), founded: res.total_results }))
      .then(({ movies, founded }) => {
        if (founded === 0) {
          this.setState({
            isLoading: false,
            founded: 0,
            errorSearch: `Не найдено фильмов по фразе '${query}'`,
            page: 1,
          });
        } else {
          this.setState({
            isLoading: false,
            founded,
            errorSearch: false,
            movies,
          });
        }
      })
      .catch(this.handleError);
  };

  handleError = (err) => {
    this.setState({
      isLoading: false,
      onboard: false,
      errorSearch: err.message,
    });
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

  buildCard = (data) => {
    const movie = {
      backdropPath: data.backdrop_path,
      genres: data.genre_ids.map((elem) => <li key={`g${data.id}-${elem}`}>{this.nameGenre(elem)}</li>),
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

  handlePageChange = (pageNum) => {
    this.handleSearch(pageNum);
  };

  render() {
    const { error } = this.props;
    const { movies, isLoading, founded, errorSearch, page, onboard } = this.state;
    const onboardBox = onboard? (
      <Alert className="alert-box" message="Movies App"
        description="Приложение ищет фильмы по запросу. Поисковый запрос должен содержать как минимум 2 символа."
        type="info" showIcon
      />
    ) : null;
    const errorBox =
      error || errorSearch ? (
        <Alert className="alert-box" message="Error" description={error || errorSearch} type="error" showIcon />
      ) : null;
    const loadBox = isLoading ? <Spin size="large" tip="Loading..." /> : null;
    const moviesBox = !error && !errorSearch && !isLoading && !onboard? movies.map((elem) => this.buildCard(elem)) : null;

    const pagination = founded ? (
      <Pagination
        onChange={this.handlePageChange}
        defaultCurrent={1}
        current={page}
        defaultPageSize={20}
        showTitle={false}
        showSizeChanger={false}
        total={founded}
        showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
        hideOnSinglePage
      />
    ) : null;

    return (
      <>
        <Row gutter={[36, 36]} justify="space-around" className="movies-list">
          {onboardBox}
          {loadBox}
          {errorBox}
          {moviesBox}
        </Row>
        {pagination}
      </>
    );
  }
}

SearchResults.defaultProps = {
  genres: [],
  error: false,
  query: '',
};

SearchResults.propTypes = {
  genres: PropTypes.arrayOf(PropTypes.object),
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  query: PropTypes.string,
};



export default SearchResults;
