import React, {Component} from 'react';
import { Tabs } from 'antd';
import MovieList from '../MovieList';
import SearchField from '../SearchField';
import ErrorBoundary from '../ErrorBoundary';
import { renderLoad, renderError } from '../../subrenders';
import { appTabs } from '../../helpers';
import { APIService } from '../../services/TMDBService';
import { GenresProvider } from '../../genres-context';
import 'antd/dist/antd.css';
import './App.css';


export default class App extends Component {
  constructor(props) {
    super(props);
    this.searchListRef = React.createRef();
    this.ratedListRef = React.createRef();
    this.genres = [];
    this.state = {
      loading: true,
      error: false,
      activeTab: appTabs.Search,
      rated: [],
      query: '',
    };
    this.api = APIService;
  }

  componentDidMount() {
    this.initApp();
  }

  initApp = async () => {
    try {
      const genres = await this.initGenres();
      const session = await this.initSession();
      const ratedFilms = await this.initRated(session); 
      this.genres = genres;
      this.setState({ loading: false, rated: ratedFilms });
    } catch (err) {
      this.setState({ loading: false, error: err.message });
    }
  }

  checkRes = async (res, methodName, dataName, code = false) => {
    if (!res.ok) {
      throw new Error(`Could not fetch API ${methodName} request, received ${res.status}`);
    }
    const data = await res.json();
    const condition = !code? data.status_code : (data.status_code !== code);
    if (condition) {
      throw new Error(`Could not ${dataName}. ${data.status_message}`);
    }
    return data;
  }

  initGenres = async () => {
    const savedGenres = localStorage.getItem('genres');
    if (savedGenres === null) {
      const res = await this.api.getGenresList();
      const data = await this.checkRes(res, 'Genres', 'get Genres data');
      localStorage.setItem('genres', JSON.stringify(data.genres));
      return data.genres;
    }
    return JSON.parse(savedGenres);
  }

  initSession = async () => {
    const res = await this.api.getGuestSession();
    const data = await this.checkRes(res, 'Guest Session', 'init Guest Session');
    this.api.guestSessionId = data.guest_session_id;
    return data.guest_session_id;
  }

  initRated = async (gsId) => {
    const res = await this.api.getRatedMovies(gsId);
    const data = await this.checkRes(res, 'Get Rated Movies', 'get Rated Movies');
    return data.results;
  }

  handleQueryChange = (event) => {
    this.setState({ query: event.target.value });
  }

  handleTabChange = async (key) => {
    if (key === appTabs.Rated) {
      // const res = await this.api.getRatedMovies(this.api.guestSessionId);
      // const data = await this.checkRes(res, 'Get Rated Movies', 'get Rated Movies');
      this.setState({ activeTab: appTabs.Rated }); // , rated: data.results
    } else {
      this.setState({ activeTab: appTabs.Search });
    }
  }

  handleUpdate = async (query, pageNum) => {
    const res = await this.api.getMoviesPage(query, pageNum);
    const data = await this.checkRes(res, 'MoviesPage', 'get MoviesPage data');
    return data;
  }

  handleRate = async (id, movie, rateValue) => {
    const res = await this.api.setMovieRate(id, rateValue);
    const data = await this.checkRes(res, 'Rate Movie', 'Rate Movie', 1);
    const rmovie = movie;
    rmovie.rating = rateValue;
    this.setState(({ rated }) => ({ rated: [...rated, rmovie] }));
    return data;
  }

  handleUnrate = async (id) => {
    const { activeTab } = this.state;
    if (activeTab === appTabs.Search) { return false }
    const res = await this.api.deleteRating(id);
    const data = await this.checkRes(res, 'Delete Rating', 'Delete Rating', 13);
    this.setState(({ rated }) => ({ rated: rated.filter(elem => elem.id !== id) }));
    this.searchListRef.current.handleRefresh(id);
    return data;
  }

  render() {
    const { TabPane } = Tabs;
    const { loading, error, rated, query } = this.state;

    const renderTabs = !error && !loading && (
      <div className="tabs-wrap">
        <Tabs defaultActiveKey={appTabs.Search} onChange={this.handleTabChange} className="Tabs">
          <TabPane tab="Search" key={appTabs.Search}>
            <SearchField onChange={this.handleQueryChange} query={query} />
            <ErrorBoundary>
              <MovieList
                tab={appTabs.Search}
                query={query}
                onUpdate={this.handleUpdate}
                onRate={this.handleRate}
                rated={rated}
                ref={this.searchListRef}
              />
            </ErrorBoundary>
          </TabPane>

          <TabPane tab="Rated" key={appTabs.Rated}>
            <ErrorBoundary>
              <MovieList tab={appTabs.Rated} onUnrate={this.handleUnrate} rated={rated} ref={this.ratedListRef} />
            </ErrorBoundary>
          </TabPane>
        </Tabs>
      </div>
    );

    return (
      <GenresProvider value={this.genres}>
        <div className="App">
          {renderError(error)}
          {renderLoad(loading, 'Стартуем приложение, загружаем данные…')}
          {renderTabs}
          <p className="attribution">{process.env.REACT_APP_ABOUT}</p>
        </div>
      </GenresProvider>
    );
  }
}
