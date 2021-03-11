import React, { PureComponent } from 'react';
import { PropTypes}  from 'prop-types';
import { Row } from 'antd';
import { debounce } from 'lodash';
import MovieCard from '../MovieCard';
import { renderLoad, renderError, renderInfo, renderPager, ratedMessage } from '../../subrenders';
import { appTabs, reduceRated, mapMoviesRating } from '../../helpers';


export default class MovieList extends PureComponent {
  state = {
    isIdling: true,
    isLoading: false,
    error: false,
    founded: 0,
    movies: [],
    page: 1,
  };

  componentDidMount() {
    const { tab } = this.props;
    if (tab === appTabs.Search) this.handleSearch = debounce(this.handleSearchFunc, 350);
    if (tab === appTabs.Rated) this.handleShowRated();
  }

  componentDidUpdate(prevProps) {
    const { tab, query, rated } = this.props;
    if (tab === appTabs.Search && prevProps.query !== query) {
      this.handleSearch(1);
    }
    if (tab === appTabs.Rated && prevProps.rated !== rated) {
      this.handleShowRated();
    }
  }

  handleSearchFunc = (pageNum) => {
    const { query, onUpdate } = this.props;
    if (query.length < 2) {
      this.setState({
        isIdling: true,
        isLoading: false,
        error: false,
        founded: 0,
      });
      return false;
    }

    this.setState({
      isIdling: false,
      isLoading: true,
      error: false,
      founded: 0,
      page: pageNum,
    });
    onUpdate(query, pageNum)
      .then((res) => ({ movies: res.results, founded: res.total_results }))
      .then(({ movies, founded }) => {
        const searchState = { isLoading: false, founded };
        if (founded === 0) {
          searchState.error = `Не найдено фильмов по фразе '${query}'`;
          searchState.page = 1;
        } else {
          searchState.movies = movies;
        }
        this.setState(searchState);
      })
      .catch(this.handleError);
    return true;
  }

  handleRefresh = (id) => {
    const { movies } = this.state;
    const movie = movies.find(elem => elem.id === id);
    if (movie) {
      movie.rating = 0;
      this.setState({
        movies: movies.map(elem => elem.id === id? movie : elem)
      });
    }
  }

  handleError = (err) => {
    this.setState({
      isLoading: false,
      error: err.message,
      founded: 0,
    });
  }

  handleShowRated = () => {
    const { rated } = this.props;
    this.setState({ isIdling: !rated.length });
  }

  handleRate = (id, rateValue) => {
    const { onRate } = this.props;
    const { movies } = this.state;
    const movie = movies.find(elem => elem.id === id);
    onRate(id, movie, rateValue);
  }

  handleUnrate = (id) => {
    const { onUnrate } = this.props;
    onUnrate(id);
  }

  render() {
    const { tab, rated } = this.props;
    const { movies, isLoading, founded, error, page, isIdling } = this.state;
    const isSearchTab = tab === appTabs.Search;
    const ratings = reduceRated(rated);
    const rmovies = mapMoviesRating(movies, ratings);

    const errorMsg = isSearchTab ? renderError(error) : renderInfo(error, appTabs.Rated);
    const pagerBox = isSearchTab && renderPager(page, founded, this.handleSearch);
    const ratedUndo = !isSearchTab && rated.length > 0 && ratedMessage();

    const moviesData = isSearchTab ? rmovies : rated;
    const moviesBox = !error && !isLoading && !isIdling && (
      moviesData.map((elem) => (
        <MovieCard key={`mc${elem.id}`} movie={elem} onRate={this.handleRate} onUnrate={this.handleUnrate} />
      ))
    );

    return (
      <section className="results">
        { renderInfo(isIdling, tab) }
        { renderLoad(isLoading) }
        {errorMsg}
        {ratedUndo}
        <Row gutter={[18, 18]} justify="space-around" className="movies-list">
          {moviesBox}
        </Row>
        {pagerBox}
      </section>
    );
  }
}

MovieList.defaultProps = {
  query: '',
  onUpdate: () => {},
  onRate: () => {},
  onUnrate: () => {},
  rated: [],
};

MovieList.propTypes = {
  query: PropTypes.string,
  tab: PropTypes.string.isRequired,
  onUpdate: PropTypes.func,
  onRate: PropTypes.func,
  onUnrate: PropTypes.func,
  rated: PropTypes.arrayOf(PropTypes.object),
};
