
export default class TMDBService {
  
  base = 'https://api.themoviedb.org/3';

  apiLK = '51e27be0d3b2745e';

  apiRK = 'cf2d11a387d3398b';

  key = `${this.apiLK}${this.apiRK}`;

 
  async ask(url, paramStr = '') {
    
    const path = `${this.base}${url}?api_key=${this.key}${paramStr}`;
    const res = await fetch(path);

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, received ${res.status}`);
    }
    const body = await res.json();
    return body;
  }

  getMovies(query) {
    return this.ask(`/search/movie`, `&query=${query}`);
  }

  getConfiguration() {
    return this.ask(`/configuration`);
  }

  getGenresList() {
    return this.ask('/genre/movie/list');
  }
}
