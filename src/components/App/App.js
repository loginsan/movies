import React, {Component} from 'react';
import { Tabs } from 'antd';
import SearchResults from '../SearchResults';
import SearchField from '../SearchField';
import { renderLoad, renderError } from '../../subrenders';
import { appTabs } from '../../helpers';
import TMDBService from '../../services/TMDBService';
import { GenresProvider } from '../../genres-context';
import 'antd/dist/antd.css';
import './App.css';


class App extends Component {
  constructor(props) {
    super(props);
    this.searchListRef = React.createRef();
    this.ratedListRef = React.createRef();
    this.state = {
      activeTab: appTabs.Search,
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

  genresMap = (genres) => {
    const map = new Map();
    genres.forEach(elem => { map.set(elem.id, elem.name) });
    return map;
  }

  initGenres = async () => {
    const savedGenres = localStorage.getItem('genres');
    if (savedGenres === null) {
      const genres = await this.mdb.getGenresList();
      localStorage.setItem('genres', JSON.stringify(genres));
      console.log(Array.from(this.genresMap(genres)));
      return genres;
    }
    return JSON.parse(savedGenres);
  };

  initSession = async () => {
    const newSession = await this.mdb.getGuestSession();
    return newSession;
  };

  initRated = async (gsId) => {
    const newRated = await this.mdb.getRatedMovies(gsId);
    return newRated;
  };

  handleQueryChange = (event) => {
    this.setState({ query: event.target.value });
  };

  handleTabChange = async (key) => {
    this.setState({ activeTab: key });
    if (key === appTabs.Rated) {
      const rated = await this.mdb.getRatedMovies(this.mdb.guestSessionId);
      this.setState({ rated });
    }
  };

  handleRate = async (id, rateValue) => {
    const res = await this.mdb.setMovieRate(id, rateValue);
    return (res.code === 1);
  };

  handleUnrate = async (id) => {
    const res = await this.mdb.deleteRating(id);
    if (res.code === 13) {
      this.setState(({ rated }) => ({
        rated: {
          items: rated.items.filter((elem) => elem.id !== id),
          total: rated.total - 1,
        },
      }));
      this.searchListRef.current.handleRefresh();
    }
  };

  render() {
    const { TabPane } = Tabs;
    const { activeTab, error, loading, genres, rated, query } = this.state;

    const searchResults =
      error || loading ? null : (
        <div className="tabs-wrap">
          <Tabs defaultActiveKey={appTabs.Search} onChange={this.handleTabChange} className="Tabs">
            <TabPane tab="Search" key={appTabs.Search}>
              <SearchField onChange={this.handleQueryChange} query={query} />
              <section className="search-results--wrap">
                <SearchResults
                  tab={appTabs.Search}
                  query={query}
                  mdb={this.mdb}
                  onRate={this.handleRate}
                  onUnrate={this.handleUnrate}
                  rated={rated}
                  ref={this.searchListRef}
                />
              </section>
            </TabPane>

            <TabPane tab="Rated" key={appTabs.Rated}>
              <section className="search-results--wrap">
                <SearchResults
                  tab={appTabs.Rated}
                  query={query}
                  mdb={this.mdb}
                  onRate={this.handleRate}
                  onUnrate={this.handleUnrate}
                  rated={rated}
                  ref={this.ratedListRef}
                />
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
