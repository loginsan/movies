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
    error: false,
    founded: 0,
    movies: [],
    rated: [],
    page: 1,
  };

  componentDidMount() {
    const { mdb } = this.props;
    this.mdb = mdb;
    this.handleSearch = debounce(this.handleSearchFunc, 200);
    this.handleShowRated();
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
      this.setStateInfo();
      return;
    }

    this.setStateLoading(pageNum);

    this.mdb
      .getMoviesPage(query, pageNum)
      .then((res) => ({ movies: res.results, founded: res.total_results }))
      .then(({ movies, founded }) => {
        if (founded === 0) {
          this.setState({
            isLoading: false,
            founded: 0,
            error: `Не найдено фильмов по фразе '${query}'`,
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
      error: err.message,
      founded: 0,
    });
  };

  handleShowRated = () => {
    this.setStateLoading();

    this.mdb
      .getRatedMovies()
      .then((res) => ({ rated: res.results, founded: res.total_results }))
      .then(({ rated, founded }) => {
        if (founded === 0) {
          this.setState({
            onBoarding: true,
            isLoading: false,
            error: `Пока у вас нет оценённых фильмов. Бегом на вкладку Search искать и ставить оценки фильмам! ☻`,
          });
        } else {
          this.setState({
            isLoading: false,
            founded,
            rated,
          });
        }
      })
      .catch(this.handleError);
  };

  setStateLoading = (pageNum = 1) => {
    this.setState({
      onBoarding: false,
      isLoading: true,
      error: false,
      founded: 0,
      page: pageNum,
    });
  };

  setStateInfo = () => {
    this.setState({
      onBoarding: true,
      isLoading: false,
      error: false,
      founded: 0,
    });
  };


  handleRate = (id, rateValue) => {
    this.mdb
      .setMovieRate(id, rateValue)
      .then((res) => {
        if (res.status_code === 1) {
          console.log('success rate');
        }
      })
      .catch(this.handleError);
  };



  renderPager = (curPage, totalResults) => (
    <Pagination
      onChange={this.handleSearchFunc}
      current={curPage}
      defaultPageSize={20}
      showTitle={false}
      showSizeChanger={false}
      total={totalResults}
      showTotal={(total, range) => `${range[0]}-${range[1]} из ${total} найденых`}
    />
  );

  renderError = (msg) => (
    <Alert className="alert-box" message="Что-то пошло не так…" description={msg} type="error" showIcon />
  );

  renderLoad = () => <Spin size="large" tip="Загружаем…" />;

  renderInfo = (title, info) => <Alert className="alert-box" message={title} description={info} type="info" showIcon />;

  render() {
    const { tab } = this.props;
    const { movies, rated, isLoading, founded, error, page, onBoarding } = this.state;

    const infoMsg = onBoarding
      ? this.renderInfo(
          tab === 1 ? 'Приложение Movies' : 'Фильмы, которые вы оценили',
          tab === 1
            ? 'Введите что-нибудь в поле ввода и мы попробуем найти подходящие фильмы (минимум 2 символа)'
            : `Пока у вас нет оценённых фильмов. Бегом на вкладку Search искать и ставить оценки фильмам! ☻`
        )
      : null;

    const errorRender = error && tab === 1? this.renderError(error) : this.renderInfo('Фильмы, которые вы оценили', error);
    const errorMsg = error ? errorRender : null;
    const loadMsg = isLoading ? this.renderLoad() : null;
    const pagerBox = founded && tab === 1? this.renderPager(page, founded) : null;

    const moviesData = tab === 1? movies : rated;

    const moviesBox =
      !error && !isLoading && !onBoarding
        ? moviesData.map((elem) => (
            <GenresConsumer key={`gc${elem.id}`}>
              {(genres) => <MovieCard movie={elem} genres={genres} onRate={this.handleRate} />}
            </GenresConsumer>
          ))
        : null;

    return (
      <>
        {infoMsg}
        {loadMsg}
        {errorMsg}
        <Row gutter={[36, 36]} justify="space-around" className="movies-list">
          {moviesBox}
        </Row>
        {pagerBox}
      </>
    );
  }
}

SearchResults.defaultProps = {
  query: '',
  tab: 1,
};

SearchResults.propTypes = {
  query: PropTypes.string,
  mdb: PropTypes.instanceOf(TMDBService).isRequired,
  tab: PropTypes.number,
};

export default SearchResults;
