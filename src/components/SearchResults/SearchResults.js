import React, { Component } from 'react';
import { PropTypes}  from 'prop-types';
import { Row, Spin, Alert, Pagination } from 'antd';
import { debounce } from 'lodash';
import MovieCard from '../MovieCard';
import TMDBService from '../../services/TMDBService';
import { GenresConsumer } from '../genres-context';


class SearchResults extends Component {
  state = {
    onBoarding: true,
    isLoading: false,
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
        onBoarding: true,
        isLoading: false,
        errorSearch: false,
      });
      return;
    }

    this.setState({
      onBoarding: false,
      isLoading: true,
      errorSearch: false,
      page: pageNum,
    });

    this.mdb
      .getMoviesPage(query, pageNum)
      .then((res) => ({ movies: res.results, founded: res.total_results }))
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

  render() {
    const { error } = this.props;
    const { movies, isLoading, founded, errorSearch, page, onBoarding } = this.state;

    const welcomeBox = onBoarding? (
      <Alert className="alert-box" message="Movies App"
        description="Приложение ищет фильмы по запросу. Поисковый запрос должен содержать как минимум 2 символа."
        type="info" showIcon
      />
    ) : null;

    const errorBox = error || errorSearch ? (
      <Alert className="alert-box" message="Error" description={error || errorSearch} type="error" showIcon />
    ) : null;

    const loadBox = isLoading ? <Spin size="large" tip="Loading..." /> : null;

    const moviesBox =
      !error && !errorSearch && !isLoading && !onBoarding
        ? movies.map((elem) => (<GenresConsumer key={`gc${elem.id}`}>
            { (genres) => <MovieCard movie={elem} genres={genres} /> }
          </GenresConsumer>)
        )
        : null;

    const pagination = founded ? (
      <Pagination
        onChange={(pageNum) => { this.handleSearch(pageNum) }}
        current={page}
        defaultPageSize={20}
        showTitle={false}
        showSizeChanger={false}
        total={founded}
        showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
      />
    ) : null;

    return (
      <>
        <Row gutter={[36, 36]} justify="space-around" className="movies-list">
          {welcomeBox}
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
  error: false,
  query: '',
};

SearchResults.propTypes = {
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  query: PropTypes.string,
};

export default SearchResults;
