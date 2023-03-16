const BASE_URL = 'https://rickandmortyapi.com/api';

function wait(delay: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}

function get(url, add) {
  const fullURL = BASE_URL + url + add;
  return wait(300)
    .then(() => fetch(fullURL))
    .then(res => res.json());
}

export const getCharacters = (add) => get('/character', add);


