import React, { Component } from 'react';
import { PropTypes}  from 'prop-types';
import { Row } from 'antd';
import { debounce } from 'lodash';
import { renderLoad, renderError, renderInfo, renderPager } from '../../subrenders';
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
    page: 1,
  };

  componentDidMount() {
    const { mdb } = this.props;
    this.mdb = mdb;
    this.handleSearch = debounce(this.handleSearchFunc, 200);
    this.handleShowRated();
  }

  componentDidUpdate(prevProps) {
    const { query, rated } = this.props;
    if (prevProps.query !== query) {
      this.handleSearch(1);
    }
    if (prevProps.rated !== rated) {
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
    const { rated } = this.props;
    if (rated.total > 0) {
      this.setState({
        onBoarding: false,
      })
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


  handleRate = async (id, rateValue) => {
    const { onRate } = this.props;
    onRate(id, rateValue);
  };

  render() {
    const { tab, rated } = this.props;
    const { movies, isLoading, founded, error, page, onBoarding } = this.state;

    const infoMsg = renderInfo(onBoarding, tab);
    const errorMsg = tab === 1? renderError(error) : renderInfo(error, 2);
    const pagerBox = founded && tab === 1 ? renderPager(page, founded, this.handleSearch) : null;

    const moviesBox =
      !error && !isLoading && !onBoarding
        ? (
            <GenresConsumer>
            {
              (genres) => {
                const moviesData = tab === 1? movies : rated.items;
                return moviesData.map((elem) => <MovieCard key={`mc${elem.id}`} movie={elem} genres={genres} onRate={this.handleRate} />);
              }
            }
            </GenresConsumer>
          )
        : null;

    return (
      <>
        {infoMsg}
        { renderLoad(isLoading) }
        { errorMsg }
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
  onRate: PropTypes.func.isRequired,
  rated: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.object),
    total: PropTypes.number
  }).isRequired
};

export default SearchResults;
