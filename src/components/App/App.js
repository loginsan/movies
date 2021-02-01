import React, {Component} from 'react';
import { Tabs, Input, Spin, Alert } from 'antd';
import SearchResults from '../SearchResults';
import 'antd/dist/antd.css';
import './App.css';
import TMDBService from '../../services/TMDBService';


function callback(key) {
  console.log(key);
}

class App extends Component {
  
  state = {
    activeTab: 'Search',
    isLoading: true,
    error: false,
    genres: [],
    movies: [],
  };

  componentDidMount() {
    const mdb = new TMDBService();

    Promise.all([mdb.getMovies('return'), mdb.getGenresList()])
      .then(([mres, gres]) => [Array.from(mres.results), gres.genres])
      .then(([movies, genres]) => {
        this.setState({
          isLoading: false,
          genres,
          movies,
        });
      })
      .catch((err) => {
        this.setState({
          isLoading: false,
          error: err.message,
        });
      });
  }

  render() {
    const { TabPane } = Tabs;
    const { activeTab, isLoading, error, genres, movies } = this.state;

    const dataOrNot = error ? (
      <Alert message={`Error: ${error}`} type="error" showIcon />
    ) : (
      <SearchResults genres={genres} items={movies} />
    );
    const moviesBox = isLoading ? (
      <Spin size="large" />
    ) : dataOrNot;

    return (
      <div className="App">
        <p className="attribution">
          About Movies App: &quot;This product uses the <a href="https://www.themoviedb.org/">TMDb</a> API but is not
          endorsed or certified by TMDb.&quot;
        </p>
        <Tabs defaultActiveKey="1" onChange={callback} className="Tabs">
          <TabPane tab="Search" key="1">
            <form className="search-form" action="/">
              <Input placeholder="Type to search…" className="search-field" />
            </form>
            <section className="search-results--wrap">
              { moviesBox }
            </section>
          </TabPane>
          <TabPane tab="Rated" key="2">
            Rated Pane (2) {activeTab === 'Search' ? null : '(active)'}
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default App;
