
export default class TMDBService {
  base = 'https://api.themoviedb.org/3';

  apiLK = '51e27be0d3b2745e';

  apiRK = 'cf2d11a387d3398b';

  key = '51e27be0d3b2745ecf2d11a387d3398b'; // `${this.apiLK}${this.apiRK}`;

  async ask(url, params = '', value = null) {
    const path = `${this.base}${url}?api_key=${this.key}${params}`;
    const data =
      value === null
        ? {}
        : {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify(value),
          };
    try {
      const res = await fetch(path, data);
      if (!res.ok) {
        throw new Error(`Could not fetch ${url}, received ${res.status}`);
      }
      const body = await res.json();
      return body;
    } catch (err) {
      throw new Error('Could not connect to remote site. Check you internet connection or try again later.');
      // 'Could not connect to remote site. Check you internet connection or try again later.'
    }
  }

  getMoviesPage(query, page) {
    return this.ask(`/search/movie`, `&query=${query}&page=${page}`);
  }

  getConfiguration() {
    return this.ask(`/configuration`);
  }

  getGenresList = async ()  => {
    const res = await this.ask('/genre/movie/list');
    return res.genres;
  }

  getGuestSession = async () => {
    const res = await this.ask('/authentication/guest_session/new');
    if (res.success) {
      this.guestSessionId = res.guest_session_id;
      return {
        id: res.guest_session_id,
        expires: res.expires_at
      };
    }
    return null;
    // { "success": true, "guest_session_id": "1ce82ec1223641636ad4a60b07de3581", "expires_at": "2016-08-27 16:26:40 UTC" }
  }

  getRatedMovies = async (gsId) => {
    const res = await this.ask(`/guest_session/${gsId}/rated/movies`);
    return { 
      items: res.results, 
      total: res.total_results 
    };
  }

  setMovieRate = async (movieId, rateValue) => {
    const data = { value: rateValue };
    const res = await this.ask(`/movie/${movieId}/rating`, `&guest_session_id=${this.guestSessionId}`, data);
    return {
      code: res.status_code,
      message: res.status_message
    }
    // { "status_code": 1, "status_message": "Success." }
  }
}


