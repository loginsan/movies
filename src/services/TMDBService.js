class TMDBService {
  apiBase = 'https://api.themoviedb.org/3';

  apiLK = '51e27be0d3b2745e';

  apiRK = 'cf2d11a387d3398b';

  apiKey = '51e27be0d3b2745ecf2d11a387d3398b';

  async getResource(url, paramStr = '') {
    const path = `${this.apiBase}${url}?api_key=${this.apiLK}${this.apiRK}${paramStr}`;

    const res = await fetch(path);

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, received ${res.status}`);
    };

    const body = await res.json();

    return body;
  }

  getMovies(query) {
    return this.getResource(`/search/movie`, `&query=${query}`);
  }
}

export default TMDBService;
