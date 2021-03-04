import React, { Component } from 'react';
import { PropTypes}  from 'prop-types';
import { Row } from 'antd';
import { debounce } from 'lodash';
import MovieCard from '../MovieCard';
import { renderLoad, renderError, renderInfo, renderPager, ratedMessage } from '../../subrenders';
import { appTabs } from '../../helpers';
import TMDBService from '../../services/TMDBService';
import { GenresConsumer } from '../../genres-context';


class SearchResults extends Component {
  state = {
    onBoarding: true,
    isLoading: false,
    error: false,
    founded: 0,
    movies: [],
    page: 1,
  };

  componentDidMount() {
    const { tab, mdb } = this.props;
    this.mdb = mdb;
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

  handleRefresh = () => {
    console.log('refresh');
    const { page } = this.state;
    this.handleSearch(page);
  }

  handleError = (err) => {
    this.setState({
      isLoading: false,
      error: err.rated,
      founded: 0,
    });
  };

  handleShowRated = () => {
    const { rated } = this.props;
    if (rated.total > 0) {
      this.setState({
        onBoarding: false,
      });
    } else {
      this.setState({
        onBoarding: true,
      });
    }
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
    const { onRate } = this.props;
    return onRate(id, rateValue);
  };

  handleUnrate = (id) => {
    const { onUnrate } = this.props;
    return onUnrate(id);
  };

  render() {
    const { tab, rated } = this.props;
    const { movies, isLoading, founded, error, page, onBoarding } = this.state;

    const infoMsg = renderInfo(onBoarding, tab);
    const errorMsg = tab === appTabs.Search ? renderError(error) : renderInfo(error, appTabs.Rated);
    const pagerBox = founded > 0 && tab === appTabs.Search && renderPager(page, founded, this.handleSearch);
    const ratedUndo = tab === appTabs.Rated && rated.total > 0 && ratedMessage();

    const moviesBox = !error && !isLoading && !onBoarding && (
      <GenresConsumer>
        {(genres) => {
          const moviesData = tab === appTabs.Search ? movies : rated.items;
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

SearchResults.defaultProps = {
  query: '',
  tab: '1',
  onUnrate: () => {},
};

SearchResults.propTypes = {
  query: PropTypes.string,
  mdb: PropTypes.instanceOf(TMDBService).isRequired,
  tab: PropTypes.string,
  onRate: PropTypes.func.isRequired,
  onUnrate: PropTypes.func,
  rated: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.object),
    total: PropTypes.number
  }).isRequired
};

export default SearchResults;
