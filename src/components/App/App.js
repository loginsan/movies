import React, {Component} from 'react';
import { Tabs, Alert } from 'antd';
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
      genres: [],
      query: '',
    };
    this.mdb = new TMDBService();
  }
  
  componentDidMount() {
    this.defineGenres();
    this.defineSession();
  }

  defineGenres = () => {
    this.mdb
      .getGenresList()
      .then((res) => {
        this.setState({ genres: res.genres });
      })
      .catch(this.handleError);
  }

  defineSession = () => {
    this.mdb
      .getGuestSession()
      .then((res) => {
        if (res.success) {
          this.mdb.guestSessionId = res.guest_session_id;
        }
      })
      .catch(this.handleError);
  }

  handleQueryChange = (event) => {
    this.setState({ query: event.target.value });
  };

  handleError = (err) => {
    this.setState({ error: err.message });
  };

  handleTabChange = (key) => {
    this.setState = {
      activeTab: key,
    }
  }

  render() {
    const { TabPane } = Tabs;
    const { activeTab, error, genres, query } = this.state;

    const errorMsg =
      error ? (
        <Alert className="alert-box" message="Что-то пошло не так…" description={error} type="error" showIcon />
      ) : null;
    const searchResults = error ? null : (
      <section className="search-results--wrap">
        <SearchResults query={query} mdb={this.mdb} tab={1} />
      </section>
    );
    const ratedResults = error ? null : (
      <section className="search-results--wrap">
        <SearchResults query={query} mdb={this.mdb} tab={2} />
      </section>
    );

    return (
      <GenresProvider value={genres}>
        <div className="App">
          <Tabs defaultActiveKey="1" onChange={this.handleTabChange} className="Tabs">
            <TabPane tab="Search" key="1">
              <SearchField onChange={this.handleQueryChange} query={query} />
              {errorMsg}
              {searchResults}
            </TabPane>

            <TabPane tab="Rated" key="2">
              {ratedResults}
            </TabPane>
          </Tabs>

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
