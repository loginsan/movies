import React, {Component} from 'react';
import { Tabs } from 'antd';
import MovieList from '../MovieList';
import SearchField from '../SearchField';
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
    this.state = {
      error: false,
      loading: true,
      genres: [],
      rated: {},
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

  initGenres = async () => {
    const savedGenres = localStorage.getItem('genres');
    if (savedGenres === null) {
      const genres = await this.api.getGenresList();
      localStorage.setItem('genres', JSON.stringify(genres));
      return genres;
    }
    return JSON.parse(savedGenres);
  };

  initSession = async () => {
    const newSession = await this.api.getGuestSession();
    return newSession;
  };

  initRated = async (gsId) => {
    const newRated = await this.api.getRatedMovies(gsId);
    return newRated;
  };

  handleQueryChange = (event) => {
    this.setState({ query: event.target.value });
  };

  handleTabChange = async (key) => {
    // this.setState({ activeTab: key });
    if (key === appTabs.Rated) {
      const rated = await this.api.getRatedMovies(this.api.guestSessionId);
      this.setState({ rated });
    }
  };

  handleUpdate = async (query, pageNum) => {
    const res = await this.api.getMoviesPage(query, pageNum);
    return res
  }

  handleRate = async (id, movie, rateValue) => {
    const res = await this.api.setMovieRate(id, rateValue);
    const rmovie = movie;
    if (res.code === 1) {
      rmovie.rating = rateValue;
      this.setState(({ rated }) => ({
        rated: {
          items: [...rated.items, rmovie],
          total: rated.total + 1,
        },
      }));
      return true;
    }
    return false;
  };

  handleUnrate = async (id) => {
    const res = await this.api.deleteRating(id);
    if (res.code === 13) {
      this.setState(({ rated }) => ({
        rated: {
          items: rated.items.filter((elem) => elem.id !== id),
          total: rated.total - 1,
        },
      }));
      this.searchListRef.current.handleRefresh(id);
      return true;
    }
    return false;
  };

  render() {
    const { TabPane } = Tabs;
    const { error, loading, genres, rated, query } = this.state;

    const renderTabs = !error && !loading && (
      <div className="tabs-wrap">
        <Tabs defaultActiveKey={appTabs.Search} onChange={this.handleTabChange} className="Tabs">
          <TabPane tab="Search" key={appTabs.Search}>
            <SearchField onChange={this.handleQueryChange} query={query} />
            <section className="results">
              <MovieList
                tab={appTabs.Search}
                query={query}
                onUpdate={this.handleUpdate}
                onRate={this.handleRate}
                onUnrate={this.handleUnrate}
                rated={rated}
                ref={this.searchListRef}
              />
            </section>
          </TabPane>

          <TabPane tab="Rated" key={appTabs.Rated}>
            <section className="results">
              <MovieList
                tab={appTabs.Rated}
                query={query}
                onUpdate={this.handleUpdate}
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
          {renderTabs}
          <p className="attribution">{process.env.REACT_APP_ABOUT}</p>
        </div>
      </GenresProvider>
    );
  }
}
