
class mapiService {
  apiBase = "https://api.themoviedb.org/3";

  apiLK = "51e27be0d3b2745e";

  apiRK = "cf2d11a387d3398b";

  async getResource(url) {
    const res = await fetch(
      `${this.apiBase}${url}?api_key=${this.apiLK}${this.apiRK}`
    );

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, received ${res.status}`);
    }

    const body = await res.json();
    return body;
  }
}

export default mapiService;