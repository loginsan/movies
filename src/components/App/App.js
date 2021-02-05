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
    founded: 0,
    totalPages: 0,
    genres: [],
    movies: [],
  };

  mdb = new TMDBService();

  constructor() {
    super();

    this.handleSearch = debounce(this.handleSearchFunc, 300);
  }

  componentDidMount() {
    this.mdb
      .getGenresList()
      .then((res) => res.genres)
      .then((genres) => {
        this.setState({
          genres,
        });
      })
      .catch(this.handleError);
    this.handleSearch('return');
  }

  handleChangeSearchText = (event) => {
    this.handleSearch( event.target.value );
  };

  handleSearchFunc = (byWords) => {
    if (byWords.length < 2) return;
    this.setState({
      isLoading: true,
    });
    this.mdb
      .getMovies(byWords)
      .then((res) => ({ movies: Array.from(res.results), founded: res.total_results, pages: res.total_pages }))
      .then(({ movies, founded, pages }) => {

        if (founded === 0) {
          this.setState({
            isLoading: false,
            founded: 0,
            totalPages: 0,
            error: `Не найдено фильмов по фразе '${byWords}'`,
          });
        } else {
          this.setState({
            isLoading: false,
            founded,
            totalPages: pages,
            error: false,
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
    });
  };

  render() {
    const { TabPane } = Tabs;
    const { activeTab, isLoading, founded, totalPages, error, genres, movies } = this.state;

    return (
      <div className="App">
        <Tabs defaultActiveKey="1" onChange={callback} className="Tabs">
          <TabPane tab="Search" key="1">
            <SearchField onChange={this.handleChangeSearchText} />
            <section className="search-results--wrap">
              <SearchResults items={movies} genres={genres} error={error} isLoading={isLoading} founded={founded} pages={totalPages} />
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
