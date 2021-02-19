import React, {Component} from 'react';
import { Tabs, Alert, Spin } from 'antd';
import SearchResults from '../SearchResults';
import SearchField from '../SearchField';
import 'antd/dist/antd.css';
import './App.css';
import TMDBService from '../../services/TMDBService';
import { GenresProvider } from '../genres-context';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 1,
      error: false,
      loading: true,
      genres: [],
      guestSessionId: null,
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
      const gsId = await this.mdb.getGuestSession();
      const ratedFilms = await this.mdb.getRatedMovies(gsId);
      this.setState({
        error: false,
        loading: false,
        genres,
        guestSessionId: gsId,
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
    this.setState = {
      activeTab: key,
    };
  };

  handleRate = async (id, rateValue) => {
    const res = await this.mdb.setMovieRate(id, rateValue);
    const ratedFilms = await this.mdb.getRatedMovies(this.mdb.guestSessionId);
    console.log(`rate: value ${rateValue}, status ${res.message}`);
    this.setState({
      rated: ratedFilms,
    });
  };

  renderError = (msg) => (
    <Alert className="alert-box" message="Что-то пошло не так…" description={msg} type="error" showIcon />
  );

  renderLoad = (tip = 'Загружаем…') => <Spin size="large" tip={tip} />;

  renderInfo = (title, info) => <Alert className="alert-box" message={title} description={info} type="info" showIcon />;

  render() {
    const { TabPane } = Tabs;
    const { activeTab, error, loading, genres, guestSessionId, rated, query } = this.state;

    const errorMsg = error ? this.renderError(error) : null;
    const loadingMsg = loading ? this.renderLoad('Стартуем приложение, загружаем данные…') : null;

    const searchResults =
      error || loading ? null : (
        <section className="search-results--wrap">
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
        </section>
      );

    // const ratedResults = error ? null : (
    //  <section className="search-results--wrap">
    //    <SearchResults query={query} mdb={this.mdb} tab={2} />
    //  </section>
    // );
    // <SearchResults query={query} mdb={this.mdb} tab={1} />

    return (
      <GenresProvider value={{ genres, guestSessionId }}>
        <div className="App">
          {errorMsg}
          {loadingMsg}
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
