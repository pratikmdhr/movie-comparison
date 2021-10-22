const autoCompleteConfig = {
  renderOption(movie) {
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
    return `
  <img src="${imgSrc}"/>
  <h1>${movie.Title} (${movie.Year})</h1>
  `;
  },

  inputValue(movie) {
    return movie.Title;
  },
  async fetchData(searchTerm) {
    const response = await axios.get('http://www.omdbapi.com/', {
      params: {
        apikey: 'd1bd47d5',
        s: searchTerm,
      },
    });

    if (response.data.Error) {
      return [];
    }
    return response.data.Search;
  },
};

createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector('#left-autocomplete'),
  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, 'left');
  },
});
createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector('#right-autocomplete'),
  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, 'right');
  },
});

let leftMovie;
let rightMovie;

const onMovieSelect = async (movie, side) => {
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: 'd1bd47d5',
      i: movie.imdbID,
    },
  });
  document.querySelector(`#${side}-summary`).innerHTML = movieTemplate(
    response.data
  );
  if (side === 'left') {
    leftMovie = response.data;
  }
  if (side === 'right') {
    rightMovie = response.data;
  }

  if (leftMovie && rightMovie) {
    runComparison();
  }
};

const runComparison = () => {
  const leftSideStats = document.querySelectorAll(
    '#left-summary .notification'
  );
  const rightSideStats = document.querySelectorAll(
    '#right-summary .notification'
  );

  leftSideStats.forEach((leftStat, i) => {
    const rightStat = rightSideStats[i];

    if (
      parseFloat(leftStat.dataset.value) > parseFloat(rightStat.dataset.value)
    ) {
      rightStat.classList.remove('is-primary');
      rightStat.classList.add('is-warning');
      leftStat.classList.remove('is-warning');
      leftStat.classList.add('is-primary');
    } else {
      leftStat.classList.remove('is-primary');
      leftStat.classList.add('is-warning');
      rightStat.classList.remove('is-warning');
      rightStat.classList.add('is-primary');
    }
  });
};

const movieTemplate = (movieDetail) => {
  const dollars = +movieDetail.BoxOffice.slice(1).replace(/,/g, '');
  const metascore = +movieDetail.Metascore;
  const imdbRating = parseFloat(movieDetail.imdbRating);
  const imdbVotes = +movieDetail.imdbVotes.replace(/,/g, '');
  const awards = movieDetail.Awards.split(' ').reduce((prev, el) => {
    const awardNum = +el;
    if (isNaN(awardNum)) {
      return prev;
    } else {
      return prev + awardNum;
    }
  }, 0);

  return `
  <article class="media">
    <figure class="media-left">
      <p class="image">
        <img src="${movieDetail.Poster}" />
      </p>
    </figure>
    <div class="media-content">
      <div class="content">
        <h1>${movieDetail.Title}</h1>
        <h4>${movieDetail.Genre}</h4>
        <p>${movieDetail.Plot}</p>
      </div>
    </div>
  </article>

  <article data-value=${awards} class="notification is-primary">
    <p class="title">${movieDetail.Awards}</p>
    <p class="subtitle">Awards</p>
  </article>

  <article data-value=${dollars} class="notification is-primary">
    <p class="title">${movieDetail.BoxOffice}</p>
    <p class="subtitle">BoxOffice</p>
  </article>

  <article data-value=${metascore} class="notification is-primary">
    <p class="title">${movieDetail.Metascore}</p>
    <p class="subtitle">Metascore</p>
  </article>

  <article data-value=${imdbRating} class="notification is-primary">
    <p class="title">${movieDetail.imdbRating}</p>
    <p class="subtitle">IMDB Rating</p>
  </article>

  <article data-value=${imdbVotes} class="notification is-primary">
    <p class="title">${movieDetail.imdbVotes}</p>
    <p class="subtitle">IMDB Votes</p>
  </article>

  
  `;
};
