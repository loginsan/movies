import React, { Component } from 'react';
import { PropTypes}  from 'prop-types';
import { Row } from 'antd';
import { debounce } from 'lodash';
import MovieCard from '../MovieCard';
import { renderLoad, renderError, renderInfo, renderPager, ratedMessage } from '../../subrenders';
import { appTabs } from '../../helpers';
import { GenresConsumer } from '../../genres-context';


export default class MovieList extends Component {
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
    if (tab === appTabs.Search) this.handleSearch = debounce(this.handleSearchFunc, 200);
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
      this.setStateInfo();
      return;
    }

    this.setStateLoading(pageNum);
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
  };

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
  };

  handleShowRated = () => {
    const { rated } = this.props;
    if (rated.total > 0) {
      this.setState({ isIdling: false });
    } else {
      this.setState({ isIdling: true });
    }
  };

  setStateLoading = (pageNum = 1) => {
    this.setState({
      isIdling: false,
      isLoading: true,
      error: false,
      founded: 0,
      page: pageNum,
    });
  };

  setStateInfo = () => {
    this.setState({
      isIdling: true,
      isLoading: false,
      error: false,
      founded: 0,
    });
  };

  handleRate = (id, rateValue) => {
    const { onRate } = this.props;
    const { movies } = this.state;
    const movie = movies.find(elem => elem.id === id);
    return onRate(id, movie, rateValue);
  };

  handleUnrate = (id) => {
    const { onUnrate } = this.props;
    return onUnrate(id);
  };


  render() {
    const { tab, rated } = this.props;
    const { movies, isLoading, founded, error, page, isIdling } = this.state;
    const isSearchTab = tab === appTabs.Search;

    const ratings = rated.items.reduce( (acc, cur) => { 
      const { id, rating} = cur; 
      acc[id] = rating;
      return acc
    }, [] );
    const rmovies = movies.map(elem => {
      const { id } = elem;
      const relem = elem;
      relem.rating = ratings[id] ? ratings[id] : 0;
      return relem;
    });

    const infoMsg = renderInfo(isIdling, tab);
    const errorMsg = isSearchTab ? renderError(error) : renderInfo(error, appTabs.Rated);
    const pagerBox = founded > 0 && isSearchTab && renderPager(page, founded, this.handleSearch);
    const ratedUndo = !isSearchTab && rated.total > 0 && ratedMessage();

    const moviesBox = !error && !isLoading && !isIdling && (
      <GenresConsumer>
        {(genres) => {
          const moviesData = isSearchTab ? rmovies : rated.items;
          return moviesData.map((elem) => (
            <MovieCard key={`mc${elem.id}`} movie={elem} genres={genres} onRate={this.handleRate} onUnrate={this.handleUnrate} />
          ));
        }}
      </GenresConsumer>
    );

    return (
      <>
        {infoMsg}
        {renderLoad(isLoading)}
        {errorMsg}
        {ratedUndo}
        <Row gutter={[18, 18]} justify="space-around" className="movies-list">
          {moviesBox}
        </Row>
        {pagerBox}
      </>
    );
  }
}

MovieList.defaultProps = {
  query: '',
  tab: '1',
  onUnrate: () => {},
  onUpdate: () => {},
};

MovieList.propTypes = {
  query: PropTypes.string,
  tab: PropTypes.string,
  onUpdate: PropTypes.func,
  onRate: PropTypes.func.isRequired,
  onUnrate: PropTypes.func,
  rated: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.object),
    total: PropTypes.number
  }).isRequired
};
