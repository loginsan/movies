import React, {Component} from 'react';
import { Tabs, Input } from 'antd';
import SearchResults from './components/SearchResults';
import 'antd/dist/antd.css';
import './App.css';
import TMDBService from './services/TMDBService';


function callback(key) {
  console.log(key);
}

class App extends Component {
  
  state = {
    activeTab: 'Search',
    genres: [],
    movies: [],
  };

  componentDidMount() {
    const mdb = new TMDBService();

    Promise.all([mdb.getMovies('return'), mdb.getGenresList()])
      .then( ([mres, gres]) => [Array.from(mres.results), gres.genres] )
      .then( ([movies, genres]) => {
        this.setState({
          genres,
          movies,
        });
      });
  }

  render() {
    const { TabPane } = Tabs;
    const { activeTab, genres, movies } = this.state;

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
              <SearchResults genres={genres} items={movies} />
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
