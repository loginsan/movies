
export default class TMDBService {
  base = process.env.REACT_APP_API_URL;

  endURL(endpoint, params = '') {
    return `${this.base}${endpoint}?api_key=${process.env.REACT_APP_API_KEY}${params}`;
  }

  async ask(url, method = 'get', value = null) {
    const data = {};
    if (method === 'post') {
      data.method = 'POST';
      data.headers = {'Content-Type': 'application/json;charset=utf-8'};
      data.body = JSON.stringify(value);
    }
    if (method === 'delete') {
      data.method = 'DELETE';
    }
    const res = await fetch(url, data);
    return res;
    // try {
    //   const res = await fetch(url, data);
    //   if (!res.ok) {
    //     throw new Error(`Could not fetch API request, received ${res.status}`);
    //   }
    //   const body = await res.json();
    //   return body;
    // } catch (err) {
    //   throw new Error(err);
    //   // 'Could not connect to remote site. Check you internet connection or try again later.'
    // }
  }

  getMoviesPage(query, page) {
    const url = this.endURL('/search/movie', `&query=${query}&page=${page}`);
    return this.ask(url);
  }

  getConfiguration() {
    const url = this.endURL('/configuration');
    return this.ask(url);
  }

  getGenresList = async () => {
    const url = this.endURL('/genre/movie/list');
    const res = await this.ask(url);
    return res;
  }

  getGuestSession = async () => {
    const url = this.endURL('/authentication/guest_session/new');
    const res = await this.ask(url);
    return res;
  }

  getRatedMovies = async (gsId) => {
    const url = this.endURL(`/guest_session/${gsId}/rated/movies`);
    const res = await this.ask(url);
    return res
    // try {
    //   const res = await this.ask(url);
    //   return {
    //     owner: gsId,
    //     items: res.results,
    //     total: res.total_results,
    //   };
    // } catch (err) {
    //   throw new Error(err.message);
    // }
  }

  setMovieRate = async (movieId, rateValue) => {
    const url = this.endURL(`/movie/${movieId}/rating`, `&guest_session_id=${this.guestSessionId}`);
    const res = await this.ask(url, 'post', { value: rateValue });
    return res;
    // return {
    //   code: res.status_code, // { "status_code": 1, "status_message": "Success." }
    //   message: res.status_message,
    // };
  }

  deleteRating = async (movieId) => {
    const url = this.endURL(`/movie/${movieId}/rating`, `&guest_session_id=${this.guestSessionId}`);
    const res = await this.ask(url, 'delete');
    return res;
    // return {
    //   code: res.status_code, // 13
    //   message: res.status_message,
    // };
  }
}

export const APIService = new TMDBService();
