import React, { Component } from 'react';
import { PropTypes}  from 'prop-types';
import { Row, Spin, Alert, Pagination } from 'antd';
import { isValid } from 'date-fns';
import MovieCard from '../MovieCard';
import { debounce } from '../../services/helpers';
import TMDBService from '../../services/TMDBService';


class SearchResults extends Component {
  state = {
    isLoading: true,
    errorSearch: false,
    founded: 0,
    movies: [],
    page: 1,
  };

  mdb = new TMDBService();

  componentDidMount() {
    this.handleSearch = debounce(this.handleSearchFunc, 200);
    // this.setState({query: 'return'});
  }

  componentDidUpdate(prevProps, prevState) {
    const { query } = this.props;
    const { page } = this.state;
    if (prevProps.query !== query || prevState.page !== page) {
      this.handleSearch();
    }
  }

  handleSearchFunc = () => {
    const { query } = this.props;
    const { page } = this.state;
    if (query.length < 2) return;
    this.setState({
      isLoading: true,
      errorSearch: false,
    });
    this.mdb
      .getMoviesPage(query, page)
      .then((res) => ({ movies: Array.from(res.results), founded: res.total_results }))
      .then(({ movies, founded }) => {
        if (founded === 0) {
          this.setState({
            isLoading: false,
            founded: 0,
            errorSearch: `Не найдено фильмов по фразе '${query}'`,
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
    // const { query } = this.props;
    // const { page } = this.state;
    this.setState({ page: pageNum });
  };

  render() {
    const { error } = this.props;
    const { movies, isLoading, founded, page, errorSearch } = this.state;

    const errorBox =
      error || errorSearch ? (
        <Alert className="alert-box" message="Error" description={error || errorSearch} type="error" showIcon />
      ) : null;
    const loadBox = isLoading ? <Spin size="large" tip="Loading..." /> : null;
    const moviesBox = !error && !errorSearch && !isLoading ? movies.map((elem) => this.buildCard(elem)) : null;

    const pagination = founded ? (
      <Pagination
        onChange={this.handlePageChange}
        defaultCurrent={page}
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
