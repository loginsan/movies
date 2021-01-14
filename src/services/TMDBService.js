class TMDBService {
  apiBase = 'https://api.themoviedb.org/3';

  apiLK = '51e27be0d3b2745e';

  apiRK = 'cf2d11a387d3398b';

  async getResource(url, paramStr = '') {
    const path = `${this.apiBase}${url}?api_key=${this.apiLK}${this.apiRK}${paramStr}`;
    console.log(path);

    const res = await fetch(path);

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, received ${res.status}`);
    }

    const body = await res.json();
    console.log('1');
    return body;
  }

  getMovies(query) {
    this.getResource(`/search/movie`, `&query=${query}`)
      .then((res) => {
        console.log('2');
        console.log(res);
      })
      .catch((err) => console.error(err));
  }
}

export default TMDBService;
