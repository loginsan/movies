import React, {Component} from 'react';
import { Tabs } from 'antd';
import SearchResults from '../SearchResults';
import SearchField from '../SearchField';
import 'antd/dist/antd.css';
import './App.css';
import TMDBService from '../../services/TMDBService';
import { callbackTab } from '../../services/helpers';
import { GenresProvider } from '../genres-context';


class App extends Component {
  state = {
    activeTab: 'Search',
    error: false,
    genres: [],
    query: '',
  };

  mdb = new TMDBService();

  componentDidMount() {
    this.mdb
      .getGenresList()
      .then((res) => {
        this.setState({ genres: res.genres });
      })
      .catch(this.handleError);
    this.mdb
      .getGuestSession()
      .then((res) => {
        if (res.success) {
          this.mdb.guestSessionId = res.guest_session_id;
          // console.log(`Guest session: ${res.guest_session_id}`);
        }
      })
      .catch(this.handleError);
  }

  handleChangeSearchText = (event) => {
    this.setState({ query: event.target.value });
  };

  handleError = (err) => {
    this.setState({ error: err.message });
  };

  render() {
    const { TabPane } = Tabs;
    const { activeTab, error, genres, query } = this.state;

    return (
      <div className="App">
        <GenresProvider value={genres}>
          <Tabs defaultActiveKey="1" onChange={callbackTab} className="Tabs">
            <TabPane tab="Search" key="1">
              <SearchField onChange={this.handleChangeSearchText} query={query} />
              <section className="search-results--wrap">
                <SearchResults error={error} query={query} mdb={this.mdb} />
              </section>
            </TabPane>

            <TabPane tab="Rated" key="2">
              Rated Pane (2) {activeTab === 'Search' ? null : '(active)'}
            </TabPane>
          </Tabs>
        </GenresProvider>
        <p className="attribution">
          About Movies App: &quot;This product uses the <a href="https://www.themoviedb.org/">TMDb</a> API but is not
          endorsed or certified by TMDb.&quot;
        </p>
      </div>
    );
  }
}

export default App;
