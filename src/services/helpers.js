const TEST = 'Kind of magic';

export function truncate(limit) {
  if (this.length <= limit) {
    return this;
  }
  const short = this.substr(0, limit - 1);
  return `${short.substr(0, short.lastIndexOf(' '))}…`;
}

export function debounce(fn, delay) {
  let inDebounce;
  return function deb(...args) {
    const context = this;
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => fn.apply(context, args), delay);
  };
}

export function callbackTab(key) {
  console.log(key);
}

export const rateClass = (rate) => {
  if (rate > 7) return 'rate-top';
  if (rate > 5) return 'rate-norm';
  if (rate > 3) return 'rate-poor';
  return 'rate-low';
}

export default TEST;