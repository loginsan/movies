import React, {Component} from 'react';
import { Tabs } from 'antd';
import SearchResults from '../SearchResults';
import SearchField from '../SearchField';
import { renderLoad, renderError } from '../../subrenders';
import TMDBService from '../../services/TMDBService';
import { GenresProvider } from '../genres-context';
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
      // guestSessionId: null,
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
      const genres = await this.mdb.getGenresList();
      const session = await this.mdb.getGuestSession();
      const ratedFilms = await this.mdb.getRatedMovies(session.id);
      this.setState({
        error: false,
        loading: false,
        genres,
        // guestSessionId: session.id,
        rated: ratedFilms,
      });
    } catch (err) {
      this.setState({
        error: err.message,
        loading: false,
      });
    }
  };

  handleQueryChange = (event) => {
    this.setState({ query: event.target.value });
  };

  handleTabChange = (key) => {
    this.setState({ activeTab: key });
  };

  handleRate = async (id, rateValue) => {
    const res = await this.mdb.setMovieRate(id, rateValue);
    const ratedFilms = await this.mdb.getRatedMovies(this.mdb.guestSessionId);
    console.log(`rate: value ${rateValue}, status ${res.message}`);
    this.setState({
      rated: ratedFilms,
    });
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
                <SearchResults query={query} mdb={this.mdb} tab={1} onRate={this.handleRate} rated={rated} />
              </section>
            </TabPane>

            <TabPane tab="Rated" key="2">
              <section className="search-results--wrap">
                <SearchResults query={query} mdb={this.mdb} tab={2} onRate={this.handleRate} rated={rated} />
              </section>
            </TabPane>
          </Tabs>
        </div>
      );

    return (
      <GenresProvider value={genres}>
        <div className="App">
          { renderError(error) }
          { renderLoad(loading, 'Стартуем приложение, загружаем данные…') }
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
