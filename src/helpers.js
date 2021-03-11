
function truncate(limit) {
  if (this.length <= limit) {
    return this;
  }
  const short = this.substr(0, limit - 1);
  return `${short.substr(0, short.lastIndexOf(' '))}…`;
}

const rateClass = (rate) => {
  if (rate > 7) return 'rate-top';
  if (rate > 5) return 'rate-norm';
  if (rate > 3) return 'rate-poor';
  return 'rate-low';
}

const reduceRated = (rated) => {
  const rateArray = rated.reduce((acc, cur) => {
    const { id, rating } = cur;
    acc[id] = rating;
    return acc;
  }, []);
  return rateArray;
}

const mapMoviesRating = (movies, ratings) => 
  movies.map((elem) => {
    const { id } = elem;
    const relem = elem;
    relem.rating = ratings[id] ? ratings[id] : 0;
    return relem;
  })

export const appTabs = {Search: '1', Rated: '2'};
export { rateClass, reduceRated, mapMoviesRating, truncate };