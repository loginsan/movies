import React, {Component} from 'react';
import { Tabs } from 'antd';
import SearchResults from '../SearchResults';
import SearchField from '../SearchField';
import 'antd/dist/antd.css';
import './App.css';
import TMDBService from '../../services/TMDBService';


function callback(key) {
  console.log(key);
}

function debounce(fn, delay) {
  let inDebounce;
  return function(...args) {
    const context = this;
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => fn.apply(context, args), delay);
  };
}

class App extends Component {
  state = {
    activeTab: 'Search',
    isLoading: true,
    error: false,
    searchValue: '',
    founded: 0,
    genres: [],
    movies: [],
  };

  constructor() {
    super();
    this.mdb = new TMDBService();
    this.mdb
      .getGenresList()
      .then((res) => res.genres)
      .then((genres) => {
        this.setState({
          genres,
        });
      })
      .catch(this.handleError);
    this.handleSearch = debounce(this.handleSearchFunc, 100);
  }

  componentDidMount() {
    this.handleSearch('return');
  }

  handleChangeSearchText = (event) => {
    this.handleSearch( event.target.value );
  };

  handleSearchFunc = (byWords) => {
    this.mdb
      .getMovies(byWords)
      .then((res) => ({ movies: Array.from(res.results), founded: res.total_results }))
      .then(({ movies, founded }) => {
        this.setState({
          isLoading: false,
          searchValue: byWords,
          movies,
          founded,
        });
      })
      .catch(this.handleError);
  };

  handleError = (err) => {
    this.setState({
      isLoading: false,
      error: err.message,
    });
  };

  render() {
    const { TabPane } = Tabs;
    const { activeTab, isLoading, founded, error, searchValue, genres, movies } = this.state;

    return (
      <div className="App" title={founded}>
        <Tabs defaultActiveKey="1" onChange={callback} className="Tabs">
          <TabPane tab="Search" key="1">
            <SearchField onChange={this.handleChangeSearchText} value={searchValue} />
            <section className="search-results--wrap">
              <SearchResults items={movies} genres={genres} error={error} isLoading={isLoading} />
            </section>
          </TabPane>
          <TabPane tab="Rated" key="2">
            Rated Pane (2) {activeTab === 'Search' ? null : '(active)'}
          </TabPane>
        </Tabs>

        <p className="attribution">
          About Movies App: &quot;This product uses the <a href="https://www.themoviedb.org/">TMDb</a> API but is not
          endorsed or certified by TMDb.&quot;
        </p>
      </div>
    );
  }
}

export default App;
