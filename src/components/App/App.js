import React, {Component} from 'react';
import { Tabs } from 'antd';
import SearchResults from '../SearchResults';
import SearchField from '../SearchField';
import { renderLoad, renderError } from '../../subrenders';
import TMDBService from '../../services/TMDBService';
import { GenresProvider } from '../../genres-context';
import 'antd/dist/antd.css';
import './App.css';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 1,
      error: false,
      loading: true,
      genres: [],
      rated: {},
      query: '',
    };
    this.mdb = new TMDBService();
  }

  componentDidMount() {
    this.initApp();
  }

  initApp = async () => {
    try {
      const genres = await this.initGenres();
      const session = await this.initSession();
      const ratedFilms = await this.initRated(session.id);
      // console.log(this.mdb.guestSessionId, session.id);
      this.setState({
        loading: false,
        genres,
        rated: ratedFilms,
      });
    } catch (err) {
      this.setState({
        error: err.message,
        loading: false,
      });
    }
  };

  initGenres = async () => {
    const savedGenres = localStorage.getItem('genres');
    if (savedGenres === null) {
      const genres = await this.mdb.getGenresList();
      localStorage.setItem('genres', JSON.stringify(genres));
      return genres;
    }
    return JSON.parse(savedGenres);
  };

  initSession = async () => {
    // const savedSession = localStorage.getItem('session');
    // if (savedSession !== null) {
    //   const session = JSON.parse(savedSession);
    //   if (new Date(session.expires) > Date.now()) {
    //     this.mdb.guestSessionId = session.id;
    //     return session;
    //   }
    // }
    const newSession = await this.mdb.getGuestSession();
    // localStorage.setItem('session', JSON.stringify(newSession));
    return newSession;
  };

  initRated = async (gsId) => {
    // const savedRated = localStorage.getItem('rated');
    // if (savedRated !== null) {
    //   const rated = JSON.parse(savedRated);
    //   if (rated.owner === gsId) {
    //     return rated;
    //   }
    // }
    const newRated = await this.mdb.getRatedMovies(gsId);
    // localStorage.setItem('rated', JSON.stringify(newRated));
    return newRated;
  };

  handleQueryChange = (event) => {
    this.setState({ query: event.target.value });
  };

  handleTabChange = async (key) => {
    // console.log(key, typeof key);
    this.setState({ activeTab: key });
    if (key === "2") {
      const rated = await this.mdb.getRatedMovies(this.mdb.guestSessionId);
      // localStorage.setItem('rated', JSON.stringify(rated));
      // console.log(`rated total: ${rated.total}, owner: ${rated.owner}`);
      this.setState({ rated });
    }
  };

  handleRate = async (id, rateValue) => {
    // console.log(this.mdb.guestSessionId);
    const res = await this.mdb.setMovieRate(id, rateValue);
    // console.log(`handleRate: ${res.code}`);
    return (res.code === 1);
  };

  render() {
    const { TabPane } = Tabs;
    const { activeTab, error, loading, genres, rated, query } = this.state;

    const searchResults =
      error || loading ? null : (
        <div className="tabs-wrap">
          <Tabs defaultActiveKey="1" onChange={this.handleTabChange} className="Tabs">
            <TabPane tab="Search" key="1">
              <SearchField onChange={this.handleQueryChange} query={query} />
              <section className="search-results--wrap">
                <SearchResults tab={1} query={query} mdb={this.mdb} onRate={this.handleRate} rated={rated} />
              </section>
            </TabPane>

            <TabPane tab="Rated" key="2">
              <section className="search-results--wrap">
                <SearchResults tab={2} query={query} mdb={this.mdb} onRate={this.handleRate} rated={rated} />
              </section>
            </TabPane>
          </Tabs>
        </div>
      );

    return (
      <GenresProvider value={genres}>
        <div className="App">
          {renderError(error)}
          {renderLoad(loading, 'Стартуем приложение, загружаем данные…')}
          {searchResults}

          <p className="attribution" title={activeTab}>
            About Movies App: &quot;This product uses the <a href="https://www.themoviedb.org/">TMDb</a> API but is not
            endorsed or certified by TMDb.&quot;
          </p>
        </div>
      </GenresProvider>
    );
  }
}

export default App;
